import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json()
    const { messages, temperature = 1, max_tokens = 1000, stream = false } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      )
    }

    // Vérifier si la clé API est configurée
    const apiKey = process.env.ZAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Initialiser le client ZAI
    const zai = await ZAI.create()

    // Préparer les messages pour l'API
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    try {
      // Appeler l'API GLM 4.5
      const completion = await zai.chat.completions.create({
        messages: apiMessages,
        model: 'glm-4.5',
        temperature,
        max_tokens,
        stream,
      })

      // Extraire le contenu de la réponse
      const messageContent = completion.choices[0]?.message?.content || ''
      
      return NextResponse.json({
        id: completion.id,
        object: completion.object,
        created: completion.created,
        model: completion.model,
        choices: completion.choices,
        usage: completion.usage,
        message: {
          role: 'assistant',
          content: messageContent
        }
      })

    } catch (apiError: any) {
      console.error('API Error:', apiError)
      return NextResponse.json(
        { error: `API Error: ${apiError.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Route Error:', error)
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'GLM 4.5 Chat API Endpoint',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /api/health'
    }
  })
}