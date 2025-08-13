const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

console.log('🤖 SCRIPT AUTOMATIZADO - Prueba de Login\n');

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

async function autoTestLogin() {
  let browser;
  let page;

  try {
    // Paso 1: Verificar que el servidor esté funcionando
    logStep('1️⃣', 'Verificando servidor...');
    try {
      const netstat = execSync('netstat -an | findstr :5173', { encoding: 'utf8' });
      if (!netstat.includes('5173')) {
        logWarning('Servidor no detectado. Iniciando...');
        execSync('npm run dev', { stdio: 'pipe', cwd: process.cwd() });
        // Esperar a que el servidor se inicie
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      logSuccess('Servidor funcionando en http://localhost:5173');
    } catch (error) {
      logError('No se pudo verificar/iniciar el servidor');
      return;
    }

    // Paso 2: Iniciar navegador
    logStep('2️⃣', 'Iniciando navegador...');
    browser = await puppeteer.launch({
      headless: false, // Mostrar el navegador para ver qué pasa
      slowMo: 1000, // Ralentizar las acciones para ver mejor
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    logSuccess('Navegador iniciado');

    // Paso 3: Navegar a la aplicación
    logStep('3️⃣', 'Navegando a la aplicación...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    logSuccess('Aplicación cargada');

    // Paso 4: Esperar a que se carguen los elementos
    logStep('4️⃣', 'Esperando elementos de la página...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    logSuccess('Elementos de login cargados');

    // Paso 5: Buscar y hacer clic en "Crear Usuario de Prueba"
    logStep('5️⃣', 'Creando usuario de prueba...');
    try {
      // Buscar el botón "Crear Usuario de Prueba"
      const createUserButton = await page.$('button:has-text("Crear Usuario de Prueba")');
      if (createUserButton) {
        await createUserButton.click();
        logSuccess('Clic en "Crear Usuario de Prueba"');
        
        // Esperar mensaje de confirmación
        await page.waitForFunction(() => {
          const messages = document.querySelectorAll('div');
          return Array.from(messages).some(msg => 
            msg.textContent.includes('Usuario de prueba creado exitosamente')
          );
        }, { timeout: 10000 });
        logSuccess('Usuario de prueba creado');
      } else {
        logWarning('Botón "Crear Usuario de Prueba" no encontrado');
      }
    } catch (error) {
      logWarning('Error al crear usuario de prueba: ' + error.message);
    }

    // Paso 6: Buscar y hacer clic en "Inicializar Datos"
    logStep('6️⃣', 'Inicializando datos...');
    try {
      const initDataButton = await page.$('button:has-text("Inicializar Datos")');
      if (initDataButton) {
        await initDataButton.click();
        logSuccess('Clic en "Inicializar Datos"');
        
        // Esperar mensaje de confirmación
        await page.waitForFunction(() => {
          const messages = document.querySelectorAll('div');
          return Array.from(messages).some(msg => 
            msg.textContent.includes('Usuario de prueba creado exitosamente')
          );
        }, { timeout: 10000 });
        logSuccess('Datos inicializados');
      } else {
        logWarning('Botón "Inicializar Datos" no encontrado');
      }
    } catch (error) {
      logWarning('Error al inicializar datos: ' + error.message);
    }

    // Paso 7: Ingresar credenciales
    logStep('7️⃣', 'Ingresando credenciales...');
    await page.type('input[type="email"]', 'admin@test.com');
    await page.type('input[type="password"]', '123456');
    logSuccess('Credenciales ingresadas');

    // Paso 8: Hacer clic en "Iniciar Sesión"
    logStep('8️⃣', 'Haciendo login...');
    const loginButton = await page.$('button[type="submit"]');
    if (loginButton) {
      await loginButton.click();
      logSuccess('Clic en "Iniciar Sesión"');
    } else {
      logError('Botón de login no encontrado');
      return;
    }

    // Paso 9: Esperar redirección o error
    logStep('9️⃣', 'Verificando resultado del login...');
    
    // Esperar 5 segundos para ver si hay redirección
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      logSuccess('✅ LOGIN EXITOSO - Redirigido al dashboard');
    } else if (currentUrl.includes('/login')) {
      logWarning('⚠️  Login fallido - Aún en página de login');
      
      // Verificar si hay mensaje de error
      const errorMessage = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('div');
        for (const element of errorElements) {
          if (element.textContent.includes('Error') || element.textContent.includes('error')) {
            return element.textContent;
          }
        }
        return null;
      });
      
      if (errorMessage) {
        logError('Mensaje de error: ' + errorMessage);
      }
    } else {
      logInfo('URL actual: ' + currentUrl);
    }

    // Paso 10: Capturar logs de la consola
    logStep('🔍', 'Capturando logs de la consola...');
    const consoleLogs = await page.evaluate(() => {
      // Intentar acceder a los logs de la consola
      return 'Logs de consola no disponibles en modo automatizado';
    });
    
    logInfo('Para ver logs detallados, abre las herramientas de desarrollador (F12)');

    // Paso 11: Tomar screenshot
    logStep('📸', 'Tomando screenshot...');
    await page.screenshot({ path: 'test-result.png', fullPage: true });
    logSuccess('Screenshot guardado como test-result.png');

  } catch (error) {
    logError('Error durante la prueba: ' + error.message);
    
    // Tomar screenshot en caso de error
    if (page) {
      try {
        await page.screenshot({ path: 'test-error.png', fullPage: true });
        logInfo('Screenshot de error guardado como test-error.png');
      } catch (screenshotError) {
        logError('No se pudo tomar screenshot: ' + screenshotError.message);
      }
    }
  } finally {
    // Cerrar navegador
    if (browser) {
      await browser.close();
      logInfo('Navegador cerrado');
    }
  }
}

// Verificar si Puppeteer está instalado
try {
  require('puppeteer');
} catch (error) {
  logError('Puppeteer no está instalado. Instalando...');
  try {
    execSync('npm install puppeteer', { stdio: 'inherit' });
    logSuccess('Puppeteer instalado');
  } catch (installError) {
    logError('No se pudo instalar Puppeteer: ' + installError.message);
    logInfo('Ejecuta manualmente: npm install puppeteer');
    process.exit(1);
  }
}

// Ejecutar la prueba
autoTestLogin().then(() => {
  console.log('\n' + '='.repeat(60));
  log('🏁 PRUEBA COMPLETADA', 'bold');
  console.log('='.repeat(60));
  logInfo('Revisa los archivos test-result.png y test-error.png');
  logInfo('Para más detalles, ejecuta el script manual: node scripts/test-login-flow.cjs');
}).catch(error => {
  logError('Error fatal: ' + error.message);
  process.exit(1);
});
