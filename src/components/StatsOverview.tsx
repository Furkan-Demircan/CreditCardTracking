import React from 'react';
import type { DashboardStats } from '../types';
import { formatCurrency } from '../services/calculationService';
import { Calendar, CreditCard, TrendingUp, CheckCircle2 } from 'lucide-react';

interface StatsOverviewProps {
  stats: DashboardStats;
  currentDateLabel: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, currentDateLabel }) => {
  const paidPercent = stats.thisMonthTotal > 0 ? Math.min(100, Math.round((stats.thisMonthPaid / stats.thisMonthTotal) * 100)) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {/* 1. Bu Ayın Borcu */}
      <div className="notion-block p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#8a8a8a] truncate">
              Bu Ay ({currentDateLabel})
            </span>
            <Calendar className="w-3.5 h-3.5 text-[#666666] flex-shrink-0" />
          </div>
          <div className="text-2xl font-semibold text-[#f0f0f0] tracking-tight">
            {formatCurrency(stats.thisMonthTotal)}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#2a2a2a]">
          <div className="flex items-center justify-between text-xs text-[#8a8a8a] mb-1.5">
            <span>Ödenen: <span className="text-[#4dab83]">{formatCurrency(stats.thisMonthPaid)}</span></span>
            <span>Kalan: <span className="text-[#e09153]">{formatCurrency(stats.thisMonthRemaining)}</span></span>
          </div>
          {stats.thisMonthTotal > 0 && (
            <div className="w-full bg-[#2a2a2a] rounded-full h-1 overflow-hidden">
              <div
                className="bg-[#4dab83] h-full rounded-full transition-all duration-300"
                style={{ width: `${paidPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Gelecek Ayın Borcu */}
      <div className="notion-block p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#8a8a8a]">Gelecek Ay</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#666666] flex-shrink-0" />
          </div>
          <div className="text-2xl font-semibold text-[#f0f0f0] tracking-tight">
            {formatCurrency(stats.nextMonthTotal)}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] text-xs text-[#8a8a8a]">
          <span>Önümüzdeki ayın taksit yükü</span>
        </div>
      </div>

      {/* 3. Toplam Kalan Borç */}
      <div className="notion-block p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#8a8a8a]">Toplam Kalan Borç</span>
            <CreditCard className="w-3.5 h-3.5 text-[#666666] flex-shrink-0" />
          </div>
          <div className="text-2xl font-semibold text-[#f0f0f0] tracking-tight">
            {formatCurrency(stats.totalRemainingDebt)}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] text-xs text-[#8a8a8a]">
          <span>Tüm vadeler toplamı</span>
        </div>
      </div>

      {/* 4. Aktif Taksit Durumu */}
      <div className="notion-block p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#8a8a8a]">Taksit Durumu</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#666666] flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-[#f0f0f0]">{stats.totalActivePurchases}</span>
            <span className="text-xs text-[#8a8a8a]">aktif ürün</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-[#8a8a8a]">
          <span>Kalan: <strong className="text-[#cccccc] font-medium">{stats.activeInstallmentCount}</strong> taksit</span>
          <span>Biten: <span className="text-[#4dab83]">{stats.completedPurchasesCount}</span></span>
        </div>
      </div>
    </div>
  );
};
