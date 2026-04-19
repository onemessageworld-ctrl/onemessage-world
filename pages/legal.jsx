import { useState } from "react";

// ─── TRANSLATIONS ─────────────────────────────────────────────
const LANGS = {
  en: {
    name:"English", dir:"ltr",
    noRefundTitle:"❌ No Refund Policy",
    noRefundText:"All payments are final and non-refundable. The $1 fee is a one-time participation contribution. By completing payment, you waive any right to a refund or chargeback. Initiating a chargeback after submitting your message may constitute fraud and will be reported to Stripe and relevant authorities.",
    noRefundBox:"By paying, you confirm you have read and accepted this No Refund Policy.",
    tosTitle:"Terms of Service",
    ppTitle:"Privacy Policy",
    lastUpdated:"Last updated: January 2026",
    bindingNote:"📌 The English version of these Terms is the legally binding version. All other language versions are provided as courtesy translations for comprehension purposes only. In case of any conflict or ambiguity between translations, the English version shall prevail.",
    sections: [
      {
        title:"1. About the Service",
        body:`OneMessage.world ("the Service", "we", "us") is a digital time capsule project that collects one-time messages from users around the world. Each message is associated with a $1 USD payment. The Service aims — but does not guarantee — to preserve these messages and make them publicly available on or around January 1, 2036.

OneMessage.world is an independent project operated by a private individual based in Brazil. It is not a bank, financial institution, or registered nonprofit.`
      },
      {
        title:"2. No Guarantees — Best Efforts Only",
        body:`We make no legally binding warranties, express or implied, regarding availability, continuity, or permanence of the Service. Specifically:

• We do NOT guarantee the Service will remain operational until 2036.
• We do NOT guarantee your message will be published on any specific date.
• We do NOT guarantee data will never be lost due to technical failure, cyberattack, hosting termination, or force majeure.
• We STRIVE to preserve all messages using commercially reasonable measures, but provide the Service "as is" without any warranty of any kind.

The $1 payment is a participation fee — not a contract for a guaranteed future service. You are paying to be part of a collective cultural record, understanding that its future availability cannot be legally guaranteed.`
      },
      {
        title:"3. No Refunds — Final Sale",
        body:`ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE.

By completing payment, you acknowledge that:

• The fee is a one-time, non-reversible participation contribution.
• Digital participation fees are excluded from standard consumer refund rights in most jurisdictions.
• You will NOT initiate a chargeback or payment dispute with your bank, card issuer, or payment processor. Doing so after receiving the service (message storage) constitutes fraud and may result in legal action.
• We reserve the right to remove messages that violate these Terms without issuing any refund.
• No refund will be issued under any circumstance, including: dissatisfaction with the service, change of mind, technical issues on the user's end, or failure to read these Terms prior to payment.`
      },
      {
        title:"4. Prohibited Content",
        body:`By submitting a message, you represent and warrant that your content does not:

• Contain hate speech or discrimination based on race, ethnicity, religion, nationality, gender, sexual orientation, or disability.
• Threaten, harass, bully, or defame any individual or group.
• Contain sexually explicit, obscene, or pornographic material.
• Promote violence, terrorism, self-harm, or illegal activity.
• Infringe on any third party's copyright, trademark, or intellectual property.
• Include personal data of third parties without their consent.
• Constitute spam, advertising, or commercial solicitation.

We reserve the right — but not the obligation — to review, moderate, and permanently delete any message at our sole discretion, at any time, without notice and without refund. You are solely responsible for your message content.`
      },
      {
        title:"5. Intellectual Property & Content License",
        body:`You retain ownership of your message content. By submitting, you grant OneMessage.world a worldwide, royalty-free, perpetual, irrevocable, non-exclusive license to store, display, publish, translate, and distribute your message as part of the time capsule — including upon opening in 2036 and indefinitely thereafter.

This license is necessary for the core function of the Service. If you choose "Private", your message will not be displayed publicly before the capsule opening date.`
      },
      {
        title:"6. Service Discontinuation",
        body:`If the Service is discontinued before January 1, 2036, we will make reasonable good-faith efforts to:

• Publish all non-private messages publicly and freely online before shutting down.
• Provide at least 30 days' notice via the website.

These are intentions, NOT legally binding obligations. We are not liable for failure to fulfill these intentions due to circumstances beyond our control, including death, incapacity, bankruptcy, cyberattacks, natural disasters, or hosting provider failure.`
      },
      {
        title:"7. Limitation of Liability",
        body:`To the maximum extent permitted by applicable law:

• Our total liability for any claim shall not exceed the amount you paid ($1 USD maximum).
• We are not liable for any indirect, incidental, special, consequential, or punitive damages.
• We are not liable for loss of data, loss of profits, emotional distress, or intangible losses.
• We are not liable for actions or inactions of third-party service providers (Stripe, Vercel, Supabase).`
      },
      {
        title:"8. Indemnification",
        body:`You agree to indemnify and hold harmless OneMessage.world and its operator from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from: your use of the Service, your submitted message content, your violation of these Terms, or your violation of any third party's rights.`
      },
      {
        title:"9. Class Action Waiver",
        body:`You waive any right to bring or participate in a class action, collective action, or representative proceeding against OneMessage.world. Any dispute must be pursued individually and in small claims court (or equivalent jurisdiction) only.`
      },
      {
        title:"10. Governing Law",
        body:`These Terms are governed by the laws of Brazil. Any disputes shall be subject to the exclusive jurisdiction of the courts of Brazil.`
      },
      {
        title:"11. Age Requirement",
        body:`You must be at least 18 years of age, or the age of legal majority in your jurisdiction, to use the Service. By using the Service, you confirm you meet this requirement.`
      },
      {
        title:"12. Changes to Terms",
        body:`We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Continued use after changes constitutes acceptance.`
      },
      {
        title:"13. Contact",
        body:`For legal matters: onemessage.world@gmail.com`
      }
    ],
    ppSections: [
      {title:"1. Data We Collect", body:`• Message content (up to 280 characters)\n• Optional display name\n• Country (selected by you)\n• Visibility preference (public/private)\n• Payment confirmation from Stripe (we never store card data)\n• IP address (language detection only, not stored long-term)\n• Standard browser/device data for site functionality`},
      {title:"2. What We Do NOT Collect", body:`• Your email address\n• Your full legal name\n• Your physical address\n• We do NOT use advertising cookies, tracking pixels, or behavioral analytics\n• We do NOT sell your data to any third party\n• We do NOT use your data for advertising`},
      {title:"3. How We Use Your Data", body:`• To store and display your message as part of the time capsule\n• To verify payment via Stripe\n• To detect and prevent abuse and prohibited content\n• To display anonymous aggregate statistics (total messages, countries, amount raised)\n• IP address is used solely for automatic language selection`},
      {title:"4. Third-Party Services", body:`• Stripe (payments) — stripe.com/privacy\n• Vercel (hosting) — vercel.com/legal/privacy-policy\n• Supabase (database) — supabase.com/privacy\n• ipapi.co (country detection, no data stored)\n\nWe do NOT use Google Analytics, Facebook Pixel, TikTok Pixel, or any advertising trackers.`},
      {title:"5. Data Retention", body:`Your message and display name are stored for the operational life of the Service and potentially indefinitely thereafter as a public historical record. IP addresses are not retained beyond the session. Payment records are kept for a minimum of 5 years for tax and legal compliance.`},
      {title:"6. Your Rights (GDPR / LGPD)", body:`You may request: access to your data, correction of inaccuracies, deletion of your message (before 2036 opening), data portability. Once the capsule opens in 2036, public messages become part of the permanent historical record and may not be deletable. Contact: onemessage.world@gmail.com`},
      {title:"7. Security", body:`We implement HTTPS encryption, database access controls, and regular security reviews. No system is 100% secure. We are not liable for unauthorized access beyond our reasonable control.`},
      {title:"8. Children", body:`The Service is not directed at anyone under 18. We do not knowingly collect data from minors.`},
      {title:"9. Contact", body:`onemessage.world@gmail.com\nFor EU users: you may lodge a complaint with your local data protection authority.\nFor Brazilian users: you may contact the ANPD (Autoridade Nacional de Proteção de Dados).`}
    ]
  },

  ar: {
    name:"العربية", dir:"rtl",
    noRefundTitle:"❌ سياسة عدم الاسترداد",
    noRefundText:"جميع المدفوعات نهائية وغير قابلة للاسترداد. رسوم الدولار الواحد هي مساهمة مشاركة لمرة واحدة. بإتمام الدفع، تتنازل عن أي حق في استرداد المبلغ أو رفع نزاع مع البنك. إذا قمت بفتح نزاع (chargeback) بعد إرسال رسالتك، فقد يُعدّ ذلك احتيالاً وسيتم الإبلاغ عنه لـ Stripe والجهات المختصة.",
    noRefundBox:"بالدفع، تؤكد أنك قرأتَ وقبلتَ سياسة عدم الاسترداد هذه.",
    tosTitle:"شروط الخدمة",
    ppTitle:"سياسة الخصوصية",
    lastUpdated:"آخر تحديث: يناير 2026",
    bindingNote:"📌 النسخة الإنجليزية من هذه الشروط هي النسخة القانونية الملزمة. جميع النسخ الأخرى مقدَّمة كترجمات إرشادية فقط. في حالة أي تعارض أو غموض، تسود النسخة الإنجليزية.",
    sections: [
      {title:"١. حول الخدمة", body:`OneMessage.world هو مشروع كبسولة زمنية رقمية يجمع رسائل من مستخدمين حول العالم. كل رسالة مرتبطة بدفع قدره دولار واحد. تسعى الخدمة — دون أن تضمن ذلك — إلى الحفاظ على هذه الرسائل وإتاحتها للعموم في أو حول الأول من يناير 2036.\n\nالموقع مشروع مستقل يديره شخص طبيعي مقيم في البرازيل.`},
      {title:"٢. لا ضمانات — جهود حثيثة فقط", body:`لا نقدم أي ضمانات قانونية ملزمة صريحة أو ضمنية فيما يتعلق بتوفر الخدمة أو استمراريتها. تحديداً:\n\n• لا نضمن استمرار الخدمة حتى 2036.\n• لا نضمن نشر رسالتك في تاريخ محدد.\n• لا نضمن عدم فقدان البيانات جراء أعطال تقنية أو هجمات إلكترونية أو قوة قاهرة.\n• نسعى جاهدين للحفاظ على جميع الرسائل، لكننا نقدم الخدمة "كما هي" دون أي ضمان.`},
      {title:"٣. عدم الاسترداد — بيع نهائي", body:`جميع المدفوعات نهائية وغير قابلة للاسترداد بأي حال.\n\nبإتمام الدفع، تُقرّ بما يلي:\n\n• الرسوم مساهمة مشاركة لا رجعة فيها.\n• لن تفتح أي نزاع مع بنكك أو مزود الدفع. فعل ذلك بعد إرسال الرسالة يُعدّ احتيالاً قد يستوجب الملاحقة القانونية.\n• نحتفظ بحق حذف الرسائل المخالفة دون استرداد.\n• لن يُردّ أي مبلغ لأي سبب كان، بما فيه: عدم الرضا، تغيير الرأي، مشاكل تقنية من جهتك، أو عدم قراءة هذه الشروط قبل الدفع.`},
      {title:"٤. المحتوى المحظور", body:`بإرسال رسالتك، تُقرّ بأن محتواها لا يتضمن:\n\n• خطاباً تحريضياً أو تمييزاً على أساس العرق أو الدين أو الجنسية أو الجنس أو التوجه الجنسي.\n• تهديداً أو مضايقةً أو تشهيراً بأي شخص أو جماعة.\n• محتوى جنسياً صريحاً أو إباحياً.\n• ترويجاً للعنف أو الإرهاب أو الأنشطة غير القانونية.\n• انتهاكاً لحقوق الملكية الفكرية لأي طرف ثالث.\n• بيانات شخصية لأطراف ثالثة دون موافقتهم.\n\nنحتفظ بحق مراجعة وحذف أي رسالة وفق تقديرنا المطلق، دون إشعار مسبق ودون استرداد.`},
      {title:"٥. الترخيص وحقوق الملكية", body:`تحتفظ بملكية محتوى رسالتك. بإرسالها، تمنح OneMessage.world ترخيصاً عالمياً غير حصري ودائماً وغير قابل للإلغاء لتخزين رسالتك وعرضها ونشرها كجزء من الكبسولة الزمنية، بما في ذلك بعد افتتاحها عام 2036 وإلى أجل غير مسمى.`},
      {title:"٦. تعليق الخدمة", body:`إذا تم إيقاف الخدمة قبل 2036، سنبذل جهوداً حسنة النية لـ:\n\n• نشر جميع الرسائل العامة مجاناً قبل الإغلاق.\n• تقديم إشعار لا يقل عن 30 يوماً عبر الموقع.\n\nهذه نوايا وليست التزامات قانونية ملزمة. لسنا مسؤولين عن الإخفاق في تحقيقها جراء ظروف خارجة عن إرادتنا.`},
      {title:"٧. تحديد المسؤولية", body:`بالقدر الذي يسمح به القانون المعمول به:\n\n• إجمالي مسؤوليتنا تجاهك لا يتجاوز المبلغ الذي دفعته (دولار واحد كحد أقصى).\n• لسنا مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية.\n• لسنا مسؤولين عن فقدان البيانات أو الأرباح أو الضيق النفسي.`},
      {title:"٨. التعويض", body:`توافق على تعويض OneMessage.world ومشغّله والدفاع عنهما من أي مطالبات أو أضرار أو التزامات أو مصروفات (بما في ذلك أتعاب المحاماة المعقولة) الناشئة عن: استخدامك للخدمة، محتوى رسالتك، انتهاكك لهذه الشروط، أو انتهاكك لحقوق أي طرف ثالث.`},
      {title:"٩. التنازل عن الدعاوى الجماعية", body:`تتنازل عن أي حق في رفع أو المشاركة في دعوى قضائية جماعية ضد OneMessage.world. يجب متابعة أي نزاع بصفة فردية فقط.`},
      {title:"١٠. القانون الحاكم", body:`تخضع هذه الشروط لقوانين البرازيل. يختص القضاء البرازيلي حصراً بالفصل في أي نزاعات.`},
      {title:"١١. متطلبات السن", body:`يجب أن يكون عمرك 18 عاماً على الأقل لاستخدام الخدمة.`},
      {title:"١٢. التواصل", body:`للشؤون القانونية: onemessage.world@gmail.com`}
    ],
    ppSections: [
      {title:"١. البيانات التي نجمعها", body:`• محتوى رسالتك (حتى 280 حرفاً)\n• اسم العرض الاختياري\n• الدولة (تختارها أنت)\n• تفضيل الخصوصية (عامة/سرية)\n• تأكيد الدفع من Stripe (لا نخزن بيانات البطاقة أبداً)\n• عنوان IP (لاكتشاف اللغة فقط، لا يُحتفظ به)\n• بيانات المتصفح والجهاز الاعتيادية`},
      {title:"٢. ما لا نجمعه", body:`• لا نجمع بريدك الإلكتروني\n• لا نستخدم كوكيز إعلانية أو بكسلات تتبع\n• لا نبيع بياناتك لأي طرف ثالث\n• لا نستخدم بياناتك لأغراض إعلانية`},
      {title:"٣. كيف نستخدم بياناتك", body:`• لتخزين رسالتك وعرضها ضمن الكبسولة الزمنية\n• للتحقق من الدفع عبر Stripe\n• للكشف عن المحتوى المسيء ومنعه\n• لعرض إحصائيات مجمّعة مجهولة الهوية (عدد الرسائل، الدول، المبلغ المجموع)\n• IP يُستخدم فقط لاختيار اللغة تلقائياً`},
      {title:"٤. الخدمات الخارجية", body:`• Stripe (المدفوعات) — stripe.com/privacy\n• Vercel (الاستضافة)\n• Supabase (قاعدة البيانات)\n• ipapi.co (اكتشاف الدولة)\n\nلا نستخدم Google Analytics أو Facebook Pixel أو أي أدوات تتبع إعلانية.`},
      {title:"٥. حقوقك", body:`يحق لك طلب: الاطلاع على بياناتك، تصحيحها، حذف رسالتك (قبل افتتاح 2036). بعد الافتتاح قد تصبح الرسائل العامة جزءاً من السجل التاريخي الدائم وقد لا يكون حذفها ممكناً.\n\nللتواصل: onemessage.world@gmail.com`},
      {title:"٦. التواصل", body:`onemessage.world@gmail.com`}
    ]
  },

  pt: {
    name:"Português", dir:"ltr",
    noRefundTitle:"❌ Política de Não Reembolso",
    noRefundText:"Todos os pagamentos são finais e não reembolsáveis. A taxa de $1 é uma contribuição de participação única e irrevogável. Ao concluir o pagamento, você renuncia a qualquer direito de reembolso ou estorno. Iniciar um chargeback após enviar sua mensagem pode constituir fraude e será reportado à Stripe e às autoridades competentes.",
    noRefundBox:"Ao pagar, você confirma que leu e aceitou esta Política de Não Reembolso.",
    tosTitle:"Termos de Serviço",
    ppTitle:"Política de Privacidade",
    lastUpdated:"Última atualização: Janeiro de 2026",
    bindingNote:"📌 A versão em inglês destes Termos é a versão juridicamente vinculante. Todas as outras versões são traduções de cortesia apenas para fins de compreensão. Em caso de conflito, prevalece a versão em inglês.",
    sections:[
      {title:"1. Sobre o Serviço",body:`OneMessage.world é um projeto de cápsula do tempo digital. A taxa de $1 é uma contribuição de participação. O serviço visa — sem garantir — preservar as mensagens até 1º de janeiro de 2036. É operado por um indivíduo privado no Brasil.`},
      {title:"2. Sem Garantias",body:`Não oferecemos garantias legais sobre disponibilidade ou permanência do serviço. O serviço é fornecido "como está", sem qualquer garantia. A taxa de $1 é uma contribuição de participação cultural, não um contrato de serviço garantido.`},
      {title:"3. Sem Reembolso — Venda Final",body:`TODOS OS PAGAMENTOS SÃO FINAIS E NÃO REEMBOLSÁVEIS.\n\nAo concluir o pagamento, você reconhece que:\n\n• A taxa é uma contribuição irrevogável de participação.\n• Você NÃO iniciará chargeback ou disputa de pagamento. Fazê-lo após receber o serviço constitui fraude e pode resultar em ação legal.\n• Nenhum reembolso será emitido sob nenhuma circunstância, incluindo: insatisfação, mudança de opinião, problemas técnicos do usuário, ou não leitura dos Termos antes do pagamento.`},
      {title:"4. Conteúdo Proibido",body:`Sua mensagem não deve conter: discurso de ódio, ameaças, assédio, difamação, conteúdo sexualmente explícito, promoção de violência ou atividades ilegais, violação de propriedade intelectual de terceiros, ou dados pessoais de terceiros sem consentimento.\n\nReservamo-nos o direito de remover qualquer mensagem a nosso exclusivo critério, sem aviso e sem reembolso.`},
      {title:"5. Licença de Conteúdo",body:`Você retém a propriedade da sua mensagem. Ao enviá-la, concede à OneMessage.world uma licença mundial, perpétua, irrevogável e não exclusiva para armazenar, exibir e publicar sua mensagem como parte da cápsula do tempo.`},
      {title:"6. Descontinuação do Serviço",body:`Se o serviço for descontinuado antes de 2036, faremos esforços razoáveis de boa-fé para publicar todas as mensagens públicas gratuitamente e fornecer pelo menos 30 dias de aviso. Estas são intenções, não obrigações legalmente vinculantes.`},
      {title:"7. Limitação de Responsabilidade",body:`Nossa responsabilidade total não excederá o valor pago ($1). Não somos responsáveis por danos indiretos, incidentais, consequenciais ou punitivos.`},
      {title:"8. Indenização",body:`Você concorda em indenizar e isentar OneMessage.world de quaisquer reclamações, danos e despesas decorrentes do seu uso do serviço ou do conteúdo da sua mensagem.`},
      {title:"9. Renúncia a Ação Coletiva",body:`Você renuncia ao direito de participar em ação coletiva contra OneMessage.world. Qualquer disputa deve ser tratada individualmente.`},
      {title:"10. Lei Aplicável",body:`Estes Termos são regidos pelas leis do Brasil. Qualquer disputa está sujeita à jurisdição exclusiva dos tribunais brasileiros.`},
      {title:"11. Idade Mínima",body:`Você deve ter pelo menos 18 anos para usar o serviço.`},
      {title:"12. Contato",body:`Para assuntos legais: onemessage.world@gmail.com`}
    ],
    ppSections:[
      {title:"1. Dados Coletados",body:`• Conteúdo da mensagem (até 280 caracteres)\n• Nome de exibição opcional\n• País (selecionado por você)\n• Preferência de visibilidade\n• Confirmação de pagamento da Stripe (nunca armazenamos dados do cartão)\n• Endereço IP (apenas detecção de idioma, não armazenado a longo prazo)`},
      {title:"2. O Que Não Coletamos",body:`• Não coletamos e-mail nem nome completo\n• Não usamos cookies de publicidade ou pixels de rastreamento\n• Não vendemos seus dados a terceiros\n• Não usamos seus dados para publicidade`},
      {title:"3. Como Usamos Seus Dados",body:`Para armazenar sua mensagem, verificar o pagamento, prevenir abusos e exibir estatísticas anônimas agregadas. O IP é usado apenas para seleção automática de idioma.`},
      {title:"4. Seus Direitos (LGPD)",body:`Você pode solicitar: acesso, correção, exclusão da mensagem (antes de 2036), portabilidade. Contato: onemessage.world@gmail.com\n\nVocê pode registrar reclamação junto à ANPD (Autoridade Nacional de Proteção de Dados).`},
      {title:"5. Contato",body:`onemessage.world@gmail.com`}
    ]
  },

  es: {
    name:"Español", dir:"ltr",
    noRefundTitle:"❌ Política de No Reembolso",
    noRefundText:"Todos los pagos son finales y no reembolsables. La tarifa de $1 es una contribución de participación única e irrevocable. Al completar el pago, renuncias a cualquier derecho de reembolso o contracargo. Iniciar un chargeback después de enviar tu mensaje puede constituir fraude y será reportado a Stripe y las autoridades pertinentes.",
    noRefundBox:"Al pagar, confirmas que has leído y aceptado esta Política de No Reembolso.",
    tosTitle:"Términos de Servicio",
    ppTitle:"Política de Privacidad",
    lastUpdated:"Última actualización: Enero de 2026",
    bindingNote:"📌 La versión en inglés de estos Términos es la versión legalmente vinculante. Todas las demás son traducciones de cortesía. En caso de conflicto, prevalece la versión en inglés.",
    sections:[
      {title:"1. Sobre el Servicio",body:`OneMessage.world es un proyecto de cápsula del tiempo digital. La tarifa de $1 es una contribución de participación. El servicio aspira — sin garantizar — a preservar los mensajes hasta el 1 de enero de 2036.`},
      {title:"2. Sin Garantías",body:`No ofrecemos garantías legales sobre disponibilidad o permanencia del servicio. Se ofrece "tal cual". El $1 es una contribución cultural, no un contrato de servicio garantizado.`},
      {title:"3. Sin Reembolso — Venta Final",body:`TODOS LOS PAGOS SON FINALES Y NO REEMBOLSABLES.\n\nAl completar el pago, reconoces que:\n\n• La tarifa es una contribución irrevocable de participación.\n• NO iniciarás un chargeback o disputa. Hacerlo después de enviar el mensaje constituye fraude y puede resultar en acción legal.\n• No se emitirá ningún reembolso bajo ninguna circunstancia: insatisfacción, cambio de opinión, problemas técnicos del usuario, o no lectura de los Términos.`},
      {title:"4. Contenido Prohibido",body:`Tu mensaje no debe contener: discurso de odio, amenazas, acoso, difamación, contenido sexualmente explícito, promoción de violencia o actividades ilegales, violación de propiedad intelectual, o datos personales de terceros sin su consentimiento. Nos reservamos el derecho de eliminar cualquier mensaje sin aviso y sin reembolso.`},
      {title:"5. Licencia de Contenido",body:`Conservas la propiedad de tu mensaje. Al enviarlo, otorgas a OneMessage.world una licencia mundial, perpetua e irrevocable para almacenarlo, mostrarlo y publicarlo como parte de la cápsula del tiempo.`},
      {title:"6. Limitación de Responsabilidad",body:`Nuestra responsabilidad total no excederá el monto pagado ($1). No somos responsables de daños indirectos, incidentales o consecuentes.`},
      {title:"7. Renuncia a Acción Colectiva",body:`Renuncias al derecho de participar en una demanda colectiva contra OneMessage.world.`},
      {title:"8. Ley Aplicable",body:`Estos Términos se rigen por las leyes de Brasil.`},
      {title:"9. Contacto",body:`onemessage.world@gmail.com`}
    ],
    ppSections:[
      {title:"1. Datos Recopilados",body:`• Contenido del mensaje (hasta 280 caracteres)\n• Nombre de visualización opcional\n• País seleccionado\n• Confirmación de pago de Stripe (nunca guardamos datos de tarjeta)\n• Dirección IP (solo detección de idioma)`},
      {title:"2. Lo Que No Recopilamos",body:`No recopilamos email ni nombre completo. No usamos cookies publicitarias ni píxeles de seguimiento. No vendemos tus datos.`},
      {title:"3. Tus Derechos",body:`Puedes solicitar acceso, corrección o eliminación de tu mensaje (antes de 2036). Contacto: onemessage.world@gmail.com`},
      {title:"4. Contacto",body:`onemessage.world@gmail.com`}
    ]
  },

  fr: {
    name:"Français", dir:"ltr",
    noRefundTitle:"❌ Politique de Non-Remboursement",
    noRefundText:"Tous les paiements sont définitifs et non remboursables. Les frais d'1$ sont une contribution de participation unique et irrévocable. En finalisant le paiement, vous renoncez à tout droit de remboursement ou de rétrofacturation. Initier un chargeback après avoir soumis votre message peut constituer une fraude et sera signalé à Stripe et aux autorités compétentes.",
    noRefundBox:"En payant, vous confirmez avoir lu et accepté cette Politique de Non-Remboursement.",
    tosTitle:"Conditions d'Utilisation",
    ppTitle:"Politique de Confidentialité",
    lastUpdated:"Dernière mise à jour : Janvier 2026",
    bindingNote:"📌 La version anglaise de ces Conditions est la version juridiquement contraignante. Les autres versions sont des traductions de courtoisie. En cas de conflit, la version anglaise prévaut.",
    sections:[
      {title:"1. À Propos du Service",body:`OneMessage.world est un projet de capsule temporelle numérique. Les frais d'1$ sont une contribution de participation. Le service vise — sans le garantir — à préserver les messages jusqu'au 1er janvier 2036.`},
      {title:"2. Aucune Garantie",body:`Nous n'offrons aucune garantie juridique sur la disponibilité ou la permanence du service. Il est fourni « tel quel ». L'1$ est une contribution culturelle, pas un contrat de service garanti.`},
      {title:"3. Aucun Remboursement — Vente Définitive",body:`TOUS LES PAIEMENTS SONT DÉFINITIFS ET NON REMBOURSABLES.\n\nEn finalisant le paiement, vous reconnaissez que :\n\n• Les frais sont une contribution de participation irrévocable.\n• Vous N'initierez PAS de chargeback ou litige. Le faire après soumission constitue une fraude pouvant entraîner des poursuites.\n• Aucun remboursement ne sera accordé : insatisfaction, changement d'avis, problèmes techniques de l'utilisateur, ou non-lecture des Conditions.`},
      {title:"4. Contenu Interdit",body:`Votre message ne doit pas contenir : discours haineux, menaces, harcèlement, diffamation, contenu sexuellement explicite, promotion de violence ou d'activités illégales, violation de propriété intellectuelle, données personnelles de tiers sans consentement. Nous nous réservons le droit de supprimer tout message sans préavis ni remboursement.`},
      {title:"5. Licence de Contenu",body:`Vous conservez la propriété de votre message. En le soumettant, vous accordez à OneMessage.world une licence mondiale, perpétuelle et irrévocable pour le stocker, l'afficher et le publier dans le cadre de la capsule temporelle.`},
      {title:"6. Limitation de Responsabilité",body:`Notre responsabilité totale ne dépassera pas le montant payé (1$). Nous ne sommes pas responsables des dommages indirects, accessoires ou consécutifs.`},
      {title:"7. Renonciation aux Actions Collectives",body:`Vous renoncez au droit de participer à une action collective contre OneMessage.world.`},
      {title:"8. Loi Applicable",body:`Ces Conditions sont régies par les lois du Brésil.`},
      {title:"9. Contact",body:`onemessage.world@gmail.com`}
    ],
    ppSections:[
      {title:"1. Données Collectées",body:`• Contenu du message (280 caractères max)\n• Nom d'affichage optionnel\n• Pays sélectionné\n• Confirmation de paiement Stripe (aucune donnée de carte stockée)\n• Adresse IP (détection de langue uniquement)`},
      {title:"2. Ce Que Nous Ne Collectons Pas",body:`Pas d'e-mail ni de nom complet. Pas de cookies publicitaires ni de pixels de suivi. Pas de vente de données.`},
      {title:"3. Vos Droits (RGPD)",body:`Vous pouvez demander l'accès, la correction ou la suppression de votre message (avant 2036). Contact : onemessage.world@gmail.com\n\nVous pouvez déposer une plainte auprès de votre autorité de protection des données locale.`},
      {title:"4. Contact",body:`onemessage.world@gmail.com`}
    ]
  },

  de: {name:"Deutsch",dir:"ltr",noRefundTitle:"❌ Keine Rückerstattungsrichtlinie",noRefundText:"Alle Zahlungen sind endgültig und nicht erstattungsfähig. Die $1-Gebühr ist ein einmaliger, unwiderruflicher Teilnahmebeitrag. Mit Abschluss der Zahlung verzichten Sie auf jedes Recht auf Rückerstattung oder Rückbuchung. Eine Rückbuchung nach dem Einreichen Ihrer Nachricht kann Betrug darstellen und wird Stripe sowie den zuständigen Behörden gemeldet.",noRefundBox:"Mit der Zahlung bestätigen Sie, diese Richtlinie gelesen und akzeptiert zu haben.",tosTitle:"Nutzungsbedingungen",ppTitle:"Datenschutzerklärung",lastUpdated:"Zuletzt aktualisiert: Januar 2026",bindingNote:"📌 Die englische Version dieser Bedingungen ist die rechtlich bindende Version. Alle anderen Versionen sind Übersetzungen zur Verständnishilfe. Bei Konflikten gilt die englische Version.",sections:[{title:"1. Kein Rückerstatten — Endgültiger Kauf",body:"ALLE ZAHLUNGEN SIND ENDGÜLTIG UND NICHT ERSTATTUNGSFÄHIG.\n\nMit Abschluss der Zahlung erkennen Sie an:\n\n• Die Gebühr ist ein unwiderruflicher Teilnahmebeitrag.\n• Sie werden KEINE Rückbuchung oder Zahlungsstreitigkeit einleiten. Dies nach der Einreichung der Nachricht zu tun, stellt Betrug dar und kann rechtliche Schritte nach sich ziehen.\n• Es werden keine Rückerstattungen gewährt: wegen Unzufriedenheit, Sinnesänderung, technischer Probleme oder Nichtlesen der Bedingungen."},{title:"2. Verbotene Inhalte",body:"Ihre Nachricht darf keine Hassbotschaften, Drohungen, Belästigungen, Verleumdungen, sexuell explizite Inhalte, Gewaltverherrlichung oder illegale Aktivitäten enthalten. Wir behalten uns das Recht vor, jede Nachricht ohne Vorankündigung und Erstattung zu entfernen."},{title:"3. Haftungsbeschränkung",body:"Unsere Gesamthaftung übersteigt den bezahlten Betrag (1$) nicht."},{title:"4. Kontakt",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. Erhobene Daten",body:"• Nachrichteninhalt (max. 280 Zeichen)\n• Optionaler Anzeigename\n• Ausgewähltes Land\n• Zahlungsbestätigung von Stripe (keine Kartendaten gespeichert)\n• IP-Adresse (nur Spracherkennung)"},{title:"2. Ihre Rechte",body:"Sie können Auskunft, Berichtigung oder Löschung Ihrer Nachricht (vor 2036) beantragen. Kontakt: onemessage.world@gmail.com"}]},

  it: {name:"Italiano",dir:"ltr",noRefundTitle:"❌ Politica di Non Rimborso",noRefundText:"Tutti i pagamenti sono definitivi e non rimborsabili. La tariffa di $1 è un contributo di partecipazione unico e irrevocabile. Completando il pagamento, rinunci a qualsiasi diritto di rimborso o storno. Avviare uno chargeback dopo aver inviato il messaggio può costituire frode e verrà segnalato a Stripe e alle autorità competenti.",noRefundBox:"Pagando, confermi di aver letto e accettato questa Politica di Non Rimborso.",tosTitle:"Termini di Servizio",ppTitle:"Informativa sulla Privacy",lastUpdated:"Ultimo aggiornamento: Gennaio 2026",bindingNote:"📌 La versione inglese di questi Termini è quella giuridicamente vincolante. Le altre versioni sono traduzioni di cortesia. In caso di conflitto, prevale la versione inglese.",sections:[{title:"1. Nessun Rimborso — Vendita Definitiva",body:"TUTTI I PAGAMENTI SONO DEFINITIVI E NON RIMBORSABILI.\n\nCompletando il pagamento, riconosci che:\n\n• La tariffa è un contributo di partecipazione irrevocabile.\n• NON avvierai uno chargeback o una disputa. Farlo dopo l'invio costituisce frode e può comportare azioni legali.\n• Nessun rimborso verrà emesso per nessun motivo."},{title:"2. Contenuto Vietato",body:"Il tuo messaggio non deve contenere: incitamento all'odio, minacce, molestie, diffamazione, contenuto sessualmente esplicito, promozione di violenza o attività illegali. Ci riserviamo il diritto di rimuovere qualsiasi messaggio senza preavviso e senza rimborso."},{title:"3. Limitazione di Responsabilità",body:"La nostra responsabilità totale non supererà l'importo pagato ($1)."},{title:"4. Contatto",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. Dati Raccolti",body:"• Contenuto del messaggio (max 280 caratteri)\n• Nome visualizzato opzionale\n• Paese selezionato\n• Conferma pagamento Stripe (nessun dato di carta memorizzato)\n• Indirizzo IP (solo rilevamento lingua)"},{title:"2. I Tuoi Diritti",body:"Puoi richiedere accesso, correzione o cancellazione del tuo messaggio (prima del 2036). Contatto: onemessage.world@gmail.com"}]},

  ja: {name:"日本語",dir:"ltr",noRefundTitle:"❌ 返金不可ポリシー",noRefundText:"すべての支払いは最終的なものであり、返金は一切行われません。$1の手数料は一度限りの、取り消し不可能な参加費です。支払いを完了することで、返金またはチャージバックの権利を放棄します。メッセージ送信後にチャージバックを開始することは詐欺を構成する可能性があり、Stripeおよび関係当局に報告されます。",noRefundBox:"支払いを行うことで、この返金不可ポリシーを読み、同意したことを確認します。",tosTitle:"利用規約",ppTitle:"プライバシーポリシー",lastUpdated:"最終更新：2026年1月",bindingNote:"📌 これらの規約の英語版が法的拘束力を持つバージョンです。他の言語版は参考翻訳のみです。矛盾がある場合、英語版が優先されます。",sections:[{title:"1. 返金不可 — 最終販売",body:"すべての支払いは最終的であり返金不可です。\n\n支払い完了により、以下を認めます：\n\n• 手数料は取り消し不可能な参加費です。\n• チャージバックや支払い異議申し立てを行いません。送信後に行うことは詐欺を構成し、法的措置の対象となります。\n• 不満、気が変わった場合、技術的問題を含むいかなる状況でも返金はありません。"},{title:"2. 禁止コンテンツ",body:"ヘイトスピーチ、脅迫、ハラスメント、名誉毀損、性的に露骨なコンテンツ、暴力や違法行為の促進、知的財産権の侵害を含むメッセージは禁止です。"},{title:"3. 責任の制限",body:"総責任額は支払額（最大$1）を超えません。"},{title:"4. 連絡先",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. 収集データ",body:"• メッセージ内容（280文字まで）\n• 任意の表示名\n• 選択した国\n• Stripeからの支払い確認（カードデータは保存しません）\n• IPアドレス（言語検出のみ）"},{title:"2. お客様の権利",body:"アクセス、修正、削除（2036年開封前）をリクエストできます。連絡先：onemessage.world@gmail.com"}]},

  zh: {name:"中文",dir:"ltr",noRefundTitle:"❌ 不退款政策",noRefundText:"所有付款均为最终付款，不予退款。$1费用是一次性、不可撤销的参与费。完成付款即表示您放弃任何退款或拒付权利。提交留言后发起拒付可能构成欺诈，将向Stripe及相关部门举报。",noRefundBox:"付款即表示您已阅读并接受本不退款政策。",tosTitle:"服务条款",ppTitle:"隐私政策",lastUpdated:"最后更新：2026年1月",bindingNote:"📌 本条款的英文版本具有法律约束力。其他语言版本仅为参考翻译。如有冲突，以英文版本为准。",sections:[{title:"1. 不退款 — 最终销售",body:"所有付款均为最终付款，不予退款。\n\n完成付款即表示您承认：\n\n• 费用是不可撤销的参与费。\n• 您不会发起拒付或付款争议。提交留言后这样做构成欺诈，可能导致法律行动。\n• 任何情况下均不退款：不满意、改变主意、用户技术问题、或付款前未阅读条款。"},{title:"2. 禁止内容",body:"您的留言不得包含：仇恨言论、威胁、骚扰、诽谤、色情内容、宣扬暴力或非法活动、侵犯知识产权。我们保留随时删除任何留言的权利，无需通知，无退款。"},{title:"3. 责任限制",body:"我们的总责任不超过您支付的金额（最多$1）。"},{title:"4. 联系方式",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. 收集的数据",body:"• 留言内容（最多280字符）\n• 可选显示名称\n• 所选国家\n• Stripe的付款确认（从不存储卡片数据）\n• IP地址（仅用于语言检测）"},{title:"2. 您的权利",body:"您可以请求访问、更正或删除您的留言（2036年开放前）。联系：onemessage.world@gmail.com"}]},

  ko: {name:"한국어",dir:"ltr",noRefundTitle:"❌ 환불 불가 정책",noRefundText:"모든 결제는 최종적이며 환불되지 않습니다. $1 수수료는 일회성, 취소 불가능한 참여 기여금입니다. 결제 완료 시 환불 또는 차지백 권리를 포기합니다. 메시지 제출 후 차지백을 시작하면 사기에 해당할 수 있으며 Stripe 및 관련 당국에 보고됩니다.",noRefundBox:"결제함으로써 본 환불 불가 정책을 읽고 동의했음을 확인합니다.",tosTitle:"이용약관",ppTitle:"개인정보 처리방침",lastUpdated:"최종 업데이트: 2026년 1월",bindingNote:"📌 이 약관의 영어 버전이 법적 구속력이 있는 버전입니다. 다른 언어 버전은 참고용 번역입니다. 충돌 시 영어 버전이 우선합니다.",sections:[{title:"1. 환불 불가 — 최종 판매",body:"모든 결제는 최종적이며 어떠한 경우에도 환불되지 않습니다.\n\n결제 완료 시 다음을 인정합니다:\n\n• 수수료는 취소 불가능한 참여 기여금입니다.\n• 차지백이나 결제 분쟁을 제기하지 않겠습니다. 제출 후 이를 시작하면 사기에 해당하며 법적 조치로 이어질 수 있습니다.\n• 불만족, 변심, 기술적 문제를 포함한 어떠한 상황에서도 환불되지 않습니다."},{title:"2. 금지 콘텐츠",body:"메시지에 혐오 발언, 위협, 괴롭힘, 명예훼손, 성적으로 노골적인 콘텐츠, 폭력이나 불법 활동 조장, 지적 재산권 침해를 포함해서는 안 됩니다."},{title:"3. 책임 제한",body:"총 책임은 지불한 금액($1)을 초과하지 않습니다."},{title:"4. 연락처",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. 수집 데이터",body:"• 메시지 내용 (최대 280자)\n• 선택적 표시 이름\n• 선택한 국가\n• Stripe의 결제 확인 (카드 데이터 미저장)\n• IP 주소 (언어 감지 전용)"},{title:"2. 귀하의 권리",body:"접근, 수정, 삭제(2036년 이전)를 요청할 수 있습니다. 연락처: onemessage.world@gmail.com"}]},

  hi: {name:"हिन्दी",dir:"ltr",noRefundTitle:"❌ कोई वापसी नहीं नीति",noRefundText:"सभी भुगतान अंतिम हैं और वापस नहीं किए जाएंगे। $1 शुल्क एक बार का, अपरिवर्तनीय भागीदारी योगदान है। भुगतान पूरा करके आप किसी भी धनवापसी या चार्जबैक के अधिकार को छोड़ते हैं। संदेश जमा करने के बाद चार्जबैक शुरू करना धोखाधड़ी हो सकती है और Stripe तथा संबंधित अधिकारियों को रिपोर्ट किया जाएगा।",noRefundBox:"भुगतान करके आप पुष्टि करते हैं कि आपने यह नीति पढ़ी और स्वीकार की है।",tosTitle:"सेवा की शर्तें",ppTitle:"गोपनीयता नीति",lastUpdated:"अंतिम अद्यतन: जनवरी 2026",bindingNote:"📌 इन शर्तों का अंग्रेजी संस्करण कानूनी रूप से बाध्यकारी है। अन्य भाषा संस्करण केवल समझ के लिए हैं। किसी विरोध की स्थिति में अंग्रेजी संस्करण मान्य होगा।",sections:[{title:"1. कोई वापसी नहीं — अंतिम बिक्री",body:"सभी भुगतान अंतिम हैं और किसी भी परिस्थिति में वापस नहीं किए जाएंगे।\n\nभुगतान पूरा करके आप मानते हैं:\n\n• शुल्क अपरिवर्तनीय भागीदारी योगदान है।\n• आप चार्जबैक या भुगतान विवाद शुरू नहीं करेंगे। संदेश जमा करने के बाद ऐसा करना धोखाधड़ी है।\n• असंतोष, मन बदलने, तकनीकी समस्याओं सहित किसी भी कारण से वापसी नहीं होगी।"},{title:"2. निषिद्ध सामग्री",body:"आपके संदेश में नफरत भरे भाषण, धमकी, उत्पीड़न, मानहानि, यौन सामग्री, हिंसा या अवैध गतिविधियों का प्रचार शामिल नहीं होना चाहिए।"},{title:"3. संपर्क",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. एकत्रित डेटा",body:"• संदेश सामग्री (280 अक्षर तक)\n• वैकल्पिक प्रदर्शन नाम\n• चयनित देश\n• Stripe से भुगतान पुष्टि (कार्ड डेटा संग्रहीत नहीं)"},{title:"2. आपके अधिकार",body:"आप पहुंच, सुधार या हटाने का अनुरोध कर सकते हैं। संपर्क: onemessage.world@gmail.com"}]},

  tr: {name:"Türkçe",dir:"ltr",noRefundTitle:"❌ İade Edilmez Politikası",noRefundText:"Tüm ödemeler kesindir ve iade edilmez. $1 ücreti, tek seferlik ve geri alınamaz bir katılım katkısıdır. Ödemeyi tamamlayarak herhangi bir iade veya chargeback hakkından vazgeçersiniz. Mesajınızı gönderdikten sonra chargeback başlatmak dolandırıcılık teşkil edebilir ve Stripe ile ilgili makamlara bildirilecektir.",noRefundBox:"Ödeme yaparak bu politikayı okuduğunuzu ve kabul ettiğinizi onaylarsınız.",tosTitle:"Kullanım Koşulları",ppTitle:"Gizlilik Politikası",lastUpdated:"Son güncelleme: Ocak 2026",bindingNote:"📌 Bu Koşulların İngilizce versiyonu hukuki bağlayıcılığa sahip versiyondur. Diğer dil versiyonları yalnızca anlaşılırlık için çeviridir. Çatışma durumunda İngilizce versiyon geçerlidir.",sections:[{title:"1. İade Yok — Kesin Satış",body:"TÜM ÖDEMELER KESİNDİR VE İADE EDİLMEZ.\n\nÖdemeyi tamamlayarak kabul edersiniz:\n\n• Ücret geri alınamaz bir katılım katkısıdır.\n• Chargeback veya ödeme itirazı başlatmayacaksınız. Gönderi sonrası yapılması dolandırıcılık oluşturur ve hukuki işleme yol açabilir.\n• Memnuniyetsizlik, fikir değişikliği, teknik sorunlar dahil hiçbir koşulda iade yapılmaz."},{title:"2. Yasak İçerik",body:"Mesajınız: nefret söylemi, tehdit, taciz, iftira, açık cinsel içerik, şiddet veya yasa dışı faaliyetlerin teşviki içermemelidir."},{title:"3. İletişim",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. Toplanan Veriler",body:"• Mesaj içeriği (280 karaktere kadar)\n• İsteğe bağlı görünen ad\n• Seçilen ülke\n• Stripe'tan ödeme onayı (kart verisi saklanmaz)"},{title:"2. Haklarınız",body:"Erişim, düzeltme veya silme (2036 öncesi) talep edebilirsiniz. İletişim: onemessage.world@gmail.com"}]},

  ru: {name:"Русский",dir:"ltr",noRefundTitle:"❌ Политика Невозврата",noRefundText:"Все платежи являются окончательными и не подлежат возврату. Комиссия в $1 — это единовременный, безотзывный взнос за участие. Завершая оплату, вы отказываетесь от любого права на возврат средств или оспаривание платежа. Инициирование чарджбэка после отправки сообщения может квалифицироваться как мошенничество и будет сообщено в Stripe и соответствующие органы.",noRefundBox:"Оплачивая, вы подтверждаете, что прочитали и приняли настоящую Политику Невозврата.",tosTitle:"Условия использования",ppTitle:"Политика конфиденциальности",lastUpdated:"Последнее обновление: Январь 2026",bindingNote:"📌 Английская версия настоящих Условий является юридически обязательной. Другие языковые версии предоставляются только для понимания. В случае разногласий английская версия имеет преимущественную силу.",sections:[{title:"1. Нет возврата — Окончательная продажа",body:"ВСЕ ПЛАТЕЖИ ОКОНЧАТЕЛЬНЫ И НЕ ПОДЛЕЖАТ ВОЗВРАТУ.\n\nЗавершая оплату, вы признаёте:\n\n• Взнос является безотзывным участием.\n• Вы НЕ будете инициировать чарджбэк или спор об оплате. Это после отправки сообщения является мошенничеством.\n• Возврат не производится ни при каких обстоятельствах: неудовлетворённость, смена решения, технические проблемы."},{title:"2. Запрещённый контент",body:"Ваше сообщение не должно содержать: язык ненависти, угрозы, преследование, клевету, явно сексуальный контент, пропаганду насилия или незаконной деятельности."},{title:"3. Контакт",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. Собираемые данные",body:"• Содержание сообщения (до 280 символов)\n• Необязательное отображаемое имя\n• Выбранная страна\n• Подтверждение оплаты от Stripe (данные карты не хранятся)"},{title:"2. Ваши права",body:"Вы можете запросить доступ, исправление или удаление (до 2036 г.). Контакт: onemessage.world@gmail.com"}]},

  id: {name:"Indonesia",dir:"ltr",noRefundTitle:"❌ Kebijakan Tidak Ada Pengembalian Dana",noRefundText:"Semua pembayaran bersifat final dan tidak dapat dikembalikan. Biaya $1 adalah kontribusi partisipasi satu kali yang tidak dapat dibatalkan. Dengan menyelesaikan pembayaran, Anda melepaskan hak atas pengembalian dana atau chargeback. Memulai chargeback setelah mengirim pesan dapat merupakan penipuan dan akan dilaporkan ke Stripe dan otoritas terkait.",noRefundBox:"Dengan membayar, Anda mengonfirmasi telah membaca dan menyetujui Kebijakan ini.",tosTitle:"Syarat Layanan",ppTitle:"Kebijakan Privasi",lastUpdated:"Terakhir diperbarui: Januari 2026",bindingNote:"📌 Versi bahasa Inggris dari Syarat ini adalah versi yang mengikat secara hukum. Versi bahasa lain hanya terjemahan untuk pemahaman. Dalam hal konflik, versi bahasa Inggris berlaku.",sections:[{title:"1. Tidak Ada Pengembalian Dana — Penjualan Final",body:"SEMUA PEMBAYARAN BERSIFAT FINAL DAN TIDAK DAPAT DIKEMBALIKAN.\n\nDengan menyelesaikan pembayaran, Anda mengakui:\n\n• Biaya adalah kontribusi partisipasi yang tidak dapat dibatalkan.\n• Anda TIDAK akan memulai chargeback atau sengketa pembayaran. Melakukannya setelah pengiriman merupakan penipuan dan dapat mengakibatkan tindakan hukum.\n• Tidak ada pengembalian dana dalam keadaan apapun: ketidakpuasan, perubahan pikiran, masalah teknis pengguna."},{title:"2. Konten Terlarang",body:"Pesan Anda tidak boleh mengandung ujaran kebencian, ancaman, pelecehan, pencemaran nama baik, konten seksual eksplisit, promosi kekerasan atau kegiatan ilegal."},{title:"3. Kontak",body:"onemessage.world@gmail.com"}],ppSections:[{title:"1. Data yang Dikumpulkan",body:"• Konten pesan (hingga 280 karakter)\n• Nama tampilan opsional\n• Negara yang dipilih\n• Konfirmasi pembayaran dari Stripe (data kartu tidak disimpan)"},{title:"2. Hak Anda",body:"Anda dapat meminta akses, koreksi, atau penghapusan (sebelum 2036). Kontak: onemessage.world@gmail.com"}]},
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--g:#D4AF37;--bg:#05070F;--bg2:#090C18;--sf:rgba(255,255,255,.034);--br:rgba(212,175,55,.17);--tx:#EDE8D8;--mt:rgba(237,232,216,.52);--red:rgba(239,68,68,.12);--redb:rgba(239,68,68,.3)}
  body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;min-height:100vh}
  nav{position:sticky;top:0;z-index:100;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;background:rgba(5,7,15,.97);border-bottom:1px solid var(--br);gap:12px;flex-wrap:wrap}
  .nlo{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:var(--g);letter-spacing:.06em;white-space:nowrap}
  .tabs{display:flex;gap:0;border:1px solid var(--br);border-radius:4px;overflow:hidden;flex-shrink:0}
  .tab{padding:7px 16px;cursor:pointer;font-size:.78rem;font-family:'DM Sans',sans-serif;background:none;border:none;color:var(--mt);transition:all .2s;white-space:nowrap}
  .tab.on{background:var(--g);color:#000;font-weight:600}
  .lsel{background:var(--sf);border:1px solid var(--br);color:var(--tx);padding:6px 10px;border-radius:4px;font-size:.78rem;font-family:'DM Sans',sans-serif;cursor:pointer;outline:none}
  .lsel option{background:#090C18}
  .wrap{max-width:760px;margin:0 auto;padding:48px 24px 100px}
  .refund-box{background:var(--red);border:2px solid var(--redb);border-radius:8px;padding:28px 32px;margin-bottom:40px}
  .refund-title{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:#f87171;margin-bottom:14px}
  .refund-text{color:rgba(252,165,165,.82);font-size:.93rem;line-height:1.8;margin-bottom:16px}
  .refund-confirm{background:rgba(239,68,68,.08);border:1px solid var(--redb);border-radius:4px;padding:12px 16px;color:#fca5a5;font-size:.82rem;font-weight:500;letter-spacing:.01em}
  .ptitle{font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-weight:700;color:var(--g);margin-bottom:8px}
  .psub{color:var(--mt);font-size:.82rem;margin-bottom:40px;padding-bottom:32px;border-bottom:1px solid var(--br)}
  .upd{display:inline-block;background:rgba(212,175,55,.07);border:1px solid var(--br);color:var(--g);padding:3px 12px;border-radius:20px;font-size:.7rem;letter-spacing:.08em;margin-bottom:14px}
  .binding{background:var(--sf);border:1px solid var(--br);border-radius:6px;padding:16px 20px;margin-bottom:36px;color:var(--mt);font-size:.82rem;line-height:1.7}
  h2{font-family:'Cormorant Garamond',serif;font-size:1.35rem;color:var(--g);margin:36px 0 12px;padding-top:36px;border-top:1px solid var(--br)}
  h2:first-of-type{margin-top:0;padding-top:0;border-top:none}
  p,pre{color:var(--mt);font-size:.91rem;line-height:1.85;margin-bottom:10px;font-family:'DM Sans',sans-serif;white-space:pre-wrap}
  footer{text-align:center;padding:24px;color:var(--mt);font-size:.7rem;border-top:1px solid var(--br);letter-spacing:.05em}
  @media(max-width:600px){.wrap{padding:32px 16px 80px}.ptitle{font-size:1.9rem}.refund-box{padding:20px}.tab{padding:7px 12px;font-size:.72rem}}
  @media(max-width:420px){nav{flex-direction:column;align-items:flex-start;gap:10px}.tabs{width:100%}.tab{flex:1;text-align:center}}
`;

export default function Legal() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("tos");
  const L = LANGS[lang] || LANGS.en;
  const isRTL = L.dir === "rtl";

  return (
    <>
      <style>{CSS}</style>
      <nav>
        <span className="nlo">OneMessage.world</span>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <select className="lsel" value={lang} onChange={e=>setLang(e.target.value)}>
            {Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
          </select>
          <div className="tabs">
            <button className={`tab${tab==="tos"?" on":""}`} onClick={()=>setTab("tos")}>{L.tosTitle}</button>
            <button className={`tab${tab==="pp"?" on":""}`} onClick={()=>setTab("pp")}>{L.ppTitle}</button>
          </div>
        </div>
      </nav>

      <div className="wrap" dir={isRTL?"rtl":"ltr"} style={isRTL?{textAlign:"right"}:{}}>

        {/* NO REFUND — always visible at top */}
        <div className="refund-box">
          <div className="refund-title">{L.noRefundTitle}</div>
          <p className="refund-text">{L.noRefundText}</p>
          <div className="refund-confirm">⚠️ {L.noRefundBox}</div>
        </div>

        <div className="upd">{L.lastUpdated}</div>
        <div className="ptitle">{tab==="tos"?L.tosTitle:L.ppTitle}</div>

        {/* Binding note */}
        {lang !== "en" && <div className="binding">{L.bindingNote}</div>}

        {/* SECTIONS */}
        {(tab==="tos"?L.sections:L.ppSections).map((s,i)=>(
          <div key={i}>
            <h2>{s.title}</h2>
            <pre>{s.body}</pre>
          </div>
        ))}

        {/* English full ToS always linked */}
        {lang !== "en" && (
          <div style={{marginTop:40,padding:"16px 20px",background:"var(--sf)",border:"1px solid var(--br)",borderRadius:6,fontSize:".8rem",color:"var(--mt)"}}>
            {tab==="tos"?"📄 Full legally binding Terms of Service in English available above by switching language to EN.":"📄 Full legally binding Privacy Policy in English available above by switching language to EN."}
          </div>
        )}
      </div>

      <footer>© 2026 OneMessage.world · Legal documents last updated January 2026</footer>
    </>
  );
}
