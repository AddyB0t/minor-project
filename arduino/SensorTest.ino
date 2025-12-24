/*
 * SENSOR TEST CODE - No WiFi Required
 * Tests all components individually
 *
 * Open Serial Monitor at 9600 baud to see results
 *
 * WIRING FOR TEST:
 * ================
 * DHT22:    VCC→5V, GND→GND, DATA→D2 (add 10K resistor between DATA and VCC)
 * LM35:     VCC→5V, GND→GND, OUT→A0
 * BH1750:   VCC→5V, GND→GND, SDA→A4, SCL→A5, ADDR→leave open
 * pH:       VCC→5V, GND→GND, AO→A1
 */

#include <Wire.h>

// Pin definitions
#define DHT_PIN 2
#define LM35_PIN A0
#define PH_PIN A1
#define BH1750_ADDR 0x23

void setup() {a
  Serial.begin(9600);
  Wire.begin();

  Serial.println("=====================================");
  Serial.println("   SMART AGRICULTURE SENSOR TEST");
  Serial.println("=====================================");
  Serial.println("Testing all components...\n");
  delay(2000);

  // Initialize BH1750
  Wire.beginTransmission(BH1750_ADDR);
  Wire.write(0x10);  // Continuous high-res mode
  Wire.endTransmission();
  delay(200);
}

void loop() {
  Serial.println("\n========== SENSOR READINGS ==========\n");

  // Test 1: DHT22
  testDHT22();
  delay(500);

  // Test 2: LM35
  testLM35();
  delay(500);

  // Test 3: BH1750
  testBH1750();
  delay(500);

  // Test 4: pH Sensor
  testPH();
  delay(500);

  Serial.println("\n======================================");
  Serial.println("Next reading in 5 seconds...");
  Serial.println("======================================\n");

  delay(5000);
}

// ============ DHT22 TEST ============
void testDHT22() {
  Serial.println("1. DHT22 (Temperature & Humidity)");
  Serial.println("   ---------------------------------");

  byte data[5] = {0, 0, 0, 0, 0};

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
      Serial.println("   Status: NOT DETECTED!");
      Serial.println("   Check: Wiring, 10K pull-up resistor");
      return;
    }
  }

  // Skip response pulses
  delayMicroseconds(80);
  delayMicroseconds(80);

  // Read 40 bits
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

  // Verify checksum
  if (data[4] == ((data[0] + data[1] + data[2] + data[3]) & 0xFF)) {
    float humidity = ((data[0] << 8) + data[1]) / 10.0;
    int16_t temp = ((data[2] & 0x7F) << 8) + data[3];
    if (data[2] & 0x80) temp = -temp;
    float temperature = temp / 10.0;

    Serial.print("   Temperature: ");
    Serial.print(temperature);
    Serial.println(" C");
    Serial.print("   Humidity:    ");
    Serial.print(humidity);
    Serial.println(" %");
    Serial.println("   Status: OK!");
  } else {
    Serial.println("   Status: CHECKSUM ERROR");
    Serial.println("   Try again or check wiring");
  }
}

// ============ LM35 TEST ============
void testLM35() {
  Serial.println("\n2. LM35 (Temperature Sensor)");
  Serial.println("   ---------------------------------");

  // Read multiple samples for accuracy
  float total = 0;
  for (int i = 0; i < 10; i++) {
    total += analogRead(LM35_PIN);
    delay(10);
  }
  float avgReading = total / 10.0;

  // Convert to temperature
  // LM35: 10mV per degree C
  float voltage = avgReading * (5.0 / 1024.0);
  float temperature = voltage * 100.0;

  Serial.print("   Raw ADC:     ");
  Serial.println(avgReading, 0);
  Serial.print("   Voltage:     ");
  Serial.print(voltage, 3);
  Serial.println(" V");
  Serial.print("   Temperature: ");
  Serial.print(temperature, 1);
  Serial.println(" C");

  if (avgReading > 10 && temperature < 100) {
    Serial.println("   Status: OK!");
  } else if (avgReading < 5) {
    Serial.println("   Status: CHECK WIRING (reading too low)");
  } else {
    Serial.println("   Status: CHECK SENSOR (reading abnormal)");
  }
}

