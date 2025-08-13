import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  Home,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const stats = [
    {
      title: 'Empleados Activos',
      value: '156',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Solicitudes Pendientes',
      value: '23',
      change: '+5%',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Licencias Aprobadas',
      value: '89',
      change: '+18%',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Días Disponibles',
      value: '1,247',
      change: '-3%',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    {
      title: 'Nueva Solicitud',
      description: 'Crear solicitud de permiso',
      icon: FileText,
      href: '#',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gestionar Empleados',
      description: 'Ver y editar empleados',
      icon: Users,
      href: '#',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Tipos de Licencia',
      description: 'Configurar permisos',
      icon: Settings,
      href: '#',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas',
      icon: BarChart3,
      href: '#',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Solicitud aprobada',
      user: 'Juan Pérez',
      time: 'Hace 2 horas',
      type: 'success'
    },
    {
      id: 2,
      action: 'Nueva solicitud creada',
      user: 'María García',
      time: 'Hace 4 horas',
      type: 'info'
    },
    {
      id: 3,
      action: 'Empleado registrado',
      user: 'Carlos López',
      time: 'Hace 6 horas',
      type: 'success'
    },
    {
      id: 4,
      action: 'Solicitud rechazada',
      user: 'Ana Martínez',
      time: 'Hace 1 día',
      type: 'warning'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gestor de Licencias
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido de vuelta, {user?.firstName}!
            </h2>
            <p className="text-gray-600">
              Aquí tienes un resumen de la actividad del sistema de gestión de permisos laborales.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className={`${action.color} text-white rounded-lg p-4 text-left transition-colors`}
                    >
                      <action.icon className="h-6 w-6 mb-2" />
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.user}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Estado del Sistema</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Base de Datos</p>
                    <p className="text-sm text-gray-500">Conectado</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Autenticación</p>
                    <p className="text-sm text-gray-500">Activa</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Última Actualización</p>
                    <p className="text-sm text-gray-500">Hace 5 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
