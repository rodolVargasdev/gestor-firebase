// ========================================
// VERIFICAR DISPONIBILIDAD CT15
// ========================================

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3zx8GWpHQ3SSlhrZiF4e3kgjGbraEt8g",
  authDomain: "gestor-licencias-firebas-76c57.firebaseapp.com",
  projectId: "gestor-licencias-firebas-76c57",
  storageBucket: "gestor-licencias-firebas-76c57.firebasestorage.app",
  messagingSenderId: "548549101547",
  appId: "1:548549101547:web:9682a066fb0dc42c437bae",
  measurementId: "G-F5YTZ695P3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para formatear fecha
function formatDate(date) {
  if (!date) return 'N/A';
  return date.toLocaleDateString('es-SV', {
    timeZone: 'America/El_Salvador',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function checkCT15Availability(employeeId) {
  try {
    console.log(`🔍 Verificando disponibilidad CT15 para empleado: ${employeeId}`);
    console.log('=' .repeat(50));

    // Obtener empleado
    const employeeRef = doc(db, 'employees', employeeId);
    const employeeSnap = await getDoc(employeeRef);
    
    if (!employeeSnap.exists()) {
      console.log('❌ Empleado no encontrado');
      return;
    }

    const employee = employeeSnap.data();
    console.log(`✅ Empleado: ${employee.name} (${employee.employeeId})`);

    // Verificar disponibilidad
    const disponibilidad = employee.disponibilidad;
    
    if (!disponibilidad) {
      console.log('❌ No hay disponibilidad inicializada');
      return;
    }

    const ct15Availability = disponibilidad.licencias_dias?.CT15;
    if (!ct15Availability) {
      console.log('❌ CT15 no encontrada en disponibilidad');
      console.log('📋 Licencias disponibles:');
      Object.keys(disponibilidad.licencias_dias || {}).forEach(key => {
        console.log(`   - ${key}: ${disponibilidad.licencias_dias[key].nombre}`);
      });
      return;
    }

    // Mostrar información detallada
    console.log('📊 DISPONIBILIDAD CT15 - CAMBIO DE TURNO:');
    console.log(`   Código: ${ct15Availability.codigo}`);
    console.log(`   Nombre: ${ct15Availability.nombre}`);
    console.log(`   Categoría: ${ct15Availability.categoria}`);
    console.log(`   Período de control: ${ct15Availability.periodo_control}`);
    console.log(`   Unidad: ${ct15Availability.unidad}`);
    console.log('');
    console.log('📈 ESTADO ACTUAL:');
    console.log(`   Asignada mensual: ${ct15Availability.asignada_mensual}`);
    console.log(`   Utilizada mes actual: ${ct15Availability.utilizada_mes_actual}`);
    console.log(`   Disponible mes actual: ${ct15Availability.disponible_mes_actual}`);
    console.log(`   Última actualización: ${formatDate(ct15Availability.ultima_actualizacion?.toDate())}`);
    console.log('');
    console.log('📅 PERÍODO:');
    console.log(`   Mes actual: ${disponibilidad.mes_actual}`);
    console.log(`   Última renovación mensual: ${formatDate(disponibilidad.ultima_renovacion_mensual?.toDate())}`);

    // Verificar si puede solicitar
    const canRequest = ct15Availability.disponible_mes_actual > 0;
    console.log('');
    console.log(`🎯 ¿Puede solicitar?: ${canRequest ? '✅ SÍ' : '❌ NO'}`);
    
    if (canRequest) {
      console.log(`   Puede solicitar hasta ${ct15Availability.disponible_mes_actual} cambio(s) de turno`);
    } else {
      console.log(`   Ha agotado los ${ct15Availability.asignada_mensual} cambios mensuales`);
    }

    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Error verificando disponibilidad:', error);
  }
}

// Función para listar empleados
async function listEmployees() {
  try {
    console.log('👥 LISTANDO EMPLEADOS DISPONIBLES:');
    console.log('=' .repeat(50));

    const { collection, getDocs } = await import('firebase/firestore');
    const employeesSnap = await getDocs(collection(db, 'employees'));
    
    if (employeesSnap.empty) {
      console.log('❌ No hay empleados en la base de datos');
      return;
    }

    employeesSnap.forEach(doc => {
      const employee = doc.data();
      console.log(`   ID: ${doc.id}`);
      console.log(`   Nombre: ${employee.name}`);
      console.log(`   Empleado ID: ${employee.employeeId}`);
      console.log(`   Email: ${employee.email}`);
      console.log(`   Tipo: ${employee.employeeType}`);
      console.log(`   Disponibilidad: ${employee.disponibilidad ? '✅ Inicializada' : '❌ No inicializada'}`);
      console.log('   ---');
    });

  } catch (error) {
    console.error('❌ Error listando empleados:', error);
  }
}

// Ejecutar
const args = process.argv.slice(2);
const command = args[0];
const employeeId = args[1];

if (command === 'list') {
  listEmployees();
} else if (command === 'check' && employeeId) {
  checkCT15Availability(employeeId);
} else {
  console.log('Uso:');
  console.log('  node check-ct15.js list                    - Listar empleados');
  console.log('  node check-ct15.js check <employee_id>     - Verificar CT15 de un empleado');
  console.log('');
  console.log('Ejemplo:');
  console.log('  node check-ct15.js check abc123');
}
