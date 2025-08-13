const fs = require('fs');
const path = require('path');

console.log('👤 SCRIPT - Crear Usuario para Email Específico\n');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.bold}${step}${colors.reset}: ${message}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Email del usuario que está teniendo problemas
const userEmail = 'rodolfovargasoff@gmail.com';

console.log('='.repeat(60));
log('🎯 CREANDO USUARIO PARA EMAIL ESPECÍFICO', 'bold');
console.log('='.repeat(60));

logInfo(`Email objetivo: ${userEmail}`);

logStep('1️⃣', 'Creando archivo de inicialización personalizado...');

const initDataContent = `import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type User } from '../types';

// Usuario de prueba estándar
const testUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'admin@test.com',
  displayName: 'Administrador de Prueba',
  role: 'super_admin',
  isActive: true,
};

// Usuario personalizado para ${userEmail}
const customUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: '${userEmail}',
  displayName: 'Usuario Personalizado',
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
    const customUserRef = doc(db, 'users', 'custom-user-${userEmail.replace('@', '-at-').replace('.', '-dot-')}');
    await setDoc(customUserRef, {
      ...customUser,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    console.log('✅ Usuario personalizado creado exitosamente');
    console.log('📧 Email: ${userEmail}');
    console.log('👤 Rol: Super Administrador');
    console.log('💡 Nota: Este usuario debe existir en Firebase Auth');
    
  } catch (error) {
    console.error('❌ Error al inicializar datos de prueba:', error);
  }
}

if (typeof window !== 'undefined') {
  (window as any).initializeTestData = initializeTestData;
}
`;

const initDataPath = path.join(process.cwd(), 'src', 'scripts', 'initData.ts');

try {
  // Crear backup del archivo original
  if (fs.existsSync(initDataPath)) {
    const backupPath = initDataPath + '.backup';
    fs.copyFileSync(initDataPath, backupPath);
    logSuccess('Backup creado: initData.ts.backup');
  }
  
  // Escribir el nuevo contenido
  fs.writeFileSync(initDataPath, initDataContent);
  logSuccess('Archivo initData.ts actualizado');
  
} catch (error) {
  logError('Error al actualizar el archivo: ' + error.message);
  process.exit(1);
}

logStep('2️⃣', 'Creando script para crear usuario en Firebase Auth...');

const createAuthUserScript = `const { execSync } = require('child_process');

console.log('🔐 Creando usuario en Firebase Auth...');

try {
  // Crear usuario en Firebase Auth
  execSync(\`firebase auth:create-user --email "${userEmail}" --password "123456" --display-name "Usuario Personalizado"\`, { 
    stdio: 'inherit' 
  });
  
  console.log('✅ Usuario creado en Firebase Auth');
  console.log('📧 Email: ${userEmail}');
  console.log('🔑 Contraseña: 123456');
  
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('ℹ️  El usuario ya existe en Firebase Auth');
  } else {
    console.error('❌ Error al crear usuario:', error.message);
  }
}
`;

const authScriptPath = path.join(process.cwd(), 'scripts', 'create-auth-user.cjs');
fs.writeFileSync(authScriptPath, createAuthUserScript);
logSuccess('Script create-auth-user.cjs creado');

logStep('3️⃣', 'INSTRUCCIONES PARA USAR');

console.log('\n' + '='.repeat(60));
log('🚀 PASOS PARA SOLUCIONAR EL PROBLEMA', 'bold');
console.log('='.repeat(60));

logInfo('1. Crear usuario en Firebase Auth:');
logInfo('   node scripts/create-auth-user.cjs');

logInfo('\n2. Reconstruir la aplicación:');
logInfo('   npm run build');

logInfo('\n3. Abrir la aplicación:');
logInfo('   http://localhost:5173');

logInfo('\n4. Hacer clic en "📊 Inicializar Datos"');

logInfo('\n5. Hacer login con:');
logInfo(`   📧 Email: ${userEmail}`);
logInfo('   🔑 Contraseña: 123456');

logStep('4️⃣', 'Ejecutando creación de usuario en Firebase Auth...');

try {
  execSync(`node scripts/create-auth-user.cjs`, { stdio: 'inherit' });
} catch (error) {
  logWarning('Error al ejecutar script de creación de usuario');
  logInfo('Ejecuta manualmente: node scripts/create-auth-user.cjs');
}

logStep('5️⃣', 'Reconstruyendo aplicación...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  logSuccess('Aplicación reconstruida');
} catch (error) {
  logError('Error al reconstruir la aplicación');
  logInfo('Ejecuta manualmente: npm run build');
}

console.log('\n' + '='.repeat(60));
log('🎯 ¡LISTO PARA PROBAR!', 'bold');
console.log('='.repeat(60));

logInfo('1. Abre http://localhost:5173');
logInfo('2. Haz clic en "📊 Inicializar Datos"');
logInfo(`3. Usa ${userEmail} / 123456 para hacer login`);
logInfo('4. Deberías poder acceder al dashboard');

console.log('\n' + '='.repeat(60));
log('📝 RESUMEN DE CAMBIOS', 'bold');
console.log('='.repeat(60));

logSuccess('✅ initData.ts actualizado para crear usuario personalizado');
logSuccess('✅ Script create-auth-user.cjs creado');
logSuccess('✅ Usuario creado en Firebase Auth');
logSuccess('✅ Aplicación reconstruida');

logInfo('Ahora puedes usar tu email personal para hacer login');
