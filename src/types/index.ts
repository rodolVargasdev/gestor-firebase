// Tipos base para el sistema de gestión de permisos laborales

export type PeriodControl = 'annual' | 'monthly' | 'quarterly' | 'none';
export type UnitControl = 'hours' | 'days' | 'uses';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type AssignmentStatus = 'active' | 'expired' | 'revoked';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type Gender = 'male' | 'female' | 'both';
export type PersonalType = 'permanent' | 'temporary' | 'contractor' | 'intern';

// Usuario del sistema
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
  departmentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Departamento
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Empleado
export interface Employee {
  id: string;
  userId?: string; // Opcional, puede no tener cuenta de usuario
  employeeId: string; // Número de empleado
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  position: string;
  hireDate: Date;
  salary: number;
  currency: string;
  gender: Gender;
  personalType: PersonalType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipo de licencia (permiso laboral)
export interface LicenseType {
  id: string;
  code: string; // Código único (ej: PG01, PS02, etc.)
  name: string;
  description?: string;
  category: string; // Categoría del permiso
  periodControl: PeriodControl;
  unitControl: UnitControl;
  totalAvailable: number;
  maxDaysPerRequest?: number; // Máximo días por solicitud individual
  requiresJustification: boolean;
  hasSalary: boolean; // Si tiene goce de salario
  isAccumulable: boolean;
  isTransferable: boolean;
  genderRestriction: Gender;
  minSeniority?: number; // Antigüedad mínima en meses
  minAge?: number;
  maxAge?: number;
  departmentRestriction?: string[]; // IDs de departamentos permitidos
  positionRestriction?: string[]; // Posiciones permitidas
  personalTypeRestriction?: PersonalType[]; // Tipos de personal permitidos
  autoRenewal: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Solicitud de licencia
export interface LicenseRequest {
  id: string;
  employeeId: string;
  licenseTypeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  notes?: string;
  attachments?: string[]; // URLs de archivos adjuntos
  status: RequestStatus;
  priority: RequestPriority;
  requestedBy: string; // ID del usuario que solicita
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Asignación de licencia
export interface LicenseAssignment {
  id: string;
  employeeId: string;
  licenseTypeId: string;
  assignedQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  periodStart: Date;
  periodEnd: Date;
  status: AssignmentStatus;
  usageHistory: UsageEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Entrada de uso
export interface UsageEntry {
  id: string;
  requestId: string;
  quantity: number;
  usedAt: Date;
  description?: string;
}

// Disponibilidad de licencias
export interface Availability {
  id: string;
  employeeId: string;
  licenseTypeId: string;
  currentPeriod: {
    totalAvailable: number;
    usedQuantity: number;
    remainingQuantity: number;
    requests: string[]; // IDs de solicitudes
  };
  periodHistory: Array<{
    periodStart: Date;
    periodEnd: Date;
    totalAvailable: number;
    usedQuantity: number;
    remainingQuantity: number;
    requests: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Filtros de búsqueda
export interface SearchFilters {
  status?: RequestStatus[];
  priority?: RequestPriority[];
  departmentId?: string;
  employeeId?: string;
  licenseTypeId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

// Configuraciones predefinidas de licencias
export const LICENSE_CONFIGS = {
  'personal_con_salario': {
    code: 'PG01',
    name: 'Licencia Personal con Goce de Salario',
    category: 'Personal',
    periodControl: 'annual' as PeriodControl,
    unitControl: 'hours' as UnitControl,
    totalAvailable: 40,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: true,
  },
  'personal_sin_salario': {
    code: 'PS02',
    name: 'Licencia Personal sin Goce de Salario',
    category: 'Personal',
    periodControl: 'annual' as PeriodControl,
    unitControl: 'hours' as UnitControl,
    totalAvailable: 560,
    requiresJustification: true,
    hasSalary: false,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: true,
  },
  'enfermedad_con_salario': {
    code: 'EG03',
    name: 'Licencia por Enfermedad con Goce de Salario',
    category: 'Enfermedad',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0, // Sin límite fijo
    maxDaysPerRequest: 3,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
  'enfermedad_sin_salario': {
    code: 'ES04',
    name: 'Licencia por Enfermedad sin Goce de Salario',
    category: 'Enfermedad',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0, // Solo registro
    requiresJustification: true,
    hasSalary: false,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
  'enfermedad_grave_familiar': {
    code: 'GG05',
    name: 'Licencia por Enfermedad Gravísima de Pariente',
    category: 'Familiar',
    periodControl: 'annual' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 17,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: true,
  },
  'duelo': {
    code: 'DG06',
    name: 'Licencia por Duelo',
    category: 'Familiar',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0,
    maxDaysPerRequest: 3,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
  'maternidad': {
    code: 'MG07',
    name: 'Licencia por Maternidad',
    category: 'Maternidad',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 112,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'female' as Gender,
    autoRenewal: false,
  },
  'lactancia': {
    code: 'LG08',
    name: 'Licencia por Lactancia Materna',
    category: 'Maternidad',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0, // 6 meses desde nacimiento
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'female' as Gender,
    autoRenewal: false,
  },
  'paternidad': {
    code: 'AG09',
    name: 'Licencia por Paternidad, Nacimiento o Adopción',
    category: 'Familiar',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0,
    maxDaysPerRequest: 3,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
  'matrimonio': {
    code: 'OG10',
    name: 'Licencia por Matrimonio',
    category: 'Personal',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0,
    maxDaysPerRequest: 3,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
  'vacaciones': {
    code: 'VG11',
    name: 'Vacaciones Anuales',
    category: 'Vacaciones',
    periodControl: 'annual' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 15,
    requiresJustification: false,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: true,
  },
  'junta_receptora': {
    code: 'JRV12',
    name: 'Licencia por Cargo en Junta Receptora de Votos',
    category: 'Cívico',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0, // Sin límite
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
  'jurado': {
    code: 'JU13',
    name: 'Licencia por Ser Llamado a Conformar Jurado',
    category: 'Cívico',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0, // Sin límite
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
  'olvido_marcacion': {
    code: 'OM14',
    name: 'Licencia por Olvido de Marcación',
    category: 'Administrativo',
    periodControl: 'monthly' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 2,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: true,
  },
  'cambio_turno': {
    code: 'CT15',
    name: 'Licencia por Cambio de Turno',
    category: 'Administrativo',
    periodControl: 'monthly' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 3,
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: true,
  },
  'movimiento_rrhh': {
    code: 'RH16',
    name: 'Licencia por Movimiento de Recurso Humano',
    category: 'Administrativo',
    periodControl: 'none' as PeriodControl,
    unitControl: 'days' as UnitControl,
    totalAvailable: 0, // Sin límite
    requiresJustification: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    genderRestriction: 'both' as Gender,
    autoRenewal: false,
  },
} as const;

// Workflow de solicitudes
export interface RequestWorkflow {
  id: string;
  requestId: string;
  steps: Array<{
    step: number;
    action: 'submit' | 'review' | 'approve' | 'reject';
    userId: string;
    timestamp: Date;
    notes?: string;
  }>;
  currentStep: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notificaciones
export interface RequestNotification {
  id: string;
  userId: string;
  requestId: string;
  type: 'request_submitted' | 'request_approved' | 'request_rejected' | 'request_requires_attention';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
