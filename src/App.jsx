import { useEffect, useMemo, useState } from 'react'
import './App.css'

const workoutTemplates = {
  legs: [
    { name: 'Back Squat', reps: '3 x 12', focus: 'Quads & glutes' },
    { name: 'Romanian Deadlift', reps: '3 x 10', focus: 'Hamstrings & posterior chain' },
    { name: 'Walking Lunges', reps: '3 x 12/leg', focus: 'Balance & leg stability' },
    { name: 'Leg Press', reps: '3 x 15', focus: 'Lower body strength' },
    { name: 'Seated Calf Raise', reps: '3 x 20', focus: 'Calves' },
    { name: 'Plank', reps: '3 x 45 sec', focus: 'Core endurance' },
  ],
  chest: [
    { name: 'Bench Press', reps: '4 x 8', focus: 'Chest strength' },
    { name: 'Incline Dumbbell Press', reps: '3 x 10', focus: 'Upper chest' },
    { name: 'Chest Fly', reps: '3 x 12', focus: 'Chest isolation' },
    { name: 'Push-Ups', reps: '3 x 15', focus: 'Triceps & chest' },
    { name: 'Cable Crossover', reps: '3 x 12', focus: 'Chest squeeze' },
    { name: 'Dead Bug', reps: '3 x 12/side', focus: 'Core stability' },
  ],
  back: [
    { name: 'Pull-Ups', reps: '4 x 8', focus: 'Upper back & biceps' },
    { name: 'Lat Pulldown', reps: '3 x 12', focus: 'Lats' },
    { name: 'Bent-Over Row', reps: '3 x 10', focus: 'Mid-back' },
    { name: 'Seated Cable Row', reps: '3 x 12', focus: 'Upper back' },
    { name: 'Face Pull', reps: '3 x 15', focus: 'Rear delts' },
    { name: 'Farmer Carry', reps: '3 x 40m', focus: 'Grip & posture' },
  ],
  biceps: [
    { name: 'Barbell Curl', reps: '4 x 10', focus: 'Biceps strength' },
    { name: 'Hammer Curl', reps: '3 x 12', focus: 'Forearms' },
    { name: 'Incline Dumbbell Curl', reps: '3 x 12', focus: 'Long head' },
    { name: 'Preacher Curl', reps: '3 x 10', focus: 'Peak contraction' },
    { name: 'Cable Curl', reps: '3 x 12', focus: 'Constant tension' },
    { name: 'Reverse Curl', reps: '3 x 12', focus: 'Forearm endurance' },
  ],
  abs: [
    { name: 'Hanging Leg Raise', reps: '3 x 15', focus: 'Lower abs' },
    { name: 'Crunch Machine', reps: '3 x 15', focus: 'Upper abs' },
    { name: 'Cable Woodchop', reps: '3 x 12/side', focus: 'Obliques' },
    { name: 'Russian Twist', reps: '3 x 20', focus: 'Core rotation' },
    { name: 'Ab Wheel Rollout', reps: '3 x 10', focus: 'Full core' },
    { name: 'Side Plank', reps: '3 x 40 sec', focus: 'Lateral core' },
  ],
  shoulders: [
    { name: 'Overhead Press', reps: '4 x 8', focus: 'Shoulders & triceps' },
    { name: 'Lateral Raise', reps: '3 x 15', focus: 'Side delts' },
    { name: 'Front Raise', reps: '3 x 12', focus: 'Front delts' },
    { name: 'Rear Delt Fly', reps: '3 x 12', focus: 'Upper back' },
    { name: 'Arnold Press', reps: '3 x 10', focus: 'Shoulder mobility' },
    { name: 'Face Pull', reps: '3 x 15', focus: 'Rear shoulder stability' },
  ],
}

const focusOptions = [
  { value: 'legs', label: 'Legs', icon: '🦵' },
  { value: 'chest', label: 'Chest', icon: '💪' },
  { value: 'back', label: 'Back', icon: '🏋️' },
  { value: 'biceps', label: 'Biceps', icon: '💪' },
  { value: 'abs', label: 'Abs', icon: '🧠' },
  { value: 'shoulders', label: 'Shoulders', icon: '🤸' },
]

