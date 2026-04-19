import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = { api: { bodyParser: false } }

async function buffer(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const messageId = session.metadata?.message_id

    if (messageId) {
      const admin = supabaseAdmin()

      // Count paid messages to assign the next message_number
      const { count: paidCount } = await admin
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('paid', true)

      const messageNumber = (paidCount || 0) + 1

      await admin
        .from('messages')
        .update({ paid: true, message_number: messageNumber })
        .eq('id', messageId)

      console.log(`✅ Message ${messageId} marked as paid (#${messageNumber})`)
    }
  }

  res.status(200).json({ received: true })
}
