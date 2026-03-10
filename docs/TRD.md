# Technical Requirement Document (TRD)

## Product
PolicyWise AI

## Version
1.0

## Product Type
AI-powered Web Application

## Target Market
India

## Insurance Domain
Car Insurance

---

# 1. Purpose of the Document

The Technical Requirement Document (TRD) defines the technical architecture, system components, infrastructure, and technology stack required to build the PolicyWise AI platform.

This document serves as a blueprint for developers, AI engineers, and system architects during the development process.

---

# 2. System Overview

PolicyWise AI is a web-based AI platform that allows users to:

• Ask questions about car insurance  
• Understand insurance terminology  
• Compare insurance policies  
• Receive personalized policy recommendations  

The system uses **LLM-based AI + Retrieval Augmented Generation (RAG)** to provide accurate responses using an insurance knowledge base.

---

# 3. High-Level System Architecture

The platform architecture consists of the following layers:

User Interface (Frontend)

↓

API Gateway

↓

Backend Application Server

↓

AI Service Layer

↓

Retrieval Augmented Generation (RAG)

↓

Vector Database

↓

Insurance Knowledge Base

↓

Primary Database

---

# 4. Frontend Architecture

## Framework

Next.js (React Framework)

## Styling

TailwindCSS

## UI Component Library

Shadcn UI

## Responsibilities

Frontend handles:

• User interface rendering  
• Chat interface for AI assistant  
• Policy search and comparison  
• User input collection  
• API communication with backend  

## Key UI Components

• AI Chat Interface  
• Policy Comparison Dashboard  
• Policy Recommendation Form  
• Insurance Term Search  
• User Input Form

---

# 5. Backend Architecture

## Framework

FastAPI (Python)

## Responsibilities

Backend handles:

• API routing  
• business logic  
• AI request handling  
• policy data processing  
• integration with AI services  

## Backend Modules

api/

Handles REST API endpoints

services/

Business logic services

ai/

AI-related services

database/

Database models and queries

models/

Data models

utils/

Helper utilities

---

# 6. AI System Architecture

PolicyWise AI uses **Retrieval Augmented Generation (RAG)**.

This allows the AI to answer questions using real insurance knowledge rather than relying only on training data.

## AI Workflow

User Query

↓

Embedding Generation

↓

Vector Database Search

↓

Relevant Knowledge Retrieval

↓

LLM Response Generation

↓

Response returned to user

---

# 7. AI Models

Possible AI models:

OpenAI GPT models

Claude (Anthropic)

Meta Llama models

For MVP, the system can use:

OpenAI GPT API or Claude API.

---

# 8. RAG Knowledge Base

The RAG system will store structured insurance knowledge including:

• car insurance definitions  
• policy terms  
• claim conditions  
• add-ons  
• exclusions  
• insurance company policy details  

Data sources may include:

• insurance company websites  
• policy documents  
• regulatory resources  
• verified insurance guides

---

# 9. Vector Database

Vector database is used for semantic search.

Possible options:

Pinecone

Weaviate

ChromaDB

For MVP:

ChromaDB or Pinecone is recommended.

Vector database stores:

• embeddings of insurance knowledge documents  
• embeddings of policy descriptions

---

# 10. Primary Database

Primary relational database:

PostgreSQL

Stores:

• insurance companies  
• policies  
• policy attributes  
• add-ons  
• coverage information  
• user queries (optional analytics)

Example schema tables:

insurance_companies

policies

policy_addons

policy_features

user_queries

---

# 11. API Design

All system functionality will be accessed via REST APIs.

### Example API Endpoints

POST /api/ask

Send question to AI assistant.

POST /api/recommend

Get recommended policies.

GET /api/policies

Retrieve available policies.

GET /api/policy/{id}

Get detailed policy information.

POST /api/compare

Compare selected policies.

---

# 12. Data Processing Pipeline

Insurance data must be processed before entering the knowledge base.

Pipeline:

Data Collection

↓

Data Cleaning

↓

Document Chunking

↓

Embedding Generation

↓

Vector Storage

---

# 13. Security Requirements

Security measures include:

• HTTPS encrypted communication  
• API authentication  
• rate limiting for AI endpoints  
• protection against prompt injection  
• input validation  

User data privacy must follow standard security practices.

---

# 14. Performance Requirements

Target performance metrics:

AI response time:  
2–4 seconds

API response time:  
under 500ms

System uptime:  
99%

Concurrent users supported:  
1000+ for MVP

---

# 15. Scalability Considerations

The system should be scalable using:

• containerization (Docker)  
• load balancing  
• horizontal scaling for backend services  
• cloud-based AI APIs  

Possible deployment architecture:

Frontend → Vercel

Backend → AWS / GCP

Database → Managed PostgreSQL

Vector DB → Cloud hosted

---

# 16. Logging and Monitoring

Monitoring tools may include:

• Prometheus  
• Grafana  
• Cloud logging systems

Logs should include:

• API request logs  
• AI query logs  
• error logs

---

# 17. Deployment Architecture

Deployment components:

Frontend hosting

Vercel

Backend hosting

AWS EC2 or GCP Compute Engine

Database hosting

Managed PostgreSQL (AWS RDS)

Vector database hosting

Pinecone or managed vector DB

---

# 18. Development Environment

Primary development environment:

Antigravity Desktop

Supporting tools:

Claude – architecture reasoning

Gemini – UI design suggestions

Grok – debugging assistance

Perplexity – insurance research

GitHub – version control

Postman / Thunder Client – API testing

---

# 19. Future Technical Enhancements

Future versions may include:

Policy PDF document analysis

Computer vision for scanned policy documents

AI claim risk prediction

Personalized insurance advisor engine

---

# End of TRD