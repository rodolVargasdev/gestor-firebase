const { execSync } = require('child_process');

console.log('🔐 Creando usuario en Firebase Auth...');

try {
  // Verificar que Firebase CLI esté disponible
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI detectado');
  
  // Intentar crear usuario usando el método correcto
  console.log('📧 Intentando crear usuario...');
  
  // Método 1: Usar firebase auth:import (si existe)
  try {
    execSync('firebase auth:import --help', { stdio: 'pipe' });
    console.log('ℹ️  Método auth:import disponible');
  } catch (error) {
    console.log('ℹ️  Método auth:import no disponible');
  }
  
  // Método 2: Verificar usuarios existentes
  try {
    const users = execSync('firebase auth:export auth-users.json', { stdio: 'pipe' });
    console.log('✅ Usuarios exportados a auth-users.json');
    console.log('ℹ️  Verifica si el usuario ya existe en el archivo');
  } catch (error) {
    console.log('⚠️  No se pudo exportar usuarios');
  }
  
  console.log('\n📝 INSTRUCCIONES MANUALES:');
  console.log('1. Ve a la consola de Firebase: https://console.firebase.google.com');
  console.log('2. Selecciona tu proyecto: gestor-licencias-firebas-76c57');
  console.log('3. Ve a Authentication > Users');
  console.log('4. Haz clic en "Add User"');
  console.log('5. Ingresa:');
  console.log('   - Email: rodolfovargasoff@gmail.com');
  console.log('   - Password: 123456');
  console.log('6. Haz clic en "Add user"');
  
  console.log('\n✅ Una vez creado el usuario en Firebase Auth:');
  console.log('1. Abre http://localhost:5173');
  console.log('2. Haz clic en "📊 Inicializar Datos"');
  console.log('3. Usa rodolfovargasoff@gmail.com / 123456 para hacer login');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n📝 SOLUCIÓN ALTERNATIVA:');
  console.log('1. Ve a https://console.firebase.google.com');
  console.log('2. Selecciona tu proyecto');
  console.log('3. Ve a Authentication > Users');
  console.log('4. Crea el usuario manualmente');
}
