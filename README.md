# 📚 ReadMe — Registro de lecturas y notas

**ReadMe** es una aplicación **fullstack** (Django REST + React/TypeScript) para registrar los libros que leés, guardar fechas de lectura, puntajes, lugar donde los terminaste y notas por página.  
Está pensada como un **diario de lectura personal**, simple pero escalable.

---

## ✨ Funcionalidades principales

- 🔍 **Búsqueda de libros** usando la API pública de **OpenLibrary** (backend).
- 📥 **Guardar lecturas** asociando un libro a un usuario.
- 🗓 **Fechas de lectura**: inicio y fin.
- 📍 **Lugar** donde terminaste el libro (opcional).
- ⭐ **Puntaje** del libro (rating 1–5).
- 📝 **Comentario general** sobre la lectura.
- 📑 **Notas por página**:
  - Texto libre.
  - Número de página (opcional).
  - Fecha de creación de la nota.
- 📚 **Listado de “Mis lecturas”** con cards de cada libro.
- 🔎 **Detalle de lectura** con todas las notas asociadas.
- 🔐 **Login** con token (modo demo habilitado para facilitar la prueba).

---

## 🧱 Stack tecnológico

### Frontend

- ⚛ **React** + **TypeScript**
- 🧭 **React Router DOM** (navegación SPA)
- 🎨 **Tailwind CSS** (estilos utilitarios)
- 🔐 Contexto de autenticación con **AuthContext**

### Backend

- 🐍 **Django** + **Django REST Framework**
- 🔑 Autenticación con token (endpoints protegidos)
- 🌍 Integración con **OpenLibrary API** para obtener datos de libros
- 🗄 Base de datos relacional (SQLite / MySQL)

> Este repositorio corresponde al **frontend**. El backend se encuentra en un proyecto Django separado.

---

## 🖼️ Pantallas (frontend)

- **Login**  
  Formulario simple de usuario/contraseña, con validación mínima y mensajes de error.  
  > En modo demo, si el backend no responde el login igualmente redirige al dashboard para poder explorar la UI.

- **📚 Mis lecturas** (`/mis-lecturas`)  
  Vista principal tipo **dashboard**:
  - Cards con portada, título, autor.
  - Fechas de inicio/fin.
  - Lugar, puntaje y comentario breve.
  - Click en la card → abre el detalle de la lectura.

- **📖 Detalle de lectura** (`/lecturas/:id`)  
  Muestra:
  - Datos del libro (título, autor, portada).
  - Fechas de lectura, lugar, puntaje, comentario.
  - Listado de notas asociadas (contenido, número de página, fecha).

---

## 🚀 Cómo correr el frontend

### 1. Clonar el repositorio

```bash
git clone https://github.com/USER/ReadMe-frontend.git
cd ReadMe-frontend
2. Instalar dependencias
bash
Copiar código
npm install
3. Configurar la URL del backend
En src/pages/LoginPage.tsx y en los archivos de src/api/ asegurate de apuntar a tu backend:

ts
Copiar código
axios.post("http://localhost:8000/api/login/", { ... })
y en readings.ts algo como:

ts
Copiar código
const API_URL = "http://localhost:8000/api";
4. Ejecutar en modo desarrollo
bash
Copiar código
npm run dev
Abrí en el navegador:

text
Copiar código
http://localhost:5173
🔐 Modo demo
Para facilitar que recruiters y testers vean la interfaz:

El LoginPage intenta hacer login real contra el backend.

Si el login falla (backend apagado, CORS, etc.), muestra un mensaje pero igual redirige a /mis-lecturas.

Esto permite navegar el dashboard sin depender de que el backend esté siempre disponible.

En un entorno real, esto se puede cambiar fácilmente para exigir login 100% real.

🧩 Estructura de carpetas (frontend)
txt
Copiar código
src/
  api/
    AuthContext.tsx      // contexto de autenticación (token)
    readings.ts          // funciones para consumir el API de lecturas
  pages/
    LoginPage.tsx        // pantalla de login
    MyReadingsPage.tsx   // listado de lecturas
    ReadingDetailPage.tsx// detalle de una lectura
  App.tsx                // router y layout principal
  main.tsx               // punto de entrada
  style.css              // estilos globales + Tailwind
🧠 Cosas por mejorar / Roadmap
✅ Filtros y búsqueda dentro de “Mis lecturas”.

✅ Formulario para agregar nuevas lecturas desde el frontend.

✅ CRUD completo de notas (crear, editar, borrar).

🔒 Protección de rutas según autenticación (PrivateRoute).

🌙 Modo oscuro / claro configurable.

🌐 Deploy de backend y frontend para demo pública.

👩‍💻 Autora
Desarrollado por Berenice Solohaga

💼 LinkedIn: www.linkedin.com/in/berenice-solohaga

🌐 Portfolio: https://portfoliobereail.netlify.app/

🌐 AIL Online: https://ailonline.com.ar/

