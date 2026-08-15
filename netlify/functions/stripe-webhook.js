import Stripe from 'stripe'
import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // En Netlify, guarda la llave privada con los \n escapados y reemplázalos aquí.
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  })
}
const db = admin.firestore()

export async function handler(event) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = event.headers['stripe-signature']

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Firma de webhook inválida', err.message)
    return { statusCode: 400, body: `Webhook Error: ${err.message}` }
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object
    const orderId = session.metadata?.orderId || session.client_reference_id
    if (orderId) {
      const orderRef = db.collection('orders').doc(orderId)
      const orderSnap = await orderRef.get()
      if (orderSnap.exists && orderSnap.data().status !== 'pagada') {
        await orderRef.update({ status: 'pagada', paidAt: admin.firestore.FieldValue.serverTimestamp() })

        // Descontar existencia de cada producto comprado.
        const order = orderSnap.data()
        const batch = db.batch()
        for (const item of order.items || []) {
          const productRef = db.collection('products').doc(item.productId)
          const productSnap = await productRef.get()
          if (productSnap.exists) {
            const newStock = Math.max(0, (productSnap.data().stock || 0) - item.qty)
            batch.update(productRef, { stock: newStock })
          }
        }
        await batch.commit()
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}
