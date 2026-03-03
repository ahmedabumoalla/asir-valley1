"use client";
import React, { useState } from 'react';
import { 
  TrendingUp, MapPin, Calendar, PieChart, Download, 
  ArrowUpRight, Heart, Plus, Minus, MessageSquare, 
  Sparkles, X, Send
} from 'lucide-react';

export default function OpportunityDetails() {
  const [shares, setShares] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sharePrice = 46000;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 selection:bg-gold selection:text-navy">
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* المحتوى الرئيسي */}
        <div className="lg:col-span-2 space-y-12 text-right">
          <div className="space-y-6">
            <div className="flex justify-between items-start flex-row-reverse">
              <div className="inline-block bg-gold/10 text-gold px-4 py-1 text-xs font-black uppercase tracking-widest border-r-4 border-gold">
                فرصة استثمارية نشطة
              </div>
              <button className="text-gray-300 hover:text-red-500 transition-colors">
                <Heart size={28} />
              </button>
            </div>
            <h1 className="text-5xl font-black text-navy leading-tight tracking-tighter">مزرعة السحاب السياحية</h1>
            <div className="flex items-center gap-6 justify-end text-gray-400 font-medium">
              <span className="flex items-center gap-1"><Calendar size={16} /> 3 أشهر للإغلاق</span>
              <span className="flex items-center gap-1"><MapPin size={16} /> السودة، منطقة عسير</span>
            </div>
          </div>

          <div className="relative h-[500px] w-full overflow-hidden shadow-2xl border-b-8 border-gold">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200" 
              className="w-full h-full object-cover shadow-inner"
              alt="Cloud Farm"
            />
          </div>

          <section className="space-y-6 bg-white p-10 border border-gray-100">
            <h2 className="text-2xl font-black text-navy border-r-4 border-gold pr-4">عن الفرصة الاستثمارية</h2>
            <p className="text-gray-500 leading-[2.2] text-lg font-light">
              تعتبر مزرعة السحاب من الفرص النوعية في منطقة عسير، حيث تجمع بين السياحة الريفية والتقنيات الزراعية الحديثة. يهدف المشروع لتطوير مجمع سياحي متكامل يحتوي على نزل ريفية، مزارع عضوية، ومطاعم تقدم تجربة محلية أصيلة في قلب جبال السودة.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-navy text-right">معرض صور المشروع</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="h-40 overflow-hidden border border-gray-100"><img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600" className="object-cover h-full w-full" /></div>
              <div className="h-40 overflow-hidden border border-gray-100"><img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600" className="object-cover h-full w-full" /></div>
              <div className="h-40 overflow-hidden border border-gray-100"><img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600" className="object-cover h-full w-full" /></div>
            </div>
          </section>
        </div>

        {/* الكرت الجانبي الثابت */}
        <aside className="lg:sticky lg:top-24 z-50">
          <div className="bg-navy p-8 text-white shadow-2xl border-t-8 border-gold">
            <div className="space-y-8 text-right">
              <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div className="text-right">
                  <p className="text-gold text-[10px] font-black uppercase tracking-widest mb-1">المبلغ المستهدف</p>
                  <p className="text-3xl font-black">350,000 <span className="text-xs uppercase">SAR</span></p>
                </div>
                <TrendingUp className="text-emerald-500" size={32} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-gold">60% مكتمل</span>
                  <span className="text-white/40">المتبقي: 140,000 SAR</span>
                </div>
                <div className="h-1.5 bg-white/5 w-full">
                  <div className="h-full bg-gold transition-all" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* عداد الحصص المفعّل */}
              <div className="bg-white/5 p-4 border border-white/10 space-y-4">
                <p className="text-xs font-bold text-white/80">عدد الحصص:</p>
                <div className="flex items-center justify-between bg-navy border border-white/20 p-2">
                  <button onClick={() => setShares(shares + 1)} className="p-2 hover:bg-gold hover:text-navy transition-colors"><Plus size={16}/></button>
                  <span className="font-black text-xl">{shares}</span>
                  <button onClick={() => shares > 1 && setShares(shares - 1)} className="p-2 hover:bg-gold hover:text-navy transition-colors"><Minus size={16}/></button>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-white/40">الإجمالي: {(shares * sharePrice).toLocaleString()} SAR</span>
                  <span className="text-gold">14 حصة متاحة</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gold text-navy py-5 font-black text-lg hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                  تأكيد الاستثمار <ArrowUpRight size={20} />
                </button>
                <button onClick={() => setIsChatOpen(true)} className="w-full bg-white/5 border border-white/10 py-4 font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  اسأل المساعد الذكي <MessageSquare size={18} className="text-gold" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white p-8 border border-gray-100 text-right shadow-sm space-y-6">
            <div className="flex items-center justify-end gap-2 text-navy border-b border-gray-50 pb-4">
              <h3 className="text-sm font-black tracking-tighter">تحليل المواءمة الذكي</h3>
              <Sparkles size={20} className="text-gold" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-row-reverse">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-navy to-gold" style={{ width: '92%' }}></div>
                </div>
                <span className="font-black text-navy text-xl">92%</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                تتوافق هذه الفرصة مع سلوكك الاستثماري السابق في المشاريع السياحية عالية العائد.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* المساعد الذكي - نافذة دردشة جانبية صغيرة */}
      {isChatOpen && (
        <div className="fixed bottom-6 left-6 w-80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 z-[1000] flex flex-col animate-in slide-in-from-bottom-10">
          <div className="bg-navy p-4 text-white flex justify-between items-center">
            <button onClick={() => setIsChatOpen(false)}><X size={18} /></button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">مساعد عسير فالي</span>
              <Sparkles size={14} className="text-gold" />
            </div>
          </div>
          <div className="p-4 h-64 overflow-y-auto text-right text-xs space-y-4 bg-slate-50">
            <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
              مرحباً بك! بخصوص "مزرعة السحاب"، هي فرصة بعائد متوقع 18% [cite: 152] وتعتبر من أكثر الفرص أماناً في السودة حالياً[cite: 57]. هل تود معرفة تفاصيل العوائد؟
            </div>
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <button className="bg-navy text-gold p-2 rounded-md"><Send size={16} className="rotate-180" /></button>
            <input type="text" placeholder="اسأل المساعد..." className="flex-1 text-right text-xs px-2 focus:outline-none" />
          </div>
        </div>
      )}
    </main>
  );
}