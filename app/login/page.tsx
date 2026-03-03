"use client";
import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'; // تأكد من استدعاء Image من Next.js
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setLoading(false);
    } else {
      // إعادة التوجيه إلى لوحة التحكم بعد نجاح الدخول
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#F8FAFC] flex items-center justify-center p-6 selection:bg-gold selection:text-navy">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white shadow-[0_50px_100px_-20px_rgba(10,29,55,0.15)] border border-gray-100 overflow-hidden rounded-2xl">
        
        {/* القسم الأيمن: واجهة تسجيل الدخول */}
        <div className="p-12 md:p-16 space-y-10 text-right flex flex-col justify-center">
          
          {/* إضافة الشعار هنا في المنتصف العُلوي لنموذج الدخول */}
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo4.png" 
              alt="Aseer Valley Logo" 
              width={60} 
              height={60} 
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-black text-navy tracking-tight">بوابة المستثمر الاستراتيجية</h1>
            <p className="text-gray-400 text-sm font-medium">مرحباً بك مجدداً في مركز القيادة المالية لمنطقة عسير</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm font-bold border border-red-100 text-right">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-navy uppercase tracking-widest">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@aseervalley.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 pr-12 pl-4 py-4 rounded-xl focus:outline-none focus:border-gold font-medium transition-all text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center flex-row-reverse">
                <label className="block text-xs font-bold text-navy uppercase tracking-widest">كلمة المرور</label>
                <button type="button" className="text-[10px] font-bold text-gold hover:text-navy transition-colors">نسيت كلمة المرور؟</button>
              </div>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 pr-12 pl-4 py-4 rounded-xl focus:outline-none focus:border-gold font-medium transition-all text-right"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <span className="text-xs font-bold text-gray-400">تذكرني على هذا الجهاز</span>
              <input type="checkbox" className="accent-navy w-4 h-4 cursor-pointer rounded" />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-navy text-white py-5 rounded-xl font-black text-lg hover:bg-gold hover:text-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70">
              {loading ? 'جاري التحقق...' : 'دخول لمركز البيانات'} <ShieldCheck size={20} />
            </button>
          </form>

          <div className="pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-sm font-medium">
              ليس لديك حساب مستثمر؟ 
              <Link href="/register" className="text-gold font-black mr-2 hover:underline">ابدأ استثمارك الآن</Link>
            </p>
          </div>
        </div>

        {/* القسم الأيسر: الهوية والبيانات */}
        <div className="hidden lg:flex bg-navy relative overflow-hidden items-center justify-center p-16">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gold/20 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[80px]"></div>
          </div>
          <div className="relative z-10 space-y-8 text-right">
            <div className="inline-flex items-center gap-2 text-gold justify-end w-full">
              <Sparkles size={24} />
              <span className="font-black tracking-[0.3em] uppercase text-xs">Aseer Valley Intelligence</span>
            </div>
            <h2 className="text-white text-4xl font-black leading-tight">
              نحكم البيانات لتمكين <br />
              <span className="text-gold">طموحك الاستثماري</span>
            </h2>
            <p className="text-white/50 text-lg font-light leading-relaxed">
              انضم إلى نخبة المستثمرين في عسير واستفد من فرص الاستثمار الجماعي الموثوقة والمبنية على تحليلات دقيقة
            </p>
            <div className="grid grid-cols-2 gap-6 pt-10">
              <div className="border-r-2 border-gold pr-4">
                <p className="text-white text-2xl font-black">630M</p>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">حجم السوق المستهدف</p>
              </div>
              <div className="border-r-2 border-gold/40 pr-4">
                <p className="text-white text-2xl font-black">18+</p>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">صفقة استراتيجية ناجحة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}