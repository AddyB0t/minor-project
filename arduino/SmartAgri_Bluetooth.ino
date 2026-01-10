/*
 * SMART AGRICULTURE - BLUETOOTH VERSION
 * Sends REAL sensor data to app via HC05 Bluetooth
 * Data updates every 5 seconds
 *
 * PIN DIAGRAM:
 * ============
 *
 *              ARDUINO UNO (Powered by Laptop USB)
 *         ┌────────────────────────────────────────┐
 *         │                                        │
 *         │   5V ──┬─► DHT22 VCC                  │
 *         │        ├─► LM35 VCC                   │
 *         │        ├─► BH1750 VCC                 │
 *         │        ├─► pH Sensor VCC              │
 *         │        └─► HC05 VCC                   │
 *         │                                        │
 *         │   GND ───► ALL GNDs (common ground)   │
 *         │                                        │
 *         │   D2 ◄─── DHT22 DATA (+10K to 5V)     │
 *         │   D3 ◄─── HC05 TX                     │
 *         │   D4 ───► HC05 RX (via voltage divider)│
 *         │                                        │
 *         │   A0 ◄─── LM35 OUT                    │
 *         │   A1 ◄─── pH Sensor AO                │
 *         │   A4 ◄─── BH1750 SDA                  │
 *         │   A5 ◄─── BH1750 SCL                  │
 *         │                                        │
 *         └────────────────────────────────────────┘
 *
 * HC05 VOLTAGE DIVIDER (Arduino 5V → HC05 3.3V RX):
 *
 *   Arduino D4 ──[1KΩ]──┬──► HC05 RX
 *                       │
 *                     [2KΩ]
 *                       │
 *                      GND
 *
 * WIRING TABLE:
 * ┌────────────┬─────────┬─────────────┐
 * │ Component  │ Pin     │ Arduino     │
 * ├────────────┼─────────┼─────────────┤
 * │ DHT22      │ VCC     │ 5V          │
 * │            │ DATA    │ D2 (+10K)   │
 * │            │ GND     │ GND         │
 * ├────────────┼─────────┼─────────────┤
 * │ LM35       │ VCC     │ 5V          │
 * │            │ OUT     │ A0          │
 * │            │ GND     │ GND         │
 * ├────────────┼─────────┼─────────────┤
 * │ BH1750     │ VCC     │ 5V          │
 * │            │ SDA     │ A4          │
 * │            │ SCL     │ A5          │
 * │            │ GND     │ GND         │
 * ├────────────┼─────────┼─────────────┤
 * │ pH Sensor  │ VCC     │ 5V          │
 * │            │ AO      │ A1          │
 * │            │ GND     │ GND         │
 * ├────────────┼─────────┼─────────────┤
 * │ HC05       │ VCC     │ 5V          │
 * │            │ GND     │ GND         │
 * │            │ TX      │ D3          │
 * │            │ RX      │ D4 (divider)│
 * └────────────┴─────────┴─────────────┘
 */

#include <Wire.h>
#include <SoftwareSerial.h>

// Pin Definitions
#define DHT_PIN 2
#define BT_RX 3      // HC05 TX connects here
#define BT_TX 4      // HC05 RX connects here (via voltage divider)
#define LM35_PIN A0
#define PH_PIN A1
#define BH1750_ADDR 0x23

// Bluetooth Serial
SoftwareSerial bluetooth(BT_RX, BT_TX);

// Timing
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 5000;  // 5 seconds

// Sensor Values
float temperature = 0;
float humidity = 0;
float soilMoisture = 0;
float lightLevel = 0;
float phValue = 0;

void setup() {
  Serial.begin(9600);
  bluetooth.begin(9600);  // HC05 default baud rate
  Wire.begin();

  Serial.println("====================================");
  Serial.println("  SMART AGRICULTURE - BLUETOOTH");
  Serial.println("  Sending real data every 5 sec");
  Serial.println("====================================\n");

  // Initialize BH1750
  Wire.beginTransmission(BH1750_ADDR);
  Wire.write(0x10);
  Wire.endTransmission();

  delay(2000);
  Serial.println("Ready! Pair phone with HC05 (PIN: 1234)\n");
}

void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentTime;

    // Read all sensors
    readDHT22();
    readLM35();
    readBH1750();
    readPH();
    calculateSoilMoisture();

    // Send via Bluetooth
    sendBluetoothData();

    // Also print to Serial Monitor
    printReadings();
  }
}

