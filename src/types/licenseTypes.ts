// ========================================
// TIPOS DE LICENCIAS SEGÚN LINEAMIENTO
// ========================================

export interface LicenseType {
  id: string;
  codigo: string;
  nombre: string;
  categoria: 'HORAS' | 'DIAS' | 'OCASION';
  periodo_control: 'anual' | 'mensual' | 'ninguno';
  cantidad_maxima: number;
  unidad_control: string;
  aplica_genero?: 'M' | 'F';
  max_por_solicitud?: number;
  descripcion?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// TIPOS DE LICENCIAS PREDEFINIDOS
// ========================================

export const LICENSE_TYPES: Omit<LicenseType, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // ========================================
  // LICENCIAS POR HORAS
  // ========================================
  {
    codigo: 'PG01',
    nombre: 'Permiso Personal con Goce de Salario',
    categoria: 'HORAS',
    periodo_control: 'anual',
    cantidad_maxima: 40,
    unidad_control: 'horas',
    descripcion: 'Permisos personales pagados hasta 40 horas por año',
    activo: true
  },
  {
    codigo: 'PS02',
    nombre: 'Permiso Personal sin Goce de Salario',
    categoria: 'HORAS',
    periodo_control: 'anual',
    cantidad_maxima: 480, // 60 días x 8 horas
    unidad_control: 'horas',
    descripcion: 'Permisos personales sin pago hasta 480 horas por año',
    activo: true
  },

  // ========================================
  // LICENCIAS POR DÍAS
  // ========================================
  {
    codigo: 'GG05',
    nombre: 'Licencia por Enfermedad Gravísima de Pariente',
    categoria: 'DIAS',
    periodo_control: 'anual',
    cantidad_maxima: 17,
    unidad_control: 'dias',
    descripcion: 'Licencia para cuidar familiar con enfermedad grave',
    activo: true
  },
  {
    codigo: 'MG07',
    nombre: 'Licencia por Maternidad',
    categoria: 'DIAS',
    periodo_control: 'ninguno',
    cantidad_maxima: 112,
    unidad_control: 'dias',
    aplica_genero: 'F',
    descripcion: '112 días por embarazo',
    activo: true
  },
  {
    codigo: 'VG11',
    nombre: 'Vacaciones Anuales',
    categoria: 'DIAS',
    periodo_control: 'anual',
    cantidad_maxima: 15,
    unidad_control: 'dias',
    descripcion: 'Vacaciones anuales obligatorias',
    activo: true
  },

  // ========================================
  // LICENCIAS POR OCASIÓN
  // ========================================
  {
    codigo: 'LG08',
    nombre: 'Licencia por Lactancia Materna',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Se calcula automáticamente (6 meses)
    unidad_control: 'horas_diarias',
    aplica_genero: 'F',
    max_por_solicitud: 1, // 1 período de lactancia por nacimiento
    descripcion: '1 hora diaria por 6 meses desde el nacimiento',
    activo: true
  },
  {
    codigo: 'OM14',
    nombre: 'Licencia por Olvido de Marcación',
    categoria: 'OCASION',
    periodo_control: 'mensual',
    cantidad_maxima: 2,
    unidad_control: 'olvidos',
    max_por_solicitud: 1, // 1 olvido por solicitud
    descripcion: '2 olvidos de marcación por mes',
    activo: true
  },
  {
    codigo: 'CT15',
    nombre: 'Licencia por Cambio de Turno',
    categoria: 'OCASION',
    periodo_control: 'mensual',
    cantidad_maxima: 3,
    unidad_control: 'cambios',
    max_por_solicitud: 1, // 1 cambio por solicitud
    descripcion: '3 cambios de turno por mes',
    activo: true
  },
  {
    codigo: 'EG03',
    nombre: 'Licencia por Enfermedad con Goce de Salario',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Sin límite fijo
    unidad_control: 'dias',
    max_por_solicitud: 3,
    descripcion: 'Licencia por enfermedad pagada, máximo 3 días por solicitud',
    activo: true
  },
  {
    codigo: 'ES04',
    nombre: 'Licencia por Enfermedad sin Goce de Salario',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Sin límite fijo
    unidad_control: 'dias',
    descripcion: 'Licencia por enfermedad sin pago',
    activo: true
  },
  {
    codigo: 'DG06',
    nombre: 'Licencia por Duelo',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Sin límite fijo
    unidad_control: 'dias',
    max_por_solicitud: 3,
    descripcion: 'Licencia por fallecimiento de familiar, máximo 3 días',
    activo: true
  },
  {
    codigo: 'AG09',
    nombre: 'Licencia por Paternidad/Adopción',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Sin límite fijo
    unidad_control: 'dias',
    max_por_solicitud: 3,
    descripcion: 'Licencia por nacimiento o adopción, máximo 3 días',
    activo: true
  },
  {
    codigo: 'JRV12',
    nombre: 'Licencia por Juntas Receptoras de Votos',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Sin límite fijo
    unidad_control: 'dias',
    descripcion: 'Licencia para participar en juntas electorales',
    activo: true
  },
  {
    codigo: 'JU13',
    nombre: 'Licencia por Conformar Jurado',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Sin límite fijo
    unidad_control: 'dias',
    descripcion: 'Licencia para participar como jurado',
    activo: true
  },
  {
    codigo: 'RH16',
    nombre: 'Movimiento de Recurso Humano',
    categoria: 'OCASION',
    periodo_control: 'ninguno',
    cantidad_maxima: 0, // Sin límite fijo
    unidad_control: 'dias',
    descripcion: 'Licencia para movimientos internos de RH',
    activo: true
  }
];

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

export function getLicenseTypeByCode(codigo: string): Omit<LicenseType, 'id' | 'createdAt' | 'updatedAt'> | undefined {
  return LICENSE_TYPES.find(lt => lt.codigo === codigo);
}

export function getLicenseTypesByCategory(categoria: 'HORAS' | 'DIAS' | 'OCASION'): Omit<LicenseType, 'id' | 'createdAt' | 'updatedAt'>[] {
  return LICENSE_TYPES.filter(lt => lt.categoria === categoria);
}

export function getActiveLicenseTypes(): Omit<LicenseType, 'id' | 'createdAt' | 'updatedAt'>[] {
  return LICENSE_TYPES.filter(lt => lt.activo);
}

export function isEmployeeEligible(licenseType: LicenseType, employeeGender: string): boolean {
  if (licenseType.aplica_genero) {
    return employeeGender === licenseType.aplica_genero;
  }
  return true;
}
