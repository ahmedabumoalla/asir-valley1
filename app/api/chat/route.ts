import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, opportunityContext } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }
      console.log("KEY EXISTS:", !!process.env.OPENAI_API_KEY);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `أنت مستشار مالي داخلي لمنصة عسير فالي. 
            أجب باحترافية واختصار. لا تستخدم رموز مثل # أو * أو $. 
            تفاصيل الفرصة: ${opportunityContext}`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.6
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return NextResponse.json({ error: 'OpenAI error' }, { status: 500 });
    }

    let reply = data.choices?.[0]?.message?.content || 'لم يتم توليد رد.';

    reply = reply.replace(/[*#$]/g, '');

    return NextResponse.json({ reply });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}