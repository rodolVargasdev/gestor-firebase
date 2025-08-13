import { collection, doc, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type LicenseRequest } from '../types';

// Datos de prueba para solicitudes de licencias
const sampleRequests: Omit<LicenseRequest, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    employeeId: 'emp-001', // Ana García
    licenseTypeId: 'office-365',
    departmentId: 'dept-it',
    requestDate: new Date('2025-01-15'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-12-31'),
    quantity: 1,
    reason: 'Necesito acceso a Office 365 para trabajar con documentos de Word, Excel y PowerPoint en proyectos de desarrollo de software.',
    priority: 'high',
    status: 'approved',
    approvedBy: 'admin',
    approvedAt: new Date('2025-01-16'),
    notes: 'Aprobado para uso en desarrollo de software',
  },
  {
    employeeId: 'emp-002', // Carlos Rodríguez
    licenseTypeId: 'adobe-creative',
    departmentId: 'dept-it',
    requestDate: new Date('2025-01-20'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-12-31'),
    quantity: 1,
    reason: 'Requiero Adobe Creative Suite para diseño de interfaces de usuario y creación de assets gráficos para aplicaciones web.',
    priority: 'medium',
    status: 'pending',
    notes: 'Para diseño de UI/UX',
  },
  {
    employeeId: 'emp-003', // María López
    licenseTypeId: 'cloud-services',
    departmentId: 'dept-rrhh',
    requestDate: new Date('2025-01-18'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-03-01'),
    quantity: 160,
    reason: 'Necesito acceso a servicios en la nube para almacenamiento de documentos de recursos humanos y gestión de personal.',
    priority: 'low',
    status: 'approved',
    approvedBy: 'admin',
    approvedAt: new Date('2025-01-19'),
    notes: 'Aprobado para gestión de RRHH',
  },
  {
    employeeId: 'emp-004', // Juan Martínez
    licenseTypeId: 'development-tools',
    departmentId: 'dept-finanzas',
    requestDate: new Date('2025-01-22'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-12-31'),
    quantity: 1,
    reason: 'Solicito licencia para herramientas de desarrollo para automatizar procesos financieros y crear reportes automatizados.',
    priority: 'high',
    status: 'rejected',
    approvedBy: 'admin',
    approvedAt: new Date('2025-01-23'),
    rejectionReason: 'No se justifica el uso de herramientas de desarrollo en el departamento de finanzas',
    notes: 'Rechazado - no corresponde al departamento',
  },
  {
    employeeId: 'emp-005', // Laura Fernández
    licenseTypeId: 'hardware-rental',
    departmentId: 'dept-marketing',
    requestDate: new Date('2025-01-25'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-03-01'),
    quantity: 30,
    reason: 'Necesito alquilar hardware especializado para campañas de marketing digital y producción de contenido multimedia.',
    priority: 'urgent',
    status: 'approved',
    approvedBy: 'admin',
    approvedAt: new Date('2025-01-26'),
    notes: 'Aprobado para campañas de marketing',
  },
  {
    employeeId: 'emp-006', // Roberto Sánchez
    licenseTypeId: 'office-365',
    departmentId: 'dept-operaciones',
    requestDate: new Date('2025-01-28'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-12-31'),
    quantity: 1,
    reason: 'Requiero acceso a Office 365 para coordinar operaciones diarias, crear reportes y gestionar documentación del departamento.',
    priority: 'medium',
    status: 'pending',
    notes: 'Para coordinación de operaciones',
  },
  {
    employeeId: 'emp-007', // Carmen González
    licenseTypeId: 'cloud-services',
    departmentId: 'dept-ventas',
    requestDate: new Date('2025-01-30'),
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-28'),
    quantity: 200,
    reason: 'Necesito servicios en la nube para gestión de clientes, CRM y almacenamiento de información de ventas.',
    priority: 'high',
    status: 'in_progress',
    notes: 'En revisión técnica',
  },
  {
    employeeId: 'emp-008', // David Pérez
    licenseTypeId: 'development-tools',
    departmentId: 'dept-it',
    requestDate: new Date('2025-02-01'),
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-12-31'),
    quantity: 1,
    reason: 'Solicito herramientas de desarrollo para trabajar en proyectos de DevOps y automatización de infraestructura.',
    priority: 'high',
    status: 'approved',
    approvedBy: 'admin',
    approvedAt: new Date('2025-02-02'),
    notes: 'Aprobado para proyectos DevOps',
  },
  {
    employeeId: 'emp-009', // Isabel Torres
    licenseTypeId: 'office-365',
    departmentId: 'dept-finanzas',
    requestDate: new Date('2025-02-03'),
    startDate: new Date('2025-02-15'),
    endDate: new Date('2025-12-31'),
    quantity: 1,
    reason: 'Necesito Office 365 para análisis financiero, creación de reportes y gestión de presupuestos departamentales.',
    priority: 'medium',
    status: 'cancelled',
    notes: 'Cancelado por el solicitante',
  },
  {
    employeeId: 'emp-010', // Miguel Ruiz
    licenseTypeId: 'adobe-creative',
    departmentId: 'dept-marketing',
    requestDate: new Date('2025-02-05'),
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-12-31'),
    quantity: 1,
    reason: 'Requiero Adobe Creative Suite para diseño gráfico, creación de material promocional y branding corporativo.',
    priority: 'high',
    status: 'pending',
    notes: 'Para diseño gráfico corporativo',
  },
];

export async function initializeRequests() {
  console.log('🔧 Inicializando solicitudes de licencias...');
  
  try {
    for (const request of sampleRequests) {
      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await setDoc(doc(db, 'licenseRequests', requestId), {
        ...request,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    
    console.log('✅ Solicitudes de licencias inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar solicitudes:', error);
    throw error;
  }
}

export async function checkRequestsExist(): Promise<boolean> {
  try {
    const requestsRef = collection(db, 'licenseRequests');
    const snapshot = await getDocs(requestsRef);
    return !snapshot.empty;
  } catch (error) {
    console.error('❌ Error al verificar solicitudes existentes:', error);
    return false;
  }
}
