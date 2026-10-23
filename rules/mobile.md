---
profile: mobile
title: Devbook mobile baseline
description: Mandatory Devbook rules for native, React Native, Flutter and similar apps - platform conventions, accessibility, offline, permissions, secure storage and releases.
---

# Devbook mobile baseline (mandatory for mobile apps)

Applies alongside the core baseline to native, React Native, Flutter and similar apps.

## Platform and design
- Follow Apple's Human Interface Guidelines and Google's Material guidance for navigation, gestures and system controls.
- Define colours, type, spacing and motion once as design tokens. Components use tokens, never raw values. Light and dark themes are token sets.
- Every component documents its states: default, pressed, focused, disabled, loading, error, empty.
- Buttons say what happens. Errors say what went wrong and what to do next.
- No dark patterns or fake social proof.

## Accessibility
- Support dynamic text sizes, dark mode and screen readers (VoiceOver, TalkBack).
- Every control has an accessible label. Colour is never the only signal.
- Contrast is at least 4.5:1 for text and 3:1 for icons and boundaries, in every theme. Touch targets aim for 44×44.
- Respect reduced-motion settings. Nothing flashes more than three times per second.

## Network and offline
- Assume flaky networks. Show loading and offline states, cache what the user last saw, and queue writes for retry where sensible.
- Every network call has a timeout. Never block the UI thread.

## Permissions
- Ask for a permission only when a feature needs it, after showing a one-line reason.
- The app still works, with fewer features, when a permission is denied.

## Security
- Store tokens and secrets only in the platform secure store (Keychain, Keystore-backed storage). Never in plain preferences or files.
- Use HTTPS only. Consider certificate pinning for high-risk apps, with a rotation plan.
- No API secrets in the app bundle. The app talks to your backend, which holds the secrets.

## Store compliance
- Check the current App Store Review Guidelines and Google Play policies before building features involving payments, user content, health data, children or AI-generated content.
- Privacy labels and data-safety forms match what the app actually collects.
- Account deletion is available in-app where the stores require it.

## Quality and release
- Crash and error reporting, tagged with release versions.
- Test on the oldest supported OS version and a low-end device.
- Release with staged rollouts or beta channels. Watch crash rates before reaching 100%.
- Keep a forced-update path for critical fixes.

## Detail
- Mobile apps: `{{devbook}}/src/content/docs/platforms/mobile.md`
- Accessibility: `{{devbook}}/src/content/docs/quality/accessibility.md`
- UI and design systems: `{{devbook}}/src/content/docs/web/ui-and-design-systems.md`
