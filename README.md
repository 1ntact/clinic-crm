# CRM.

Team #238 Project. CRM.


© 2026 Team #238. All rights reserved.
This repository is publicly available for viewing and portfolio purposes only.
No permission is granted to use, copy, modify, or distribute this code
for any purpose without explicit written permission from the authors.

# 📅 Appointment Management — UI/UX Specification

> **GitHub Repository:** Internal Module Documentation  
> **Target Audience:** UI/UX Designers, Frontend Developers

Цей документ містить повний опис логіки, статусних переходів, форм та API-ендпоінтів для проектування інтерфейсу модуля управління зустрічами (**Appointment Management**).

---

## 🔄 1. Життєвий цикл зустрічі (Status Flow)

Зустріч проходить через чіткий цикл статусів:

```mermaid
stateDiagram-v2
    [*] --> scheduled
    scheduled --> confirmed: Confirm
    scheduled --> cancelled: Cancel
    confirmed --> completed: Complete
    confirmed --> no_show: Mark as No-Show
    confirmed --> cancelled: Cancel
    cancelled --> scheduled: Restore

⏱ Вплив статусів на часовий слот лікаря
🔒 Займають слот: scheduled, confirmed

🔓 Звільняють слот: completed, cancelled, no_show

🗂 2. Дані та поля відображення
📩 Backend Response Example (GET /appointments/{id}/)
{
  "id": 4,
  "patient_id": 2,
  "doctor_id": 1,
  "date_time": "2026-07-23T20:30:00Z",
  "duration": 30,
  "reason_for_visit": "Consultation",
  "status": "confirmed",
  "channel": "walk_in",
  "created_at": "2026-07-23T19:48:10.773599Z",
  "patient_first_name": "John",
  "patient_last_name": "Doe",
  "patient_phone_number": null,
  "doctor_first_name": "Andrii",
  "doctor_last_name": "Yarotskyi"
}

📊 3. Таблиця та Фільтрація (GET /appointments/)
Фільтри
В інтерфейсі списку мають бути присутні:

[x] Пошук / фільтр за лікарем (doctor_id)

[x] Пошук / фільтр за пацієнтом (patient_id)

[x] Фільтр за датою (appointment_date) або діапазоном (date_from, date_to)

[x] Фільтр за статусом (appointment_status)

[x] Пагінація (limit max 100, offset)

[x] Кнопка Створення запису + Перехід до деталей

[!NOTE]
Якщо список порожній (Empty State), відображати повідомлення: "Зустрічей не знайдено".


🛠 4. Матриця дій (Actions Matrix)
Залежно від поточного статусу запису, у таблиці та картці деталей мають бути активні відповідні кнопки:
scheduled	✏️ Edit, 🟢 Confirm, 🚫 Cancel, 🗑 Delete
confirmed	✏️ Edit, ✅ Complete, 👤❌ No-show, 🚫 Cancel, 🗑 Delete
cancelled	🔄 Restore, 🗑 Delete
completed	👁 View Details, 🗑 Delete
no_show	👁 View Details, 🗑 Delete


[!WARNING]
Особливості дій у минулому часі:

Кнопки Confirm та Restore мають бути disabled, якщо запланована дата вже минула.

Для підтверджених зустрічей (confirmed) у минулому залишаються доступними лише Complete та No-show.

Cancel лише міняє статус на cancelled (запис залишається в історії).

Delete (DELETE /appointments/{id}/) повністю видаляє запис і вимагає конфлейм-модалки: "Цю дію неможливо скасувати".


🎨 5. Візуальне оформлення (UI Guidelines)
Статуси (Badges)
Не покладайтеся тільки на колір — обов'язково залишайте текст статусу:

scheduled ➔ Scheduled (🔵 Інформаційний / Синій)

confirmed ➔ Confirmed (🟢 Активний / Зелений)

completed ➔ Completed (🔘 Завершений / Сірий)

cancelled ➔ Cancelled (🔴 Скасований / Червоний)

no_show ➔ No-show (🟠 Неявка / Помаранчевий)


Канали запису (channel)
Значення з бази слід перетворювати у Human-readable формат:

walk_in ➔ Walk-in