import React, { useState, useEffect } from 'react';
import type { Purchase, CalculatedPurchase, CreditCard } from './types';
import { storageService } from './services/storageService';
import {
  calculateAllPurchases,
  generateMonthlySummaries,
  calculateDashboardStats
} from './services/calculationService';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { MonthlyDebtChart } from './components/MonthlyDebtChart';
import { ProductTimelineGantt } from './components/ProductTimelineGantt';
import { MonthlyBreakdown } from './components/MonthlyBreakdown';
import { ProductList } from './components/ProductList';
import { ProductFormModal } from './components/ProductFormModal';
import { DateSimulator } from './components/DateSimulator';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Plus } from 'lucide-react';

export const App: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [simulatedDate, setSimulatedDate] = useState<Date>(new Date());
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  
  // Modals & Selections
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedPurchases = storageService.getPurchases();
    const loadedCards = storageService.getCards();
    setPurchases(loadedPurchases);
    setCards(loadedCards);

    const savedSimDate = storageService.getSimulationDate();
    if (savedSimDate) {
      setSimulatedDate(parseISO(savedSimDate));
      setIsSimulated(true);
    }
  }, []);

  // Recalculate derived data based on purchases & simulated date
  const calculatedPurchases = calculateAllPurchases(purchases, simulatedDate);
  const monthlySummaries = generateMonthlySummaries(purchases, simulatedDate, 24);
  const stats = calculateDashboardStats(purchases, simulatedDate);

  // Set default selected month if null
  useEffect(() => {
    if (!selectedMonthKey && monthlySummaries.length > 0) {
      const currentMonth = monthlySummaries.find(m => m.isCurrent);
      if (currentMonth) {
        setSelectedMonthKey(currentMonth.monthKey);
      } else {
        setSelectedMonthKey(monthlySummaries[0].monthKey);
      }
    }
  }, [monthlySummaries, selectedMonthKey]);

  // Handlers
  const handleSavePurchase = (purchaseData: Omit<Purchase, 'id' | 'createdAt'> | Purchase) => {
    if ('id' in purchaseData) {
      storageService.updatePurchase(purchaseData as Purchase);
    } else {
      storageService.addPurchase(purchaseData);
    }
    setPurchases(storageService.getPurchases());
    setEditingPurchase(null);
  };

  const handleDeletePurchase = (id: string) => {
    storageService.deletePurchase(id);
    setPurchases(storageService.getPurchases());
  };

  const handleEditPurchase = (purchase: CalculatedPurchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPurchase(null);
    setIsModalOpen(true);
  };

  const handleSetSimulatedDate = (newDate: Date) => {
    setSimulatedDate(newDate);
    setIsSimulated(true);
    storageService.saveSimulationDate(newDate.toISOString());
  };

  const handleResetSimulatedDate = () => {
    const today = new Date();
    setSimulatedDate(today);
    setIsSimulated(false);
    storageService.saveSimulationDate(null);
  };

  const handleExport = () => {
    const json = storageService.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kredi-karti-taksitleri-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      if (content && storageService.importJSON(content)) {
        setPurchases(storageService.getPurchases());
        setCards(storageService.getCards());
        alert('Veriler başarıyla içe aktarıldı!');
      } else {
        alert('Geçersiz dosya formatı.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToInitial = () => {
    storageService.resetToInitial();
    setPurchases(storageService.getPurchases());
    setCards(storageService.getCards());
    handleResetSimulatedDate();
  };

  const handleSelectProduct = (purchaseId: string) => {
    const p = purchases.find(item => item.id === purchaseId);
    if (p) {
      handleEditPurchase(calculateAllPurchases([p], simulatedDate)[0]);
    }
  };

  const currentMonthLabel = format(simulatedDate, 'MMMM yyyy', { locale: tr });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        onAddNew={handleAddNew}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleResetToInitial}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        {/* Date Simulator Banner */}
        <DateSimulator
          simulatedDate={simulatedDate}
          onSetDate={handleSetSimulatedDate}
          onReset={handleResetSimulatedDate}
          isSimulated={isSimulated}
        />

        {/* KPI Stats Cards */}
        <StatsOverview stats={stats} currentDateLabel={currentMonthLabel} />

        {/* 1. Monthly Debt Chart */}
        <MonthlyDebtChart
          summaries={monthlySummaries}
          selectedMonthKey={selectedMonthKey}
          onSelectMonth={setSelectedMonthKey}
        />

        {/* 2. Product Timeline Gantt Chart */}
        <ProductTimelineGantt
          purchases={calculatedPurchases}
          summaries={monthlySummaries}
          currentDate={simulatedDate}
          onSelectProduct={handleSelectProduct}
        />

        {/* 3. Monthly Breakdown List */}
        <MonthlyBreakdown
          summaries={monthlySummaries}
          selectedMonthKey={selectedMonthKey}
          onSelectMonth={setSelectedMonthKey}
          onSelectProduct={handleSelectProduct}
        />

        {/* 4. Product Management Table & List */}
        <ProductList
          purchases={calculatedPurchases}
          onEdit={handleEditPurchase}
          onDelete={handleDeletePurchase}
          onAddNew={handleAddNew}
        />
      </main>

      {/* Mobile Floating Action Button (FAB) for Easy 1-Thumb Product Creation */}
      <button
        onClick={handleAddNew}
        className="sm:hidden fixed bottom-5 right-4 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/20"
        aria-label="Taksit Ekle"
        title="Yeni Taksit Ekle"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Product Add / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPurchase(null);
        }}
        onSave={handleSavePurchase}
        editingPurchase={editingPurchase}
        cards={cards}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 pb-safe">
        <p>KartTaksit Pro — Kredi Kartı Taksit ve Aylık Borç Takip Uygulaması</p>
      </footer>
    </div>
  );
};

export default App;
