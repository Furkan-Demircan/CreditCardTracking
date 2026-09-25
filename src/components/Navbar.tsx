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
    <header className="border-b border-[#2e2e2e] bg-[#191919] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand / Notion Workspace Header */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-md bg-[#252525] border border-[#333333] flex items-center justify-center text-[#d4d4d4] flex-shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-semibold text-[#f0f0f0] tracking-tight truncate">
              KartTaksit Pro
            </h1>
            <span className="text-[#555555] hidden sm:inline text-xs">/</span>
            <span className="text-xs text-[#8a8a8a] hidden sm:inline truncate">
              Kredi Kartı & Taksit Takip
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop Export */}
          <button
            onClick={onExport}
            className="px-2.5 py-1.5 rounded-md bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-[#9b9b9b] hover:text-[#e6e6e6] transition-colors text-xs font-medium items-center gap-1.5 hidden md:flex"
            title="Verileri Yedekle (JSON İndir)"
          >
            <Download className="w-3.5 h-3.5" />
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
            className="px-2.5 py-1.5 rounded-md bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-[#9b9b9b] hover:text-[#e6e6e6] transition-colors text-xs font-medium items-center gap-1.5 hidden md:flex"
            title="Yedekten Geri Yükle"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>İçe Aktar</span>
          </button>

          {/* Desktop Reset */}
          <button
            onClick={() => {
              if (confirm('Tüm verileri varsayılan örnek verilere sıfırlamak istediğinize emin misiniz?')) {
                onReset();
              }
            }}
            className="p-1.5 rounded-md bg-[#202020] hover:bg-[#282828] border border-[#2e2e2e] text-[#8a8a8a] hover:text-[#e09153] transition-colors hidden md:flex"
            title="Örnek Verilere Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mobile More Options */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md bg-[#202020] border border-[#2e2e2e] text-[#8a8a8a] hover:text-[#e6e6e6] transition-colors"
              title="Daha Fazla Seçenek"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
            </button>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#202020] border border-[#2e2e2e] rounded-lg shadow-xl p-1.5 z-50 flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    onExport();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium text-[#cccccc] hover:bg-[#282828] transition-colors w-full text-left"
                >
                  <Download className="w-3.5 h-3.5 text-[#8a8a8a]" />
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
                  className="flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium text-[#cccccc] hover:bg-[#282828] transition-colors w-full text-left"
                >
                  <Upload className="w-3.5 h-3.5 text-[#8a8a8a]" />
                  <span>Yedekten Geri Yükle</span>
                </button>

                <div className="h-px bg-[#2e2e2e] my-1"></div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (confirm('Tüm verileri varsayılan örnek verilere sıfırlamak istediğinize emin misiniz?')) {
                      onReset();
                    }
                  }}
                  className="flex items-center gap-2 px-2.5 py-2 rounded text-xs font-medium text-[#e09153] hover:bg-[#2c2018] transition-colors w-full text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Örnek Verilere Sıfırla</span>
                </button>
              </div>
            )}
          </div>

          {/* Add Product Button (Notion Blue) */}
          <button
            onClick={onAddNew}
            className="px-3 py-1.5 rounded-md bg-[#2383e2] hover:bg-[#1b73c4] text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Taksit Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
