import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, country, message, visibility } = req.body

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' })
  }

  try {
    // Save pending message to Supabase first
    const admin = supabaseAdmin()
    const { data: msg, error } = await admin
      .from('messages')
      .insert({ name, country, message, visibility, paid: false })
      .select()
      .single()

    if (error) throw error

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'OneMessage.world — Seal My Message for 2036',
            description: 'Your message will be sealed until January 1, 2036',
            images: ['https://onemessage.world/og.png'],
          },
          unit_amount: 100, // $1.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?paid=1&mid=${msg.id}&sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      metadata: {
        message_id: msg.id,
        message_number: msg.message_number,
      },
      allow_promotion_codes: false,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    res.status(500).json({ error: err.message })
  }
}
