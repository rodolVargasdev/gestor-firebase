# 🏢 Gestor de Licencias Firebase

Sistema integral de gestión de permisos laborales construido con React, TypeScript, Firebase y Tailwind CSS.

## 🚀 Características

- **Autenticación completa** con Firebase Auth (Email/Password y Google)
- **Diseño moderno y responsive** con Tailwind CSS
- **16 tipos de permisos laborales** predefinidos
- **Gestión de empleados y departamentos**
- **Sistema de solicitudes y aprobaciones**
- **Control de disponibilidad en tiempo real**
- **Interfaz intuitiva y profesional**

## 📋 Tipos de Permisos Incluidos

1. **PG01** - Licencia Personal con Goce de Salario (40 horas anuales)
2. **PS02** - Licencia Personal sin Goce de Salario (560 horas anuales)
3. **EG03** - Licencia por Enfermedad con Goce de Salario (máx. 3 días)
4. **ES04** - Licencia por Enfermedad sin Goce de Salario
5. **GG05** - Licencia por Enfermedad Gravísima de Pariente (17 días anuales)
6. **DG06** - Licencia por Duelo (máx. 3 días)
7. **MG07** - Licencia por Maternidad (112 días)
8. **LG08** - Licencia por Lactancia Materna (6 meses)
9. **AG09** - Licencia por Paternidad (máx. 3 días)
10. **OG10** - Licencia por Matrimonio (máx. 3 días)
11. **VG11** - Vacaciones Anuales (15 días)
12. **JRV12** - Licencia por Cargo en Junta Receptora de Votos
13. **JU13** - Licencia por Ser Llamado a Conformar Jurado
14. **OM14** - Licencia por Olvido de Marcación (2 mensuales)
15. **CT15** - Licencia por Cambio de Turno (3 mensuales)
16. **RH16** - Licencia por Movimiento de Recurso Humano

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18+ con TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd gestor-licencias-firebase
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Authentication (Email/Password y Google)
   - Habilita Firestore Database
   - Copia las credenciales a `src/lib/firebase.ts`

4. **Inicializar datos de prueba** (opcional)
   ```bash
   node init-test-data.cjs
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración de Firebase

### 1. Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Anota el ID del proyecto

### 2. Configurar Authentication
1. Ve a Authentication > Sign-in method
2. Habilita "Email/Password"
3. Habilita "Google"
4. Configura el dominio autorizado

### 3. Configurar Firestore
1. Ve a Firestore Database
2. Crea una base de datos en modo de prueba
3. Configura las reglas de seguridad

### 4. Obtener Credenciales
1. Ve a Project Settings > General
2. En "Your apps", crea una nueva app web
3. Copia la configuración a `src/lib/firebase.ts`

## 🚀 Uso del Sistema

### Acceso Inicial
1. Abre `http://localhost:5173`
2. Verás la página de login con diseño moderno
3. Usa las credenciales de prueba:
   - **Email**: `admin@test.com`
   - **Password**: `123456`
4. O usa el botón "Continuar con Google"

### Funcionalidades Disponibles

#### 🔐 Autenticación
- Login con email/password
- Login con Google
- Protección de rutas
- Gestión de sesiones

#### 👥 Gestión de Usuarios
- Roles: Super Admin, Admin, Manager, Viewer
- Perfiles de usuario
- Gestión de permisos

#### 🏢 Gestión de Departamentos
- Crear y editar departamentos
- Asignar gerentes
- Control de acceso por departamento

#### 👤 Gestión de Empleados
- Registro de empleados
- Información personal y laboral
- Asignación a departamentos
- Control de disponibilidad

#### 📋 Gestión de Permisos
- 16 tipos predefinidos
- Configuración personalizable
- Control de períodos y unidades
- Validaciones específicas

#### 📝 Solicitudes de Permisos
- Crear solicitudes
- Flujo de aprobación
- Control de disponibilidad
- Historial de solicitudes

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Componentes de autenticación
│   ├── ui/             # Componentes de interfaz
│   └── dev/            # Herramientas de desarrollo
├── pages/              # Páginas de la aplicación
├── services/           # Servicios de Firebase
├── stores/             # Estado global (Zustand)
├── types/              # Tipos TypeScript
├── lib/                # Utilidades y configuración
└── scripts/            # Scripts de inicialización
```

## 🎨 Diseño y UX

### Características del Diseño
- **Responsive**: Funciona en móvil, tablet y desktop
- **Moderno**: Gradientes, sombras y animaciones
- **Accesible**: Cumple estándares de accesibilidad
- **Intuitivo**: Navegación clara y flujos optimizados

### Componentes UI
- **Button**: Múltiples variantes y estados
- **Input**: Campos de entrada con validación
- **Form**: Formularios con React Hook Form
- **Modal**: Ventanas modales para acciones
- **Table**: Tablas con paginación y filtros

## 🔒 Seguridad

### Autenticación
- Firebase Authentication
- Protección de rutas
- Gestión de sesiones
- Roles y permisos

### Base de Datos
- Reglas de seguridad de Firestore
- Validación de datos
- Control de acceso por rol
- Auditoría de cambios

## 📊 Estado del Proyecto

### ✅ Completado
- [x] Configuración inicial del proyecto
- [x] Autenticación con Firebase
- [x] Diseño de la interfaz de login
- [x] Sistema de rutas protegidas
- [x] Tipos TypeScript completos
- [x] Componentes UI básicos
- [x] Store de autenticación

### 🚧 En Desarrollo
- [ ] Gestión de tipos de licencias
- [ ] Gestión de empleados
- [ ] Sistema de solicitudes
- [ ] Dashboard completo
- [ ] Reportes y analytics

### 📋 Pendiente
- [ ] Tests unitarios y de integración
- [ ] Documentación completa
- [ ] Optimización de rendimiento
- [ ] Despliegue en producción

## 🧪 Testing

### Scripts de Verificación
```bash
# Verificar estado del sistema
node test-system.cjs

# Inicializar datos de prueba
node init-test-data.cjs
```

### Pruebas Manuales
1. **Login**: Verificar autenticación con email/password y Google
2. **Navegación**: Probar rutas protegidas
3. **Responsive**: Verificar en diferentes tamaños de pantalla
4. **Performance**: Verificar tiempos de carga

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Revisa la documentación
- Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para la gestión eficiente de permisos laborales**
