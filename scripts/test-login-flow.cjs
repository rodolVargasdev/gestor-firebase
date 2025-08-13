const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 SCRIPT DE PRUEBA - Flujo Completo de Login\n');

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

// Verificar que estamos en el directorio correcto
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  logError('No se encontró package.json. Asegúrate de estar en el directorio del proyecto.');
  process.exit(1);
}

try {
  // Paso 1: Verificar que el servidor esté funcionando
  logStep('1️⃣', 'Verificando servidor de desarrollo...');
  try {
    const netstat = execSync('netstat -an | findstr :5173', { encoding: 'utf8' });
    if (netstat.includes('5173')) {
      logSuccess('Servidor funcionando en http://localhost:5173');
    } else {
      logWarning('Servidor no detectado. Iniciando servidor...');
      execSync('npm run dev', { stdio: 'pipe', cwd: currentDir });
      logSuccess('Servidor iniciado');
    }
  } catch (error) {
    logWarning('Servidor no detectado. Iniciando servidor...');
    try {
      execSync('npm run dev', { stdio: 'pipe', cwd: currentDir });
      logSuccess('Servidor iniciado');
    } catch (devError) {
      logError('No se pudo iniciar el servidor');
      logInfo('Ejecuta manualmente: npm run dev');
    }
  }

  // Paso 2: Verificar configuración de Firebase
  logStep('2️⃣', 'Verificando configuración de Firebase...');
  try {
    const sdkConfig = execSync('firebase apps:sdkconfig web', { encoding: 'utf8' });
    logSuccess('Configuración de Firebase obtenida');
  } catch (error) {
    logError('Error al obtener configuración de Firebase');
    logInfo('Verifica que Firebase CLI esté configurado correctamente');
  }

  // Paso 3: Verificar Authentication
  logStep('3️⃣', 'Verificando Firebase Authentication...');
  try {
    execSync('firebase auth:export auth-check.json', { stdio: 'pipe' });
    logSuccess('Authentication habilitado');
  } catch (error) {
    logWarning('Authentication no habilitado o error al verificar');
  }

  // Paso 4: Verificar Firestore
  logStep('4️⃣', 'Verificando Firestore...');
  try {
    execSync('firebase firestore:indexes', { stdio: 'pipe' });
    logSuccess('Firestore configurado');
  } catch (error) {
    logWarning('Error al verificar Firestore');
  }

  console.log('\n' + '='.repeat(60));
  log('🎯 INSTRUCCIONES PARA PROBAR LA APLICACIÓN', 'bold');
  console.log('='.repeat(60));

  logStep('📱', 'Abrir la aplicación');
  logInfo('1. Abre tu navegador y ve a: http://localhost:5173');
  logInfo('2. Presiona F12 para abrir las herramientas de desarrollador');
  logInfo('3. Ve a la pestaña "Console"');
  logInfo('4. Limpia la consola (Ctrl+L)');

  logStep('👤', 'Crear usuario de prueba');
  logInfo('1. Haz clic en "👤 Crear Usuario de Prueba" (botón azul en la esquina inferior derecha)');
  logInfo('2. Espera el mensaje: "✅ Usuario de prueba creado exitosamente"');
  logInfo('3. Haz clic en "📊 Inicializar Datos"');

  logStep('🔐', 'Probar login con usuario de prueba');
  logInfo('1. Ingresa las credenciales:');
  logInfo('   - Email: admin@test.com');
  logInfo('   - Contraseña: 123456');
  logInfo('2. Haz clic en "Iniciar Sesión"');
  logInfo('3. Deberías ser redirigido al dashboard');

  logStep('🔍', 'Verificar logs en consola');
  logInfo('Deberías ver estos logs exitosos:');
  logInfo('🔧 AuthService: signInWithEmailAndPassword exitoso');
  logInfo('🔧 AuthService: getUserData - Documento existe: true');
  logInfo('🔧 AuthService: Login exitoso, retornando usuario');
  logInfo('🔧 ProtectedRoute: Acceso permitido, renderizando children...');

  logStep('⚠️', 'Si hay problemas');
  logInfo('1. Verifica que el usuario se haya creado correctamente');
  logInfo('2. Verifica que los datos se hayan inicializado');
  logInfo('3. Usa las credenciales exactas: admin@test.com / 123456');
  logInfo('4. Revisa los logs de error en la consola');

  console.log('\n' + '='.repeat(60));
  log('🚀 ¡LISTO PARA PROBAR!', 'bold');
  console.log('='.repeat(60));

  logInfo('Abre http://localhost:5173 y sigue las instrucciones paso a paso');
  logInfo('Si encuentras errores, copia y pega los logs de la consola');

} catch (error) {
  logError('Error durante la verificación:');
  console.error(error.message);
}
