
import { useEffect, useState } from 'react'
import './App.css'

type Course = {
  name: string
  language: string
  level: string
  icon: string
  description: string
  progress: number
  lessons: number
  color: string
}

type ApiCourse = {
  id: number
  title: string
  language: string
  level: string
  description: string
}

type ApiCourseResponse = {
  total: number
  courses: ApiCourse[]
}

const coursePresentation: Record<
  string,
  Pick<Course, 'icon' | 'progress' | 'lessons' | 'color'>
> = {
  'Python Programming': {
    icon: '🐍',
    progress: 68,
    lessons: 25,
    color: 'purple',
  },
  'Web Development': {
    icon: '🌐',
    progress: 42,
    lessons: 28,
    color: 'blue',
  },
  'Java Programming': {
    icon: '☕',
    progress: 24,
    lessons: 25,
    color: 'orange',
  },
  'TypeScript Essentials': {
    icon: '🔷',
    progress: 0,
    lessons: 20,
    color: 'blue',
  },
  'C Programming': {
    icon: '⚙️',
    progress: 0,
    lessons: 22,
    color: 'purple',
  },
  'SQL & Databases': {
    icon: '🗄️',
    progress: 0,
    lessons: 18,
    color: 'orange',
  },
}

const navigation = [
  { label: 'Overview', icon: '⌂' },
  { label: 'My Learning', icon: '▤' },
  { label: 'Explore Courses', icon: '⌕' },
  { label: 'Code Playground', icon: '⌘' },
  { label: 'Challenges', icon: '⚡' },
  { label: 'Achievements', icon: '◇' },
]

const challenges = [
  {
    title: 'Hello, World!',
    language: 'Python',
    difficulty: 'Easy',
    xp: 50,
  },
  {
    title: 'Sum of Two Numbers',
    language: 'Python',
    difficulty: 'Easy',
    xp: 75,
  },
  {
    title: 'Reverse a String',
    language: 'JavaScript',
    difficulty: 'Easy',
    xp: 100,
  },
  {
    title: 'Find the Largest Number',
    language: 'Python',
    difficulty: 'Medium',
    xp: 150,
  },
]

