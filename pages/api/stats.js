import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const admin = supabaseAdmin()

    // Count paid messages
    const { count } = await admin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('paid', true)

    // Total raised = count * 0.67 (after Stripe fees)
    const raised = ((count || 0) * 0.67).toFixed(2)

    // Count unique countries
    const { data: countries } = await admin
      .from('messages')
      .select('country')
      .eq('paid', true)
      .not('country', 'is', null)

    const uniqueCountries = new Set(countries?.map(r => r.country) || []).size

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.status(200).json({
      count: count || 0,
      messages: count || 0,
      raised: parseFloat(raised),
      countries: uniqueCountries || 0,
    })
  } catch (err) {
    res.status(500).json({ count: 0, messages: 0, raised: 0, countries: 0 })
  }
}
