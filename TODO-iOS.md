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
- [ ] Decide on the build number: `CURRENT_PROJECT_VERSION` is `8`. Fine if 1.3 is a new version in App Store Connect; bump if a `1.3 (8)` was ever uploaded.
- [ ] Merge `ios/release-prep` into `main`, then push a `v*` tag on `main` and approve the `app-store` deployment.
- [ ] Test NFC read/write on a physical iPhone with a Release build before submitting.

## Handed to the Android branch

- `~/.gradle/gradle.properties` `OPENSPOOL_UPLOAD_STORE_FILE` points at an old checkout path; keystore is `android/app/openspool.keystore` (alias `key0`, SHA1 `82:4F:86:9D:…:79:6B`). The 1Password note "Android Studio Keystore" lists the alias as `openspool` — should be `key0` — and doesn't contain the keystore file.
- Android CI signing secrets and sideload APKs on GitHub Releases.
