'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  Download,
  Copy,
  Palette,
  Settings
} from 'lucide-react'

interface CodePreviewProps {
  code: string
  language: string
  title?: string
  description?: string
  fileName?: string
  isOpen?: boolean
  onToggle?: () => void
}

interface DeviceType {
  name: string
  icon: React.ReactNode
  width: string
  height: string
}

export default function CodePreview({
  code,
  language,
  title,
  description,
  fileName,
  isOpen = false,
  onToggle
}: CodePreviewProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(isOpen)
  const [selectedDevice, setSelectedDevice] = useState('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [cssContent, setCssContent] = useState('')
  const [jsContent, setJsContent] = useState('')
  const [previewTheme, setPreviewTheme] = useState('light')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [iframeHeight, setIframeHeight] = useState('600px')
  const [iframeContent, setIframeContent] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const previewRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const devices: DeviceType[] = [
    { name: 'desktop', icon: <Monitor className="w-4 h-4" />, width: '100%', height: '600px' },
    { name: 'tablet', icon: <Tablet className="w-4 h-4" />, width: '768px', height: '1024px' },
    { name: 'mobile', icon: <Smartphone className="w-4 h-4" />, width: '375px', height: '667px' }
  ]

  const currentDevice = devices.find(d => d.name === selectedDevice) || devices[0]
  
  // Fonction de debounce pour optimiser les rafraîchissements
  const debouncedParseCodeContent = useCallback(() => {
    const timer = setTimeout(() => {
      if (isPreviewVisible) {
        parseCodeContent()
      }
    }, 300) // Délai de 300ms pour éviter les rafraîchissements trop fréquents
    
    return () => clearTimeout(timer)
  }, [isPreviewVisible, code, language, selectedDevice, previewTheme])

  useEffect(() => {
    setIsPreviewVisible(isOpen)
  }, [isOpen])

  useEffect(() => {
    const cleanup = debouncedParseCodeContent()
    return cleanup
  }, [code, language, isPreviewVisible, debouncedParseCodeContent])

  useEffect(() => {
    const cleanup = debouncedParseCodeContent()
    return cleanup
  }, [selectedDevice, debouncedParseCodeContent]) // Rafraîchir lors du changement de device

  useEffect(() => {
    const cleanup = debouncedParseCodeContent()
    return cleanup
  }, [previewTheme, debouncedParseCodeContent]) // Rafraîchir lors du changement de thème

  const parseCodeContent = () => {
    setIsLoading(true)
    setDebugInfo('') // Reset debug info
    
    console.log('=== DÉBOGAGE PARSE CODE CONTENT ===')
    console.log('Code reçu:', code)
    console.log('Langage:', language)
    
    // Réinitialiser les contenus
    setHtmlContent('')
    setCssContent('')
    setJsContent('')

    // Nettoyer le code en fonction du langage
    let cleanCode = code.replace(/```(\w+)?\n?/, '').replace(/```$/, '').trim()
    console.log('Code nettoyé:', cleanCode)

    // Détecter si c'est du HTML complet
    const isFullHtml = cleanCode.toLowerCase().includes('<!doctype html>') || 
                       cleanCode.toLowerCase().includes('<html') ||
                       cleanCode.toLowerCase().includes('<head') ||
                       cleanCode.toLowerCase().includes('<body')

    console.log('Est-ce du HTML complet?', isFullHtml)

    let finalHtmlContent = ''
    let finalCssContent = ''
    let finalJsContent = ''

    if (isFullHtml) {
      // Si c'est du HTML complet, utiliser un parser pour extraire le contenu
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(cleanCode, 'text/html')
        
        // Extraire le contenu du body
        finalHtmlContent = doc.body.innerHTML
        
        // Extraire les styles du head
        const styleTags = doc.querySelectorAll('style')
        finalCssContent = Array.from(styleTags).map(style => style.innerHTML).join('\n')
        
        // Extraire les scripts du body
        const scriptTags = doc.querySelectorAll('script')
        finalJsContent = Array.from(scriptTags).map(script => script.innerHTML).join('\n')
        
        console.log('HTML extrait du body:', finalHtmlContent)
        console.log('CSS extrait:', finalCssContent)
        console.log('JS extrait:', finalJsContent)
        
        setDebugInfo(`HTML complet détecté - Body: ${finalHtmlContent.length} chars, CSS: ${finalCssContent.length} chars, JS: ${finalJsContent.length} chars`)
      } catch (error) {
        console.error('Erreur lors du parsing HTML:', error)
        finalHtmlContent = cleanCode // Fallback: utiliser le code brut
        setDebugInfo(`Erreur parsing HTML: ${error}`)
      }
    } else {
      // Gérer les cas de code spécifiques
      if (language.toLowerCase() === 'html') {
        finalHtmlContent = cleanCode
        
        // Extraire le CSS et JavaScript du HTML si présent
        const styleMatches = cleanCode.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
        const scriptMatches = cleanCode.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
        
        if (styleMatches) {
          finalCssContent = styleMatches.map(match => match.replace(/<style[^>]*>/, '').replace(/<\/style>/, '')).join('\n')
        }
        
        if (scriptMatches) {
          finalJsContent = scriptMatches.map(match => match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')).join('\n')
        }
      } else if (language.toLowerCase() === 'css') {
        finalCssContent = cleanCode
        
        // Créer un HTML simple pour le CSS
        finalHtmlContent = `
          <div class="css-preview">
            <h1>Preview CSS</h1>
            <p>Ceci est un exemple de texte pour tester le CSS.</p>
            <button>Bouton exemple</button>
            <div class="container">
              <div class="box">Box 1</div>
              <div class="box">Box 2</div>
            </div>
          </div>
        `
      } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
        finalJsContent = cleanCode
        
        // Créer un HTML simple pour le JavaScript
        finalHtmlContent = `
          <div class="js-preview">
            <h1>Preview JavaScript</h1>
            <button id="testButton">Tester le JavaScript</button>
            <div id="output"></div>
          </div>
        `
      } else {
        // Essayer de détecter le type de code dans le contenu
        const htmlMatches = cleanCode.match(/```html\n([\s\S]*?)```/g) || cleanCode.match(/<html[^>]*>[\s\S]*?<\/html>/gi)
        const cssMatches = cleanCode.match(/```css\n([\s\S]*?)```/g) || cleanCode.match(/<style[^>]*>[\s\S]*?<\/style>/gi)
        const jsMatches = cleanCode.match(/```javascript\n([\s\S]*?)```/g) || cleanCode.match(/```js\n([\s\S]*?)```/g) || cleanCode.match(/<script[^>]*>[\s\S]*?<\/script>/gi)

        if (htmlMatches) {
          finalHtmlContent = htmlMatches[0].replace(/```html\n?/, '').replace(/```$/, '')
        }
        
        if (cssMatches) {
          finalCssContent = cssMatches[0].replace(/```css\n?/, '').replace(/```$/, '')
        }
        
        if (jsMatches) {
          finalJsContent = jsMatches[0].replace(/```javascript\n?/, '').replace(/```js\n?/, '').replace(/```$/, '')
        }
        
        // Si aucun contenu spécifique n'est trouvé, utiliser le code comme HTML
        if (!htmlMatches && !cssMatches && !jsMatches) {
          if (cleanCode.includes('<') || cleanCode.includes('>')) {
            finalHtmlContent = cleanCode
          } else {
            finalJsContent = cleanCode
          }
        }
      }
    }

    // Mettre à jour les états
    setHtmlContent(finalHtmlContent)
    setCssContent(finalCssContent)
    setJsContent(finalJsContent)

    console.log('=== FIN DÉBOGAGE PARSE CODE CONTENT ===')
    
    setTimeout(() => {
      setIsLoading(false)
      updatePreview()
    }, 500)
  }

  const updatePreview = () => {
    console.log('=== DÉBOGAGE UPDATE PREVIEW ===')
    console.log('HTML Content:', htmlContent)
    console.log('CSS Content:', cssContent)
    console.log('JS Content:', jsContent)

    let fullHtml = ''

    // Si on a du contenu HTML, CSS ou JS séparément, créer une page complète
    if (htmlContent || cssContent || jsContent) {
      fullHtml = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            /* Reset CSS */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
            }
            
            /* Styles de base pour les éléments communs */
            h1, h2, h3, h4, h5, h6 {
              margin-bottom: 1rem;
              color: #2c3e50;
            }
            
            p {
              margin-bottom: 1rem;
            }
            
            button {
              padding: 8px 16px;
              margin: 4px;
              border: none;
              border-radius: 4px;
              background-color: #3498db;
              color: white;
              cursor: pointer;
              transition: background-color 0.3s;
            }
            
            button:hover {
              background-color: #2980b9;
            }
            
            .container {
              display: flex;
              gap: 16px;
              flex-wrap: wrap;
            }
            
            .box {
              padding: 16px;
              border: 1px solid #ddd;
              border-radius: 4px;
              background-color: #f9f9f9;
            }
            
            /* CSS personnalisé */
            ${cssContent}
          </style>
        </head>
        <body>
          ${htmlContent || '<div><h1>Preview</h1><p>Aucun contenu à afficher.</p></div>'}
          
          <!-- JavaScript -->
          <script>
            // JavaScript personnalisé
            ${jsContent}
            
            // Scripts de démonstration si aucun JS personnalisé
            ${!jsContent.trim() ? `
              // Script de démonstration pour les boutons
              document.addEventListener('DOMContentLoaded', function() {
                const testButton = document.getElementById('testButton');
                if (testButton) {
                  testButton.addEventListener('click', function() {
                    const output = document.getElementById('output');
                    if (output) {
                      output.innerHTML = '<p style="color: green; font-weight: bold;">Le JavaScript fonctionne bien!</p>';
                    }
                  });
                }
                
                // Ajouter des interactions aux éléments
                const buttons = document.querySelectorAll('button:not(#testButton)');
                buttons.forEach(button => {
                  button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                      this.style.transform = 'scale(1)';
                    }, 100);
                  });
                });
              });
            ` : ''}
          </script>
        </body>
        </html>
      `
    }

    console.log('HTML généré pour srcdoc:', fullHtml.substring(0, 200) + '...')
    setIframeContent(fullHtml)
    console.log('=== FIN DÉBOGAGE UPDATE PREVIEW ===')
  }

  const handleRefreshPreview = () => {
    setIsLoading(true)
    parseCodeContent()
  }

  const handleDownloadPreview = () => {
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview - ${title || 'Code Preview'}</title>
        <style>
          /* Reset CSS */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
          }
          
          /* Styles de base pour les éléments communs */
          h1, h2, h3, h4, h5, h6 {
            margin-bottom: 1rem;
            color: #2c3e50;
          }
          
          p {
            margin-bottom: 1rem;
          }
          
          button {
            padding: 8px 16px;
            margin: 4px;
            border: none;
            border-radius: 4px;
            background-color: #3498db;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          
          button:hover {
            background-color: #2980b9;
          }
          
          .container {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }
          
          .box {
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
          }
          
          /* CSS personnalisé */
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent || '<div><h1>Preview</h1><p>Aucun contenu à afficher.</p></div>'}
        
        <!-- JavaScript -->
        <script>
          // JavaScript personnalisé
          ${jsContent}
          
          // Scripts de démonstration si aucun JS personnalisé
          ${!jsContent.trim() ? `
            document.addEventListener('DOMContentLoaded', function() {
              const testButton = document.getElementById('testButton');
              if (testButton) {
                testButton.addEventListener('click', function() {
                  const output = document.getElementById('output');
                  if (output) {
                    output.innerHTML = '<p style="color: green; font-weight: bold;">Le JavaScript fonctionne bien!</p>';
                  }
                });
              }
              
              const buttons = document.querySelectorAll('button:not(#testButton)');
              buttons.forEach(button => {
                button.addEventListener('click', function() {
                  this.style.transform = 'scale(0.95)';
                  setTimeout(() => {
                    this.style.transform = 'scale(1)';
                  }, 100);
                });
              });
            });
          ` : ''}
        </script>
      </body>
      </html>
    `
    
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `preview-${fileName || 'code'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (err) {
      console.error('Erreur lors de la copie du code:', err)
    }
  }

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || `preview.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const togglePreview = () => {
    const newState = !isPreviewVisible
    setIsPreviewVisible(newState)
    if (onToggle) {
      onToggle()
    }
  }

  if (!isPreviewVisible) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Preview</span>
              <Badge variant="outline" className="text-xs">
                {language}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={togglePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Afficher la preview
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <CardTitle className="text-lg">
              {title || `Preview ${language}`}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
            <Button variant="ghost" size="sm" onClick={togglePreview}>
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Device Selector and Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Appareil:</span>
            <div className="flex gap-1">
              {devices.map((device) => (
                <Button
                  key={device.name}
                  variant={selectedDevice === device.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDevice(device.name)}
                  className="p-2"
                >
                  {device.icon}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={previewTheme} onValueChange={setPreviewTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshPreview}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvancedOptions && (
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">Options avancées:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPreview}>
                <Download className="w-4 h-4 mr-1" />
                Exporter HTML
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                <Copy className="w-4 h-4 mr-1" />
                Copier code
              </Button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Debug Info:</span>
            </div>
            <p className="text-xs text-blue-700 font-mono">
              {debugInfo}
            </p>
          </div>
        )}

        {/* Preview Content */}
        <div className={`border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
          <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
            <span className="text-xs font-medium">
              Preview - {currentDevice.name}
            </span>
            {fileName && (
              <span className="text-xs opacity-70">
                {fileName}
              </span>
            )}
          </div>
          
          <div className="p-4 bg-white" style={{ 
            height: isFullscreen ? 'calc(100vh - 60px)' : iframeHeight,
            width: isFullscreen ? '100vw' : currentDevice.width,
            overflow: 'auto'
          }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <iframe
                ref={previewRef}
                srcDoc={iframeContent}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Code Preview"
                onLoad={(e) => {
                  try {
                    const iframe = e.currentTarget
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                    if (iframeDoc) {
                      const newHeight = Math.max(
                        iframeDoc.body.scrollHeight,
                        iframeDoc.documentElement.scrollHeight,
                        400 // Hauteur minimum
                      )
                      setIframeHeight(`${newHeight}px`)
                      console.log('Hauteur de l\'iframe ajustée à:', newHeight)
                    }
                  } catch (error) {
                    console.error('Erreur lors de l\'ajustement de la hauteur:', error)
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Code Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex items-center gap-1"
            >
              <Copy className="w-3 h-4" />
              Copier
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPreview}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Exporter HTML
            </Button>
          </div>
          
          <span className="text-xs text-muted-foreground">
            Cliquez sur rafraîchir pour mettre à jour la preview
          </span>
        </div>

        {/* Code Content Tabs */}
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="mt-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-64">
              <code>{code}</code>
            </pre>
          </TabsContent>
          
          <TabsContent value="html" className="mt-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-64">
              <code>{htmlContent || 'Aucun contenu HTML'}</code>
            </pre>
          </TabsContent>
          
          <TabsContent value="css" className="mt-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-64">
              <code>{cssContent || 'Aucun contenu CSS'}</code>
            </pre>
          </TabsContent>
          
          <TabsContent value="js" className="mt-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-64">
              <code>{jsContent || 'Aucun contenu JavaScript'}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}