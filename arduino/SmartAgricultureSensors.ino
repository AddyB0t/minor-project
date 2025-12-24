/*
 * Smart Agriculture Sensor System
 * For: Smart Agriculture App Minor Project
 *
 * Components:
 * - Arduino Uno
 * - DHT22 (Temperature & Humidity)
 * - LM35 (Temperature backup)
 * - BH1750 (Light Sensor)
 * - pH Sensor Module
 * - ESP8266 (WiFi)
 *
 * Wiring:
 * - DHT22: VCC→5V, GND→GND, DATA→D2 (with 10K pull-up)
 * - LM35: VCC→5V, GND→GND, OUT→A0
 * - BH1750: VCC→5V, GND→GND, SDA→A4, SCL→A5
 * - pH Sensor: VCC→5V, GND→GND, AO→A1
 * - ESP8266: VCC→3.3V, GND→GND, TX→D4, RX→D3 (voltage divider!)
 */

#include <Wire.h>
#include <SoftwareSerial.h>

// ============ PIN DEFINITIONS ============
#define DHT22_PIN 2        // DHT22 data pin
#define LM35_PIN A0        // LM35 analog pin
#define PH_SENSOR_PIN A1   // pH sensor analog pin
#define ESP_RX 4           // ESP8266 TX connects here
#define ESP_TX 3           // ESP8266 RX connects here (via voltage divider)

// ============ BH1750 I2C ADDRESS ============
#define BH1750_ADDRESS 0x23

// ============ SOFTWARE SERIAL FOR ESP8266 ============
SoftwareSerial espSerial(ESP_RX, ESP_TX);

// ============ DHT22 VARIABLES ============
// Simple DHT22 reading without library
float dht_temperature = 0;
float dht_humidity = 0;

// ============ SENSOR DATA STRUCTURE ============
struct SensorData {
  float temperature;      // from DHT22
  float humidity;         // from DHT22
  float lm35_temperature; // from LM35 (backup)
  float light_level;      // from BH1750 (lux)
  float soil_moisture;    // simulated from humidity correlation
  float ph_value;         // from pH sensor
};

SensorData sensors;

// ============ TIMING ============
unsigned long lastReadTime = 0;
const unsigned long READ_INTERVAL = 5000; // Read every 5 seconds

// ============ SETUP ============
void setup() {
  // Initialize Serial for debugging
  Serial.begin(9600);
  Serial.println("Smart Agriculture Sensor System Starting...");

  // Initialize ESP8266 Serial
  espSerial.begin(115200);
  delay(1000);

  // Initialize I2C for BH1750
  Wire.begin();

  // Initialize BH1750
  initBH1750();

  // Set DHT22 pin
  pinMode(DHT22_PIN, INPUT);

  Serial.println("All sensors initialized!");
  Serial.println("================================");
  delay(2000);
}

// ============ MAIN LOOP ============
void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastReadTime >= READ_INTERVAL) {
    lastReadTime = currentTime;

    // Read all sensors
    readDHT22();
    readLM35();
    readBH1750();
    readPHSensor();
    calculateSoilMoisture();

    // Print to Serial Monitor
    printSensorData();

    // Send to ESP8266
    sendToESP8266();
  }
}

// ============ DHT22 READING ============
void readDHT22() {
  // Simple DHT22 reading implementation
  // For reliable reading, use DHT library: #include <DHT.h>

  byte data[5];

  // Send start signal
  pinMode(DHT22_PIN, OUTPUT);
  digitalWrite(DHT22_PIN, LOW);
  delay(18);
  digitalWrite(DHT22_PIN, HIGH);
  delayMicroseconds(40);
  pinMode(DHT22_PIN, INPUT);

  // Wait for response
  unsigned long timeout = micros() + 100;
  while (digitalRead(DHT22_PIN) == HIGH) {
    if (micros() > timeout) {
      Serial.println("DHT22 timeout - using default values");
      dht_temperature = 25.0;
      dht_humidity = 60.0;
      sensors.temperature = dht_temperature;
      sensors.humidity = dht_humidity;
      return;
    }
  }

  // Read 40 bits of data
  for (int i = 0; i < 5; i++) {
    data[i] = 0;
    for (int j = 7; j >= 0; j--) {
      // Wait for high
      timeout = micros() + 100;
      while (digitalRead(DHT22_PIN) == LOW) {
        if (micros() > timeout) break;
      }

      // Measure high time
      unsigned long highStart = micros();
      timeout = micros() + 100;
      while (digitalRead(DHT22_PIN) == HIGH) {
        if (micros() > timeout) break;
      }

      // If high > 30us, it's a 1
      if (micros() - highStart > 30) {
        data[i] |= (1 << j);
      }
    }
  }

  // Verify checksum
  if (data[4] == ((data[0] + data[1] + data[2] + data[3]) & 0xFF)) {
    // Calculate humidity (16 bits)
    dht_humidity = ((data[0] << 8) + data[1]) / 10.0;

    // Calculate temperature (16 bits, can be negative)
    int16_t temp = ((data[2] & 0x7F) << 8) + data[3];
    if (data[2] & 0x80) temp = -temp;
    dht_temperature = temp / 10.0;
  }

  sensors.temperature = dht_temperature;
  sensors.humidity = dht_humidity;
}

