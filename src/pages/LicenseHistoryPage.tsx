import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useLicenseStore } from '../stores/licenseStore';
import { useEmployeeStore } from '../stores/employeeStore';
import { type LicenseRequest } from '../types/index';
import { formatDateForElSalvador, formatDateTimeForElSalvador } from '../utils/dateUtils';

export function LicenseHistoryPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    licenseRequests,
    loading,
    error,
    loadEmployeeLicenseRequests,
    deleteLicenseRequest,
    clearError
  } = useLicenseStore();

  const { currentEmployee, loadEmployeeById } = useEmployeeStore();

  useEffect(() => {
    if (employeeId) {
      loadEmployeeById(employeeId);
      loadEmployeeLicenseRequests(employeeId);
    }
  }, [employeeId, loadEmployeeById, loadEmployeeLicenseRequests]);

  // Filtrar licencias
  const filteredRequests = licenseRequests.filter(request => {
    const matchesSearch = 
      request.licenseTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.licenseTypeCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleNewLicense = () => {
    if (employeeId) {
      navigate(`/employees/${employeeId}/new-license`);
    }
  };

  const handleEditLicense = (requestId: string) => {
    if (employeeId) {
      navigate(`/employees/${employeeId}/edit-license/${requestId}`);
    }
  };

  const handleViewLicense = (requestId: string) => {
    if (employeeId) {
      navigate(`/employees/${employeeId}/view-license/${requestId}`);
    }
  };

  const handleDeleteLicense = async (requestId: string) => {
    setIsDeleting(true);
    try {
      await deleteLicenseRequest(requestId);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting license:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatQuantity = (quantity: number): string => {
    const hours = Math.floor(quantity);
    const minutes = Math.round((quantity - hours) * 60);
    
    if (hours === 0 && minutes === 0) {
      return '0 minutos';
    }
    
    let result = '';
    if (hours > 0) {
      result += `${hours} hora${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (result) result += ' y ';
      result += `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
    
    return result;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando historial...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar historial</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={clearError}>Reintentar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/employees/${employeeId}/availability`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Historial de Licencias
            </h1>
            <p className="text-gray-600">
              {currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : 'Empleado'}
            </p>
          </div>
        </div>
        
        <Button onClick={handleNewLicense}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Licencia
        </Button>
      </div>

      {/* Información del empleado */}
      {currentEmployee && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Información del Empleado</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">ID de Empleado</p>
                <p className="font-semibold">{currentEmployee.employeeId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Departamento</p>
                <p className="font-semibold">{currentEmployee.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cargo</p>
                <p className="font-semibold">{currentEmployee.position}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros y Búsqueda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por tipo, motivo o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="cancelled">Canceladas</option>
                <option value="completed">Completadas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de licencias */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No se encontraron licencias' : 'No hay licencias registradas'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Este empleado aún no tiene licencias registradas'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={handleNewLicense}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Licencia
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {filteredRequests.length} de {licenseRequests.length} licencias
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadEmployeeLicenseRequests(employeeId!)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
            
            {filteredRequests.map((request: LicenseRequest) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold">{request.licenseTypeName}</h3>
                        {getStatusBadge(request.status)}
                        <Badge variant="outline">{request.licenseTypeCode}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Período</p>
                          <p className="text-sm">
                            {formatDateForElSalvador(request.startDate)} - {formatDateForElSalvador(request.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cantidad</p>
                          <p className="text-sm">{formatQuantity(request.quantity)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Motivo</p>
                          <p className="text-sm truncate">{request.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Creada</p>
                          <p className="text-sm">{formatDateTimeForElSalvador(request.createdAt)}</p>
                        </div>
                      </div>
                      
                      {request.observations && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500">Observaciones</p>
                          <p className="text-sm text-gray-600">{request.observations}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLicense(request.id)}
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === 'active' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditLicense(request.id)}
                            title="Editar licencia"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteModal(request.id)}
                            title="Eliminar licencia"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>Confirmar Eliminación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que quieres eliminar esta licencia? Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(null)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteLicense(showDeleteModal)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
