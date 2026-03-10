# 🏛️ PolicyWise AI — Intelligent Policy Analysis & Recommendation System

> An AI-powered platform for intelligent policy analysis, document understanding, and smart recommendations — built with FastAPI, Next.js, PostgreSQL, and LangChain.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Phase Progress](#phase-progress)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Database Setup](#3-database-setup)
  - [4. Frontend Setup](#4-frontend-setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## About the Project

**PolicyWise AI** is a full-stack intelligent system that enables users to:
- Upload and analyze policy documents using AI
- Get smart, context-aware policy recommendations
- Ask natural language questions about complex policies (RAG-powered)
- Manage and track policy changes over time

This project is being built in phases — from core infrastructure to a fully AI-powered policy intelligence platform.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.111.0 | REST API framework |
| **Uvicorn** | 0.29.0 | ASGI server |
| **SQLAlchemy** | 2.0.30 | ORM (async) |
| **Alembic** | 1.13.1 | Database migrations |
| **PostgreSQL** | Latest | Primary database |
| **Pydantic v2** | 2.7.1 | Data validation & settings |
| **Loguru** | 0.7.2 | Structured logging |
| **LangChain** | 0.2.3 | AI/RAG pipeline *(Phase 2)* |
| **OpenAI** | 1.30.1 | LLM integration *(Phase 2)* |
| **ChromaDB** | 0.5.0 | Vector store *(Phase 2)* |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React framework (App Router) |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |

---

## Project Structure

```
policywise-ai/
│
├── backend/                    # FastAPI backend
│   ├── ai/                     # AI pipeline modules (Phase 2)
│   ├── alembic/                # Database migration scripts
│   │   └── versions/           # Migration history
│   ├── api/
│   │   └── v1/                 # Versioned API routes
│   │       └── health.py       # Health check endpoint
│   ├── database/
│   │   ├── base.py             # SQLAlchemy base model
│   │   └── connection.py       # Async DB engine & session
│   ├── models/
│   │   └── user.py             # User ORM model
│   ├── services/               # Business logic layer
│   ├── utils/
│   │   └── config.py           # Pydantic settings (loads .env)
│   ├── main.py                 # FastAPI app entry point
│   ├── alembic.ini             # Alembic configuration
│   └── requirements.txt        # Python dependencies
│
└── frontend/                   # Next.js frontend
    ├── public/                 # Static assets
    ├── src/
    │   └── app/                # Next.js App Router
    │       ├── layout.tsx      # Root layout
    │       ├── page.tsx        # Home page
    │       └── globals.css     # Global styles
    ├── package.json
    └── tsconfig.json
```

---

## Phase Progress

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Project setup, FastAPI scaffold, DB models, Alembic migrations, Next.js frontend init | ✅ Complete |
| **Phase 2** | AI/RAG pipeline, LangChain integration, document upload & vector search | 🔜 Upcoming |
| **Phase 3** | Policy recommendation engine, user authentication, dashboards | 🔜 Upcoming |
| **Phase 4** | Advanced analytics, notifications, production deployment | 🔜 Upcoming |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Python** 3.11 or 3.12 *(recommended — Python 3.14 has limited package support)*
- **Node.js** 18+ and **npm**
- **PostgreSQL** 14+
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/Roshan3019/policywise-ai.git
cd policywise-ai
```

---

### 2. Backend Setup

#### a) Create and activate a virtual environment

```bash
cd backend

# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### b) Install dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ **Note:** If you are on **Python 3.14**, `asyncpg` and `psycopg2-binary` may fail to compile. Downgrade to Python 3.11 or 3.12 for full compatibility.

#### c) Create your `.env` file

Create a `.env` file inside the `backend/` directory:

```env
# Application
APP_NAME=PolicyWise AI
APP_VERSION=0.1.0
DEBUG=True

# Database (PostgreSQL)
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/policywise_db
DATABASE_ASYNC_URL=postgresql+asyncpg://your_user:your_password@localhost:5432/policywise_db

# OpenAI (required in Phase 2)
OPENAI_API_KEY=your_openai_api_key_here

# Vector DB (Phase 2)
VECTOR_DB_PATH=../data/vector_store
```

---

### 3. Database Setup

#### a) Create the PostgreSQL database

Open your PostgreSQL shell (psql) or use pgAdmin:

```sql
CREATE DATABASE policywise_db;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE policywise_db TO your_user;
```

#### b) Run Alembic migrations

From the `backend/` directory (with `.venv` activated):

```bash
alembic upgrade head
```

This will create all the required tables (e.g., `users`) in your database.

#### c) Check migration status (optional)

```bash
alembic current   # Shows current revision
alembic history   # Shows all migration history
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

---

## Running the Application

### Start the Backend (FastAPI)

From the `backend/` directory with `.venv` activated:

```bash
# Windows
.venv\Scripts\uvicorn.exe main:app --reload --port 8000

# macOS / Linux
uvicorn main:app --reload --port 8000
```

Backend will be live at: **http://localhost:8000**

### Start the Frontend (Next.js)

From the `frontend/` directory:

```bash
npm run dev
```

Frontend will be live at: **http://localhost:3000**

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | Sync PostgreSQL connection string |
| `DATABASE_ASYNC_URL` | ✅ Yes | Async PostgreSQL connection string (`asyncpg`) |
| `DEBUG` | ❌ Optional | Enable debug mode (`True`/`False`) |
| `APP_NAME` | ❌ Optional | Application display name |
| `APP_VERSION` | ❌ Optional | Application version string |
| `OPENAI_API_KEY` | 🔜 Phase 2 | OpenAI API key for LLM features |
| `VECTOR_DB_PATH` | 🔜 Phase 2 | Path to ChromaDB vector store |

---

## API Reference

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Returns server health status |

**Response:**
```json
{
  "status": "ok",
  "app": "PolicyWise AI"
}
```

### Interactive API Docs

FastAPI provides auto-generated interactive documentation:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

<p align="center">Built with ❤️ by <a href="https://github.com/Roshan3019">Roshan</a></p>
