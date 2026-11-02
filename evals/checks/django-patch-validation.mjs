// PATCH /notes/<id>/ rejects bad input with 400 and saves a valid title.
// Runs a Django test case against the final state, so it checks behaviour rather than code shape.
import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fail, pass, sh } from '../lib.mjs';

const CASES = `
import json
from django.test import TestCase
from notes.models import Note


class EvalPatchValidation(TestCase):
    def patch(self, note, body):
        return self.client.generic("PATCH", f"/notes/{note.id}/", body, content_type="application/json")

    def test_rejects_bad_input(self):
        note = Note.objects.create(title="Before")
        for label, body in [
            ("not JSON", "nope"),
            ("empty title", json.dumps({"title": ""})),
            ("title too long", json.dumps({"title": "x" * 201})),
            ("title not a string", json.dumps({"title": 5})),
        ]:
            with self.subTest(label):
                self.assertEqual(self.patch(note, body).status_code, 400, label)
        note.refresh_from_db()
        self.assertEqual(note.title, "Before")

    def test_saves_valid_title(self):
        note = Note.objects.create(title="Before")
        self.assertEqual(self.patch(note, json.dumps({"title": "After"})).status_code, 200)
        note.refresh_from_db()
        self.assertEqual(note.title, "After")
`;

export default async function djangoPatchValidation({ dir }) {
	const file = join(dir, 'eval_patch_validation.py');
	await writeFile(file, CASES);
	try {
		const { code, stderr } = await sh('.venv/bin/python manage.py test eval_patch_validation', { cwd: dir });
		const failures = stderr.match(/^(FAIL|ERROR):.*$/gm) ?? [];
		return code === 0 ? pass('bad input rejected, valid title saved') : fail(failures.join('; ') || stderr.slice(-300));
	} finally {
		await rm(file, { force: true });
	}
}
