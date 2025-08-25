# 🧪 PRUEBA: MG07 - Licencia por Maternidad (CORREGIDA)

## 📋 **INFORMACIÓN DEL PERMISO**
- **Código**: MG07
- **Nombre**: Licencia por Maternidad
- **Categoría**: DIAS
- **Control**: Por evento (112 días por embarazo)
- **Filtro**: Solo género femenino
- **Cálculo**: Automático de fecha fin y cantidad

## 🔧 **CORRECCIONES IMPLEMENTADAS**

### **1. Cálculo Automático de Fecha Fin**
- ✅ **Trigger**: Cuando se selecciona fecha inicio
- ✅ **Cálculo**: Fecha inicio + 111 días = Fecha fin
- ✅ **Ejemplo**: 01/02/2025 → 25/05/2025 (112 días totales)

### **2. Cálculo Automático de Cantidad**
- ✅ **Trigger**: Cuando se calcula fecha fin automática
- ✅ **Cantidad**: Siempre 112 días (fijo)
- ✅ **Campo**: Se establece automáticamente en el formulario

### **3. Interfaz de Usuario**
- ✅ **Campo fecha fin**: Se calcula automáticamente (no editable)
- ✅ **Campo cantidad**: Se calcula automáticamente (no editable)
- ✅ **Información visual**: Muestra "Cantidad calculada automáticamente: 112 días"

## 🎯 **OBJETIVO DE LA PRUEBA**
Verificar que las correcciones funcionen correctamente:
1. Cálculo automático de fecha fin
2. Cálculo automático de cantidad
3. Interfaz de usuario actualizada
4. Validaciones de género y solapamiento

## 📝 **PASOS DE PRUEBA**

### **1. PREPARACIÓN**
- [ ] Crear empleada femenina con disponibilidad completa
- [ ] Verificar que tenga 112 días disponibles en MG07
- [ ] Confirmar que no tenga embarazos activos

### **2. PRUEBA DE FORMULARIO CORREGIDO**
- [ ] Ir a "Nueva Licencia" para empleada femenina
- [ ] Seleccionar "MG07 - Licencia por Maternidad"
- [ ] Verificar que aparezca campo de fecha inicio
- [ ] **NUEVO**: Verificar que NO aparezca campo de fecha fin (se calcula automáticamente)
- [ ] **NUEVO**: Verificar que NO aparezca campo de cantidad (se calcula automáticamente)

### **3. PRUEBA DE CÁLCULO AUTOMÁTICO CORREGIDO**
- [ ] Ingresar fecha inicio: 01/02/2025
- [ ] **VERIFICAR**: Fecha fin se calcula automáticamente: 25/05/2025
- [ ] **VERIFICAR**: Cantidad se establece automáticamente: 112 días
- [ ] **VERIFICAR**: Se muestra mensaje "Cantidad calculada automáticamente: 112 días"

### **4. PRUEBA DE INTERFAZ CORREGIDA**
- [ ] Verificar que el campo fecha fin esté deshabilitado o no visible
- [ ] Verificar que el campo cantidad esté deshabilitado o no visible
- [ ] Verificar que se muestre la información de cálculo automático
- [ ] Verificar que el período se muestre correctamente

### **5. PRUEBA DE VALIDACIONES**
- [ ] Verificar filtro por género (solo femenino)
- [ ] Verificar validación de solapamiento
- [ ] Verificar que se pueda enviar el formulario

## ✅ **RESULTADOS ESPERADOS**

### **Formulario Corregido**
- ✅ Solo campo fecha inicio visible
- ✅ Fecha fin calculada automáticamente
- ✅ Cantidad calculada automáticamente (112 días)
- ✅ Información visual clara

### **Cálculos Corregidos**
- ✅ 01/02/2025 → 25/05/2025 = 112 días
- ✅ 15/03/2025 → 03/07/2025 = 112 días
- ✅ 01/12/2025 → 22/03/2026 = 112 días

### **Interfaz Corregida**
- ✅ Campos automáticos no editables
- ✅ Mensajes informativos claros
- ✅ Validaciones funcionando

## 🚨 **CASOS ESPECIALES**

### **Año Bisiesto**
- [ ] Probar con fecha inicio en año bisiesto
- [ ] Verificar cálculo correcto con 29 de febrero

### **Cambio de Año**
- [ ] Probar fecha inicio: 01/12/2025
- [ ] Verificar que calcule correctamente en 2026

### **Múltiples Embarazos**
- [ ] Completar primer embarazo
- [ ] Solicitar segundo embarazo
- [ ] Verificar que se resetee disponibilidad

## 📊 **DATOS DE PRUEBA**

### **Empleada de Prueba**
```json
{
  "nombre": "María González",
  "genero": "F",
  "disponibilidad": {
    "licencias_dias": {
      "MG07": {
        "disponible_embarazo_actual": 112,
        "embarazo_activo": false,
        "fecha_ultimo_embarazo": null
      }
    }
  }
}
```

### **Solicitudes de Prueba**
1. **Embarazo 1**: 01/02/2025 - 25/05/2025 (112 días)
2. **Embarazo 2**: 15/06/2025 - 05/10/2025 (112 días)
3. **Embarazo 3**: 01/12/2025 - 22/03/2026 (112 días)

## 🔍 **VERIFICACIONES FINALES**

- [ ] Cálculo automático funciona correctamente
- [ ] Interfaz es clara y fácil de usar
- [ ] Validaciones funcionan correctamente
- [ ] No se pueden editar campos automáticos
- [ ] Información visual es clara

## 📝 **NOTAS ADICIONALES**

- **ANTES**: El formulario no calculaba automáticamente los días
- **DESPUÉS**: El formulario calcula automáticamente fecha fin y cantidad
- **MEJORA**: Interfaz más intuitiva y menos propensa a errores
- **VALIDACIÓN**: Solo empleadas femeninas pueden solicitar

## 🚨 **CASOS CRÍTICOS**

### **Validación de Fechas**
- [ ] No permitir fechas pasadas
- [ ] No permitir fechas muy futuras (más de 9 meses)
- [ ] Validar que sea fecha válida

### **Cálculo de Días**
- [ ] Incluir día de inicio
- [ ] Incluir día de fin
- [ ] Contar días por calendario (no hábiles)

---

**Fecha de prueba**: 24/08/2025
**Estado**: Corregido
**Resultado**: Por verificar
