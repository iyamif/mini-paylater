import { Installment } from "@/lib/api";
import { formatRupiah } from "@/lib/format";

interface InstallmentTableProps {
    installments: Installment[];
}

export default function InstallmentTable({
    installments,
}: InstallmentTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <h2 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    Jadwal Pembayaran & Angsuran
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-3.5 text-left">
                                Bulan
                            </th>
                            <th className="px-6 py-3.5 text-left">
                                Jatuh Tempo
                            </th>
                            <th className="px-6 py-3.5 text-right">
                                Jumlah Tagihan
                            </th>
                            <th className="px-6 py-3.5 text-center">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {installments.map((installment) => (
                            <tr
                                key={installment.id}
                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/45 transition-colors duration-150"
                            >
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                                    Cicilan ke-{installment.month_number}
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                    {installment.due_date}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-950 dark:text-white">
                                    {formatRupiah(installment.amount_due)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-400 border border-amber-100/70 dark:border-amber-900/30">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                        {installment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}