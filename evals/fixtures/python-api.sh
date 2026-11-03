# A small Python orders service using only the standard library: sqlite with numbered SQL migrations, a request
# handler module and unittest tests.
set -eu
mkdir -p orders migrations tests
cat > AGENTS.md <<'J'
# AGENTS.md

## Commands
- Format: TODO · Lint: `python3 -m py_compile orders/*.py` · Typecheck: TODO · Test: `python3 -m unittest -q` · Build: TODO

## Project rules
- Orders API on sqlite. Migrations are numbered SQL files in migrations/, applied in order by orders/db.py.
J
cat > migrations/0001_create_orders.sql <<'J'
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_email TEXT NOT NULL,
  total_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  created_at TEXT NOT NULL
);
J
touch orders/__init__.py tests/__init__.py
cat > orders/db.py <<'J'
"""Opens the database and applies migrations/ in order."""
import pathlib
import sqlite3

MIGRATIONS = pathlib.Path(__file__).resolve().parent.parent / "migrations"


def connect(path=":memory:"):
    conn = sqlite3.connect(path)
    for sql in sorted(MIGRATIONS.glob("*.sql")):
        conn.executescript(sql.read_text())
    return conn
J
cat > orders/api.py <<'J'
"""Request handlers: each takes a connection and a dict, and returns (status, body)."""


def get_order(conn, order_id):
    row = conn.execute("SELECT id, customer_email, total_minor, currency FROM orders WHERE id = ?", (order_id,)).fetchone()
    if row is None:
        return 404, {"error": "not found"}
    return 200, {"id": row[0], "customer_email": row[1], "total_minor": row[2], "currency": row[3]}
J
cat > tests/test_api.py <<'J'
import unittest

from orders import api, db


class GetOrder(unittest.TestCase):
    def test_missing_order_is_404(self):
        status, _ = api.get_order(db.connect(), 1)
        self.assertEqual(status, 404)


if __name__ == "__main__":
    unittest.main()
J
printf '__pycache__/\n*.sqlite\n.env\n' > .gitignore
