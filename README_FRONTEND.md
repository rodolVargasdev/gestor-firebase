# Gestor de Licencias - Frontend

Sistema de gestión de licencias y permisos para empleados desarrollado en React con TypeScript.

##  Características

- **Gestión de Empleados**: CRUD completo con importación/exportación masiva
- **Sistema de Licencias**: Tipos configurables (horas, días, ocasiones especiales)
- **Control de Disponibilidad**: Seguimiento automático de licencias disponibles
- **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- **Autenticación**: Sistema de login seguro con Firebase Auth

##  Tecnologías

- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Zustand** para manejo de estado
- **React Hook Form** con validación Zod
- **Firebase Firestore** como base de datos
- **React Router** para navegación

##  Instalación

`ash
# Clonar el repositorio
git clone https://github.com/goes-infraestructura/gestor-licencias-frontend.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales de Firebase

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
`

##  Configuración

### Variables de Entorno
`env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=tu_app_id
`

##  Estructura del Proyecto

`
src/
 components/          # Componentes reutilizables
    auth/           # Componentes de autenticación
    employees/      # Componentes de empleados
    layout/         # Componentes de layout
    ui/             # Componentes de UI base
 pages/              # Páginas de la aplicación
 services/           # Servicios de API
 stores/             # Stores de Zustand
 types/              # Definiciones de TypeScript
 utils/              # Utilidades y helpers
 scripts/            # Scripts de utilidad
`

##  Despliegue

### Google Cloud Run
`ash
# Construir imagen Docker
docker build -t gestor-licencias-frontend .

# Desplegar en Cloud Run
gcloud run deploy gestor-licencias-frontend \
  --image gestor-licencias-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
`

### Firebase Hosting
`ash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login y configuración
firebase login
firebase init hosting

# Desplegar
npm run build
firebase deploy --only hosting
`

##  Funcionalidades Principales

### Empleados
-  Crear, editar, ver y eliminar empleados
-  Importar empleados desde Excel/CSV
-  Exportar datos de empleados
-  Búsqueda y filtrado avanzado
-  Paginación configurable

### Licencias
-  Crear solicitudes de licencia
-  Historial completo de licencias
-  Editar y eliminar licencias
-  Control de disponibilidad automático
-  Validaciones de fechas y cantidades

### Tipos de Licencia
-  Licencias por horas (con minutos)
-  Licencias por días completos
-  Licencias por ocasiones especiales
-  Control de períodos (anual/mensual)

##  Seguridad

- Autenticación con Firebase Auth
- Validación de formularios con Zod
- Sanitización de datos de entrada
- Control de acceso basado en roles

##  Soporte

Para reportar bugs o solicitar nuevas funcionalidades, crear un issue en este repositorio.

##  Licencia

Este proyecto es propiedad de GOES Infraestructura.
