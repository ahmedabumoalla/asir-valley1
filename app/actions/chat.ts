"use server";

export async function getChatResponse(userMessage: string, opportunityContext: string) {
  const systemPrompt = `
    أنت مستشار مالي آلي حصري يعمل في منصة "عسير فالي" للاستثمار.
    هذه تفاصيل الفرصة الحالية:
    ${opportunityContext}
    
    تعليمات صارمة جداً لردك:
    1. أجب بأسلوب احترافي، مباشر، ومختصر جداً.
    2. لا تستخدم أبداً أي رموز تنسيق مثل النجمات أو الهاشتاق أو علامة الدولار.
    3. لا تستخدم أرقام المصادر أو الاقتباسات (مثل [1] أو [cite]).
    4. قدم نفسك كمستشار داخلي للمنصة ولا تذكر أنك ذكاء اصطناعي.
  `;

  try {
    const openAiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    // 🌟 المحاولة الأولى: ChatGPT (من السيرفر مباشرة، لا يمكن حظره)
    if (openAiKey) {
      try {
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.7
          })
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          return cleanReply(data.choices[0].message.content);
        }
      } catch (e) {
        console.log("ChatGPT server fetch failed, trying Gemini...");
      }
    }

    // 🌟 المحاولة الثانية: Gemini (خطة بديلة قوية)
    if (geminiKey) {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\nسؤال العميل: " + userMessage }] }]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        return cleanReply(data.candidates[0].content.parts[0].text);
      }
    }

    return "أعتذر، أواجه ضغطاً في الاتصال بالخوادم. يرجى المحاولة بعد لحظات.";
  } catch (error) {
    return "حدث خطأ غير متوقع في نظام التحليل.";
  }
}

// دالة التنظيف الصارمة
function cleanReply(text: string) {
  let cleaned = text.split('*').join('').split('#').join('').split('$').join('');
cleaned = cleaned.replace(/\//g, '');
  cleaned = cleaned.replace(/\[\d+\]/g, '');
  return cleaned.trim();
}