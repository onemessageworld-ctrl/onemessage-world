import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { mid, sid } = req.body
  if (!mid || !sid) return res.status(400).json({ error: 'mid and sid required' })

  try {
    // Verify with Stripe that payment was actually completed
    const session = await stripe.checkout.sessions.retrieve(sid)
    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' })
    }
    if (session.metadata?.message_id !== mid) {
      return res.status(400).json({ error: 'Session mismatch' })
    }

    const admin = supabaseAdmin()

    // Check if already marked paid (webhook may have already done it)
    const { data: existing } = await admin
      .from('messages')
      .select('paid, message_number')
      .eq('id', mid)
      .single()

    if (existing?.paid) {
      return res.status(200).json({ message_number: existing.message_number })
    }

    // Mark as paid (webhook backup)
    await admin
      .from('messages')
      .update({ paid: true })
      .eq('id', mid)

    // Get the updated message_number (auto-assigned by DB)
    const { data: updated } = await admin
      .from('messages')
      .select('message_number')
      .eq('id', mid)
      .single()

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ message_number: updated?.message_number })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
