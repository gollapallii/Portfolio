import json
from datetime import datetime, timezone
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from .data import PORTFOLIO

@require_GET
def portfolio(request):
    return JsonResponse(PORTFOLIO)

@require_POST
def contact(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Send valid JSON."}, status=400)
    name = str(body.get("name", "")).strip()
    email = str(body.get("email", "")).strip()
    message = str(body.get("message", "")).strip()
    if not (name and "@" in email and message):
        return JsonResponse({"error": "Enter your name, a valid email, and a message."}, status=400)
    entry = {"at": datetime.now(timezone.utc).isoformat(), "name": name[:100], "email": email[:150], "message": message[:2000]}
    with open(settings.BASE_DIR / "messages.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    return JsonResponse({"ok": True})
