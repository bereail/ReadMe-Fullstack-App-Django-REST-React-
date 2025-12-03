📚 ReadMe — Registro de lecturas y notas


ReadMe es una aplicación fullstack (Django REST + React/TypeScript) para registrar libros leídos, fechas, puntajes, comentarios y notas por página.
Funciona como un diario de lectura personal, intuitivo y fácil de escalar.

✨ Funcionalidades principales

🔍 Búsqueda de libros usando OpenLibrary API

📥 Registrar lecturas por usuario

🗓 Fechas de inicio y fin

📍 Lugar donde se terminó el libro

⭐ Puntaje (1–5)

📝 Comentario general

📑 Notas por página (texto + fecha + número de página)

📚 Dashboard con todas las lecturas

🔎 Detalle completo de una lectura

🔐 Autenticación JWT + Modo Demo para probar sin backend

🏗️ Arquitectura

Frontend: React + Vite + TypeScript, React Router, Tailwind, Axios

Backend: Django REST Framework + JWT (SimpleJWT)

DB: SQLite (dev) → preparado para PostgreSQL / MySQL

API externa: OpenLibrary (búsqueda por título e ISBN)

🖼️ Capturas del proyecto

Estas imágenes son ejemplos. Vos subí tus capturas a /docs/ o /assets/ y cambiá las rutas.

![Login](docs/login.png)
![Mis Lecturas](docs/mis-lecturas.png)
![Detalle de Lectura](docs/detalle-lectura.png)


Si querés, yo te genero imágenes estéticas con marcos tipo UI/Mockup.

🚀 Cómo correr el proyecto
🔧 Frontend
cd frontend
npm install
npm run dev


URL por defecto:

http://localhost:5173


Configurar la URL del backend en:

src/pages/LoginPage.tsx

src/api/readings.ts

Ejemplo:

const API_URL = "http://localhost:8000/api";

⚙️ Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Admin:

/admin

🔐 Modo Demo (recruiter-friendly)

Si el backend no responde, el login igual te deja entrar a /mis-lecturas.

Esto permite probar la UI sin backend ni setup adicional.

🧩 Estructura del frontend
src/
  api/
    AuthContext.tsx      
    readings.ts          
  pages/
    LoginPage.tsx        
    MyReadingsPage.tsx    
    ReadingDetailPage.tsx
  App.tsx                
  main.tsx               
  style.css              

🧠 Roadmap de mejoras

🔍 Filtro y búsqueda dentro de “Mis lecturas”

➕ Registrar nuevas lecturas desde el frontend

📝 CRUD completo de notas

🔒 PrivateRoute según autenticación

🌙 Modo oscuro/claro

🌐 Deploy público (Netlify / Render)

👩‍💻 Autora

Berenice Solohaga
💼 LinkedIn: https://www.linkedin.com/in/berenice-solohaga

🌐 Portfolio: https://portfoliobereail.netlify.app

🌐 AIL Online: https://ailonline.com.ar

🇬🇧 English Version — ReadMe (Full Documentation)
📚 ReadMe — Reading Tracker & Notes

Full-stack application built with Django REST + React/TypeScript to track reading history, ratings, reading dates, locations, and page-based notes.

✨ Features

🔍 Search books using OpenLibrary API

📥 Register readings linked to a user

🗓 Start / finish dates

📍 Completion location

⭐ Rating (1–5)

📝 Personal comment

📑 Notes per page (content + page + date)

📚 Dashboard with all readings

🔎 Detailed reading view

🔐 JWT Authentication + Demo Mode

🏗️ Architecture

Frontend: React, TypeScript, Vite, Tailwind, Axios

Backend: Django REST, JWT (SimpleJWT)

Database: SQLite (dev)

External API: OpenLibrary

🖼️ Screenshots (placeholders)
![Login](docs/login.png)
![Dashboard](docs/mis-lecturas.png)
![Reading Detail](docs/detalle-lectura.png)

🚀 Run Locally
Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
python manage.py migrate
python manage.py runserver

👩‍💻 Author

Berenice Solohaga