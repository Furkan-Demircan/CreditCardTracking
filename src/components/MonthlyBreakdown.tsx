import React from 'react';
import type { MonthlySummary } from '../types';
import { formatCurrency } from '../services/calculationService';
import { Calendar, CheckCircle2, Clock, CreditCard, ChevronRight } from 'lucide-react';

interface MonthlyBreakdownProps {
  summaries: MonthlySummary[];
  selectedMonthKey: string | null;
  onSelectMonth: (monthKey: string) => void;
  onSelectProduct: (purchaseId: string) => void;
}

export const MonthlyBreakdown: React.FC<MonthlyBreakdownProps> = ({
  summaries,
  selectedMonthKey,
  onSelectMonth,
  onSelectProduct
}) => {
  const activeSummaries = summaries.filter(s => s.totalAmount > 0 || s.isCurrent).slice(0, 12);
  const currentSummary = summaries.find(s => s.monthKey === selectedMonthKey) || activeSummaries[0];

  if (!currentSummary) return null;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
      {/* Header and Month Selector Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Aylık Taksit Dökümü & Planı</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Seçili aya ait vadesi gelen taksitlerin ürün bazlı dökümü
          </p>
        </div>

        {/* Month Selector Pills - Smooth Mobile Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll py-1 -mx-2 px-2 max-w-full">
          {activeSummaries.map(s => {
            const isSelected = s.monthKey === (selectedMonthKey || currentSummary.monthKey);
            return (
              <button
                key={s.monthKey}
                onClick={() => onSelectMonth(s.monthKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 flex-shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                } ${s.isCurrent ? 'border-b-2 border-amber-400' : ''}`}
              >
                {s.shortLabel}
                {s.isCurrent && <span className="ml-1 text-[9px] text-amber-300 font-bold">•</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Month Details Header */}
      <div className="bg-slate-900/70 rounded-2xl p-3.5 sm:p-4 mb-4 sm:mb-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-white">{currentSummary.monthLabel}</span>
            {currentSummary.isCurrent && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                Bu Ay
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 block mt-0.5">
            Vade/Ödeme Günü: <strong className="text-white">{currentSummary.dueDate.split('-')[2]} {currentSummary.monthLabel}</strong>
          </span>
        </div>

        {/* Stats row / grid */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
          <div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Toplam Aylık Borç</div>
            <div className="text-base sm:text-xl font-extrabold text-white">{formatCurrency(currentSummary.totalAmount)}</div>
          </div>
          {currentSummary.paidAmount > 0 && (
            <div>
              <div className="text-[10px] sm:text-[11px] text-emerald-400 uppercase tracking-wider">Ödenen</div>
              <div className="text-base sm:text-xl font-extrabold text-emerald-400">{formatCurrency(currentSummary.paidAmount)}</div>
            </div>
          )}
          {currentSummary.remainingAmount > 0 && (
            <div className={currentSummary.paidAmount > 0 ? "col-span-2 sm:col-span-1" : ""}>
              <div className="text-[10px] sm:text-[11px] text-amber-400 uppercase tracking-wider">Kalan</div>
              <div className="text-base sm:text-xl font-extrabold text-amber-400">{formatCurrency(currentSummary.remainingAmount)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Items in selected month */}
      {currentSummary.items.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs sm:text-sm">
          Bu ay için planlanmış bir taksit ödemesi bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {currentSummary.items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectProduct(item.purchaseId)}
              className="bg-slate-800/40 hover:bg-slate-800/80 active:scale-[0.99] p-3 sm:p-3.5 rounded-xl border border-slate-700/50 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-2.5 group cursor-pointer"
            >
              {/* Product Info */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className={`p-2 sm:p-2.5 rounded-lg flex-shrink-0 ${item.isPaid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  {item.isPaid ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                    {item.purchaseTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 flex-wrap truncate">
                    <span className="font-medium text-slate-300">{item.installmentNumber} / {item.totalInstallments}. Taksit</span>
                    {item.cardName && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[10px] sm:text-[11px] truncate">
                          <CreditCard className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{item.cardName}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount and Status */}
              <div className="text-right flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">{formatCurrency(item.amount)}</div>
                  <span className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 whitespace-nowrap ${
                    item.isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.isPaid ? 'Ödendi' : 'Ödenecek'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
