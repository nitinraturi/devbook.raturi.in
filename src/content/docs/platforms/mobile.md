---
title: Mobile apps
description: Rules for iOS and Android apps - platform conventions, offline behaviour, permissions, secure storage, store policy compliance, crash reporting and staged releases.
sidebar:
  order: 1
---

Applies to native, React Native, Flutter and similar apps. All universal rules still apply.

## Rules

### Platform conventions
- Follow Apple's Human Interface Guidelines and Google's Material guidance for navigation, gestures and system controls. Users expect platform behaviour.
- Support dynamic text sizes, dark mode and screen readers (VoiceOver, TalkBack).

### Network and offline
- Assume flaky networks: show loading and offline states, cache what the user last saw, queue writes for retry where it makes sense.
- All network calls have timeouts; no blocking work on the UI thread.

### Permissions
- Ask for a permission only when the feature needs it, with a one-line reason shown first.
- The app works, with reduced features, if a permission is denied.

### Security
- Store tokens and secrets only in the platform secure store (Keychain on iOS, Keystore-backed storage on Android). Never in plain preferences or files.
- Use HTTPS only; consider certificate pinning for high-risk apps, with a rotation plan.
- No API secrets in the app bundle; the app talks to your backend, which holds secrets.

### Store compliance
- Read the current App Store Review Guidelines and Google Play policies before building features involving payments, user content, health data, children or AI-generated content.
- Privacy labels and data-safety forms match what the app actually collects.
- Account deletion is available in-app where the stores require it.

### Quality and release
- Crash and error reporting with release versions.
- Test on the oldest supported OS version and a low-end device.
- Release through staged rollouts or beta channels; watch crash rates before going to 100%.
- Support a forced-update path for critical fixes.

## Checklist
- [ ] Platform conventions and accessibility settings respected
- [ ] Offline and slow-network states
- [ ] Permissions just-in-time; app works if denied
- [ ] Secrets only in secure storage; none in the bundle
- [ ] Store policies and privacy labels checked
- [ ] Staged rollout with crash monitoring