// ============ BH1750 TEST ============
void testBH1750() {
  Serial.println("\n3. BH1750 (Light Sensor)");
  Serial.println("   ---------------------------------");

  Wire.beginTransmission(BH1750_ADDR);
  byte error = Wire.endTransmission();

  if (error != 0) {
    Serial.println("   Status: NOT DETECTED!");
    Serial.println("   Check: SDA→A4, SCL→A5");
    return;
  }

  Wire.requestFrom(BH1750_ADDR, 2);

  if (Wire.available() >= 2) {
    uint16_t raw = Wire.read() << 8;
    raw |= Wire.read();
    float lux = raw / 1.2;

    Serial.print("   Raw value:   ");
    Serial.println(raw);
    Serial.print("   Light level: ");
    Serial.print(lux, 1);
    Serial.println(" lux");

    // Interpret light level
    Serial.print("   Condition:   ");
    if (lux < 10) Serial.println("Dark");
    else if (lux < 500) Serial.println("Indoor dim");
    else if (lux < 1000) Serial.println("Indoor bright");
    else if (lux < 10000) Serial.println("Cloudy outdoor");
    else if (lux < 30000) Serial.println("Sunny");
    else Serial.println("Direct sunlight");

    Serial.println("   Status: OK!");
  } else {
    Serial.println("   Status: READ ERROR");
  }
}

// ============ pH SENSOR TEST ============
void testPH() {
  Serial.println("\n4. pH Sensor");
  Serial.println("   ---------------------------------");

  // Read multiple samples
  float total = 0;
  for (int i = 0; i < 10; i++) {
    total += analogRead(PH_PIN);
    delay(10);
  }
  float avgReading = total / 10.0;

  // Convert to voltage
  float voltage = avgReading * (5.0 / 1024.0);

  // Convert to pH (needs calibration for accuracy)
  // Typical: pH 7 = 2.5V, slope = -0.18V per pH unit
  float ph = 7.0 + ((2.5 - voltage) / 0.18);

  // Clamp to valid range
  if (ph < 0) ph = 0;
  if (ph > 14) ph = 14;

  Serial.print("   Raw ADC:     ");
  Serial.println(avgReading, 0);
  Serial.print("   Voltage:     ");
  Serial.print(voltage, 3);
  Serial.println(" V");
  Serial.print("   pH Value:    ");
  Serial.println(ph, 2);

  Serial.print("   Soil type:   ");
  if (ph < 5.5) Serial.println("Very Acidic");
  else if (ph < 6.5) Serial.println("Acidic");
  else if (ph < 7.5) Serial.println("Neutral");
  else if (ph < 8.5) Serial.println("Alkaline");
  else Serial.println("Very Alkaline");

  if (avgReading > 50) {
    Serial.println("   Status: READING OK");
    Serial.println("   Note: Calibrate with buffer solutions for accuracy");
  } else {
    Serial.println("   Status: CHECK WIRING (reading too low)");
  }
}

/*
 * TROUBLESHOOTING GUIDE:
 * ======================
 *
 * DHT22 not detected:
 *   - Add 10K resistor between DATA pin and VCC
 *   - Check DATA is connected to D2
 *   - Try different DHT22 unit
 *
 * LM35 reading 0 or wrong:
 *   - Check middle pin goes to A0
 *   - Verify 5V power
 *   - Flat side should face you when reading left-to-right: VCC, OUT, GND
 *
 * BH1750 not detected:
 *   - SDA must be on A4
 *   - SCL must be on A5
 *   - Check I2C address (try 0x5C if ADDR is connected to VCC)
 *
 * pH sensor odd readings:
 *   - Needs calibration with pH 4.0 and pH 7.0 buffer solutions
 *   - Keep probe in storage solution when not in use
 *   - Clean probe before testing
 */
