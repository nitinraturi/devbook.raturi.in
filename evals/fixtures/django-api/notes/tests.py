import json

from django.test import TestCase
from django.urls import reverse

from .models import Note


class NoteApiTests(TestCase):
    def post(self, payload):
        return self.client.post(reverse("note-list"), data=json.dumps(payload), content_type="application/json")

    def test_create_note(self):
        response = self.post({"title": "First", "body": "Hello"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Note.objects.get().title, "First")

    def test_create_rejects_missing_or_long_title(self):
        self.assertEqual(self.post({"body": "no title"}).status_code, 400)
        self.assertEqual(self.post({"title": "x" * 201}).status_code, 400)
        self.assertEqual(Note.objects.count(), 0)

    def test_create_rejects_non_json(self):
        response = self.client.post(reverse("note-list"), data="nope", content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_list_newest_first(self):
        Note.objects.create(title="Older")
        Note.objects.create(title="Newer")
        items = self.client.get(reverse("note-list")).json()["items"]
        self.assertEqual([item["title"] for item in items], ["Newer", "Older"])

    def test_detail_and_missing_note(self):
        note = Note.objects.create(title="Only")
        self.assertEqual(self.client.get(reverse("note-detail", args=[note.id])).json()["title"], "Only")
        self.assertEqual(self.client.get(reverse("note-detail", args=[note.id + 1])).status_code, 404)
