import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type User } from '../types';

// Usuario de prueba estándar
const testUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'admin@test.com',
  firstName: 'Administrador',
  lastName: 'de Prueba',
  role: 'super_admin',
  isActive: true,
};

// Usuario personalizado para rodolfovargasoff@gmail.com
const customUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'rodolfovargasoff@gmail.com',
  firstName: 'Usuario',
  lastName: 'Personalizado',
  role: 'super_admin',
  isActive: true,
};

export async function initializeTestData() {
  try {
    console.log('Inicializando datos de prueba...');
    
    // Crear usuario de prueba estándar
    const userRef = doc(db, 'users', 'test-admin-user');
    await setDoc(userRef, {
      ...testUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    console.log('✅ Usuario de prueba estándar creado exitosamente');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Contraseña: 123456');
    console.log('👤 Rol: Super Administrador');
    
    // Crear usuario personalizado
    const customUserRef = doc(db, 'users', 'custom-user-rodolfovargasoff-at-gmail-dot-com');
    await setDoc(customUserRef, {
      ...customUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    console.log('✅ Usuario personalizado creado exitosamente');
    console.log('📧 Email: rodolfovargasoff@gmail.com');
    console.log('👤 Rol: Super Administrador');
    console.log('💡 Nota: Este usuario debe existir en Firebase Auth');
    
  } catch (error) {
    console.error('❌ Error al inicializar datos de prueba:', error);
  }
}

if (typeof window !== 'undefined') {
  (window as any).initializeTestData = initializeTestData;
}
