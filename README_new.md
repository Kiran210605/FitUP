# FitUP

FitUP is a fitness dashboard with workout planning, hydration tracking, meal logging, and workout thumbnails.

## OpenAI exercise images

Each workout exercise name is sent to the app's image endpoint and can be turned into a unique OpenAI-generated image.

### Setup

1. Copy .env.example to .env
2. Add your OpenAI API key:
   - OPENAI_API_KEY=your_openai_api_key_here
3. Start the app with npm run dev

If no API key is present, the app falls back to a local generated placeholder image for each exercise.
