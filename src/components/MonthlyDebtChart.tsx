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
      <div className="bg-[#202020] p-3 rounded-md border border-[#2e2e2e] shadow-xl max-w-[260px] min-w-[190px]">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#2a2a2a]">
          <span className="font-semibold text-[#f0f0f0] text-xs">{data.monthLabel}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#8a8a8a]">
            {data.dueDate.split('-')[2]}. Gün
          </span>
        </div>

        <div className="space-y-1 mb-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#8a8a8a]">Toplam:</span>
            <span className="font-medium text-[#f0f0f0]">{formatCurrency(data.totalAmount)}</span>
          </div>
          {data.paidAmount > 0 && (
            <div className="flex justify-between text-[#4dab83]">
              <span>Ödenen:</span>
              <span>{formatCurrency(data.paidAmount)}</span>
            </div>
          )}
          {data.remainingAmount > 0 && (
            <div className="flex justify-between text-[#e09153]">
              <span>Kalan:</span>
              <span>{formatCurrency(data.remainingAmount)}</span>
            </div>
          )}
        </div>

        {data.items.length > 0 && (
          <div className="pt-1.5 border-t border-[#2a2a2a]">
            <p className="text-[10px] font-medium text-[#707070] mb-1">
              Taksitler ({data.items.length}):
            </p>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {data.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-[#b0b0b0]">
                  <span className="truncate max-w-[110px]" title={item.purchaseTitle}>
                    {item.purchaseTitle}
                  </span>
                  <span className="font-normal text-[#8a8a8a]">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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

  const minChartWidth = period === 'all' && chartData.length > 10 ? 600 : period === '12m' ? 500 : 300;

  return (
    <div className="notion-block p-4 sm:p-5 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#8a8a8a]" />
            <h2 className="text-sm font-semibold text-[#f0f0f0]">Aylık Ödeme Projeksiyonu</h2>
          </div>
          <p className="text-xs text-[#8a8a8a] mt-0.5">
            Aylara göre toplam taksit borcu dağılımı
          </p>
        </div>

        {/* Period Selector Tabs - Notion Segmented */}
        <div className="flex items-center bg-[#191919] rounded-md p-0.5 border border-[#2e2e2e] self-start sm:self-auto">
          <button
            onClick={() => setPeriod('6m')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              period === '6m' ? 'bg-[#2b2b2b] text-[#ffffff]' : 'text-[#8a8a8a] hover:text-[#e6e6e6]'
            }`}
          >
            6 Ay
          </button>
          <button
            onClick={() => setPeriod('12m')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              period === '12m' ? 'bg-[#2b2b2b] text-[#ffffff]' : 'text-[#8a8a8a] hover:text-[#e6e6e6]'
            }`}
          >
            12 Ay
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              period === 'all' ? 'bg-[#2b2b2b] text-[#ffffff]' : 'text-[#8a8a8a] hover:text-[#e6e6e6]'
            }`}
          >
            Tümü
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs mb-3 pb-2 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-1.5 text-[#8a8a8a]">
          <span className="w-2 h-2 rounded-sm bg-[#3da374]"></span>
          <span>Ödenmiş</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#8a8a8a]">
          <span className="w-2 h-2 rounded-sm bg-[#caa137]"></span>
          <span>Bu Ay</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#8a8a8a]">
          <span className="w-2 h-2 rounded-sm bg-[#4a5568]"></span>
          <span>Gelecek Vade</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#8a8a8a]">
          <span className="w-2 h-2 rounded-sm bg-[#2383e2]"></span>
          <span>Seçili Ay</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-[#666666]">
          <Info className="w-6 h-6 mb-1.5 opacity-50" />
          <p className="text-xs">Henüz görüntülenecek taksit verisi bulunmuyor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar touch-scroll -mx-2 px-2 pb-1">
          <div style={{ minWidth: `${minChartWidth}px` }} className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 15 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  stroke="#555555"
                  tick={{ fill: '#8a8a8a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2e2e2e' }}
                />
                <YAxis
                  stroke="#555555"
                  tick={{ fill: '#8a8a8a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2e2e2e' }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                <Bar
                  dataKey="totalAmount"
                  radius={[4, 4, 0, 0]}
                  onClick={(entry: any) => entry && entry.monthKey && onSelectMonth(entry.monthKey)}
                  className="cursor-pointer"
                >
                  {chartData.map((entry) => {
                    let fillColor = '#4a5568'; // calm slate
                    if (entry.isPast) {
                      fillColor = '#3da374'; // Notion sage green
                    }
                    if (entry.isCurrent) {
                      fillColor = '#caa137'; // Notion amber
                    }
                    if (selectedMonthKey === entry.monthKey) {
                      fillColor = '#2383e2'; // Notion blue
                    }
                    return (
                      <Cell
                        key={entry.monthKey}
                        fill={fillColor}
                        opacity={selectedMonthKey && selectedMonthKey !== entry.monthKey ? 0.5 : 1}
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
