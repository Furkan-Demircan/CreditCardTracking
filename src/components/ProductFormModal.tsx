import React, { useState, useEffect } from 'react';
import type { Purchase, CreditCard } from '../types';
import { calculateFirstPaymentDate, formatCurrency } from '../services/calculationService';
import { format, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { X, ShoppingCart, Calendar } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchase: Omit<Purchase, 'id' | 'createdAt'> | Purchase) => void;
  editingPurchase: Purchase | null;
  cards: CreditCard[];
}

const CATEGORIES = [
  'Elektronik',
  'Ev & Yaşam',
  'Giyim & Moda',
  'Market & Gıda',
  'Seyahat & Ulaşım',
  'Spor & Sağlık',
  'Eğitim & Kitap',
  'Diğer'
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPurchase,
  cards
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Elektronik');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [totalInstallments, setTotalInstallments] = useState<number>(3);
  const [purchaseDate, setPurchaseDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [cardId, setCardId] = useState<string>(cards[0]?.id || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingPurchase) {
      setTitle(editingPurchase.title);
      setCategory(editingPurchase.category || 'Elektronik');
      setTotalAmount(editingPurchase.totalAmount);
      setTotalInstallments(editingPurchase.totalInstallments || 1);
      setPurchaseDate(editingPurchase.purchaseDate);
      setCardId(editingPurchase.cardId || cards[0]?.id || '');
      setNotes(editingPurchase.notes || '');
    } else {
      setTitle('');
      setCategory('Elektronik');
      setTotalAmount('');
      setTotalInstallments(3);
      setPurchaseDate(format(new Date(), 'yyyy-MM-dd'));
      setCardId(cards[0]?.id || '');
      setNotes('');
    }
  }, [editingPurchase, isOpen, cards]);

  if (!isOpen) return null;

  const numAmount = Number(totalAmount) || 0;
  const numInstallments = Number(totalInstallments) || 1;
  const monthlyAmount = numAmount > 0 ? numAmount / numInstallments : 0;

  const firstPaymentDate = calculateFirstPaymentDate(purchaseDate || format(new Date(), 'yyyy-MM-dd'), 10);
  const lastPaymentDate = addMonths(firstPaymentDate, numInstallments - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || numAmount <= 0) {
      alert('Lütfen geçerli bir ürün adı ve tutar giriniz.');
      return;
    }

    const selectedCard = cards.find(c => c.id === cardId);

    const payload = {
      title: title.trim(),
      category,
      totalAmount: numAmount,
      totalInstallments: numInstallments,
      purchaseDate,
      cardId,
      cardName: selectedCard?.name || 'Kredi Kartı',
      dueDay: 10,
      firstPaymentDate: format(firstPaymentDate, 'yyyy-MM-dd'),
      notes: notes.trim()
    };

    if (editingPurchase) {
      onSave({
        ...editingPurchase,
        ...payload
      });
    } else {
      onSave(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="bg-[#202020] border-t sm:border border-[#2e2e2e] rounded-t-xl sm:rounded-lg w-full sm:max-w-md max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl">
        
        {/* Mobile Drag Pill */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-[#202020] rounded-t-xl flex-shrink-0">
          <div className="w-10 h-1 bg-[#333333] rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#2a2a2a] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#8a8a8a]" />
            <h3 className="text-sm font-semibold text-[#f0f0f0]">
              {editingPurchase ? 'Taksitli Ürünü Düzenle' : 'Yeni Taksitli Ürün Ekle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8a8a8a] hover:text-[#e6e6e6] hover:bg-[#282828] transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto touch-scroll p-4 sm:p-5 space-y-3.5 text-xs">
          {/* Urun Adi */}
          <div>
            <label className="block text-[11px] font-medium text-[#8a8a8a] mb-1">
              Ürün Adı / Açıklama *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Ofis Sandalyesi, Telefon..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md px-3 py-2 text-xs sm:text-sm text-[#e6e6e6] placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-colors"
            />
          </div>

          {/* Tutar ve Taksit Sayisi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#8a8a8a] mb-1">
                Toplam Tutar (₺) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="Örn: 15000"
                value={totalAmount}
                onChange={e => setTotalAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md px-3 py-2 text-xs sm:text-sm text-[#e6e6e6] placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8a8a8a] mb-1">
                Taksit Sayısı *
              </label>
              <select
                value={totalInstallments}
                onChange={e => setTotalInstallments(parseInt(e.target.value))}
                className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md px-3 py-2 text-xs sm:text-sm text-[#e6e6e6] focus:outline-none focus:border-[#444444] transition-colors cursor-pointer"
              >
                <option value={1}>1 Taksit (Peşin)</option>
                <option value={2}>2 Taksit</option>
                <option value={3}>3 Taksit</option>
                <option value={4}>4 Taksit</option>
                <option value={5}>5 Taksit</option>
                <option value={6}>6 Taksit</option>
                <option value={8}>8 Taksit</option>
                <option value={9}>9 Taksit</option>
                <option value={12}>12 Taksit</option>
                <option value={18}>18 Taksit</option>
                <option value={24}>24 Taksit</option>
                <option value={36}>36 Taksit</option>
              </select>
            </div>
          </div>

          {/* Satin Alma Tarihi & Kart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#8a8a8a] mb-1">
                Satın Alma Tarihi *
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md px-3 py-2 text-xs sm:text-sm text-[#e6e6e6] focus:outline-none focus:border-[#444444] transition-colors cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8a8a8a] mb-1">
                Kredi Kartı
              </label>
              <select
                value={cardId}
                onChange={e => setCardId(e.target.value)}
                className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md px-3 py-2 text-xs sm:text-sm text-[#e6e6e6] focus:outline-none focus:border-[#444444] transition-colors cursor-pointer"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kategori Seçimi */}
          <div>
            <label className="block text-[11px] font-medium text-[#8a8a8a] mb-1">
              Kategori
            </label>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    category === cat
                      ? 'bg-[#2b2b2b] text-[#ffffff] border border-[#444444]'
                      : 'bg-[#191919] text-[#8a8a8a] border border-[#2a2a2a] hover:bg-[#252525] hover:text-[#cccccc]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Otomatik Taksit ve Vade Kutusu (Notion Callout) */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-md p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#cccccc]">
              <Calendar className="w-3.5 h-3.5 text-[#8a8a8a]" />
              <span>Ödeme Planı Özeti</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[#8a8a8a]">Aylık Taksit:</span>
                <div className="text-sm font-semibold text-[#f0f0f0]">{formatCurrency(monthlyAmount)} / ay</div>
              </div>
              <div>
                <span className="text-[#8a8a8a]">İlk Ödeme:</span>
                <div className="text-xs font-medium text-[#4dab83]">
                  {format(firstPaymentDate, 'd MMMM yyyy', { locale: tr })}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#8a8a8a] pt-1.5 border-t border-[#262626] flex justify-between">
              <span>Son Vade: <strong className="text-[#cccccc] font-normal">{format(lastPaymentDate, 'd MMMM yyyy', { locale: tr })}</strong></span>
              <span>Her ayın 10'unda</span>
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-[11px] font-medium text-[#8a8a8a] mb-1">
              Notlar (Opsiyonel)
            </label>
            <textarea
              rows={2}
              placeholder="Ek açıklama..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md px-3 py-1.5 text-xs text-[#e6e6e6] placeholder-[#666666] focus:outline-none focus:border-[#444444] transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#2a2a2a] flex items-center justify-end gap-2 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-[#191919] hover:bg-[#252525] border border-[#2e2e2e] text-[#8a8a8a] hover:text-[#e6e6e6] text-xs font-normal transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-[#2383e2] hover:bg-[#1b73c4] text-white text-xs font-medium transition-colors"
            >
              {editingPurchase ? 'Değişiklikleri Kaydet' : 'Taksitli Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
