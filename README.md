# Aura Artisanal Teas — Product Showcase & Admin CMS

A high-performance, responsive product showcase website and lightweight Content Management System (CMS) for an artisanal tea firm, inspired by `pbai.in` (*Purple Bean Agro Industries*) with an original luxury botanical visual identity.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, React Router v6
- **Backend**: Python 3.14, FastAPI, SQLModel (SQLAlchemy 2.0 + Pydantic v2), Uvicorn
- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: SQLite (default local) / Turso (libSQL) / Neon (PostgreSQL) via `DATABASE_URL`
- **Deployment**: Cloudflare Pages (Frontend) + Render / Koyeb (Backend)

---

## Project Structure

```text
Projects/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Route Handlers (auth, products, content, contact, upload)
│   │   ├── core/             # Configuration, Database session, Security utilities
│   │   ├── models/           # SQLModel DB & Pydantic models
│   │   ├── main.py           # FastAPI Entrypoint & CORS setup
│   │   └── seed.py           # Initial database population script
│   ├── tests/                # Automated pytest suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/                 # React + Vite Application
│   ├── public/
│   │   └── _redirects        # Cloudflare Pages SPA Routing
│   ├── src/
│   │   ├── components/       # Nav, Footer, Hero, Terroir, BrewingGuide, Modals
│   │   ├── context/          # AuthContext (JWT session state)
│   │   ├── pages/            # Public (Home, Catalog, Detail, About, Contact) & Admin (CMS)
│   │   ├── services/         # Axios / API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/
│   └── implementation_plan.md# Master plan & resumable checklist
├── .gitignore
└── README.md
```

---

## Quickstart (Local Development)

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app/seed.py
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.