const exerciseGuides = {
  'Back Squat': 'Drive through your heels and brace your core.',
  'Romanian Deadlift': 'Keep your spine neutral and hinge at the hips.',
  'Walking Lunges': 'Step long and control each rep.',
  'Leg Press': 'Lower slowly and push through the full range.',
  'Seated Calf Raise': 'Pause at the top for a strong squeeze.',
  Plank: 'Keep your body in one straight line.',
  'Bench Press': 'Lower the bar to your chest with control.',
  'Incline Dumbbell Press': 'Press up while keeping your chest lifted.',
  'Chest Fly': 'Open wide and squeeze the chest at the top.',
  'Push-Ups': 'Keep your elbows at about 45 degrees.',
  'Cable Crossover': 'Focus on the stretch and squeeze.',
  'Dead Bug': 'Move slowly and keep your lower back grounded.',
  'Pull-Ups': 'Pull your elbows down and avoid swinging.',
  'Lat Pulldown': 'Pull the bar to your upper chest.',
  'Bent-Over Row': 'Lead with your elbows and keep your torso stable.',
  'Seated Cable Row': 'Squeeze your shoulder blades together.',
  'Face Pull': 'Pull toward your forehead with control.',
  'Farmer Carry': 'Walk tall and keep the weight close.',
  'Barbell Curl': 'Curl without letting your shoulders move.',
  'Hammer Curl': 'Keep your wrists neutral and steady.',
  'Incline Dumbbell Curl': 'Use a full range and avoid swinging.',
  'Preacher Curl': 'Stay strict and focus on the biceps.',
  'Cable Curl': 'Keep tension on the muscle throughout.',
  'Reverse Curl': 'Use a slow tempo and control the descent.',
  'Hanging Leg Raise': 'Lift from the hips and lower with control.',
  'Crunch Machine': 'Move through a full range without rushing.',
  'Cable Woodchop': 'Rotate through your torso and brace your core.',
  'Russian Twist': 'Keep your chest tall and rotate smoothly.',
  'Ab Wheel Rollout': 'Roll out slowly and keep your core tight.',
  'Side Plank': 'Stack your hips and hold steady.',
  'Overhead Press': 'Press overhead without arching your back.',
  'Lateral Raise': 'Lift to shoulder height and avoid shrugging.',
  'Front Raise': 'Raise to shoulder height with control.',
  'Rear Delt Fly': 'Open your chest and squeeze your upper back.',
  'Arnold Press': 'Rotate through the press for smooth range.',
}

const getExerciseGuide = (exerciseName) => exerciseGuides[exerciseName] || 'Focus on form and controlled tempo.'

const defaultProfile = {
  age: 28,
  height: 168,
  weight: 62,
  sex: 'female',
  activity: 'moderate',
}

const createWorkoutProgress = () => Object.fromEntries(Object.keys(workoutTemplates).map((key) => [key, Array(6).fill(false)]))

const formatDateLabel = (date = new Date()) => date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })

const buildInitialUser = (name, email, password) => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
  name,
  email,
  password,
  profile: { ...defaultProfile },
  selectedFocus: 'legs',
  workouts: createWorkoutProgress(),
  meals: [],
  hydration: 0,
  progressHistory: [35, 55, 70, 60, 80, 90, 100],
  progressLog: [],
})

const readStoredUsers = () => {
  if (typeof window === 'undefined') return []
  const stored = window.localStorage.getItem('gymQuestUsers')
  return stored ? JSON.parse(stored) : []
}

const readStoredSession = () => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem('gymQuestSession')
  return stored ? JSON.parse(stored) : null
}

