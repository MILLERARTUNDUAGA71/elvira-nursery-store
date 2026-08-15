import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Papa from 'papaparse'
import { db, storage } from '../lib/firebase.js'
import { useAuth } from '../lib/AuthContext.jsx'

const emptyForm = { name: '', size: '3 GL', price: '', stock: 0, category: '', active: true }

export default function Admin() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [uploadingId, setUploadingId] = useState(null)
  const [csvStatus, setCsvStatus] = useState('')
  const fileInputRef = useRef(null)
  const csvInputRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'))
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  if (user === undefined) return <p className="text-center py-20 font-body text-ink/50">Cargando…</p>
  if (!user) return <Navigate to="/admin" replace />

  async function handleSaveProduct(e) {
    e.preventDefault()
    const payload = {
      name: form.name.trim(),
      size: form.size.trim(),
      price: form.price === '' ? null : parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      category: form.category.trim() || 'Sin categoría',
      active: form.active,
    }
    if (!payload.name) return

    if (editingId) {
      await updateDoc(doc(db, 'products', editingId), payload)
    } else {
      await addDoc(collection(db, 'products'), payload)
    }
    setForm(emptyForm)
    setEditingId(null)
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      size: p.size,
      price: p.price ?? '',
      stock: p.stock ?? 0,
      category: p.category ?? '',
      active: p.active !== false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteDoc(doc(db, 'products', id))
  }

  async function handlePhotoChange(productId, file) {
    if (!file) return
    setUploadingId(productId)
    try {
      const path = `products/${productId}-${Date.now()}-${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      await updateDoc(doc(db, 'products', productId), { photoURL: url })
    } catch (err) {
      console.error(err)
      alert('No se pudo subir la foto. Intente de nuevo.')
    } finally {
      setUploadingId(null)
    }
  }

  function handleCsvUpload(file) {
    if (!file) return
    setCsvStatus('Leyendo archivo…')
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data
        let created = 0
        for (const row of rows) {
          const name = row.name || row.Name || row.Nombre
          if (!name) continue
          const priceRaw = row.price ?? row.Price ?? row.Precio
          const price = priceRaw === undefined || priceRaw === '' || isNaN(parseFloat(priceRaw))
            ? null
            : parseFloat(priceRaw)
          await addDoc(collection(db, 'products'), {
            name: name.trim(),
            size: (row.size || row.Size || row.Tamaño || '').trim(),
            price,
            stock: parseInt(row.stock || row.Stock || row.Existencia || '0', 10) || 0,
            category: (row.category || row.Category || row.Categoria || 'Sin categoría').trim(),
            active: true,
          })
          created++
        }
        setCsvStatus(`Se importaron ${created} productos.`)
        if (csvInputRef.current) csvInputRef.current.value = ''
      },
      error: (err) => {
        console.error(err)
        setCsvStatus('Error leyendo el archivo CSV.')
      },
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-pine">Productos</h1>
        <a href="/admin/ordenes" className="text-sm text-clay font-body hover:underline">
          Ver órdenes →
        </a>
      </div>

      {/* Formulario agregar/editar */}
      <form
        onSubmit={handleSaveProduct}
        className="bg-white/60 border border-ink/10 rounded-lg p-4 sm:p-5 mb-6 grid grid-cols-2 sm:grid-cols-6 gap-3"
      >
        <input
          placeholder="Nombre de la planta"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="col-span-2 sm:col-span-2 border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white"
        />
        <input
          placeholder="Tamaño (ej. 3 GL)"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          className="border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white"
        />
        <input
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white"
        />
        <input
          placeholder="Precio"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white"
        />
        <input
          placeholder="Existencia"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white"
        />
        <div className="col-span-2 sm:col-span-6 flex items-center gap-3">
          <button className="bg-pine text-paper px-5 py-2 rounded-full text-sm font-body font-medium">
            {editingId ? 'Guardar cambios' : 'Agregar producto'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(emptyForm)
              }}
              className="text-sm text-ink/50 font-body"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {/* Importación CSV */}
      <div className="bg-white/60 border border-ink/10 rounded-lg p-4 sm:p-5 mb-8">
        <p className="font-body text-sm font-medium text-pine mb-1">Importar varios productos (CSV)</p>
        <p className="text-xs text-ink/50 font-body mb-3">
          Columnas esperadas: name, size, price, stock, category
        </p>
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => handleCsvUpload(e.target.files[0])}
          className="text-sm font-body"
        />
        {csvStatus && <p className="text-xs text-clay font-body mt-2">{csvStatus}</p>}
      </div>

      {/* Tabla de productos */}
      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 bg-white/50 border border-ink/10 rounded-lg p-2.5"
          >
            <div className="w-14 h-14 bg-pine/5 rounded-sm overflow-hidden flex-shrink-0 relative">
              {p.photoURL ? (
                <img src={p.photoURL} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-pine text-sm leading-tight truncate">{p.name}</p>
              <p className="text-xs text-ink/50 font-mono-tag">
                {p.size} · {p.category} · {p.stock} disp. ·{' '}
                {p.price === null ? 'sin precio' : `$${p.price.toFixed(2)}`}
                {p.active === false && ' · inactivo'}
              </p>
            </div>
            <label className="text-xs text-clay font-body cursor-pointer hover:underline">
              {uploadingId === p.id ? 'Subiendo…' : p.photoURL ? 'Cambiar foto' : 'Subir foto'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(p.id, e.target.files[0])}
              />
            </label>
            <button
              onClick={() => startEdit(p)}
              className="text-xs text-ink/60 font-body hover:text-clay"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-xs text-ink/40 font-body hover:text-clay"
            >
              Eliminar
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-ink/40 font-body text-sm text-center py-10">
            Aún no hay productos. Agregue uno arriba o importe su hoja en CSV.
          </p>
        )}
      </div>
    </div>
  )
}
