'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Target, 
  X, 
  Edit, 
  Send, 
  Eye,
  EyeOff,
  Plus,
  Trash2
} from 'lucide-react'

interface TargetedElement {
  id: string
  selector: string
  type: string
  content: string
  description: string
  timestamp: Date
}

interface StagewiseProps {
  onElementTargeted?: (element: TargetedElement) => void
  onCorrectionSent?: (elementId: string, correction: string) => void
  className?: string
}

export default function Stagewise({ 
  onElementTargeted, 
  onCorrectionSent, 
  className = '' 
}: StagewiseProps) {
  const [isActive, setIsActive] = useState(false)
  const [targetedElements, setTargetedElements] = useState<TargetedElement[]>([])
  const [selectedElement, setSelectedElement] = useState<TargetedElement | null>(null)
  const [correctionText, setCorrectionText] = useState('')
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive) {
      document.body.style.cursor = 'crosshair'
      enableElementTargeting()
    } else {
      document.body.style.cursor = 'default'
      disableElementTargeting()
    }

    return () => {
      document.body.style.cursor = 'default'
      disableElementTargeting()
    }
  }, [isActive])

  const enableElementTargeting = () => {
    const handleClick = (event: MouseEvent) => {
      if (!isActive) return

      event.preventDefault()
      event.stopPropagation()

      const target = event.target as HTMLElement
      if (target.closest('[data-stagewise-ignore]')) return

      const elementInfo = getElementInfo(target)
      const newElement: TargetedElement = {
        id: `element-${Date.now()}`,
        selector: generateSelector(target),
        type: getElementTypeName(target),
        content: getElementContent(target),
        description: `${getElementTypeName(target)} - ${target.className || 'sans classe'}`,
        timestamp: new Date(),
      }

      setTargetedElements(prev => [...prev, newElement])
      setSelectedElement(newElement)
      onElementTargeted?.(newElement)
      setIsActive(false)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }

  const disableElementTargeting = () => {
    // Nettoyer les écouteurs d'événements
  }

  const getElementInfo = (element: HTMLElement) => {
    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id,
      className: element.className,
      textContent: element.textContent?.slice(0, 100),
    }
  }

  const generateSelector = (element: HTMLElement): string => {
    if (element.id) {
      return `#${element.id}`
    }

    const path = []
    let current = element

    while (current && current.tagName !== 'BODY') {
      let selector = current.tagName.toLowerCase()
      
      if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`
      }
      
      path.unshift(selector)
      current = current.parentElement as HTMLElement
    }

    return path.join(' > ')
  }

  const getElementTypeName = (element: HTMLElement): string => {
    const tagName = element.tagName.toLowerCase()
    
    if (tagName === 'button') return 'Bouton'
    if (tagName === 'input') return 'Champ de saisie'
    if (tagName === 'textarea') return 'Zone de texte'
    if (tagName === 'select') return 'Liste déroulante'
    if (tagName === 'a') return 'Lien'
    if (tagName === 'img') return 'Image'
    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6') return 'Titre'
    if (tagName === 'p') return 'Paragraphe'
    if (tagName === 'div') return 'Conteneur'
    if (tagName === 'span') return 'Élément inline'
    
    return tagName.toUpperCase()
  }

  const getElementContent = (element: HTMLElement): string => {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      return (element as HTMLInputElement | HTMLTextAreaElement).value || ''
    }
    return element.textContent?.slice(0, 200) || ''
  }

  const handleSendCorrection = () => {
    if (!selectedElement || !correctionText.trim()) return

    onCorrectionSent?.(selectedElement.id, correctionText)
    setCorrectionText('')
    
    // Optionnel: afficher une confirmation
    console.log('Correction envoyée pour l\'élément:', selectedElement.id)
  }

  const handleRemoveElement = (elementId: string) => {
    setTargetedElements(prev => prev.filter(el => el.id !== elementId))
    if (selectedElement?.id === elementId) {
      setSelectedElement(null)
    }
  }

  const highlightElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      // Sauvegarder les styles originaux
      const originalOutline = element.style.outline
      const originalZIndex = element.style.zIndex
      
      // Appliquer le highlight
      element.style.outline = '2px solid #ff6b6b'
      element.style.zIndex = '9999'
      
      // Faire clignoter l'élément
      let blinkCount = 0
      const blinkInterval = setInterval(() => {
        element.style.outline = blinkCount % 2 === 0 ? '2px solid #ff6b6b' : originalOutline
        blinkCount++
        
        if (blinkCount >= 6) {
          clearInterval(blinkInterval)
          // Restaurer les styles originaux
          element.style.outline = originalOutline
          element.style.zIndex = originalZIndex
        }
      }, 300)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Contrôles principaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stagewise - Ciblage d'éléments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsActive(!isActive)}
              variant={isActive ? "destructive" : "default"}
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              {isActive ? 'Arrêter le ciblage' : 'Commencer le ciblage'}
            </Button>
            
            <Button
              onClick={() => setIsOverlayVisible(!isOverlayVisible)}
              variant="outline"
              size="icon"
            >
              {isOverlayVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          {isActive && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Mode de ciblage actif. Cliquez sur n'importe quel élément de la page pour le cibler.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des éléments ciblés */}
      {targetedElements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Éléments ciblés</span>
              <Badge variant="secondary">{targetedElements.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {targetedElements.map((element) => (
              <div key={element.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{element.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {element.timestamp.toLocaleTimeString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{element.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {element.selector}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => highlightElement(element.selector)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedElement(element)
                        setCorrectionText('')
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveElement(element.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {element.content && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <strong>Contenu:</strong> {element.content}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Panneau de correction */}
      {selectedElement && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Correction pour {selectedElement.type}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedElement(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">{selectedElement.description}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {selectedElement.selector}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Texte de correction:</label>
              <Textarea
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
                placeholder="Décrivez la correction ou la modification souhaitée pour cet élément..."
                rows={4}
              />
            </div>
            
            <Button
              onClick={handleSendCorrection}
              disabled={!correctionText.trim()}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer la correction
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Overlay de ciblage */}
      {isOverlayVisible && isActive && (
        <div
          ref={overlayRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            backdropFilter: 'blur(1px)',
          }}
        />
      )}
    </div>
  )
}