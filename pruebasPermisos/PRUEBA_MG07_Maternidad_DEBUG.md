# 🧪 PRUEBA: MG07 - Licencia por Maternidad (DEBUG)

## 📋 **INFORMACIÓN DEL PERMISO**
- **Código**: MG07
- **Nombre**: Licencia por Maternidad
- **Categoría**: DIAS
- **Control**: Por evento (112 días por embarazo)
- **Filtro**: Solo género femenino
- **Cálculo**: Automático de fecha fin y cantidad

## 🔧 **CORRECCIONES IMPLEMENTADAS CON DEBUG**

### **1. Console.log Agregados**
- ✅ **useEffect fecha fin**: Log cuando se ejecuta el cálculo automático
- ✅ **Tipo de licencia**: Log cuando se selecciona MG07
- ✅ **Cálculo fecha fin**: Log del proceso de cálculo
- ✅ **Cálculo cantidad**: Log del proceso de cálculo de cantidad

### **2. Interfaz Corregida**
- ✅ **Campo fecha fin**: Ocultado para licencias con cálculo automático
- ✅ **Campo cantidad**: Ocultado para licencias con cálculo automático
- ✅ **Información visual**: Muestra "Fecha fin se calcula automáticamente"

## 🎯 **OBJETIVO DE LA PRUEBA**
Verificar que las correcciones funcionen correctamente con debugging:
1. Cálculo automático de fecha fin
2. Cálculo automático de cantidad
3. Interfaz de usuario actualizada
4. Console.log funcionando

## 📝 **PASOS DE PRUEBA**

### **1. PREPARACIÓN**
- [ ] Abrir DevTools (F12) en el navegador
- [ ] Ir a la pestaña Console
- [ ] Ir a "Nueva Licencia" para empleada femenina

### **2. PRUEBA DE SELECCIÓN DE LICENCIA**
- [ ] Seleccionar "MG07 - Licencia por Maternidad"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🎯 Tipo de licencia seleccionado:"
- [ ] **VERIFICAR**: Debe mostrar `calculo_automatico_fecha_fin: true`

### **3. PRUEBA DE CÁLCULO AUTOMÁTICO**
- [ ] Ingresar fecha inicio: 01/02/2025
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🔍 useEffect fecha fin automática:"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🔄 Calculando fecha fin automática para: MG07"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🔧 Calculando fecha fin automática:"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "👶 Fecha fin maternidad calculada: 2025-05-25"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🔢 Calculando cantidad automática:"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "👶 Cantidad MG07: 112 días (maternidad)"

### **4. PRUEBA DE INTERFAZ**
- [ ] **VERIFICAR**: Campo fecha fin NO debe estar visible
- [ ] **VERIFICAR**: Debe mostrar "Fecha fin se calcula automáticamente"
- [ ] **VERIFICAR**: Campo cantidad NO debe estar visible
- [ ] **VERIFICAR**: Debe mostrar "Cantidad calculada automáticamente: 112 días"

## ✅ **RESULTADOS ESPERADOS**

### **Console.log Esperados**
```
🎯 Tipo de licencia seleccionado: {codigo: 'MG07', calculo_automatico_fecha_fin: true, ...}
🔍 useEffect fecha fin automática: {selectedLicenseType: 'MG07', calculo_automatico: true, watchedFechaInicio: '2025-02-01'}
🔄 Calculando fecha fin automática para: MG07
🔧 Calculando fecha fin automática: {codigo: 'MG07', fechaInicio: '2025-02-01'}
👶 Fecha fin maternidad calculada: 2025-05-25
📅 Fecha fin calculada: 2025-05-25
🔢 Calculando cantidad automática: {codigo: 'MG07', fechaInicio: '2025-02-01', fechaFin: '2025-05-25'}
👶 Cantidad MG07: 112 días (maternidad)
📊 Cantidad calculada: 112
```

### **Interfaz Esperada**
- ✅ Solo campo fecha inicio visible
- ✅ Información "Fecha fin se calcula automáticamente"
- ✅ Información "Cantidad calculada automáticamente: 112 días"
- ✅ No campos de entrada para fecha fin o cantidad

## 🚨 **CASOS DE ERROR**

### **Si no aparecen los console.log**
- [ ] Verificar que DevTools esté abierto
- [ ] Verificar que esté en la pestaña Console
- [ ] Verificar que no haya errores de JavaScript
- [ ] Recargar la página y probar nuevamente

### **Si no se calcula automáticamente**
- [ ] Verificar que MG07 tenga `calculo_automatico_fecha_fin: true`
- [ ] Verificar que el useEffect se esté ejecutando
- [ ] Verificar que las funciones de cálculo estén importadas

## 📊 **DATOS DE PRUEBA**

### **Fechas de Prueba**
1. **01/02/2025** → **25/05/2025** (112 días)
2. **15/03/2025** → **03/07/2025** (112 días)
3. **01/12/2025** → **22/03/2026** (112 días)

### **Cálculos Esperados**
- **Maternidad**: Siempre 112 días
- **Fecha fin**: Fecha inicio + 111 días
- **Cantidad**: 112 días (fijo)

## 🔍 **VERIFICACIONES FINALES**

- [ ] Console.log aparecen correctamente
- [ ] Cálculo automático funciona
- [ ] Interfaz es clara
- [ ] No campos editables para valores automáticos
- [ ] Información visual es clara

---

**Fecha de prueba**: 24/08/2025
**Estado**: Con debugging
**Resultado**: Por verificar
