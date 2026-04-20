import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  const session_id = req.query.session_id || req.body?.session_id || req.body?.sid
  let mid = req.query.mid || req.body?.mid

  console.log('[verify-payment] session_id:', session_id, 'mid:', mid)

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' })
  }

  try {
    // Step 1: Verify with Stripe
    console.log('[verify-payment] Calling Stripe...')
    const session = await stripe.checkout.sessions.retrieve(session_id)
    console.log('[verify-payment] Stripe session payment_status:', session.payment_status, 'metadata:', JSON.stringify(session.metadata))

    if (session.payment_status !== 'paid') {
      console.log('[verify-payment] Not paid yet, status:', session.payment_status)
      return res.status(402).json({ error: 'Payment not completed', status: session.payment_status })
    }

    // Get mid from Stripe metadata if not provided
    if (!mid) {
      mid = session.metadata?.message_id
      console.log('[verify-payment] Got mid from metadata:', mid)
    }

    if (!mid) {
      console.log('[verify-payment] ERROR: No message_id found')
      return res.status(400).json({ error: 'Could not determine message id' })
    }

    // Step 2: Check Supabase
    const admin = supabaseAdmin()
    console.log('[verify-payment] Checking supabase for id:', mid)

    const { data: existing, error: fetchErr } = await admin
      .from('messages')
      .select('id, paid, message_number, name, country')
      .eq('id', mid)
      .single()

    console.log('[verify-payment] Existing row:', JSON.stringify(existing), 'fetchErr:', fetchErr?.message)

    if (existing?.paid) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ success: true, message: existing, already_paid: true })
    }

    // Step 3: Update paid=true
    console.log('[verify-payment] Updating message id:', mid)
    const { data: updateData, error: updateErr, status: updateStatus } = await admin
      .from('messages')
      .update({ paid: true })
      .eq('id', mid)
      .select()

    console.log('[verify-payment] Update result:', JSON.stringify({ data: updateData, error: updateErr?.message, status: updateStatus }))

    if (updateErr) {
      console.error('[verify-payment] Supabase update FAILED:', updateErr.message)
      return res.status(500).json({ error: 'Supabase update failed: ' + updateErr.message })
    }

    const updated = updateData?.[0] || null

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ success: true, message: updated })
  } catch (err) {
    console.error('[verify-payment] EXCEPTION:', err.message)
    res.status(500).json({ error: err.message })
  }
}
