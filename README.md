# ReadMe — Registro de lecturas (Django REST + React)

App full-stack para **buscar libros (OpenLibrary)** y **guardar lecturas** con fechas, rating y notas. Incluye **JWT**, CRUD y vistas con métricas.

## 🧭 Demo
- Frontend (Vercel/Netlify): **TODO**
- API (Render/Railway): **TODO**  
- Healthcheck: `/admin/` o `/api/` (según config)

## 🏗️ Arquitectura
- **Frontend:** React/Next.js + Axios + Tailwind
- **Backend:** Django REST Framework + SimpleJWT
- **DB:** SQLite (dev) / MySQL o Postgres (prod)
- **Integración externa:** OpenLibrary (search/title o ISBN)

![UI](./docs/screenshot1.png)
![UI](./docs/screenshot2.png)

## 🚀 Setup rápido

### Backend
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate   # Win
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
