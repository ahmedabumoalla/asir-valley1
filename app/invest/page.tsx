import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, Leaf, Coffee, Palmtree, 
  Users, ArrowRight, Filter, Search, Plus 
} from 'lucide-react';

export default function CollectiveInvestment() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* 1. Page Header - العنوان الاستراتيجي مع زر التقديم */}
      <header className="bg-navy pt-20 pb-32 px-8 text-right border-b-8 border-gold">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">الاستثمار الجماعي</h1>
          <p className="text-white/60 text-xl max-w-3xl font-light">
            نمكنك من المشاركة في كبرى المشاريع الاستراتيجية بمنطقة عسير بمبالغ تبدأ من 10,000 ريال، مع حوكمة كاملة وشفافية في العوائد.
          </p>
          
          {/* زر إضافة فرصة استثمارية جديدة */}
          <div className="flex gap-4 justify-end mt-8">
            <Link href="/submit-opportunity" className="bg-gold text-navy px-8 py-4 font-black text-lg hover:bg-white transition-all shadow-xl flex items-center gap-3">
              شاركنا فرصتك الاستثمارية <Plus size={22} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Search & Filters - التحكم والدقة */}
      <section className="max-w-7xl mx-auto -mt-12 px-4 relative z-10">
        <div className="bg-white p-6 shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center text-right">
          <div className="flex-1 relative w-full">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن فرصة (زراعية، سياحية، تجارية)..." 
              className="w-full bg-slate-50 border border-slate-200 pr-12 pl-4 py-4 focus:outline-none focus:border-gold font-medium text-right"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <FilterButton label="الكل" active={true} />
            <FilterButton label="زراعي" icon={<Leaf size={16} />} />
            <FilterButton label="سياحي" icon={<Palmtree size={16} />} />
            <FilterButton label="تجاري" icon={<Coffee size={16} />} />
          </div>
        </div>
      </section>

      {/* 3. Investment Grid - عرض الفرص الاستثمارية */}
      <section className="max-w-7xl mx-auto mt-20 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <InvestmentCard 
          image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000"
          title="مزرعة السحاب السياحية"
          location="السودة، عسير"
          category="استثمار سياحي"
          progress={60}
          target="350,000"
          minInvest="46,000"
          roi="18%"
          investors={4}
          href="/opportunity/cloud-farm"
        />
        <InvestmentCard 
          image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000"
          title="مجمع كوفي بارنز"
          location="خميس مشيط"
          category="استثمار تجاري"
          progress={85}
          target="530,000"
          minInvest="25,000"
          roi="12.5%"
          investors={12}
          href="/opportunity/cloud-farm"
        />
        <InvestmentCard 
          image="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000"
          title="معالية ليبريمير الترفيهي"
          location="أبها، عسير"
          category="ترفيه عائلي"
          progress={40}
          target="1,200,000"
          minInvest="100,000"
          roi="15.2%"
          investors={7}
          href="/opportunity/cloud-farm"
        />
      </section>
    </main>
  );
}

// مكونات فرعية

function FilterButton({ label, icon, active = false }: any) {
  return (
    <button className={`flex items-center gap-2 px-8 py-4 font-bold transition-all border ${active ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-gold hover:text-navy'}`}>
      {icon} {label}
    </button>
  );
}

function InvestmentCard({ image, title, location, category, progress, target, minInvest, roi, investors, href }: any) {
  return (
    <div className="bg-white border border-gray-100 group hover:shadow-2xl transition-all duration-500 text-right">
      <div className="relative h-64 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 right-4 bg-navy text-white px-4 py-1 text-xs font-bold border-r-4 border-gold uppercase tracking-widest">
          {category}
        </div>
      </div>

      <div className="p-8 space-y-6 text-right">
        <div>
          <h3 className="text-2xl font-black text-navy mb-2">{title}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-1 justify-end font-medium">{location}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gold">{progress}% مكتمل</span>
            <span className="text-gray-400">المستهدف: {target} ريال</span>
          </div>
          <div className="h-2 bg-slate-100 w-full overflow-hidden">
            <div className="h-full bg-navy transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-y border-gray-50 py-6">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 text-right">الحد الأدنى</p>
            <p className="text-sm font-black text-navy text-right">{minInvest} ريال</p>
          </div>
          <div className="border-r border-gray-100 pr-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 text-right">العائد المتوقع</p>
            <p className="text-sm font-black text-emerald-600 text-right">{roi}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Users size={16} /> {investors} مستثمرون حاليون
          </div>
          <Link href={href} className="flex items-center gap-2 text-navy font-bold text-sm hover:text-gold transition-colors">
            تفاصيل الفرصة <ArrowRight size={18} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}