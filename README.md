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

### Android

Push a version tag; the Android version comes from the tag (`v1.4.0` → versionName `1.4.0`, versionCode `10400`):

- `v1.4.0` (stable): builds a sideload APK attached to the GitHub Release, and uploads an AAB to the Play Store internal track (promote it to production in Play Console).
- `v1.4.0-beta1` (prerelease): sideload APK only, published as a GitHub prerelease.

Local release builds (`make android`) read the signing key from `OPENSPOOL_UPLOAD_*` in `~/.gradle/gradle.properties`, and fall back to the version in `android/app/build.gradle` unless you pass `-POPENSPOOL_VERSION=1.4.0`.

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/openspool)
