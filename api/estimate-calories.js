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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { mealName } = req.body || {}

  if (!mealName || typeof mealName !== 'string' || !mealName.trim()) {
    res.status(400).json({ error: 'A meal name is required.' })
    return
  }

  const fallbackCalories = estimateCaloriesLocally(mealName)
  if (fallbackCalories) {
    res.status(200).json({ calories: fallbackCalories })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key is not configured.' })
    return
  }

  try {
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
            content:
              'You estimate calories for a meal. Return only a single integer number of calories. Do not explain. If uncertain, return a reasonable estimate.',
          },
          {
            role: 'user',
            content: `Meal: ${mealName}`,
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI request failed.')
    }

    const content = data.choices?.[0]?.message?.content || ''
    const match = content.match(/\d+/)
    const calories = match ? Number(match[0]) : null

    if (!calories || calories <= 0) {
      throw new Error('No valid calorie estimate returned.')
    }

    res.status(200).json({ calories })
  } catch (error) {
    res.status(502).json({ error: error.message || 'Unable to estimate calories right now.' })
  }
}
