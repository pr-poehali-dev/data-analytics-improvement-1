"""Регистрация пользователя и приём заявок на напоминания с отправкой на почту владельца."""
# reload
import json
import os
import smtplib
import urllib.request
import urllib.parse
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

OWNER_EMAIL = "ruslan1.98@mail.ru"


def get_smtp():
    return (
        os.environ.get("SMTP_HOST", ""),
        int(os.environ.get("SMTP_PORT", "465")),
        os.environ.get("SMTP_USER", ""),
        os.environ.get("SMTP_PASSWORD", ""),
    )


def send_email(to: str, subject: str, html: str):
    host, port, user, password = get_smtp()
    if not all([host, user, password]):
        return
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = user
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))
    with smtplib.SMTP_SSL(host, port) as server:
        server.login(user, password)
        server.sendmail(user, to, msg.as_string())


def send_welcome_email(email: str):
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
          На следующем шаге вы добавите первую важную дату — мы напомним вовремя!
        </p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; color: #999; font-size: 13px;">
          © 2025 Памятные. Все права защищены.
        </div>
      </div>
    </body></html>
    """
    send_email(email, "Добро пожаловать в Памятные! 🎉", html)


def send_date_request_to_owner(data: dict):
    email = data.get("email", "—")
    phone = data.get("phone", "—") or "не указан"
    person_name = data.get("personName", "—")
    occasion = data.get("occasion", "—")
    occasion_date = data.get("occasionDate", "—")
    gift_types = data.get("giftTypes", "не выбраны") or "не выбраны"
    gift_comment = data.get("giftComment", "") or "нет"

    html = f"""
    <html><body style="font-family: Georgia, serif; background: #fafafa; padding: 40px; color: #1a1a1a;">
      <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
        <h1 style="font-size: 26px; margin-bottom: 4px;">🎁 Новая заявка — Памятные</h1>
        <p style="color: #888; font-size: 13px; margin-bottom: 32px;">Пользователь заполнил форму напоминания</p>

        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 10px 0; color: #888; width: 40%; border-bottom: 1px solid #f0f0f0;">📧 Email</td>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">{email}</td></tr>
          <tr><td style="padding: 10px 0; color: #888; border-bottom: 1px solid #f0f0f0;">📱 Телефон</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{phone}</td></tr>
          <tr><td style="padding: 10px 0; color: #888; border-bottom: 1px solid #f0f0f0;">👤 Кому подарок</td>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">{person_name}</td></tr>
          <tr><td style="padding: 10px 0; color: #888; border-bottom: 1px solid #f0f0f0;">🎉 Повод</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{occasion}</td></tr>
          <tr><td style="padding: 10px 0; color: #888; border-bottom: 1px solid #f0f0f0;">📅 Дата</td>
              <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">{occasion_date}</td></tr>
          <tr><td style="padding: 10px 0; color: #888; border-bottom: 1px solid #f0f0f0;">🎀 Тип подарка</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{gift_types}</td></tr>
          <tr><td style="padding: 10px 0; color: #888;">💬 Комментарий</td>
              <td style="padding: 10px 0;">{gift_comment}</td></tr>
        </table>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; color: #999; font-size: 13px;">
          Памятные · автоматическое уведомление
        </div>
      </div>
    </body></html>
    """
    send_email(OWNER_EMAIL, f"📅 Новая заявка от {email} — {person_name}, {occasion}", html)


def send_confirmation_to_user(email: str, person_name: str, occasion: str, occasion_date: str):
    html = f"""
    <html><body style="font-family: Georgia, serif; background: #fafafa; padding: 40px; color: #1a1a1a;">
      <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
        <h1 style="font-size: 28px; margin-bottom: 8px;">Памятные 🎁</h1>
        <p style="color: #666; font-size: 15px; margin-bottom: 32px;">Заявка принята!</p>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Мы запомнили: <strong>{occasion}</strong> у <strong>{person_name}</strong> — <strong>{occasion_date}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 16px;">
          Мы напомним вам заблаговременно, чтобы вы успели подготовить подарок и порадовать близкого человека 💝
        </p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; color: #999; font-size: 13px;">
          © 2025 Памятные. Все права защищены.
        </div>
      </div>
    </body></html>
    """
    send_email(email, f"✅ Напоминание о {occasion} добавлено!", html)


def send_welcome_sms(phone: str):
    api_key = os.environ.get("SMS_API_KEY", "")
    if not api_key or not phone:
        return
    clean_phone = "".join(filter(str.isdigit, phone))
    if clean_phone.startswith("8"):
        clean_phone = "7" + clean_phone[1:]
    text = "Добро пожаловать в Памятные! Вы успешно зарегистрировались. Больше не забывайте о важных датах близких :)"
    params = urllib.parse.urlencode({"api_id": api_key, "to": clean_phone, "msg": text, "json": 1})
    urllib.request.urlopen(f"https://sms.ru/sms/send?{params}", timeout=10)


def handler(event: dict, context) -> dict:
    """Регистрация и приём заявок на напоминания. Отправляет письма пользователю и владельцу."""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "register")
    email = (body.get("email") or "").strip().lower()
    phone = (body.get("phone") or "").strip()

    if not email:
        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Email обязателен"})}

    # --- Шаг 1: регистрация ---
    if action == "register":
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute("SELECT id FROM subscribers WHERE email = %s", (email,))
        existing = cur.fetchone()
        if not existing:
            cur.execute("INSERT INTO subscribers (email, phone) VALUES (%s, %s)", (email, phone or None))
            conn.commit()
            try:
                send_welcome_email(email)
            except Exception:
                pass
            try:
                if phone:
                    send_welcome_sms(phone)
            except Exception:
                pass
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    # --- Шаг 2: заявка с датами и подарками ---
    if action == "submit_dates":
        person_name = body.get("personName", "")
        occasion = body.get("occasion", "")
        occasion_date = body.get("occasionDate", "")

        try:
            send_date_request_to_owner(body)
        except Exception:
            pass
        try:
            send_confirmation_to_user(email, person_name, occasion, occasion_date)
        except Exception:
            pass

        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Неизвестное действие"})}