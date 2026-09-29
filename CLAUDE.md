# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

OpenSpool Mobile is a React Native (0.76, TypeScript) companion app for the [OpenSpool](https://github.com/spuder/OpenSpool) project. It reads and writes NFC tags that describe 3D-printer filament (color, material type, min/max nozzle temp). It is published to the Play Store and App Store under the ID `io.openspool`.

## Commands

```bash
npm install                  # JS deps
make dep-ios                 # cd ios && pod install (needed after native dep changes)
npm start                    # Metro bundler
npm run ios                  # build + run on iOS simulator
npm run android              # build + run on Android emulator/device
npm run lint                 # eslint (@react-native config, prettier 2.8)
npm test                     # jest (preset: react-native)
npx jest __tests__/App.test.tsx   # single test file
npx jest -t "renders correctly"   # single test by name
make android                 # release AAB via react-native build-android, opens output dir
make clean-android           # ./gradlew clean
```

Build environment gotchas:
- Android: Gradle 8.10.2 can't run on JDK 23+. Use JDK 17/21, e.g. `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`.
- iOS: install CocoaPods via the Gemfile (`bundle install`, then `cd ios && bundle exec pod install`). Pod install fails with an `Encoding::CompatibilityError` unless `LANG=en_US.UTF-8` is set. If the Hermes "Replace Hermes" script phase fails with `node: No such file or directory`, fix the stale `NODE_BINARY` in the gitignored `ios/.xcode.env.local`.
- iOS simulator build without signing: `xcodebuild -workspace ios/OpenSpool.xcworkspace -scheme OpenSpool -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO`
- If Gradle reports `No matching variant of project :react-native-nfc-manager ... No variants exist`, the autolinking cache in `android/build/generated/autolinking/` is stale (e.g. repo moved). `rm -rf android/build` fixes it.

NFC does not work in the iOS simulator or most Android emulators; tag read/write must be tested on a physical device. The only test is a render smoke test in `__tests__/App.test.tsx`; `jest.setup.js` mocks `react-native-nfc-manager` (no native module under Jest).

## Architecture

Essentially the whole app lives in a single component, `App.tsx` (`OpenSpool`). `components/` is empty. There is no navigation, state library, or persistence — just `useState` for the four filament fields.

- **Data tables in `App.tsx`**: `colors` (label/value/hex, Bambu-style palette), `types` (firmware filament names), `typeAliases` (legacy tag values → current names), `temperatures` (5°C steps), and `filamentDefaults` (per-type min/max temps applied when the type changes).
- **Tag format** (the OpenSpool protocol — must stay compatible with the OpenSpool firmware): a single NDEF record, TNF `MIME_MEDIA`, type `application/json`, payload:
  ```json
  {"version":"1.0","protocol":"openspool","color_hex":"F330F9","type":"PLA","min_temp":190,"max_temp":240,"brand":"Generic"}
  ```
  On read, `color_hex` is matched case-insensitively against `colors` (fallback `blue`) and `type` (after `typeAliases`) case-insensitively against `types` (fallback `PLA`), so values not in those tables are silently replaced.
- **NFC flow** (`react-native-nfc-manager`): `checkNfcSupportedAndEnabled` → `requestTechnology(NfcTech.Ndef)` → read/write → always `cancelTechnologyRequest()` in `finally`. iOS shows the system NFC sheet; Android has no system UI, so the app shows its own "Waiting for tag..." `Modal` (Android-only, controlled by `readTagModalOpen`). Keep both platform paths in mind when changing read/write.
- **Temperature invariant**: min < max is enforced by `verifyAndSetMinTemp` (bumps max), the Max dropdown filtering to values above min, and a guard in `writeNdef`.
- Fonts (Orbitron) in `assets/fonts` are linked via `react-native.config.js`.

### Filament types are case-sensitive

The `type` field written to a tag must exactly match a key in the OpenSpool firmware's
`filament_mappings` (https://github.com/spuder/OpenSpool/blob/main/firmware/bambu.h), e.g.
`"PLA"`, `"PA-CF"`, `"TPU for AMS"`. The firmware uses a case-sensitive exact lookup to
pick the Bambu `tray_info_idx`; anything else (e.g. `"pla"`) maps to an empty code.

- `types[].value` in `App.tsx` is what gets written — keep it identical to the firmware names.
- When adding a type, add it to both `types` and `filamentDefaults`, and confirm the
  firmware knows the name.
- Reading tags is case-insensitive, and `typeAliases` maps legacy values (e.g. `nylon` → `PA`).

### Default temperatures

`filamentDefaults` nozzle ranges come from Bambu Studio's `Generic *` filament profiles
(`nozzle_temperature_range_low/high` in
https://github.com/bambulab/BambuStudio/tree/master/resources/profiles/BBL/filament).
Every default must be a value in the `temperatures` dropdown list (5°C steps), or the
dropdown will render blank.

## Native config

- NFC permissions/entitlements: `android/app/src/main/AndroidManifest.xml`, `ios/OpenSpool/Info.plist` (`NFCReaderUsageDescription`, reader-session formats), plus the iOS NFC entitlement.
- iOS workspace/scheme: `ios/OpenSpool.xcworkspace`, scheme `OpenSpool`.

## Releasing

- Bump versions manually: Android `versionCode`/`versionName` in `android/app/build.gradle`; iOS `CURRENT_PROJECT_VERSION`/`MARKETING_VERSION` in `ios/OpenSpool.xcodeproj/project.pbxproj`.
- iOS work happens on branch `ios/release-prep` (worktree `../OpenSpoolMobile-ios`); Android work on `android/sideload-apk` (worktree `../OpenSpoolMobile-android`). Keep platform changes on their own branch.
- `.github/workflows/ios-publish.yaml` (on `v*` tags or manual dispatch) archives with Xcode automatic signing via an App Store Connect API key, then `-exportArchive` with `ios/exportOptions.plist` (`destination: upload`) uploads to App Store Connect. Secrets (`APP_STORE_CONNECT_API_KEY_ID`, `APP_STORE_CONNECT_API_ISSUER_ID`, `APP_STORE_CONNECT_API_KEY_CONTENT`) live in the protected `app-store` environment: `v*` tags only, manual reviewer approval, and the job refuses tags not on `main`. The key is Admin-level, so keep secrets scoped to the steps that need them.
- Unsigned Release device build (checks JS bundling): same as the simulator command above with `-configuration Release -sdk iphoneos -destination 'generic/platform=iOS'`.
- Local Android release signing reads `OPENSPOOL_UPLOAD_*` from `~/.gradle/gradle.properties`; the keystore is `android/app/openspool.keystore` (gitignored, never commit it).
