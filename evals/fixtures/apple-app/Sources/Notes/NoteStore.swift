import Foundation

/// Holds the notes the app shows. The sync service calls `replaceAll` from a background task.
public final class NoteStore {
    public private(set) var notes: [Note] = []

    public init() {}

    public func replaceAll(_ notes: [Note]) {
        self.notes = notes.sorted { $0.updatedAt > $1.updatedAt }
    }
}
