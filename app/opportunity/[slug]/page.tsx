"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, MapPin, Calendar, ArrowUpRight, Heart, 
  Plus, Minus, MessageSquare, Sparkles, X, Send, Loader2, ChevronRight
} from 'lucide-react';

// استدعاء دالة السيرفر الآمنة التي أنشأناها
import { getChatResponse } from '@/app/actions/chat';

export default function OpportunityDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); 
  
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [shares, setShares] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInvesting, setIsInvesting] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setOpportunity(data);
        setChatMessages([{
          role: 'assistant',
          text: `مرحباً بك! أنا مستشار "عسير فالي" الذكي. كيف يمكنني مساعدتك في تحليل فرصة "${data.title}"؟`
        }]);
      }
      setLoading(false);
    };

    fetchOpportunity();
  }, [slug]);

  const handleInvest = async () => {
    setIsInvesting(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const sharePrice = opportunity.share_price || 25000;
    const investedAmount = shares * sharePrice;

    const { error } = await supabase.from('user_investments').insert({
      user_id: session.user.id,
      project_name: opportunity.title,
      category: opportunity.category,
      invested_amount: investedAmount,
      shares_count: shares,
      roi_percentage: `${opportunity.roi_percentage}%`,
      status: 'نشط'
    });

    setIsInvesting(false);
    if (!error) {
      alert('تم تأكيد استثمارك بنجاح! سيتم توجيهك لمحفظتك.');
      router.push('/dashboard');
    } else {
      alert('حدث خطأ أثناء معالجة الاستثمار.');
    }
  };

  // دالة المحادثة أصبحت نظيفة، وآمنة، ولا يمكن حظرها!
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput;
    setChatInput(''); 
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsChatLoading(true);

    const sharePrice = opportunity?.share_price || 25000;
    const context = `المشروع: ${opportunity?.title} | القطاع: ${opportunity?.category} | العائد: ${opportunity?.roi_percentage}% | سعر الحصة: ${sharePrice} ريال`;

    try {
      // إرسال السؤال للسيرفر الآمن الخاص بك بدلاً من المتصفح
      const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    opportunityContext: context
  })
});

const data = await res.json();

