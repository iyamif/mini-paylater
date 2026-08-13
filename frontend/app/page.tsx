"use client";

import { useState, useEffect } from "react";

import LoanForm from "@/components/LoanForm";
import LoanSummary from "@/components/LoanSummary";
import InstallmentTable from "@/components/InstallmentTable";
import { Loan } from "@/lib/api";

export default function Home() {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(true);

  // Monitor scroll position to hide/show button on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollBtn(false);
      } else {
        setShowScrollBtn(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk scroll otomatis ke form di mobile mode
  const scrollToForm = () => {
    const element = document.getElementById("simulation-form");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/5"></div>
      <div className="absolute top-10 right-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-[100px] dark:bg-violet-500/5"></div>

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        
        {/* Navigation / Header */}
        <header className="mb-12 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                Mini PayLater
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Simulasi Kredit Instan
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif
            </span>
          </div>
        </header>

        {/* Guest View: Welcoming panel & Simulation Form */}
        {!loan && (
          <div className="grid gap-12 lg:grid-cols-12 items-center mt-4">
            
            {/* Left: Info panel */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight md:text-5xl">
                  Ajukan & Hitung Simulasi Kredit Anda secara Transparan
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
                  Masukkan jumlah pinjaman, tenor, serta bunga bulanan untuk melihat kalkulasi rincian pembayaran serta jadwal jatuh tempo cicilan secara instan.
                </p>
              </div>

              {/* Bouncing floating scroll indicator for mobile view */}
              <div className={`fixed bottom-4 left-0 right-0 z-50 lg:hidden flex justify-center pointer-events-none transition-all duration-300 ${showScrollBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                <button
                  onClick={scrollToForm}
                  className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-indigo-50/80 hover:bg-indigo-100/90 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-100/80 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 backdrop-blur-md px-6 py-3 text-sm font-bold shadow-md shadow-indigo-100/10 dark:shadow-indigo-950/10 animate-bounce cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                >
                  <span>Mulai Simulasi Pinjaman</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>

              {/* Check highlights */}
              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Kalkulasi Otomatis</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hasil simulasi bulanan keluar dalam milidetik.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">100% Transparan</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Semua nominal bunga dirinci secara adil.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tenor Fleksibel</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pilih tenor angsuran bulanan yang Anda butuhkan.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Jadwal Terperinci</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tanggal jatuh tempo cicilan otomatis terbentuk.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Form card */}
            <div id="simulation-form" className="lg:col-span-5 scroll-mt-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/40">
                <h3 className="mb-6 text-xl font-bold text-slate-950 dark:text-white">
                  Form Simulasi Pinjaman
                </h3>
                <LoanForm onSuccess={setLoan} />
              </div>
            </div>

          </div>
        )}

        {/* Result Dashboard View */}
        {loan && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Identity Card Bar */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/70 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-2xl select-none shadow-inner">
                  {loan.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                    Hasil Simulasi Angsuran
                  </p>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white mt-0.5">
                    {loan.customer_name}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-400 dark:text-slate-500 text-left sm:text-right">
                  <span className="block font-medium">ID Transaksi</span>
                  <span className="block font-bold text-slate-700 dark:text-slate-350">#SIM-{loan.id}</span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                <button
                  onClick={() => setLoan(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Simulasi Baru
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <LoanSummary loan={loan} />

            {/* Payment Schedule table */}
            <InstallmentTable installments={loan.installments} />

            {/* Bottom action button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setLoan(null)}
                className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                &larr; Mulai Simulasi Baru
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}