# 🌾 Smart Agriculture App

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-black.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)](package.json)

> **AI-powered farming assistant with real-time sensor monitoring and intelligent crop management**

A comprehensive mobile application designed to revolutionize modern agriculture through smart technology, real-time environmental monitoring, and AI-driven farming assistance.

## 📱 App Overview

The Smart Agriculture App empowers farmers with cutting-edge technology to monitor crops, analyze environmental conditions, and receive intelligent farming recommendations. Built with React Native and Expo, it delivers a professional, modern interface optimized for mobile-first agricultural management.

---

## ✨ Key Features & Capabilities

### 🌾 **Smart Farm Dashboard**
- **Real-time Environmental Monitoring**
  - Temperature tracking with min/max ranges
  - Humidity level monitoring (current: 65%, range: 60%-70%)
  - Soil moisture analysis (current: 78%, range: 70%-85%)
  - Light level measurement (current: 85%, range: 75%-90%)
- **Professional Card-based Interface**
  - Clean, modern sensor data cards
  - Status indicators (Optimal, Good, Excellent)
  - Historical data overview
  - Quick action buttons for navigation

### 🤖 **AgroAssist AI Chatbot**
- **Intelligent Farming Assistant**
  - AI-powered crop advice and recommendations
  - Real-time Q&A for farming techniques
  - Soil, weather, and crop management guidance
  - Natural language processing for farming queries
- **Modern Chat Interface**
  - Clean message bubbles with timestamps
  - Professional typing indicators
  - Conversation history and context awareness
  - Mobile-optimized input system

### 🌱 **Comprehensive Plant Database**
- **Detailed Crop Information**
  - 8+ crop varieties with complete growing guides
  - Water requirements and sunlight needs
  - Soil pH recommendations (5.0-7.5 range)
  - Cost analysis per acre ($1,800-$3,500)
  - Growth periods (75-365 days)
  - Expected yield data (2-100 tons/acre)
- **Smart Analytics**
  - Crop categorization (Vegetables, Grains, Cash Crops, etc.)
  - Status tracking (Recommended, Popular, High Yield)
  - Comprehensive farm overview statistics
  - Searchable and sortable crop database

### 📊 **Data Management & Analytics**
- **Sensor Data Visualization**
  - Clean, professional data tables
  - Real-time status monitoring
  - Historical trend analysis
  - Activity logging and tracking
- **Modern UI/UX Design**
  - Banking app-style professional interface
  - Consistent color scheme and typography
  - Mobile-optimized layouts
  - Accessibility-focused design

---

## 💻 Software Requirements

### Development Environment

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 20.19.0+ | JavaScript runtime |
| **npm** | 10.8.2+ | Package manager |
| **Expo CLI** | 54.0.0 | Development framework |
| **React Native** | 0.81.4 | Mobile app framework |
| **Git** | Latest | Version control |

### Required Dependencies

```json
{
  "@react-navigation/bottom-tabs": "^7.4.7",
  "@react-navigation/native": "^7.1.17", 
  "@react-navigation/native-stack": "^7.3.26",
  "@supabase/supabase-js": "^2.38.0",
  "expo": "~54.0.0",
  "expo-linear-gradient": "^15.0.7",
  "nativewind": "^2.0.11",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "react-native-dotenv": "^3.4.9",
  "react-native-safe-area-context": "^5.6.1",
  "react-native-screens": "^4.16.0"
}
```

### Development Tools

- **Android Studio**: Android emulator and development
- **Xcode** (macOS only): iOS development and simulator
- **VS Code**: Recommended code editor
- **Expo Go**: Mobile testing app
- **Git**: Version control system

---

## 🖥️ Hardware Requirements

### Development Machine

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8GB | 16GB+ |
| **Storage** | 256GB | 512GB SSD |
| **Processor** | Intel i5 / AMD equivalent | Intel i7 / AMD Ryzen 7 |
| **OS** | Windows 10/11, macOS 10.15+, Ubuntu 18.04+ | Latest versions |

### Testing Devices

- **Android**: API level 21+ (Android 5.0+)
- **iOS**: iOS 13.0+ (if developing for iOS)
- **Emulators**: Android Studio AVD or iOS Simulator

### Production Hardware (IoT Integration)

For full smart agriculture implementation:

| Component | Specification | Purpose |
|-----------|---------------|---------|
| **Temperature Sensor** | DHT22/DS18B20 | Environmental monitoring |
| **Humidity Sensor** | DHT22/SHT30 | Moisture level tracking |
| **Soil Moisture Sensor** | Capacitive/Resistive | Soil condition monitoring |
| **Light Sensor** | BH1750/TSL2561 | Light level measurement |
| **Microcontroller** | Arduino Uno/ESP32 | Sensor data collection |
| **WiFi Module** | ESP8266/ESP32 | Wireless connectivity |
| **Power Supply** | Solar/Battery | Sustainable power |

---

## 🚀 Installation & Setup

### Prerequisites

1. **Install Node.js and npm**
   ```bash
   # Download from https://nodejs.org/
   node --version  # Should be 20.19.0+
   npm --version   # Should be 10.8.2+
   ```

2. **Install Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

3. **Install Android Studio** (for Android development)
   - Download from https://developer.android.com/studio
   - Set up Android Virtual Device (AVD)

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd smart-agriculture-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Different Platforms**
   ```bash
   npm run android    # Android emulator
   npm run ios        # iOS simulator (macOS only)
   npm run web        # Web browser
   ```

