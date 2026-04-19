import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const admin = supabaseAdmin()
    const { data, error } = await admin
      .from('messages')
      .select('name, country, created_at')
      .eq('paid', true)
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) throw error

    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30')
    res.status(200).json({ messages: data || [] })
  } catch (err) {
    res.status(500).json({ messages: [] })
  }
}
