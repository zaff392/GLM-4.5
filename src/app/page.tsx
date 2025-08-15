'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Send, 
  RefreshCw, 
  Copy, 
  Download, 
  Upload, 
  Camera, 
  Settings, 
  History, 
  Monitor,
  FileText,
  Palette,
  FolderOpen,
  Target,
  Bot,
  ChevronDown
} from 'lucide-react'
import { glm45Service, type ChatMessage } from '@/lib/glm45-service'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import html2canvas from 'html2canvas'
import Stagewise from '@/components/stagewise'
import FileBrowser from '@/components/file-browser'

const themes = {
  sombre: { name: 'Sombre' },
  clair: { name: 'Clair' },
  cyberpunk: { name: 'Cyberpunk' },
  matrix: { name: 'Matrix' },
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ArtifactType {
  id: string
  name: string
  description: string
  category: string
}

export default function GLM45Terminal() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedArtifact, setSelectedArtifact] = useState('')
  const [isStagewiseOpen, setIsStagewiseOpen] = useState(false)
  const [isFileBrowserOpen, setIsFileBrowserOpen] = useState(false)
  const [theme, setTheme] = useState('sombre')
  const availableThemes = ['sombre', 'clair', 'cyberpunk', 'matrix']
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const artifactTypes: ArtifactType[] = [
    { id: 'game', name: 'Conception de jeux', description: 'Créer des jeux interactifs', category: 'Jeux' },
    { id: 'simulation', name: 'Simulations', description: 'Développer des simulations réalistes', category: 'Simulations' },
    { id: 'web', name: 'Structures de sites web', description: 'Générer des structures de sites web', category: 'Web' },
    { id: 'report', name: 'Rapports', description: 'Rédiger des rapports détaillés', category: 'Documents' },
    { id: 'research', name: 'Assistance à la recherche', description: 'Aider dans les recherches', category: 'Recherche' },
    { id: 'code', name: 'Génération de code', description: 'Générer du code dans divers langages', category: 'Développement' },
    { id: 'data', name: 'Analyse de données', description: 'Analyser et visualiser des données', category: 'Data' },
    { id: 'design', name: 'Design graphique', description: 'Créer des designs graphiques', category: 'Design' },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Préparer les messages pour l'API
      const apiMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'Vous êtes GLM 4.5, un assistant IA avancé. Répondez de manière utile et précise aux questions de l\'utilisateur.'
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: inputValue
        }
      ]

      // Appeler l'API GLM 4.5
      const response = await glm45Service.sendMessage(apiMessages)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, une erreur s\'est produite lors de la communication avec GLM 4.5. Veuillez réessayer plus tard.',
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetConversation = () => {
    setMessages([])
  }

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Optionnel: Afficher une notification de succès
      console.log('Texte copié avec succès')
    } catch (err) {
      console.error('Erreur lors de la copie du texte:', err)
      // Fallback: utiliser l'ancienne méthode
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const handleExportChat = (format: 'json' | 'txt' = 'json') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    if (format === 'json') {
      const chatData = {
        messages,
        exportDate: new Date().toISOString(),
        version: '1.0',
        metadata: {
          totalMessages: messages.length,
          selectedArtifact,
          theme,
        }
      }
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `glm45-chat-${timestamp}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'txt') {
      const textContent = messages.map(msg => {
        const time = msg.timestamp.toLocaleString('fr-FR')
        return `[${time}] ${msg.role === 'user' ? 'Utilisateur' : 'GLM 4.5'}:\n${msg.content}\n`
      }).join('\n')
      
      const blob = new Blob([textContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `glm45-chat-${timestamp}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImportChat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const fileExtension = file.name.split('.').pop()?.toLowerCase()
          
          if (fileExtension === 'json') {
            const chatData = JSON.parse(content)
            if (chatData.messages && Array.isArray(chatData.messages)) {
              setMessages(chatData.messages)
              // Restaurer les métadonnées si disponibles
              if (chatData.metadata) {
                if (chatData.metadata.selectedArtifact) {
                  setSelectedArtifact(chatData.metadata.selectedArtifact)
                }
              }
            } else {
              throw new Error('Format de fichier JSON invalide')
            }
          } else if (fileExtension === 'txt') {
            // Parser le format texte
            const lines = content.split('\n')
            const parsedMessages: Message[] = []
            let currentMessage: Partial<Message> = {}
            
            for (const line of lines) {
              const timestampMatch = line.match(/^\[([^\]]+)\] (Utilisateur|GLM 4.5):$/)
              if (timestampMatch) {
                // Sauvegarder le message précédent
                if (currentMessage.content) {
                  parsedMessages.push({
                    id: Date.now().toString() + parsedMessages.length,
                    role: currentMessage.role!,
                    content: currentMessage.content,
                    timestamp: new Date(currentMessage.timestamp!),
                  })
                }
                // Démarrer un nouveau message
                currentMessage = {
                  role: timestampMatch[2] === 'Utilisateur' ? 'user' : 'assistant',
                  content: '',
                  timestamp: new Date(timestampMatch[1]),
                }
              } else if (currentMessage.role) {
                // Continuer le contenu du message actuel
                currentMessage.content += line + '\n'
              }
            }
            
            // Sauvegarder le dernier message
            if (currentMessage.content) {
              parsedMessages.push({
                id: Date.now().toString() + parsedMessages.length,
                role: currentMessage.role!,
                content: currentMessage.content.trim(),
                timestamp: new Date(currentMessage.timestamp!),
              })
            }
            
            setMessages(parsedMessages)
          } else {
            throw new Error('Format de fichier non supporté')
          }
        } catch (error) {
          console.error('Erreur lors de l\'importation:', error)
          alert('Erreur lors de l\'importation du fichier. Veuillez vérifier le format du fichier.')
        }
      }
      reader.readAsText(file)
    }
    
    // Réinitialiser l'input pour permettre de sélectionner le même fichier à nouveau
    event.target.value = ''
  }

  const handleScreenshot = async (type: 'full' | 'chat' = 'chat') => {
    try {
      let element: HTMLElement
      
      if (type === 'full') {
        // Capturer l'ensemble de la page
        element = document.body
      } else {
        // Capturer uniquement la zone de chat
        element = document.querySelector('[class*="flex flex-col items-center justify-center"]') as HTMLElement
        if (!element) {
          // Fallback: capturer la zone de chat principale
          element = document.querySelector('.max-w-6xl') as HTMLElement
        }
      }
      
      if (!element) {
        throw new Error('Élément à capturer non trouvé')
      }
      
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Haute qualité
        useCORS: true,
        allowTaint: true,
      })
      
      // Convertir en blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `glm45-screenshot-${type}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`
          a.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
      
    } catch (error) {
      console.error('Erreur lors de la capture d\'écran:', error)
      alert('Erreur lors de la capture d\'écran. Veuillez réessayer.')
    }
  }

  const handleOpenSettings = () => {
    // Placeholder pour les paramètres
    alert('Paramètres à implémenter')
  }

  const handleOpenHistory = () => {
    // Placeholder pour l'historique
    alert('Historique à implémenter')
  }

  const handleOpenFolder = () => {
    setIsFileBrowserOpen(!isFileBrowserOpen)
  }

  // Gestionnaires d'événements pour Stagewise
  const handleElementTargeted = (element: any) => {
    console.log('Élément ciblé:', element)
    // Ajouter un message dans le chat pour informer l'utilisateur
    const notificationMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `J'ai ciblé l'élément : ${element.description}. Vous pouvez maintenant envoyer une correction pour cet élément.`,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, notificationMessage])
  }

  const handleCorrectionSent = async (elementId: string, correction: string) => {
    console.log('Correction envoyée pour l\'élément:', elementId, correction)
    
    // Envoyer la correction au modèle GLM 4.5
    try {
      const apiMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'Vous êtes GLM 4.5, un assistant IA avancé. L\'utilisateur vous envoie une correction pour un élément d\'interface. Analysez cette correction et fournissez une réponse appropriée.'
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: `Correction pour l'élément ${elementId}: ${correction}`
        }
      ]

      const response = await glm45Service.sendMessage(apiMessages)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `J'ai bien reçu votre correction : "${correction}". ${response.message.content}`,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending correction:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, une erreur s\'est produite lors du traitement de votre correction. Veuillez réessayer plus tard.',
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">GLM 4.5 Terminal</h1>
              <p className="text-sm text-muted-foreground">Interface de conversation avancée</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleResetConversation}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Réinitialiser la conversation</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleOpenHistory}>
                    <History className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Historique des conversations</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleScreenshot('chat')}>
                        <Camera className="w-4 h-4 mr-2" />
                        Capturer la conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleScreenshot('full')}>
                        <Camera className="w-4 h-4 mr-2" />
                        Capturer l'écran complet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Capture d'écran</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleOpenSettings}>
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paramètres</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleOpenFolder}>
                    <FolderOpen className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ouvrir un dossier</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExportChat('json')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Exporter en JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportChat('txt')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Exporter en TXT
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exporter la conversation</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Importer une conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              className="hidden"
              onChange={handleImportChat}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau latéral */}
          <div className="lg:col-span-1 space-y-4">
            {/* Sélection d'artefact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Type d'artefact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedArtifact} onValueChange={setSelectedArtifact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {artifactTypes.map((artifact) => (
                      <SelectItem key={artifact.id} value={artifact.id}>
                        <div>
                          <div className="font-medium">{artifact.name}</div>
                          <div className="text-xs text-muted-foreground">{artifact.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Thèmes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Thème
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableThemes.map((themeName) => (
                      <SelectItem key={themeName} value={themeName}>
                        {themes[themeName].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Composant Stagewise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Stagewise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setIsStagewiseOpen(!isStagewiseOpen)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  {isStagewiseOpen ? 'Fermer' : 'Ouvrir'} le ciblage
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Zone de chat principale */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Bienvenue sur GLM 4.5 Terminal</p>
                        <p className="text-sm">Commencez une conversation en saisissant un message ci-dessous</p>
                      </div>
                    )}
                    
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs opacity-70">
                              {message.role === 'user' ? 'Vous' : 'GLM 4.5'}
                            </span>
                            <span className="text-xs opacity-50">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm">{message.content}</div>
                          <div className="flex justify-end mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyText(message.content)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs text-primary-foreground">U</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="text-sm">GLM 4.5 est en train de réfléchir...</div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <Separator className="my-4" />
                
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Saisissez votre message..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Panneau Stagewise */}
      {isStagewiseOpen && (
        <div className="max-w-6xl mx-auto mt-6">
          <Stagewise
            onElementTargeted={handleElementTargeted}
            onCorrectionSent={handleCorrectionSent}
            className="w-full"
          />
        </div>
      )}

      {/* Navigateur de dossiers */}
      {isFileBrowserOpen && (
        <div className="max-w-6xl mx-auto mt-6">
          <FileBrowser
            onFileSelected={(file) => {
              console.log('Fichier sélectionné:', file)
              const notificationMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `J'ai sélectionné le fichier : ${file.name}. Vous pouvez maintenant analyser son contenu ou demander des modifications.`,
                timestamp: new Date(),
              }
              setMessages(prev => [...prev, notificationMessage])
            }}
            onFolderSelected={(folder) => {
              console.log('Dossier sélectionné:', folder)
              const notificationMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `J'ai accédé au dossier : ${folder}. Vous pouvez naviguer dans les fichiers et sous-dossiers.`,
                timestamp: new Date(),
              }
              setMessages(prev => [...prev, notificationMessage])
            }}
            onCodeAnalysis={(filePath, issues) => {
              console.log('Analyse du code:', filePath, issues)
              const notificationMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `J'ai analysé le fichier ${filePath} et j'ai trouvé ${issues.length} problème(s) : ${issues.map(i => i.message).join(', ')}`,
                timestamp: new Date(),
              }
              setMessages(prev => [...prev, notificationMessage])
            }}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}