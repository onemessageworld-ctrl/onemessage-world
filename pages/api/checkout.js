import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICE_IDS = {
  en:  'price_1TO7lUD4uAOfkYBLrUJZOIb8',
  pt:  'price_1TO7lUD4uAOfkYBL9IvoA7KK',
  es:  'price_1TO7lVD4uAOfkYBLqjW35QlH',
  fr:  'price_1TO7lVD4uAOfkYBLYL1LDpj9',
  de:  'price_1TO7lWD4uAOfkYBLQhxDo9JJ',
  it:  'price_1TO7lXD4uAOfkYBLe5geZ70R',
  nl:  'price_1TO7lXD4uAOfkYBLx6NfFMOG',
  el:  'price_1TO7lYD4uAOfkYBLiodOCzuk',
  ja:  'price_1TO7lYD4uAOfkYBL7FyFYsyy',
  zh:  'price_1TO7lZD4uAOfkYBLRQpI9Bgr',
  ko:  'price_1TO7lZD4uAOfkYBLnpk3IsC5',
  hi:  'price_1TO7laD4uAOfkYBLiqthqgSV',
  ta:  'price_1TO7laD4uAOfkYBLJtfePGsj',
  bn:  'price_1TO7laD4uAOfkYBL5sfSfSOc',
  ar:  'price_1TO7lbD4uAOfkYBLQS9KgF6k',
  fa:  'price_1TO7lbD4uAOfkYBLxpcCgb9E',
  ur:  'price_1TO7lcD4uAOfkYBLsraOQr7k',
  tr:  'price_1TO7lcD4uAOfkYBLkePvbjJl',
  ru:  'price_1TO7ldD4uAOfkYBLYOWYMAtO',
  uk:  'price_1TO7ldD4uAOfkYBL4JMq1ERl',
  id:  'price_1TO7leD4uAOfkYBLvsYVy2Em',
  ms:  'price_1TO7leD4uAOfkYBLQNL0ZHmB',
  vi:  'price_1TO7lfD4uAOfkYBL86mlE1bA',
  th:  'price_1TO7lfD4uAOfkYBLdYE6MW1x',
  fil: 'price_1TO7lgD4uAOfkYBLkDYGZ2WY',
  pl:  'price_1TO7lgD4uAOfkYBLwONKY4Px',
  sv:  'price_1TO7lhD4uAOfkYBLoiHshHoT',
  cs:  'price_1TO7lhD4uAOfkYBLszKnIoLq',
  hu:  'price_1TO7liD4uAOfkYBLDdODJszk',
  ro:  'price_1TO7liD4uAOfkYBLtCyQmT0N',
  he:  'price_1TO7ljD4uAOfkYBLHQmdthnB',
  sw:  'price_1TO7ljD4uAOfkYBLy3iqEy94',
  am:  'price_1TO7lkD4uAOfkYBLdY6oFSLh',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, country, message, visibility, lang } = req.body

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

    // Pick price by language, fallback to en (USD $1)
    const priceId = PRICE_IDS[lang] || PRICE_IDS.en

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?msg_id=${msg.id}&session_id={CHECKOUT_SESSION_ID}`,
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
