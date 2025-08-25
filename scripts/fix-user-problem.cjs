const { execSync } = require('child_process');

console.log('🔧 SCRIPT DE SOLUCIÓN - Problema de Usuario en Firestore\n');

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

console.log('='.repeat(60));
log('🎯 PROBLEMA IDENTIFICADO', 'bold');
console.log('='.repeat(60));

logInfo('Según los logs que proporcionaste:');
logInfo('1. ✅ Firebase Auth funciona correctamente');
logInfo('2. ❌ El usuario existe en Firebase Auth pero NO en Firestore');
logInfo('3. ❌ Estás usando rodolfovargasoff@gmail.com en lugar de admin@test.com');

console.log('\n' + '='.repeat(60));
log('🔧 SOLUCIÓN PASO A PASO', 'bold');
console.log('='.repeat(60));

logStep('1️⃣', 'Verificar servidor');
try {
  const netstat = execSync('netstat -an | findstr :5173', { encoding: 'utf8' });
  if (netstat.includes('5173')) {
    logSuccess('Servidor funcionando en http://localhost:5173');
  } else {
    logWarning('Servidor no detectado');
    logInfo('Ejecuta: npm run dev');
  }
} catch (error) {
  logWarning('No se pudo verificar el servidor');
}

logStep('2️⃣', 'SOLUCIÓN INMEDIATA');
logInfo('El problema es que estás usando un email diferente al de prueba.');
logInfo('Debes usar exactamente estas credenciales:');
logSuccess('📧 Email: admin@test.com');
logSuccess('🔑 Contraseña: 123456');

logStep('3️⃣', 'PASOS PARA SOLUCIONAR');

logInfo('Opción A - Usar credenciales correctas:');
logInfo('1. Abre http://localhost:5173');
logInfo('2. Haz clic en "👤 Crear Usuario de Prueba"');
logInfo('3. Haz clic en "📊 Inicializar Datos"');
logInfo('4. Usa admin@test.com / 123456 para hacer login');

logInfo('\nOpción B - Crear datos para tu email actual:');
logInfo('1. Abre http://localhost:5173');
logInfo('2. Haz clic en "👤 Crear Usuario de Prueba"');
logInfo('3. Haz clic en "📊 Inicializar Datos"');
logInfo('4. Usa admin@test.com / 123456 para hacer login');
logInfo('5. Una vez dentro, podrás crear usuarios con otros emails');

logStep('4️⃣', 'VERIFICAR QUE FUNCIONE');
logInfo('Después del login exitoso deberías ver:');
logInfo('🔧 AuthService: signInWithEmailAndPassword exitoso');
logInfo('🔧 AuthService: getUserData - Documento existe: true');
logInfo('🔧 AuthService: Login exitoso, retornando usuario');
logInfo('🔧 ProtectedRoute: Acceso permitido, renderizando children...');

logStep('5️⃣', 'SI SIGUE FALLANDO');
logInfo('1. Verifica que Firebase Authentication esté habilitado');
logInfo('2. Verifica que Firestore esté habilitado');
logInfo('3. Verifica que las reglas de Firestore permitan lectura/escritura');
logInfo('4. Ejecuta: firebase auth:export auth-check.json');
logInfo('5. Ejecuta: firebase firestore:indexes');

console.log('\n' + '='.repeat(60));
log('🚀 ¡PRUEBA AHORA!', 'bold');
console.log('='.repeat(60));

logInfo('1. Abre http://localhost:5173');
logInfo('2. Usa admin@test.com / 123456');
logInfo('3. Si no funciona, crea el usuario de prueba primero');
logInfo('4. Copia y pega los logs si hay errores');

console.log('\n' + '='.repeat(60));
log('📝 RESUMEN DEL PROBLEMA', 'bold');
console.log('='.repeat(60));

logError('PROBLEMA: Usuario no encontrado en Firestore');
logInfo('CAUSA: Estás usando rodolfovargasoff@gmail.com en lugar de admin@test.com');
logInfo('SOLUCIÓN: Usar admin@test.com / 123456 o crear datos para tu email');
logInfo('PREVENCIÓN: Siempre crear el usuario de prueba antes de hacer login');
