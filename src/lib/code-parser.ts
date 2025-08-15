interface CodeBlock {
  language: string
  code: string
  title?: string
  description?: string
  fileName?: string
}

export function parseCodeBlocks(content: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = []
  
  // Regex pour trouver les blocs de code markdown
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  
  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'text'
    const code = match[2].trim()
    
    // Essayer de deviner un nom de fichier basé sur le langage
    let fileName: string | undefined
    switch (language.toLowerCase()) {
      case 'html':
        fileName = 'index.html'
        break
      case 'css':
        fileName = 'styles.css'
        break
      case 'javascript':
      case 'js':
        fileName = 'script.js'
        break
      case 'typescript':
      case 'ts':
        fileName = 'script.ts'
        break
      case 'python':
      case 'py':
        fileName = 'script.py'
        break
      case 'json':
        fileName = 'data.json'
        break
      case 'markdown':
      case 'md':
        fileName = 'README.md'
        break
      default:
        fileName = `code.${language}`
    }
    
    codeBlocks.push({
      language,
      code,
      fileName
    })
  }
  
  return codeBlocks
}

export function extractTextWithoutCode(content: string): string {
  // Supprimer les blocs de code pour ne garder que le texte
  return content.replace(/```(\w+)?\n[\s\S]*?```/g, '').trim()
}

export function generateCodeBlockTitle(language: string, index: number): string {
  const titles: Record<string, string[]> = {
    html: ['Page HTML', 'Template HTML', 'Structure HTML'],
    css: ['Feuille de style CSS', 'Styles CSS', 'Design CSS'],
    javascript: ['Script JavaScript', 'Code JavaScript', 'Logique JavaScript'],
    typescript: ['Script TypeScript', 'Code TypeScript', 'Logique TypeScript'],
    python: ['Script Python', 'Code Python', 'Programme Python'],
    json: ['Données JSON', 'Fichier JSON', 'Configuration JSON'],
    markdown: ['Documentation Markdown', 'Fichier Markdown', 'Texte Markdown'],
    text: ['Bloc de texte', 'Code texte', 'Contenu texte']
  }
  
  const languageTitles = titles[language.toLowerCase()] || titles.text
  return languageTitles[index % languageTitles.length]
}

export function generateCodeDescription(language: string): string {
  const descriptions: Record<string, string> = {
    html: 'Structure HTML complète avec éléments sémantiques',
    css: 'Feuille de style CSS avec propriétés modernes',
    javascript: 'Code JavaScript avec fonctionnalités interactives',
    typescript: 'Code TypeScript avec typage fort et fonctionnalités avancées',
    python: 'Script Python avec logique de traitement de données',
    json: 'Fichier JSON avec données structurées',
    markdown: 'Documentation Markdown avec formatage riche',
    text: 'Bloc de texte avec contenu formaté'
  }
  
  return descriptions[language.toLowerCase()] || 'Bloc de code formaté'
}