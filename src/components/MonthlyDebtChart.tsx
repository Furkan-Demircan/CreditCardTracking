import React, { useState } from 'react';
import type { MonthlySummary } from '../types';
import { formatCurrency } from '../services/calculationService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { BarChart3, Info } from 'lucide-react';

interface MonthlyDebtChartProps {
  summaries: MonthlySummary[];
  selectedMonthKey: string | null;
  onSelectMonth: (monthKey: string) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: MonthlySummary = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-700 shadow-2xl max-w-[280px] min-w-[200px]">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
          <span className="font-bold text-white text-xs sm:text-sm">{data.monthLabel}</span>
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
            Vade: {data.dueDate.split('-')[2]}. Gün
          </span>
        </div>

        <div className="space-y-1 mb-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Toplam:</span>
            <span className="font-bold text-white">{formatCurrency(data.totalAmount)}</span>
          </div>
          {data.paidAmount > 0 && (
            <div className="flex justify-between text-xs text-emerald-400">
              <span>Ödenen:</span>
              <span className="font-semibold">{formatCurrency(data.paidAmount)}</span>
            </div>
          )}
          {data.remainingAmount > 0 && (
            <div className="flex justify-between text-xs text-amber-400">
              <span>Kalan:</span>
              <span className="font-semibold">{formatCurrency(data.remainingAmount)}</span>
            </div>
          )}
        </div>

        {data.items.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Taksitler ({data.items.length} Ürün):
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {data.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="truncate max-w-[120px]" title={item.purchaseTitle}>
                    {item.purchaseTitle} ({item.installmentNumber}/{item.totalInstallments})
                  </span>
                  <span className="font-medium text-slate-200">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-2 text-[9px] text-slate-500 text-center italic">
          Detaylar için sütuna dokunun
        </div>
      </div>
    );
  }
  return null;
};

export const MonthlyDebtChart: React.FC<MonthlyDebtChartProps> = ({
  summaries,
  selectedMonthKey,
  onSelectMonth
}) => {
  const [period, setPeriod] = useState<'6m' | '12m' | 'all'>('12m');

  const allRelevant = summaries.filter(s => s.totalAmount > 0 || s.isCurrent);
  
  const sliceCount = period === '6m' ? 6 : period === '12m' ? 12 : 24;
  const chartData = allRelevant.slice(0, sliceCount);

  // Minimum chart width so bars maintain adequate touch thickness on mobile
  const minChartWidth = period === 'all' && chartData.length > 10 ? 640 : period === '12m' ? 520 : 320;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
      {/* Header with Title and Period Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Aylık Ödeme Projeksiyonu</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Aylara göre toplam kredi kartı borcu ve taksit dağılımı
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-slate-900/80 rounded-xl p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setPeriod('6m')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              period === '6m' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            6 Ay
          </button>
          <button
            onClick={() => setPeriod('12m')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              period === '12m' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            12 Ay
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              period === 'all' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tümü
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs mb-3 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
          <span>Ödenmiş Vade</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
          <span>Gelecek Vade</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 ring-2 ring-amber-400/40"></span>
          <span>Bu Ay</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-pink-500"></span>
          <span>Seçili Ay</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-slate-500">
          <Info className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-xs sm:text-sm">Henüz görüntülenecek taksit verisi bulunmuyor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar touch-scroll -mx-2 px-2 pb-2">
          <div style={{ minWidth: `${minChartWidth}px` }} className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
                <XAxis
                  dataKey="shortLabel"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                <Bar
                  dataKey="totalAmount"
                  radius={[6, 6, 0, 0]}
                  onClick={(entry: any) => entry && entry.monthKey && onSelectMonth(entry.monthKey)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {chartData.map((entry) => {
                    let fillColor = '#6366f1';
                    if (entry.isPast) {
                      fillColor = '#10b981';
                    }
                    if (entry.isCurrent) {
                      fillColor = '#f59e0b';
                    }
                    if (selectedMonthKey === entry.monthKey) {
                      fillColor = '#ec4899';
                    }
                    return (
                      <Cell
                        key={entry.monthKey}
                        fill={fillColor}
                        opacity={selectedMonthKey && selectedMonthKey !== entry.monthKey ? 0.45 : 0.9}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
