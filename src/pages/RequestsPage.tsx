import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Plus,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface LicenseRequest {
  id: string;
  requestId: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  licenseTypeId: string;
  licenseTypeName: string;
  licenseTypeCode: string;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  reason: string;
  observations?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  totalDays: number;
  totalHours?: number;
  attachments?: string[];
  priority: 'low' | 'medium' | 'high';
  isUrgent: boolean;
}

// Generar solicitudes de ejemplo
const generateSampleRequests = (count: number): LicenseRequest[] => {
  const employees = [
    { id: 'EMP0001', name: 'María González', department: 'Tecnología' },
    { id: 'EMP0002', name: 'Juan Rodríguez', department: 'Recursos Humanos' },
    { id: 'EMP0003', name: 'Carmen López', department: 'Finanzas' },
    { id: 'EMP0004', name: 'Luis Martínez', department: 'Ventas' },
    { id: 'EMP0005', name: 'Sofia Hernández', department: 'Tecnología' },
    { id: 'EMP0006', name: 'Carlos Pérez', department: 'Marketing' },
    { id: 'EMP0007', name: 'Ana García', department: 'Operaciones' },
    { id: 'EMP0008', name: 'Roberto Silva', department: 'Legal' }
  ];

  const licenseTypes = [
    { id: 'LT001', name: 'Vacaciones Anuales', code: 'VAC' },
    { id: 'LT002', name: 'Licencia por Enfermedad', code: 'ENF' },
    { id: 'LT003', name: 'Licencia Personal', code: 'PER' },
    { id: 'LT004', name: 'Licencia por Maternidad', code: 'MAT' },
    { id: 'LT005', name: 'Licencia por Paternidad', code: 'PAT' },
    { id: 'LT006', name: 'Licencia Administrativa', code: 'ADM' }
  ];

  const statuses: ('pending' | 'approved' | 'rejected' | 'cancelled')[] = ['pending', 'approved', 'rejected', 'cancelled'];
  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  return Array.from({ length: count }, (_, index) => {
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const licenseType = licenseTypes[Math.floor(Math.random() * licenseTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      id: String(index + 1),
      requestId: `REQ${String(index + 1).padStart(4, '0')}`,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeDepartment: employee.department,
      licenseTypeId: licenseType.id,
      licenseTypeName: licenseType.name,
      licenseTypeCode: licenseType.code,
      startDate,
      endDate,
      startTime: Math.random() > 0.5 ? '08:00' : undefined,
      endTime: Math.random() > 0.5 ? '17:00' : undefined,
      reason: `Solicitud de ${licenseType.name.toLowerCase()} por ${['asuntos personales', 'salud', 'vacaciones', 'emergencia familiar', 'capacitación'][Math.floor(Math.random() * 5)]}`,
      observations: Math.random() > 0.7 ? 'Observaciones adicionales sobre la solicitud' : undefined,
      status,
      requestedBy: employee.name,
      requestedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      approvedBy: status === 'approved' ? 'Manager RH' : undefined,
      approvedAt: status === 'approved' ? new Date() : undefined,
      rejectedBy: status === 'rejected' ? 'Manager RH' : undefined,
      rejectedAt: status === 'rejected' ? new Date() : undefined,
      rejectionReason: status === 'rejected' ? 'No hay suficientes días disponibles' : undefined,
      totalDays,
      totalHours: Math.random() > 0.5 ? totalDays * 8 : undefined,
      attachments: Math.random() > 0.8 ? ['documento.pdf', 'certificado.jpg'] : undefined,
      priority,
      isUrgent: Math.random() > 0.9
    };
  });
};

// Generar 200 solicitudes de ejemplo
const SAMPLE_REQUESTS: LicenseRequest[] = generateSampleRequests(200);

export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  // Simular carga de datos
  useEffect(() => {
    const loadRequests = () => {
      setRequests(SAMPLE_REQUESTS);
      setLoading(false);
    };

    setTimeout(loadRequests, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    const employeeName = request.employeeName.toLowerCase();
    const requestId = request.requestId.toLowerCase();
    const licenseTypeName = request.licenseTypeName.toLowerCase();
    const reason = request.reason.toLowerCase();
    
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) ||
                         requestId.includes(searchTerm.toLowerCase()) ||
                         licenseTypeName.includes(searchTerm.toLowerCase()) ||
                         reason.includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || request.employeeDepartment === filterDepartment;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  });

  // Calcular paginación
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterDepartment, filterPriority]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'approved': return 'default';
      case 'rejected': return 'secondary';
      case 'cancelled': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'outline';
      case 'medium': return 'default';
      case 'high': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      default: return priority;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleCreateNew = () => {
    navigate('/requests/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/requests/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/requests/view/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      setRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Botón "Primera página"
    if (startPage > 1) {
      buttons.push(
        <Button
          key="first"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          className="px-2"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      );
    }

    // Botón "Anterior"
    if (currentPage > 1) {
      buttons.push(
        <Button
          key="prev"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      );
    }

    // Números de página
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="px-3"
        >
          {i}
        </Button>
      );
    }

    // Botón "Siguiente"
    if (currentPage < totalPages) {
      buttons.push(
        <Button
          key="next"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      );
    }

    // Botón "Última página"
    if (endPage < totalPages) {
      buttons.push(
        <Button
          key="last"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="px-2"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Solicitudes de Licencias
                </h1>
              </div>
            </div>
            <Button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requests.length.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Solicitudes registradas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Esperando aprobación
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Solicitudes aprobadas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {requests.filter(r => r.status === 'rejected').length.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Solicitudes rechazadas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por empleado, ID, tipo de licencia..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="approved">Aprobadas</option>
                    <option value="rejected">Rechazadas</option>
                    <option value="cancelled">Canceladas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">Todos los departamentos</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Legal">Legal</option>
                    <option value="Administración">Administración</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">Todas las prioridades</option>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Mostrando {indexOfFirstRequest + 1} a {Math.min(indexOfLastRequest, filteredRequests.length)} de {filteredRequests.length.toLocaleString()} solicitudes
            </div>
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
          </div>

          {/* Requests Table */}
          <Card className="mb-8">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Solicitud
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empleado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Licencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fechas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {request.requestId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDateTime(request.requestedAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {request.employeeName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.employeeDepartment}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.licenseTypeName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.licenseTypeCode}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.totalDays} días
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(request.status)}>
                            {getStatusLabel(request.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getPriorityBadgeVariant(request.priority)}>
                            {getPriorityLabel(request.priority)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(request.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(request.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(request.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-8">
              {renderPaginationButtons()}
            </div>
          )}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron solicitudes
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' || filterPriority !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Aún no hay solicitudes registradas.'}
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera solicitud
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
