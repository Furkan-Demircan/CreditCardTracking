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
    <div className="notion-block p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#8a8a8a]" />
            <h2 className="text-sm font-semibold text-[#f0f0f0]">Taksitli Alışverişler ({purchases.length})</h2>
          </div>
          <p className="text-xs text-[#8a8a8a] mt-0.5">
            Kayıtlı ürünler ve taksit ilerleme durumları
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-[#2383e2] hover:bg-[#1b73c4] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <span>+ Yeni Taksit Ekle</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2 mb-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            placeholder="Ürün adı, kart veya kategori ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#e6e6e6] placeholder-[#666666] focus:outline-none focus:border-[#404040] transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Status Tabs */}
          <div className="grid grid-cols-3 bg-[#191919] rounded-md p-0.5 border border-[#2e2e2e] text-center flex-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`py-1 px-2 rounded text-xs font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-[#2b2b2b] text-[#ffffff]' : 'text-[#8a8a8a] hover:text-[#e6e6e6]'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`py-1 px-2 rounded text-xs font-medium transition-colors ${
                statusFilter === 'active' ? 'bg-[#2b2b2b] text-[#ffffff]' : 'text-[#8a8a8a] hover:text-[#e6e6e6]'
              }`}
            >
              <span className="hidden sm:inline">Devam Eden ({purchases.filter(p => p.status !== 'completed').length})</span>
              <span className="sm:hidden">Aktif ({purchases.filter(p => p.status !== 'completed').length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`py-1 px-2 rounded text-xs font-medium transition-colors ${
                statusFilter === 'completed' ? 'bg-[#2b2b2b] text-[#ffffff]' : 'text-[#8a8a8a] hover:text-[#e6e6e6]'
              }`}
            >
              <span className="hidden sm:inline">Bitenler ({purchases.filter(p => p.status === 'completed').length})</span>
              <span className="sm:hidden">Biten ({purchases.filter(p => p.status === 'completed').length})</span>
            </button>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#191919] rounded-md px-2.5 py-1.5 border border-[#2e2e2e] text-xs">
              <Filter className="w-3 h-3 text-[#666666] flex-shrink-0" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-transparent text-[#cccccc] focus:outline-none cursor-pointer w-full text-xs"
              >
                <option value="all" className="bg-[#202020] text-[#e6e6e6]">Tüm Kategoriler</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-[#202020] text-[#e6e6e6]">{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Product List */}
      {filteredPurchases.length === 0 ? (
        <div className="text-center py-8 text-[#666666]">
          <ShoppingBag className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
          <p className="text-xs">Arama kriterlerine uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPurchases.map(purchase => {
            const isCompleted = purchase.status === 'completed';
            return (
              <div
                key={purchase.id}
                className="bg-[#202020] hover:bg-[#242424] rounded-md p-3 border border-[#2a2a2a] hover:border-[#383838] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-semibold text-[#f0f0f0] truncate max-w-[200px] sm:max-w-xs">{purchase.title}</h3>
                    {purchase.category && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2a2a2a] text-[#8a8a8a]">
                        {purchase.category}
                      </span>
                    )}
                    {purchase.cardName && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e2a38] text-[#7da8cc] border border-[#293d52] truncate max-w-[130px]">
                        {purchase.cardName}
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded flex items-center gap-1 ${
                      isCompleted ? 'bg-[#1c3829] text-[#4dab83]' : 'bg-[#2b2416] text-[#caa137]'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                      {isCompleted ? 'Tamamlandı' : `${purchase.remainingInstallmentsCount} Taksit Kaldı`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-[#8a8a8a] mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#666666] flex-shrink-0" />
                      Alış: {purchase.purchaseDate}
                    </span>
                    <span>•</span>
                    <span className="truncate">
                      Ödeme: <span className="text-[#cccccc]">{purchase.startMonthLabel}</span> → <span className="text-[#cccccc]">{purchase.endMonthLabel}</span>
                    </span>
                    {purchase.notes && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="italic text-[#707070] truncate max-w-[180px] sm:max-w-xs block sm:inline">{purchase.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Middle: Progress Bar */}
                <div className="w-full md:w-36 lg:w-44 flex-shrink-0 py-1 sm:py-0 border-y md:border-y-0 border-[#2a2a2a]">
                  <div className="flex justify-between text-[11px] mb-1 text-[#8a8a8a]">
                    <span>{purchase.paidInstallmentsCount} / {purchase.totalInstallments}</span>
                    <span className="font-medium text-[#cccccc]">%{purchase.progressPercentage}</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-[#4dab83]' : 'bg-[#2383e2]'
                      }`}
                      style={{ width: `${purchase.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Right: Amounts & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-semibold text-[#f0f0f0]">{formatCurrency(purchase.totalAmount)}</div>
                    <div className="text-[11px] text-[#8a8a8a]">{formatCurrency(purchase.monthlyAmount)} / ay</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(purchase)}
                      className="p-1.5 rounded hover:bg-[#2b2b2b] text-[#8a8a8a] hover:text-[#e6e6e6] transition-colors"
                      title="Düzenle"
                      aria-label="Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${purchase.title}" ürününü silmek istediğinize emin misiniz?`)) {
                          onDelete(purchase.id);
                        }
                      }}
                      className="p-1.5 rounded hover:bg-[#341d22] text-[#8a8a8a] hover:text-[#eb5757] transition-colors"
                      title="Sil"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
