const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Probando Fase 1 - Sistema de Autenticación...\n');

// Verificar que estamos en el directorio correcto
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ No se encontró package.json. Asegúrate de estar en el directorio del proyecto.');
  process.exit(1);
}

try {
  // 1. Verificar que Firebase CLI esté instalado
  console.log('1️⃣ Verificando Firebase CLI...');
  const firebaseVersion = execSync('firebase --version', { encoding: 'utf8' }).trim();
  console.log(`   ✅ Firebase CLI v${firebaseVersion} instalado`);

  // 2. Verificar proyecto Firebase
  console.log('\n2️⃣ Verificando proyecto Firebase...');
  const firebaseUse = execSync('firebase use', { encoding: 'utf8' });
  if (firebaseUse.includes('gestor-licencias-firebas-76c57')) {
    console.log('   ✅ Proyecto Firebase configurado correctamente');
  } else {
    console.log('   ⚠️  Proyecto Firebase no coincide');
  }

  // 3. Verificar variables de entorno
  console.log('\n3️⃣ Verificando variables de entorno...');
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_APP_ID'
    ];
    
    const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
    if (missingVars.length === 0) {
      console.log('   ✅ Variables de entorno configuradas');
    } else {
      console.log(`   ❌ Variables faltantes: ${missingVars.join(', ')}`);
    }
  } else {
    console.log('   ❌ Archivo .env.local no encontrado');
  }

  // 4. Verificar build
  console.log('\n4️⃣ Verificando build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Build exitoso');

  // 5. Verificar archivos principales
  console.log('\n5️⃣ Verificando archivos principales...');
  const requiredFiles = [
    'src/lib/firebase.ts',
    'src/stores/authStore.ts',
    'src/services/authService.ts',
    'src/components/auth/LoginForm.tsx',
    'src/pages/LoginPage.tsx',
    'src/App.tsx'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));
  if (missingFiles.length === 0) {
    console.log('   ✅ Todos los archivos principales existen');
  } else {
    console.log(`   ❌ Archivos faltantes: ${missingFiles.join(', ')}`);
  }

  console.log('\n🎉 ¡Fase 1 verificada exitosamente!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Ve a Firebase Console: https://console.firebase.google.com/');
  console.log('2. Selecciona tu proyecto: gestor-licencias-firebas-76c57');
  console.log('3. Ve a Authentication → Get started');
  console.log('4. Habilita Email/Password');
  console.log('5. Ve a Firestore Database → Create database (si no está creado)');
  console.log('6. Abre http://localhost:5173');
  console.log('7. Usa las herramientas de desarrollo para crear usuario de prueba');
  console.log('8. Prueba el login con admin@test.com / 123456');

} catch (error) {
  console.error('\n❌ Error durante la verificación:', error.message);
  process.exit(1);
}
