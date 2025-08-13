const { execSync } = require('child_process');

console.log('🚀 Configurando Firebase para el proyecto...');

try {
  // Verificar que Firebase CLI esté instalado
  console.log('📋 Verificando Firebase CLI...');
  execSync('firebase --version', { stdio: 'inherit' });
  
  // Verificar el proyecto actual
  console.log('📋 Verificando proyecto actual...');
  execSync('firebase use', { stdio: 'inherit' });
  
  console.log('\n✅ Configuración de Firebase completada');
  console.log('\n📝 Próximos pasos:');
  console.log('1. Ve a Firebase Console: https://console.firebase.google.com/');
  console.log('2. Selecciona tu proyecto: gestor-licencias-firebas-76c57');
  console.log('3. Ve a Authentication → Get started');
  console.log('4. Habilita Email/Password');
  console.log('5. Opcional: Habilita Google');
  console.log('6. Ve a Firestore Database → Create database (si no está creado)');
  console.log('7. Selecciona "Start in test mode"');
  console.log('8. Ubicación: us-central1');
  
  console.log('\n🎯 Una vez configurado, puedes:');
  console.log('- Abrir http://localhost:5173');
  console.log('- Usar las herramientas de desarrollo para crear usuario de prueba');
  console.log('- Probar el login con admin@test.com / 123456');
  
} catch (error) {
  console.error('❌ Error durante la configuración:', error.message);
  console.log('\n🔧 Soluciones:');
  console.log('1. Instala Firebase CLI: npm install -g firebase-tools');
  console.log('2. Inicia sesión: firebase login');
  console.log('3. Ejecuta este script nuevamente');
}
