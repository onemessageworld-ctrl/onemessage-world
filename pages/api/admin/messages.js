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
  } else if (req.method === 'PATCH') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Missing id' })

    const updates = {}
    if (typeof req.body?.reviewed === 'boolean') updates.reviewed = req.body.reviewed
    if (typeof req.body?.flagged === 'boolean') updates.flagged = req.body.flagged
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid fields to update' })

    try {
      const admin = supabaseAdmin()
      const { error } = await admin
        .from('messages')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(500).json({ error: 'Failed to update message' })
    }
  } else if (req.method === 'DELETE') {
    const { id, unpaid_only } = req.query

    // Delete all unpaid messages
    if (unpaid_only === '1') {
      try {
        const admin = supabaseAdmin()
        const { error, count } = await admin
          .from('messages')
          .delete({ count: 'exact' })
          .eq('paid', false)

        if (error) throw error
        return res.status(200).json({ success: true, deleted: count })
      } catch (err) {
        return res.status(500).json({ error: 'Failed to delete unpaid messages' })
      }
    }

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
