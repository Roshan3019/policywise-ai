# 🚗 PolicyWise AI
## Intelligent Car Insurance Analysis & Recommendation System

> An AI-powered web platform that helps users understand, compare, and choose the best car insurance policies in India — powered by FastAPI, Next.js, PostgreSQL, LangChain, and RAG (Retrieval Augmented Generation).

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Core Features](#core-features)
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
- [Target Users](#target-users)
- [Future Roadmap](#future-roadmap)

---

## About the Project

**PolicyWise AI** is an intelligent car insurance advisory platform designed for users in India.

Car insurance documents contain complex legal terminology, hidden exclusions, and confusing claim conditions that most users cannot easily understand. PolicyWise AI acts as a **digital insurance advisor** — using AI to simplify policies, answer user questions in plain language, and recommend the most suitable insurance plan.

---

## The Problem

Most car insurance users in India:

- Don't fully understand what their policy covers
- Overpay for unnecessary coverage
- Face claim rejections due to misunderstood terms
- Cannot easily compare policies across insurance companies

---

## Our Solution

PolicyWise AI provides:

| Feature | Description |
|---|---|
| 🤖 **AI Insurance Assistant** | Ask questions in plain language — get instant, simple answers |
| 🔍 **Insurance Term Explainer** | Understand terms like IDV, NCB, Zero Depreciation, Add-ons |
| 📊 **Policy Comparison Tool** | Compare policies by premium, coverage, add-ons, claim ratio |
| 🎯 **Smart Recommendations** | Input car model, city, budget → get the best policy matches |
| 📋 **Claim Scenario Guidance** | Ask real-world claim questions and understand eligibility |

---

## Core Features

### 🤖 AI Insurance Assistant
Ask questions like:
- *"What is Zero Depreciation in car insurance?"*
- *"What is No Claim Bonus?"*
- *"What is IDV and how is it calculated?"*

### 🎯 Policy Recommendation System
Users provide: car model, city, budget, coverage preference → system returns best-matched policies.

### 📊 Policy Comparison
Compare multiple insurance policies side-by-side based on premium, coverage, add-ons, and claim settlement ratio.

### 📋 Claim Scenario Guidance
Ask real-world scenarios like:
- *"My car was damaged in a flood — can I claim insurance?"*

The AI explains claim eligibility based on policy conditions.

---

## Tech Stack

### 🖥️ Backend
| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.111.0 | REST API framework |
| **Uvicorn** | 0.29.0 | ASGI server |
| **SQLAlchemy** | 2.0.30 | Async ORM |
| **Alembic** | 1.13.1 | Database migrations |
| **PostgreSQL** | Latest | Primary relational database |
| **Pydantic v2** | 2.7.1 | Data validation & settings |
| **Loguru** | 0.7.2 | Structured logging |
| **LangChain** | 0.2.3 | AI/RAG pipeline *(Phase 2)* |
| **OpenAI GPT** | 1.30.1 | LLM for AI responses *(Phase 2)* |
| **ChromaDB** | 0.5.0 | Vector store for RAG *(Phase 2)* |

### 🎨 Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React framework (App Router) |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Shadcn UI** | Latest | UI component library *(Phase 3)* |

---

## Project Structure

```
policywise-ai/
│
├── backend/                        # FastAPI backend
│   ├── ai/                         # AI pipeline (Phase 2)
│   ├── alembic/                    # Database migrations
│   │   └── versions/               # Migration history
│   │       └── bd3311e2b2a7_*.py   # Initial schema (users table)
│   ├── api/
│   │   └── v1/                     # Versioned API routes
│   │       └── health.py           # Health check endpoint
│   ├── database/
│   │   ├── base.py                 # SQLAlchemy declarative base
│   │   └── connection.py           # Async DB engine & session
│   ├── models/
│   │   └── user.py                 # User ORM model
│   ├── services/                   # Business logic layer
│   ├── utils/
│   │   └── config.py               # Pydantic settings (loads .env)
│   ├── main.py                     # FastAPI app entry point
│   ├── alembic.ini                 # Alembic configuration
│   └── requirements.txt            # Python dependencies
│
└── frontend/                       # Next.js frontend
    ├── public/                     # Static assets
    ├── src/
    │   └── app/                    # Next.js App Router
    │       ├── layout.tsx          # Root layout
    │       ├── page.tsx            # Home page
    │       └── globals.css         # Global styles
    ├── package.json
    └── tsconfig.json
```

---

## Phase Progress

| Phase | Focus Area | Key Deliverables | Status |
|---|---|---|---|
| **Phase 1** | Project Foundation & Infrastructure | FastAPI scaffold, PostgreSQL setup, Alembic migrations, Next.js frontend init, project structure, health API | ✅ Complete |
| **Phase 2** | AI & RAG Integration | LangChain setup, insurance knowledge base, ChromaDB vector store, embedding pipeline, AI Q&A API (`POST /api/ask`) | 🔜 Upcoming |
| **Phase 3** | Core Product Features | Policy comparison tool, smart recommendation engine, claim scenario guidance, frontend UI with Shadcn, user auth | 🔜 Upcoming |
| **Phase 4** | Polish, Performance & Deployment | Analytics dashboard, monitoring (Prometheus/Grafana), Docker containerization, deployment to Vercel + AWS/GCP | 🔜 Upcoming |

---

## Getting Started

### Prerequisites

Ensure the following are installed:

- **Python** 3.11 or 3.12 *(recommended — Python 3.14 has limited package compatibility)*
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

> ⚠️ **Note for Python 3.14 users:** `asyncpg` and `psycopg2-binary` may fail to compile. Use Python **3.11 or 3.12** for full compatibility.

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

# Vector DB path (Phase 2)
VECTOR_DB_PATH=../data/vector_store
```

---

### 3. Database Setup

#### a) Create the PostgreSQL database

Open psql or pgAdmin and run:

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

This creates all required tables (e.g., `users`) defined in the migration files.

#### c) Check migration status (optional)

```bash
alembic current     # Current revision applied
alembic history     # Full migration history
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

---

## Running the Application

### ▶️ Start the Backend (FastAPI)

From the `backend/` directory with `.venv` activated:

```bash
# Windows
.venv\Scripts\uvicorn.exe main:app --reload --port 8000

# macOS / Linux
uvicorn main:app --reload --port 8000
```

Backend live at: **http://localhost:8000**

### ▶️ Start the Frontend (Next.js)

From the `frontend/` directory:

```bash
npm run dev
```

Frontend live at: **http://localhost:3000**

---

## Environment Variables

| Variable | Required | Phase | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ Yes | Phase 1 | Sync PostgreSQL connection string |
| `DATABASE_ASYNC_URL` | ✅ Yes | Phase 1 | Async PostgreSQL connection string (`asyncpg`) |
| `DEBUG` | ❌ Optional | Phase 1 | Enable debug mode (`True`/`False`) |
| `APP_NAME` | ❌ Optional | Phase 1 | Application display name |
| `APP_VERSION` | ❌ Optional | Phase 1 | Application version |
| `OPENAI_API_KEY` | 🔜 Phase 2 | Phase 2 | OpenAI API key for LLM responses |
| `VECTOR_DB_PATH` | 🔜 Phase 2 | Phase 2 | Path to ChromaDB vector store |

---

## API Reference

### Current Endpoints (Phase 1)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Server health check |

**Health Check Response:**
```json
{
  "status": "ok",
  "app": "PolicyWise AI"
}
```

### Planned Endpoints (Phase 2+)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ask` | Ask AI insurance question |
| `POST` | `/api/recommend` | Get personalized policy recommendations |
| `GET` | `/api/policies` | List available insurance policies |
| `GET` | `/api/policy/{id}` | Get detailed policy info |
| `POST` | `/api/compare` | Compare multiple policies |

### 📚 Interactive Docs (auto-generated by FastAPI)

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Target Users

| User Type | Need |
|---|---|
| 🚗 First-time car owners | Understand basic insurance terms and coverage |
| 🔄 Policy renewal users | Compare current vs better policies, reduce premium |
| 🔍 Insurance researchers | Learn car insurance concepts in simple language |
| 💼 Insurance agents *(future)* | Use as a knowledge lookup and advisory tool |

---

## Future Roadmap

- 📄 Policy PDF document upload & analysis
- 🔮 AI claim risk prediction
- 👤 Personal insurance advisor (user profiles)
- 🏥 Expansion to health, life, and travel insurance
- 📱 Mobile-responsive progressive web app

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Roshan3019">Roshan</a> &nbsp;|&nbsp;
  <a href="docs/PROJECT_OVERVIEW.md">Project Overview</a> &nbsp;|&nbsp;
  <a href="docs/PRD.md">PRD</a> &nbsp;|&nbsp;
  <a href="docs/TRD.md">TRD</a> &nbsp;|&nbsp;
  <a href="docs/SRS.md">SRS</a>
</p>
