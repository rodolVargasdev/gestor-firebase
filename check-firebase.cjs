const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN FIREBASE');
console.log('==========================================\n');

// Verificar archivo de configuración
const firebaseConfigPath = path.join(process.cwd(), 'src/lib/firebase.ts');

console.log('📁 Verificando archivo de configuración...');

if (fs.existsSync(firebaseConfigPath)) {
  console.log('✅ Archivo src/lib/firebase.ts encontrado');
  
  const content = fs.readFileSync(firebaseConfigPath, 'utf8');
  
  // Verificar si tiene configuración placeholder
  if (content.includes('AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')) {
    console.log('❌ Configuración de placeholder detectada');
    console.log('💡 Necesitas actualizar la configuración con tus credenciales reales');
    console.log('\n📝 Pasos para configurar:');
    console.log('1. Ve a https://console.firebase.google.com/');
    console.log('2. Crea un proyecto o selecciona uno existente');
    console.log('3. Ve a Configuración del proyecto > General');
    console.log('4. En "Tus apps", crea una nueva app web');
    console.log('5. Copia la configuración y reemplázala en src/lib/firebase.ts');
  } else if (content.includes('apiKey: "') && content.includes('projectId: "')) {
    console.log('✅ Configuración de Firebase detectada');
    console.log('💡 La configuración parece estar completa');
  } else {
    console.log('⚠️  Configuración incompleta detectada');
    console.log('💡 Verifica que tengas todos los campos necesarios');
  }
} else {
  console.log('❌ Archivo src/lib/firebase.ts no encontrado');
}

console.log('\n📋 VERIFICACIÓN DE DEPENDENCIAS');
console.log('==============================');

// Verificar package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  const requiredDeps = ['firebase', 'react', 'react-dom', 'tailwindcss'];
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep}: ${dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: No instalado`);
    }
  });
}

console.log('\n🚀 ESTADO DEL SISTEMA');
console.log('=====================');

console.log('📝 Para acceder al sistema necesitas:');
console.log('1. ✅ Configurar Firebase (ver setup-firebase.md)');
console.log('2. ✅ Crear usuario de prueba (node create-test-user.cjs)');
console.log('3. ✅ Iniciar servidor (npm run dev)');
console.log('4. ✅ Acceder a http://localhost:5173');

console.log('\n🔧 COMANDOS ÚTILES:');
console.log('npm run dev                    # Iniciar servidor');
console.log('node create-test-user.cjs      # Crear usuario de prueba');
console.log('node test-system.cjs           # Verificar sistema completo');

console.log('\n📖 DOCUMENTACIÓN:');
console.log('setup-firebase.md              # Guía de configuración de Firebase');
console.log('README.md                      # Documentación completa del proyecto');
