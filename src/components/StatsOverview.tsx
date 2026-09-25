import React from 'react';
import type { DashboardStats } from '../types';
import { formatCurrency } from '../services/calculationService';
import { Calendar, CreditCard, TrendingUp, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface StatsOverviewProps {
  stats: DashboardStats;
  currentDateLabel: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, currentDateLabel }) => {
  const paidPercent = stats.thisMonthTotal > 0 ? Math.min(100, Math.round((stats.thisMonthPaid / stats.thisMonthTotal) * 100)) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {/* 1. Bu Ayın Borcu */}
      <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 truncate mr-2">
            Bu Ayın Borcu ({currentDateLabel})
          </span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight break-words">
          {formatCurrency(stats.thisMonthTotal)}
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-1.5 flex-wrap text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Ödenen: {formatCurrency(stats.thisMonthPaid)}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> Kalan: {formatCurrency(stats.thisMonthRemaining)}
          </span>
        </div>
        {stats.thisMonthTotal > 0 && (
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 sm:mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* 2. Gelecek Ayın Borcu */}
      <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Gelecek Ayın Borcu</span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight break-words">
          {formatCurrency(stats.nextMonthTotal)}
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center text-xs text-slate-400 gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>Sonraki ay ödenecek taksit yükü</span>
        </div>
      </div>

      {/* 3. Toplam Kalan Borç */}
      <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-rose-500 to-pink-500"></div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Toplam Kalan Borç</span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform flex-shrink-0">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight break-words">
          {formatCurrency(stats.totalRemainingDebt)}
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center text-xs text-slate-400 gap-1.5">
          <span>Tüm gelecek taksitlerin genel toplamı</span>
        </div>
      </div>

      {/* 4. Aktif Taksit Durumu */}
      <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">Taksit Durumu</span>
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{stats.totalActivePurchases}</span>
          <span className="text-xs sm:text-sm text-slate-400 font-medium">Aktif Ürün</span>
        </div>
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-1 flex-wrap text-xs text-slate-400">
          <span>Kalan: <strong className="text-white">{stats.activeInstallmentCount}</strong> taksit</span>
          <span className="text-emerald-400">Biten: <strong className="text-emerald-400">{stats.completedPurchasesCount}</strong> ürün</span>
        </div>
      </div>
    </div>
  );
};
