import Stripe from 'stripe'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const { orderId, items, customerEmail } = JSON.parse(event.body)

    if (!orderId || !items?.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan datos de la orden' }) }
    }

    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888'

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: `${item.name} (${item.size})` },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      customer_email: customerEmail,
      client_reference_id: orderId,
      metadata: { orderId },
      success_url: `${siteUrl}/orden/${orderId}?success=true`,
      cancel_url: `${siteUrl}/orden/${orderId}?cancelled=true`,
    })

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