function App() {
  const [users, setUsers] = useState(readStoredUsers)
  const [currentUser, setCurrentUser] = useState(readStoredSession)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [mealForm, setMealForm] = useState({ name: '', calories: '', quantity: '1', type: 'Breakfast' })
  const [mealLookupHint, setMealLookupHint] = useState('')
  const [exerciseImages, setExerciseImages] = useState({})
  const [message, setMessage] = useState('')

  const todayLabel = formatDateLabel()
  const profile = currentUser?.profile ?? defaultProfile
  const activeFocus = currentUser?.selectedFocus ?? 'legs'
  const workoutProgress = currentUser?.workouts ?? createWorkoutProgress()
  const meals = currentUser?.meals ?? []
  const hydration = currentUser?.hydration ?? 0
  const progressHistory = currentUser?.progressHistory ?? [35, 55, 70, 60, 80, 90, 100]
  const activeWorkoutList = workoutTemplates[activeFocus] ?? workoutTemplates.legs
  const activeCompleted = workoutProgress[activeFocus] ?? Array(activeWorkoutList.length).fill(false)

  useEffect(() => {
    window.localStorage.setItem('gymQuestUsers', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem('gymQuestSession', JSON.stringify(currentUser))
    } else {
      window.localStorage.removeItem('gymQuestSession')
    }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return
    setUsers((previous) => previous.map((user) => (user.id === currentUser.id ? currentUser : user)))
  }, [currentUser])

  const getLocalExerciseImage = (exerciseName) => {
    if (!exerciseName?.trim()) return null

    const palette = ['#2563eb', '#7c3aed', '#0f766e', '#dc2626', '#ea580c', '#db2777', '#0891b2', '#16a34a']
    const accent = palette[exerciseName.length % palette.length]
    const accent2 = palette[(exerciseName.length + 3) % palette.length]
    const icon = exerciseName.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'EX'

    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="180" viewBox="0 0 220 180">
        <rect width="220" height="180" rx="30" fill="#07111f"/>
        <rect x="18" y="18" width="184" height="144" rx="24" fill="url(#g)"/>
        <circle cx="72" cy="74" r="30" fill="#ffffff" opacity="0.2"/>
        <circle cx="148" cy="74" r="30" fill="#ffffff" opacity="0.14"/>
        <rect x="58" y="92" width="104" height="40" rx="18" fill="#ffffff" opacity="0.9"/>
        <path d="M92 112c8-16 28-16 36 0" stroke="${accent2}" stroke-width="8" stroke-linecap="round"/>
        <path d="M78 66c10-20 34-20 44 0" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
        <path d="M132 66c10-20 34-20 44 0" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
        <circle cx="110" cy="60" r="16" fill="#ffffff" opacity="0.95"/>
        <text x="110" y="152" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="white">${exerciseName}</text>
        <text x="110" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="white">${icon}</text>
      </svg>
    `)}`
  }

  const fetchExerciseImage = async (exerciseName) => {
    if (!exerciseName?.trim()) return null

    try {
      const response = await fetch(`/api/exercise-image?name=${encodeURIComponent(exerciseName.trim())}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load exercise image.')
      return data.imageUrl || null
    } catch (error) {
      return getLocalExerciseImage(exerciseName)
    }
  }

  useEffect(() => {
    let cancelled = false

    const initialImages = Object.fromEntries(
      activeWorkoutList.map((item) => [item.name, getLocalExerciseImage(item.name)]),
    )
    setExerciseImages(initialImages)

    const loadImages = async () => {
      for (const item of activeWorkoutList) {
        const resolvedImage = await fetchExerciseImage(item.name)
        if (cancelled) return

        setExerciseImages((previous) => ({
          ...previous,
          [item.name]: resolvedImage || previous[item.name] || getLocalExerciseImage(item.name),
        }))
      }
    }

    loadImages()

    return () => {
      cancelled = true
    }
  }, [activeWorkoutList])

  const bmi = useMemo(() => {
    const heightInMeters = profile.height / 100
    const value = profile.weight / (heightInMeters * heightInMeters)
    return value.toFixed(1)
  }, [profile.height, profile.weight])

  const bmiLabel = useMemo(() => {
    const numericBmi = Number(bmi)
    if (numericBmi < 18.5) return 'Underweight'
    if (numericBmi < 25) return 'Healthy'
    if (numericBmi < 30) return 'Overweight'
    return 'Obese'
  }, [bmi])

  const calorieTarget = useMemo(() => {
    const base =
      profile.sex === 'female'
        ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
        : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5

    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    }

    return Math.round(base * multipliers[profile.activity])
  }, [profile.age, profile.height, profile.activity, profile.sex, profile.weight])

  const proteinGoal = Math.round(profile.weight * 1.6)
  const waterGoal = Math.round(profile.weight * 0.033 * 1000)
  const progressPercent = Math.round((activeCompleted.filter(Boolean).length / activeCompleted.length) * 100)
  const consumedCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const remainingCalories = calorieTarget - consumedCalories
  const hydrationPercent = Math.min(100, Math.round((hydration / waterGoal) * 100))

  const updateCurrentUser = (updates) => {
    setCurrentUser((existing) => (existing ? { ...existing, ...updates } : existing))
  }

  const handleAuthSubmit = (event) => {
    event.preventDefault()

    if (!authForm.email || !authForm.password) {
      setMessage('Please enter your email and password.')
      return
    }

    if (authMode === 'signup') {
      if (!authForm.name) {
        setMessage('Please enter your name to create an account.')
        return
      }

      const existingUser = users.find((user) => user.email.toLowerCase() === authForm.email.toLowerCase())
      if (existingUser) {
        setMessage('That email is already registered. Please log in instead.')
        return
      }

      const newUser = buildInitialUser(authForm.name, authForm.email, authForm.password)
      setUsers((previous) => [...previous, newUser])
      setCurrentUser(newUser)
      setAuthForm({ name: '', email: '', password: '' })
      setMessage('Account created successfully.')
      return
    }

    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === authForm.email.toLowerCase() && user.password === authForm.password,
    )

    if (!matchedUser) {
      setMessage('No account matched those details. Try signing up first.')
      return
    }

    setCurrentUser(matchedUser)
    setAuthForm({ name: '', email: '', password: '' })
    setMessage(`Welcome back, ${matchedUser.name}.`)
  }

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    const parsedValue = ['age', 'height', 'weight'].includes(name) ? Number(value) : value

    updateCurrentUser({
      profile: { ...profile, [name]: parsedValue },
    })
  }

  const changeWorkoutFocus = (focus) => {
    updateCurrentUser({ selectedFocus: focus })
  }

  const toggleWorkout = (index) => {
    const nextCompleted = activeCompleted.map((item, itemIndex) => (itemIndex === index ? !item : item))
    const nextProgress = Math.round((nextCompleted.filter(Boolean).length / nextCompleted.length) * 100)
    const nextHistory = [...(currentUser?.progressHistory ?? [35, 55, 70, 60, 80, 90, 100]), nextProgress].slice(-7)
    const today = new Date().toISOString().slice(0, 10)
    const existingLog = currentUser?.progressLog ?? []
    const nextLog = existingLog.filter((entry) => entry.date !== today)
    nextLog.push({ date: today, percent: nextProgress, focus: activeFocus })

    updateCurrentUser({
      workouts: { ...workoutProgress, [activeFocus]: nextCompleted },
      progressHistory: nextHistory,
      progressLog: nextLog.slice(-7),
    })
  }

  const fetchCaloriesFromOpenAI = async (mealName) => {
    if (!mealName?.trim()) return null

    try {
      const response = await fetch('/api/estimate-calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealName: mealName.trim() }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to estimate calories.')
      return Number(data.calories)
    } catch (error) {
      return null
    }
  }

  const handleMealNameChange = async (event) => {
    const nextName = event.target.value

    setMealForm((current) => ({ ...current, name: nextName }))

    if (!nextName.trim()) {
      setMealLookupHint('')
      return
    }

    const estimatedCalories = await fetchCaloriesFromOpenAI(nextName)
    if (estimatedCalories) {
      setMealForm((current) => ({
        ...current,
        calories: current.calories !== '' && current.calories !== null && current.calories !== undefined
          ? current.calories
          : estimatedCalories,
      }))
      setMealLookupHint(`Auto-detected about ${estimatedCalories} kcal for ${nextName.trim()}.`)
    } else {
      setMealLookupHint('')
    }
  }

  const handleMealSubmit = async (event) => {
    event.preventDefault()
    const normalizedMealName = mealForm.name.trim()
    const quantity = Number(mealForm.quantity) || 1
    const baseCalories = Number(mealForm.calories) || (await fetchCaloriesFromOpenAI(normalizedMealName)) || 0
    const resolvedCalories = Math.round(baseCalories * quantity)

    if (!normalizedMealName || Number.isNaN(baseCalories) || baseCalories <= 0 || quantity <= 0) {
      setMessage('Add a meal name and a valid quantity so calories can be calculated.')
      return
    }

    const nextMeal = {
      id: `${Date.now()}`,
      name: normalizedMealName,
      calories: resolvedCalories,
      quantity,
      type: mealForm.type,
    }

    updateCurrentUser({ meals: [...meals, nextMeal] })
    setMealForm({ name: '', calories: '', quantity: '1', type: mealForm.type })
    setMealLookupHint('')
    setMessage(`Added ${nextMeal.name} x${nextMeal.quantity} — ${nextMeal.calories} kcal.`)
  }

  const addWater = (amount) => {
    updateCurrentUser({ hydration: hydration + amount })
    setMessage(`Great job! You drank ${amount} ml of water.`)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setMessage('You have been logged out.')
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">FitUP</p>
          <div className="hero-date">{todayLabel}</div>
          <h1>Train smarter with your daily gym plan.</h1>
          <p className="hero-copy">
            Choose your muscle group, complete your gym routine, track reps, and stay on top of hydration and nutrition in one clean space.
          </p>
        </div>
      </header>

      {!currentUser ? (
        <section className="auth-card">
          <div>
            <p className="eyebrow">Welcome</p>
            <h2>{authMode === 'login' ? 'Sign in to your fitness space' : 'Create your account'}</h2>
            <p>Use a secure local account to keep your gym plan, meals, and progress saved.</p>
          </div>
          <div>
            <div className="auth-toggle">
              <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
                Log in
              </button>
              <button type="button" className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>
                Sign up
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={authForm.name}
                  onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
              />
              <button type="submit">{authMode === 'login' ? 'Enter dashboard' : 'Create account'}</button>
            </form>
            {message ? <p className="message">{message}</p> : null}
          </div>
        </section>
      ) : (
        <main className="dashboard">
          <section className="stats-grid">
            <article className="panel highlight-panel">
              <p className="eyebrow">Hello, {currentUser.name}</p>
              <h2>Today’s fitness snapshot</h2>
              <div className="metric-row">
                <div>
                  <strong>{bmi}</strong>
                  <span>BMI</span>
                </div>
                <div>
                  <strong>{calorieTarget}</strong>
                  <span>Calories</span>
                </div>
                <div>
                  <strong>{proteinGoal}g</strong>
                  <span>Protein</span>
                </div>
              </div>
              <div className="ring-row">
                <div className="progress-ring" style={{ '--progress': `${progressPercent}%` }}>
                  <span>{progressPercent}%</span>
                </div>
                <div>
                  <p className="status-line">Your BMI is {bmiLabel} and your daily calorie target is {calorieTarget} kcal.</p>
                  <p className="status-line">You have {remainingCalories > 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal over`} for today.</p>
                </div>
              </div>
            </article>

            <article className="panel">
              <h3>Health profile</h3>
              <label>
                Age
                <input type="number" name="age" value={profile.age} onChange={handleProfileChange} />
              </label>
              <label>
                Height (cm)
                <input type="number" name="height" value={profile.height} onChange={handleProfileChange} />
              </label>
              <label>
                Weight (kg)
                <input type="number" name="weight" value={profile.weight} onChange={handleProfileChange} />
              </label>
              <label>
                Sex
                <select name="sex" value={profile.sex} onChange={handleProfileChange}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
              <label>
                Activity
                <select name="activity" value={profile.activity} onChange={handleProfileChange}>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                </select>
              </label>
            </article>
          </section>

          <section className="planner-grid">
            <article className="panel">
              <div className="panel-heading">
                <h3>Which workout are you doing today?</h3>
                <span>{activeWorkoutList.length} moves</span>
              </div>
              <div className="focus-buttons">
                {focusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={activeFocus === option.value ? 'focus-chip active' : 'focus-chip'}
                    onClick={() => changeWorkoutFocus(option.value)}
                  >
                    <span>{option.icon}</span> {option.label}
                  </button>
                ))}
              </div>
              <div className="panel-heading compact-heading">
                <h4>{focusOptions.find((option) => option.value === activeFocus)?.label} day</h4>
                <span>{progressPercent}% done</span>
              </div>
              <ul className="plan-list">
                {activeWorkoutList.map((item, index) => (
                  <li key={item.name} className={activeCompleted[index] ? 'done' : ''}>
                    <label>
                      <input type="checkbox" checked={activeCompleted[index]} onChange={() => toggleWorkout(index)} />
                      <div className="exercise-content">
                        {exerciseImages[item.name] ? (
                          <img className="exercise-thumbnail" src={exerciseImages[item.name]} alt={item.name} />
                        ) : (
                          <div className="exercise-thumbnail placeholder">🏋️</div>
                        )}
                        <div className="exercise-meta">
                          <strong>{item.name}</strong>
                          <p>{item.focus}</p>
                          <span className="exercise-guide">{getExerciseGuide(item.name)}</span>
                        </div>
                      </div>
                    </label>
                    <span>{item.reps}</span>
                  </li>
                ))}
              </ul>
              <div className="chart-card">
                <h4>7-day progress</h4>
                <div className="chart-bars" aria-label="Progress chart">
                  {progressHistory.map((value, index) => (
                    <div key={`${value}-${index}`} className="bar-column">
                      <div className="bar-fill" style={{ height: `${value}%` }} />
                      <span>{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="panel">
              <h3>Hydration & nutrition</h3>
              <div className="info-card">
                <p>Water goal</p>
                <strong>{waterGoal} ml</strong>
              </div>
              <div className="info-card">
                <p>Protein goal</p>
                <strong>{proteinGoal} g</strong>
              </div>
              <div className="info-card">
                <p>Calories consumed</p>
                <strong>{consumedCalories} kcal</strong>
              </div>
              <div className="hydration-card">
                <div className="hydration-meter">
                  <div className="hydration-fill" style={{ height: `${hydrationPercent}%` }} />
                </div>
                <div>
                  <p>You drank</p>
                  <strong>{hydration} ml</strong>
                  <div className="hydration-buttons">
                    <button type="button" onClick={() => addWater(250)}>+250 ml</button>
                    <button type="button" onClick={() => addWater(500)}>+500 ml</button>
                  </div>
                </div>
              </div>
              <form className="meal-form" onSubmit={handleMealSubmit}>
                <input
                  type="text"
                  placeholder="Meal name"
                  value={mealForm.name}
                  onChange={handleMealNameChange}
                />
                <input
                  type="number"
                  placeholder="Leave blank for auto fetch"
                  value={mealForm.calories}
                  onChange={(event) => setMealForm((current) => ({ ...current, calories: event.target.value }))}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={mealForm.quantity}
                  onChange={(event) => setMealForm((current) => ({ ...current, quantity: event.target.value }))}
                />
                <select
                  value={mealForm.type}
                  onChange={(event) => setMealForm((current) => ({ ...current, type: event.target.value }))}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <button type="submit">Add meal</button>
              </form>
              {mealLookupHint ? <p className="message">{mealLookupHint}</p> : null}
              <p className="message">Try foods like banana, chicken breast, apple, pasta, or rice.</p>
              <ul className="meal-list">
                {meals.slice().reverse().map((meal) => (
                  <li key={meal.id}>
                    <span>
                      {meal.name}
                      {meal.quantity > 1 ? ` x${meal.quantity}` : ''}
                    </span>
                    <strong>{meal.calories} kcal</strong>
                  </li>
                ))}
              </ul>
              <button type="button" className="logout-button" onClick={handleLogout}>
                Log out
              </button>
              {message ? <p className="message">{message}</p> : null}
            </article>
          </section>
        </main>
      )}
    </div>
  )
}

export default App
