# TODO (iOS)

iOS work lives on branch `ios/release-prep` (worktree `../OpenSpoolMobile-ios`). Android work is on `android/sideload-apk` (worktree `../OpenSpoolMobile-android`).

## Done

- [x] CI workflows use `npm ci` with `cache: 'npm'` (was yarn) and Node 20.
- [x] Workflows use the real app ID `io.openspool` (was `io.openspool.mobile`).
- [x] Makefile `run-ios` uses `npx react-native run-ios` (optional `DEVICE="..."`); `dep-ios` uses bundler.
- [x] iOS `MARKETING_VERSION` synced to `1.3` to match Android `versionName`.
- [x] `react-native-nfc-manager` moved to `dependencies`.
- [x] README "Releasing" section updated.
- [x] `npm test` passes: Jest transforms `react-native-element-dropdown`, `jest.setup.js` mocks `react-native-nfc-manager`, render wrapped in `act()`.
- [x] Info.plist: real `NFCReaderUsageDescription`, removed empty `NSLocationWhenInUseUsageDescription`, added `ITSAppUsesNonExemptEncryption = false`.
- [x] `ios/exportOptions.plist`: real team ID, automatic signing, `destination: upload`.
- [x] `ios-publish.yaml` rewritten for automatic signing with an App Store Connect API key (was manual signing with a bogus `PROVISIONING_PROFILE`); also runnable manually (`workflow_dispatch`).

## Before republishing

- [x] Membership renewed; Free Apps Agreement active through 2027-09-28. (Paid Apps Agreement not signed — only needed for paid apps/IAP.)
- [x] App Store Connect API key "OpenSpool CI" (Admin, Key ID `T568F9M4T3`) created; `.p8` + Key ID + Issuer ID saved in 1Password (Private vault, item "OpenSpool CI").
- [x] Secrets `APP_STORE_CONNECT_API_KEY_ID`, `APP_STORE_CONNECT_API_ISSUER_ID`, `APP_STORE_CONNECT_API_KEY_CONTENT` stored in the protected `app-store` GitHub environment (required reviewer: spuder; deployments only from `v*` tags). The workflow also refuses tags whose commit isn't on `main`, and never runs outside `spuder/OpenSpoolMobile`.
- [x] iOS version/build number derived from the release tag (`v1.4.0` → `1.4.0 (10400)`), matching Android; prerelease tags skipped on iOS.
- [x] `ios/release-prep` merged (#44).
- [ ] After the Android stack (#42) lands on `main`: push a stable tag (e.g. `v1.4.0`) on `main` and approve the `app-store` deployment. Watch the first run — automatic signing with the API key is untested.
- [x] README "Releasing" covers both platforms' tag-based releases.
- [ ] Test NFC read/write on a physical iPhone with a Release build before submitting.

## Handed to the Android branch (done)

- [x] `~/.gradle/gradle.properties` keystore path fixed; 1Password note "Android Studio Keystore" has alias `key0` and the keystore attached.
- [x] Android signing secrets in the protected `android-release` environment; sideload APKs on GitHub Releases (#41, #42).
