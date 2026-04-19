"""Регистрация пользователя: сохраняет email и телефон, отправляет приветственное письмо и SMS."""
import json
import os
import smtplib
import urllib.request
import urllib.parse
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_welcome_email(email: str):
    host = os.environ.get("SMTP_HOST", "")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER", "")
    password = os.environ.get("SMTP_PASSWORD", "")

    if not all([host, user, password]):
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Добро пожаловать в Памятные! 🎉"
    msg["From"] = user
    msg["To"] = email

    html = """
    <html><body style="font-family: Georgia, serif; background: #fafafa; padding: 40px; color: #1a1a1a;">
      <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
        <h1 style="font-size: 32px; margin-bottom: 8px;">Памятные 🎁</h1>
        <p style="color: #666; font-size: 15px; margin-bottom: 32px;">Сервис напоминаний о важных датах</p>
        <h2 style="font-size: 22px; margin-bottom: 16px;">Вы в команде!</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Спасибо за регистрацию. Теперь вы больше никогда не забудете дни рождения, годовщины и другие важные даты ваших близких.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 16px;">
          Скоро мы пришлём вам напоминание — как только добавите первую дату.
        </p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; color: #999; font-size: 13px;">
          © 2025 Памятные. Все права защищены.
        </div>
      </div>
    </body></html>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL(host, port) as server:
        server.login(user, password)
        server.sendmail(user, email, msg.as_string())


def send_welcome_sms(phone: str):
    api_key = os.environ.get("SMS_API_KEY", "")
    if not api_key or not phone:
        return

    clean_phone = "".join(filter(str.isdigit, phone))
    if clean_phone.startswith("8"):
        clean_phone = "7" + clean_phone[1:]

    text = "Добро пожаловать в Памятные! Вы успешно зарегистрировались. Теперь не забывайте о важных датах близких :)"
    params = urllib.parse.urlencode({
        "api_id": api_key,
        "to": clean_phone,
        "msg": text,
        "json": 1,
    })
    url = f"https://sms.ru/sms/send?{params}"
    urllib.request.urlopen(url, timeout=10)


def handler(event: dict, context) -> dict:
    """Регистрация: сохраняет email и телефон, отправляет приветствие."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    email = (body.get("email") or "").strip().lower()
    phone = (body.get("phone") or "").strip()

    if not email:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Email обязателен"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("SELECT id FROM subscribers WHERE email = %s", (email,))
    existing = cur.fetchone()

    if existing:
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True, "already": True})}

    cur.execute(
        "INSERT INTO subscribers (email, phone) VALUES (%s, %s) RETURNING id",
        (email, phone or None)
    )
    conn.commit()
    cur.close()
    conn.close()

    try:
        send_welcome_email(email)
    except Exception:
        pass

    try:
        if phone:
            send_welcome_sms(phone)
    except Exception:
        pass

    return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}
