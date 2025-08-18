import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3zx8GWpHQ3SSlhrZiF4e3kgjGbraEt8g",
  authDomain: "gestor-licencias-firebas-76c57.firebaseapp.com",
  projectId: "gestor-licencias-firebas-76c57",
  storageBucket: "gestor-licencias-firebas-76c57.firebasestorage.app",
  messagingSenderId: "548549101547",
  appId: "1:548549101547:web:9682a066fb0dc42c437bae",
  measurementId: "G-F5YTZ695P3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de ejemplo para empleados
const sampleEmployees = [
  {
    employeeId: 'EMP0001',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@empresa.com',
    department: 'Tecnología',
    position: 'Desarrollador Senior',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    employeeId: 'EMP0002',
    firstName: 'Juan',
    lastName: 'Rodríguez',
    email: 'juan.rodriguez@empresa.com',
    department: 'Recursos Humanos',
    position: 'Analista de RH',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    employeeId: 'EMP0003',
    firstName: 'Carmen',
    lastName: 'López',
    email: 'carmen.lopez@empresa.com',
    department: 'Finanzas',
    position: 'Contadora',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Datos de ejemplo para tipos de licencia
const sampleLicenseTypes = [
  {
    name: 'Vacaciones Anuales',
    code: 'VAC',
    category: 'Personal',
    unitControl: 'days',
    periodControl: 'annual',
    totalAvailable: 15,
    maxDaysPerRequest: 15,
    requiresJustification: false,
    isActive: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    autoRenewal: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Licencia por Enfermedad con Goce de Salario',
    code: 'EG03',
    category: 'Enfermedad',
    unitControl: 'days',
    periodControl: 'none',
    totalAvailable: 0,
    maxDaysPerRequest: 3,
    requiresJustification: true,
    isActive: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    autoRenewal: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Licencia por Duelo',
    code: 'DG06',
    category: 'Familiar',
    unitControl: 'days',
    periodControl: 'none',
    totalAvailable: 0,
    maxDaysPerRequest: 3,
    requiresJustification: true,
    isActive: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    autoRenewal: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Licencia por Paternidad (Nacimiento o Adopción)',
    code: 'AG09',
    category: 'Maternidad',
    unitControl: 'days',
    periodControl: 'none',
    totalAvailable: 0,
    maxDaysPerRequest: 3,
    requiresJustification: true,
    isActive: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    autoRenewal: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Licencia por Lactancia Materna',
    code: 'LG08',
    category: 'Maternidad',
    unitControl: 'days',
    periodControl: 'none',
    totalAvailable: 0,
    maxDaysPerRequest: 180,
    requiresJustification: true,
    isActive: true,
    hasSalary: true,
    isAccumulable: false,
    isTransferable: false,
    autoRenewal: false,
    autoCalculateEndDate: true,
    autoCalculateDays: 180,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function initializeData() {
  try {
    console.log('🚀 Iniciando inicialización de datos...');

    // Verificar si ya existen datos
    const employeesSnapshot = await getDocs(collection(db, 'employees'));
    const licenseTypesSnapshot = await getDocs(collection(db, 'licenseTypes'));

    console.log(`📊 Empleados existentes: ${employeesSnapshot.size}`);
    console.log(`📊 Tipos de licencia existentes: ${licenseTypesSnapshot.size}`);

    // Agregar empleados si no existen
    if (employeesSnapshot.size === 0) {
      console.log('👥 Agregando empleados de ejemplo...');
      for (const employee of sampleEmployees) {
        await addDoc(collection(db, 'employees'), employee);
      }
      console.log('✅ Empleados agregados exitosamente');
    }

    // Agregar tipos de licencia si no existen
    if (licenseTypesSnapshot.size === 0) {
      console.log('📋 Agregando tipos de licencia de ejemplo...');
      for (const licenseType of sampleLicenseTypes) {
        await addDoc(collection(db, 'licenseTypes'), licenseType);
      }
      console.log('✅ Tipos de licencia agregados exitosamente');
    }

    console.log('🎉 Inicialización completada');
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  }
}

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  // En el navegador, agregar al objeto global
  (window as any).initializeData = initializeData;
} else {
  // En Node.js, ejecutar directamente
  initializeData();
}

export { initializeData };
