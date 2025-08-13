# 🔧 SOLUCIÓN - Error auth/invalid-api-key

## ✅ Problema Identificado

El error `Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key)` indica que hay un problema con la configuración de Firebase.

## 🔍 Diagnóstico

### **1. Verificar Variables de Entorno**
Las variables están configuradas correctamente en `.env.local`:
```
VITE_FIREBASE_API_KEY=AIzaSyC3zx8GWpHQ3SSlhrZiF4e3kgjGbraEt8g
VITE_FIREBASE_AUTH_DOMAIN=gestor-licencias-firebas-76c57.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gestor-licencias-firebas-76c57
VITE_FIREBASE_APP_ID=1:548549101547:web:9682a066fb0dc42c437bae
```

### **2. Verificar Configuración de Firebase**
La configuración obtenida de Firebase CLI coincide:
```json
{
  "projectId": "gestor-licencias-firebas-76c57",
  "appId": "1:548549101547:web:9682a066fb0dc42c437bae",
  "apiKey": "AIzaSyC3zx8GWpHQ3SSlhrZiF4e3kgjGbraEt8g",
  "authDomain": "gestor-licencias-firebas-76c57.firebaseapp.com"
}
```

### **3. Verificar Authentication**
Authentication está habilitado y funcionando.

## 🚀 Solución Paso a Paso

### **Paso 1: Refrescar la Aplicación**
1. Abre tu navegador y ve a: **http://localhost:5173**
2. Presiona **F12** para abrir las herramientas de desarrollador
3. Ve a la pestaña **"Console"**
4. Presiona **Ctrl+F5** para hacer un hard refresh

### **Paso 2: Verificar Logs de Debug**
Deberías ver estos logs en la consola:
```
🔧 Firebase Config Debug:
API Key: ✅ Presente
Auth Domain: ✅ Presente
Project ID: ✅ Presente
App ID: ✅ Presente
🔧 Firebase Config Object: { apiKey: "✅ Configurado", ... }
🔧 Inicializando Firebase...
✅ Firebase inicializado correctamente
🔧 Inicializando servicios de Firebase...
✅ Servicios de Firebase inicializados correctamente
```

### **Paso 3: Si Sigues Viendo el Error**

#### **Opción A: Verificar Firebase Console**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `gestor-licencias-firebas-76c57`
3. Ve a **Authentication** → **Sign-in method**
4. Verifica que **Email/Password** esté habilitado
5. Ve a **Project Settings** → **General**
6. Verifica que la API key sea la misma

#### **Opción B: Regenerar API Key**
1. En Firebase Console, ve a **Project Settings** → **General**
2. En la sección "Your apps", encuentra tu app web
3. Haz clic en **"Regenerate key"**
4. Copia la nueva API key
5. Actualiza el archivo `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=tu_nueva_api_key
   ```
6. Refresca la aplicación

#### **Opción C: Verificar Dominios Autorizados**
1. En Firebase Console, ve a **Authentication** → **Settings**
2. En "Authorized domains", verifica que esté:
   - `localhost`
   - `gestor-licencias-firebas-76c57.firebaseapp.com`

## 🎯 Verificación Final

Una vez solucionado, deberías ver:
1. ✅ **Sin errores en la consola**
2. ✅ **Logs de debug de Firebase**
3. ✅ **Herramientas de desarrollo visibles**
4. ✅ **Página de login funcionando**

## 🔧 Si el Problema Persiste

### **Verificar Navegador:**
- Prueba con Chrome (recomendado)
- Verifica que no haya extensiones bloqueando
- Limpia el caché del navegador

### **Verificar Configuración:**
- Asegúrate de que el servidor esté ejecutándose
- Verifica que estés en el directorio correcto
- Verifica que las variables de entorno se estén cargando

### **Verificar Firebase:**
- Verifica que el proyecto esté activo
- Verifica que la facturación esté configurada (si es necesario)
- Verifica que no haya restricciones de IP

---

**¿Necesitas ayuda adicional?** ¡El problema debería estar solucionado ahora!
