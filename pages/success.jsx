import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import { generateShareCard } from '../components/ShareCard'

const SHARE_TEXTS = {
  en: (num, country) => `I just sealed my message for the world 🌍\nMessage #${num}${country ? ' · ' + country : ''} · Opens 2036\n"What would YOU say to the world in 10 years?"\nBe part of history → OneMessage.world\n#OneMessage2036`,
  ar: (num, country) => `ختمتُ رسالتي للعالم 🌍\nرسالة #${num}${country ? ' · ' + country : ''} · تُفتح 2036\n"ماذا ستقول أنت للعالم بعد 10 سنوات؟"\nكن جزءاً من التاريخ ← OneMessage.world\n#OneMessage2036`,
  pt: (num, country) => `Acabei de selar minha mensagem para o mundo 🌍\nMensagem #${num}${country ? ' · ' + country : ''} · Abre em 2036\nFaça parte da história → OneMessage.world\n#OneMessage2036`,
}

const TIK = {
  en: (num, country) => `📍 Hook (0-3s):\n"I just wrote something no one will read until 2036..."\n\n📍 Story (3-15s):\n"There's a website called OneMessage.world where you pay $1 to seal a message for the world. It opens January 1st, 2036. I'm message number ${num}${country ? ' from ' + country : ''}. Even I'll forget what I wrote."\n\n📍 CTA (15-25s):\n"What would you say to the world in 10 years? Link in bio. It's $1."\n\n#OneMessage2036 #TimeCapsule #DigitalHistory`,
  ar: (num, country) => `📍 Hook:\n"كتبت شيئاً لن يقرأه أحد قبل 2036..."\n\n📍 القصة:\n"في موقع OneMessage.world تدفع دولاراً واحداً لتختم رسالة للعالم. تُفتح 1 يناير 2036. أنا الرسالة رقم ${num}${country ? ' من ' + country : ''}. حتى أنا سأنسى ما كتبت."\n\n📍 CTA:\n"ماذا ستقول للعالم بعد 10 سنوات؟ الرابط في البايو. دولار واحد فقط."\n\n#OneMessage2036`,
  pt: (num, country) => `📍 Hook:\n"Acabei de escrever algo que ninguém vai ler antes de 2036..."\n\n📍 História:\n"No OneMessage.world você paga $1 para selar uma mensagem pro mundo. Abre em 1 de janeiro de 2036. Sou a mensagem número ${num}${country ? ' do ' + country : ''}. Até eu vou esquecer o que escrevi."\n\n📍 CTA:\n"O que você diria pro mundo em 10 anos? Link na bio. É $1."\n\n#OneMessage2036`,
}

