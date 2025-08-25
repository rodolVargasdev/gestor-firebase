# Guía de Despliegue - Gestor de Licencias

## Descripción del Proyecto

Gestor de Licencias es una aplicación web para la gestión de permisos y licencias de empleados, construida con React, TypeScript y Firebase.

### Características principales
- Autenticación con Firebase Auth
- Gestión de empleados (crear, listar, editar, eliminar)
- Solicitud y gestión de licencias
- Historial de licencias con edición y eliminación
- Disponibilidad en tiempo real
- Importación y exportación en CSV/Excel
- Interfaz responsiva

## Requisitos previos

### Software necesario
- **Node.js** (versión 16 o superior)
- **Git** instalado
- **Cuenta de Google** con acceso a Firebase Console
- **Editor de código** (VS Code recomendado)

### Verificar instalaciones
```bash
# Verificar Node.js
node --version

# Verificar Git
git --version

# Verificar npm
npm --version
```

## Configuración de Firebase

### Paso 1: Crear proyecto en Firebase Console

1. Acceder a Firebase Console
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Inicia sesión con tu cuenta de Google
   - Haz clic en **"Crear un proyecto"**

2. **Configurar Proyecto**
   ```
   Nombre del proyecto: gestor-licencias-[tu-nombre]
   ID del proyecto: gestor-licencias-[tu-nombre]-[random]
   Descripción: Sistema de gestión de licencias para empleados
   ```

3. Configuraciones adicionales
   - Google Analytics: habilitar (recomendado)
   - Ubicación de Analytics: seleccionar región
   - Términos de servicio: aceptar

### Paso 2: Configurar servicios de Firebase

#### 2.1 Authentication
1. En el menú lateral, ve a **"Authentication"**
2. Haz clic en **"Comenzar"**
3. En "Sign-in method", habilitar:
   - Email/Password
   - Google (opcional)
4. Configurar "Authorized domains":
   - `localhost` (para desarrollo)
   - Tu dominio de producción

#### 2.2 Firestore Database
1. Ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Elige ubicación: **"us-central1"** (recomendado)

#### 2.3 Hosting
1. Ve a **"Hosting"**
2. Haz clic en **"Comenzar"**
3. Instala Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

## Configuración local

### Paso 3: Clonar y configurar repositorio

```bash
# Clonar el repositorio
git clone https://github.com/goes-infraestructura/gestor-licencias-frontend.git
cd gestor-licencias-frontend

# Instalar dependencias
npm install
```

### Paso 4: Configurar Firebase CLI

```bash
# Iniciar sesión en Firebase
firebase login

# Inicializar proyecto Firebase
firebase init
```

Durante la inicialización, seleccionar:
- Hosting
- Firestore
- Storage (opcional)

Configuración de Hosting:
```
¿Qué quieres usar como directorio público? dist
¿Configurar como aplicación de página única? Sí
¿Configurar GitHub Actions? Sí
```

### Paso 5: Obtener configuración de Firebase

1. Ve a **Firebase Console** → **Project Settings** → **General**
2. En **"Your apps"**, haz clic en **"Web app"**
3. Registra la app con nombre: `gestor-licencias-web`
4. Copiar la configuración (apiKey, authDomain, projectId, etc.)

### Paso 6: Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env.local

# Editar con tu configuración
notepad .env.local  # Windows
# nano .env.local   # Linux/Mac
```

Configurar variables en `.env.local`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
VITE_APP_NAME=Gestor de Licencias
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Configurar Firestore

### Paso 7: Reglas de seguridad

Ve a **Firestore Database** → **Rules** y configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso autenticado
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas específicas para empleados
    match /empleados/{empleadoId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas específicas para licencias
    match /licenseRequests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Reglas específicas para tipos de licencia
    match /licencias_tipos/{tipoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Paso 8: Índices de Firestore

Ve a **Firestore Database** → **Indexes** y crea:

```
Collection: licenseRequests
Fields: employeeId (Ascending), createdAt (Descending)
```

## Desplegar la aplicación

### Paso 9: Construir y desplegar

```bash
# Construir proyecto
npm run build

# Desplegar reglas de Firestore
firebase deploy --only firestore:rules

# Desplegar índices de Firestore
firebase deploy --only firestore:indexes

# Desplegar aplicación
firebase deploy --only hosting
```

### Paso 10: Configurar datos iniciales

```bash
# Inicializar tipos de licencia (si aplica)
node scripts/update-license-categories.cjs

