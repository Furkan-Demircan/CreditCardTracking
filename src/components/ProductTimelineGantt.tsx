import React from 'react';
import type { CalculatedPurchase, MonthlySummary } from '../types';
import { formatCurrency } from '../services/calculationService';
import { CalendarRange, ShoppingBag, CheckCircle2, Clock } from 'lucide-react';

interface ProductTimelineGanttProps {
  purchases: CalculatedPurchase[];
  summaries: MonthlySummary[];
  currentDate: Date;
  onSelectProduct: (purchaseId: string) => void;
}

export const ProductTimelineGantt: React.FC<ProductTimelineGanttProps> = ({
  purchases,
  summaries,
  onSelectProduct
}) => {
  const relevantMonths = summaries.filter(s => s.totalAmount > 0 || s.isCurrent).slice(0, 16);

  if (purchases.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CalendarRange className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Taksit Zaman Çizelgesi (Timeline)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ürünlerin hangi aylarda ödendiğini ve kalan vadelerini gösteren görsel plan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Ödenen
          </span>
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Kalan
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/30 inline-block"></span> Bu Ay
          </span>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden flex items-center justify-between bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-3">
        <span>👈 Gelecek ayları görmek için kaydırın</span>
        <span className="text-indigo-400 font-bold">👉</span>
      </div>

      <div className="overflow-x-auto touch-scroll pb-2 -mx-2 px-2">
        <div className="min-w-[640px] sm:min-w-[760px]">
          {/* Header Row: Months */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(46px,1fr))] sm:grid-cols-[240px_repeat(auto-fit,minmax(50px,1fr))] items-center border-b border-slate-800 pb-2.5 mb-3 text-xs font-semibold text-slate-400">
            <div className="sticky left-0 bg-slate-900/95 backdrop-blur-sm z-20 pl-2 pr-2">
              Ürün Bilgisi
            </div>
            <div className="grid grid-flow-col auto-cols-fr gap-1 text-center">
              {relevantMonths.map(m => (
                <div
                  key={m.monthKey}
                  className={`py-1 px-1 rounded-md text-[10px] sm:text-[11px] font-medium ${
                    m.isCurrent
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400'
                  }`}
                >
                  {m.shortLabel}
                </div>
              ))}
            </div>
          </div>

          {/* Product Rows */}
          <div className="space-y-3 sm:space-y-4">
            {purchases.map(purchase => {
              const totalAmountStr = formatCurrency(purchase.totalAmount);
              const monthlyStr = formatCurrency(purchase.monthlyAmount);

              return (
                <div
                  key={purchase.id}
                  onClick={() => onSelectProduct(purchase.id)}
                  className="grid grid-cols-[160px_repeat(auto-fit,minmax(46px,1fr))] sm:grid-cols-[240px_repeat(auto-fit,minmax(50px,1fr))] items-center group hover:bg-slate-800/40 p-1.5 sm:p-2 rounded-xl transition-all border border-transparent hover:border-slate-700/60 cursor-pointer"
                >
                  {/* Left Sticky Column: Product Info */}
                  <div className="sticky left-0 bg-slate-900/95 backdrop-blur-sm z-20 pr-3 pl-1 py-1 rounded-l-xl">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {purchase.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 truncate">
                          <span className="hidden sm:inline">{totalAmountStr} • </span>
                          <span className="text-indigo-300 font-medium">{monthlyStr}</span>
                          <span className="hidden sm:inline">/ay</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 pl-7 sm:pl-9">
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium whitespace-nowrap">
                        {purchase.paidInstallmentsCount}/{purchase.totalInstallments}
                      </span>
                      {purchase.status === 'completed' ? (
                        <span className="text-[9px] sm:text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 whitespace-nowrap">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Bitti
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] text-amber-400 font-medium flex items-center gap-0.5 whitespace-nowrap">
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {purchase.remainingInstallmentsCount} kaldı
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Month Segments Grid */}
                  <div className="grid grid-flow-col auto-cols-fr gap-1 h-9 sm:h-10 items-center">
                    {relevantMonths.map(month => {
                      const inst = purchase.installments.find(i => i.monthKey === month.monthKey);

                      if (!inst) {
                        return (
                          <div
                            key={month.monthKey}
                            className="h-6 sm:h-7 rounded-md bg-slate-900/40 border border-slate-800/40 flex items-center justify-center"
                          >
                            <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                          </div>
                        );
                      }

                      const isPaid = inst.isPaid;
                      return (
                        <div
                          key={month.monthKey}
                          title={`${purchase.title} - ${inst.installmentNumber}.${inst.totalInstallments} Taksit (${formatCurrency(inst.amount)}) - ${isPaid ? 'ÖDENDİ' : 'ÖDENECEK'}`}
                          className={`h-7 sm:h-8 rounded-lg flex flex-col items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all relative shadow-sm ${
                            isPaid
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-200 hover:bg-indigo-600/50 shadow-indigo-500/10'
                          } ${month.isCurrent ? 'ring-2 ring-amber-400/60' : ''}`}
                        >
                          <span className="leading-none">{inst.installmentNumber}.T</span>
                          <span className="text-[7px] sm:text-[8px] opacity-75 font-normal">
                            {isPaid ? '✓' : `${(inst.amount / 1000).toFixed(0)}k`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