export default function Success({ msgData }) {
  const [cardImg, setCardImg] = useState(null)
  const [copied, setCopied] = useState(false)
  const [refCopied, setRefCopied] = useState(false)
  const [tikCopied, setTikCopied] = useState(false)
  const [showTik, setShowTik] = useState(false)
  const lang = typeof window !== 'undefined' ? (localStorage.getItem('om_lang') || 'en') : 'en'
  const num = msgData?.message_number || '???'
  const country = msgData?.country || ''
  const refLink = `https://onemessage.world?ref=${Math.random().toString(36).substr(2,8).toUpperCase()}`

  useEffect(() => {
    generateShareCard({ name: msgData?.name, country, messageNumber: num, lang }).then(setCardImg)
  }, [])

  const copy = (text, setCb) => {
    navigator.clipboard?.writeText(text).then(() => { setCb(true); setTimeout(() => setCb(false), 2500) })
  }

  const shareText = (SHARE_TEXTS[lang] || SHARE_TEXTS.en)(num, country)
  const tikScript = (TIK[lang] || TIK.en)(num, country)
  const enc = encodeURIComponent(shareText)

  const downloadCard = () => {
    if (!cardImg) return
    const a = document.createElement('a')
    a.href = cardImg
    a.download = 'onemessage-2036.png'
    a.click()
  }

  return (
    <>
      <Head>
        <title>Message Sealed — OneMessage.world</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#05070F;color:#EDE8D8;font-family:'DM Sans',sans-serif;min-height:100vh}
        :root{--g:#D4AF37;--br:rgba(212,175,55,.17);--sf:rgba(255,255,255,.034);--mt:rgba(237,232,216,.52)}
        .wrap{max-width:600px;margin:0 auto;padding:60px 20px 100px;text-align:center}
        .seal{font-size:5rem;display:block;margin-bottom:20px;animation:pu 2s ease infinite}
        h1{font-family:'Cormorant Garamond',serif;font-size:2.2rem;color:var(--g);margin-bottom:8px}
        .sub{color:var(--mt);font-size:.95rem;margin-bottom:8px}
        .num{font-family:'Cormorant Garamond',serif;font-size:3.5rem;font-weight:700;color:var(--g);margin:16px 0 4px}
        .numlbl{font-size:.75rem;color:var(--mt);letter-spacing:.1em;text-transform:uppercase;margin-bottom:32px}
        .fomo{background:rgba(212,175,55,.06);border:1px solid var(--br);border-radius:8px;padding:18px;margin-bottom:28px;font-size:.88rem;color:var(--mt)}
        .fomo strong{color:var(--g)}
        .card-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:28px}
        .card-img{width:100%;max-width:260px;border-radius:8px;border:1px solid var(--br)}
        .dl-btn{background:linear-gradient(135deg,var(--g),#9A7A0A);color:#000;padding:11px 28px;border-radius:3px;font-size:.88rem;font-weight:700;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all .3s}
        .dl-btn:hover{transform:translateY(-1px);box-shadow:0 4px 24px rgba(212,175,55,.4)}
        .sec-title{font-size:.72rem;color:var(--mt);letter-spacing:.1em;text-transform:uppercase;text-align:center;margin-bottom:12px}
        .sbs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:28px}
        .sb{display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 8px;border-radius:4px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:500;border:1px solid var(--br);color:#EDE8D8;background:var(--sf);transition:all .2s;text-decoration:none}
        .sb:hover{border-color:var(--g);color:var(--g)}
        .sb.cp{border-color:var(--g);background:rgba(212,175,55,.09);color:var(--g)}
        .tik-hdr{display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:12px 16px;background:rgba(212,175,55,.05);border:1px solid var(--br);border-radius:6px;margin-bottom:4px}
        .tik-hdr span{font-size:.88rem;font-weight:600;color:var(--g)}
        .tik-body{background:rgba(255,255,255,.02);border:1px solid var(--br);border-top:none;border-radius:0 0 6px 6px;padding:14px 16px;margin-bottom:20px}
        .tik-script{font-size:.75rem;color:var(--mt);line-height:1.8;white-space:pre-wrap;font-family:monospace;margin-bottom:10px;text-align:left}
        .tik-copy{background:none;border:1px solid var(--br);color:var(--mt);padding:7px 14px;border-radius:3px;cursor:pointer;font-size:.73rem;font-family:'DM Sans',sans-serif;transition:all .2s}
        .tik-copy:hover,.tik-copy.done{border-color:var(--g);color:var(--g)}
        .ref-box{background:rgba(212,175,55,.04);border:1px solid var(--br);border-radius:8px;padding:18px;margin-bottom:28px}
        .ref-title{font-size:.72rem;color:var(--mt);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
        .ref-link{font-size:.75rem;color:var(--g);background:rgba(212,175,55,.07);border:1px solid rgba(212,175,55,.2);border-radius:3px;padding:7px 10px;word-break:break-all;margin-bottom:8px;font-family:monospace;text-align:left}
        .ref-btn{width:100%;background:none;border:1px solid var(--br);color:var(--mt);padding:9px;border-radius:3px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.8rem;transition:all .2s}
        .ref-btn:hover,.ref-btn.done{border-color:var(--g);color:var(--g)}
        .home-btn{display:inline-block;margin-top:20px;color:var(--mt);font-size:.8rem;text-decoration:underline;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif}
        @keyframes pu{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @media(max-width:400px){.sbs{grid-template-columns:1fr}}
      `}</style>

      <div className="wrap">
        <span className="seal">✉️</span>
        <h1>You're now part of history</h1>
        <p className="sub">Your message is sealed until January 1, 2036.</p>
        <div className="num">#{num}</div>
        <div className="numlbl">Your message number in the world</div>

        <div className="fomo">
          You joined <strong>humanity's permanent record</strong>.<br/>
          Share this — every person who sees it is a potential $1 for your capsule.
        </div>

        {/* Share Card */}
        <div className="card-wrap">
          {cardImg && <img src={cardImg} className="card-img" alt="Your sealed message card" />}
          <button className="dl-btn" onClick={downloadCard}>⬇️ Download Share Card</button>
        </div>

        {/* Social Share */}
        <div className="sec-title">Share your sealed message — free advertising:</div>
        <div className="sbs">
          <a className="sb" href={`https://twitter.com/intent/tweet?text=${enc}`} target="_blank" rel="noreferrer">🐦 X / Twitter</a>
          <a className="sb" href={`https://wa.me/?text=${enc}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>
          <a className="sb" href={`https://www.facebook.com/sharer/sharer.php?u=https://onemessage.world`} target="_blank" rel="noreferrer">👤 Facebook</a>
          <button className={`sb${copied ? ' cp' : ''}`} onClick={() => copy(shareText, setCopied)}>
            🔗 {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>

        {/* TikTok Script */}
        <div>
          <div className="tik-hdr" onClick={() => setShowTik(s => !s)}>
            <span>🎬 Your TikTok Script</span>
            <span style={{ color: 'var(--g)' }}>{showTik ? '▲' : '▼'}</span>
          </div>
          {showTik && (
            <div className="tik-body">
              <div className="tik-script">{tikScript}</div>
              <button className={`tik-copy${tikCopied ? ' done' : ''}`} onClick={() => copy(tikScript, setTikCopied)}>
                {tikCopied ? '✓ Copied!' : 'Copy Script'}
              </button>
            </div>
          )}
        </div>

        {/* Referral */}
        <div className="ref-box" style={{ marginTop: 20 }}>
          <div className="ref-title">Your referral link — earn a free extra message per friend who pays:</div>
          <div className="ref-link">{refLink}</div>
          <button className={`ref-btn${refCopied ? ' done' : ''}`} onClick={() => copy(refLink, setRefCopied)}>
            {refCopied ? `✓ Copied!` : 'Copy My Referral Link'}
          </button>
        </div>

        <button className="home-btn" onClick={() => window.location.href = '/'}>← Back to OneMessage.world</button>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const { msg_id } = query
  if (!msg_id) return { props: { msgData: null } }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const { data } = await admin.from('messages').select('*').eq('id', msg_id).single()
    return { props: { msgData: data || null } }
  } catch {
    return { props: { msgData: null } }
  }
}
