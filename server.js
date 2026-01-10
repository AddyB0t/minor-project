/*
 * SENSOR DATA SERVER
 * Reads Arduino Serial data and serves it to the app
 *
 * SETUP:
 * 1. npm install serialport cors express
 * 2. Connect Arduino via USB
 * 3. Find your COM port (Windows) or /dev/ttyUSB0 (Linux) or /dev/tty.usbmodem* (Mac)
 * 4. Update SERIAL_PORT below
 * 5. Run: node server.js
 * 6. App fetches from http://localhost:3001/sensors
 */

const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
app.use(cors());

// ============ CHANGE THIS TO YOUR PORT ============
// Windows: 'COM3', 'COM4', etc.
// Linux: '/dev/ttyUSB0', '/dev/ttyACM0'
// Mac: '/dev/tty.usbmodem14101', '/dev/tty.usbserial-*'
const SERIAL_PORT = '/dev/ttyUSB0';  // Linux port
const BAUD_RATE = 9600;

// Latest sensor data
let sensorData = {
  temperature: 0,
  humidity: 0,
  soil_moisture: 0,
  light_level: 0,
  ph_value: 0,
  lastUpdate: null,
  connected: false
};

// History for min/max
let history = {
  temperature: [],
  humidity: [],
  soil_moisture: [],
  light_level: [],
  ph_value: []
};

// Try to connect to Arduino
let port = null;
let parser = null;

function connectSerial() {
  try {
    port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
    parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('open', () => {
      console.log('✓ Arduino connected on ' + SERIAL_PORT);
      sensorData.connected = true;
    });

    port.on('error', (err) => {
      console.log('✗ Serial error:', err.message);
      sensorData.connected = false;
    });

    port.on('close', () => {
      console.log('✗ Arduino disconnected');
      sensorData.connected = false;
      // Try to reconnect after 5 seconds
      setTimeout(connectSerial, 5000);
    });

    parser.on('data', (line) => {
      try {
        // Skip non-JSON lines
        if (!line.startsWith('{')) return;

        const data = JSON.parse(line.trim());

        // Update sensor data
        sensorData.temperature = data.temperature || 0;
        sensorData.humidity = data.humidity || 0;
        sensorData.soil_moisture = data.soil_moisture || 0;
        sensorData.light_level = data.light_level || 0;
        sensorData.ph_value = data.ph_value || 0;
        sensorData.lastUpdate = new Date().toISOString();
        sensorData.connected = true;

        // Add to history (keep last 10)
        Object.keys(history).forEach(key => {
          if (data[key] !== undefined) {
            history[key].push(data[key]);
            if (history[key].length > 10) history[key].shift();
          }
        });

        console.log('Data:', JSON.stringify(sensorData));
      } catch (e) {
        // Ignore parse errors
      }
    });

  } catch (err) {
    console.log('✗ Cannot connect to ' + SERIAL_PORT);
    console.log('  Make sure Arduino is connected and port is correct');
    sensorData.connected = false;
    // Try again in 5 seconds
    setTimeout(connectSerial, 5000);
  }
}

// API endpoint for app
app.get('/sensors', (req, res) => {
  const response = {
    ...sensorData,
    history: {
      temperature: { min: Math.min(...history.temperature) || 0, max: Math.max(...history.temperature) || 0 },
      humidity: { min: Math.min(...history.humidity) || 0, max: Math.max(...history.humidity) || 0 },
      soil_moisture: { min: Math.min(...history.soil_moisture) || 0, max: Math.max(...history.soil_moisture) || 0 },
      light_level: { min: Math.min(...history.light_level) || 0, max: Math.max(...history.light_level) || 0 },
      ph_value: { min: Math.min(...history.ph_value) || 0, max: Math.max(...history.ph_value) || 0 }
    }
  };
  res.json(response);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', arduino: sensorData.connected });
});

// List available ports
app.get('/ports', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json(ports);
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log('=====================================');
  console.log('   SENSOR DATA SERVER');
  console.log('=====================================');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`App should fetch from: http://localhost:${PORT}/sensors`);
  console.log('');
  console.log('To find your Arduino port, visit:');
  console.log(`http://localhost:${PORT}/ports`);
  console.log('=====================================\n');

  connectSerial();
});
