'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FolderOpen, 
  File, 
  FileText, 
  Code, 
  Image, 
  Music, 
  Video, 
  Archive,
  ChevronRight,
  ChevronDown,
  Search,
  RefreshCw,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'folder'
  size?: number
  modified?: Date
  extension?: string
  content?: string
}

interface CodeIssue {
  line: number
  column: number
  severity: 'error' | 'warning' | 'info'
  message: string
  code?: string
}

interface FileBrowserProps {
  onFileSelected?: (file: FileItem) => void
  onFolderSelected?: (folder: string) => void
  onCodeAnalysis?: (filePath: string, issues: CodeIssue[]) => void
  className?: string
}

export default function FileBrowser({ 
  onFileSelected, 
  onFolderSelected, 
  onCodeAnalysis,
  className = '' 
}: FileBrowserProps) {
  const [currentPath, setCurrentPath] = useState('/')
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [codeIssues, setCodeIssues] = useState<CodeIssue[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simuler le chargement des fichiers (dans une vraie application, cela viendrait d'une API)
  useEffect(() => {
    loadFiles(currentPath)
  }, [currentPath])

  const loadFiles = async (path: string) => {
    setIsLoading(true)
    
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Générer des fichiers de démonstration
    const mockFiles: FileItem[] = generateMockFiles(path)
    setFiles(mockFiles)
    setIsLoading(false)
  }

  const generateMockFiles = (path: string): FileItem[] => {
    const baseFiles: FileItem[] = [
      { name: 'README.md', path: `${path}/README.md`, type: 'file', extension: 'md' },
      { name: 'package.json', path: `${path}/package.json`, type: 'file', extension: 'json' },
      { name: 'src', path: `${path}/src`, type: 'folder' },
      { name: 'public', path: `${path}/public`, type: 'folder' },
      { name: 'components', path: `${path}/components`, type: 'folder' },
      { name: 'utils', path: `${path}/utils`, type: 'folder' },
    ]

    if (path.includes('/src')) {
      baseFiles.push(
        { name: 'App.tsx', path: `${path}/App.tsx`, type: 'file', extension: 'tsx' },
        { name: 'index.ts', path: `${path}/index.ts`, type: 'file', extension: 'ts' },
        { name: 'styles.css', path: `${path}/styles.css`, type: 'file', extension: 'css' },
      )
    }

    if (path.includes('/components')) {
      baseFiles.push(
        { name: 'Button.tsx', path: `${path}/Button.tsx`, type: 'file', extension: 'tsx' },
        { name: 'Card.tsx', path: `${path}/Card.tsx`, type: 'file', extension: 'tsx' },
        { name: 'Modal.tsx', path: `${path}/Modal.tsx`, type: 'file', extension: 'tsx' },
      )
    }

    return baseFiles.map(file => ({
      ...file,
      size: Math.floor(Math.random() * 10000),
      modified: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }))
  }

  const handleFileClick = async (file: FileItem) => {
    if (file.type === 'folder') {
      if (expandedFolders.has(file.path)) {
        const newExpanded = new Set(expandedFolders)
        newExpanded.delete(file.path)
        setExpandedFolders(newExpanded)
      } else {
        const newExpanded = new Set(expandedFolders)
        newExpanded.add(file.path)
        setExpandedFolders(newExpanded)
      }
      onFolderSelected?.(file.path)
    } else {
      setSelectedFile(file)
      onFileSelected?.(file)
      
      // Charger le contenu du fichier
      if (isCodeFile(file.extension)) {
        await loadFileContent(file)
      }
    }
  }

  const loadFileContent = async (file: FileItem) => {
    // Simuler le chargement du contenu
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const mockContent = generateMockContent(file.extension)
    setSelectedFile(prev => prev ? { ...prev, content: mockContent } : null)
  }

  const generateMockContent = (extension?: string): string => {
    switch (extension) {
      case 'tsx':
      case 'ts':
        return `import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Component({ title, children }: Props) {
  return (
    <div className="component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}`
      case 'js':
        return `function example() {
  console.log('Hello, World!');
  return 42;
}`
      case 'json':
        return `{
  "name": "example",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}`
      case 'css':
        return `.component {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}`
      default:
        return 'Contenu du fichier...'
    }
  }

  const isCodeFile = (extension?: string): boolean => {
    return ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'scala', 'rust', 'sql'].includes(extension || '')
  }

  const analyzeCode = async () => {
    if (!selectedFile || !isCodeFile(selectedFile.extension)) return

    setIsAnalyzing(true)
    
    // Simuler l'analyse du code
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockIssues: CodeIssue[] = generateMockIssues(selectedFile.content || '')
    setCodeIssues(mockIssues)
    onCodeAnalysis?.(selectedFile.path, mockIssues)
    setIsAnalyzing(false)
  }

  const generateMockIssues = (content: string): CodeIssue[] => {
    const issues: CodeIssue[] = []
    const lines = content.split('\n')
    
    // Simuler la détection d'erreurs
    if (content.includes('console.log')) {
      issues.push({
        line: lines.findIndex(line => line.includes('console.log')) + 1,
        column: 2,
        severity: 'warning',
        message: 'Les console.log devraient être retirés en production',
      })
    }
    
    if (content.includes('TODO') || content.includes('FIXME')) {
      issues.push({
        line: lines.findIndex(line => line.includes('TODO') || line.includes('FIXME')) + 1,
        column: 0,
        severity: 'info',
        message: 'Commentaire TODO/FIXME trouvé',
      })
    }
    
    return issues
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.path) ? 
        <ChevronDown className="w-4 h-4" /> : 
        <ChevronRight className="w-4 h-4" />
    }
    
    switch (file.extension) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <Code className="w-4 h-4" />
      case 'md':
      case 'txt':
        return <FileText className="w-4 h-4" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-4 h-4" />
      case 'mp3':
      case 'wav':
        return <Music className="w-4 h-4" />
      case 'mp4':
      case 'avi':
        return <Video className="w-4 h-4" />
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="w-4 h-4" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date?: Date): string => {
    if (!date) return ''
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Contrôles du navigateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Navigateur de dossiers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Rechercher des fichiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => loadFiles(currentPath)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Chemin actuel : {currentPath}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Liste des fichiers */}
        <Card>
          <CardHeader>
            <CardTitle>Fichiers et dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Chargement...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.path}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                        selectedFile?.path === file.path ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleFileClick(file)}
                    >
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {file.type === 'file' ? formatFileSize(file.size) : 'Dossier'} • {formatDate(file.modified)}
                        </div>
                      </div>
                      {file.type === 'folder' && expandedFolders.has(file.path) && (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Aperçu et analyse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Aperçu du fichier</span>
              {selectedFile && isCodeFile(selectedFile.extension) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={analyzeCode}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Analyser
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getFileIcon(selectedFile)}
                  <div>
                    <div className="font-medium">{selectedFile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {formatDate(selectedFile.modified)}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {selectedFile.content ? (
                  <div className="space-y-4">
                    <ScrollArea className="h-[200px]">
                      <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                        {selectedFile.content}
                      </pre>
                    </ScrollArea>
                    
                    {codeIssues.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Problèmes détectés ({codeIssues.length})
                        </div>
                        <ScrollArea className="h-[150px]">
                          <div className="space-y-2">
                            {codeIssues.map((issue, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded-lg border-l-4 ${
                                  issue.severity === 'error' ? 'border-red-500 bg-red-50' :
                                  issue.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                                  'border-blue-500 bg-blue-50'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {issue.severity === 'error' ? (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                  ) : issue.severity === 'warning' ? (
                                    <Clock className="w-4 h-4 text-yellow-500" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                  )}
                                  <span className="text-sm font-medium">
                                    Ligne {issue.line}, Colonne {issue.column}
                                  </span>
                                </div>
                                <p className="text-sm">{issue.message}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aperçu non disponible pour ce type de fichier</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sélectionnez un fichier pour voir son contenu</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          // Gérer l'upload de fichiers
          console.log('Files uploaded:', e.target.files)
        }}
      />
    </div>
  )
}