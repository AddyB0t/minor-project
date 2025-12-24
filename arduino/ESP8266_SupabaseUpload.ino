/*
 * ESP8266 NodeMCU - Supabase Data Uploader
 * For: Smart Agriculture App Minor Project
 *
 * This code:
 * 1. Receives sensor data from Arduino via Serial
 * 2. Connects to WiFi
 * 3. Uploads data to Supabase database
 *
 * Wiring (ESP8266 NodeMCU to Arduino):
 * - ESP8266 TX  → Arduino D4
 * - ESP8266 RX  → Arduino D3 (via voltage divider 5V→3.3V)
 * - ESP8266 GND → Arduino GND
 * - ESP8266 VIN → 5V (NodeMCU has onboard regulator)
 *
 * Required Libraries:
 * - ESP8266WiFi (built-in)
 * - ESP8266HTTPClient (built-in)
 * - ArduinoJson (install via Library Manager)
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

// ============ WiFi CREDENTIALS ============
// CHANGE THESE TO YOUR WiFi DETAILS!
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ============ SUPABASE CONFIGURATION ============
// From your supabase.js file
const char* SUPABASE_URL = "https://vtpipgoewojgqqhepifc.supabase.co";
const char* SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cGlwZ29ld29qZ3FxaGVwaWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTQ3OTcsImV4cCI6MjA3Mzg3MDc5N30.37AsmA0y7KXTJFQus-FXadTsBfI_cpfq-GHJvlPq97U";

// User ID - Get this from your Supabase users table
// Default sample user from your database.js
const char* USER_ID = "550e8400-e29b-41d4-a716-446655440000";

// ============ TIMING ============
unsigned long lastUploadTime = 0;
const unsigned long UPLOAD_INTERVAL = 10000; // Upload every 10 seconds

// ============ SENSOR DATA BUFFER ============
String receivedData = "";
bool dataReady = false;

// ============ SETUP ============
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n========================================");
  Serial.println("ESP8266 Smart Agriculture Data Uploader");
  Serial.println("========================================\n");

  // Connect to WiFi
  connectToWiFi();
}

// ============ MAIN LOOP ============
void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Reconnecting...");
    connectToWiFi();
  }

  // Read data from Arduino
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      dataReady = true;
    } else if (c != '\r') {
      receivedData += c;
    }
  }

  // Process received data
  if (dataReady && receivedData.length() > 0) {
    Serial.println("Received from Arduino: " + receivedData);

    // Parse and upload
    uploadToSupabase(receivedData);

    // Clear buffer
    receivedData = "";
    dataReady = false;
  }
}

// ============ WiFi CONNECTION ============
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ WiFi Connection Failed!");
    Serial.println("Check credentials and try again.");
  }
}

// ============ UPLOAD TO SUPABASE ============
void uploadToSupabase(String jsonData) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("No WiFi - skipping upload");
    return;
  }

  // Parse JSON from Arduino
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, jsonData);

  if (error) {
    Serial.print("JSON parse error: ");
    Serial.println(error.c_str());
    return;
  }

  float temperature = doc["temperature"];
  float humidity = doc["humidity"];
  float soilMoisture = doc["soil_moisture"];
  float lightLevel = doc["light_level"];
  float phValue = doc["ph_value"];

  // Upload each sensor reading
  uploadSensorReading("temperature", temperature);
  uploadSensorReading("humidity", humidity);
  uploadSensorReading("soil_moisture", soilMoisture);
  uploadSensorReading("light_level", lightLevel);
  uploadSensorReading("ph_value", phValue);
}

// ============ UPLOAD SINGLE SENSOR READING ============
void uploadSensorReading(const char* sensorType, float value) {
  WiFiClientSecure client;
  HTTPClient http;

  // Disable SSL verification (for simplicity)
  client.setInsecure();

  // Supabase REST API endpoint
  String url = String(SUPABASE_URL) + "/rest/v1/sensors";

  Serial.print("Uploading ");
  Serial.print(sensorType);
  Serial.print(": ");
  Serial.println(value);

  http.begin(client, url);

  // Headers required by Supabase
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_ANON_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
  http.addHeader("Prefer", "return=minimal");

  // Create JSON payload
  StaticJsonDocument<256> payload;
  payload["user_id"] = USER_ID;
  payload["sensor_type"] = sensorType;
  payload["value"] = value;

  String jsonPayload;
  serializeJson(payload, jsonPayload);

  // Send POST request
  int httpCode = http.POST(jsonPayload);

  if (httpCode > 0) {
    if (httpCode == 201 || httpCode == 200) {
      Serial.println("  ✓ Upload successful!");
    } else {
      Serial.print("  ✗ HTTP Error: ");
      Serial.println(httpCode);
      Serial.println(http.getString());
    }
  } else {
    Serial.print("  ✗ Connection error: ");
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
}

/*
 * ============ ALTERNATIVE: STANDALONE MODE ============
 *
 * If you want to use ESP8266 alone (without Arduino),
 * you can connect sensors directly to ESP8266:
 *
 * ESP8266 NodeMCU Pinout:
 * - D1 (GPIO5)  → DHT22 Data
 * - D2 (GPIO4)  → I2C SDA (BH1750)
 * - D3 (GPIO0)  → I2C SCL (BH1750)
 * - A0          → LM35 or pH sensor (only 1 analog pin!)
 *
 * Note: ESP8266 has only ONE analog pin (A0) with 0-1V range
 * You'll need a voltage divider for 5V sensors
 *
 * For multiple analog sensors, use an external ADC like ADS1115
 */

/*
 * ============ TROUBLESHOOTING ============
 *
 * 1. "WiFi Connection Failed"
 *    - Check SSID and password (case-sensitive!)
 *    - Ensure 2.4GHz network (ESP8266 doesn't support 5GHz)
 *    - Move closer to router
 *
 * 2. "JSON parse error"
 *    - Check Arduino is sending valid JSON
 *    - Verify baud rate matches (115200)
 *
 * 3. "HTTP Error 401"
 *    - Check Supabase ANON_KEY is correct
 *    - Verify API key hasn't expired
 *
 * 4. "HTTP Error 400"
 *    - Check sensor table schema in Supabase
 *    - Verify user_id exists in users table
 *
 * 5. "HTTP Error 404"
 *    - Verify SUPABASE_URL is correct
 *    - Check table name is "sensors"
 *
 * 6. No data received from Arduino
 *    - Check wiring (TX→RX, RX→TX)
 *    - Verify voltage divider on ESP RX pin
 *    - Match baud rates
 */

/*
 * ============ SUPABASE TABLE SCHEMA ============
 *
 * Run this SQL in Supabase SQL Editor to create the sensors table:
 *
 * CREATE TABLE sensors (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES users(id),
 *   sensor_type VARCHAR(50) NOT NULL,
 *   value DECIMAL(10,2) NOT NULL,
 *   reading_date TIMESTAMP DEFAULT NOW()
 * );
 *
 * -- Enable Row Level Security
 * ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
 *
 * -- Allow anonymous inserts
 * CREATE POLICY "Allow anonymous insert" ON sensors
 * FOR INSERT TO anon WITH CHECK (true);
 *
 * -- Allow anonymous select
 * CREATE POLICY "Allow anonymous select" ON sensors
 * FOR SELECT TO anon USING (true);
 */
