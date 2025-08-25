const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Configuración de Firebase (usar las mismas credenciales que en el proyecto)
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🚀 INICIALIZANDO DATOS DE PRUEBA');
console.log('================================\n');

async function initializeTestData() {
  try {
    console.log('🔐 Iniciando sesión con cuenta de administrador...');
    
    // Intentar hacer login con la cuenta de prueba
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@test.com', '123456');
    console.log('✅ Login exitoso');
    
    // Crear usuario de prueba en Firestore
    console.log('👤 Creando usuario de prueba en Firestore...');
    const testUser = {
      email: 'admin@test.com',
      firstName: 'Administrador',
      lastName: 'Sistema',
      role: 'super_admin',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), testUser);
    console.log('✅ Usuario de prueba creado en Firestore');
    
    // Crear departamentos de prueba
    console.log('🏢 Creando departamentos de prueba...');
    const departments = [
      {
        id: 'dept-it',
        name: 'Tecnología de la Información',
        description: 'Departamento de TI y desarrollo',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'dept-rrhh',
        name: 'Recursos Humanos',
        description: 'Gestión de personal',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'dept-finanzas',
        name: 'Finanzas',
        description: 'Contabilidad y finanzas',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'dept-marketing',
        name: 'Marketing',
        description: 'Marketing y publicidad',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'dept-operaciones',
        name: 'Operaciones',
        description: 'Operaciones generales',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    ];
    
    for (const dept of departments) {
      await setDoc(doc(db, 'departments', dept.id), dept);
      console.log(`  ✅ Departamento creado: ${dept.name}`);
    }
    
    // Crear empleados de prueba
    console.log('👥 Creando empleados de prueba...');
    const employees = [
      {
        id: 'emp-001',
        employeeId: 'EMP001',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@empresa.com',
        phone: '+1234567890',
        departmentId: 'dept-it',
        position: 'Desarrollador Senior',
        hireDate: new Date('2023-01-15'),
        salary: 5000,
        currency: 'EUR',
        gender: 'male',
        personalType: 'permanent',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'emp-002',
        employeeId: 'EMP002',
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@empresa.com',
        phone: '+1234567891',
        departmentId: 'dept-rrhh',
        position: 'Gerente de RRHH',
        hireDate: new Date('2022-06-01'),
        salary: 6000,
        currency: 'EUR',
        gender: 'female',
        personalType: 'permanent',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        id: 'emp-003',
        employeeId: 'EMP003',
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@empresa.com',
        phone: '+1234567892',
        departmentId: 'dept-finanzas',
        position: 'Contador',
        hireDate: new Date('2023-03-10'),
        salary: 4500,
        currency: 'EUR',
        gender: 'male',
        personalType: 'permanent',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    ];
    
    // Definición de las 16 licencias y su disponibilidad máxima
    const licenses = [
      { code: 'PG01', name: 'Licencia Personal con Goce de Salario', max: 40 },
      { code: 'PS02', name: 'Licencia Personal sin Goce de Salario', max: 560 },
      { code: 'EG03', name: 'Licencia por Enfermedad con Goce de Salario', max: 3 },
      { code: 'ES04', name: 'Licencia por Enfermedad sin Goce de Salario', max: 9999 },
      { code: 'GG05', name: 'Licencia por Enfermedad Gravísima de Pariente', max: 17 },
      { code: 'DG06', name: 'Licencia por Duelo', max: 3 },
      { code: 'MG07', name: 'Licencia por Maternidad', max: 112 },
      { code: 'LG08', name: 'Licencia por Lactancia Materna', max: 6 },
      { code: 'AG09', name: 'Licencia por Paternidad', max: 3 },
      { code: 'OG10', name: 'Licencia por Matrimonio', max: 3 },
      { code: 'VG11', name: 'Vacaciones Anuales', max: 15 },
      { code: 'JRV12', name: 'Licencia por Cargo en Junta Receptora de Votos', max: 1 },
      { code: 'JU13', name: 'Licencia por Ser Llamado a Conformar Jurado', max: 1 },
      { code: 'OM14', name: 'Licencia por Olvido de Marcación', max: 2 },
      { code: 'CT15', name: 'Licencia por Cambio de Turno', max: 3 },
      { code: 'RH16', name: 'Licencia por Movimiento de Recurso Humano', max: 1 },
    ];

    for (const emp of employees) {
      // Inicializar las licencias en el empleado
      emp.licenses = licenses.map(lic => ({
        code: lic.code,
        name: lic.name,
        available: lic.max,
        max: lic.max,
        used: 0,
        lastUpdated: serverTimestamp(),
      }));
      await setDoc(doc(db, 'employees', emp.id), emp);
      console.log(`  ✅ Empleado creado: ${emp.firstName} ${emp.lastName} (licencias inicializadas)`);
    }
    
    console.log('\n🎉 DATOS DE PRUEBA INICIALIZADOS EXITOSAMENTE');
    console.log('==============================================');
    console.log('✅ Usuario administrador creado');
    console.log('✅ 5 departamentos creados');
    console.log('✅ 3 empleados de prueba creados');
    console.log('\n📝 CREDENCIALES DE PRUEBA:');
    console.log('Email: admin@test.com');
    console.log('Password: 123456');
    console.log('\n🌐 Puedes acceder al sistema en: http://localhost:5173');
    
  } catch (error) {
    console.error('❌ Error al inicializar datos de prueba:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que Firebase esté configurado correctamente');
    console.log('2. Asegúrate de que la autenticación esté habilitada en Firebase Console');
    console.log('3. Verifica que las credenciales de Firebase sean correctas');
  }
}

// Ejecutar la inicialización
initializeTestData();
