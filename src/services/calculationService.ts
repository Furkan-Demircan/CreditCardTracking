import type { Purchase, CalculatedPurchase, InstallmentDetail, MonthlySummary, DashboardStats } from '../types';
import { format, addMonths, parseISO, isBefore, isSameMonth, isAfter, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';

export function calculateFirstPaymentDate(purchaseDateStr: string, dueDay: number = 10): Date {
  const purchaseDate = parseISO(purchaseDateStr);
  const nextMonth = addMonths(purchaseDate, 1);
  return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), dueDay, 0, 0, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function calculatePurchase(purchase: Purchase, currentDate: Date = new Date()): CalculatedPurchase {
  const dueDay = purchase.dueDay || 10;
  const firstPayment = calculateFirstPaymentDate(purchase.purchaseDate, dueDay);
  const totalInstallments = Math.max(1, purchase.totalInstallments || 1);
  const monthlyAmount = purchase.totalAmount / totalInstallments;
  
  const today = startOfDay(currentDate);
  const installments: InstallmentDetail[] = [];
  let paidCount = 0;
  
  for (let i = 0; i < totalInstallments; i++) {
    const installmentDate = addMonths(firstPayment, i);
    const dueDateStr = format(installmentDate, 'yyyy-MM-dd');
    const monthKey = format(installmentDate, 'yyyy-MM');
    const monthLabel = format(installmentDate, 'MMMM yyyy', { locale: tr });
    
    const isPaid = !isAfter(startOfDay(installmentDate), today);
    if (isPaid) paidCount++;
    
    installments.push({
      installmentNumber: i + 1,
      totalInstallments,
      dueDate: dueDateStr,
      monthKey,
      monthLabel,
      amount: monthlyAmount,
      isPaid
    });
  }
  
  const paidAmount = paidCount * monthlyAmount;
  const remainingInstallmentsCount = totalInstallments - paidCount;
  const remainingAmount = remainingInstallmentsCount * monthlyAmount;
  const progressPercentage = Math.round((paidCount / totalInstallments) * 100);
  
  const firstInst = installments[0];
  const lastInst = installments[installments.length - 1];
  
  let status: 'active' | 'completed' | 'future' = 'active';
  if (paidCount === totalInstallments) {
    status = 'completed';
  } else if (paidCount === 0 && isBefore(today, parseISO(firstInst.dueDate))) {
    status = 'future';
  }

  return {
    ...purchase,
    monthlyAmount,
    installments,
    paidInstallmentsCount: paidCount,
    remainingInstallmentsCount,
    paidAmount,
    remainingAmount,
    startMonthKey: firstInst.monthKey,
    endMonthKey: lastInst.monthKey,
    startMonthLabel: firstInst.monthLabel,
    endMonthLabel: lastInst.monthLabel,
    status,
    progressPercentage
  };
}

export function calculateAllPurchases(purchases: Purchase[], currentDate: Date = new Date()): CalculatedPurchase[] {
  return purchases.map(p => calculatePurchase(p, currentDate));
}

export function generateMonthlySummaries(purchases: Purchase[], currentDate: Date = new Date(), monthsAhead: number = 24): MonthlySummary[] {
  const calculated = calculateAllPurchases(purchases, currentDate);
  const today = startOfDay(currentDate);
  const monthMap = new Map<string, MonthlySummary>();

  const startWindow = addMonths(today, -3);
  const totalMonths = monthsAhead + 6;

  for (let m = 0; m < totalMonths; m++) {
    const targetMonthDate = addMonths(startWindow, m);
    const mKey = format(targetMonthDate, 'yyyy-MM');
    const mLabel = format(targetMonthDate, 'MMMM yyyy', { locale: tr });
    const shortLabel = format(targetMonthDate, 'MMM yy', { locale: tr });
    const dueDate = format(new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth(), 10), 'yyyy-MM-dd');
    
    const isPast = isBefore(targetMonthDate, new Date(today.getFullYear(), today.getMonth(), 1));
    const isCurrent = isSameMonth(targetMonthDate, today);
    const isFuture = isAfter(targetMonthDate, today) && !isCurrent;

    monthMap.set(mKey, {
      monthKey: mKey,
      monthLabel: mLabel,
      shortLabel,
      year: targetMonthDate.getFullYear(),
      month: targetMonthDate.getMonth(),
      dueDate,
      totalAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      isPast,
      isCurrent,
      isFuture,
      items: []
    });
  }

  calculated.forEach(p => {
    p.installments.forEach(inst => {
      let summary = monthMap.get(inst.monthKey);
      if (!summary) {
        const instDate = parseISO(inst.dueDate);
        const mKey = inst.monthKey;
        const mLabel = inst.monthLabel;
        const shortLabel = format(instDate, 'MMM yy', { locale: tr });
        const isPast = isBefore(instDate, new Date(today.getFullYear(), today.getMonth(), 1));
        const isCurrent = isSameMonth(instDate, today);
        const isFuture = isAfter(instDate, today) && !isCurrent;
        
        summary = {
          monthKey: mKey,
          monthLabel: mLabel,
          shortLabel,
          year: instDate.getFullYear(),
          month: instDate.getMonth(),
          dueDate: inst.dueDate,
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          isPast,
          isCurrent,
          isFuture,
          items: []
        };
        monthMap.set(mKey, summary);
      }

      summary.totalAmount += inst.amount;
      if (inst.isPaid) {
        summary.paidAmount += inst.amount;
      } else {
        summary.remainingAmount += inst.amount;
      }

      summary.items.push({
        purchaseId: p.id,
        purchaseTitle: p.title,
        installmentNumber: inst.installmentNumber,
        totalInstallments: inst.totalInstallments,
        amount: inst.amount,
        dueDate: inst.dueDate,
        cardName: p.cardName,
        category: p.category,
        isPaid: inst.isPaid
      });
    });
  });

  return Array.from(monthMap.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function calculateDashboardStats(purchases: Purchase[], currentDate: Date = new Date()): DashboardStats {
  const calculated = calculateAllPurchases(purchases, currentDate);
  const summaries = generateMonthlySummaries(purchases, currentDate);
  
  const today = startOfDay(currentDate);
  const thisMonthKey = format(today, 'yyyy-MM');
  const nextMonthKey = format(addMonths(today, 1), 'yyyy-MM');

  const thisMonth = summaries.find(s => s.monthKey === thisMonthKey);
  const nextMonth = summaries.find(s => s.monthKey === nextMonthKey);

  const totalRemainingDebt = calculated.reduce((sum, p) => sum + p.remainingAmount, 0);
  const activePurchases = calculated.filter(p => p.status === 'active' || p.status === 'future');
  const completedPurchases = calculated.filter(p => p.status === 'completed');
  const activeInstallmentCount = calculated.reduce((sum, p) => sum + p.remainingInstallmentsCount, 0);

  return {
    thisMonthTotal: thisMonth?.totalAmount || 0,
    thisMonthPaid: thisMonth?.paidAmount || 0,
    thisMonthRemaining: thisMonth?.remainingAmount || 0,
    nextMonthTotal: nextMonth?.totalAmount || 0,
    totalRemainingDebt,
    totalActivePurchases: activePurchases.length,
    activeInstallmentCount,
    completedPurchasesCount: completedPurchases.length
  };
}
