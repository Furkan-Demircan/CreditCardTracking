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
    <div className="notion-block p-4 sm:p-5 mb-6">
      {/* Header and Month Selector Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8a8a8a]" />
            <h2 className="text-sm font-semibold text-[#f0f0f0]">Aylık Taksit Dökümü</h2>
          </div>
          <p className="text-xs text-[#8a8a8a] mt-0.5">
            Seçili aya ait vadesi gelen taksit ödemeleri
          </p>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll py-0.5 -mx-2 px-2 max-w-full">
          {activeSummaries.map(s => {
            const isSelected = s.monthKey === (selectedMonthKey || currentSummary.monthKey);
            return (
              <button
                key={s.monthKey}
                onClick={() => onSelectMonth(s.monthKey)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 border ${
                  isSelected
                    ? 'bg-[#2b2b2b] text-[#ffffff] border-[#444444]'
                    : 'bg-[#191919] text-[#8a8a8a] border-[#2a2a2a] hover:bg-[#242424] hover:text-[#cccccc]'
                }`}
              >
                {s.shortLabel}
                {s.isCurrent && <span className="ml-1 text-[9px] text-[#caa137]">●</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Month Summary Box (Notion Callout) */}
      <div className="bg-[#1c1c1c] rounded-md p-3.5 mb-4 border border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#f0f0f0]">{currentSummary.monthLabel}</span>
            {currentSummary.isCurrent && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2b2416] text-[#caa137] border border-[#4d3a1f]">
                Bu Ay
              </span>
            )}
          </div>
          <span className="text-xs text-[#8a8a8a] block mt-0.5">
            Vade Günü: <strong className="text-[#cccccc] font-normal">{currentSummary.dueDate.split('-')[2]} {currentSummary.monthLabel}</strong>
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2a2a2a]">
          <div>
            <div className="text-[10px] text-[#8a8a8a] uppercase tracking-wider">Aylık Toplam</div>
            <div className="text-base font-semibold text-[#f0f0f0]">{formatCurrency(currentSummary.totalAmount)}</div>
          </div>
          {currentSummary.paidAmount > 0 && (
            <div>
              <div className="text-[10px] text-[#4dab83] uppercase tracking-wider">Ödenen</div>
              <div className="text-base font-semibold text-[#4dab83]">{formatCurrency(currentSummary.paidAmount)}</div>
            </div>
          )}
          {currentSummary.remainingAmount > 0 && (
            <div className={currentSummary.paidAmount > 0 ? "col-span-2 sm:col-span-1" : ""}>
              <div className="text-[10px] text-[#e09153] uppercase tracking-wider">Kalan</div>
              <div className="text-base font-semibold text-[#e09153]">{formatCurrency(currentSummary.remainingAmount)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      {currentSummary.items.length === 0 ? (
        <div className="text-center py-6 text-[#666666] text-xs">
          Bu ay için planlanmış bir taksit ödemesi bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentSummary.items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectProduct(item.purchaseId)}
              className="bg-[#202020] hover:bg-[#252525] p-3 rounded-md border border-[#2a2a2a] hover:border-[#383838] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`p-1.5 rounded flex-shrink-0 ${item.isPaid ? 'bg-[#1c3829] text-[#4dab83]' : 'bg-[#2a2a2a] text-[#8a8a8a]'}`}>
                  {item.isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-medium text-[#e6e6e6] group-hover:text-[#ffffff] truncate">
                    {item.purchaseTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8a8a8a] mt-0.5 truncate">
                    <span>{item.installmentNumber} / {item.totalInstallments}. Taksit</span>
                    {item.cardName && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate text-[#707070]">
                          <CreditCard className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.cardName}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-2 flex-shrink-0">
                <div>
                  <div className="text-xs font-medium text-[#f0f0f0]">{formatCurrency(item.amount)}</div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                    item.isPaid ? 'bg-[#1c3829] text-[#4dab83]' : 'bg-[#2b2416] text-[#caa137]'
                  }`}>
                    {item.isPaid ? 'Ödendi' : 'Ödenecek'}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#888888]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
