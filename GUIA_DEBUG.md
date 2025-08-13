# 🔧 GUÍA DE DEBUG - Herramientas de Desarrollo

## ✅ Estado Actual - TODO FUNCIONANDO

- ✅ **Servidor**: Ejecutándose en http://localhost:5173
- ✅ **Build**: Exitoso sin errores
- ✅ **Firebase**: Configurado correctamente
- ✅ **DevTools**: Modificados para debugging

## 🚀 Pasos para Ver las Herramientas de Desarrollo

### **Paso 1: Abrir la Aplicación**
1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Ve a: **http://localhost:5173**
3. Deberías ver la página de login del **Gestor de Licencias**

### **Paso 2: Abrir las Herramientas de Desarrollador**
1. Presiona **F12** en tu navegador
2. Ve a la pestaña **"Console"**
3. Deberías ver estos logs de debug:
   ```
   🔧 LoginPage rendered, DEV mode: true
   🔧 DevTools component rendered
   ```

### **Paso 3: Buscar las Herramientas de Desarrollo**
1. **En la esquina inferior derecha** de la página
2. Deberías ver un panel blanco con:
   - Título: "🛠️ Herramientas de Desarrollo"
   - Botón: "👤 Crear Usuario de Prueba"
   - Botón: "📊 Inicializar Datos"
   - Información del usuario de prueba

### **Paso 4: Si NO ves las herramientas**
1. **Refresca la página** con **Ctrl+F5** (hard refresh)
2. **Verifica la consola** (F12) para errores
3. **Busca en toda la página** - puede estar en otra esquina
4. **Verifica que no haya popups bloqueados**

## 🔍 Ubicación de las Herramientas

Las herramientas de desarrollo están posicionadas con CSS:
```css
position: fixed;
bottom: 1rem;    /* 16px desde abajo */
right: 1rem;     /* 16px desde la derecha */
z-index: 50;     /* Por encima de otros elementos */
```

## 🎯 Qué Deberías Ver

### **Panel de Herramientas:**
```
┌─────────────────────────────────────┐
│ 🛠️ Herramientas de Desarrollo       │
├─────────────────────────────────────┤
│ [👤 Crear Usuario de Prueba]        │
│ [📊 Inicializar Datos]              │
│                                     │
│ Usuario de prueba:                  │
│ 📧 Email: admin@test.com            │
│ 🔑 Contraseña: 123456               │
│ 👤 Rol: Super Administrador         │
└─────────────────────────────────────┘
```

## 🔧 Solución de Problemas

### **Si no ves las herramientas:**

1. **Verifica la consola (F12):**
   - Busca errores en rojo
   - Verifica que aparezcan los logs de debug

2. **Refresca la página:**
   - Usa **Ctrl+F5** para hard refresh
   - O **Ctrl+Shift+R**

3. **Verifica el archivo:**
   - Asegúrate de que `DevTools.tsx` esté correcto
   - Asegúrate de que `LoginPage.tsx` esté correcto

4. **Verifica el navegador:**
   - Prueba con Chrome
   - Verifica que no haya extensiones bloqueando

### **Si ves errores en la consola:**
- Copia y pega los errores para debugging
- Verifica que Firebase esté configurado
- Verifica que las variables de entorno estén correctas

## 🎉 Una Vez que Veas las Herramientas

1. **Haz clic en "👤 Crear Usuario de Prueba"**
2. **Espera el mensaje de confirmación**
3. **Usa las credenciales**:
   - 📧 Email: `admin@test.com`
   - 🔑 Contraseña: `123456`
4. **¡Disfruta de tu aplicación!**

---

**¿Necesitas ayuda adicional?** ¡Las herramientas deberían estar visibles ahora!
