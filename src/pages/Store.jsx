import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Search } from 'lucide-react'
import { db } from '../lib/firebase.js'
import ProductCard from '../components/ProductCard.jsx'
import LeafPattern from '../components/LeafPattern.jsx'
import Hero from '../components/Hero.jsx'
import { getCategoryStyle } from '../lib/categoryStyles.js'

export default function Store() {
const [products, setProducts] = useState(null) // null = cargando
const [search, setSearch] = useState('')
const [category, setCategory] = useState('Todas')

useEffect(() => {
const q = query(collection(db, 'products'), orderBy('name'))
const unsub = onSnapshot(
q,
(snap) => {
setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
},
(err) => {
console.error(err)
setProducts([])
}
)
return unsub
}, [])

const categories = useMemo(() => {
if (!products) return ['Todas']
return ['Todas', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort()]
}, [products])

const filtered = useMemo(() => {
if (!products) return []
return products.filter((p) => {
if (p.active === false) return false
const matchesCategory = category === 'Todas' || p.category === category
const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
return matchesCategory && matchesSearch
})
}, [products, search, category])

return (
<div>
<Hero />
<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
{/* BUSCADOR */}
<div className="relative mb-5 sticky top-[73px] z-20 bg-paper/95 backdrop-blur py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
<Search className="absolute left-7 sm:left-3 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
<input
type="text"
placeholder="Buscar por nombre…"
value={search}
onChange={(e) => setSearch(e.target.value)}
className="w-full border border-ink/20 rounded-full pl-9 pr-4 py-2 text-sm font-body bg-white/70 focus:border-clay outline-none"
/>
</div>

{/* CHIPS DE CATEGORÍA */}
<div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
{categories.map((c) => {
const isActive = category === c
const style = c === 'Todas' ? null : getCategoryStyle(c)
const Icon = style?.icon
return (
<button
key={c}
onClick={() => setCategory(c)}
className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-body whitespace-nowrap border transition-colors ${
isActive
? 'bg-pine text-paper border-pine'
: 'bg-white/60 text-ink/70 border-ink/15 hover:border-clay/50'
}`}
>
{Icon && <Icon size={14} strokeWidth={1.8} />}
{c}
</button>
)
})}
</div>

{products === null && (
<p className="text-ink/50 font-body text-sm">Cargando catálogo…</p>
)}

{products !== null && filtered.length === 0 && (
<p className="text-ink/50 font-body text-sm">
No hay productos que coincidan con su búsqueda.
</p>
)}

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
{filtered.map((p) => (
<ProductCard key={p.id} product={p} />
))}
</div>
</div>
</div>
)
}
