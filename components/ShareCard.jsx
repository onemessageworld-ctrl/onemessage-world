export function generateShareCard({ name, country, messageNumber, lang }) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    const bg = ctx.createLinearGradient(0,0,1080,1080);
    bg.addColorStop(0,"#05070F"); bg.addColorStop(0.5,"#0A0D1A"); bg.addColorStop(1,"#05070F");
    ctx.fillStyle=bg; ctx.fillRect(0,0,1080,1080);
    const rng=(s)=>{let x=Math.sin(s)*10000;return x-Math.floor(x);};
    for(let i=0;i<200;i++){const x=rng(i*1.1)*1080,y=rng(i*2.3)*1080,r=rng(i*3.7)*1.8+0.3,a=rng(i*4.1)*0.8+0.2;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=`rgba(212,175,55,${a})`;ctx.fill();}
    ctx.strokeStyle="rgba(212,175,55,0.35)";ctx.lineWidth=2;ctx.strokeRect(40,40,1000,1000);
    ctx.strokeStyle="rgba(212,175,55,0.12)";ctx.lineWidth=1;ctx.strokeRect(52,52,976,976);
    [[60,60],[1020,60],[60,1020],[1020,1020]].forEach(([cx,cy])=>{ctx.strokeStyle="rgba(212,175,55,0.6)";ctx.lineWidth=2;const s=20,dx=cx<540?1:-1,dy=cy<540?1:-1;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+dx*s,cy);ctx.stroke();ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy+dy*s);ctx.stroke();});
    const grd=ctx.createLinearGradient(200,0,880,0);grd.addColorStop(0,"transparent");grd.addColorStop(0.5,"#D4AF37");grd.addColorStop(1,"transparent");
    ctx.strokeStyle=grd;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(200,140);ctx.lineTo(880,140);ctx.stroke();
    ctx.font="bold 28px Georgia,serif";ctx.fillStyle="rgba(212,175,55,0.7)";ctx.textAlign="center";ctx.fillText("OneMessage.world",540,120);
    ctx.font="110px serif";ctx.fillText("✉️",540,320);
    const numLabels={en:`Message #${messageNumber}`,ar:`رسالة #${messageNumber}`,pt:`Mensagem #${messageNumber}`,es:`Mensaje #${messageNumber}`,fr:`Message #${messageNumber}`,de:`Nachricht #${messageNumber}`,it:`Messaggio #${messageNumber}`,ja:`メッセージ #${messageNumber}`,zh:`留言 #${messageNumber}`,ko:`메시지 #${messageNumber}`,hi:`संदेश #${messageNumber}`,tr:`Mesaj #${messageNumber}`,ru:`Послание #${messageNumber}`,id:`Pesan #${messageNumber}`};
    ctx.font="italic bold 52px Georgia,serif";ctx.fillStyle="#D4AF37";ctx.fillText(numLabels[lang]||numLabels.en,540,420);
    const subs={en:"sealed for humanity",ar:"مختومة للإنسانية",pt:"selada para a humanidade",es:"sellado para la humanidad",fr:"scellé pour l'humanité",de:"versiegelt für die Menschheit",it:"sigillato per l'umanità",ja:"人類のために封印",zh:"为人类封存",ko:"인류를 위해 봉인",hi:"मानवता के लिए सील",tr:"insanlık için mühürlendi",ru:"запечатано для человечества",id:"disegel untuk kemanusiaan"};
    ctx.font="22px Georgia,serif";ctx.fillStyle="rgba(237,232,216,0.5)";ctx.fillText(subs[lang]||subs.en,540,460);
    ctx.strokeStyle=grd;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(200,500);ctx.lineTo(880,500);ctx.stroke();
    if(name){ctx.font="bold 36px Georgia,serif";ctx.fillStyle="#EDE8D8";ctx.fillText(name,540,580);}
    if(country){ctx.font="28px Georgia,serif";ctx.fillStyle="rgba(237,232,216,0.55)";ctx.fillText(country,540,630);}
    ctx.font="italic bold 140px Georgia,serif";ctx.fillStyle="rgba(212,175,55,0.08)";ctx.fillText("2036",540,820);
    const dates={en:"Opens January 1, 2036",ar:"تُفتح في 1 يناير 2036",pt:"Abre em 1 de janeiro de 2036",es:"Abre el 1 de enero de 2036",fr:"S'ouvre le 1er janvier 2036",de:"Öffnet am 1. Januar 2036",it:"Si apre il 1° gennaio 2036",ja:"2036年1月1日開封",zh:"2036年1月1日开封",ko:"2036년 1월 1일 개봉",hi:"1 जनवरी 2036 को खुलेगा",tr:"1 Ocak 2036'da Açılıyor",ru:"Открывается 1 января 2036",id:"Dibuka 1 Januari 2036"};
    ctx.font="bold 30px Georgia,serif";ctx.fillStyle="#D4AF37";ctx.fillText(dates[lang]||dates.en,540,880);
    const tags={en:"Will you be remembered?",ar:"هل ستُذكر؟",pt:"Você será lembrado?",es:"¿Serás recordado?",fr:"Serez-vous rappelé?",de:"Wirst du erinnert?",it:"Sarai ricordato?",ja:"あなたは覚えられますか？",zh:"你会被记住吗？",ko:"당신은 기억될 건가요?",hi:"क्या आप याद किए जाएंगे?",tr:"Hatırlanacak mısınız?",ru:"Вас запомнят?",id:"Akankah kamu dikenang?"};
    ctx.font="italic 26px Georgia,serif";ctx.fillStyle="rgba(237,232,216,0.4)";ctx.fillText(tags[lang]||tags.en,540,930);
    ctx.strokeStyle=grd;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(200,960);ctx.lineTo(880,960);ctx.stroke();
    ctx.font="20px Georgia,serif";ctx.fillStyle="rgba(212,175,55,0.5)";ctx.fillText("onemessage.world",540,990);
    resolve(canvas.toDataURL("image/png"));
  });
}
export default function ShareCardPreview(){return null;}
