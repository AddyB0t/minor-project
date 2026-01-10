/*
 * pH SENSOR CALIBRATION - Serial Monitor Only
 * No OLED needed!
 *
 * YOUR pH SENSOR PINS: VCC, GND, GND, PO, 2V5, T1
 *
 * WIRING:
 * ┌─────────────────┬───────────┬──────────────────┐
 * │ pH Sensor Pin   │ Arduino   │ Notes            │
 * ├─────────────────┼───────────┼──────────────────┤
 * │ VCC             │ 5V        │ Power            │
 * │ GND             │ GND       │ Ground           │
 * │ GND             │ GND       │ Ground (same)    │
 * │ PO              │ A1        │ pH Output!       │
 * │ 2V5             │ -         │ Not needed       │
 * │ T1              │ -         │ Temp (optional)  │
 * └─────────────────┴───────────┴──────────────────┘
 *
 * CALIBRATION STEPS:
 * 1. Upload this code
 * 2. Open Serial Monitor (9600 baud)
 * 3. Put probe in pH 7.0 buffer solution
 * 4. Note the voltage reading
 * 5. Adjust calibration_value until pH shows 7.00
 * 6. Test with pH 4.0 buffer to verify
 */

#define PH_PIN A1  // Connect to PO pin on sensor

// ========== ADJUST THIS VALUE ==========
float calibration_value = 21.34;  // Change this during calibration!
// =======================================

int buffer_arr[10];
int temp;
unsigned long int avgval;
float ph_act;
float voltage;

void setup() {
  Serial.begin(9600);
  pinMode(PH_PIN, INPUT);

  Serial.println("================================");
  Serial.println("   pH SENSOR CALIBRATION");
  Serial.println("================================");
  Serial.println("");
  Serial.println("Instructions:");
  Serial.println("1. Put probe in pH 7.0 buffer");
  Serial.println("2. Adjust calibration_value in code");
  Serial.println("3. Re-upload until pH reads 7.00");
  Serial.println("4. Test with pH 4.0 buffer");
  Serial.println("");
  Serial.println("Current calibration_value: " + String(calibration_value));
  Serial.println("================================\n");
  delay(2000);
}

void loop() {
  // Read 10 samples
  for (int i = 0; i < 10; i++) {
    buffer_arr[i] = analogRead(PH_PIN);
    delay(30);
  }

  // Sort the readings (bubble sort)
  for (int i = 0; i < 9; i++) {
    for (int j = i + 1; j < 10; j++) {
      if (buffer_arr[i] > buffer_arr[j]) {
        temp = buffer_arr[i];
        buffer_arr[i] = buffer_arr[j];
        buffer_arr[j] = temp;
      }
    }
  }

  // Average middle 6 values (ignore 2 lowest and 2 highest)
  avgval = 0;
  for (int i = 2; i < 8; i++) {
    avgval += buffer_arr[i];
  }

  // Calculate voltage
  voltage = (float)avgval * 5.0 / 1024.0 / 6.0;

  // Calculate pH
  ph_act = -5.70 * voltage + calibration_value;

  // Print results
  Serial.println("-----------------------------");
  Serial.print("Raw ADC Avg:  ");
  Serial.println(avgval / 6);
  Serial.print("Voltage:      ");
  Serial.print(voltage, 3);
  Serial.println(" V");
  Serial.print("pH Value:     ");
  Serial.println(ph_act, 2);

  // pH range indicator
  Serial.print("Status:       ");
  if (ph_act < 5.5) {
    Serial.println("Very Acidic");
  } else if (ph_act < 6.5) {
    Serial.println("Acidic");
  } else if (ph_act < 7.5) {
    Serial.println("Neutral (Good!)");
  } else if (ph_act < 8.5) {
    Serial.println("Alkaline");
  } else {
    Serial.println("Very Alkaline");
  }
  Serial.println("");

  delay(1000);
}

/*
 * CALIBRATION GUIDE:
 * ==================
 *
 * If pH 7.0 buffer shows wrong value:
 *   - Reading too HIGH? → DECREASE calibration_value
 *   - Reading too LOW?  → INCREASE calibration_value
 *
 * Example:
 *   Buffer is 7.0, but shows 8.5
 *   Difference = 8.5 - 7.0 = 1.5
 *   New calibration_value = current - 1.5
 *
 * Formula used: pH = -5.70 * voltage + calibration_value
 *
 * TIPS:
 * - Clean probe with distilled water between tests
 * - Wait 30-60 seconds for reading to stabilize
 * - Keep probe wet when not in use (storage solution)
 * - Room temperature buffers work best
 */
