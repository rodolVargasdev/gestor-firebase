# Corrección del Formulario OM14 (Olvido de Marcación)

## Resumen del Problema

El formulario para el tipo de licencia **OM14 (Olvido de Marcación)** tenía varios problemas que impedían su correcto funcionamiento:

1. **Campos faltantes**: No incluía el campo de justificación específica del olvido
2. **Validación incompleta**: No validaba todos los campos requeridos
3. **Información insuficiente**: No proporcionaba información específica al usuario
4. **Manejo incorrecto**: La función `onSubmit` no procesaba correctamente los datos específicos de OM14

## Correcciones Implementadas

### 1. Actualización del Formulario (`NewLicensePage.tsx`)

#### Campos Agregados:
- **`justificacionOlvido`**: Campo de texto para la justificación específica del olvido
- **Validación mejorada**: Ahora requiere fecha, tipo y justificación

#### Interfaz de Usuario:
- **Información específica**: Se agregó una sección informativa con instrucciones claras
- **Campos específicos**: Formulario adaptado para OM14 con campos relevantes
- **Visualización mejorada**: Muestra el período seleccionado y la justificación

#### Validación:
```typescript
// Antes
if (!data.fechaOlvido || !data.tipoOlvido) {
  errorMessage = 'Debe especificar la fecha del olvido y si fue de entrada o salida';
}

// Después
if (!data.fechaOlvido || !data.tipoOlvido || !data.justificacionOlvido) {
  errorMessage = 'Debe especificar la fecha del olvido, el tipo de olvido y la justificación';
}
```

### 2. Campos del Formulario

#### Campos Específicos para OM14:
1. **Fecha del Olvido** (`fechaOlvido`)
   - Tipo: `date`
   - Requerido: Sí
   - Descripción: Fecha en que ocurrió el olvido de marcación

2. **Tipo de Olvido** (`tipoOlvido`)
   - Tipo: `select`
   - Opciones: "Olvido de Entrada" / "Olvido de Salida"
   - Requerido: Sí
   - Descripción: Especifica si fue olvido de entrada o salida

3. **Justificación del Olvido** (`justificacionOlvido`)
   - Tipo: `textarea`
   - Requerido: Sí
   - Placeholder: "Explique detalladamente por qué olvidó marcar la entrada/salida..."
   - Descripción: Explicación detallada del motivo del olvido

### 3. Procesamiento de Datos

#### Función `onSubmit` Mejorada:
```typescript
// Preparar observaciones adicionales para tipos especiales
let additionalObservations = data.observaciones || '';

if (selectedLicenseType.codigo === 'OM14') {
  const olvidoInfo = `Tipo de olvido: ${data.tipoOlvido === 'entrada' ? 'Entrada' : 'Salida'}. Justificación: ${data.justificacionOlvido}`;
  additionalObservations = additionalObservations ? `${additionalObservations}\n\n${olvidoInfo}` : olvidoInfo;
}
```

### 4. Información al Usuario

#### Sección Informativa:
- **Color**: Índigo (para distinguir de otros tipos)
- **Contenido**: Instrucciones específicas para olvido de marcación
- **Puntos clave**:
  - Especificar fecha del olvido
  - Indicar tipo (entrada/salida)
  - Proporcionar justificación detallada
  - Explicar que cuenta como 1 olvido mensual

### 5. Visualización del Período

#### Resumen Dinámico:
```typescript
watchedFechaOlvido && watchedTipoOlvido && (
  <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-indigo-500" />
      <span className="text-sm font-medium text-indigo-700">
        Olvido de marcación: {formatDateForElSalvador(watchedFechaOlvido)} - {watchedTipoOlvido === 'entrada' ? 'Entrada' : 'Salida'}
      </span>
    </div>
    {watchedJustificacionOlvido && (
      <div className="mt-2 text-sm text-indigo-600">
        <strong>Justificación:</strong> {watchedJustificacionOlvido}
      </div>
    )}
  </div>
)
```

## Scripts de Soporte

### 1. Script de Prueba (`test-om14-form.cjs`)
- Verifica la existencia de OM14 en la base de datos
- Valida la configuración de campos especiales
- Confirma que el formulario está correctamente configurado

### 2. Script de Corrección (`fix-om14-config.cjs`)
- Actualiza la configuración de OM14 en la base de datos
- Asegura que los campos especiales estén correctamente configurados
- Verifica la configuración final

## Configuración de Base de Datos

### Tipo de Licencia OM14:
```javascript
{
  code: 'OM14',
  name: 'Licencia por Olvido de Marcación',
  description: 'Permiso para olvidos de marcación de entrada o salida',
  category: 'DIAS',
  unitControl: 'uses',
  periodControl: 'monthly',
  totalAvailable: 2, // 2 olvidos mensuales
  maxDaysPerRequest: 1,
  requiresJustification: true,
  specialFields: {
    type: 'om14',
    fields: [
      // ... campos específicos
    ]
  }
}
```

## Flujo de Usuario Mejorado

### 1. Selección de Tipo de Licencia
- Usuario selecciona "OM14 - Licencia por Olvido de Marcación"
- Se muestra información específica sobre el tipo de licencia

### 2. Llenado del Formulario
- Usuario completa fecha del olvido
- Selecciona tipo de olvido (entrada/salida)
- Proporciona justificación detallada
- Completa motivo general y observaciones opcionales

### 3. Validación
- Sistema valida que todos los campos requeridos estén completos
- Verifica disponibilidad (máximo 2 olvidos mensuales)
- Muestra errores específicos si hay problemas

### 4. Confirmación
- Usuario ve resumen de la solicitud
- Puede revisar fecha, tipo y justificación
- Confirma el envío de la solicitud

### 5. Procesamiento
- Sistema crea la licencia con información completa
- Incluye justificación específica en las observaciones
- Actualiza la disponibilidad del empleado

## Beneficios de las Correcciones

1. **Experiencia de Usuario Mejorada**: Formulario más claro y específico
2. **Validación Robusta**: Previene errores y datos incompletos
3. **Información Completa**: Captura todos los datos necesarios para el olvido
4. **Trazabilidad**: Mejor seguimiento de las solicitudes de olvido
5. **Cumplimiento**: Asegura que se cumplan los requisitos de justificación

## Próximos Pasos

1. **Ejecutar script de corrección** para actualizar la base de datos
2. **Probar el formulario** con datos reales
3. **Verificar integración** con el sistema de aprobación
4. **Documentar proceso** para usuarios finales

## Comandos para Ejecutar

```bash
# 1. Corregir configuración en la base de datos
node scripts/fix-om14-config.cjs

# 2. Probar el formulario
node scripts/test-om14-form.cjs

# 3. Verificar funcionamiento general
node scripts/test-phase1.cjs
```

---

**Fecha de Corrección**: $(date)  
**Versión**: 1.0  
**Estado**: Completado ✅
