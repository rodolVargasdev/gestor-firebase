import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Edit,
  Trash2,
  Calendar,
  FileText,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useLicenseStore } from '../stores/licenseStore';
import { useEmployeeStore } from '../stores/employeeStore';
import { type LicenseRequest } from '../types/index';
import { formatDateForElSalvador, formatDateTimeForElSalvador } from '../utils/dateUtils';

export function ViewLicensePage() {
  const { employeeId, requestId } = useParams<{ employeeId: string; requestId: string }>();
  const navigate = useNavigate();
  const [licenseRequest, setLicenseRequest] = useState<LicenseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { licenseRequests, deleteLicenseRequest } = useLicenseStore();
  const { currentEmployee, loadEmployeeById } = useEmployeeStore();

  useEffect(() => {
    if (employeeId) {
      loadEmployeeById(employeeId);
    }
  }, [employeeId, loadEmployeeById]);

  useEffect(() => {
    if (requestId && licenseRequests.length > 0) {
      const request = licenseRequests.find(req => req.id === requestId);
      if (request) {
        setLicenseRequest(request);
      } else {
        setError('Licencia no encontrada');
      }
      setLoading(false);
    }
  }, [requestId, licenseRequests]);

  const handleEditLicense = () => {
    if (employeeId && requestId) {
      navigate(`/employees/${employeeId}/edit-license/${requestId}`);
    }
  };

  const handleDeleteLicense = async () => {
    if (!requestId) return;
    
    try {
      await deleteLicenseRequest(requestId);
      navigate(`/employees/${employeeId}/license-history`);
    } catch (error) {
      console.error('Error deleting license:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatQuantity = (quantity: number, licenseTypeCode?: string): string => {
    // Para licencias por días, mostrar días
    if (licenseTypeCode && ['LG08', 'GG05', 'VG11', 'MG07'].includes(licenseTypeCode)) {
      const days = Math.floor(quantity);
      const remainingHours = Math.round((quantity - days) * 24);
      
      if (days === 0 && remainingHours === 0) {
        return '0 días';
      }
      
      let result = '';
      if (days > 0) {
        result += `${days} día${days !== 1 ? 's' : ''}`;
      }
      if (remainingHours > 0) {
        if (result) result += ' y ';
        result += `${remainingHours} hora${remainingHours !== 1 ? 's' : ''}`;
      }
      
      return result;
    }
    
    // Para licencias por ocasión, mostrar la cantidad como eventos
    if (licenseTypeCode && ['EG03', 'ES04', 'DG06', 'AG09', 'JRV12', 'JU13', 'RH16', 'OM14', 'CT15'].includes(licenseTypeCode)) {
      const events = Math.floor(quantity);
      
      if (events === 0) {
        // Determinar la unidad correcta según el tipo de licencia
        if (licenseTypeCode === 'OM14') {
          return '0 olvidos';
        } else if (licenseTypeCode === 'CT15') {
          return '0 cambios';
        } else {
          return '0 eventos';
        }
      }
      
      // Determinar la unidad correcta según el tipo de licencia
      if (licenseTypeCode === 'OM14') {
        return `${events} olvido${events !== 1 ? 's' : ''}`;
      } else if (licenseTypeCode === 'CT15') {
        return `${events} cambio${events !== 1 ? 's' : ''}`;
      } else {
        return `${events} evento${events !== 1 ? 's' : ''}`;
      }
    }
    
    // Para licencias por horas, mostrar horas y minutos
    const hours = Math.floor(quantity);
    const minutes = Math.round((quantity - hours) * 60);
    
    if (hours === 0 && minutes === 0) {
      return '0 horas';
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
            <span>Cargando licencia...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !licenseRequest) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Licencia no encontrada</h3>
            <p className="text-gray-600 mb-4">{error || 'No se pudo cargar la información de la licencia.'}</p>
            <Button onClick={() => navigate(`/employees/${employeeId}/license-history`)}>
              Volver al Historial
            </Button>
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
            onClick={() => navigate(`/employees/${employeeId}/license-history`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Detalles de Licencia
            </h1>
            <p className="text-gray-600">
              {licenseRequest.licenseTypeName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {licenseRequest.status === 'active' && (
            <>
              <Button
                variant="outline"
                onClick={handleEditLicense}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteLicense}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </>
          )}
        </div>
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
                <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                <p className="font-semibold">{currentEmployee.firstName} {currentEmployee.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Departamento</p>
                <p className="font-semibold">{currentEmployee.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detalles de la licencia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Información de la Licencia</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo de Licencia</p>
                <p className="font-semibold">{licenseRequest.licenseTypeName}</p>
              </div>
              <Badge variant="outline">{licenseRequest.licenseTypeCode}</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                {getStatusBadge(licenseRequest.status)}
              </div>
              {getStatusIcon(licenseRequest.status)}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Cantidad</p>
                              <p className="font-semibold">{formatQuantity(licenseRequest.quantity, licenseRequest.licenseTypeCode)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Motivo</p>
              <p className="text-gray-700">{licenseRequest.reason}</p>
            </div>
            
            {licenseRequest.observations && (
              <div>
                <p className="text-sm font-medium text-gray-500">Observaciones</p>
                <p className="text-gray-700">{licenseRequest.observations}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fechas y tiempos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Fechas y Tiempos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
              <p className="font-semibold">{formatDateForElSalvador(licenseRequest.startDate)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Fin</p>
              <p className="font-semibold">{formatDateForElSalvador(licenseRequest.endDate)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
              <p className="text-sm">{formatDateTimeForElSalvador(licenseRequest.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Última Actualización</p>
              <p className="text-sm">{formatDateTimeForElSalvador(licenseRequest.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Información Adicional</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ID de Solicitud</p>
              <p className="font-mono text-sm">{licenseRequest.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ID de Empleado</p>
              <p className="font-mono text-sm">{licenseRequest.employeeId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
