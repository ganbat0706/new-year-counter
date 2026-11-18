#!/usr/bin/env python3
"""
Claude Code -> Microsoft Teams мэдэгдэл (Workflows webhook, Adaptive Card).
  UserPromptSubmit : ажил эхэлсэн цагийг тэмдэглэнэ
  Notification     : Claude таныг хүлээж байвал шууд мэдэгдэнэ
  Stop             : MIN_SECONDS-ээс урт ажил дуусвал мэдэгдэнэ
Орчны хувьсагч: TEAMS_WEBHOOK_URL (заавал), CLAUDE_NOTIFY_MIN_SECONDS (анхдагч 60)
"""
import json, os, ssl, sys, tempfile, time, urllib.request


def _ssl_context():
    """macOS-ийн python.org Python гэрчилгээгүй байдаг тул certifi байвал түүнийг ашиглана."""
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()  # SSL_CERT_FILE орчны хувьсагчийг ч уншина

data = json.load(sys.stdin)
event = data.get("hook_event_name", "")
session = data.get("session_id", "x")
project = os.path.basename(os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd", "")) or "төсөл"
stamp = os.path.join(tempfile.gettempdir(), f"claude-teams-{session}")
webhook = os.environ.get("TEAMS_WEBHOOK_URL")
min_seconds = int(os.environ.get("CLAUDE_NOTIFY_MIN_SECONDS", "60"))


def send(title: str, text: str) -> None:
    if not webhook:
        return  # webhook тохируулаагүй бол чимээгүй өнгөрнө
    card = {
        "type": "message",
        "attachments": [{
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard", "version": "1.4",
                "body": [
                    {"type": "TextBlock", "text": title, "weight": "Bolder", "size": "Medium", "wrap": True},
                    {"type": "TextBlock", "text": text, "wrap": True},
                ],
            },
        }],
    }
    req = urllib.request.Request(webhook, data=json.dumps(card).encode(),
                                 headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=10, context=_ssl_context())
    except Exception as e:
        print(f"Teams руу илгээж чадсангүй: {e}", file=sys.stderr)


if event == "UserPromptSubmit":
    open(stamp, "w").write(str(time.time()))

elif event == "Notification":
    msg = data.get("message") or "Claude таны хариуг хүлээж байна"
    send(f"🔔 {project}", msg)

elif event == "Stop":
    if os.path.exists(stamp):
        elapsed = time.time() - float(open(stamp).read() or 0)
        os.remove(stamp)
        if elapsed >= min_seconds:
            m, s = divmod(int(elapsed), 60)
            send(f"✅ {project}", f"Claude ажлаа дуусгалаа ({m} мин {s} сек)")

sys.exit(0)  # hook хэзээ ч Claude-ийн ажлыг саатуулахгүй
