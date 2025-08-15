'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Copy, 
  Download, 
  Play, 
  CheckCircle,
  Code,
  FileText,
  Palette,
  Cpu
} from 'lucide-react'

interface CodeDisplayProps {
  code: string
  language: string
  title?: string
  description?: string
  fileName?: string
}

export default function CodeDisplay({
  code,
  language,
  title,
  description,
  fileName
}: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie du code:', err)
    }
  }

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || `code.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLanguageIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'html':
        return <FileText className="w-4 h-4" />
      case 'css':
        return <Palette className="w-4 h-4" />
      case 'javascript':
      case 'typescript':
        return <Cpu className="w-4 h-4" />
      default:
        return <Code className="w-4 h-4" />
    }
  }

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'html':
        return 'bg-orange-500'
      case 'css':
        return 'bg-blue-500'
      case 'javascript':
        return 'bg-yellow-500'
      case 'typescript':
        return 'bg-blue-600'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getLanguageIcon(language)}
            <CardTitle className="text-lg">
              {title || `Code ${language}`}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
          </div>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="flex items-center gap-1"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? 'Copié!' : 'Copier'}
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
          </div>
          
          {fileName && (
            <div className="text-sm text-muted-foreground">
              {fileName}
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Code Display */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${getLanguageColor(language)}`} />
            <span className="text-sm font-medium">{language}</span>
          </div>
          
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code className="language-{language}">
              {code}
            </code>
          </pre>
        </div>
        
        {/* Usage Instructions */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-1">Comment utiliser ce code :</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Copiez le code en utilisant le bouton "Copier"</li>
            <li>• Téléchargez le fichier avec le bouton "Télécharger"</li>
            <li>• Intégrez-le dans votre projet selon vos besoins</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}