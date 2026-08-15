import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import ProductCard from '../components/ProductCard.jsx'

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <p className="font-mono-tag text-xs uppercase tracking-widest text-rule mb-2">
          Catálogo — inventario en vivo
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-pine font-semibold leading-tight max-w-2xl">
          Plantas, palmas y arbustos listos para su próximo proyecto.
        </h1>
        <p className="text-ink/60 mt-3 max-w-xl font-body text-sm">
          El inventario y los precios se actualizan en tiempo real. Agregue lo que necesite al carrito y
          complete su orden en línea.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 sticky top-[73px] z-20 bg-paper/95 backdrop-blur py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-ink/10">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-ink/20 rounded-full px-4 py-2 text-sm font-body bg-white/70 focus:border-clay outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-ink/20 rounded-full px-4 py-2 text-sm font-body bg-white/70 focus:border-clay outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
  )
}
