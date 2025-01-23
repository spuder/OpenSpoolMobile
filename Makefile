# Makefile for React Native iOS and Android builds

.PHONY: run-ios dep-ios android clean-android run-android

# Run iOS app
run-ios:
	npx react-native run-ios
	xcodebuild -workspace openspool_app.xcworkspace \
		-scheme openspool_app \
		-destination "platform=iOS,name=Spencer Owen's iPhone" \
		-allowProvisioningUpdates

run-android:
	npx react-native run-android

# Install iOS dependencies
dep-ios:
	cd ios && pod install && cd ..

# Build Android release
android:
# Note you need to update versionCode 
	npx react-native build-android --mode=release
	open ./android/app/build/outputs/bundle/release

clean-android:
	cd android && ./gradlew clean && cd ..

# Default target
.DEFAULT_GOAL := run-ios
