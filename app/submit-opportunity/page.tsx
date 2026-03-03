"use client";
import React from 'react';
import { 
  Upload, MapPin, DollarSign, FileText, 
  Image as ImageIcon, Info, Send, CheckCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function SubmitOpportunity() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <header className="bg-navy py-16 px-8 text-right border-b-8 border-gold">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-4">تقديم فرصة استثمارية</h1>
          <p className="text-white/60 text-lg font-light">
            قم بتزويدنا بتفاصيل مشروعك ليتم دراسته من قبل فريقنا الاستراتيجي تمهيداً لعرضه على المستثمرين.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
        <form className="bg-white p-10 shadow-2xl space-y-12 border border-gray-100">
          
          {/* 1. المعلومات الأساسية */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-navy border-r-4 border-gold pr-4 flex items-center justify-end gap-3 flex-row-reverse">
               المعلومات الأساسية <Info size={24} className="text-gold" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">اسم المشروع / الفرصة</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 focus:border-gold outline-none" placeholder="مثال: منتجع السودة السياحي" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">تصنيف القطاع</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-4 focus:border-gold outline-none appearance-none">
                  <option>سياحي</option>
                  <option>زراعي</option>
                  <option>تجاري</option>
                  <option>ترفيهي</option>
                </select>
              </div>
            </div>
          </section>

          {/* 2. الجولة الاستثمارية (بيانات معتمدة) */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-navy border-r-4 border-gold pr-4 flex items-center justify-end gap-3 flex-row-reverse">
              تفاصيل الجولة الاستثمارية <DollarSign size={24} className="text-gold" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">المبلغ المستهدف (SAR)</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 p-4 focus:border-gold outline-none" placeholder="350,000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الحد الأدنى للاستثمار</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 p-4 focus:border-gold outline-none" placeholder="10,000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">العائد المتوقع (%)</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 focus:border-gold outline-none" placeholder="18%" />
              </div>
            </div>
          </section>

          {/* 3. الوصف والموقع */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-navy border-r-4 border-gold pr-4 flex items-center justify-end gap-3 flex-row-reverse">
               وصف الفرصة والموقع <MapPin size={24} className="text-gold" />
            </h2>
            <div className="text-right">
              <label className="block text-sm font-bold text-gray-400 mb-2">وصف تفصيلي للمشروع والقيمة المضافة</label>
              <textarea rows={5} className="w-full bg-slate-50 border border-slate-200 p-4 focus:border-gold outline-none" placeholder="اشرح لماذا يعتبر مشروعك فرصة ناجحة..." />
            </div>
            {/* خريطة الموقع التفاعلية */}
            <div className="h-64 bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-2 group cursor-pointer hover:bg-slate-50 transition-all">
              <MapPin size={40} className="text-gray-300 group-hover:text-gold" />
              <p className="text-gray-400 font-bold text-xs uppercase">حدد موقع المشروع على الخريطة</p>
            </div>
          </section>

          {/* 4. المرفقات والصور */}
          <section className="space-y-6 text-right">
            <h2 className="text-2xl font-black text-navy border-r-4 border-gold pr-4 flex items-center justify-end gap-3 flex-row-reverse">
              المرفقات والوثائق <Upload size={24} className="text-gold" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-2 border-dashed border-slate-200 p-10 text-center space-y-4 hover:border-gold transition-all">
                <ImageIcon size={40} className="mx-auto text-gold" />
                <p className="text-xs font-bold text-gray-500">ارفع صور المشروع (حد أقصى 5 صور)</p>
                <button type="button" className="text-navy font-black text-xs border-b-2 border-navy pb-1">اختر الملفات</button>
              </div>
              <div className="border-2 border-dashed border-slate-200 p-10 text-center space-y-4 hover:border-gold transition-all">
                <FileText size={40} className="mx-auto text-gold" />
                <p className="text-xs font-bold text-gray-500">دراسة الجدوى / الملف الاستثماري (PDF)</p>
                <button type="button" className="text-navy font-black text-xs border-b-2 border-navy pb-1">ارفع المستندات</button>
              </div>
            </div>
          </section>

          {/* Submission Action */}
          <div className="pt-10 border-t border-gray-100 flex flex-col items-center space-y-6">
            <button className="bg-navy text-white px-16 py-5 font-black text-xl hover:bg-gold hover:text-navy transition-all shadow-2xl flex items-center gap-4">
              إرسال الفرصة للمراجعة <Send size={24} className="rotate-180" />
            </button>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
              <CheckCircle size={18} className="text-emerald-500" />
              سيتم مراجعة طلبك والرد خلال 5 أيام عمل
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}