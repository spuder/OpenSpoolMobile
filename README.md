# OpenSpoolMobile

[![Discord](https://img.shields.io/discord/1298381115706576907?logo=discord)](https://discord.gg/4EaXHu9CEj) [![Reddit](https://img.shields.io/badge/reddit-join-orange?logo=reddit)](https://www.reddit.com/r/openspool)  


Companion app for the OpenSpool Project https://github.com/spuder/OpenSpool

---

## Android: https://play.google.com/store/apps/details?id=io.openspool&utm_source=na_Med

Sideload APK: download `OpenSpool-<version>.apk` from the [latest release](https://github.com/spuder/OpenSpoolMobile/releases/latest). If you already have the Play Store version installed, uninstall it first (the signatures differ).

## iOS: https://apps.apple.com/us/app/openspool/id6740551901


---

## Usage

Reads/Writes NFC tags for 3d printer filament. 

![](./images/Screenshot%202025-01-03%20at%2020.57.15.png)

![](./images/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-01-14%20at%2022.13.24.png)

![](./images/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-01-14%20at%2022.14.44.png)

![](./images/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-01-14%20at%2022.13.50.png)

![](./images/Simulator%20Screenshot%20-%20iPhone%2016%20Pro%20Max%20-%202025-01-14%20at%2022.13.31.png)


# Releasing

1. Bump the version on both platforms (keep them in sync):
   - Android: `versionCode` and `versionName` in `android/app/build.gradle`
   - iOS: `CURRENT_PROJECT_VERSION` (= `versionCode`) and `MARKETING_VERSION` (= `versionName`) in `ios/OpenSpool.xcodeproj/project.pbxproj`
2. Build locally with `make android` (release AAB), or push a `v*` tag to run the GitHub Actions publish workflows for the Play Store and TestFlight.

Local Android release builds read the signing key from `OPENSPOOL_UPLOAD_*` properties in `~/.gradle/gradle.properties`.

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/openspool)
