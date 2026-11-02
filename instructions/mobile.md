---
title: Mobile apps
description: Extra rules for native, React Native and Flutter apps - accessibility settings, offline behaviour, permissions, secure storage, store policies and releases.
sidebar:
  order: 10
sources:
  - Apple Human Interface Guidelines and App Store Review Guidelines
  - Google Material guidance and Google Play policies
---

Load for iOS, Android, React Native and Flutter apps, together with the core, security, testing, performance and design instructions.

- MOB-01: Store tokens only in the platform secure store (Keychain, Keystore). Keep API secrets on the backend, because anything in the app bundle can be extracted.
- MOB-02: Check current App Store and Google Play policies before building payments, user content, health, children's or AI features.
- MOB-03: Assume flaky networks. Show loading and offline states, cache the last-seen data, and queue writes for retry.
- MOB-04: Support dynamic text size, dark mode and screen readers (VoiceOver, TalkBack). Every control has an accessible label.
- MOB-05: Ask for a permission only when a feature needs it, after a one-line reason. The app still works if it is denied.
- MOB-06: Privacy labels match what the app actually collects. Offer in-app account deletion where the stores require it.
- MOB-07: Report crashes with release versions. Test on the oldest supported OS and a low-end device.
- MOB-08: Meet the current store requirements: Google Play's target API level deadline and Apple's latest SDK requirement. Support Android edge-to-edge and safe areas.
- MOB-09: Release with staged rollouts, and keep a forced-update path for critical fixes.
