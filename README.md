# 🏢 Gestor de Licencias Firebase

Sistema completo de gestión de licencias y permisos para empleados, desarrollado con React, TypeScript y Firebase.

## 🚀 Características

- **Gestión de Empleados**: CRUD completo con importación/exportación CSV
- **Tipos de Licencias**: Configuración flexible (Por Horas, Por Días, Por Ocasión)
- **Solicitudes de Licencias**: Formularios dinámicos según tipo de licencia
- **Control de Disponibilidad**: Seguimiento automático de horas/días disponibles
- **Historial Completo**: Registro detallado de todas las solicitudes
- **Autenticación**: Sistema de login seguro con Firebase Auth
- **Responsive Design**: Interfaz adaptativa para todos los dispositivos

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **Estado**: Zustand
- **Formularios**: React Hook Form + Zod
- **UI**: Shadcn/ui components

## 📋 Tipos de Licencias

### Por Horas (HORAS)
- **PG01**: Permisos Generales (anual)
- **PS02**: Permisos Especiales (anual)

### Por Días (DIAS)
- **VG11**: Vacaciones Generales (anual)
- **GG05**: Goce de Gracia (mensual)

### Por Ocasión (OCASION)
- **OM14**: Olvido de Marcación (mensual)
- **CT15**: Cambio de Turno (mensual)
- **LG08**: Lactancia Materna (anual)

## 🚀 Despliegue Automático

Este proyecto utiliza GitHub Actions para despliegue automático a Firebase Hosting.

### Configuración de Secrets

Para que el despliegue automático funcione, necesitas configurar los siguientes secrets en tu repositorio de GitHub:

1. Ve a tu repositorio en GitHub
2. Navega a **Settings** → **Secrets and variables** → **Actions**
3. Añade el siguiente secret:

**FIREBASE_SERVICE_ACCOUNT**: Contenido del archivo JSON de tu cuenta de servicio de Firebase

### Obtener la cuenta de servicio de Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** → **Service accounts**
4. Haz clic en **Generate new private key**
5. Descarga el archivo JSON
6. Copia todo el contenido del archivo JSON al secret `FIREBASE_SERVICE_ACCOUNT`

## 🏃‍♂️ Desarrollo Local

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/rodolVargasdev/gestor-firebase.git
cd gestor-firebase

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus credenciales de Firebase

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
npm run lint         # Linting del código
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── employees/      # Componentes de empleados
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes de UI base
├── pages/              # Páginas de la aplicación
├── services/           # Servicios de API
├── stores/             # Estado global (Zustand)
├── types/              # Definiciones de TypeScript
└── utils/              # Utilidades y helpers
```

## 🔧 Configuración de Firebase

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Para desarrollo
    }
  }
}
```

### Índices Requeridos

```json
{
  "indexes": [
    {
      "collectionGroup": "licenseRequests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "employeeId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 📝 Documentación

- [Guía de Configuración](guia-gestor-licencias-firebase.md)
- [Análisis de Permisos](ANALISIS_PERMISOS.md)
- [Correcciones Implementadas](CORRECCIONES_COMPLETAS.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ por [Tu Nombre]**
# gestor-firebase
# Test de GitHub Actions
