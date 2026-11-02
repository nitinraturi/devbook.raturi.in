## Project
- What: the JSON API behind Lumen, a note-taking app. Clients create, list and read notes.
- Stack: Python, Django with plain JSON views (no REST framework), SQLite in development, pip with `requirements.txt`.
- Commands: setup `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt` · test `.venv/bin/python manage.py test` · migrations `.venv/bin/python manage.py makemigrations`
- Layout: settings in `config/`, the notes app in `notes/` (models, views, urls, tests, migrations).