# Inicializar disponibilidad de empleados (si aplica)
node scripts/initialize-employee-availability.cjs
```

### Paso 11: Crear usuario administrador

1. Ve a **Authentication** → **Users**
2. Haz clic en **"Add user"**
3. Crea usuario: `admin@tuempresa.com`
4. Establece contraseña segura

## Verificar funcionamiento

### Paso 12: Probar aplicación

1. **Probar Autenticación**
   - Ve a tu aplicación desplegada
   - Intenta iniciar sesión con el usuario admin
   - Verifica que puedes acceder al dashboard

2. Probar funcionalidades
   - Crear empleado: verificar que se guarda en Firestore
   - Solicitar licencia: verificar que se procesa correctamente
   - Ver historial: verificar que se muestran las licencias
   - Importar CSV: verificar que funciona la importación

## Configuración avanzada (opcional)

### GitHub Actions para CI/CD

1. Configurar secrets
   En tu repositorio de GitHub, ve a **Settings** → **Secrets**:

   ```
   FIREBASE_SERVICE_ACCOUNT: [Contenido del JSON de cuenta de servicio]
   FIREBASE_PROJECT_ID: [ID de tu proyecto]
   ```

2. Generar cuenta de servicio
   - Ve a **Firebase Console** → **Project Settings** → **Service accounts**
   - Haz clic en **"Generate new private key"**
   - Descarga el JSON
   - Copia todo el contenido al secret `FIREBASE_SERVICE_ACCOUNT`

### Configuración multi-entorno

El proyecto soporta múltiples entornos (desarrollo, staging, producción):

```bash
# Cambiar entre proyectos
firebase use production  # Proyecto principal
firebase use staging     # Proyecto de staging

# Desplegar específicamente
firebase deploy --project staging
firebase deploy --project production
```

## Solución de problemas comunes

### Error: "API key not valid"
```bash
# Verificar configuración
cat .env.local
# Verificar dominio autorizado en Firebase Console
```

### Error: "Permission denied"
```bash
# Verificar reglas de Firestore
firebase deploy --only firestore:rules
```

### Error: "Project not found"
```bash
# Verificar proyecto activo
firebase use
# Cambiar proyecto
firebase use tu-proyecto-id
```

### Error: "Build failed"
```bash
# Verificar dependencias
npm install
# Verificar errores de TypeScript
npm run build
```

### Error: "Authentication failed"
- Verificar que el usuario existe en Firebase Console
- Verificar que Email/Password está habilitado
- Verificar dominios autorizados

## Monitoreo y mantenimiento

### Configurar alertas
- **Firebase Console** → **Project Settings** → **Usage and billing**
- Configurar alertas de uso

### Monitorear logs
- **Firebase Console** → **Functions** → **Logs**
- Revisar logs de autenticación y base de datos

### Copias de seguridad
- **Firebase Console** → **Firestore Database** → **Backup**
- Configurar backups automáticos

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo local |
| `npm run build` | Construir para producción |
| `firebase deploy` | Desplegar todo |
| `firebase deploy --only hosting` | Solo hosting |
| `firebase serve` | Servir localmente |
| `firebase use --add` | Agregar proyecto |
| `firebase projects:list` | Listar proyectos |

## Documentación adicional

- **README principal**: `README.md`
- **Guía de seguridad**: `SECURITY.md`
- **Configuración detallada**: `FIREBASE_SETUP.md`
- **Inicio rápido**: `QUICK_START.md`

## Lista de verificación para despliegue

- [ ] Proyecto Firebase creado
- [ ] Authentication configurado
- [ ] Firestore Database creado
- [ ] Hosting habilitado
- [ ] Firebase CLI instalado y configurado
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas
- [ ] Proyecto construido
- [ ] Reglas de Firestore desplegadas
- [ ] Índices de Firestore creados
- [ ] Aplicación desplegada
- [ ] Usuario administrador creado
- [ ] Funcionalidades probadas

---

## Tu aplicación está lista para usar

URL de ejemplo de Hosting: `https://tu-proyecto-id.web.app`

Próximos pasos sugeridos:
1. Configurar usuarios adicionales
2. Personalizar la aplicación según tus necesidades
3. Configurar monitoreo y alertas
4. Implementar políticas de respaldo

En caso de dudas:
- Revisar logs en Firebase Console
- Consultar la documentación en el repositorio
- Verificar configuración en `.env.local`
