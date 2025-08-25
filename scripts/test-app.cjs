const { execSync } = require('child_process');

console.log('🧪 Probando la aplicación paso a paso...\n');

try {
  // 1. Verificar que el servidor esté funcionando
  console.log('1️⃣ Verificando servidor de desarrollo...');
  const netstat = execSync('netstat -an | findstr :5173', { encoding: 'utf8' });
  if (netstat.includes('5173')) {
    console.log('   ✅ Servidor funcionando en http://localhost:5173');
  } else {
    console.log('   ❌ Servidor no detectado');
    console.log('   💡 Ejecuta: npm run dev');
    return;
  }

  // 2. Verificar Firebase
  console.log('\n2️⃣ Verificando Firebase...');
  const firebaseUse = execSync('firebase use', { encoding: 'utf8' });
  if (firebaseUse.includes('gestor-licencias-firebas-76c57')) {
    console.log('   ✅ Proyecto Firebase configurado');
  } else {
    console.log('   ❌ Proyecto Firebase no configurado');
  }

  // 3. Verificar Authentication
  console.log('\n3️⃣ Verificando Authentication...');
  try {
    execSync('firebase auth:export auth-test.json', { stdio: 'pipe' });
    console.log('   ✅ Authentication habilitado');
  } catch (error) {
    console.log('   ❌ Authentication no habilitado');
  }

  console.log('\n🎉 ¡Aplicación lista para probar!');
  console.log('\n📝 Pasos para probar:');
  console.log('1. Abre tu navegador y ve a: http://localhost:5173');
  console.log('2. Verás la página de login del Gestor de Licencias');
  console.log('3. En la esquina inferior derecha verás las herramientas de desarrollo');
  console.log('4. Haz clic en "👤 Crear Usuario de Prueba"');
  console.log('5. Espera a que se complete la creación');
  console.log('6. Usa las credenciales:');
  console.log('   📧 Email: admin@test.com');
  console.log('   🔑 Contraseña: 123456');
  console.log('7. ¡Disfruta de tu aplicación!');

  console.log('\n🔧 Si hay problemas:');
  console.log('- Verifica que el navegador no bloquee los popups');
  console.log('- Revisa la consola del navegador (F12) para errores');
  console.log('- Asegúrate de que Firebase Authentication esté habilitado');

} catch (error) {
  console.error('\n❌ Error durante la prueba:', error.message);
}
