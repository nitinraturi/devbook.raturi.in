---
title: Swift for iOS and macOS
description: Swift notes for iOS and macOS apps - data-race safety, app structure, Swift Testing, privacy manifests, sandboxing, signing and notarization.
lastVerified: 2026-11-02
sources:
  - Swift 6 concurrency migration guide
  - Apple documentation on privacy manifests, App Sandbox, notarization and Swift Testing
---

Check the current Apple developer docs and Xcode release notes before using an API or build setting, and build with the Xcode and SDK the App Store currently requires (MOB-08). iOS apps also follow the mobile instructions; macOS apps follow design and security as usual.

- New code uses the Swift 6 language mode, which rejects data races at compile time. Migrate an existing project one module at a time, starting with the outermost, and comment every `@unchecked Sendable`, `nonisolated(unsafe)` or `@preconcurrency` with why it is safe (CORE-20).
- UI state lives on `@MainActor`. Keep SwiftUI views thin and put logic in plain Swift types, ideally in local Swift packages per feature, so `swift test` runs them without a simulator (CORE-10).
- Write new unit tests with Swift Testing (`import Testing`, `@Test`, `#expect`), which runs alongside XCTest, and UI tests with XCTest's UI testing. CI runs `xcodebuild test` against a named simulator or destination, not "any device".
- Ship a `PrivacyInfo.xcprivacy` privacy manifest with the data the app collects and, on iOS, the reason for each required-reasons API it uses (such as `UserDefaults` or file timestamps). Check every third-party SDK has its own, and keep both in line with the App Store privacy labels (MOB-06).
- Add dependencies with Swift Package Manager and commit `Package.resolved` (SEC-19). Tokens go in the Keychain (MOB-01); never put secrets in `Info.plist`, committed `.xcconfig` files or assets.
- Keep signing certificates, `.p12` files, provisioning profiles and App Store Connect API keys out of the repository; CI reads them from its secret store (SEC-03).
- macOS: Mac App Store apps must enable App Sandbox; request only the entitlements the app uses, such as `com.apple.security.files.user-selected.read-write` instead of broad file access. Outside the store, sign with a Developer ID certificate, enable the Hardened Runtime, notarize with `xcrun notarytool` and staple the ticket with `xcrun stapler`, or Gatekeeper blocks the app.