if (data.reply) {
  setChatMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
} else {
  setChatMessages(prev => [...prev, { role: 'assistant', text: 'حدث خطأ في التحليل.' }]);
}
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'أعتذر، حدث خطأ في الاتصال. يرجى المحاولة بعد لحظات.' }]);
    }
    
    setIsChatLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><div className="animate-spin w-10 h-10 border-4 border-navy border-t-gold rounded-full"></div></div>;
  }

  if (!opportunity) return <div className="text-center mt-20 text-xl font-bold">الفرصة غير متوفرة</div>;

  const sharePrice = opportunity.share_price || 25000;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 selection:bg-gold selection:text-navy">
      <div className="max-w-7xl mx-auto px-6 mt-12">
        
        <div className="mb-8 flex justify-end">
          <Link href="/map" className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors font-bold text-sm bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:shadow-md group">
            العودة لخريطة الفرص
            <ChevronRight size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-12 text-right animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-row-reverse">
                <div className="inline-block bg-gold/10 text-gold px-4 py-1 text-xs font-black uppercase tracking-widest border-r-4 border-gold">
                  فرصة {opportunity.category} نشطة
                </div>
                <button className="text-gray-300 hover:text-red-500 transition-colors">
                  <Heart size={28} />
                </button>
              </div>
              <h1 className="text-5xl font-black text-navy leading-tight tracking-tighter">{opportunity.title}</h1>
              <div className="flex items-center gap-6 justify-end text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Calendar size={16} /> 3 أشهر للإغلاق</span>
                <span className="flex items-center gap-1"><MapPin size={16} /> {opportunity.city}، منطقة عسير</span>
              </div>
            </div>

            <div className="relative h-[500px] w-full overflow-hidden shadow-2xl border-b-8 border-gold rounded-t-3xl">
              <img 
                src={opportunity.image_main || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200"} 
                className="w-full h-full object-cover shadow-inner hover:scale-105 transition-transform duration-700"
                alt={opportunity.title}
              />
            </div>

            <section className="space-y-6 bg-white p-10 border border-gray-100 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-black text-navy border-r-4 border-gold pr-4">عن الفرصة الاستثمارية</h2>
              <p className="text-gray-500 leading-[2.2] text-lg font-light">
                {opportunity.description || "تعتبر هذه الفرصة من الفرص النوعية في منطقة عسير، تهدف لتطوير الاقتصاد المحلي عبر استغلال الموارد بأفضل المعايير الاستثمارية المستدامة."}
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-navy text-right">معرض صور المشروع</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(opportunity.image_gallery || [
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600",
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600",
                  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600"
                ]).map((img: string, idx: number) => (
                  <div key={idx} className="h-40 overflow-hidden border border-gray-100 rounded-2xl">
                    <img src={img} className="object-cover h-full w-full hover:scale-110 transition-transform duration-500 cursor-pointer" alt={`معرض ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 z-50 animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-navy p-8 text-white shadow-2xl border-t-8 border-gold rounded-3xl">
              <div className="space-y-8 text-right">
                <div className="flex justify-between items-end border-b border-white/10 pb-6 flex-row-reverse">
                  <div className="text-right">
                    <p className="text-gold text-[10px] font-black uppercase tracking-widest mb-1">المبلغ المستهدف</p>
                    <p className="text-3xl font-black">{opportunity.capital_formatted} <span className="text-xs uppercase">SAR</span></p>
                  </div>
                  <TrendingUp className="text-emerald-500" size={32} />
                </div>

                <div className="bg-white/5 p-5 border border-white/10 space-y-5 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold text-white/80 flex-row-reverse">
                    <p>عدد الحصص المطلوبة:</p>
                    <p className="text-[10px] text-gold border border-gold/30 bg-gold/10 px-3 py-1.5 rounded-lg">سعر الحصة: {sharePrice.toLocaleString()} SAR</p>
                  </div>
                  <div className="flex items-center justify-between bg-navy border border-white/20 p-2 rounded-xl flex-row-reverse shadow-inner">
                    <button onClick={() => setShares(shares + 1)} className="p-3 hover:bg-gold hover:text-navy transition-colors rounded-lg bg-white/5"><Plus size={18}/></button>
                    <span className="font-black text-2xl w-12 text-center">{shares}</span>
                    <button onClick={() => shares > 1 && setShares(shares - 1)} className="p-3 hover:bg-gold hover:text-navy transition-colors rounded-lg bg-white/5"><Minus size={18}/></button>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold flex-row-reverse border-t border-white/10 pt-4">
                    <span className="text-white/60">القيمة الإجمالية: <span className="text-white text-sm">{(shares * sharePrice).toLocaleString()}</span> SAR</span>
                    <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">العائد: {opportunity.roi_percentage}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleInvest}
                    disabled={isInvesting}
                    className="w-full bg-gradient-to-l from-gold to-[#c5a059] text-navy py-5 rounded-2xl font-black text-lg hover:from-white hover:to-white transition-all shadow-[0_10px_20px_rgba(197,160,89,0.3)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                  >
                    {isInvesting ? <Loader2 className="animate-spin" size={20} /> : 'تأكيد وإتمام الاستثمار'} 
                    {!isInvesting && <ArrowUpRight size={20} />}
                  </button>
                  <button 
                    onClick={() => setIsChatOpen(true)} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                  >
                    اسأل المستشار الذكي <MessageSquare size={18} className="text-gold group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-6 left-6 w-80 md:w-96 bg-white shadow-[0_30px_60px_rgba(10,29,55,0.15)] border border-gray-100 rounded-2xl z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
          <div className="bg-navy p-4 text-white flex justify-between items-center border-b border-white/10">
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gold transition-colors p-1 bg-white/5 rounded-md"><X size={16} /></button>
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-black">مستشار عسير فالي</span>
                <span className="text-[9px] text-gold flex items-center justify-end gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> متصل الآن</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50">
                <Sparkles size={14} className="text-gold" />
              </div>
            </div>
          </div>
          
          <div className="p-4 h-80 overflow-y-auto text-right text-sm space-y-4 bg-slate-50 flex flex-col scroll-smooth">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gold/10 border border-gold/20 text-navy self-end rounded-br-sm' : 'bg-white border border-gray-100 text-gray-700 self-start rounded-bl-sm whitespace-pre-wrap'}`}>
                {msg.text}
              </div>
            ))}
            {isChatLoading && (
              <div className="bg-white border border-gray-100 p-4 rounded-2xl self-start rounded-bl-sm shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <button 
              onClick={handleSendMessage} 
              disabled={isChatLoading || !chatInput.trim()} 
              className="bg-navy text-gold p-3 rounded-xl hover:bg-gold hover:text-navy transition-colors disabled:opacity-50 disabled:hover:bg-navy disabled:hover:text-gold flex items-center justify-center cursor-pointer"
            >
              <Send size={16} className="rotate-180" />
            </button>
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="استفسر عن العوائد، المخاطر..." 
              className="flex-1 text-right text-xs px-4 focus:outline-none bg-slate-50 rounded-xl border border-gray-200 focus:border-gold/50 transition-colors" 
            />
          </div>
        </div>
      )}
    </main>
  );
}