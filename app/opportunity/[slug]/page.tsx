"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, MapPin, Calendar, ArrowUpRight, Heart, 
  Plus, Minus, MessageSquare, Sparkles, X, Send, Loader2, ChevronRight
} from 'lucide-react';
import { getChatResponse } from '@/app/actions/chat';

export default function OpportunityDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); 
  const router = useRouter();
  
  const [opportunity, setOpportunity] = useState<any>(null);
  const [shares, setShares] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInvesting, setIsInvesting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const fetchOpportunity = async () => {
      const { data } = await supabase
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

    const sharePrice = opportunity.share_price || 46000;
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
      alert('تم تأكيد استثمارك بنجاح!');
      router.push('/dashboard');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput;
    setChatInput(''); 
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsChatLoading(true);

    const sharePrice = opportunity?.share_price || 46000;
    const context = `المشروع: ${opportunity?.title} | العائد: ${opportunity?.roi_percentage}% | السعر: ${sharePrice}`;

    try {
      const reply = await getChatResponse(userMessage, context);
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'أعتذر، حدث خطأ في الاتصال.' }]);
    }
    setIsChatLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-gold" size={40} /></div>;
  }

  if (!opportunity) return <div className="text-center mt-20 text-xl font-bold">الفرصة غير متوفرة</div>;

  const sharePrice = opportunity.share_price || 46000;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 selection:bg-gold selection:text-navy">
      <div className="max-w-7xl mx-auto px-6 mt-12">
        
        <div className="mb-8 flex justify-end">
          <Link href="/map" className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors font-bold text-sm bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm group">
            العودة لخريطة الفرص
            <ChevronRight size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-right">
          
          <div className="lg:col-span-2 space-y-12 animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="flex justify-between items-start flex-row-reverse">
                <div className="inline-block bg-gold/10 text-gold px-4 py-1 text-xs font-black uppercase tracking-widest border-r-4 border-gold">
                  فرصة {opportunity.category} نشطة
                </div>
                <button className="text-gray-300 hover:text-red-500 transition-colors"><Heart size={28} /></button>
              </div>
              <h1 className="text-5xl font-black text-navy leading-tight tracking-tighter">{opportunity.title}</h1>
              <div className="flex items-center gap-6 justify-end text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Calendar size={16} /> 3 أشهر للإغلاق</span>
                <span className="flex items-center gap-1"><MapPin size={16} /> {opportunity.city}، منطقة عسير</span>
              </div>
            </div>

            <div className="relative h-[500px] w-full overflow-hidden shadow-2xl border-b-8 border-gold rounded-t-3xl">
              <img 
                src={opportunity.image_main} 
                className="w-full h-full object-cover shadow-inner hover:scale-105 transition-transform duration-700"
                alt={opportunity.title}
              />
            </div>

            <section className="space-y-6 bg-white p-10 border border-gray-100 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-black text-navy border-r-4 border-gold pr-4">عن الفرصة الاستثمارية</h2>
              <p className="text-gray-500 leading-[2.2] text-lg font-light">{opportunity.description}</p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black text-navy">معرض صور المشروع</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(opportunity.image_gallery || []).map((img: string, idx: number) => (
                  <div key={idx} className="h-40 overflow-hidden border border-gray-100 rounded-2xl">
                    <img src={img} className="object-cover h-full w-full hover:scale-110 transition-transform duration-500 cursor-pointer" alt={`معرض ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 z-50 animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-navy p-8 text-white shadow-2xl border-t-8 border-gold rounded-3xl">
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-6 flex-row-reverse">
                  <div className="text-right">
                    <p className="text-gold text-[10px] font-black uppercase mb-1">المبلغ المستهدف</p>
                    <p className="text-3xl font-black">{opportunity.capital_formatted} <span className="text-xs">SAR</span></p>
                  </div>
                  <TrendingUp className="text-emerald-500" size={32} />
                </div>

                <div className="bg-white/5 p-5 border border-white/10 space-y-5 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-bold text-white/80 flex-row-reverse">
                    <p>عدد الحصص المطلوبة:</p>
                    <p className="text-[10px] text-gold border border-gold/30 bg-gold/10 px-3 py-1.5 rounded-lg">
                      سعر الحصة: {isMounted ? sharePrice.toLocaleString('en-US') : '---'} SAR
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between bg-navy border border-white/20 p-2 rounded-xl flex-row-reverse shadow-inner">
                    <button onClick={() => setShares(shares + 1)} className="p-3 hover:bg-gold hover:text-navy transition-colors rounded-lg bg-white/5"><Plus size={18}/></button>
                    <span className="font-black text-2xl w-12 text-center">{shares}</span>
                    <button onClick={() => shares > 1 && setShares(shares - 1)} className="p-3 hover:bg-gold hover:text-navy transition-colors rounded-lg bg-white/5"><Minus size={18}/></button>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] font-bold flex-row-reverse border-t border-white/10 pt-4">
                    <span className="text-white/40">
                      الإجمالي: {isMounted ? (shares * sharePrice).toLocaleString('en-US') : '---'} SAR
                    </span>
                    <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">العائد: {opportunity.roi_percentage}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={handleInvest} disabled={isInvesting} className="w-full bg-gradient-to-l from-gold to-[#c5a059] text-navy py-5 rounded-2xl font-black text-lg hover:from-white hover:to-white transition-all shadow-xl flex items-center justify-center gap-3">
                    {isInvesting ? <Loader2 className="animate-spin" /> : 'تأكيد وإتمام الاستثمار'} <ArrowUpRight size={20} />
                  </button>
                  <button onClick={() => setIsChatOpen(true)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                    اسأل المستشار الذكي <MessageSquare size={18} className="text-gold group-hover:scale-110" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-6 left-6 w-80 md:w-96 bg-white shadow-2xl border border-gray-100 rounded-2xl z-[1000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
          <div className="bg-navy p-4 text-white flex justify-between items-center">
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gold transition-colors"><X size={16} /></button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black">مستشار عسير فالي</span>
              <Sparkles size={14} className="text-gold" />
            </div>
          </div>
          <div className="p-4 h-80 overflow-y-auto text-right text-sm space-y-4 bg-slate-50 flex flex-col scroll-smooth">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gold/10 border border-gold/20 text-navy self-end rounded-br-sm' : 'bg-white border border-gray-100 text-gray-700 self-start rounded-bl-sm'}`}>
                {msg.text}
              </div>
            ))}
            {isChatLoading && <Loader2 className="animate-spin text-gold self-center" />}
          </div>
          <div className="p-3 border-t flex gap-2 bg-white">
            <button onClick={handleSendMessage} className="bg-navy text-gold p-3 rounded-xl"><Send size={16} className="rotate-180" /></button>
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="استفسر عن العوائد..." className="flex-1 text-right text-xs px-4 focus:outline-none bg-slate-50 rounded-xl" />
          </div>
        </div>
      )}
    </main>
  );
}