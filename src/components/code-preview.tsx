'use client'

import { useState, useEffect, useRef } from 'react'
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
  const previewRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const devices: DeviceType[] = [
    { name: 'desktop', icon: <Monitor className="w-4 h-4" />, width: '100%', height: '600px' },
    { name: 'tablet', icon: <Tablet className="w-4 h-4" />, width: '768px', height: '1024px' },
    { name: 'mobile', icon: <Smartphone className="w-4 h-4" />, width: '375px', height: '667px' }
  ]

  const currentDevice = devices.find(d => d.name === selectedDevice) || devices[0]

  useEffect(() => {
    setIsPreviewVisible(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (isPreviewVisible) {
      parseCodeContent()
    }
  }, [code, language, isPreviewVisible])

  const parseCodeContent = () => {
    setIsLoading(true)
    
    // Réinitialiser les contenus
    setHtmlContent('')
    setCssContent('')
    setJsContent('')

    // Extraire le code en fonction du langage
    if (language.toLowerCase() === 'html') {
      const cleanHtml = code.replace(/```html\n?/, '').replace(/```$/, '').trim()
      setHtmlContent(cleanHtml)
      
      // Extraire le CSS et JavaScript du HTML si présent
      const styleMatches = cleanHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
      const scriptMatches = cleanHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
      
      if (styleMatches) {
        const css = styleMatches.map(match => match.replace(/<style[^>]*>/, '').replace(/<\/style>/, '')).join('\n')
        setCssContent(css)
      }
      
      if (scriptMatches) {
        const js = scriptMatches.map(match => match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')).join('\n')
        setJsContent(js)
      }
    } else if (language.toLowerCase() === 'css') {
      const cleanCss = code.replace(/```css\n?/, '').replace(/```$/, '').trim()
      setCssContent(cleanCss)
      
      // Créer un HTML simple pour le CSS
      setHtmlContent(`
        <div class="css-preview">
          <h1>Preview CSS</h1>
          <p>Ceci est un exemple de texte pour tester le CSS.</p>
          <button>Bouton exemple</button>
          <div class="container">
            <div class="box">Box 1</div>
            <div class="box">Box 2</div>
          </div>
        </div>
      `)
    } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
      const cleanJs = code.replace(/```javascript\n?/, '').replace(/```js\n?/, '').replace(/```$/, '').trim()
      setJsContent(cleanJs)
      
      // Créer un HTML simple pour le JavaScript
      setHtmlContent(`
        <div class="js-preview">
          <h1>Preview JavaScript</h1>
          <button id="testButton">Tester le JavaScript</button>
          <div id="output"></div>
        </div>
      `)
    } else {
      // Essayer de détecter le type de code dans le contenu
      const htmlMatches = code.match(/```html\n([\s\S]*?)```/g) || code.match(/<html[^>]*>[\s\S]*?<\/html>/gi)
      const cssMatches = code.match(/```css\n([\s\S]*?)```/g) || code.match(/<style[^>]*>[\s\S]*?<\/style>/gi)
      const jsMatches = code.match(/```javascript\n([\s\S]*?)```/g) || code.match(/```js\n([\s\S]*?)```/g) || code.match(/<script[^>]*>[\s\S]*?<\/script>/gi)

      if (htmlMatches) {
        const htmlCode = htmlMatches[0].replace(/```html\n?/, '').replace(/```$/, '')
        setHtmlContent(htmlCode)
      }
      
      if (cssMatches) {
        const cssCode = cssMatches[0].replace(/```css\n?/, '').replace(/```$/, '')
        setCssContent(cssCode)
      }
      
      if (jsMatches) {
        const jsCode = jsMatches[0].replace(/```javascript\n?/, '').replace(/```js\n?/, '').replace(/```$/, '')
        setJsContent(jsCode)
      }
      
      // Si aucun contenu spécifique n'est trouvé, utiliser le code comme HTML
      if (!htmlMatches && !cssMatches && !jsMatches) {
        const cleanCode = code.replace(/```(\w+)?\n?/, '').replace(/```$/, '').trim()
        if (cleanCode.includes('<') || cleanCode.includes('>')) {
          setHtmlContent(cleanCode)
        } else {
          setJsContent(cleanCode)
        }
      }
    }

    setTimeout(() => {
      setIsLoading(false)
      updatePreview()
    }, 500)
  }

  const updatePreview = () => {
    if (!previewRef.current) return

    const previewDoc = previewRef.current.contentDocument || previewRef.current.contentWindow?.document
    if (!previewDoc) return

    let fullHtml = htmlContent

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
                      output.innerHTML = '<p style=\"color: green; font-weight: bold;\">Le JavaScript fonctionne bien!</p>';
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

    previewDoc.open()
    previewDoc.write(fullHtml)
    previewDoc.close()
    
    // Forcer le rechargement des styles et scripts
    setTimeout(() => {
      if (previewDoc) {
        // Recréer les éléments dynamiques si nécessaire
        const allScripts = previewDoc.querySelectorAll('script');
        allScripts.forEach(script => {
          const newScript = previewDoc.createElement('script');
          newScript.textContent = script.textContent;
          script.parentNode?.replaceChild(newScript, script);
        });
      }
    }, 100)
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
            height: isFullscreen ? 'calc(100vh - 60px)' : currentDevice.height,
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
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Code Preview"
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