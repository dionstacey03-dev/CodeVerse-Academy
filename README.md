# CodeVerse Academy

A modern programming-learning platform built to help learners explore programming languages, track their learning journey, practise coding concepts, and build confidence through challenges.

## Features

- Learning overview with course progress and XP statistics
- Course catalogue with search and language filters
- My Learning dashboard and course detail views
- Coding challenges and achievement tracking
- Interactive code playground interface
- Responsive dark-themed interface
- Serverless course catalogue API for the deployed frontend

## Technology Stack

**Frontend:** React 19, TypeScript, Vite 8, CSS  
**API:** Vercel Serverless Functions (JavaScript)  
**Backend source:** Python, FastAPI, Uvicorn

## Repository Structure

```text
CodeVerse-Academy/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── api/
│   │   └── courses.js
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Run the Frontend Locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173`.

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

The production build is generated in `frontend/dist/`.

## Run the FastAPI Backend Locally

```bash
cd backend
python -m venv .venv
```

**Windows PowerShell**
```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**macOS / Linux**
```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API provides `/`, `/api/health`, and `/api/courses` endpoints. Interactive API documentation is available at `/docs` while the backend is running.

## Deploy to Vercel

Configure the Vercel project as follows:

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

The `frontend/api/courses.js` serverless function serves the course catalogue at `/api/courses` on Vercel. The FastAPI application in `backend/` is retained as a separately runnable backend source and is not required by the current deployed frontend route.

## Notes

- Do not commit `.env` files, credentials, virtual environments, or `node_modules`.
- The code playground UI is an interface; a secure remote code-execution service is not included in this repository.

## License

No license has been added yet. Unless a license is added, the repository's source code remains under the default copyright protections.