### Environment Setup

1. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Configure Database** (Supabase)
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

---

## 📁 Project Structure

```
smart-agriculture-app/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── buttons/         # Button components (Primary, Secondary, Icon)
│   │   ├── cards/           # Card components (StatCard, MetricCard)
│   │   └── table/           # DataTable component
│   ├── screens/             # App screens
│   │   ├── DashboardScreen.js    # Main dashboard with sensor data
│   │   ├── ChatScreen.js         # AgroAssist AI chatbot
│   │   ├── PlantsScreen.js       # Plant database and analytics
│   │   └── SensorDetailScreen.js # Individual sensor details
│   ├── design-system/       # Design tokens and styling
│   │   ├── Colors.js        # Color palette and themes
│   │   ├── Typography.js    # Font styles and text components
│   │   ├── Shadows.js       # Shadow and elevation styles
│   │   └── Spacing.js       # Spacing and layout constants
│   ├── navigation/          # App navigation setup
│   │   ├── AppNavigator.js  # Main navigation configuration
│   │   └── TabNavigator.js  # Bottom tab navigation
│   ├── database/            # Database utilities and functions
│   └── chatbot/             # AI chatbot functionality
├── package.json             # Dependencies and scripts
├── App.js                   # Main app entry point
├── babel.config.js          # Babel configuration
├── tailwind.config.js       # TailwindCSS configuration
└── README.md               # This file
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server with QR code |
| `npm run android` | Run app on Android emulator |
| `npm run ios` | Run app on iOS simulator (macOS only) |
| `npm run web` | Run app in web browser |

### Development Commands

```bash
# Start with tunnel (for network issues)
expo start --tunnel

# Start with specific host
expo start --host lan

# Clear cache and restart
expo start --clear

# Run with specific port
expo start --port 19000
```

---

## 🔧 Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **React Navigation**: Navigation library for screen management
- **NativeWind**: TailwindCSS for React Native styling
- **TypeScript/JavaScript**: Programming language

### Backend & Services
- **Supabase**: Database, authentication, and real-time subscriptions
- **AI/ML Integration**: Intelligent chatbot functionality
- **RESTful APIs**: Data communication and sensor integration

### Development Tools
- **Expo CLI**: Development workflow and build system
- **Metro Bundler**: JavaScript bundler with hot reloading
- **React Native Debugger**: Debugging and development tools
- **Git**: Version control and collaboration

### Design System
- **Modern Color Palette**: Professional green-based agricultural theme
- **Typography**: Consistent font hierarchy and text styles
- **Component Library**: Reusable UI components (buttons, cards, tables)
- **Responsive Design**: Mobile-first approach with tablet support

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### **Expo Go Connection Issues**
```bash
# Problem: Cannot scan QR code with phone
# Solution 1: Use tunnel mode
expo start --tunnel

# Solution 2: Use manual connection
# Type expo://192.168.1.39:8081 directly in Expo Go
```

#### **Android Emulator Setup**
```bash
# Problem: Android emulator not starting
# Solution: Check Android Studio AVD Manager
# Ensure virtualization is enabled in BIOS
```

#### **Build Errors**
```bash
# Problem: Metro bundler cache issues
# Solution: Clear cache
expo start --clear

# Problem: Node version compatibility
# Solution: Use Node.js 20.19.0+
nvm use 20.19.0
```

#### **Network Connectivity**
- Ensure phone and PC are on the same WiFi network
- Check Windows Firewall settings for port 8081
- Try different network interfaces with `--host` flag

---

## 👥 Contributing & Development

### Code Style Guidelines
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Follow React Native best practices
- Implement proper error handling and loading states
- Write clean, readable code with appropriate comments

### Component Architecture
- Use functional components with React Hooks
- Implement proper prop validation
- Follow single responsibility principle
- Create reusable, modular components

### File Naming Conventions
- Components: `PascalCase.js` (e.g., `StatCard.js`)
- Screens: `PascalCase.js` with "Screen" suffix (e.g., `DashboardScreen.js`)
- Utilities: `camelCase.js` (e.g., `apiHelpers.js`)

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-sensor-integration

# Make changes and commit
git add .
git commit -m "feat: add soil pH sensor integration"

# Push and create pull request
git push origin feature/new-sensor-integration
```

---

## 📄 License & Credits

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Libraries
- **React Native**: Meta Platforms, Inc.
- **Expo**: Expo Team
- **React Navigation**: React Navigation Contributors
- **Supabase**: Supabase Inc.
- **TailwindCSS**: Tailwind Labs

### Design Inspiration
- Modern banking app UI patterns
- Agricultural technology interfaces
- Material Design principles
- iOS Human Interface Guidelines

---

## 📞 Support & Contact

For questions, issues, or contributions:

- **GitHub Issues**: [Create an issue](issues)
- **Documentation**: [View docs](docs)
- **Discussions**: [Join discussions](discussions)

---

## 🚗 Roadmap

### Current Version (v1.0.0)
- ✅ Smart Farm Dashboard
- ✅ AgroAssist AI Chatbot  
- ✅ Plant Database
- ✅ Modern UI/UX Design

### Future Enhancements
- 🔄 Weather API Integration
- 🔄 IoT Sensor Hardware Integration
- 🔄 Push Notifications
- 🔄 Offline Mode Support
- 🔄 Multi-language Support
- 🔄 Advanced Analytics Dashboard

---

**Built with ❤️ for modern agriculture**