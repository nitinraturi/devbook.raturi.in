package com.lumen.notes

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { NoteScreen(note = Note(id = "1", title = "Welcome", body = "Your first note.")) }
    }
}
