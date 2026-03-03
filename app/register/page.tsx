"use client";
import React, { useState } from 'react';
import { 
  User, Mail, Phone, Lock, 
  ShieldCheck, Sparkles,
  Leaf, Palmtree, Coffee, Building
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  
  // حالات الفورم
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [budget, setBudget] = useState('10,000 - 50,000 ريال');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // حالات حالة الطلب
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // دالة للتحكم في اختيار الاهتمامات
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // تسجيل الحساب وإرسال البيانات الإضافية لجدول الـ metadata الخاص بالمستخدم
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          budget: budget,
          interests: selectedInterests,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.');
      setLoading(false);
      // يمكنك توجيهه للوحة التحكم إذا كان تفعيل الإيميل غير مطلوب من إعدادات Supabase
      // router.push('/dashboard'); 
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#F8FAFC] flex items-center justify-center p-6 selection:bg-gold selection:text-navy">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white shadow-[0_50px_100px_-20px_rgba(10,29,55,0.1)] border border-gray-100 overflow-hidden">
        
        {/* القسم الأيمن: نموذج التسجيل */}
        <div className="p-10 md:p-14 space-y-8 text-right overflow-y-auto max-h-[85vh]">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-navy tracking-tight">انضم لنخبة المستثمرين</h1>
            <p className="text-gray-400 text-sm font-medium">ابدأ رحلتك في صناعة مستقبل منطقة عسير اليوم</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm font-bold border border-red-100">{error}</div>}
            {success && <div className="text-emerald-600 bg-emerald-50 p-3 rounded-md text-sm font-bold border border-emerald-100">{success}</div>}

            {/* معلومات الهوية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-navy uppercase tracking-widest">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="فيصل القرني" className="w-full bg-slate-50 border border-slate-200 pr-10 pl-4 py-3 text-sm focus:border-gold outline-none text-right" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-navy uppercase tracking-widest">رقم الجوال</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966" className="w-full bg-slate-50 border border-slate-200 pr-10 pl-4 py-3 text-sm text-right focus:border-gold outline-none" dir="ltr" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-navy uppercase tracking-widest">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@aseervalley.com" className="w-full bg-slate-50 border border-slate-200 pr-10 pl-4 py-3 text-sm focus:border-gold outline-none text-right" />
              </div>
            </div>

            {/* تخصيص المحفظة الاستثمارية */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <label className="block text-[10px] font-black text-navy uppercase tracking-widest italic text-gold">تخصيص اهتماماتك الاستثمارية</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InterestCard icon={<Palmtree size={18}/>} label="سياحي" isSelected={selectedInterests.includes('سياحي')} onClick={() => toggleInterest('سياحي')} />
                <InterestCard icon={<Leaf size={18}/>} label="زراعي" isSelected={selectedInterests.includes('زراعي')} onClick={() => toggleInterest('زراعي')} />
                <InterestCard icon={<Coffee size={18}/>} label="تجاري" isSelected={selectedInterests.includes('تجاري')} onClick={() => toggleInterest('تجاري')} />
                <InterestCard icon={<Building size={18}/>} label="عقاري" isSelected={selectedInterests.includes('عقاري')} onClick={() => toggleInterest('عقاري')} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-navy uppercase tracking-widest">ميزانية الاستثمار المبدئية</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm focus:border-gold outline-none appearance-none font-bold text-right" dir="rtl">
                <option value="10,000 - 50,000 ريال">10,000 - 50,000 ريال</option>
                <option value="50,000 - 200,000 ريال">50,000 - 200,000 ريال</option>
                <option value="أكثر من 200,000 ريال">أكثر من 200,000 ريال</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-navy uppercase tracking-widest">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 pr-10 pl-4 py-3 text-sm focus:border-gold outline-none text-right" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-navy text-white py-5 font-black text-lg hover:bg-gold hover:text-navy transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70">
              {loading ? 'جاري التسجيل...' : 'إنشاء حساب المستثمر'} <ShieldCheck size={20} />
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400 text-xs font-medium">
              لديك حساب بالفعل؟ 
              <Link href="/login" className="text-gold font-black mr-2 hover:underline">تسجيل الدخول</Link>
            </p>
          </div>
        </div>

        {/* القسم الأيسر: الرؤية الاستراتيجية */}
        <div className="hidden lg:flex bg-navy relative p-16 flex-col justify-between overflow-hidden text-right">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_#C5A059_0%,_transparent_60%)]"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 text-gold justify-end w-full">
              <Sparkles size={20} />
              <span className="text-[10px] font-black tracking-widest uppercase">Smart Investment Hub</span>
            </div>
            <h2 className="text-white text-4xl font-black leading-tight">
              نحول البيانات إلى <br />
              <span className="text-gold">فرص سيادية</span>
            </h2>
            <p className="text-white/50 text-lg font-light leading-relaxed">
              عبر "عسير فالي"، نسهل وصولك لفرص استثمارية تشاركية موثوقة تم تحليلها بدقة لضمان أعلى مستويات الشفافية
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
            <div>
              <p className="text-gold text-2xl font-black tracking-tighter">25B</p>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">حجم سوق عسير </p>
            </div>
            <div>
              <p className="text-gold text-2xl font-black tracking-tighter">2.4%</p>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">عمولة تشغيلية منافسة </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// مكون كرت الاهتمامات (تم تحديثه ليدعم النقر وتغيير اللون)
function InterestCard({ icon, label, isSelected, onClick }: { icon: any, label: string, isSelected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 border cursor-pointer transition-all group ${
        isSelected ? 'bg-gold/10 border-gold text-navy' : 'bg-slate-50 border-slate-200 hover:border-gold hover:bg-gold/5 text-gray-400'
      }`}
    >
      <div className={`${isSelected ? 'text-gold' : 'text-navy group-hover:text-gold'} transition-colors`}>{icon}</div>
      <span className={`text-[10px] font-bold ${isSelected ? 'text-gold' : 'text-navy'}`}>{label}</span>
    </div>
  );
}