# 🧪 GUÍA PARA PROBAR LA APLICACIÓN

## ✅ Estado Actual - TODO FUNCIONANDO

- ✅ **Servidor**: Ejecutándose en http://localhost:5173
- ✅ **Firebase**: Configurado correctamente
- ✅ **Authentication**: Habilitado
- ✅ **Build**: Sin errores

## 🚀 Pasos para Probar la Aplicación

### **Paso 1: Abrir la Aplicación**
1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Ve a: **http://localhost:5173**
3. Deberías ver la página de login del **Gestor de Licencias**

### **Paso 2: Usar las Herramientas de Desarrollo**
1. En la esquina **inferior derecha** verás un panel con herramientas
2. Haz clic en el botón **"👤 Crear Usuario de Prueba"**
3. Espera a que aparezca el mensaje de confirmación

### **Paso 3: Iniciar Sesión**
1. En el formulario de login, ingresa:
   - **📧 Email**: `admin@test.com`
   - **🔑 Contraseña**: `123456`
2. Haz clic en **"Iniciar Sesión"**

### **Paso 4: Explorar el Dashboard**
1. Una vez logueado, verás el **Dashboard**
2. Verás información del usuario:
   - Nombre: "Administrador de Prueba"
   - Email: admin@test.com
   - Rol: Super Administrador
3. Puedes hacer clic en **"Cerrar Sesión"** para probar el logout

## 🎯 Funcionalidades a Probar

### ✅ **Autenticación**
- [ ] Login con email/password
- [ ] Login con Google (opcional)
- [ ] Logout funcional
- [ ] Persistencia de sesión

### ✅ **UI/UX**
- [ ] Diseño responsive
- [ ] Componentes modernos
- [ ] Navegación fluida
- [ ] Mensajes de error/éxito

### ✅ **Seguridad**
- [ ] Protección de rutas
- [ ] Redirección automática
- [ ] Validación de formularios

## 🔧 Solución de Problemas

### **Si no ves la página:**
1. Verifica que el servidor esté ejecutándose
2. Revisa la consola del navegador (F12)
3. Intenta refrescar la página

### **Si no funciona el login:**
1. Verifica que hayas creado el usuario de prueba
2. Revisa la consola del navegador para errores
3. Asegúrate de que Firebase Authentication esté habilitado

### **Si no ves las herramientas de desarrollo:**
1. Verifica que estés en modo desarrollo
2. Refresca la página
3. Verifica que no haya errores en la consola

## 📱 Compatibilidad

La aplicación funciona en:
- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Dispositivos móviles

## 🎉 ¡Listo para Usar!

Una vez que hayas probado todas las funcionalidades, estarás listo para continuar con la **Fase 2** que incluirá:
- 📁 Gestión de Departamentos
- 👥 Gestión de Empleados
- 🎫 Tipos de Licencias
- 📝 Solicitudes Básicas

---

**¿Necesitas ayuda con algún paso específico?** ¡La aplicación está lista para usar!
