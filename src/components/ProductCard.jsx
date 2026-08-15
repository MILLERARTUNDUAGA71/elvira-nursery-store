import { useState } from 'react'
import { useCart } from '../lib/CartContext.jsx'
import { getCategoryStyle } from '../lib/categoryStyles.js'
import LeafPattern from './LeafPattern.jsx'

export default function ProductCard({ product }) {
const { addItem } = useCart()
const [qty, setQty] = useState(1)
const [added, setAdded] = useState(false)

const outOfStock = !product.stock || product.stock <= 0
const noPrice = product.price === null || product.price === undefined
const { icon: CategoryIcon, color, bg } = getCategoryStyle(product.category)

function handleAdd() {
addItem(product, qty)
setAdded(true)
setTimeout(() => setAdded(false), 1200)
}

return (
<div className="group relative bg-white/60 border border-ink/10 rounded-sm overflow-hidden hover:border-clay/50 hover:shadow-[0_2px_0_0_rgba(180,67,46,0.4)] transition-all">
<div className="aspect-square overflow-hidden relative" style={{ backgroundColor: bg }}>
{product.photoURL ? (
<img
src={product.photoURL}
alt={product.name}
loading="lazy"
className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
/>
) : (
<div className="w-full h-full flex items-center justify-center relative">
<LeafPattern color={color} id={product.id || product.name} />
<CategoryIcon
className="relative"
size={44}
strokeWidth={1.4}
color={color}
style={{ opacity: 0.55 }}
/>
</div>
)}
{outOfStock && (
<div className="absolute top-2 right-2 bg-ink text-paper text-[10px] font-mono-tag uppercase tracking-wide px-2 py-1 rounded-sm">
Agotado
</div>
)}
<div className="absolute top-2 left-2 bg-paper/90 text-ink text-[10px] font-mono-tag uppercase tracking-wide px-2 py-1 rounded-sm border border-ink/10">
{product.size}
</div>
</div>

<div className="p-3 sm:p-4">
<p className="font-mono-tag text-[10px] uppercase tracking-wider text-rule/80 mb-1">
{product.category}
</p>
<h3 className="font-display text-base sm:text-lg leading-snug text-pine mb-2 min-h-[2.6em]">
{product.name}
</h3>

<div className="flex items-center justify-between mt-3">
<span className="font-display text-lg text-clay">
{noPrice ? 'Consultar' : `$${product.price.toFixed(2)}`}
</span>
{!outOfStock && (
<span className="text-xs text-ink/50 font-body">{product.stock} disp.</span>
)}
</div>

{!outOfStock && !noPrice && (
<div className="mt-3 flex items-center gap-2">
<div className="flex items-center border border-ink/20 rounded-full">
<button
aria-label="Restar cantidad"
onClick={() => setQty((q) => Math.max(1, q - 1))}
className="w-7 h-7 flex items-center justify-center text-ink/60 hover:text-clay"
>
−
</button>
<span className="w-6 text-center text-sm font-body">{qty}</span>
<button
aria-label="Sumar cantidad"
onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
className="w-7 h-7 flex items-center justify-center text-ink/60 hover:text-clay"
>
+
</button>
</div>
<button
onClick={handleAdd}
className="flex-1 bg-pine hover:bg-pine2 text-paper text-sm font-body font-medium py-1.5 rounded-full transition-colors"
>
{added ? 'Agregado ✓' : 'Agregar'}
</button>
</div>
)}
</div>
</div>
)
}
