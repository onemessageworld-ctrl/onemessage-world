import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const admin = supabaseAdmin()
      const { data, error } = await admin
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      res.status(200).json({ messages: data || [] })
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch messages' })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing id' })

    try {
      const admin = supabaseAdmin()
      const { error } = await admin
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete message' })
    }
  } else {
    res.status(405).end()
  }
}
