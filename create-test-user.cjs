const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

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
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔐 CREANDO USUARIO DE PRUEBA');
console.log('============================\n');

async function createTestUser() {
  try {
    console.log('📧 Creando usuario con email y contraseña...');
    
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'prueba@test.test', 
      '123456'
    );
    
    console.log('✅ Usuario creado en Firebase Auth');
    console.log(`   UID: ${userCredential.user.uid}`);
    
    // Crear documento en Firestore
    console.log('📄 Creando documento en Firestore...');
    
    const userData = {
      email: 'prueba@test.test',
      firstName: 'Usuario',
      lastName: 'Prueba',
      role: 'admin',
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    console.log('✅ Documento creado en Firestore');
    
    console.log('\n🎉 USUARIO DE PRUEBA CREADO EXITOSAMENTE');
    console.log('==========================================');
    console.log('📝 Credenciales:');
    console.log('   Email: prueba@test.test');
    console.log('   Password: 123456');
    console.log('\n🌐 Puedes acceder al sistema en: http://localhost:5173');
    console.log('\n💡 Si el usuario ya existe, puedes usar estas credenciales directamente');
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 El usuario ya existe. Puedes usar estas credenciales:');
      console.log('   Email: prueba@test.test');
      console.log('   Password: 123456');
      console.log('\n🌐 Accede a: http://localhost:5173');
    } else {
      console.log('\n🔧 Posibles soluciones:');
      console.log('1. Verifica que Firebase esté configurado correctamente');
      console.log('2. Asegúrate de que la autenticación esté habilitada en Firebase Console');
      console.log('3. Verifica que las credenciales de Firebase sean correctas');
      console.log('4. Asegúrate de que Firestore Database esté habilitado');
    }
  }
}

// Ejecutar la creación
createTestUser();
