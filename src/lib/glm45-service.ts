interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  message: {
    role: string
    content: string
  }
}

interface ChatServiceOptions {
  temperature?: number
  max_tokens?: number
  stream?: boolean
  apiKey?: string
}

class GLM45Service {
  private apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = '/api/chat'
  }

  async sendMessage(
    messages: ChatMessage[],
    options: ChatServiceOptions = {}
  ): Promise<ChatCompletionResponse> {
    const { temperature = 1, max_tokens = 1000, stream = false, apiKey } = options

    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          temperature,
          max_tokens,
          stream,
          apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${errorData.error || 'Unknown error'}`)
      }

      const data: ChatCompletionResponse = await response.json()
      return data

    } catch (error) {
      console.error('GLM45 Service Error:', error)
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('/api/health')
      return response.ok
    } catch (error) {
      console.error('Health Check Error:', error)
      return false
    }
  }
}

export const glm45Service = new GLM45Service()
export type { ChatMessage, ChatCompletionResponse, ChatServiceOptions }