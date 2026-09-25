import React, { useState, useEffect } from 'react';
import type { Purchase, CreditCard } from '../types';
import { calculateFirstPaymentDate, formatCurrency } from '../services/calculationService';
import { format, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { X, Sparkles, ShoppingCart } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Mobile Drag Pill Indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-slate-900 rounded-t-3xl flex-shrink-0">
          <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {editingPurchase ? 'Taksitli Ürünü Düzenle' : 'Yeni Taksitli Ürün Ekle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with Smooth Touch Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto touch-scroll p-4 sm:p-6 space-y-4">
          {/* Urun Adi */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Ürün Adı / Açıklama *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: iPhone 16 Pro, Ofis Sandalyesi..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Tutar ve Taksit Sayisi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Toplam Tutar (₺) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="Örn: 24000"
                value={totalAmount}
                onChange={e => setTotalAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Taksit Sayısı *
              </label>
              <select
                value={totalInstallments}
                onChange={e => setTotalInstallments(parseInt(e.target.value))}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Satın Alma Tarihi *
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Kredi Kartı
              </label>
              <select
                value={cardId}
                onChange={e => setCardId(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-3 sm:py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                {cards.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kategori Seçimi */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Kategori
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 sm:py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Canli Taksit Bilgisi & Projeksiyon Ozeti */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Otomatik Taksit ve Vade Planı</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400">Aylık Taksit:</span>
                <div className="text-sm sm:text-base font-extrabold text-white">{formatCurrency(monthlyAmount)} / ay</div>
              </div>
              <div>
                <span className="text-slate-400">İlk Ödeme Vadesi:</span>
                <div className="text-xs sm:text-sm font-bold text-emerald-400">
                  {format(firstPaymentDate, 'd MMMM yyyy', { locale: tr })}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80 flex flex-wrap justify-between gap-1">
              <span>Bitiş Vadesi: <strong className="text-slate-300">{format(lastPaymentDate, 'd MMMM yyyy', { locale: tr })}</strong></span>
              <span className="text-indigo-300 font-medium">Her ayın 10'unda</span>
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Notlar (Opsiyonel)
            </label>
            <textarea
              rows={2}
              placeholder="Ek açıklama veya taksit detayları..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5 sm:gap-3 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-3 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-xs font-semibold transition-all active:scale-95 text-center"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-5 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 text-center"
            >
              {editingPurchase ? 'Değişiklikleri Kaydet' : 'Taksitli Ürünü Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
