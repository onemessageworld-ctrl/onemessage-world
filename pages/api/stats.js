import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const admin = supabaseAdmin()

    // Count paid messages
    const { count, error: countErr } = await admin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('paid', true)

    console.log('[stats] paid count:', count, 'error:', countErr?.message)

    // Total raised = $1.00 gross per paid message
    const raised = (count || 0).toFixed(2)

    // Count unique countries
    const { data: countries, error: countryErr } = await admin
      .from('messages')
      .select('country')
      .eq('paid', true)
      .not('country', 'is', null)

    console.log('[stats] countries rows:', countries?.length, 'error:', countryErr?.message)

    const uniqueCountries = new Set(countries?.map(r => r.country) || []).size

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.status(200).json({
      count: count || 0,
      messages: count || 0,
      raised: parseFloat(raised),
      countries: uniqueCountries || 0,
    })
  } catch (err) {
    console.error('[stats] EXCEPTION:', err.message)
    res.status(500).json({ count: 0, messages: 0, raised: 0, countries: 0 })
  }
}
