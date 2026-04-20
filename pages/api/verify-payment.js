import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  const session_id = req.query.session_id || req.body?.session_id || req.body?.sid
  let mid = req.query.mid || req.body?.mid

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed', status: session.payment_status })
    }

    // Get mid from Stripe metadata if not provided
    if (!mid) {
      mid = session.metadata?.message_id
    }

    if (!mid) {
      return res.status(400).json({ error: 'Could not determine message id' })
    }

    const admin = supabaseAdmin()

    // Check if already marked paid
    const { data: existing } = await admin
      .from('messages')
      .select('id, paid, message_number, name, country')
      .eq('id', mid)
      .single()

    if (existing?.paid) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ success: true, message: existing, already_paid: true })
    }

    // Mark as paid
    await admin.from('messages').update({ paid: true }).eq('id', mid)

    const { data: updated } = await admin
      .from('messages')
      .select('id, paid, message_number, name, country')
      .eq('id', mid)
      .single()

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ success: true, message: updated })
  } catch (err) {
    console.error('verify-payment error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
