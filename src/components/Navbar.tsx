import React, { useRef, useState, useEffect } from 'react';
import { CreditCard, Plus, Download, Upload, RotateCcw, MoreVertical, X } from 'lucide-react';

interface NavbarProps {
  onAddNew: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddNew,
  onExport,
  onImport,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      setIsMobileMenuOpen(false);
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 flex-shrink-0">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-none truncate">
              KartTaksit Pro
            </h1>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden xs:inline sm:inline truncate">
              Kredi Kartı & Taksit Takip
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Desktop Export */}
          <button
            onClick={onExport}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-medium items-center gap-1.5 hidden md:flex active:scale-95"
            title="Verileri Yedekle (JSON İndir)"
          >
            <Download className="w-4 h-4" />
            <span>Yedekle</span>
          </button>

          {/* Desktop Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs font-medium items-center gap-1.5 hidden md:flex active:scale-95"
            title="Yedekten Geri Yükle"
          >
            <Upload className="w-4 h-4" />
            <span>İçe Aktar</span>
          </button>

          {/* Desktop Reset */}
          <button
            onClick={() => {
              if (confirm('Tüm verileri varsayılan örnek verilere sıfırlamak istediğinize emin misiniz?')) {
                onReset();
              }
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 transition-all text-xs hidden md:flex active:scale-95"
            title="Örnek Verilere Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mobile More Options Dropdown Trigger */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all active:scale-95"
              title="Daha Fazla Seçenek"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-indigo-400" /> : <MoreVertical className="w-4 h-4" />}
            </button>

            {/* Mobile Dropdown Popup */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    onExport();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors w-full text-left"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Verileri Yedekle (JSON)</span>
                </button>

                <input
                  type="file"
                  ref={mobileFileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => mobileFileInputRef.current?.click()}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors w-full text-left"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Yedekten Geri Yükle</span>
                </button>

                <div className="h-px bg-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (confirm('Tüm verileri varsayılan örnek verilere sıfırlamak istediğinize emin misiniz?')) {
                      onReset();
                    }
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-amber-300 hover:bg-amber-500/10 transition-colors w-full text-left"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Örnek Verilere Sıfırla</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Product Button */}
          <button
            onClick={onAddNew}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Taksit Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