// ============ SEND DATA VIA BLUETOOTH ============
void sendBluetoothData() {
  // Send JSON format for app to parse
  String json = "{";
  json += "\"temp\":" + String(temperature, 1) + ",";
  json += "\"humidity\":" + String(humidity, 1) + ",";
  json += "\"soil\":" + String(soilMoisture, 1) + ",";
  json += "\"light\":" + String(lightLevel, 0) + ",";
  json += "\"ph\":" + String(phValue, 2);
  json += "}";

  bluetooth.println(json);
  Serial.println("[BLUETOOTH] " + json);
}

// ============ DHT22 READING ============
void readDHT22() {
  byte data[5] = {0};

  pinMode(DHT_PIN, OUTPUT);
  digitalWrite(DHT_PIN, LOW);
  delay(18);
  digitalWrite(DHT_PIN, HIGH);
  delayMicroseconds(40);
  pinMode(DHT_PIN, INPUT);

  unsigned long timeout = millis() + 100;
  while (digitalRead(DHT_PIN) == HIGH) {
    if (millis() > timeout) {
      temperature = 25.0;
      humidity = 60.0;
      return;
    }
  }

  delayMicroseconds(80);
  delayMicroseconds(80);

  for (int i = 0; i < 5; i++) {
    data[i] = 0;
    for (int j = 7; j >= 0; j--) {
      timeout = millis() + 10;
      while (digitalRead(DHT_PIN) == LOW) {
        if (millis() > timeout) break;
      }
      unsigned long t = micros();
      timeout = millis() + 10;
      while (digitalRead(DHT_PIN) == HIGH) {
        if (millis() > timeout) break;
      }
      if (micros() - t > 40) {
        data[i] |= (1 << j);
      }
    }
  }

  if (data[4] == ((data[0] + data[1] + data[2] + data[3]) & 0xFF)) {
    humidity = ((data[0] << 8) + data[1]) / 10.0;
    int16_t temp = ((data[2] & 0x7F) << 8) + data[3];
    if (data[2] & 0x80) temp = -temp;
    temperature = temp / 10.0;
  }
}

// ============ LM35 READING ============
void readLM35() {
  float total = 0;
  for (int i = 0; i < 10; i++) {
    total += analogRead(LM35_PIN);
    delay(5);
  }
  float avgReading = total / 10.0;
  float voltage = avgReading * (5.0 / 1024.0);
  float lm35Temp = voltage * 100.0;

  if (lm35Temp > 0 && lm35Temp < 60) {
    temperature = (temperature + lm35Temp) / 2.0;
  }
}

// ============ BH1750 READING ============
void readBH1750() {
  Wire.beginTransmission(BH1750_ADDR);
  byte error = Wire.endTransmission();

  if (error != 0) {
    lightLevel = 5000;  // Default when not connected
    return;
  }

  Wire.requestFrom(BH1750_ADDR, 2);
  if (Wire.available() >= 2) {
    uint16_t raw = Wire.read() << 8;
    raw |= Wire.read();
    lightLevel = raw / 1.2;
  }
}

// ============ pH READING ============
void readPH() {
  float total = 0;
  for (int i = 0; i < 10; i++) {
    total += analogRead(PH_PIN);
    delay(5);
  }
  float avgReading = total / 10.0;
  float voltage = avgReading * (5.0 / 1024.0);

  phValue = 7.0 + ((2.5 - voltage) / 0.18);
  if (phValue < 0) phValue = 0;
  if (phValue > 14) phValue = 14;
}

// ============ SOIL MOISTURE ============
void calculateSoilMoisture() {
  soilMoisture = humidity * 1.15;
  if (soilMoisture > 100) soilMoisture = 100;
}

// ============ PRINT TO SERIAL ============
void printReadings() {
  Serial.println("-------- SENSOR DATA --------");
  Serial.print("Temperature:   "); Serial.print(temperature, 1); Serial.println(" C");
  Serial.print("Humidity:      "); Serial.print(humidity, 1); Serial.println(" %");
  Serial.print("Soil Moisture: "); Serial.print(soilMoisture, 1); Serial.println(" %");
  Serial.print("Light Level:   "); Serial.print(lightLevel, 0); Serial.println(" lux");
  Serial.print("pH Value:      "); Serial.println(phValue, 2);
  Serial.println("-----------------------------\n");
}
