import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { useCart } from '../lib/CartContext.jsx'

export default function CartPage() {
  const { items, updateQty, removeItem, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setCustomer((c) => ({ ...c, [field]: value }))
  }

  const canSubmit =
    items.length > 0 && customer.name.trim() && customer.phone.trim() && customer.email.trim()

  async function handleCheckout() {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        items,
        customer,
        total,
        status: 'pendiente',
        createdAt: serverTimestamp(),
      })

      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderRef.id,
          items,
          customerEmail: customer.email,
        }),
      })

      if (!res.ok) throw new Error('No se pudo iniciar el pago')
      const { url } = await res.json()
      clearCart()
      window.location.href = url
    } catch (e) {
      console.error(e)
      setError('Hubo un problema iniciando el pago. Intente de nuevo o contáctenos directamente.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-display text-2xl text-pine mb-2">Su carrito está vacío</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-block bg-pine text-paper px-6 py-2 rounded-full font-body text-sm"
        >
          Ver catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-5 gap-10">
      <div className="md:col-span-3">
        <h1 className="font-display text-3xl text-pine mb-6">Su orden</h1>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 py-4">
              <div className="w-16 h-16 bg-pine/5 rounded-sm overflow-hidden flex-shrink-0">
                {item.photoURL ? (
                  <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-pine leading-tight">{item.name}</p>
                <p className="text-xs text-ink/50 font-mono-tag">{item.size}</p>
              </div>
              <div className="flex items-center border border-ink/20 rounded-full">
                <button
                  onClick={() => updateQty(item.productId, item.qty - 1)}
                  className="w-7 h-7 text-ink/60 hover:text-clay"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.productId, item.qty + 1)}
                  className="w-7 h-7 text-ink/60 hover:text-clay"
                >
                  +
                </button>
              </div>
              <span className="w-16 text-right font-display text-clay">
                ${(item.price * item.qty).toFixed(2)}
              </span>
              <button
                onClick={() => removeItem(item.productId)}
                aria-label="Quitar"
                className="text-ink/30 hover:text-clay text-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center py-4 font-display text-xl text-pine">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="md:col-span-2">
        <h2 className="font-display text-xl text-pine mb-4">Datos de entrega</h2>
        <div className="space-y-3">
          <input
            placeholder="Nombre completo"
            value={customer.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white/70 focus:border-clay outline-none"
          />
          <input
            placeholder="Teléfono"
            value={customer.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white/70 focus:border-clay outline-none"
          />
          <input
            placeholder="Correo electrónico"
            type="email"
            value={customer.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white/70 focus:border-clay outline-none"
          />
          <textarea
            placeholder="Dirección de entrega o recogida en vivero"
            value={customer.address}
            onChange={(e) => updateField('address', e.target.value)}
            rows={2}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white/70 focus:border-clay outline-none"
          />
          <textarea
            placeholder="Notas (opcional)"
            value={customer.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={2}
            className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white/70 focus:border-clay outline-none"
          />
        </div>

        {error && <p className="text-clay text-sm mt-3">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={!canSubmit || loading}
          className="w-full mt-5 bg-clay hover:bg-rule disabled:opacity-40 disabled:cursor-not-allowed text-paper font-body font-medium py-3 rounded-full transition-colors"
        >
          {loading ? 'Redirigiendo a pago…' : `Pagar $${total.toFixed(2)}`}
        </button>
        <p className="text-[11px] text-ink/40 mt-2 text-center font-body">
          Pago seguro procesado por Stripe.
        </p>
      </div>
    </div>
  )
}
