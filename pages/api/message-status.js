import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'id required' })

  try {
    const admin = supabaseAdmin()
    const { data, error } = await admin
      .from('messages')
      .select('id, message_number, paid')
      .eq('id', id)
      .single()

    if (error) throw error
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({ message_number: data.message_number, paid: data.paid })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
