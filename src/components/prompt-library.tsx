'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Lightbulb, 
  Code, 
  Palette, 
  ShoppingCart, 
  Gamepad2, 
  FileText, 
  BarChart3, 
  Globe,
  Zap,
  Copy,
  Filter
} from 'lucide-react'

interface PromptTemplate {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  icon: React.ReactNode
  difficulty: 'débutant' | 'intermédiaire' | 'avancé'
  tags: string[]
}

interface PromptLibraryProps {
  onPromptSelect: (prompt: string) => void
  className?: string
}

export default function PromptLibrary({ onPromptSelect, className = '' }: PromptLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('tous')
  const [searchQuery, setSearchQuery] = useState('')

  const promptTemplates: PromptTemplate[] = [
    {
      id: 'html-basic',
      title: 'Page HTML simple',
      description: 'Crée une structure HTML5 de base avec en-tête et pied de page',
      prompt: 'Crée une page HTML5 complète avec doctype, en-tête contenant le titre "Ma Page Web", corps avec un contenu principal et un pied de page. Assure-toi que le code est valide et fonctionnel.',
      category: 'web',
      icon: <Globe className="w-4 h-4" />,
      difficulty: 'débutant',
      tags: ['html', 'base', 'structure']
    },
    {
      id: 'css-card',
      title: 'Carte produit',
      description: 'Génère une carte produit moderne avec image, titre et prix',
      prompt: 'Crée une carte produit en HTML et CSS avec une image placeholder, un titre, une description courte, un prix et un bouton. Utilise un design moderne avec des ombres et des espacements élégants. Rends le design responsive.',
      category: 'design',
      icon: <Palette className="w-4 h-4" />,
      difficulty: 'débutant',
      tags: ['css', 'carte', 'produit', 'responsive']
    },
    {
      id: 'js-form',
      title: 'Formulaire interactif',
      description: 'Formulaire de contact avec validation JavaScript',
      prompt: 'Crée un formulaire de contact HTML avec champs pour nom, email et message. Ajoute du JavaScript pour valider le formulaire avant soumission : vérifie que tous les champs sont remplis et que l\'email a un format valide. Affiche des messages d\'erreur ou de succès.',
      category: 'javascript',
      icon: <Code className="w-4 h-4" />,
      difficulty: 'intermédiaire',
      tags: ['javascript', 'formulaire', 'validation', 'html']
    },
    {
      id: 'boutique-bijoux',
      title: 'Boutique de bijoux',
      description: 'Page complète pour une boutique de bijoux en ligne',
      prompt: 'Crée une boutique de bijoux complète en HTML/CSS/JavaScript avec : 1) Une en-tête avec logo et menu de navigation, 2) Une section principale avec carrousel d\'images pour mettre en vedette les bijoux, 3) Une grille de produits avec images, noms, prix et boutons "Ajouter au panier", 4) Des catégories de bijoux (bagues, colliers, bracelets, boucles d\'oreilles), 5) Un pied de page avec informations de contact, 6) Un panier d\'achat fonctionnel, 7) Un design moderne et élégant avec des couleurs dorées et sobres. Fournis le code HTML complet avec CSS intégré et JavaScript pour les fonctionnalités interactives.',
      category: 'ecommerce',
      icon: <ShoppingCart className="w-4 h-4" />,
      difficulty: 'avancé',
      tags: ['ecommerce', 'bijoux', 'boutique', 'complet']
    },
    {
      id: 'jeu-memoire',
      title: 'Jeu de mémoire',
      description: 'Jeu de mémoire simple avec cartes à retourner',
      prompt: 'Crée un jeu de mémoire en HTML, CSS et JavaScript. Le jeu doit avoir une grille de cartes (par exemple 4x4) que le joueur peut retourner deux par deux pour trouver des paires. Ajoute un compteur de tentatives et un message de victoire quand toutes les paires sont trouvées. Utilise des emojis ou des symboles simples pour les faces des cartes.',
      category: 'jeux',
      icon: <Gamepad2 className="w-4 h-4" />,
      difficulty: 'intermédiaire',
      tags: ['jeu', 'mémoire', 'javascript', 'css']
    },
    {
      id: 'tableau-donnees',
      title: 'Tableau de données',
      description: 'Tableau interactif avec tri et filtrage',
      prompt: 'Crée un tableau de données HTML avec des colonnes pour Nom, Email, Rôle et Date. Ajoute du JavaScript pour permettre de trier les données par colonne en cliquant sur les en-têtes. Ajoute aussi un champ de recherche pour filtrer les données en temps réel. Utilise un design moderne avec des lignes alternées pour une meilleure lisibilité.',
      category: 'data',
      icon: <BarChart3 className="w-4 h-4" />,
      difficulty: 'intermédiaire',
      tags: ['tableau', 'données', 'tri', 'filtrage', 'javascript']
    },
    {
      id: 'carousel-images',
      title: 'Carrousel d\'images',
      description: 'Carrousel automatique avec navigation manuelle',
      prompt: 'Crée un carrousel d\'images en HTML, CSS et JavaScript. Le carrousel doit défiler automatiquement toutes les 5 secondes et permettre aussi une navigation manuelle avec des boutons précédent/suivant et des indicateurs de diapositive. Utilise des images placeholder et ajoute des transitions douces entre les diapositives.',
      category: 'design',
      icon: <Zap className="w-4 h-4" />,
      difficulty: 'intermédiaire',
      tags: ['carrousel', 'images', 'javascript', 'animations']
    },
    {
      id: 'rapport-pdf',
      title: 'Générateur de rapport',
      description: 'Structure pour un rapport PDF professionnel',
      prompt: 'Crée une structure HTML pour un rapport PDF professionnel avec : 1) Une page de titre avec logo, titre du rapport, auteur et date, 2) Une table des matières cliquable, 3) Des sections pour introduction, méthodologie, résultats et conclusion, 4) Des en-têtes et pieds de page avec numérotation. Utilise un style formel et professionnel adapté à l\'impression en PDF.',
      category: 'documents',
      icon: <FileText className="w-4 h-4" />,
      difficulty: 'débutant',
      tags: ['rapport', 'pdf', 'professionnel', 'structure']
    }
  ]

  const categories = ['tous', 'web', 'design', 'javascript', 'ecommerce', 'jeux', 'data', 'documents']
  
  const filteredPrompts = promptTemplates.filter(prompt => {
    const matchesCategory = selectedCategory === 'tous' || prompt.category === selectedCategory
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'débutant': return 'bg-green-100 text-green-800'
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800'
      case 'avancé': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Bibliothèque de Prompts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtres */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Filter className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un prompt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Liste des prompts */}
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun prompt trouvé pour cette recherche
              </div>
            ) : (
              filteredPrompts.map((prompt) => (
                <Card key={prompt.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {prompt.icon}
                          <h3 className="font-medium text-sm">{prompt.title}</h3>
                          <Badge className={`text-xs ${getDifficultyColor(prompt.difficulty)}`}>
                            {prompt.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {prompt.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {prompt.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs bg-muted p-2 rounded font-mono">
                          {prompt.prompt.length > 100 
                            ? `${prompt.prompt.substring(0, 100)}...` 
                            : prompt.prompt}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onPromptSelect(prompt.prompt)}
                        className="whitespace-nowrap"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Utiliser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}