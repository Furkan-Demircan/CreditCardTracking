import React, { useState } from 'react';
import type { CalculatedPurchase } from '../types';
import { formatCurrency } from '../services/calculationService';
import { ShoppingBag, Search, Filter, Trash2, Edit3, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface ProductListProps {
  purchases: CalculatedPurchase[];
  onEdit: (purchase: CalculatedPurchase) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  purchases,
  onEdit,
  onDelete,
  onAddNew
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(purchases.map(p => p.category).filter(Boolean)));

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.cardName && p.cardName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && (p.status === 'active' || p.status === 'future')) ||
      (statusFilter === 'completed' && p.status === 'completed');

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">Taksitli Alışverişler ({purchases.length})</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kayıtlı ürünler, taksit ilerleme durumları ve kalan ödemeler
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          + Yeni Taksit Ekle
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2.5 mb-5 sm:mb-6">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Ürün adı, kart veya kategori ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Status Filter Segmented Control */}
          <div className="grid grid-cols-3 bg-slate-900/80 rounded-xl p-1 border border-slate-800 text-center flex-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                statusFilter === 'active' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">Devam Eden ({purchases.filter(p => p.status !== 'completed').length})</span>
              <span className="sm:hidden">Aktif ({purchases.filter(p => p.status !== 'completed').length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                statusFilter === 'completed' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">Bitenler ({purchases.filter(p => p.status === 'completed').length})</span>
              <span className="sm:hidden">Biten ({purchases.filter(p => p.status === 'completed').length})</span>
            </button>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-900/80 rounded-xl px-3 py-2 border border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer w-full text-xs"
              >
                <option value="all" className="bg-slate-900 text-white">Tüm Kategoriler</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Product Cards List */}
      {filteredPurchases.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-xs sm:text-sm font-medium">Arama kriterlerine uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {filteredPurchases.map(purchase => {
            const isCompleted = purchase.status === 'completed';
            return (
              <div
                key={purchase.id}
                className="bg-slate-900/50 hover:bg-slate-900/90 rounded-xl p-3.5 sm:p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Left: Title, Category, Dates */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">{purchase.title}</h3>
                    {purchase.category && (
                      <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                        {purchase.category}
                      </span>
                    )}
                    {purchase.cardName && (
                      <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20 truncate max-w-[140px]">
                        {purchase.cardName}
                      </span>
                    )}
                    <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                      isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                      {isCompleted ? 'Tamamlandı' : `${purchase.remainingInstallmentsCount} Taksit Kaldı`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 flex-shrink-0" />
                      Alış: {purchase.purchaseDate}
                    </span>
                    <span>•</span>
                    <span className="truncate">
                      Ödeme: <strong className="text-slate-300">{purchase.startMonthLabel}</strong> → <strong className="text-slate-300">{purchase.endMonthLabel}</strong>
                    </span>
                    {purchase.notes && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="italic text-slate-500 truncate max-w-[180px] sm:max-w-xs block sm:inline">{purchase.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Middle: Progress Bar & Installment Counter */}
                <div className="w-full md:w-44 lg:w-48 flex-shrink-0 py-1 sm:py-0 border-y md:border-y-0 border-slate-800/60 my-1 md:my-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">{purchase.paidInstallmentsCount} / {purchase.totalInstallments} Taksit</span>
                    <span className="text-indigo-400 font-bold">%{purchase.progressPercentage}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${purchase.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Right: Amounts & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-sm sm:text-base font-extrabold text-white">{formatCurrency(purchase.totalAmount)}</div>
                    <div className="text-[11px] sm:text-xs text-indigo-400 font-semibold">{formatCurrency(purchase.monthlyAmount)} / ay</div>
                  </div>

                  {/* Touch-Friendly Action Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => onEdit(purchase)}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
                      title="Düzenle"
                      aria-label="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${purchase.title}" ürününü silmek istediğinize emin misiniz?`)) {
                          onDelete(purchase.id);
                        }
                      }}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-all active:scale-95"
                      title="Sil"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
