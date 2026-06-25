# Android APK Build Guide - One Call Home Solutions

## Prerequisites

Before building the APK, ensure you have the following installed:

1. **Node.js** (v18+)
2. **Java JDK 17 or higher**
3. **Android SDK** (API 36)
4. **Gradle** (8.x)
5. **Android Studio** (recommended for easier APK generation)

## Environment Setup

### 1. Set Environment Variables
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk  # Linux
# OR
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Java
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk  # Linux
# OR
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home  # macOS
```

### 2. Install Dependencies
```bash
cd project
npm install
```

---

## Available NPM Scripts

```bash
npm run build              # Build web app only
npm run build:android      # Build web app and sync to Android
npm run cap:sync           # Sync Capacitor (web to native)
npm run cap:open:android   # Open Android Studio
npm run android:build      # Build debug APK via Gradle
npm run android:release    # Build release APK via Gradle
```

---

## Building the APK (Two Methods)

### METHOD A: Using Gradle (Command Line)

1. **Build and sync the web app:**
   ```bash
   cd project
   npm run build:android
   ```
   This will:
   - Compile TypeScript
   - Build Vite bundle to `dist/`
   - Sync to Android platform

2. **Build Debug APK:**
   ```bash
   npm run android:build
   ```
   APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Build Release APK:**
   ```bash
   npm run android:release
   ```
   APK location: `android/app/build/outputs/apk/release/app-release.apk`

### METHOD B: Using Android Studio (Recommended)

1. **Build and sync:**
   ```bash
   npm run build:android
   ```

2. **Open in Android Studio:**
   ```bash
   npm run cap:open:android
   ```

3. In Android Studio:
   - Wait for Gradle sync to complete
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be in: `android/app/build/outputs/apk/debug/`

---

## Signing the APK for Production

### 1. Generate a Keystore
```bash
cd android/app
keytool -genkey -v -keystore release.keystore \
  -alias onecall \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

### 2. Configure Signing
Edit `capacitor.config.ts`:
```typescript
android: {
  buildOptions: {
    keystorePath: 'app/release.keystore',
    keystorePassword: 'YOUR_PASSWORD',
    keyAlias: 'onecall',
    keyPassword: 'YOUR_KEY_PASSWORD',
    signingType: 'apksigner'
  }
}
```

### 3. Create `gradle.properties` (if needed)
```properties
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_KEY_ALIAS=onecall
MYAPP_RELEASE_STORE_PASSWORD=YOUR_PASSWORD
MYAPP_RELEASE_KEY_PASSWORD=YOUR_KEY_PASSWORD
```

---

## Project Structure

```
project/
├── src/                   # React source files
│   ├── App.tsx            # Main application
│   ├── pages/auth/        # Authentication pages
│   ├── hooks/             # React hooks
│   ├── lib/               # Utilities and API
│   └── styles/            # CSS styles
├── dist/                  # Built web files (after npm run build)
├── android/               # Capacitor Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/onecall/homesolutions/MainActivity.java
│   │   │   ├── res/
│   │   │   │   ├── drawable*/splash.png     # Splash screens
│   │   │   │   ├── mipmap*/                  # App icons
│   │   │   │   └── values/
│   │   │   │       ├── colors.xml            # Theme colors
│   │   │   │       ├── strings.xml           # App name
│   │   │   │       └── styles.xml            # App theme
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   ├── variables.gradle   # Gradle variables
│   └── build.gradle
├── capacitor.config.ts    # Capacitor configuration
└── package.json           # Dependencies
```

---

## Capacitor Plugins Installed

| Plugin | Version | Purpose |
|--------|---------|---------|
| `@capacitor/android` | 8.4.1 | Android platform |
| `@capacitor/camera` | 7.2.0 | Photo capture (KYC docs) |
| `@capacitor/filesystem` | 7.1.0 | File storage |
| `@capacitor/geolocation` | 7.1.2 | GPS location |
| `@capacitor/keyboard` | 7.1.0 | Keyboard handling |
| `@capacitor/local-notifications` | 7.1.0 | Local push notifications |
| `@capacitor/push-notifications` | 7.1.0 | FCM push notifications |
| `@capacitor/splash-screen` | 7.2.0 | Launch splash screen |
| `@capacitor/status-bar` | 7.1.0 | Status bar styling |

---

## Troubleshooting

### Build Errors

**"SDK location not found"**
Create `android/local.properties`:
```properties
sdk.dir=/path/to/Android/Sdk
```

**"Unable to locate a Java Runtime"**
Install JDK 17+, set `JAVA_HOME`:
```bash
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

**"Gradle sync failed"**
```bash
cd android
./gradlew clean
cd ..
npm run build:android
```

**"CMake not configured"**
Not required for Capacitor. Remove any cmake configurations.

### Runtime Errors

**White screen after launch**
- Check `dist/` exists and contains `index.html`
- Ensure Vite `base: './'` in config
- Verify `capacitor.config.json` `webDir: 'dist'`

**Camera not working**
- Add permissions in AndroidManifest.xml (already added)
- Request runtime permissions in code

**Push notifications not working**
- Add `google-services.json` to `android/app/`
- Configure Firebase project for FCM

---

## Generating App Icons

App icons are located in `android/app/src/main/res/mipmap-*/`

Replace with your own icons using [Capacitor Assets](https://capacitorjs.com/docs/guides/splash-screens-and-icons):
```bash
# Install capacitor-assets
npm install -g @capacitor/assets

# Generate icons and splash screens
npx @capacitor/assets generate --android
```

Required icon sizes:
| Density | Size |
|---------|------|
| mipmap-mdpi | 48×48 |
| mipmap-hdpi | 72×72 |
| mipmap-xhdpi | 96×96 |
| mipmap-xxhdpi | 144×144 |
| mipmap-xxxhdpi | 192×192 |

---

## Installing APK on Device

### Via ADB
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Via Transfer
1. Enable "Install from Unknown Sources" on device
2. Transfer APK via USB/Cloud
3. Open APK on device to install

---

## Updating the App

After making code changes:
```bash
# 1. Rebuild web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Rebuild APK
cd android && ./gradlew assembleDebug
```

---

## Performance Tips

1. **Enable ProGuard** ✅ (already configured)
2. **Minify enabled** ✅ (already configured)
3. **Source maps disabled** ✅ (already configured for production)
4. **Code splitting** - Add in `vite.config.ts` for large apps:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           firebase: ['firebase'],
           supabase: ['@supabase/supabase-js'],
         }
       }
     }
   }
   ```

---

## Testing the Build

Before releasing, test on multiple devices:
- Android 8+ (API 24+)
- Different screen sizes
- With/without Play Services

```bash
# List connected devices
adb devices

# Run on device
npx cap run android --target=<device-id>

# Debug
npx capacitor open android
# (Android Studio → Run → Debug 'app')
```

---

## Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Build and sync
npm run build:android

# 3. Build APK
cd android && ./gradlew assembleDebug

# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Play Store Publishing

1. Build signed AAB:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. Create Play Console account ($25)

3. Create application with package name `com.onecall.homesolutions`

4. Upload `android/app/build/outputs/bundle/release/app-release.aab`

5. Fill store listing (see `PLAY_STORE_LISTING.md`)

6. Submit for review

---

For questions, contact: support@onecallhomesolutions.com
