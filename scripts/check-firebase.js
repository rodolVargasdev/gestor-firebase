const { execSync } = require('child_process');

console.log('🔧 Verificando configuración de Firebase...\n');

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

  // 2. Verificar configuración de Firebase
  console.log('\n2️⃣ Verificando configuración de Firebase...');
  const sdkConfig = execSync('firebase apps:sdkconfig web', { encoding: 'utf8' });
  console.log('   ✅ Configuración de Firebase obtenida');

  // 3. Verificar Authentication
  console.log('\n3️⃣ Verificando Authentication...');
  try {
    execSync('firebase auth:export auth-check.json', { stdio: 'pipe' });
    console.log('   ✅ Authentication habilitado');
  } catch (error) {
    console.log('   ❌ Authentication no habilitado');
  }

  console.log('\n🎉 ¡Configuración verificada!');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Abre tu navegador y ve a: http://localhost:5173');
  console.log('2. Abre las herramientas de desarrollador (F12)');
  console.log('3. Ve a la pestaña "Console"');
  console.log('4. Deberías ver los logs de debug de Firebase:');
  console.log('   - "🔧 Firebase Config Debug:"');
  console.log('   - "🔧 Inicializando Firebase..."');
  console.log('   - "✅ Firebase inicializado correctamente"');
  console.log('5. Si ves errores, copia y pega los mensajes');

  console.log('\n🔧 Si sigues viendo el error "auth/invalid-api-key":');
  console.log('1. Verifica que las variables de entorno estén correctas');
  console.log('2. Refresca la página (Ctrl+F5)');
  console.log('3. Verifica que Firebase Authentication esté habilitado en la consola');
  console.log('4. Verifica que la API key sea válida');

} catch (error) {
  console.error('\n❌ Error durante la verificación:', error.message);
}
