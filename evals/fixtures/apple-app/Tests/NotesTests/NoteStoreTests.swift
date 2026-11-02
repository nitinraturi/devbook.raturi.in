import Testing
@testable import Notes

@Test func replaceAllSortsNewestFirst() {
    let store = NoteStore()
    let old = Note(title: "Old", body: "", updatedAt: .distantPast)
    let new = Note(title: "New", body: "", updatedAt: .now)
    store.replaceAll([old, new])
    #expect(store.notes.map(\.title) == ["New", "Old"])
}
