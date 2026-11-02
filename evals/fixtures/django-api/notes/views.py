import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Note

TITLE_MAX = Note._meta.get_field("title").max_length


def _error(status, detail):
    return JsonResponse({"title": "Invalid request", "status": status, "detail": detail}, status=status)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def note_list(request):
    if request.method == "GET":
        notes = Note.objects.order_by("-created_at", "-id")[:100]
        return JsonResponse({"items": [note.to_dict() for note in notes]})

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return _error(400, "Body must be JSON.")
    if not isinstance(data, dict):
        return _error(400, "Body must be a JSON object.")
    title = data.get("title")
    body = data.get("body", "")
    if not isinstance(title, str) or not title.strip() or len(title) > TITLE_MAX:
        return _error(400, f"title must be a non-empty string of at most {TITLE_MAX} characters.")
    if not isinstance(body, str):
        return _error(400, "body must be a string.")
    note = Note.objects.create(title=title.strip(), body=body)
    return JsonResponse(note.to_dict(), status=201)


@require_http_methods(["GET"])
def note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk)
    return JsonResponse(note.to_dict())
