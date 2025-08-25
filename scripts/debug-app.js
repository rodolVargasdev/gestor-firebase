const { execSync } = require('child_process');

console.log('🔧 Debuggeando la aplicación...\n');

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

  // 2. Verificar que el build funcione
  console.log('\n2️⃣ Verificando build...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('   ✅ Build exitoso');
  } catch (error) {
    console.log('   ❌ Error en build');
    console.log('   💡 Revisa los errores de TypeScript');
    return;
  }

  // 3. Verificar Firebase
  console.log('\n3️⃣ Verificando Firebase...');
  const firebaseUse = execSync('firebase use', { encoding: 'utf8' });
  if (firebaseUse.includes('gestor-licencias-firebas-76c57')) {
    console.log('   ✅ Proyecto Firebase configurado');
  } else {
    console.log('   ❌ Proyecto Firebase no configurado');
  }

  console.log('\n🎉 ¡Aplicación lista para debuggear!');
  console.log('\n📝 Pasos para debuggear:');
  console.log('1. Abre tu navegador y ve a: http://localhost:5173');
  console.log('2. Abre las herramientas de desarrollador (F12)');
  console.log('3. Ve a la pestaña "Console"');
  console.log('4. Deberías ver los logs de debug:');
  console.log('   - "🔧 LoginPage rendered, DEV mode: true"');
  console.log('   - "🔧 DevTools component rendered"');
  console.log('5. En la esquina inferior derecha deberías ver las herramientas de desarrollo');
  console.log('6. Si no las ves, revisa la consola para errores');

  console.log('\n🔧 Si no ves las herramientas de desarrollo:');
  console.log('- Verifica que no haya errores en la consola');
  console.log('- Refresca la página (Ctrl+F5)');
  console.log('- Verifica que el archivo DevTools.tsx esté correcto');
  console.log('- Verifica que el archivo LoginPage.tsx esté correcto');

} catch (error) {
  console.error('\n❌ Error durante el debug:', error.message);
}
