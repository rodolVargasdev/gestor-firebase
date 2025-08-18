# Gestor de Licencias - Backend

Este repositorio contiene la configuración y servicios backend para el Sistema de Gestión de Licencias.

## Estructura del Proyecto

### Firebase Services
- **Firestore**: Base de datos NoSQL para empleados, tipos de licencias y solicitudes
- **Authentication**: Sistema de autenticación de usuarios
- **Functions**: Funciones serverless (futuras implementaciones)

### Configuración
- irebase.json: Configuración principal de Firebase
- .firebaserc: Configuración del proyecto Firebase
- dataconnect/: Configuración de Data Connect (si se implementa)

### Scripts de Utilidad
- scripts/: Scripts para configuración, testing y debugging
- src/scripts/: Scripts específicos de la aplicación

## Despliegue
El backend se despliega automáticamente en Firebase cuando se hace push a la rama main.

## Notas
- Por ahora, la aplicación usa Firebase directamente desde el frontend
- Este repositorio queda reservado para futuras Firebase Functions/APIs
