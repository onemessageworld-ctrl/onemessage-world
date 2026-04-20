import { useState, useEffect } from 'react'
import Head from 'next/head'
import { generateShareCard } from '../components/ShareCard'

const CARD_TEXT = {
  en: { opens: "Opens January 1, 2036", tagline: "Will you be remembered?", sealed: "Your message is sealed" },
  pt: { opens: "Abre em 1 de Janeiro de 2036", tagline: "Você será lembrado?", sealed: "Sua mensagem está selada" },
  es: { opens: "Abre el 1 de Enero de 2036", tagline: "¿Serás recordado?", sealed: "Tu mensaje está sellado" },
  ar: { opens: "يفتح في 1 يناير 2036", tagline: "هل ستُذكر؟", sealed: "رسالتك مختومة" },
  fr: { opens: "Ouvre le 1er Janvier 2036", tagline: "Serez-vous mémorisé?", sealed: "Votre message est scellé" },
  de: { opens: "Öffnet am 1. Januar 2036", tagline: "Werden Sie erinnert?", sealed: "Ihre Nachricht ist versiegelt" },
  it: { opens: "Apre il 1 Gennaio 2036", tagline: "Sarai ricordato?", sealed: "Il tuo messaggio è sigillato" },
  zh: { opens: "2036年1月1日开启", tagline: "你会被记住吗？", sealed: "你的留言已封存" },
  ja: { opens: "2036年1月1日に開封", tagline: "あなたは記憶されますか？", sealed: "メッセージが封印されました" },
  ko: { opens: "2036년 1월 1일 개봉", tagline: "당신은 기억될까요?", sealed: "메시지가 봉인되었습니다" },
  tr: { opens: "1 Ocak 2036'da Açılıyor", tagline: "Hatırlanacak mısın?", sealed: "Mesajın mühürlendi" },
  ru: { opens: "Откроется 1 января 2036", tagline: "Вас запомнят?", sealed: "Ваше послание запечатано" },
  id: { opens: "Dibuka 1 Januari 2036", tagline: "Akankah kamu diingat?", sealed: "Pesanmu telah disegel" },
}

const SEALED_LABEL = {
  en: (n) => `Message #${n} sealed`,
  pt: (n) => `Mensagem #${n} selada`,
  es: (n) => `Mensaje #${n} sellado`,
  ar: (n) => `رسالة #${n} مختومة`,
  fr: (n) => `Message #${n} scellé`,
  de: (n) => `Nachricht #${n} versiegelt`,
  it: (n) => `Messaggio #${n} sigillato`,
  zh: (n) => `留言 #${n} 已封存`,
  ja: (n) => `メッセージ #${n} 封印済み`,
  ko: (n) => `메시지 #${n} 봉인됨`,
  ru: (n) => `Послание #${n} запечатано`,
  tr: (n) => `Mesaj #${n} mühürlendi`,
  id: (n) => `Pesan #${n} disegel`,
}

const SHARE_TEXTS = {
  en: (n) => `I sealed message #${n} for the world — opens Jan 1, 2036. OneMessage.world #OneMessage2036`,
  pt: (n) => `Selei a mensagem #${n} para o mundo — abre 1 jan 2036. OneMessage.world #OneMessage2036`,
  es: (n) => `Sellé el mensaje #${n} para el mundo — abre 1 ene 2036. OneMessage.world #OneMessage2036`,
  ar: (n) => `ختمتُ رسالتي #${n} للعالم — تُفتح 1 يناير 2036. OneMessage.world #OneMessage2036`,
  fr: (n) => `J'ai scellé mon message #${n} pour le monde — s'ouvre le 1er jan 2036. OneMessage.world`,
  de: (n) => `Nachricht #${n} versiegelt für die Welt — öffnet am 1. Jan 2036. OneMessage.world`,
  it: (n) => `Ho sigillato il mio messaggio #${n} — apre 1 gen 2036. OneMessage.world`,
  ja: (n) => `メッセージ#${n}を世界へ封印しました — 2036年1月1日開封 OneMessage.world`,
  zh: (n) => `我封存了第${n}条留言给世界 — 2036年1月1日开启 OneMessage.world`,
  ko: (n) => `메시지 #${n}을 세상을 위해 봉인했습니다 — 2036년 1월 1일 개봉 OneMessage.world`,
  ru: (n) => `Запечатал послание #${n} для мира — открывается 1 января 2036. OneMessage.world`,
  tr: (n) => `#${n} mesajımı dünya için mühürledim — 1 Oca 2036'da açılıyor. OneMessage.world`,
  id: (n) => `Menyegel pesan #${n} untuk dunia — dibuka 1 Jan 2036. OneMessage.world`,
}

