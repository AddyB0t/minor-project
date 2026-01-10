/*
 * SMART AGRICULTURE - FINAL CODE
 * All sensors combined, sends to app every 5 seconds
 *
 * SENSORS:
 * - DHT22: Temperature & Humidity
 * - BH1750: Light Level
 * - pH Sensor: Soil pH
 * - Soil Moisture: Estimated from humidity (or add real sensor to A1)
 *
 * PIN DIAGRAM:
 * ┌────────────────────────────────────────┐
 * │            ARDUINO UNO                 │
 * │                                        │
 * │   5V ──┬─► DHT22 VCC                  │
 * │        ├─► BH1750 VCC                 │
 * │        └─► pH Sensor VCC              │
 * │                                        │
 * │   GND ──┬─► DHT22 GND                 │
 * │         ├─► BH1750 GND                │
 * │         └─► pH Sensor GND             │
 * │                                        │
 * │   D2 ◄──── DHT22 DATA (+10K to 5V)    │
 * │                                        │
 * │   A3 ◄──── pH Sensor PO               │
 * │                                        │
 * │   A4 ◄──── BH1750 SDA                 │
 * │   A5 ◄──── BH1750 SCL                 │
 * │                                        │
 * │   USB ════► Laptop (node server.js)   │
 * └────────────────────────────────────────┘
 */

#include <Wire.h>

// ============ PIN DEFINITIONS ============
#define DHT_PIN 2
#define PH_PIN A3
#define BH1750_ADDR 0x23

// ============ pH CALIBRATION (Single-point at pH 7) ============
#define VREF 5.0
#define ADC_RES 1023.0
float voltage_pH7 = 1.085;  // Calibrated voltage at pH 7

// ============ pH FILTER ARRAYS ============
#define MEDIAN_SAMPLES 7
#define AVG_SAMPLES 15
int medianArray[MEDIAN_SAMPLES];
int avgArray[AVG_SAMPLES];
int avgIndex = 0;
long avgSum = 0;

// ============ TIMING ============
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 5000;  // 5 seconds

// ============ SENSOR VALUES ============
float temperature = 0;
float humidity = 0;
float lightLevel = 0;
float phValue = 0;
float soilMoisture = 0;

void setup() {
  Serial.begin(9600);
  Wire.begin();

  // Initialize pH average array
  for (int i = 0; i < AVG_SAMPLES; i++) avgArray[i] = 0;

  // Initialize BH1750
  Wire.beginTransmission(BH1750_ADDR);
  Wire.write(0x10);  // Continuous high-res mode
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
    readBH1750();
    readPH();
    calculateSoilMoisture();

    // Send JSON to Serial (Node.js server reads this)
    sendData();
  }
}

// ============ SEND DATA AS JSON ============
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

// ============ DHT22 READING ============
void readDHT22() {
  byte data[5] = {0};

  // Start signal
  pinMode(DHT_PIN, OUTPUT);
  digitalWrite(DHT_PIN, LOW);
  delay(18);
  digitalWrite(DHT_PIN, HIGH);
  delayMicroseconds(40);
  pinMode(DHT_PIN, INPUT);

  // Wait for response
  unsigned long timeout = millis() + 100;
  while (digitalRead(DHT_PIN) == HIGH) {
    if (millis() > timeout) {
      // Timeout - use last values or defaults
      if (temperature == 0) temperature = 25.0;
      if (humidity == 0) humidity = 60.0;
      return;
    }
  }

  // Skip response pulses
  delayMicroseconds(80);
  delayMicroseconds(80);

  // Read 40 bits of data
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

  // Verify checksum and extract values
  if (data[4] == ((data[0] + data[1] + data[2] + data[3]) & 0xFF)) {
    humidity = ((data[0] << 8) + data[1]) / 10.0;
    int16_t temp = ((data[2] & 0x7F) << 8) + data[3];
    if (data[2] & 0x80) temp = -temp;
    temperature = temp / 10.0;
  }
}

// ============ BH1750 READING ============
void readBH1750() {
  Wire.beginTransmission(BH1750_ADDR);
  byte error = Wire.endTransmission();

  if (error != 0) {
    // Sensor not connected - use default
    lightLevel = 5000;
    return;
  }

  Wire.requestFrom(BH1750_ADDR, 2);
  if (Wire.available() >= 2) {
    uint16_t raw = Wire.read() << 8;
    raw |= Wire.read();
    lightLevel = raw / 1.2;
  }
}

// ============ MEDIAN HELPER ============
int getMedian(int *arr, int size) {
  // Sort array
  for (int i = 0; i < size - 1; i++) {
    for (int j = i + 1; j < size; j++) {
      if (arr[j] < arr[i]) {
        int t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
    }
  }
  return arr[size / 2];
}

// ============ pH READING (Improved with filters) ============
void readPH() {
  // Median filter - take 7 samples
  for (int i = 0; i < MEDIAN_SAMPLES; i++) {
    medianArray[i] = analogRead(PH_PIN);
    delay(20);
  }
  int medianADC = getMedian(medianArray, MEDIAN_SAMPLES);

  // Moving average filter
  avgSum -= avgArray[avgIndex];
  avgArray[avgIndex] = medianADC;
  avgSum += avgArray[avgIndex];
  avgIndex = (avgIndex + 1) % AVG_SAMPLES;

  float avgADC = avgSum / (float)AVG_SAMPLES;

  // ADC to Voltage
  float voltage = (avgADC * VREF) / ADC_RES;

  // Single-point pH calculation
  phValue = 7.0 - ((voltage - voltage_pH7) / 0.05916);

  // Clamp to valid pH range
  if (phValue < 0) phValue = 0;
  if (phValue > 14) phValue = 14;
}

// ============ SOIL MOISTURE (Estimated) ============
void calculateSoilMoisture() {
  // If you have a soil moisture sensor, connect to A1:
  // soilMoisture = map(analogRead(A1), 1023, 0, 0, 100);

  // For now, estimate from humidity (correlation)
  soilMoisture = humidity * 1.1;
  if (soilMoisture > 100) soilMoisture = 100;
  if (soilMoisture < 0) soilMoisture = 0;
}

/*
 * APP EXPECTS THESE VALUES:
 * ─────────────────────────
 * temperature   → from DHT22 (°C)
 * humidity      → from DHT22 (%)
 * soil_moisture → estimated from humidity (%)
 * light_level   → from BH1750 (lux)
 * ph_value      → from pH sensor
 *
 * Data is sent as JSON every 5 seconds.
 * Node.js server (server.js) reads this and serves to app.
 */
