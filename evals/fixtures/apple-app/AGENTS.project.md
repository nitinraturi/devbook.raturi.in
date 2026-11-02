## Project
- What: Lumen for iPhone and Mac, a note-taking app. Notes sync with the Lumen API.
- Stack: Swift, SwiftUI, a local Swift package `Notes` for the logic, Xcode project for the app targets (iOS and macOS).
- Commands: test `swift test` (the package) · build `xcodebuild -scheme Lumen -destination 'platform=iOS Simulator,name=iPhone 17'` (neither is available in this checkout; say so instead of running them)
- Layout: logic in `Sources/Notes/`, tests in `Tests/NotesTests/`, app code in `App/`.
