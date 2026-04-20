import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // Support both GET (query params) and POST (body)
  const session_id = req.method === 'GET' ? req.query.session_id : req.body?.sid || req.body?.session_id
  const mid = req.method === 'GET' ? req.query.mid : req.body?.mid

  if (!session_id || !mid) {
    return res.status(400).json({ error: 'session_id and mid required' })
  }

  try {
    // Verify with Stripe that payment was actually completed
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed', status: session.payment_status })
    }

    if (session.metadata?.message_id !== mid) {
      return res.status(400).json({ error: 'Session does not match message' })
    }

    const admin = supabaseAdmin()

    // Check if already marked paid (webhook may have already done it)
    const { data: existing } = await admin
      .from('messages')
      .select('paid, message_number')
      .eq('id', mid)
      .single()

    if (existing?.paid) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ ok: true, message_number: existing.message_number, already_paid: true })
    }

    // Mark as paid
    await admin
      .from('messages')
      .update({ paid: true })
      .eq('id', mid)

    // Fetch updated record
    const { data: updated } = await admin
      .from('messages')
      .select('message_number')
      .eq('id', mid)
      .single()

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ ok: true, message_number: updated?.message_number })
  } catch (err) {
    console.error('verify-payment error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
