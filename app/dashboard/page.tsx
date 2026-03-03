"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Wallet, TrendingUp, PieChart, ArrowUpRight, 
  Bell, Settings, LogOut, ChevronLeft, Sparkles,
  Activity, Briefcase, FileText, Building2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Investment {
  id: string;
  project_name: string;
  category: string;
  invested_amount: number;
  roi_percentage: string;
  status: string;
}

// واجهة لتعريف الفرص المتاحة (سنستخدمها لزر استعرض الفرصة المطابقة)
interface Opportunity {
  id: string;
  title: string;
  category: string;
  roi_percentage: string;
  slug: string;
}

export default function InvestorDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [matchedOpportunity, setMatchedOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  // حساب الإحصائيات ديناميكياً
  const totalInvestment = investments.reduce((sum, inv) => sum + Number(inv.invested_amount), 0);
  const activeProjectsCount = investments.filter(inv => inv.status === 'نشط').length;
  
  const estimatedProfits = investments.reduce((sum, inv) => {
    const roiValue = parseFloat(inv.roi_percentage.replace('%', ''));
    return sum + (Number(inv.invested_amount) * (roiValue / 100));
  }, 0);

  const averageRoi = investments.length > 0 
    ? (investments.reduce((sum, inv) => sum + parseFloat(inv.roi_percentage.replace('%', '')), 0) / investments.length).toFixed(1) + '%'
    : '0%';

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      // 1. التحقق من الجلسة
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        if (isMounted) router.replace('/login');
        return;
      }

      // 2. جلب البيانات بشكل متوازي
      const [profileResponse, investmentsResponse, opportunitiesResponse] = await Promise.all([
        supabase.from('profiles').select('full_name, budget, interests').eq('id', session.user.id).single(),
        supabase.from('user_investments').select('*').order('created_at', { ascending: false }),
        supabase.from('opportunities').select('id, title, category, roi_percentage, slug').eq('is_active', true)
      ]);

      if (isMounted) {
        if (profileResponse.data) {
          const userProfile = profileResponse.data;
          setProfile(userProfile);
          
          // --- منطق المساعد الذكي "استعرض الفرصة المطابقة" ---
          const userInvestments = investmentsResponse.data || [];
          setInvestments(userInvestments);

          // الشرط: لا نقترح فرصة إلا إذا كان المستخدم قد استثمر سابقاً (عنده استثمار واحد على الأقل)
          if (userInvestments.length > 0 && opportunitiesResponse.data && opportunitiesResponse.data.length > 0) {
            
            // 1. تحديد القطاع الأكثر استثماراً من قبل المستخدم
            const categoryCounts = userInvestments.reduce((acc: any, inv) => {
              acc[inv.category] = (acc[inv.category] || 0) + 1;
              return acc;
            }, {});
            
            let topCategory = Object.keys(categoryCounts)[0];
            for (const cat in categoryCounts) {
              if (categoryCounts[cat] > categoryCounts[topCategory]) {
                topCategory = cat;
              }
            }

            // 2. البحث عن فرصة نشطة تطابق هذا القطاع
            const matched = opportunitiesResponse.data.find(opp => opp.category === topCategory);
            
            // إذا وجدنا تطابق نحفظه، وإلا نعرض أي فرصة نشطة كخيار بديل
            if (matched) {
              setMatchedOpportunity(matched);
            } else {
               setMatchedOpportunity(opportunitiesResponse.data[0]);
            }
          }
        }
        setLoading(false);
      }
    };

    fetchUserData();

    return () => { isMounted = false; };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return "م"; 
    const names = name.split(' ');
    if (names.length >= 2) return `${names[0][0]} ${names[1][0]}`;
    return name[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin w-12 h-12 border-4 border-navy/20 border-t-gold rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-navy rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-gold selection:text-navy pb-20">
      {/* 1. Header & Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            {/* استبدال علامة AV بشعار عسير فالي (logo) بدلاً من Live Market */}
            <Link href="/" className="transition-transform hover:scale-105">
              <Image 
                src="/logo.png" // تأكد أن الشعار موجود بهذا الاسم
                alt="Aseer Valley Logo" 
                width={120} 
                height={40} 
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-navy transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-gray-400 hover:text-navy transition-colors">
              <Settings size={20} />
            </button>
            <div className="h-6 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3 text-right group cursor-pointer">
              <div className="hidden md:block">
                <p className="text-sm font-black text-navy">{profile?.full_name || 'مستثمر'}</p>
                <p className="text-[10px] font-bold text-gold uppercase tracking-widest">مستثمر مميز</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-black group-hover:bg-gold group-hover:text-navy transition-colors shadow-sm">
                {getInitials(profile?.full_name)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        
        {/* 2. Sensitive Financial Data (Top Cards) - 8 Columns */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Portfolio Value Card */}
          <div className="bg-navy rounded-3xl p-8 text-white shadow-[0_20px_50px_rgba(10,29,55,0.2)] relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(197,160,89,0.15)] transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/20 rounded-full blur-[80px] group-hover:bg-gold/30 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2 text-right w-full md:w-auto">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center justify-end gap-2">
                  إجمالي القيمة السوقية للمحفظة <Wallet size={14} className="text-gold" />
                </p>
                <h2 className="text-5xl font-black tracking-tighter">
                  {totalInvestment.toLocaleString()} <span className="text-xl text-gold">SAR</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl w-full md:w-auto justify-end">
                <div className="text-right">
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">الأرباح المتوقعة</p>
                  <p className="text-emerald-400 font-black flex items-center justify-end gap-1">+ {estimatedProfits.toLocaleString()} SAR <TrendingUp size={14}/></p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="العائد المتوسط (ROI)" value={averageRoi} icon={<Activity size={18} />} color="text-emerald-500" />
            <StatCard label="المشاريع النشطة" value={activeProjectsCount.toString()} icon={<Building2 size={18} />} />
            <StatCard label="التوزيعات النقدية" value="0" suffix="SAR" icon={<PieChart size={18} />} />
            <StatCard label="السيولة المتاحة" value="-" suffix="SAR" icon={<Wallet size={18} />} />
          </div>

          {/* Active Investments Table */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <button className="text-navy text-xs font-bold hover:text-gold transition-colors flex items-center gap-1">
                <ChevronLeft size={16} /> عرض الكل
              </button>
              <h3 className="text-lg font-black text-navy flex items-center gap-2">
                المحفظة الاستثمارية <Briefcase className="text-gold" size={20} />
              </h3>
            </div>
            <div className="overflow-x-auto text-right">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4 text-left">الإجراء</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4">العائد (ROI)</th>
                    <th className="px-6 py-4">قيمة الاستثمار</th>
                    <th className="px-6 py-4">القطاع</th>
                    <th className="px-6 py-4">اسم المشروع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {investments.length > 0 ? (
                    investments.map((inv) => (
                      <TableRow 
                        key={inv.id}
                        name={inv.project_name} 
                        category={inv.category} 
                        amount={inv.invested_amount.toLocaleString()} 
                        roi={inv.roi_percentage} 
                        status={inv.status}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm font-medium">
                        لا توجد استثمارات حالية في محفظتك. ابدأ رحلتك الآن!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Sidebar (AI Insights & Actions) - 4 Columns */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Advisor Card */}
          <div className="bg-gradient-to-br from-navy to-[#0a1526] rounded-3xl p-6 text-right border border-gold/20 shadow-xl relative overflow-hidden group">
            <div className="absolute -left-6 -top-6 bg-gold/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-700"></div>
            <div className="flex items-center justify-end gap-2 text-gold mb-6 relative z-10">
              <h3 className="font-black text-sm tracking-tighter text-white">تحليل المستشار الذكي</h3>
              <Sparkles size={18} />
            </div>
            
            <div className="relative z-10">
              {investments.length === 0 ? (
                // رسالة للمستخدم الجديد (لم يستثمر بعد)
                <>
                  <p className="text-gray-300 text-xs leading-relaxed mb-6 font-medium">
                    مرحباً بك في عسير فالي. لبدء تحليل نمطك الاستثماري وتقديم توصيات دقيقة عبر الذكاء الاصطناعي، يرجى استكشاف الفرص والمشاركة في أول استثمار لك.
                  </p>
                  <Link href="/invest" className="w-full bg-white/10 text-white border border-white/20 py-3 rounded-xl font-black text-sm hover:bg-white hover:text-navy transition-all shadow-lg flex justify-center items-center cursor-pointer">
                    تصفح الفرص المتاحة
                  </Link>
                </>
              ) : matchedOpportunity ? (
                // رسالة للمستخدم الذي لديه استثمارات (يوجد فرصة مطابقة)
                <>
                  <p className="text-gray-300 text-xs leading-relaxed mb-6 font-medium">
                    بناءً على تحليلاتنا لنمطك الاستثماري في القطاع ({matchedOpportunity.category})، توجد فرصة جديدة "{matchedOpportunity.title}" تتوافق مع محفظتك بنسبة 94% وعائد متوقع {matchedOpportunity.roi_percentage}.
                  </p>
                  <Link href={`/opportunity/${matchedOpportunity.slug}`} className="w-full bg-gold text-navy py-3 rounded-xl font-black text-sm hover:bg-white transition-all shadow-lg flex justify-center items-center cursor-pointer">
                    استعرض الفرصة المطابقة
                  </Link>
                </>
              ) : (
                // رسالة احتياطية إذا كان لديه استثمارات ولكن لا توجد فرص نشطة في الداتا بيس
                 <>
                  <p className="text-gray-300 text-xs leading-relaxed mb-6 font-medium">
                    محفظتك الاستثمارية ممتازة. جاري تحليل السوق حالياً للبحث عن فرص جديدة تتناسب مع نمطك الاستثماري...
                  </p>
                  <button disabled className="w-full bg-white/5 text-white/50 py-3 rounded-xl font-black text-sm cursor-not-allowed">
                    قريباً...
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-black text-navy text-right mb-4">إجراءات سريعة</h3>
            <div className="space-y-2">
              <Link href="/invest"><ActionBtn icon={<Building2 size={16} />} label="استكشاف الفرص الجديدة" /></Link>
              <ActionBtn icon={<Wallet size={16} />} label="إيداع / سحب أموال" />
              {/* تغيير الخيار هنا ليوجه لصفحة الاستثمار الجماعي */}
              <Link href="/invest"><ActionBtn icon={<FileText size={16} />} label="الاستثمار الجماعي" /></Link>
            </div>
          </div>

          {/* Secure Logout */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 text-xs font-bold transition-colors py-4 bg-white rounded-3xl border border-gray-100 shadow-sm active:scale-95"
          >
            تسجيل الخروج الآمن <LogOut size={16} />
          </button>
        </div>

      </div>
    </main>
  );
}

// --- المكونات الفرعية ---
function StatCard({ label, value, suffix = "", icon, color = "text-navy" }: { label: string, value: string, suffix?: string, icon: any, color?: string }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-end justify-center hover:border-gold/30 transition-colors">
      <div className="text-gray-400 mb-3">{icon}</div>
      <h3 className={`text-2xl font-black tracking-tighter ${color}`}>{value} <span className="text-[10px] text-gray-400">{suffix}</span></h3>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function TableRow({ name, category, amount, roi, status }: { name: string, category: string, amount: string, roi: string, status: string }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer text-navy font-medium border-b border-gray-50 last:border-0">
      <td className="px-6 py-4 text-left">
        <button className="text-gray-300 group-hover:text-gold transition-colors">
          <ArrowUpRight size={18} />
        </button>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-[10px] font-bold ${status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : 'bg-gold/10 text-gold'}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-emerald-600 font-black">{roi}</td>
      <td className="px-6 py-4 font-black">{amount} SAR</td>
      <td className="px-6 py-4">
        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-bold uppercase">{category}</span>
      </td>
      <td className="px-6 py-4 font-black text-right">{name}</td>
    </tr>
  );
}

function ActionBtn({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="w-full flex items-center justify-end gap-3 p-3 rounded-xl hover:bg-slate-50 text-navy transition-colors border border-transparent hover:border-gray-100 group cursor-pointer">
      <span className="text-xs font-bold group-hover:text-gold transition-colors">{label}</span>
      <div className="text-gray-400 group-hover:text-navy transition-colors">{icon}</div>
    </div>
  );
}