const DOWNLOAD_LABEL = {
  en:"Download & Share", pt:"Baixar & Compartilhar", es:"Descargar & Compartir",
  ar:"تنزيل ومشاركة", fr:"Télécharger & Partager", de:"Herunterladen & Teilen",
  it:"Scarica & Condividi", zh:"下载并分享", ja:"ダウンロード & シェア",
  ko:"다운로드 & 공유", ru:"Скачать и поделиться", tr:"İndir & Paylaş", id:"Unduh & Bagikan",
}

const COPY_LABEL = { en:"Copy Link", pt:"Copiar Link", es:"Copiar Enlace", ar:"نسخ الرابط",
  fr:"Copier le lien", de:"Link kopieren", it:"Copia link", zh:"复制链接", ja:"リンクをコピー",
  ko:"링크 복사", ru:"Копировать ссылку", tr:"Bağlantıyı kopyala", id:"Salin tautan" }

const COPIED_LABEL = { en:"✓ Copied", pt:"✓ Copiado", es:"✓ Copiado", ar:"✓ تم النسخ",
  fr:"✓ Copié", de:"✓ Kopiert", it:"✓ Copiato", zh:"✓ 已复制", ja:"✓ コピー済み",
  ko:"✓ 복사됨", ru:"✓ Скопировано", tr:"✓ Kopyalandı", id:"✓ Disalin" }

const BACK_LABEL = { en:"← OneMessage.world", pt:"← OneMessage.world", es:"← OneMessage.world",
  ar:"OneMessage.world ←", fr:"← OneMessage.world", de:"← OneMessage.world",
  it:"← OneMessage.world", zh:"← OneMessage.world", ja:"← OneMessage.world",
  ko:"← OneMessage.world", ru:"← OneMessage.world", tr:"← OneMessage.world", id:"← OneMessage.world" }

// Map browser language codes to app language keys
const LANG_MAP = {'pt':'pt','pt-BR':'pt','pt-PT':'pt','es':'es','es-ES':'es','es-MX':'es',
  'ar':'ar','fr':'fr','de':'de','it':'it','ja':'ja','zh':'zh','zh-CN':'zh','zh-TW':'zh',
  'ko':'ko','tr':'tr','ru':'ru','id':'id','hi':'hi'}

function getLang() {
  if (typeof window === 'undefined') return 'en'
  try { const s = localStorage.getItem('om_lang'); if (s) return s } catch(e) {}
  const bl = navigator.language || navigator.languages?.[0] || 'en'
  return LANG_MAP[bl] || LANG_MAP[bl.split('-')[0]] || 'en'
}

