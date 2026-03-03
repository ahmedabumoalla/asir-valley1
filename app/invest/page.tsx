"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  TrendingUp, Leaf, Coffee, Palmtree, 
  Users, ArrowRight, Filter, Search, Plus ,MapPin 
} from 'lucide-react';

// تعريف واجهة الفرصة بناءً على هيكل قاعدة البيانات
interface Opportunity {
  id: string;
  title: string;
  city: string;
  category: string;
  roi_percentage: number;
  capital_formatted: string;
  share_price: number;
  slug: string;
  image_main: string;
}

export default function CollectiveInvestment() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حالات الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  useEffect(() => {
    let isMounted = true;
    const fetchOpportunities = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (isMounted) {
        if (data) setOpportunities(data);
        setLoading(false);
      }
    };

    fetchOpportunities();
    return () => { isMounted = false; };
  }, []);

  // فلترة الفرص بناءً على البحث واختيار القطاع
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.includes(searchQuery) || opp.city.includes(searchQuery);
    const matchesCategory = activeCategory === 'الكل' || opp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 selection:bg-gold selection:text-navy">
      
      {/* 1. Page Header */}
      <header className="bg-navy pt-20 pb-32 px-8 text-right border-b-8 border-gold">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">الاستثمار الجماعي</h1>
          <p className="text-white/60 text-xl max-w-3xl font-light">
            نمكنك من المشاركة في كبرى المشاريع الاستراتيجية بمنطقة عسير بمبالغ تبدأ من 10,000 ريال، مع حوكمة كاملة وشفافية في العوائد.
          </p>
          
          <div className="flex gap-4 justify-end mt-8">
            <Link href="/submit-opportunity" className="bg-gold text-navy px-8 py-4 font-black text-lg hover:bg-white transition-all shadow-xl flex items-center gap-3">
              شاركنا فرصتك الاستثمارية <Plus size={22} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Search & Filters */}
      <section className="max-w-7xl mx-auto -mt-12 px-4 relative z-10">
        <div className="bg-white p-6 shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center text-right rounded-xl">
          <div className="flex-1 relative w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن فرصة أو مدينة..." 
              className="w-full bg-slate-50 border border-slate-200 pr-12 pl-4 py-4 focus:outline-none focus:border-gold font-medium text-right rounded-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <FilterButton label="الكل" active={activeCategory === 'الكل'} onClick={() => setActiveCategory('الكل')} />
            <FilterButton label="سياحي" icon={<Palmtree size={16} />} active={activeCategory === 'سياحي'} onClick={() => setActiveCategory('سياحي')} />
            <FilterButton label="زراعي" icon={<Leaf size={16} />} active={activeCategory === 'زراعي'} onClick={() => setActiveCategory('زراعي')} />
            <FilterButton label="تجاري" icon={<Coffee size={16} />} active={activeCategory === 'تجاري'} onClick={() => setActiveCategory('تجاري')} />
            <FilterButton label="ترفيهي" icon={<TrendingUp size={16} />} active={activeCategory === 'ترفيهي'} onClick={() => setActiveCategory('ترفيهي')} />
          </div>
        </div>
      </section>

      {/* 3. Investment Grid */}
      <section className="max-w-7xl mx-auto mt-20 px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-navy border-t-gold rounded-full"></div>
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredOpportunities.map((opp) => (
              <InvestmentCard 
                key={opp.id}
                image={opp.image_main || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000"}
                title={opp.title}
                location={`${opp.city}، منطقة عسير`}
                category={opp.category}
                // بيانات افتراضية للمتغيرات التي لم نضفها في قاعدة البيانات بعد (مثل التقدم وعدد المستثمرين)
                progress={Math.floor(Math.random() * 50) + 30} 
                target={opp.capital_formatted}
                minInvest={opp.share_price ? opp.share_price.toLocaleString() : "25,000"}
                roi={`${opp.roi_percentage}%`}
                investors={Math.floor(Math.random() * 20) + 5} 
                href={`/opportunity/${opp.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-bold text-xl">
            لا توجد فرص مطابقة لبحثك في الوقت الحالي.
          </div>
        )}
      </section>
    </main>
  );
}

// مكونات فرعية معدلة لتستقبل الأحداث (Events)

function FilterButton({ label, icon, active = false, onClick }: { label: string, icon?: any, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 font-bold transition-all border rounded-lg ${active ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-gold hover:text-navy cursor-pointer'}`}
    >
      {icon} {label}
    </button>
  );
}

function InvestmentCard({ image, title, location, category, progress, target, minInvest, roi, investors, href }: any) {
  return (
    <div className="bg-white border border-gray-100 group hover:shadow-2xl transition-all duration-500 text-right rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 right-4 bg-navy text-white px-4 py-1 text-xs font-bold border-r-4 border-gold uppercase tracking-widest rounded-l">
          {category}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-xl font-black text-navy mb-2 line-clamp-1">{title}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-1 justify-end font-medium"><MapPin size={14}/> {location}</p>
        </div>

        <div className="space-y-3 mb-6 mt-auto">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-gold">{progress}% مكتمل</span>
            <span className="text-gray-400">المستهدف: {target} ريال</span>
          </div>
          <div className="h-2 bg-slate-100 w-full overflow-hidden rounded-full">
            <div className="h-full bg-gradient-to-l from-navy to-gold transition-all duration-1000 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-gray-50 py-5 mb-5">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 text-right">الحد الأدنى (للحصة)</p>
            <p className="text-sm font-black text-navy text-right">{minInvest} <span className="text-[10px]">ريال</span></p>
          </div>
          <div className="border-r border-gray-100 pr-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 text-right">العائد المتوقع</p>
            <p className="text-sm font-black text-emerald-600 text-right">{roi}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold">
            <Users size={14} className="text-gold" /> {investors} مستثمرون
          </div>
          <Link href={href} className="flex items-center gap-2 text-navy font-black text-xs hover:text-gold transition-colors bg-slate-50 hover:bg-gold/10 px-3 py-2 rounded-lg group/link">
            تفاصيل الفرصة <ArrowRight size={14} className="rotate-180 group-hover/link:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}