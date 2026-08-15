import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase.js'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const [params] = useSearchParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'orders', orderId), (snap) => {
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() })
    })
    return unsub
  }, [orderId])

  const cancelled = params.get('cancelled') === 'true'

  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      {cancelled ? (
        <>
          <p className="font-display text-3xl text-pine mb-2">Pago cancelado</p>
          <p className="text-ink/60 font-body text-sm">
            Su orden #{orderId?.slice(0, 8)} quedó guardada. Puede intentar el pago de nuevo desde el carrito.
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-3xl text-pine mb-2">¡Gracias por su orden!</p>
          <p className="text-ink/60 font-body text-sm mb-6">
            Número de orden: <span className="font-mono-tag">{orderId?.slice(0, 8)}</span>
          </p>
          {order ? (
            <div className="text-left border border-ink/10 rounded-lg p-4 bg-white/60">
              <p className="font-body text-sm mb-2">
                Estado:{' '}
                <span className="font-semibold text-clay">
                  {order.status === 'pagada' ? 'Pagada ✓' : 'Procesando pago…'}
                </span>
              </p>
              <ul className="text-sm font-body divide-y divide-ink/10">
                {order.items?.map((i, idx) => (
                  <li key={idx} className="py-1.5 flex justify-between">
                    <span>
                      {i.name} ({i.size}) × {i.qty}
                    </span>
                    <span>${(i.price * i.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-right font-display text-lg text-pine mt-2">
                Total: ${order.total?.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-ink/40 text-sm font-body">Cargando su orden…</p>
          )}
        </>
      )}
    </div>
  )
}
