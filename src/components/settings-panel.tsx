'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  X, 
  Palette, 
  Bot, 
  Monitor,
  Download,
  Upload
} from 'lucide-react'
import { themes } from '@/lib/themes'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  currentTheme: string
  onThemeChange: (theme: string) => void
  apiKeyConfigured: boolean
  onSaveApiKey: (apiKey: string) => void
  onRemoveApiKey: () => void
  onExportChat: (format: 'json' | 'txt') => void
  onImportChat: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SettingsPanel({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  apiKeyConfigured,
  onSaveApiKey,
  onRemoveApiKey,
  onExportChat,
  onImportChat
}: SettingsPanelProps) {
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [activeTab, setActiveTab] = useState('general')

  if (!isOpen) return null

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      onSaveApiKey(apiKeyInput.trim())
      setApiKeyInput('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <Button
              variant={activeTab === 'general' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('general')}
              className="flex-1"
            >
              Général
            </Button>
            <Button
              variant={activeTab === 'api' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('api')}
              className="flex-1"
            >
              API
            </Button>
            <Button
              variant={activeTab === 'data' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('data')}
              className="flex-1"
            >
              Données
            </Button>
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <h3 className="text-lg font-semibold">Thème</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Choisir un thème</label>
                  <Select value={currentTheme} onValueChange={onThemeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(themes).map(([themeId, theme]) => (
                        <SelectItem key={themeId} value={themeId}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {Object.entries(themes).map(([themeId, theme]) => (
                      <Button
                        key={themeId}
                        variant={currentTheme === themeId ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onThemeChange(themeId)}
                        className="h-auto p-3"
                      >
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <div 
                              className="w-3 h-3 rounded border"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div 
                              className="w-3 h-3 rounded border"
                              style={{ backgroundColor: theme.colors.background }}
                            />
                          </div>
                          <span className="text-xs">{theme.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <h3 className="text-lg font-semibold">Affichage</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Taille du texte</label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Petit</SelectItem>
                      <SelectItem value="medium">Moyen</SelectItem>
                      <SelectItem value="large">Grand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <h3 className="text-lg font-semibold">Configuration API</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut de la clé API:</span>
                    <Badge variant={apiKeyConfigured ? 'default' : 'destructive'}>
                      {apiKeyConfigured ? 'Configurée' : 'Non configurée'}
                    </Badge>
                  </div>
                  
                  {!apiKeyConfigured ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ajouter une clé API</label>
                      <Input
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="Entrez votre clé API ZAI..."
                        className="w-full"
                      />
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleSaveApiKey}
                        disabled={!apiKeyInput.trim()}
                        className="w-full"
                      >
                        Sauvegarder la clé API
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Votre clé API est configurée et prête à être utilisée.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={onRemoveApiKey}
                        className="w-full"
                      >
                        Supprimer la clé API
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Data Settings */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <h3 className="text-lg font-semibold">Exportation des données</h3>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Exportez vos conversations pour les sauvegarder ou les partager.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onExportChat('json')}
                      className="flex-1"
                    >
                      Exporter en JSON
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onExportChat('txt')}
                      className="flex-1"
                    >
                      Exporter en TXT
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <h3 className="text-lg font-semibold">Importation des données</h3>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Importez des conversations précédemment exportées.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".json,.txt"
                      onChange={onImportChat}
                      style={{ display: 'none' }}
                      id="import-chat-settings"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => document.getElementById('import-chat-settings')?.click()}
                      className="flex-1"
                    >
                      Importer une conversation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}