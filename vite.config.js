import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const fallbackCalorieLookup = {
  apple: 95,
  banana: 105,
  oats: 150,
  yogurt: 100,
  egg: 70,
  eggs: 70,
  toast: 80,
  bread: 80,
  rice: 205,
  pasta: 220,
  salmon: 233,
  'chicken breast': 280,
  chicken: 280,
  turkey: 250,
  beef: 250,
  avocado: 160,
  salad: 120,
  sandwich: 300,
  pizza: 285,
  burger: 354,
  smoothie: 180,
  'protein shake': 200,
  cereal: 150,
  granola: 200,
  almonds: 164,
  'peanut butter': 95,
  burrito: 400,
  sushi: 250,
  omelette: 220,
}

const estimateCaloriesLocally = (mealName) => {
  if (!mealName || typeof mealName !== 'string') return null

  const normalized = mealName.trim().toLowerCase()
  if (!normalized) return null

  for (const [foodName, calories] of Object.entries(fallbackCalorieLookup)) {
    if (normalized === foodName || normalized.includes(foodName) || foodName.includes(normalized)) {
      return calories
    }
  }

  return null
}

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

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'calorie-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/exercise-image', async (req, res) => {
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          const { searchParams } = new URL(req.url || '/', 'http://localhost')
          const exerciseName = searchParams.get('name')

          if (!exerciseName?.trim()) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Exercise name is required.' }))
            return
          }

          const apiKey = process.env.OPENAI_API_KEY
          if (!apiKey) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ imageUrl: createExerciseImageFallback(exerciseName) }))
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
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ imageUrl: `data:image/png;base64,${data.data[0].b64_json}` }))
              return
            }

            if (response.ok && data.data?.[0]?.url) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ imageUrl: data.data[0].url }))
              return
            }
          } catch (error) {
            // fall through to fallback
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ imageUrl: createExerciseImageFallback(exerciseName) }))
        })

        server.middlewares.use('/api/estimate-calories', async (req, res, next) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })

          req.on('end', async () => {
            try {
              const { mealName } = JSON.parse(body || '{}')
              const apiKey = process.env.OPENAI_API_KEY

              if (apiKey) {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    temperature: 0,
                    messages: [
                      {
                        role: 'system',
                        content: 'Return only a single integer number of calories. Do not explain.',
                      },
                      {
                        role: 'user',
                        content: `Meal: ${mealName}`,
                      },
                    ],
                  }),
                })

                const data = await response.json()
                if (response.ok) {
                  const content = data.choices?.[0]?.message?.content || ''
                  const match = content.match(/\d+/)
                  if (match) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ calories: Number(match[0]) }))
                    return
                  }
                }
              }

              const fallbackCalories = estimateCaloriesLocally(mealName)
              if (fallbackCalories) {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ calories: fallbackCalories }))
                return
              }

              res.statusCode = 400
              res.end(JSON.stringify({ error: 'A meal name is required.' }))
            } catch (error) {
              const fallbackCalories = estimateCaloriesLocally(req.body?.mealName)
              res.statusCode = 502
              res.end(JSON.stringify({ error: error.message || 'Unable to estimate calories right now.', calories: fallbackCalories }))
            }
          })
        })
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: false,
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
