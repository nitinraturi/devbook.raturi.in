// swift-tools-version:6.0
import PackageDescription

let package = Package(
    name: "Notes",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "Notes", targets: ["Notes"])],
    targets: [
        .target(name: "Notes"),
        .testTarget(name: "NotesTests", dependencies: ["Notes"]),
    ]
)
