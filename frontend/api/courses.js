const courses = [
  { id: 1, title: 'Python Programming', language: 'Python', level: 'Beginner', description: 'Learn Python fundamentals, variables, loops, functions, and more.' },
  { id: 2, title: 'Web Development', language: 'HTML, CSS, JavaScript', level: 'Beginner', description: 'Build responsive websites from the ground up.' },
  { id: 3, title: 'Java Programming', language: 'Java', level: 'Beginner', description: 'Explore object-oriented programming with Java.' },
  { id: 4, title: 'TypeScript Essentials', language: 'TypeScript', level: 'Intermediate', description: 'Write safer JavaScript using TypeScript.' },
  { id: 5, title: 'C Programming', language: 'C', level: 'Beginner', description: 'Understand programming fundamentals and memory concepts.' },
  { id: 6, title: 'SQL & Databases', language: 'SQL', level: 'Beginner', description: 'Learn database design, queries, and data management.' },
]

export default function handler(_request, response) {
  response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  response.status(200).json({ total: courses.length, courses })
}
