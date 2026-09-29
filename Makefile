# Makefile for React Native iOS and Android builds

.PHONY: run-ios dep-ios android clean-android run-android

# Gradle 8.10 can't run on JDK 23+; default to Android Studio's bundled JDK if JAVA_HOME isn't set
ANDROID_STUDIO_JDK := /Applications/Android Studio.app/Contents/jbr/Contents/Home
ifeq ($(JAVA_HOME),)
  ifneq ($(shell test -d "$(ANDROID_STUDIO_JDK)" && echo yes),)
    export JAVA_HOME := $(ANDROID_STUDIO_JDK)
  endif
endif

# CocoaPods fails with an encoding error without a UTF-8 locale
export LANG := en_US.UTF-8

# Run iOS app (pass DEVICE="Device Name" to run on a physical device)
run-ios:
	npx react-native run-ios $(if $(DEVICE),--device "$(DEVICE)")

run-android:
	npx react-native run-android

# Install iOS dependencies
dep-ios:
	bundle install
	cd ios && bundle exec pod install

# Build Android release
android:
# Note you need to update versionCode in build.gradle
	npx react-native build-android --mode=release
	open ./android/app/build/outputs/bundle/release

clean-android:
	cd android && ./gradlew clean

# Default target
.DEFAULT_GOAL := run-ios