function App() {
  const [active, setActive] = useState('Overview')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const [enrolled, setEnrolled] = useState<string[]>([
    'Python Programming',
    'Web Development',
    'Java Programming',
  ])

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null)

  const [code, setCode] = useState(
    'print("Hello, CodeVerse!")',
  )
  const [language, setLanguage] = useState('Python')
  const [output, setOutput] = useState('')

  const [completedChallenges, setCompletedChallenges] =
    useState<string[]>([])

  const [notice, setNotice] = useState('')

  // Courses are loaded from the Vercel serverless API route.
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [coursesError, setCoursesError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCourses() {
      try {
        setCoursesLoading(true)
        setCoursesError('')

        const response = await fetch(
          '/api/courses',
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(
            `Course request failed (${response.status})`,
          )
        }

        const data: ApiCourseResponse = await response.json()

        const apiCourses: Course[] = data.courses.map(
          course => {
            const presentation =
              coursePresentation[course.title]

            return {
              name: course.title,
              language:
                course.title === 'Web Development' ||
                course.language === 'HTML, CSS, JavaScript'
                  ? 'Web'
                  : course.language,
              level: course.level,
              description: course.description,
              icon: presentation?.icon ?? '💻',
              progress: presentation?.progress ?? 0,
              lessons: presentation?.lessons ?? 10,
              color: presentation?.color ?? 'blue',
            }
          },
        )

        setCourses(apiCourses)
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return
        }

        setCoursesError(
          error instanceof Error
            ? error.message
            : 'Unable to load courses.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setCoursesLoading(false)
        }
      }
    }

    void loadCourses()

    return () => controller.abort()
  }, [])

  const visibleCourses = courses.filter(course => {
    const matchesSearch =
      `${course.name} ${course.language} ${course.description}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesFilter =
      filter === 'All' || course.language === filter

    return matchesSearch && matchesFilter
  })

  const xp = completedChallenges.reduce(
    (sum, title) =>
      sum +
      (challenges.find(challenge => challenge.title === title)
        ?.xp ?? 0),
    0,
  )

  function openCourse(course: Course) {
    setSelectedCourse(course)
    setActive('Course Details')
    setNotice('')
  }

  function enroll(course: Course) {
    const alreadyEnrolled = enrolled.includes(course.name)

    if (alreadyEnrolled) {
      setNotice(`${course.name} is already in My Learning.`)
      return
    }

    setEnrolled(previous => [...previous, course.name])
    setNotice(`Added ${course.name} to My Learning.`)
  }

  function renderCourseCards(list: Course[]) {
    if (coursesLoading) {
      return (
        <div className="page-panel empty-state" role="status">
          Loading courses from CodeVerse Academy...
        </div>
      )
    }

    if (coursesError) {
      return (
        <div className="page-panel empty-state" role="alert">
          <h3>Unable to load courses</h3>
          <p>{coursesError}</p>
          <p>
            Please try again in a moment. If the issue continues, contact the site administrator.
          </p>
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Retry connection
          </button>
        </div>
      )
    }

    if (list.length === 0) {
      return (
        <div className="page-panel empty-state">
          No courses found. Try a different search or filter.
        </div>
      )
    }

    return (
      <div className="course-grid">
        {list.map(course => (
          <article className="course-card" key={course.name}>
            <div className={`course-art ${course.color}`}>
              <span className="course-category">
                {course.language.toUpperCase()} PATH
              </span>
              <span className="course-emoji">
                {course.icon}
              </span>
              <span className="art-orbit" />
              <span className="course-level">
                {course.level}
              </span>
            </div>

            <div className="course-body">
              <h3>{course.name}</h3>
              <p>{course.description}</p>

              <div className="course-progress-label">
                <span>
                  {course.progress
                    ? 'Course progress'
                    : `${course.lessons} lessons`}
                </span>
                <strong>{course.progress}%</strong>
              </div>

              <div
                className="course-progress"
                role="progressbar"
                aria-label={`${course.name} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={course.progress}
              >
                <span
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="course-footer">
                <span>
                  {course.progress
                    ? `${Math.round(
                        (course.lessons * course.progress) / 100,
                      )} / ${course.lessons} lessons`
                    : course.level}
                </span>

                <button onClick={() => openCourse(course)}>
                  View course <span>→</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    )
  }

  function renderPage() {
    if (active === 'Overview') {
      return (
        <>
          <section className="hero-card">
            <div className="hero-content">
              <div className="hero-pill">
                ✦ YOUR PERSONAL LEARNING HUB
              </div>

              <h2>
                Turn curiosity
                <br />
                into <span>capability.</span>
              </h2>

              <p>
                Learn to code, solve real problems, and build
                projects that matter — one step at a time.
              </p>

              <button
                className="primary-button"
                onClick={() => setActive('My Learning')}
              >
                Continue learning <span>→</span>
              </button>

              <div className="hero-footnote">
                ✓ Your journey. Your pace. Your future.
              </div>
            </div>

            <div className="hero-art">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />

              <div className="code-window">
                <div className="window-top">
                  <span />
                  <span />
                  <span />
                  <label>hello_world.py</label>
                </div>

                <div className="code-lines">
                  <p>
                    <i>01</i>{' '}
                    <span className="syntax-purple">def</span>{' '}
                    <span className="syntax-blue">
                      build_future
                    </span>
                    ():
                  </p>
                  <p>
                    <i>02</i> &nbsp;&nbsp;{' '}
                    <span className="syntax-purple">while</span>{' '}
                    learning:
                  </p>
                  <p>
                    <i>03</i> &nbsp;&nbsp;&nbsp;&nbsp; practice()
                  </p>
                  <p>
                    <i>04</i> &nbsp;&nbsp;&nbsp;&nbsp;{' '}
                    <span className="syntax-green">
                      keep_growing
                    </span>
                    ()
                  </p>
                  <p>
                    <i>05</i>
                  </p>
                  <p>
                    <i>06</i>{' '}
                    <span className="syntax-blue">
                      build_future
                    </span>
                    ()
                  </p>
                </div>
              </div>

              <div className="floating-tag tag-top">
                ✦ Learn by doing
              </div>
              <div className="floating-tag tag-bottom">
                ↗ Future developer
              </div>
              <div className="hero-glow" />
            </div>
          </section>

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon violet">▤</span>
                <span className="stat-muted">Learning paths</span>
              </div>
              <div className="stat-number">
                {enrolled.length.toString().padStart(2, '0')}
                <span> enrolled</span>
              </div>
              <div className="stat-label">
                Courses in your learning space
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon amber">⚡</span>
                <span className="stat-muted">
                  Your momentum
                </span>
              </div>
              <div className="stat-number">
                {completedChallenges.length}
                <span> completed</span>
              </div>
              <div className="stat-label">
                Coding challenges completed
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon mint">◈</span>
                <span className="stat-muted">Keep learning</span>
              </div>
              <div className="stat-number">
                {xp}
                <span> XP</span>
              </div>
              <div className="stat-label">
                Challenge experience earned
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span className="stat-icon rose">◎</span>
                <span className="stat-muted">Your next goal</span>
              </div>
              <div className="stat-number">
                {Math.max(0, 3 - completedChallenges.length)}
                <span> left</span>
              </div>
              <div className="stat-label">
                Challenges to your first milestone
              </div>
            </article>
          </section>

          <section className="learning-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  KEEP MOVING FORWARD
                </div>
                <h2>
                  Your learning paths<span>.</span>
                </h2>
              </div>

              <button
                className="text-button"
                onClick={() => setActive('Explore Courses')}
              >
                Explore courses →
              </button>
            </div>

            {renderCourseCards(
              courses
                .filter(course =>
                  enrolled.includes(course.name),
                )
                .slice(0, 3),
            )}
          </section>
        </>
      )
    }

    if (active === 'Explore Courses') {
      return (
        <section className="learning-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                FIND YOUR NEXT SKILL
              </div>
              <h2>
                Explore courses<span>.</span>
              </h2>
            </div>
            <span className="result-count">
              {visibleCourses.length} courses
            </span>
          </div>

          <div className="catalog-tools">
            <label className="search-box catalog-search">
              <span>⌕</span>
              <input
                aria-label="Search courses"
                placeholder="Search languages or topics..."
                value={search}
                onChange={event =>
                  setSearch(event.target.value)
                }
              />
            </label>

            <select
              aria-label="Filter courses by language"
              value={filter}
              onChange={event =>
                setFilter(event.target.value)
              }
            >
              {[
                'All',
                ...new Set(
                  courses.map(course => course.language),
                ),
              ].map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {renderCourseCards(visibleCourses)}
        </section>
      )
    }

    if (active === 'My Learning') {
      const myCourses = courses.filter(course =>
        enrolled.includes(course.name),
      )

      return (
        <section className="learning-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                YOUR PERSONAL STUDY SPACE
              </div>
              <h2>
                My learning<span>.</span>
              </h2>
            </div>
            <span className="result-count">
              {myCourses.length} enrolled
            </span>
          </div>

          {renderCourseCards(myCourses)}

          <button
            className="primary-button page-action"
            onClick={() => setActive('Explore Courses')}
          >
            Discover more courses →
          </button>
        </section>
      )
    }

    if (active === 'Course Details' && selectedCourse) {
      const isEnrolled = enrolled.includes(
        selectedCourse.name,
      )

      return (
        <section className="page-panel detail-panel">
          <div
            className={`course-art ${selectedCourse.color} detail-art`}
          >
            <span className="course-emoji">
              {selectedCourse.icon}
            </span>
            <span className="course-category">
              {selectedCourse.language.toUpperCase()}{' '}
              LEARNING PATH
            </span>
          </div>

          <div className="eyebrow">
            {selectedCourse.level.toUpperCase()} COURSE
          </div>

          <h2>{selectedCourse.name}</h2>
          <p>{selectedCourse.description}</p>

          <div className="detail-stats">
            <span>
              {selectedCourse.lessons} planned lessons
            </span>
            <span>
              {selectedCourse.progress}% sample progress
            </span>
          </div>

          <div className="course-progress">
            <span
              style={{
                width: `${selectedCourse.progress}%`,
              }}
            />
          </div>

          <button
            className="primary-button page-action"
            onClick={() => enroll(selectedCourse)}
          >
            {isEnrolled
              ? 'Enrolled ✓'
              : 'Add to My Learning →'}
          </button>

          {notice && <p className="notice">{notice}</p>}

          <p className="muted-note">
            Enrollment currently lasts for this app session.
            Persistent accounts and lesson content will be added
            in a later milestone.
          </p>

          <button
            className="text-button"
            onClick={() => {
              setActive('Explore Courses')
              setNotice('')
            }}
          >
            ← Back to courses
          </button>
        </section>
      )
    }

    if (active === 'Code Playground') {
      return (
        <section className="learning-section">
          <div className="eyebrow">
            EXPERIMENT AND CREATE
          </div>
          <h2 className="page-title">
            Code Playground<span>.</span>
          </h2>

          <div className="page-panel workspace-panel">
            <div className="workspace-toolbar">
              <select
                aria-label="Programming language"
                value={language}
                onChange={event => {
                  setLanguage(event.target.value)
                  setOutput('')
                }}
              >
                <option>Python</option>
                <option>JavaScript</option>
                <option>TypeScript</option>
              </select>

              <span className="result-count">
                Editor preview
              </span>
            </div>

            <textarea
              className="code-editor"
              spellCheck={false}
              aria-label="Code editor"
              value={code}
              onChange={event => setCode(event.target.value)}
            />

            <button
              className="primary-button"
              onClick={() =>
                setOutput(
                  `Your ${language} code is saved in the editor. Secure code execution is not connected yet.`,
                )
              }
            >
              ▶ Run preview
            </button>

            {output && (
              <div className="output-panel">
                <strong>Output</strong>
                <p>{output}</p>
              </div>
            )}

            <p className="muted-note">
              This is an editor prototype, not a real code
              runner. Secure code execution will be connected
              in a later milestone.
            </p>
          </div>
        </section>
      )
    }

    if (active === 'Challenges') {
      return (
        <section className="learning-section">
          <div className="eyebrow">
            PRACTICE MAKES PROGRESS
          </div>
          <h2 className="page-title">
            Coding challenges<span>.</span>
          </h2>

          <div className="challenge-list">
            {challenges.map(challenge => {
              const done = completedChallenges.includes(
                challenge.title,
              )

              return (
                <article
                  className="challenge-row"
                  key={challenge.title}
                >
                  <div className="challenge-symbol">⌘</div>

                  <div className="challenge-info">
                    <strong>{challenge.title}</strong>
                    <span>
                      {challenge.language} ·{' '}
                      {challenge.difficulty} · {challenge.xp}{' '}
                      XP
                    </span>
                  </div>

                  <button
                    className="course-action"
                    disabled={done}
                    onClick={() =>
                      setCompletedChallenges(previous =>
                        previous.includes(challenge.title)
                          ? previous
                          : [...previous, challenge.title],
                      )
                    }
                  >
                    {done ? 'Completed ✓' : 'Mark complete'}
                  </button>
                </article>
              )
            })}
          </div>

          <p className="muted-note">
            Challenge completion is currently a prototype
            interaction. Real problem statements, test cases,
            and code validation will be added later.
          </p>
        </section>
      )
    }

    if (active === 'Achievements') {
      const achievements = [
        {
          icon: '🚀',
          title: 'First Steps',
          description: 'Explore your learning dashboard',
          unlocked: true,
        },
        {
          icon: '⌨️',
          title: 'Code Explorer',
          description: 'Open the Code Playground',
          unlocked: true,
        },
        {
          icon: '🏆',
          title: 'Challenge Starter',
          description: 'Complete your first challenge',
          unlocked: completedChallenges.length > 0,
        },
        {
          icon: '⭐',
          title: 'Rising Developer',
          description: 'Earn 250 challenge XP',
          unlocked: xp >= 250,
        },
      ]

      return (
        <section className="learning-section">
          <div className="eyebrow">
            CELEBRATE YOUR PROGRESS
          </div>

          <h2 className="page-title">
            Achievements<span>.</span>
          </h2>

          <div className="achievement-grid">
            {achievements.map(item => (
              <article
                className={`page-panel achievement-card ${
                  item.unlocked ? '' : 'locked'
                }`}
                key={item.title}
              >
                <div className="achievement-icon">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>
                  {item.unlocked
                    ? 'Unlocked'
                    : 'Not unlocked yet'}
                </span>
              </article>
            ))}
          </div>
        </section>
      )
    }

    return (
      <section className="page-panel">
        <h2>{active}</h2>
        <p>This section is planned for a future milestone.</p>
      </section>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#home"
          onClick={event => {
            event.preventDefault()
            setActive('Overview')
            setSelectedCourse(null)
            setNotice('')
          }}
        >
          <span className="brand-mark">CV</span>
          <span className="brand-name">
            CodeVerse<span>ACADEMY</span>
          </span>
        </a>

        <div className="workspace-label">
          LEARNING SPACE
        </div>

        <nav className="navigation">
          {navigation.map(item => (
            <button
              key={item.label}
              className={`nav-item ${
                active === item.label ? 'active' : ''
              }`}
              onClick={() => {
                setActive(item.label)
                setSelectedCourse(null)
                setNotice('')
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>

              {item.label === 'Challenges' && (
                <span className="nav-badge">
                  {challenges.length -
                    completedChallenges.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-pro">
          <div className="pro-spark">✦</div>
          <h3>Keep growing.</h3>
          <p>
            Your next breakthrough is one lesson away.
          </p>
          <button
            onClick={() => {
              setActive('Explore Courses')
              setSelectedCourse(null)
            }}
          >
            Explore paths <span>↗</span>
          </button>
        </div>

        <button
          className="profile-card"
          onClick={() =>
            setNotice(
              'Profile settings will be added in a future milestone.',
            )
          }
        >
          <div className="avatar">S</div>
          <div className="profile-copy">
            <strong>Student</strong>
            <span>Learning account</span>
          </div>
          <span className="profile-menu">···</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{active}</strong>
          </div>

          <div className="topbar-actions">
            <label className="search-box top-search">
              <span>⌕</span>
              <input
                aria-label="Search courses"
                placeholder="Search courses..."
                value={search}
                onChange={event =>
                  setSearch(event.target.value)
                }
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    setActive('Explore Courses')
                  }
                }}
              />
              <kbd>↵</kbd>
            </label>

            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() =>
                setNotice('You are all caught up!')
              }
            >
              ♧
            </button>

            <div className="top-avatar">S</div>
          </div>
        </header>

        <div className="page-content">
          {active === 'Overview' && (
            <section className="welcome-row">
              <div>
                <div className="eyebrow">
                  <span className="live-dot" />
                  YOUR LEARNING JOURNEY
                </div>
                <h1>
                  Build skills.
                  <br />
                  <span>Build your future.</span>
                </h1>
                <p className="welcome-description">
                  Every expert was once a beginner. Let’s make
                  today count.
                </p>
              </div>

              <div className="date-chip">
                ✦ YOUR NEXT CHAPTER STARTS NOW
              </div>
            </section>
          )}

          {renderPage()}

          {notice && active !== 'Course Details' && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}

          <footer className="dashboard-footer">
            <span>◈ CODEVERSE ACADEMY</span>
            <span>
              Built for the curious. Designed for the future.
            </span>
            <span>VERSION 0.2.0</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
