const BASE = 'https://onemessage.world'

function sitemap() {
  const pages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/legal', changefreq: 'monthly', priority: '0.5' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${BASE}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return xml
}

export default function SitemapXml() {
  return null
}

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.write(sitemap())
  res.end()
  return { props: {} }
}
