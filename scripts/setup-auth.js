const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔐 Configurando Authentication en Firebase...\n');

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

  // 3. Verificar configuración de Firebase
  console.log('\n3️⃣ Verificando configuración de Firebase...');
  const sdkConfig = execSync('firebase apps:sdkconfig web', { encoding: 'utf8' });
  console.log('   ✅ Configuración de Firebase obtenida');

  // 4. Verificar Authentication
  console.log('\n4️⃣ Verificando Authentication...');
  try {
    execSync('firebase auth:export auth-export.json', { stdio: 'pipe' });
    console.log('   ✅ Authentication está habilitado');
  } catch (error) {
    console.log('   ❌ Authentication no está habilitado');
    console.log('   📝 Necesitas habilitar Authentication en Firebase Console');
  }

  console.log('\n🎉 Configuración completada!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Abre http://localhost:5173 en tu navegador');
  console.log('2. Verás las herramientas de desarrollo en la esquina inferior derecha');
  console.log('3. Haz clic en "👤 Crear Usuario de Prueba"');
  console.log('4. Usa las credenciales: admin@test.com / 123456');
  console.log('5. ¡Disfruta de tu aplicación!');

  // 5. Verificar que el servidor esté funcionando
  console.log('\n5️⃣ Verificando servidor de desarrollo...');
  try {
    const netstat = execSync('netstat -an | findstr :5173', { encoding: 'utf8' });
    if (netstat.includes('5173')) {
      console.log('   ✅ Servidor funcionando en http://localhost:5173');
    } else {
      console.log('   ⚠️  Servidor no detectado, ejecuta: npm run dev');
    }
  } catch (error) {
    console.log('   ⚠️  Servidor no detectado, ejecuta: npm run dev');
  }

} catch (error) {
  console.error('\n❌ Error durante la configuración:', error.message);
  process.exit(1);
}
