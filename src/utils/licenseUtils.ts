// Utilidades para el manejo de licencias y períodos

export interface LicensePeriod {
  startDate: Date;
  endDate: Date;
  year: number;
  month?: number;
  quarter?: number;
}

export interface LicenseBalance {
  totalAvailable: number;
  used: number;
  available: number;
  carriedOver: number; // Licencias del período anterior
  expiresAt?: Date; // Fecha de vencimiento para licencias transferidas
  isExpired: boolean;
}

export interface LicenseRequest {
  startDate: Date;
  endDate: Date;
  licenseTypeId: string;
  employeeId: string;
  days: number;
}

/**
 * Calcula el período actual basado en el tipo de control
 */
export const calculateCurrentPeriod = (
  periodControl: 'annual' | 'monthly' | 'quarterly' | 'none',
  referenceDate: Date = new Date()
): LicensePeriod => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  
  switch (periodControl) {
    case 'annual':
      return {
        startDate: new Date(year, 0, 1), // 1 de enero
        endDate: new Date(year, 11, 31), // 31 de diciembre
        year
      };
    
    case 'monthly':
      return {
        startDate: new Date(year, month, 1), // Primer día del mes
        endDate: new Date(year, month + 1, 0), // Último día del mes
        year,
        month: month + 1
      };
    
    case 'quarterly':
      const quarter = Math.floor(month / 3) + 1;
      const quarterStartMonth = (quarter - 1) * 3;
      return {
        startDate: new Date(year, quarterStartMonth, 1),
        endDate: new Date(year, quarterStartMonth + 3, 0),
        year,
        quarter
      };
    
    case 'none':
      return {
        startDate: new Date(1900, 0, 1), // Fecha muy antigua
        endDate: new Date(2100, 11, 31), // Fecha muy futura
        year: 0
      };
  }
};

/**
 * Calcula el período anterior
 */
export const calculatePreviousPeriod = (
  periodControl: 'annual' | 'monthly' | 'quarterly' | 'none',
  referenceDate: Date = new Date()
): LicensePeriod => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  
  switch (periodControl) {
    case 'annual':
      return {
        startDate: new Date(year - 1, 0, 1),
        endDate: new Date(year - 1, 11, 31),
        year: year - 1
      };
    
    case 'monthly':
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      return {
        startDate: new Date(prevYear, prevMonth, 1),
        endDate: new Date(prevYear, prevMonth + 1, 0),
        year: prevYear,
        month: prevMonth + 1
      };
    
    case 'quarterly':
      const currentQuarter = Math.floor(month / 3) + 1;
      const prevQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
      const prevQuarterYear = currentQuarter === 1 ? year - 1 : year;
      const prevQuarterStartMonth = (prevQuarter - 1) * 3;
      return {
        startDate: new Date(prevQuarterYear, prevQuarterStartMonth, 1),
        endDate: new Date(prevQuarterYear, prevQuarterStartMonth + 3, 0),
        year: prevQuarterYear,
        quarter: prevQuarter
      };
    
    case 'none':
      return {
        startDate: new Date(1900, 0, 1),
        endDate: new Date(2100, 11, 31),
        year: 0
      };
  }
};

/**
 * Verifica si una licencia de período anterior aún es válida
 */
export const isPreviousPeriodLicenseValid = (
  periodControl: 'annual' | 'monthly' | 'quarterly' | 'none',
  previousPeriodEnd: Date,
  currentDate: Date = new Date()
): boolean => {
  if (periodControl === 'none') return true;
  if (periodControl === 'monthly' || periodControl === 'quarterly') return false;
  
  // Para licencias anuales: válidas hasta 3 meses después del fin del período
  const gracePeriodEnd = new Date(previousPeriodEnd);
  gracePeriodEnd.setMonth(gracePeriodEnd.getMonth() + 3);
  
  return currentDate <= gracePeriodEnd;
};

/**
 * Calcula el balance de licencias incluyendo períodos anteriores
 */
