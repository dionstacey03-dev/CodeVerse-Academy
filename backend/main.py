
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CodeVerse Academy API",
    description="Backend API for the CodeVerse Academy programming learning platform.",
    version="0.1.0",
)

# Allow the React frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to CodeVerse Academy API!",
        "status": "online",
        "version": "0.1.0",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CodeVerse Academy API",
    }


@app.get("/api/courses")
def get_courses():
    return {
        "total": 6,
        "courses": [
            {
                "id": 1,
                "title": "Python Programming",
                "language": "Python",
                "level": "Beginner",
                "description": "Learn Python fundamentals, variables, loops, functions, and more.",
            },
            {
                "id": 2,
                "title": "Web Development",
                "language": "HTML, CSS, JavaScript",
                "level": "Beginner",
                "description": "Build responsive websites from the ground up.",
            },
            {
                "id": 3,
                "title": "Java Programming",
                "language": "Java",
                "level": "Beginner",
                "description": "Explore object-oriented programming with Java.",
            },
            {
                "id": 4,
                "title": "TypeScript Essentials",
                "language": "TypeScript",
                "level": "Intermediate",
                "description": "Write safer JavaScript using TypeScript.",
            },
            {
                "id": 5,
                "title": "C Programming",
                "language": "C",
                "level": "Beginner",
                "description": "Understand programming fundamentals and memory concepts.",
            },
            {
                "id": 6,
                "title": "SQL & Databases",
                "language": "SQL",
                "level": "Beginner",
                "description": "Learn database design, queries, and data management.",
            },
        ],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
