# 🔥 Configuración de Firebase - Paso a Paso

## 📋 Prerrequisitos
- Cuenta de Google
- Acceso a [Firebase Console](https://console.firebase.google.com/)

## 🚀 Pasos para Configurar Firebase

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombre del proyecto: `gestor-licencias-firebase`
4. Puedes deshabilitar Google Analytics por ahora
5. Haz clic en **"Crear proyecto"**

### 2. Habilitar Authentication

1. En el panel izquierdo, haz clic en **"Authentication"**
2. Haz clic en **"Comenzar"**
3. En la pestaña **"Sign-in method"**:
   - Habilita **"Email/Password"**
   - Habilita **"Google"**
4. Haz clic en **"Guardar"**

### 3. Habilitar Firestore Database

1. En el panel izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Selecciona la ubicación más cercana (ej: `us-central1`)
5. Haz clic en **"Siguiente"** y luego **"Habilitar"**

### 4. Obtener Configuración de la App

1. En el panel izquierdo, haz clic en el ícono de engranaje ⚙️
2. Selecciona **"Configuración del proyecto"**
3. En la pestaña **"General"**, desplázate hacia abajo
4. En la sección **"Tus apps"**, haz clic en **"Agregar app"**
5. Selecciona **"Web"** (</>)
6. Nombre de la app: `gestor-licencias-web`
7. Haz clic en **"Registrar app"**
8. **Copia la configuración** que aparece

### 5. Actualizar Configuración en el Proyecto

1. Abre el archivo `src/lib/firebase.ts`
2. Reemplaza la configuración actual con la que copiaste:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 6. Crear Usuario de Prueba

Una vez que hayas actualizado la configuración, ejecuta:

```bash
node create-test-user.cjs
```

### 7. Probar el Sistema

1. Asegúrate de que el servidor esté corriendo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:5173`

3. Inicia sesión con:
   - Email: `admin@test.com`
   - Password: `123456`

## 🔧 Solución de Problemas

### Error: "API key not valid"
- Verifica que hayas copiado correctamente la configuración de Firebase
- Asegúrate de que el proyecto esté creado y activo

### Error: "Authentication not enabled"
- Ve a Authentication > Sign-in method
- Habilita Email/Password y Google

### Error: "Firestore not enabled"
- Ve a Firestore Database
- Crea la base de datos en modo de prueba

## 📞 Soporte

Si tienes problemas:
1. Verifica que todos los pasos se hayan completado
2. Revisa la consola del navegador para errores
3. Verifica que Firebase esté configurado correctamente

---

**¡Una vez configurado, podrás acceder al sistema completo!** 🎉
