import SwiftUI
import Notes

@main
struct LumenApp: App {
    var body: some Scene {
        WindowGroup {
            NoteListView(notes: [Note(title: "Welcome", body: "Your first note.")])
        }
    }
}

struct NoteListView: View {
    let notes: [Note]

    var body: some View {
        List(notes) { note in
            Text(note.title)
        }
    }
}
