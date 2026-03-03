// app/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Opportunity = {
  id: string;
  title: string;
  slug: string;
  image_main?: string | null;
  image_url?: string | null;
};

export default async function HomePage() {
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('id, title, slug, image_main, image_url')
    .eq('is_active', true)
    .limit(4);

  const opps: Opportunity[] = (opportunities as Opportunity[]) || [];

  return (
    <main className="min-h-screen bg-white selection:bg-gold selection:text-navy font-sans text-right">
      <section className="relative bg-navy py-32 px-8 border-b-8 border-gold overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_#C5A05933_0%,_transparent_50%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 flex justify-center lg:justify-start order-1 lg:order-2">
            <Image
              src="/logo3.png"
              alt="Aseer Valley Symbol"
              width={650}
              height={650}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 border-r-4 border-gold pr-4 mb-10">
              <span className="text-gold text-xs font-bold tracking-[0.4em] uppercase">
                Asir Valley Strategic Platform
              </span>
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-black text-white mb-10 leading-[1.1] tracking-tighter">
              استثمار ذكي <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold via-[#E5C285] to-gold">
                لمستقبل مالي مستدام
              </span>
            </h1>

            <p className="text-white/70 text-xl md:text-2xl max-w-3xl mb-14 font-light leading-relaxed">
              المنصة التقنية السعودية الرائدة لتسهيل الوصول للفرص الاستثمارية في منطقة عسير، عبر تحليل البيانات بالذكاء الاصطناعي لرفع الشفافية والكفاءة
            </p>

            <div className="flex flex-wrap gap-6 justify-end">
              <Link
                href="/invest"
                className="border-2 border-white/20 text-white px-12 py-5 font-bold text-lg hover:bg-white/5 transition-all"
              >
                الاستثمار الجماعي
              </Link>
              <Link
                href="/map"
                className="group relative bg-gold text-navy px-12 py-5 font-black text-lg transition-all hover:shadow-[0_0_50px_rgba(197,160,89,0.4)] flex items-center gap-3"
              >
                <ArrowUpRight size={22} className="group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                خريطة الفرص الحية
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto -mt-20 relative z-20 px-6">
        <div className="bg-white shadow-[0_40px_80px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-12 space-y-12">
          <div className="text-right space-y-6 max-w-4xl mr-auto">
            <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight">
              رأس المال الذكي لا يبحث عن الفرص… بل يسبقها
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              في عسير فالي نصنع بيئة استثمارية حصرية مصممة لأصحاب القرار،
              حيث تتلاقى البيانات العميقة مع الفرص النوعية لتشكّل مساراً مالياً مختلفاً.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {opps.map((opp) => {
              const img = opp.image_main || opp.image_url || '';
              return (
                <Link
                  key={opp.id}
                  href={`/opportunity/${opp.slug}`}
                  className="overflow-hidden group cursor-pointer border border-gray-100 block"
                >
                  <img
                    src={
                      img ||
                      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=900'
                    }
                    className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={opp.title}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex justify-end gap-6">
            <Link
              href="/map"
              className="bg-navy text-gold px-10 py-4 font-black hover:bg-gold hover:text-navy transition-all"
            >
              استكشاف الخريطة الحية
            </Link>
            <Link
              href="/invest"
              className="border-2 border-navy text-navy px-10 py-4 font-bold hover:bg-navy hover:text-white transition-all"
            >
              الاستثمار الجماعي
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight">
                نعيد صياغة <br />
                المشهد الاستثماري
              </h2>
              <div className="h-2 w-32 bg-gold float-right"></div>
              <div className="clear-both"></div>
            </div>
            <div className="grid gap-8">
              <SolutionItem title="تحليل الفرص" text="استبدال الاجتهاد الشخصي بدقة الذكاء الاصطناعي" />
              <SolutionItem title="تسهيل الوصول" text="ربط مباشر بين المستثمر والفرصة النوعية" />
              <SolutionItem title="الاستثمار الجماعي" text="تمكين الأفراد من المشاركة بمبالغ صغيرة" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gold/20 blur-2xl rounded-3xl group-hover:bg-gold/30 transition-all"></div>
            <div className="relative bg-navy p-14 border-r-8 border-gold shadow-2xl space-y-8">
              <h3 className="text-gold text-2xl font-black italic">نطاق السوق المستهدف</h3>
              <div className="space-y-2">
                <p className="text-white text-5xl font-black tracking-tighter">630,000,000</p>
                <p className="text-gold font-bold text-lg">ريال سعودي حصة مستهدفة</p>
              </div>
              <p className="text-white/50 leading-relaxed font-light">
                نعمل ضمن سوق استثماري تجاري في منطقة عسير يتجاوز حجمه 25 مليار ريال بحلول عام 2027
              </p>
            </div>
          </div>
        </div>
      </section>

      <Link
        href="/ai-assistant"
        className="fixed bottom-10 left-10 z-50 bg-navy text-gold p-5 rounded-full shadow-[0_20px_50px_rgba(10,29,55,0.4)] border-2 border-gold hover:scale-110 transition-transform group"
      >
        <div className="relative">
          <Bot size={32} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-navy animate-pulse"></span>
        </div>
        <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-navy text-white px-4 py-2 text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border-l-4 border-gold">
          اسأل المساعد الذكي
        </span>
      </Link>
    </main>
  );
}

function SolutionItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-6 group flex-row-reverse">
      <div className="w-12 h-12 bg-navy text-gold flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
        <ShieldCheck size={28} />
      </div>
      <div className="space-y-1 text-right">
        <h4 className="text-navy font-black text-xl">{title}</h4>
        <p className="text-gray-500 font-medium">{text}</p>
      </div>
    </div>
  );
}