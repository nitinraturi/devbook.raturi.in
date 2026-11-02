package com.lumen.notes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

data class Note(val id: String, val title: String, val body: String)

@Composable
fun NoteScreen(note: Note) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(text = note.title, style = MaterialTheme.typography.headlineSmall)
        Text(text = note.body, style = MaterialTheme.typography.bodyLarge)
    }
}
