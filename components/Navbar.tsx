"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation'; 
import { LayoutDashboard, Wallet, Settings, LogOut, ChevronDown, User, Sparkles, MapPin, LineChart } from "lucide-react";
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // جلب مسار الصفحة الحالي
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        if (data) setProfile(data);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single();
        if (data) setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return "م";
    const names = name.split(' ');
    if (names.length >= 2) return `${names[0][0]} ${names[1][0]}`;
    return name[0];
  };

  // 🛑 الشرط السحري الجديد: 
  // تحديد الصفحات التي يُسمح بظهور الهيدر الزجاجي فيها فقط
  const showNavbarPaths = ['/', '/invest'];

  // إذا كان المسار الحالي ليس من ضمن القائمة أعلاه، سيختفي الهيدر فوراً
  if (!showNavbarPaths.includes(pathname)) {
    return null; 
  }

  return (
    <nav className="fixed left-0 right-0 top-4 z-[100] w-[95%] max-w-6xl mx-auto px-6 py-2 transition-all duration-300 bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(10,29,55,0.08),0_4px_10px_rgba(197,160,89,0.05)] rounded-full">
      <div className="flex justify-between items-center relative z-10">
        
        {/* الشعار */}
        <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95 pl-2">
          <div className="relative">
            <Image 
              src="/logo4.png" 
              alt="Aseer Valley" 
              width={40}
              height={40}
              className="relative object-contain" 
              priority
            />
          </div>
        </Link>

        {/* 🌟 الروابط الرئيسية في المنتصف 🌟 */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/map" className="flex items-center gap-1.5 text-sm font-bold text-navy hover:text-gold transition-colors group">
            <MapPin size={16} className="text-gray-400 group-hover:text-gold transition-colors" />
            خريطة الفرص
          </Link>
          
          <Link href="/invest" className="flex items-center gap-1.5 text-sm font-bold text-navy hover:text-gold transition-colors group">
            <LineChart size={16} className="text-gray-400 group-hover:text-gold transition-colors" />
            الاستثمار الجماعي
          </Link>

          {/* زر المساعد الذكي */}
          <Link href="/ai-assistant" className="flex items-center gap-1.5 text-sm font-bold text-navy hover:text-gold transition-colors bg-slate-50/50 hover:bg-gold/5 px-3 py-1.5 rounded-full border border-transparent hover:border-gold/20 group">
            <Sparkles size={14} className="text-gold group-hover:animate-pulse" />
            المساعد الذكي
          </Link>
        </div>

        {/* منطقة حساب المستخدم أو زر الدخول */}
        <div className="flex items-center">
          {loading ? (
             <div className="w-24 h-10 bg-slate-200/50 animate-pulse rounded-full"></div>
          ) : session ? (
            <div className="relative group">
              <button className="flex items-center gap-3 bg-white/80 hover:bg-white border border-white/60 shadow-sm px-2 py-1.5 pr-4 rounded-full transition-all cursor-pointer">
                <ChevronDown size={14} className="text-gold group-hover:rotate-180 transition-transform duration-300" />
                <span className="text-navy font-bold text-sm tracking-widest">لوحتي</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-[#c5a059] text-navy flex items-center justify-center font-black text-sm shadow-[0_0_10px_rgba(197,160,89,0.3)]">
                  {getInitials(profile?.full_name)}
                </div>
              </button>

              <div className="absolute left-0 top-full mt-3 w-64 bg-white/90 backdrop-blur-lg rounded-2xl shadow-[0_20px_40px_rgba(10,29,55,0.1)] border border-white/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left translate-y-4 group-hover:translate-y-0 overflow-hidden">
                <div className="p-5 bg-slate-50/80 border-b border-gray-100/50 text-right">
                  <p className="text-navy font-black text-sm">{profile?.full_name || 'مستثمر'}</p>
                  <p className="text-gold text-[10px] font-bold uppercase tracking-widest mt-1">مستثمر معتمد - الفئة أ</p>
                </div>

                <div className="flex flex-col p-2 text-right">
                  <Link href="/dashboard" className="flex items-center justify-end gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-navy hover:bg-slate-50/50 rounded-xl transition-colors group/link">
                    لوحة القيادة <LayoutDashboard size={16} className="text-gray-400 group-hover/link:text-gold transition-colors" />
                  </Link>
                  
                  <Link href="/dashboard" className="flex items-center justify-end gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-navy hover:bg-slate-50/50 rounded-xl transition-colors group/link">
                    محفظة الأصول <Wallet size={16} className="text-gray-400 group-hover/link:text-gold transition-colors" />
                  </Link>

                  <Link href="#" className="flex items-center justify-end gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-navy hover:bg-slate-50/50 rounded-xl transition-colors group/link">
                    إعدادات الحوكمة والأمان <Settings size={16} className="text-gray-400 group-hover/link:text-gold transition-colors" />
                  </Link>

                  <div className="h-[1px] bg-gray-100/50 my-2 mx-2"></div>

                  <button onClick={handleLogout} className="flex w-full items-center justify-end gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50/50 rounded-xl transition-colors">
                    خروج آمن <LogOut size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-gradient-to-l from-navy to-[#0a1d37] text-gold hover:from-gold hover:to-[#c5a059] hover:text-navy border border-white/20 px-6 py-2 rounded-full transition-all duration-300 shadow-md active:scale-95 group">
              <span className="font-bold text-sm tracking-widest">بوابة المستثمر</span>
              <User size={16} className="group-hover:scale-110 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}