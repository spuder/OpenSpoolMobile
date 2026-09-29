# TODO — Android

Android build, signing and release tasks. iOS items are tracked separately.

## Signing

- [x] Point `~/.gradle/gradle.properties` `OPENSPOOL_UPLOAD_STORE_FILE` at `android/app/openspool.keystore` in this checkout (backup: `~/.gradle/gradle.properties.bak-2026-09-28`).
- [x] 1Password note "Android Studio Keystore": alias fixed to `key0`, store path updated, keystore attached (verified byte-identical).
- [x] GitHub Actions secrets on `spuder/OpenSpoolMobile`: `ANDROID_KEYSTORE` (base64), `ANDROID_KEY_ALIAS`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`.
- [ ] `PLAY_STORE_SERVICE_ACCOUNT_JSON` secret (Google Cloud service account with Play Console access) — not found locally.
- [ ] Confirm keystore SHA1 `82:4F:86:9D:99:CF:96:55:D5:2B:5B:32:45:49:ED:58:F8:E6:79:6B` matches the upload key in Play Console → App integrity.

## Sideload APKs

- [x] `.github/workflows/android-apk.yaml`: signed arm-only release APK on `v*` tags (attached to the GitHub Release) and on manual runs (Actions artifact). README links `releases/latest`.
- [ ] Run the workflow once on GitHub (needs the workflow committed + pushed).
- [ ] Smoke-test a release APK on a real device.
- [ ] Note: pushing a stable tag (`v1.4.0`) also triggers `android-publish.yaml`, which will fail at the Play upload until `PLAY_STORE_SERVICE_ACCOUNT_JSON` exists.

## Review findings (2026-09-28)

- [x] Cancelling a read/write no longer shows "Failed to write"; successful writes are confirmed.
- [x] NFC cancel is awaited and buttons are disabled while a session is active (fixes stuck "Waiting for tag..." on quick retries).
- [x] Tag parsing: finds the `application/json` record, decodes UTF-8, validates `protocol`/fields before touching state, alerts on bad tags and on unknown color/type.
- [x] Release builds fail if the `OPENSPOOL_UPLOAD_*` signing properties are missing; Play workflow now signs in Gradle (dropped `r0adkll/sign-android-release`) and uses v4 actions.
- [x] Target/compile SDK 36 (Play requirement since 2026-08-31); edge-to-edge handled with `react-native-safe-area-context`, light system-bar icons, predictive back opted out. AGP 8.6 warns about compileSdk 36; an RN upgrade would clear it.
- [x] Version derived from the tag via `OPENSPOOL_VERSION`; Play publishing runs on stable tags only and uploads to the internal track.
- [x] Android requests `NdefFormatable` too: blank unformatted tags read as empty and are formatted on write.
- [x] Workflow hardening: `persist-credentials: false`, `npm ci --ignore-scripts`, signing props via `ORG_GRADLE_PROJECT_*` env, release upload in its own job, `upload-google-play` SHA-pinned.
