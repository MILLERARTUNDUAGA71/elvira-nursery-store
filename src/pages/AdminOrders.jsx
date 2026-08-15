import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useAuth } from '../lib/AuthContext.jsx'

const statusLabels = {
  pendiente: 'Pendiente de pago',
  pagada: 'Pagada',
  preparando: 'Preparando',
  lista: 'Lista para entrega',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
}

export default function AdminOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  if (user === undefined) return <p className="text-center py-20 font-body text-ink/50">Cargando…</p>
  if (!user) return <Navigate to="/admin" replace />

  async function updateStatus(orderId, status) {
    await updateDoc(doc(db, 'orders', orderId), { status })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-pine">Órdenes</h1>
        <a href="/admin/productos" className="text-sm text-clay font-body hover:underline">
          ← Productos
        </a>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border border-ink/10 rounded-lg p-4 bg-white/50">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div>
                <p className="font-display text-pine">{o.customer?.name}</p>
                <p className="text-xs text-ink/50 font-body">
                  {o.customer?.phone} · {o.customer?.email}
                </p>
              </div>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                className="text-xs border border-ink/20 rounded-full px-3 py-1.5 bg-white font-body"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {o.customer?.address && (
              <p className="text-xs text-ink/50 font-body mb-2">📍 {o.customer.address}</p>
            )}
            <ul className="text-sm font-body divide-y divide-ink/10 border-y border-ink/10">
              {o.items?.map((i, idx) => (
                <li key={idx} className="py-1.5 flex justify-between">
                  <span>
                    {i.name} ({i.size}) × {i.qty}
                  </span>
                  <span>${(i.price * i.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-right font-display text-pine mt-2">Total: ${o.total?.toFixed(2)}</p>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-ink/40 font-body text-sm text-center py-10">Aún no hay órdenes.</p>
        )}
      </div>
    </div>
  )
}
