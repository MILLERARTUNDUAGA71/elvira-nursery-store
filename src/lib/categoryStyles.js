import {
TreePine,
Flower2,
Sprout,
Leaf,
Trees,
Grid3x3,
Waves,
Shrub,
Palmtree,
CircleDot,
Wind,
Sparkles,
} from 'lucide-react'

// Ícono + color de acento por categoría. "default" cubre cualquier categoría nueva.
export const categoryStyles = {
Palmas: { icon: Palmtree, color: '#1E3B2A', bg: '#E8EEE6' },
Crotons: { icon: Sparkles, color: '#B4432E', bg: '#FBEAE3' },
Suculentas: { icon: CircleDot, color: '#B8862F', bg: '#F5EEDD' },
'Arbustos con flor': { icon: Flower2, color: '#B4432E', bg: '#F9E4E9' },
Follaje: { icon: Leaf, color: '#4C7A52', bg: '#EAF1E7' },
'Follaje de color': { icon: Leaf, color: '#D97A55', bg: '#FBEEE4' },
'Follaje tropical': { icon: Trees, color: '#2E5240', bg: '#E4EEE6' },
Bromelias: { icon: Sparkles, color: '#B8862F', bg: '#F6EFDE' },
Coniferas: { icon: TreePine, color: '#1E3B2A', bg: '#E6ECE4' },
Cobertura: { icon: Grid3x3, color: '#4C7A52', bg: '#EBF1E8' },
'Pastos ornamentales': { icon: Wind, color: '#4C7A52', bg: '#EEF3EA' },
Setos: { icon: Shrub, color: '#2E5240', bg: '#E7EEE5' },
Topiarios: { icon: Shrub, color: '#1E3B2A', bg: '#E7EBE4' },
Trepadoras: { icon: Waves, color: '#4C7A52', bg: '#ECF2E8' },
Estacionales: { icon: Flower2, color: '#B4432E', bg: '#FAE7E1' },
Otros: { icon: Sprout, color: '#20301F', bg: '#EEEAE0' },
default: { icon: Sprout, color: '#4C7A52', bg: '#EEF1E9' },
}

export function getCategoryStyle(category) {
return categoryStyles[category] || categoryStyles.default
}
