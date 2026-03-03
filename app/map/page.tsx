"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, Layers, Search, Navigation } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Opportunity {
  id: string;
  title: string;
  city: string;
  category: string;
  roi_percentage: number;
  capital_formatted: string;
  slug: string;
  lat: number;
  lng: number;
}

const cartoLightProvider = (x: number, y: number, z: number, dpr?: number) => {
  return `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}${dpr && dpr >= 2 ? '@2x' : ''}.png`;
};

export default function InvestmentMap() {
  const [activeOpportunities, setActiveOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // حالة شريط البحث
  const [stats, setStats] = useState({ totalCapital: '0', count: 0 }); // حالة الإحصائيات الحقيقية
  
  const [center, setCenter] = useState<[number, number]>([18.2164, 42.5053]); 
  const [zoom, setZoom] = useState(9.5);

  useEffect(() => {
    let isMounted = true;
    const fetchOpportunities = async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_active', true);

      if (isMounted) {
        if (data) {
          setActiveOpportunities(data);
          
          // --- حساب الإحصائيات الحقيقية من قاعدة البيانات ---
          let total = 0;
          data.forEach(opp => {
            // تحويل النص (مثال: "1,200,000") إلى رقم صحيح لجمعه
            const amount = parseInt(opp.capital_formatted.replace(/\D/g, '')) || 0;
            total += amount;
          });

          // تنسيق الرقم (إذا كان بالملايين نضع حرف M)
          const formattedTotal = total >= 1000000 
            ? (total / 1000000).toFixed(1) + 'M' 
            : total.toLocaleString();

          setStats({
            totalCapital: formattedTotal,
            count: data.length
          });
        }
        setLoading(false);
      }
    };

    fetchOpportunities();
    return () => { isMounted = false; };
  }, []);

  // فلترة الفرص بناءً على بحث المستخدم (بالمدينة، اسم المشروع، أو القطاع)
  const displayedOpportunities = activeOpportunities.filter(opp => 
    opp.city.includes(searchQuery) || 
    opp.title.includes(searchQuery) || 
    opp.category.includes(searchQuery)
  );

  return (
    <main className="min-h-screen bg-navy text-white font-sans selection:bg-gold selection:text-navy">
      <nav className="border-b border-white/10 bg-navy/80 backdrop-blur-md sticky top-0 z-50 p-6 text-right">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 border-r-4 border-gold pr-4 flex-row-reverse">
            <h1 className="text-2xl font-black tracking-tighter text-right">خريطة الفرص الاستثمارية</h1>
            <span className="text-[10px] bg-gold/20 text-gold px-2 py-1 font-bold uppercase rounded">التحليل اللحظي</span>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مدينة، قطاع، أو مشروع..." 
                className="bg-white/5 border border-white/10 pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-gold w-72 text-right transition-colors rounded-lg text-white placeholder:text-white/30"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-88px)] overflow-hidden flex-row-reverse relative">
        <aside className="w-[400px] border-l border-white/10 overflow-y-auto bg-navy/95 backdrop-blur-xl p-6 space-y-6 text-right z-10 shadow-2xl">
          <div className="flex justify-between items-center mb-8 flex-row-reverse">
            <h2 className="font-bold text-gold uppercase text-sm tracking-widest">الفرص المتاحة حالياً</h2>
            <Layers size={18} className="text-white/40" />
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-gold rounded-full"></div>
            </div>
          ) : (
            displayedOpportunities.map((opp) => (
              <OpportunityItem 
                key={opp.id}
                title={opp.title}
                city={opp.city} 
                category={opp.category}
                roi={opp.roi_percentage + "%"}
                capital={opp.capital_formatted + " SAR"}
                href={`/opportunity/${opp.slug}`}
                onClick={() => {
                  setCenter([opp.lat, opp.lng]);
                  setZoom(13);
                }}
              />
            ))
          )}

          {!loading && displayedOpportunities.length === 0 && (
            <p className="text-white/40 text-sm text-center py-10">لا توجد نتائج مطابقة لبحثك.</p>
          )}
        </aside>

        <section className="flex-1 relative bg-[#e5e7eb]">
          <Map 
            provider={cartoLightProvider}
            center={center} 
            zoom={zoom} 
            onBoundsChanged={({ center, zoom }) => { 
              setCenter(center); 
              setZoom(zoom); 
            }}
          >
            <ZoomControl style={{ left: 20, top: 20 }} />

            {/* رسم الدبابيس بناءً على الفلترة والبحث */}
            {displayedOpportunities.map((opp) => (
              <Marker 
                key={`pin-${opp.id}`} 
                anchor={[opp.lat, opp.lng]} 
                width={50}
              >
                <Link href={`/opportunity/${opp.slug}`} className="relative flex items-center justify-center cursor-pointer group pb-2">
                  <div className="absolute w-10 h-10 bg-gold/40 rounded-full animate-ping"></div>
                  <div className="relative bg-navy p-2 rounded-full shadow-lg border border-gold transition-transform hover:scale-125 z-10">
                    <Navigation size={14} className="text-gold fill-gold" />
                  </div>
                  
                  <div className="absolute bottom-full mb-1 right-1/2 translate-x-1/2 bg-navy text-white px-3 py-2 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none text-right border border-gold/30 min-w-[140px] z-50">
                    <p className="font-black text-xs whitespace-nowrap mb-1">{opp.title}</p>
                    <p className="text-gold text-[10px] font-bold">العائد: {opp.roi_percentage}%</p>
                  </div>
                </Link>
              </Marker>
            ))}
          </Map>

          {/* كرت الإحصائيات الحقيقية من قاعدة البيانات */}
          <div className="absolute bottom-8 right-8 bg-white/95 border border-gray-200 p-6 backdrop-blur-xl rounded-2xl shadow-2xl z-10 pointer-events-none">
            <div className="grid grid-cols-2 gap-8 text-right flex-row-reverse">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">إجمالي حجم الفرص</p>
                <p className="text-2xl font-black text-gold">{stats.totalCapital}</p>
              </div>
              <div className="border-r border-gray-200 pr-8">
                <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">الفرص النشطة</p>
                <p className="text-2xl font-black text-navy">{stats.count} فرصة</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function OpportunityItem({ title, city, category, roi, capital, href, onClick }: any) {
  return (
    <div onClick={onClick} className="group p-5 bg-white/5 border-r-2 border-transparent hover:border-gold hover:bg-white/10 transition-all cursor-pointer block text-right rounded-l-lg">
      <div className="flex justify-between items-center mb-3 flex-row-reverse">
        <span className="text-[9px] font-bold text-gold border border-gold/40 bg-gold/10 px-2 py-0.5 uppercase rounded">{category}</span>
        <TrendingUp size={14} className="text-emerald-500" />
      </div>
      <h3 className="font-bold text-white group-hover:text-gold transition-colors mb-1">{title}</h3>
      <p className="text-white/40 text-xs flex items-center gap-1 mb-4 justify-end flex-row-reverse"><MapPin size={12} /> {city}</p>
      
      <div className="flex justify-between items-end border-t border-white/10 pt-4 flex-row-reverse">
        <div className="text-right">
          <p className="text-[9px] text-white/30 uppercase text-right">رأس المال</p>
          <p className="text-xs font-black text-right text-white">{capital}</p>
        </div>
        <div className="text-left">
          <p className="text-[9px] text-white/30 uppercase text-left">العائد المتوقع</p>
          <p className="text-xs font-black text-gold text-left">{roi}</p>
        </div>
      </div>
      
      <Link href={href} className="mt-4 block w-full text-center text-[10px] font-bold text-navy bg-gold hover:bg-white py-2 transition-colors rounded">
        عرض التفاصيل
      </Link>
    </div>
  );
}