const createExerciseImageFallback = (exerciseName) => {
  if (!exerciseName?.trim()) return null

  const palette = ['#2563eb', '#7c3aed', '#0f766e', '#dc2626', '#ea580c', '#db2777', '#0891b2', '#16a34a']
  const accent = palette[exerciseName.length % palette.length]
  const accent2 = palette[(exerciseName.length + 3) % palette.length]
  const icon = exerciseName.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'EX'

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="180" viewBox="0 0 220 180">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${accent2}" />
        </linearGradient>
      </defs>
      <rect width="220" height="180" rx="28" fill="#0f172a"/>
      <rect x="14" y="14" width="192" height="152" rx="24" fill="url(#g)" opacity="0.95"/>
      <circle cx="110" cy="70" r="40" fill="white" opacity="0.18"/>
      <rect x="82" y="94" width="56" height="32" rx="12" fill="white" opacity="0.95"/>
      <path d="M94 62h32M110 50v24" stroke="white" stroke-width="6" stroke-linecap="round"/>
      <text x="110" y="148" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="white">${exerciseName}</text>
      <text x="110" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="white">${icon}</text>
    </svg>
  `)}`
}

module.exports = async function handler(req, res) {
  const { name } = req.query || {}

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Exercise name is required.' })
    return
  }

  const exerciseName = name.trim()
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    res.status(200).json({ imageUrl: createExerciseImageFallback(exerciseName) })
    return
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Create a bright, realistic gym-style illustration of a person performing ${exerciseName}. Show the movement clearly, modern fitness studio, clean background, high detail.`,
        size: '1024x1024',
        n: 1,
        response_format: 'b64_json',
      }),
    })

    const data = await response.json()
    if (response.ok && data.data?.[0]?.b64_json) {
      res.status(200).json({ imageUrl: `data:image/png;base64,${data.data[0].b64_json}` })
      return
    }

    if (response.ok && data.data?.[0]?.url) {
      res.status(200).json({ imageUrl: data.data[0].url })
      return
    }
  } catch (error) {
    // fall through to fallback
  }

  res.status(200).json({ imageUrl: createExerciseImageFallback(exerciseName) })
}
