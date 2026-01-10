/*
 * SMART AGRICULTURE - DIRECT SERIAL
 * Arduino sends data via USB Serial → Node.js reads it → App displays it
 * All on the same laptop!
 *
 * PIN DIAGRAM:
 * ============
 *
 *              ARDUINO UNO (USB to Laptop)
 *         ┌────────────────────────────────┐
 *         │                                │
 *         │   5V ──┬─► DHT22 VCC          │
 *         │        ├─► LM35 VCC           │
 *         │        ├─► BH1750 VCC         │
 *         │        └─► pH Sensor VCC      │
 *         │                                │
 *         │   GND ───► ALL GNDs           │
 *         │                                │
 *         │   D2 ◄─── DHT22 DATA          │
 *         │          (+10K resistor to 5V) │
 *         │                                │
 *         │   A0 ◄─── LM35 OUT            │
 *         │   A1 ◄─── pH Sensor AO        │
 *         │   A4 ◄─── BH1750 SDA          │
 *         │   A5 ◄─── BH1750 SCL          │
 *         │                                │
 *         │   USB ───► LAPTOP             │
 *         └────────────────────────────────┘
 *
 * NO WIFI NEEDED! NO BLUETOOTH NEEDED!
 * Just USB connection to laptop.
 */

#include <Wire.h>

// Pin Definitions
#define DHT_PIN 2
#define LM35_PIN A0
#define PH_PIN A1
#define BH1750_ADDR 0x23

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
  Wire.begin();

  // Initialize BH1750
  Wire.beginTransmission(BH1750_ADDR);
  Wire.write(0x10);
  Wire.endTransmission();

  delay(2000);
  Serial.println("READY");
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

    // Send JSON via Serial (Node.js will read this)
    sendData();
  }
}

// Send JSON data
void sendData() {
  Serial.print("{");
  Serial.print("\"temperature\":");
  Serial.print(temperature, 1);
  Serial.print(",\"humidity\":");
  Serial.print(humidity, 1);
  Serial.print(",\"soil_moisture\":");
  Serial.print(soilMoisture, 1);
  Serial.print(",\"light_level\":");
  Serial.print(lightLevel, 0);
  Serial.print(",\"ph_value\":");
  Serial.print(phValue, 2);
  Serial.println("}");
}

// DHT22 Reading
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

// LM35 Reading
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

// BH1750 Reading
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

// pH Reading
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

// Soil Moisture (estimated)
void calculateSoilMoisture() {
  soilMoisture = humidity * 1.15;
  if (soilMoisture > 100) soilMoisture = 100;
}
