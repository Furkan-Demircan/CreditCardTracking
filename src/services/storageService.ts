import type { Purchase, CreditCard } from '../types';

const STORAGE_KEYS = {
  PURCHASES: 'cc_tracker_purchases_v1',
  CARDS: 'cc_tracker_cards_v1',
  SIMULATION_DATE: 'cc_tracker_sim_date_v1'
};

export const INITIAL_CARDS: CreditCard[] = [
  { id: 'card-1', name: 'Garanti Bonus', bankName: 'Garanti BBVA', color: '#10b981', dueDay: 10 },
  { id: 'card-2', name: 'Yapı Kredi World', bankName: 'Yapı Kredi', color: '#6366f1', dueDay: 10 },
  { id: 'card-3', name: 'İş Bankası Maximum', bankName: 'İş Bankası', color: '#3b82f6', dueDay: 10 },
  { id: 'card-4', name: 'Akbank Axess', bankName: 'Akbank', color: '#ef4444', dueDay: 10 },
  { id: 'card-5', name: 'QNB CardFinans', bankName: 'QNB Finansbank', color: '#8b5cf6', dueDay: 10 }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'p-1',
    title: 'MacBook Pro M3 Max',
    category: 'Elektronik',
    totalAmount: 64000,
    totalInstallments: 6,
    purchaseDate: '2026-06-15',
    cardId: 'card-2',
    cardName: 'Yapı Kredi World',
    dueDay: 10,
    firstPaymentDate: '2026-07-10',
    notes: 'İş ve yazılım geliştirme için',
    createdAt: '2026-06-15T10:00:00Z'
  },
  {
    id: 'p-2',
    title: 'iPhone 16 Pro Max',
    category: 'Elektronik',
    totalAmount: 72000,
    totalInstallments: 12,
    purchaseDate: '2026-07-02',
    cardId: 'card-1',
    cardName: 'Garanti Bonus',
    dueDay: 10,
    firstPaymentDate: '2026-08-10',
    notes: 'Kişisel telefon yenileme',
    createdAt: '2026-07-02T14:30:00Z'
  },
  {
    id: 'p-3',
    title: 'Dyson V15 Süpürge',
    category: 'Ev & Yaşam',
    totalAmount: 24000,
    totalInstallments: 4,
    purchaseDate: '2026-08-10',
    cardId: 'card-3',
    cardName: 'İş Bankası Maximum',
    dueDay: 10,
    firstPaymentDate: '2026-09-10',
    notes: 'Ev temizliği için',
    createdAt: '2026-08-10T18:00:00Z'
  },
  {
    id: 'p-4',
    title: 'Yıllık Spor Salonu Üyeliği',
    category: 'Spor & Sağlık',
    totalAmount: 18000,
    totalInstallments: 9,
    purchaseDate: '2026-08-20',
    cardId: 'card-4',
    cardName: 'Akbank Axess',
    dueDay: 10,
    firstPaymentDate: '2026-09-10',
    notes: 'Yıllık fitness aboneliği',
    createdAt: '2026-08-20T12:00:00Z'
  }
];

export const storageService = {
  getPurchases(): Purchase[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      if (!data) {
        this.savePurchases(INITIAL_PURCHASES);
        return INITIAL_PURCHASES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load purchases', e);
      return INITIAL_PURCHASES;
    }
  },

  savePurchases(purchases: Purchase[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    } catch (e) {
      console.error('Failed to save purchases', e);
    }
  },

  addPurchase(purchase: Omit<Purchase, 'id' | 'createdAt'>): Purchase {
    const purchases = this.getPurchases();
    const newPurchase: Purchase = {
      ...purchase,
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString()
    };
    purchases.unshift(newPurchase);
    this.savePurchases(purchases);
    return newPurchase;
  },

  updatePurchase(updated: Purchase): void {
    const purchases = this.getPurchases().map(p => (p.id === updated.id ? updated : p));
    this.savePurchases(purchases);
  },

  deletePurchase(id: string): void {
    const purchases = this.getPurchases().filter(p => p.id !== id);
    this.savePurchases(purchases);
  },

  getCards(): CreditCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (!data) {
        this.saveCards(INITIAL_CARDS);
        return INITIAL_CARDS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_CARDS;
    }
  },

  saveCards(cards: CreditCard[]): void {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  },

  getSimulationDate(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SIMULATION_DATE);
  },

  saveSimulationDate(dateStr: string | null): void {
    if (dateStr) {
      localStorage.setItem(STORAGE_KEYS.SIMULATION_DATE, dateStr);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SIMULATION_DATE);
    }
  },

  exportJSON(): string {
    const data = {
      purchases: this.getPurchases(),
      cards: this.getCards(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  },

  importJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.purchases)) {
        this.savePurchases(data.purchases);
      }
      if (Array.isArray(data.cards)) {
        this.saveCards(data.cards);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetToInitial(): void {
    this.savePurchases(INITIAL_PURCHASES);
    this.saveCards(INITIAL_CARDS);
    this.saveSimulationDate(null);
  }
};
