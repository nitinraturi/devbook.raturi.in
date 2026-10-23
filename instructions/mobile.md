---
title: Mobile apps
description: Extra rules for native, React Native and Flutter apps - platform conventions, accessibility settings, offline behaviour, permissions, secure storage and releases.
sidebar:
  order: 9
---

Use with the core, security, testing, performance and design instructions.

- Follow Apple's Human Interface Guidelines and Google's Material guidance for navigation, gestures and system controls.
- Support dynamic text size, dark mode and screen readers (VoiceOver, TalkBack). Every control has an accessible label.
- Assume flaky networks. Show loading and offline states, cache the last-seen data, and queue writes for retry.
- Every network call has a timeout. Never block the UI thread.
- Ask for a permission only when a feature needs it, after a one-line reason. The app still works if it is denied.
- Store tokens only in the platform secure store (Keychain, Keystore). Never put API secrets in the app bundle; the backend holds them.
- Check current App Store and Google Play policies before building payments, user content, health, children's or AI features.
- Privacy labels match what the app actually collects. Offer in-app account deletion where the stores require it.
- Report crashes with release versions. Test on the oldest supported OS and a low-end device.
- Meet the current store requirements: Google Play's target API level deadline and Apple's latest SDK requirement. Support Android edge-to-edge and safe areas.
- Release with staged rollouts, and keep a forced-update path for critical fixes.
