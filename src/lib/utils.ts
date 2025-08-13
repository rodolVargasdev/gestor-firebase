import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysDifference(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getHoursDifference(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
}

// Validation utilities
export function validateDUI(dui: string): boolean {
  const duiRegex = /^\d{8}-\d$/;
  return duiRegex.test(dui);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ID generation
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Text utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Status utilities
export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    active: 'Activo',
    inactive: 'Inactivo',
    expired: 'Expirado',
  };
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-blue-100 text-blue-800',
    inactive: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

// Role utilities
export function getRoleLabel(role: string): string {
  const roleMap: Record<string, string> = {
    super_admin: 'Super Administrador',
    admin: 'Administrador',
    manager: 'Gerente',
    viewer: 'Visualizador',
  };
  return roleMap[role] || role;
}

// License utilities
export function getLicenseCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    software: 'Software',
    hardware: 'Hardware',
    service: 'Servicio',
    training: 'Capacitación',
  };
  return categoryMap[category] || category;
}

export function getUnitControlLabel(unit: string): string {
  const unitMap: Record<string, string> = {
    hours: 'Horas',
    days: 'Días',
    uses: 'Usos',
  };
  return unitMap[unit] || unit;
}

export function getPeriodControlLabel(period: string): string {
  const periodMap: Record<string, string> = {
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    annual: 'Anual',
    none: 'Sin período',
  };
  return periodMap[period] || period;
}