// ============ LM35 READING ============
void readLM35() {
  // LM35 outputs 10mV per degree Celsius
  int analogValue = analogRead(LM35_PIN);

  // Convert: (analogValue / 1024) * 5000mV / 10mV per degree
  float voltage = analogValue * (5.0 / 1024.0);
  sensors.lm35_temperature = voltage * 100.0;

  // Average with DHT22 for more accuracy
  if (sensors.lm35_temperature > 0 && sensors.lm35_temperature < 100) {
    sensors.temperature = (sensors.temperature + sensors.lm35_temperature) / 2.0;
  }
}

// ============ BH1750 INITIALIZATION ============
void initBH1750() {
  Wire.beginTransmission(BH1750_ADDRESS);
  Wire.write(0x10); // Continuous high-res mode
  Wire.endTransmission();
  delay(200);
}

// ============ BH1750 READING ============
void readBH1750() {
  Wire.beginTransmission(BH1750_ADDRESS);
  Wire.requestFrom(BH1750_ADDRESS, 2);

  if (Wire.available() >= 2) {
    uint16_t lightLevel = Wire.read() << 8;
    lightLevel |= Wire.read();

    // Convert to lux
    sensors.light_level = lightLevel / 1.2;
  } else {
    sensors.light_level = 0;
  }
  Wire.endTransmission();
}

// ============ pH SENSOR READING ============
void readPHSensor() {
  // Read analog value
  int analogValue = analogRead(PH_SENSOR_PIN);

  // Convert to voltage (0-5V)
  float voltage = analogValue * (5.0 / 1024.0);

  // pH calculation (calibration needed for accuracy)
  // Typical pH sensor: pH = 7 + ((2.5 - voltage) / 0.18)
  // Adjust these values based on your calibration
  sensors.ph_value = 7.0 + ((2.5 - voltage) / 0.18);

  // Clamp to valid pH range
  if (sensors.ph_value < 0) sensors.ph_value = 0;
  if (sensors.ph_value > 14) sensors.ph_value = 14;
}

// ============ SOIL MOISTURE CALCULATION ============
void calculateSoilMoisture() {
  // Since you don't have a dedicated soil moisture sensor,
  // we'll estimate based on humidity and other factors
  // In real implementation, add a capacitive soil moisture sensor to A2

  // Simulated soil moisture (correlates with air humidity)
  sensors.soil_moisture = sensors.humidity * 1.1;
  if (sensors.soil_moisture > 100) sensors.soil_moisture = 100;
  if (sensors.soil_moisture < 0) sensors.soil_moisture = 0;
}

// ============ PRINT SENSOR DATA ============
void printSensorData() {
  Serial.println("========== SENSOR READINGS ==========");
  Serial.print("Temperature (DHT22):  ");
  Serial.print(sensors.temperature);
  Serial.println(" °C");

  Serial.print("Temperature (LM35):   ");
  Serial.print(sensors.lm35_temperature);
  Serial.println(" °C");

  Serial.print("Humidity:             ");
  Serial.print(sensors.humidity);
  Serial.println(" %");

  Serial.print("Soil Moisture:        ");
  Serial.print(sensors.soil_moisture);
  Serial.println(" %");

  Serial.print("Light Level:          ");
  Serial.print(sensors.light_level);
  Serial.println(" lux");

  Serial.print("pH Value:             ");
  Serial.println(sensors.ph_value);

  Serial.println("=====================================\n");
}

// ============ SEND DATA TO ESP8266 ============
void sendToESP8266() {
  // Create JSON string for ESP8266
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(sensors.temperature, 1) + ",";
  jsonData += "\"humidity\":" + String(sensors.humidity, 1) + ",";
  jsonData += "\"soil_moisture\":" + String(sensors.soil_moisture, 1) + ",";
  jsonData += "\"light_level\":" + String(sensors.light_level, 1) + ",";
  jsonData += "\"ph_value\":" + String(sensors.ph_value, 2);
  jsonData += "}";

  // Send to ESP8266
  espSerial.println(jsonData);

  Serial.print("Sent to ESP8266: ");
  Serial.println(jsonData);
}

/*
 * ============ CALIBRATION NOTES ============
 *
 * pH Sensor Calibration:
 * 1. Place probe in pH 7.0 buffer solution
 * 2. Note the voltage reading
 * 3. Place probe in pH 4.0 buffer solution
 * 4. Note the voltage reading
 * 5. Calculate: slope = (7.0 - 4.0) / (V7 - V4)
 * 6. Update formula: pH = 7.0 + ((V7 - voltage) * slope)
 *
 * BH1750 Light Levels (lux):
 * - Dark room: 0-10 lux
 * - Cloudy day: 1000-2000 lux
 * - Sunny day: 10000-25000 lux
 * - Direct sunlight: 32000-100000 lux
 *
 * DHT22 Specifications:
 * - Temperature: -40°C to 80°C (±0.5°C)
 * - Humidity: 0-100% RH (±2-5%)
 *
 * LM35 Specifications:
 * - Temperature: -55°C to 150°C (±0.5°C)
 * - Output: 10mV/°C
 */
