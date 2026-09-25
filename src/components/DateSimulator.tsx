import React from 'react';
import { format, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Clock, RotateCcw, Calendar, ArrowRight } from 'lucide-react';

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
    <div className={`rounded-md p-3.5 sm:p-4 mb-6 transition-colors border ${
      isSimulated
        ? 'bg-[#22201b] border-[#4d3a1f]'
        : 'bg-[#202020] border-[#2e2e2e]'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2 rounded-md flex-shrink-0 ${
            isSimulated ? 'bg-[#2e2417] text-[#caa137]' : 'bg-[#252525] text-[#8a8a8a]'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#f0f0f0]">Tarih Simülatörü</span>
              {isSimulated ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2b2416] text-[#caa137] border border-[#4d3a1f]">
                  Simülasyon Aktif
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1c3829] text-[#4dab83]">
                  Gerçek Zamanlı
                </span>
              )}
            </div>
            <p className="text-xs text-[#8a8a8a] mt-0.5">
              Görüntülenen tarih: <strong className="text-[#e6e6e6] font-medium">{format(simulatedDate, 'd MMMM yyyy', { locale: tr })}</strong>. Taksitlerin ileriki aylarda nasıl düşeceğini test edin.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
          {/* Quick Buttons */}
          <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center">
            <button
              onClick={() => onSetDate(addMonths(simulatedDate, 1))}
              className="px-2.5 py-1 rounded-md bg-[#191919] hover:bg-[#282828] border border-[#2e2e2e] text-[#cccccc] text-xs font-normal transition-colors flex items-center justify-center gap-1"
            >
              <span>+1 Ay</span>
              <ArrowRight className="w-3 h-3 text-[#666666]" />
            </button>

            <button
              onClick={() => onSetDate(addMonths(simulatedDate, 3))}
              className="px-2.5 py-1 rounded-md bg-[#191919] hover:bg-[#282828] border border-[#2e2e2e] text-[#cccccc] text-xs font-normal transition-colors text-center"
            >
              +3 Ay
            </button>

            <button
              onClick={() => onSetDate(addMonths(simulatedDate, 6))}
              className="px-2.5 py-1 rounded-md bg-[#191919] hover:bg-[#282828] border border-[#2e2e2e] text-[#cccccc] text-xs font-normal transition-colors text-center"
            >
              +6 Ay
            </button>
          </div>

          {/* Date Picker & Reset */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 sm:flex-initial flex items-center bg-[#191919] rounded-md px-2.5 py-1 border border-[#2e2e2e]">
              <Calendar className="w-3.5 h-3.5 text-[#666666] mr-1.5 flex-shrink-0" />
              <input
                type="date"
                value={format(simulatedDate, 'yyyy-MM-dd')}
                onChange={e => {
                  if (e.target.value) {
                    onSetDate(new Date(e.target.value + 'T00:00:00'));
                  }
                }}
                className="bg-transparent text-xs text-[#cccccc] focus:outline-none cursor-pointer w-full sm:w-auto"
              />
            </div>

            {isSimulated && (
              <button
                onClick={onReset}
                className="px-2.5 py-1 rounded-md bg-[#2b2416] hover:bg-[#382d1c] text-[#caa137] text-xs font-medium transition-colors flex items-center gap-1 border border-[#4d3a1f] whitespace-nowrap"
                title="Bugüne dön"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Bugün</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
