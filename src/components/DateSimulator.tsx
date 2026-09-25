import React from 'react';
import { format, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Zap, RotateCcw, Calendar, ArrowRight } from 'lucide-react';

interface DateSimulatorProps {
  simulatedDate: Date;
  onSetDate: (date: Date) => void;
  onReset: () => void;
  isSimulated: boolean;
}

export const DateSimulator: React.FC<DateSimulatorProps> = ({
  simulatedDate,
  onSetDate,
  onReset,
  isSimulated
}) => {
  return (
    <div className={`rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 transition-all border ${
      isSimulated
        ? 'bg-gradient-to-r from-amber-950/60 to-indigo-950/60 border-amber-500/40 shadow-lg shadow-amber-500/5'
        : 'glass-card'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${isSimulated ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <Zap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white">Tarih Simülatörü & Vade Testi</span>
              {isSimulated ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 whitespace-nowrap">
                  ⚡ Simülasyon Aktif
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium whitespace-nowrap">
                  Gerçek Zamanlı
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Aktif tarih: <strong className="text-white">{format(simulatedDate, 'd MMMM yyyy', { locale: tr })}</strong>. Tarihi ileri sararak taksitlerin otomatik nasıl düştüğünü test edin.
            </p>
          </div>
        </div>

        {/* Action Controls - Mobile Responsive Grid/Flex */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
          {/* Quick Buttons Row */}
          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center">
            <button
              onClick={() => onSetDate(addMonths(simulatedDate, 1))}
              className="px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <span>+1 Ay</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => onSetDate(addMonths(simulatedDate, 3))}
              className="px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all text-center active:scale-95"
            >
              +3 Ay
            </button>

            <button
              onClick={() => onSetDate(addMonths(simulatedDate, 6))}
              className="px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all text-center active:scale-95"
            >
              +6 Ay
            </button>
          </div>

          {/* Date Picker & Reset Row */}
          <div className="flex items-center gap-2">
            {/* Custom Date Input */}
            <div className="flex-1 sm:flex-initial flex items-center bg-slate-800/90 rounded-xl px-2.5 py-1.5 border border-slate-700 hover:border-indigo-500/50 transition-colors">
              <Calendar className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" />
              <input
                type="date"
                value={format(simulatedDate, 'yyyy-MM-dd')}
                onChange={e => {
                  if (e.target.value) {
                    onSetDate(new Date(e.target.value + 'T00:00:00'));
                  }
                }}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer w-full sm:w-auto"
              />
            </div>

            {isSimulated && (
              <button
                onClick={onReset}
                className="px-3 py-2 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-amber-500/40 active:scale-95 whitespace-nowrap flex-shrink-0"
                title="Simülasyonu sonlandırıp bugüne dön"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Bugün</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
