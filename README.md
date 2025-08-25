# 🏢 Gestor de Licencias - Firebase

Sistema completo de gestión de licencias y permisos para empresas, construido con React, TypeScript, Firebase y Tailwind CSS.

## ✨ Características

### 📋 Gestión de Empleados
- ✅ **CRUD completo** de empleados
- ✅ **Importación masiva** (CSV/XLSX)
- ✅ **Exportación masiva** con filtros
- ✅ **Búsqueda y filtros** avanzados
- ✅ **Gestión de departamentos**

### 🎯 Gestión de Licencias
- ✅ **15 tipos de licencias** configurados
- ✅ **Cálculos automáticos** de fechas
- ✅ **Validaciones por género** (maternidad, lactancia)
- ✅ **Control de disponibilidad** anual/mensual
- ✅ **Historial completo** de solicitudes

### 📊 Tipos de Licencias Implementados
- **Por Horas**: Permisos personales (con/sin goce)
- **Por Días**: Enfermedad gravísima, Vacaciones anuales
- **Por Ocasión**: Maternidad, Lactancia, Olvido de marcación, Cambio de turno, etc.

### 🔧 Funcionalidades Técnicas
- ✅ **Firebase Firestore** como base de datos
- ✅ **Autenticación** integrada
- ✅ **Reglas de seguridad** configuradas
- ✅ **Deploy automático** con GitHub Actions
- ✅ **Responsive design** con Tailwind CSS

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/gestor-licencias-firebase.git
cd gestor-licencias-firebase
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
```bash
# Copiar el archivo de ejemplo
cp env.example .env.local

# Editar .env.local con tus credenciales de Firebase
```

### 4. Configurar credenciales de Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **Configuración del proyecto** > **General**
4. En **"Tus apps"**, crea una nueva app web
5. Copia las credenciales y actualiza `.env.local`

### 5. Ejecutar el proyecto
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## 🔧 Configuración de Firebase

### Estructura de Firestore
El sistema crea automáticamente las siguientes colecciones:
- `employees` - Empleados
- `licenseTypes` - Tipos de licencias
- `licenses` - Solicitudes de licencias
- `employeeAvailability` - Disponibilidad de empleados

### Reglas de Seguridad
Las reglas de Firestore están configuradas para:
- ✅ Lectura/escritura autenticada
- ✅ Validación de datos
- ✅ Control de acceso por roles

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI base
│   ├── employees/      # Componentes de empleados
│   └── licenses/       # Componentes de licencias
├── pages/              # Páginas principales
├── stores/             # Estado global (Zustand)
├── services/           # Servicios de Firebase
├── types/              # Tipos TypeScript
├── utils/              # Utilidades
└── lib/                # Configuración de Firebase
```

## 🎯 Uso del Sistema

### 1. Gestión de Empleados
- **Crear empleado**: Formulario completo con validaciones
- **Importar masivamente**: Subir archivo CSV/XLSX
- **Exportar datos**: Con filtros y selección de campos
- **Gestionar disponibilidad**: Ver y configurar licencias por empleado

### 2. Gestión de Licencias
- **Crear solicitud**: Formulario dinámico según tipo de licencia
- **Cálculos automáticos**: Fechas de fin para maternidad/lactancia
- **Validaciones**: Disponibilidad, límites, género
- **Historial**: Ver todas las solicitudes del empleado

### 3. Tipos de Licencias
- **HORAS**: Control anual (PG01: 40h, PS02: 480h)
- **DIAS**: Control anual (GG05: 17 días, VG11: 15 días)
- **OCASION**: Por evento o mensual (MG07, LG08, OM14, CT15)

## 🔄 Deploy Automático

El proyecto incluye GitHub Actions para deploy automático a Firebase Hosting:

1. **Push a main**: Deploy automático a producción
2. **Pull Request**: Deploy a preview
3. **Configuración**: Editar `.github/workflows/firebase-deploy.yml`

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## 📊 Métricas y Monitoreo

- **Firebase Analytics** integrado
- **Logs de auditoría** en Firestore
- **Métricas de uso** por tipo de licencia
- **Reportes de disponibilidad**

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/gestor-licencias-firebase/wiki)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/gestor-licencias-firebase/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/gestor-licencias-firebase/discussions)

## 🎉 Agradecimientos

- **Firebase** por la infraestructura
- **React** y **TypeScript** por el framework
- **Tailwind CSS** por el diseño
- **Zustand** por el manejo de estado

---

**¿Necesitas ayuda?** Abre un issue o contacta al equipo de desarrollo.