export default function Success({ msgData, session_id }) {
  const [cardImg, setCardImg] = useState(null)
  const [copied, setCopied] = useState(false)
  const [verifiedMsg, setVerifiedMsg] = useState(msgData)
  const [lang] = useState(getLang)

  const num = verifiedMsg?.message_number || msgData?.message_number || '???'
  const country = verifiedMsg?.country || msgData?.country || ''
  const ct = CARD_TEXT[lang] || CARD_TEXT.en
  const sealedLabel = (SEALED_LABEL[lang] || SEALED_LABEL.en)(num)
  const shareText = (SHARE_TEXTS[lang] || SHARE_TEXTS.en)(num)
  const enc = encodeURIComponent(shareText)

  // Verify payment on mount — marks paid=true via Stripe check
  useEffect(() => {
    if (!session_id) return
    const mid = msgData?.id
    const url = '/api/verify-payment?session_id=' + encodeURIComponent(session_id) + (mid ? '&mid=' + mid : '')
    fetch(url)
      .then(r => r.json())
      .then(d => { if (d.success && d.message) setVerifiedMsg(d.message) })
      .catch(() => {})
  }, [])

  // Generate share card in user's language
  useEffect(() => {
    generateShareCard({ name: verifiedMsg?.name, country, messageNumber: num, lang })
      .then(setCardImg)
  }, [])

  const downloadAndShare = async () => {
    if (!cardImg) return
    // Always download
    const a = document.createElement('a')
    a.href = cardImg
    a.download = 'onemessage-2036.png'
    a.click()
    // Also open native share sheet on mobile
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const blob = await (await fetch(cardImg)).blob()
        const file = new File([blob], 'onemessage-2036.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: ct.sealed, text: shareText, files: [file] })
        } else {
          await navigator.share({ title: ct.sealed, text: shareText, url: 'https://onemessage.world' })
        }
      } catch (e) {}
    }
  }

  const copyLink = () => {
    navigator.clipboard?.writeText('https://onemessage.world')
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  return (
    <>
      <Head>
        <title>{ct.sealed} — OneMessage.world</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=DM+Sans:wght@300;400;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#05070F;color:#EDE8D8;font-family:'DM Sans',sans-serif;min-height:100vh}
        :root{--g:#D4AF37;--br:rgba(212,175,55,.17);--mt:rgba(237,232,216,.48)}
        .wrap{max-width:480px;margin:0 auto;padding:68px 24px 88px;text-align:center}
        .check{width:60px;height:60px;border-radius:50%;border:2px solid var(--g);display:flex;align-items:center;justify-content:center;margin:0 auto 28px;font-size:1.5rem;color:var(--g);flex-shrink:0}
        .title{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--g);margin-bottom:6px;font-weight:700}
        .opens{font-size:.78rem;color:var(--mt);letter-spacing:.07em;text-transform:uppercase;margin-bottom:36px}
        .card-img{width:100%;max-width:300px;border-radius:10px;border:1px solid var(--br);margin:0 auto 24px;display:block}
        .card-ph{width:300px;height:300px;border-radius:10px;border:1px solid var(--br);margin:0 auto 24px;background:rgba(212,175,55,.03);display:flex;align-items:center;justify-content:center;color:var(--mt);font-size:.8rem}
        .dl-btn{width:100%;max-width:300px;background:linear-gradient(135deg,#D4AF37,#9A7A0A);color:#000;padding:15px;border-radius:4px;font-size:.95rem;font-weight:700;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;letter-spacing:.02em;margin:0 auto 22px;display:block;transition:all .25s}
        .dl-btn:hover{box-shadow:0 4px 28px rgba(212,175,55,.35);transform:translateY(-1px)}
        .dl-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
        .links{display:flex;gap:0;justify-content:center;flex-wrap:wrap;margin-bottom:44px}
        .lnk{color:var(--mt);font-size:.8rem;text-decoration:none;cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif;transition:color .2s;padding:4px 14px}
        .lnk:hover,.lnk.cp{color:#D4AF37}
        .sep{color:rgba(237,232,216,.18);font-size:.8rem;display:flex;align-items:center}
        .back{color:var(--mt);font-size:.78rem;text-decoration:underline;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;transition:color .2s}
        .back:hover{color:#D4AF37}
      `}</style>

      <div className="wrap">
        <div style={{display:'flex',justifyContent:'center'}}>
          <div className="check">✓</div>
        </div>
        <div className="title">{sealedLabel}</div>
        <div className="opens">{ct.opens}</div>

        {cardImg
          ? <img src={cardImg} className="card-img" alt="Your sealed message card" />
          : <div className="card-ph">Generating card…</div>
        }

        <button className="dl-btn" onClick={downloadAndShare} disabled={!cardImg}>
          ↓ {DOWNLOAD_LABEL[lang] || DOWNLOAD_LABEL.en}
        </button>

        <div className="links">
          <a className="lnk" href={`https://wa.me/?text=${enc}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <span className="sep">·</span>
          <a className="lnk" href={`https://twitter.com/intent/tweet?text=${enc}&url=https://onemessage.world`} target="_blank" rel="noreferrer">X</a>
          <span className="sep">·</span>
          <button className={`lnk${copied ? ' cp' : ''}`} onClick={copyLink}>
            {copied ? (COPIED_LABEL[lang] || COPIED_LABEL.en) : (COPY_LABEL[lang] || COPY_LABEL.en)}
          </button>
        </div>

        <button className="back" onClick={() => window.location.href = '/'}>
          {BACK_LABEL[lang] || BACK_LABEL.en}
        </button>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const { msg_id, session_id } = query
  if (!msg_id) return { props: { msgData: null, session_id: session_id || null } }
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const { data } = await admin.from('messages').select('*').eq('id', msg_id).single()
    return { props: { msgData: data || null, session_id: session_id || null } }
  } catch {
    return { props: { msgData: null, session_id: session_id || null } }
  }
}