export const calculateLicenseBalance = (
  periodControl: 'annual' | 'monthly' | 'quarterly' | 'none',
  totalAvailable: number,
  usedCurrentPeriod: number,
  usedPreviousPeriod: number = 0,
  referenceDate: Date = new Date()
): LicenseBalance => {
  const currentPeriod = calculateCurrentPeriod(periodControl, referenceDate);
  const previousPeriod = calculatePreviousPeriod(periodControl, referenceDate);
  
  let carriedOver = 0;
  let expiresAt: Date | undefined;
  let isExpired = false;
  
  // Solo las licencias anuales pueden transferirse
  if (periodControl === 'annual') {
    const previousAvailable = Math.max(0, totalAvailable - usedPreviousPeriod);
    
    if (previousAvailable > 0 && isPreviousPeriodLicenseValid(periodControl, previousPeriod.endDate, referenceDate)) {
      carriedOver = Math.min(previousAvailable, 5); // Máximo 5 días transferibles
      expiresAt = new Date(previousPeriod.endDate);
      expiresAt.setMonth(expiresAt.getMonth() + 3);
      isExpired = referenceDate > expiresAt;
    }
  }
  
  const available = totalAvailable - usedCurrentPeriod + carriedOver;
  
  return {
    totalAvailable,
    used: usedCurrentPeriod,
    available: Math.max(0, available),
    carriedOver,
    expiresAt,
    isExpired
  };
};

/**
 * Valida si una solicitud de licencia es válida
 */
export const validateLicenseRequest = (
  request: LicenseRequest,
  licenseBalance: LicenseBalance,
  maxDaysPerRequest: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validar días disponibles
  if (request.days > licenseBalance.available) {
    errors.push(`Días insuficientes. Disponible: ${licenseBalance.available}, Solicitado: ${request.days}`);
  }
  
  // Validar máximo por solicitud
  if (request.days > maxDaysPerRequest) {
    errors.push(`Máximo ${maxDaysPerRequest} días permitidos por solicitud`);
  }
  
  // Validar fechas
  if (request.startDate > request.endDate) {
    errors.push('La fecha de inicio no puede ser posterior a la fecha de fin');
  }
  
  // Validar licencias transferidas vencidas
  if (licenseBalance.isExpired && licenseBalance.carriedOver > 0) {
    errors.push('Las licencias transferidas del período anterior han vencido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calcula de qué período se descuenta una licencia
 */
export const calculateDeductionPeriod = (
  request: LicenseRequest,
  periodControl: 'annual' | 'monthly' | 'quarterly' | 'none',
  licenseBalance: LicenseBalance
): { period: LicensePeriod; daysFromPeriod: number } => {
  const currentPeriod = calculateCurrentPeriod(periodControl, request.startDate);
  
  // Si hay licencias transferidas y no están vencidas, usar primero esas
  if (licenseBalance.carriedOver > 0 && !licenseBalance.isExpired) {
    const daysFromCarriedOver = Math.min(request.days, licenseBalance.carriedOver);
    const remainingDays = request.days - daysFromCarriedOver;
    
    if (remainingDays === 0) {
      // Solo se usan licencias transferidas
      const previousPeriod = calculatePreviousPeriod(periodControl, request.startDate);
      return {
        period: previousPeriod,
        daysFromPeriod: daysFromCarriedOver
      };
    } else {
      // Se usan licencias transferidas + del período actual
      return {
        period: currentPeriod,
        daysFromPeriod: remainingDays
      };
    }
  }
  
  // Solo se usan licencias del período actual
  return {
    period: currentPeriod,
    daysFromPeriod: request.days
  };
};

/**
 * Genera un mensaje descriptivo del balance de licencias
 */
export const generateBalanceMessage = (balance: LicenseBalance): string => {
  let message = `Disponible: ${balance.available} días`;
  
  if (balance.carriedOver > 0) {
    message += ` (incluye ${balance.carriedOver} del período anterior`;
    
    if (balance.expiresAt) {
      const expiresIn = Math.ceil((balance.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (expiresIn > 0) {
        message += `, vence en ${expiresIn} días`;
      } else {
        message += ', vencidas';
      }
    }
    
    message += ')';
  }
  
  return message;
};

/**
 * Obtiene el color de estado para la UI
 */
export const getBalanceStatusColor = (balance: LicenseBalance): string => {
  const percentage = (balance.available / balance.totalAvailable) * 100;
  
  if (balance.isExpired && balance.carriedOver > 0) return 'text-red-600';
  if (percentage <= 20) return 'text-red-600';
  if (percentage <= 50) return 'text-yellow-600';
  return 'text-green-600';
};
