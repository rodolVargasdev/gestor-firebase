// ========================================
// UTILIDADES PARA FORMULARIOS
// ========================================

/**
 * Formatear tiempo total para mostrar
 * Maneja tanto números como strings para evitar problemas de conversión
 */
export const formatTimeTotal = (horas: number | string, minutos: number | string): string => {
  // Convertir a números si son strings
  const horasNum = Number(horas) || 0;
  const minutosNum = Number(minutos) || 0;
  
  const totalHoras = horasNum + (minutosNum / 60);
  const horasEnteras = Math.floor(totalHoras);
  const minutosRestantes = Math.round((totalHoras - horasEnteras) * 60);
  
  if (horasEnteras === 0 && minutosRestantes === 0) {
    return '0 minutos';
  }
  
  let resultado = '';
  if (horasEnteras > 0) {
    resultado += `${horasEnteras} hora${horasEnteras !== 1 ? 's' : ''}`;
  }
  if (minutosRestantes > 0) {
    if (resultado) resultado += ' y ';
    resultado += `${minutosRestantes} minuto${minutosRestantes !== 1 ? 's' : ''}`;
  }
  
  return resultado;
};

/**
 * Formatear fechas de entrada sin conversión de zona horaria
 * Para evitar que las fechas se muestren un día antes
 */
export const formatInputDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-SV', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Calcular cantidad total de tiempo en horas
 * Maneja tanto números como strings
 */
export const calculateTotalHours = (horas: number | string, minutos: number | string): number => {
  const horasNum = Number(horas) || 0;
  const minutosNum = Number(minutos) || 0;
  return horasNum + (minutosNum / 60);
};

/**
 * Validar que se haya ingresado al menos algo de tiempo
 */
export const validateTimeInput = (horas: number | string, minutos: number | string): boolean => {
  const total = calculateTotalHours(horas, minutos);
  return total > 0;
};
