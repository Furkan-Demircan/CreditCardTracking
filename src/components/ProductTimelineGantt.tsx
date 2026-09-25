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
    <div className="notion-block p-4 sm:p-5 mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-[#8a8a8a]" />
            <h2 className="text-sm font-semibold text-[#f0f0f0]">Taksit Zaman Çizelgesi</h2>
          </div>
          <p className="text-xs text-[#8a8a8a] mt-0.5">
            Ürün vadelerini ve taksit tamamlanma durumlarını gösteren zaman haritası
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#8a8a8a]">
            <span className="w-2 h-2 rounded-sm bg-[#3da374] inline-block"></span> Ödenen
          </span>
          <span className="flex items-center gap-1.5 text-[#8a8a8a]">
            <span className="w-2 h-2 rounded-sm bg-[#4a5568] inline-block"></span> Kalan
          </span>
          <span className="flex items-center gap-1.5 text-[#8a8a8a]">
            <span className="w-2 h-2 rounded-sm bg-[#caa137] inline-block"></span> Bu Ay
          </span>
        </div>
      </div>

      <div className="overflow-x-auto touch-scroll pb-2 -mx-2 px-2">
        <div className="min-w-[620px] sm:min-w-[720px]">
          {/* Header Row: Months */}
          <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(44px,1fr))] sm:grid-cols-[220px_repeat(auto-fit,minmax(48px,1fr))] items-center border-b border-[#2a2a2a] pb-2 mb-2 text-xs font-medium text-[#8a8a8a]">
            <div className="sticky left-0 bg-[#202020] z-20 pl-1 pr-2">
              Ürün
            </div>
            <div className="grid grid-flow-col auto-cols-fr gap-1 text-center">
              {relevantMonths.map(m => (
                <div
                  key={m.monthKey}
                  className={`py-1 px-0.5 rounded text-[10px] sm:text-[11px] font-normal ${
                    m.isCurrent
                      ? 'bg-[#2b2416] text-[#caa137] font-medium border border-[#4d3a1f]'
                      : 'text-[#8a8a8a]'
                  }`}
                >
                  {m.shortLabel}
                </div>
              ))}
            </div>
          </div>

          {/* Product Rows */}
          <div className="space-y-1.5">
            {purchases.map(purchase => {
              const totalAmountStr = formatCurrency(purchase.totalAmount);
              const monthlyStr = formatCurrency(purchase.monthlyAmount);

              return (
                <div
                  key={purchase.id}
                  onClick={() => onSelectProduct(purchase.id)}
                  className="grid grid-cols-[160px_repeat(auto-fit,minmax(44px,1fr))] sm:grid-cols-[220px_repeat(auto-fit,minmax(48px,1fr))] items-center hover:bg-[#252525] p-1.5 rounded-md transition-colors cursor-pointer group"
                >
                  {/* Left Column: Product Info */}
                  <div className="sticky left-0 bg-[#202020] group-hover:bg-[#252525] transition-colors z-20 pr-2 pl-1 py-0.5">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#666666] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-medium text-[#e6e6e6] truncate group-hover:text-[#ffffff]">
                          {purchase.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] text-[#8a8a8a] truncate">
                          <span>{monthlyStr}/ay</span>
                          <span>•</span>
                          <span className="truncate">{totalAmountStr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 pl-5">
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#2a2a2a] text-[#8a8a8a]">
                        {purchase.paidInstallmentsCount}/{purchase.totalInstallments}
                      </span>
                      {purchase.status === 'completed' ? (
                        <span className="text-[9px] text-[#4dab83] flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Bitti
                        </span>
                      ) : (
                        <span className="text-[9px] text-[#e09153] flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {purchase.remainingInstallmentsCount} kaldı
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Month Segments */}
                  <div className="grid grid-flow-col auto-cols-fr gap-1 h-8 items-center">
                    {relevantMonths.map(month => {
                      const inst = purchase.installments.find(i => i.monthKey === month.monthKey);

                      if (!inst) {
                        return (
                          <div
                            key={month.monthKey}
                            className="h-6 rounded bg-[#232323] flex items-center justify-center opacity-30"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#333333]"></span>
                          </div>
                        );
                      }

                      const isPaid = inst.isPaid;
                      return (
                        <div
                          key={month.monthKey}
                          title={`${purchase.title} - ${inst.installmentNumber}/${inst.totalInstallments} (${formatCurrency(inst.amount)})`}
                          className={`h-6 rounded flex items-center justify-center text-[10px] font-medium transition-colors ${
                            isPaid
                              ? 'bg-[#1c3829] text-[#4dab83] border border-[#234d37]'
                              : 'bg-[#262c36] text-[#8fa7be] border border-[#343e4c]'
                          } ${month.isCurrent ? 'ring-1 ring-[#caa137]' : ''}`}
                        >
                          <span>{inst.installmentNumber}.T</span>
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
