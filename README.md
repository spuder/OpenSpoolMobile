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

Push a version tag on `main`. Both platforms take their version from the tag: `v1.4.0` → version `1.4.0`, Android versionCode / iOS build number `10400`.

| Tag | Android | iOS |
|---|---|---|
| `v1.4.0` (stable) | Sideload APK on the GitHub Release + AAB to the Play Store internal track (promote to production in Play Console) | TestFlight upload |
| `v1.4.0-beta1` (prerelease) | Sideload APK on a GitHub prerelease | Skipped |

Each publish job runs in a protected environment (`android-release`, `app-store`) and waits for approval in the Actions tab.

Local Android release builds (`make android`) read the signing key from `OPENSPOOL_UPLOAD_*` in `~/.gradle/gradle.properties`, and fall back to the version in `android/app/build.gradle` unless you pass `-POPENSPOOL_VERSION=1.4.0`.

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/openspool)
