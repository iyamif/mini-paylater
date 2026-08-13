import { Loan } from "@/lib/api";
import { formatRupiah } from "@/lib/format";

interface LoanSummaryProps {
    loan: Loan;
}

export default function LoanSummary({
    loan,
}: LoanSummaryProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    Jumlah Pinjaman
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {formatRupiah(loan.loan_amount)}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    Total Bunga
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {formatRupiah(loan.total_interest)}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    Total Pengembalian
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {formatRupiah(loan.total_amount)}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    Tenor Pinjaman
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {loan.tenor} Bulan
                </p>
            </div>
        </div>
    );
}