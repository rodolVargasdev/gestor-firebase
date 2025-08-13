const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Configuración de Firebase (usar las mismas credenciales que en el proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gestor-licencias-firebas-76c57.firebaseapp.com",
  projectId: "gestor-licencias-firebas-76c57",
  storageBucket: "gestor-licencias-firebas-76c57.appspot.com",
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
    
    for (const emp of employees) {
      await setDoc(doc(db, 'employees', emp.id), emp);
      console.log(`  ✅ Empleado creado: ${emp.firstName} ${emp.lastName}`);
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
