"use client";

import { FormEvent, useState } from "react";
import { createLoan, Loan } from "@/lib/api";

interface LoanFormProps {
    onSuccess: (loan: Loan) => void;
}

export default function LoanForm({
    onSuccess,
}: LoanFormProps) {
    const [customerName, setCustomerName] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [tenor, setTenor] = useState("3");
    const [interestRate, setInterestRate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Helper to format string into Rupiah currency representation
    const formatRupiah = (value: string) => {
        const numberString = value.replace(/[^0-9]/g, "");
        if (!numberString) return "";
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");

        const rawAmountStr = loanAmount.replace(/[^0-9]/g, "");
        const amount = Number(rawAmountStr);
        const interest = Number(interestRate);

        if (!customerName.trim()) {
            setError("Nama customer wajib diisi.");
            return;
        }

        if (amount < 500000) {
            setError(
                "Jumlah pinjaman minimal Rp500.000."
            );
            return;
        }

        if (!interestRate || interest < 0) {
            setError(
                "Interest rate wajib diisi."
            );
            return;
        }

        try {
            setLoading(true);

            const loan = await createLoan({
                customer_name: customerName,
                loan_amount: amount,
                tenor: Number(tenor),
                interest_rate: interest,
            });

            onSuccess(loan);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Nama Lengkap Customer
                </label>

                <input
                    type="text"
                    value={customerName}
                    onChange={(e) =>
                        setCustomerName(e.target.value)
                    }
                    placeholder="Masukkan nama customer"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500/45 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Jumlah Pinjaman
                </label>

                <div className="relative flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-indigo-500/45 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                    <span className="pl-4 pr-1 text-sm font-semibold text-slate-400 dark:text-slate-500 select-none">
                        Rp.
                    </span>
                    <input
                        type="text"
                        value={loanAmount}
                        onChange={(e) =>
                            setLoanAmount(formatRupiah(e.target.value))
                        }
                        placeholder="500.000"
                        className="w-full bg-transparent py-3 pl-1 pr-4 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>

                <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    * Minimum pengajuan pinjaman Rp500.000
                </p>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Tenor Pinjaman (Bulan)
                </label>

                <select
                    value={tenor}
                    onChange={(e) =>
                        setTenor(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 h-14 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500/45 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                >
                    <option value="3">3 Bulan</option>
                    <option value="6">6 Bulan</option>
                    <option value="9">9 Bulan</option>
                    <option value="12">12 Bulan</option>
                    <option value="18">18 Bulan</option>
                    <option value="24">24 Bulan</option>
                </select>
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Suku Bunga (% / bulan)
                </label>

                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={interestRate}
                    onChange={(e) =>
                        setInterestRate(e.target.value)
                    }
                    placeholder="Contoh: 2"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500/45 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
            </div>

            {error && (
                <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 p-4.5 text-sm font-medium text-rose-700 dark:text-rose-450 border border-rose-100 dark:border-rose-950/30">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-3.5 font-bold text-white transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
                {loading
                    ? "Memproses Simulasi..."
                    : "Hitung & Ajukan Simulasi"}
            </button>
        </form>
    );
}