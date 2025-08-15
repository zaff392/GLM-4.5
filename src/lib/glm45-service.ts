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

      // Vérifier d'abord si la réponse est OK
      if (!response.ok) {
        // Récupérer le texte de la réponse pour voir ce qu'on reçoit
        const responseText = await response.text()
        console.log('API Error Response:', responseText)
        
        // Vérifier si c'est du HTML
        if (responseText.trim().startsWith('<')) {
          throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. Response starts with: ${responseText.substring(0, 100)}...`)
        }
        
        // Essayer de parser comme JSON si ce n'est pas du HTML
        try {
          const errorData = JSON.parse(responseText)
          throw new Error(`API Error: ${errorData.error || 'Unknown error'}`)
        } catch (parseError) {
          throw new Error(`API Error: ${response.status} - ${responseText.substring(0, 200)}...`)
        }
      }

      // Pour la réponse succès, vérifier aussi le contenu
      const responseText = await response.text()
      console.log('API Success Response:', responseText)
      
      // Vérifier si c'est du HTML (même pour une réponse OK)
      if (responseText.trim().startsWith('<')) {
        throw new Error(`Server returned HTML instead of JSON for successful response. Response starts with: ${responseText.substring(0, 100)}...`)
      }
      
      // Parser le JSON seulement si on est sûr que c'est du JSON
      try {
        const data: ChatCompletionResponse = JSON.parse(responseText)
        return data
      } catch (parseError) {
        throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}. Response: ${responseText.substring(0, 200)}...`)
      }

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