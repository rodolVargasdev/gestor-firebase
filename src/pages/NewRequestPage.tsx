import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Save,
  Calendar,
  User,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Building,
  Mail,
  CalendarDays,
  Clock as ClockIcon
} from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on_leave';
}

interface LicenseType {
  id: string;
  name: string;
  code: string;
  category: string;
  unitControl: 'days' | 'hours' | 'uses';
  periodControl: 'annual' | 'monthly' | 'quarterly' | 'none';
  totalAvailable: number;
  maxDaysPerRequest: number;
  requiresJustification: boolean;
  isActive: boolean;
}

interface NewRequestForm {
  employeeId: string;
  licenseTypeId: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  observations?: string;
  priority: 'low' | 'medium' | 'high';
  isUrgent: boolean;
}

// Datos de ejemplo
const SAMPLE_EMPLOYEES: Employee[] = [
  { id: '1', employeeId: 'EMP0001', firstName: 'María', lastName: 'González', email: 'maria.gonzalez@empresa.com', department: 'Tecnología', position: 'Desarrollador Senior', status: 'active' },
  { id: '2', employeeId: 'EMP0002', firstName: 'Juan', lastName: 'Rodríguez', email: 'juan.rodriguez@empresa.com', department: 'Recursos Humanos', position: 'Analista de RH', status: 'active' },
  { id: '3', employeeId: 'EMP0003', firstName: 'Carmen', lastName: 'López', email: 'carmen.lopez@empresa.com', department: 'Finanzas', position: 'Contadora', status: 'active' },
  { id: '4', employeeId: 'EMP0004', firstName: 'Luis', lastName: 'Martínez', email: 'luis.martinez@empresa.com', department: 'Ventas', position: 'Gerente de Ventas', status: 'active' },
  { id: '5', employeeId: 'EMP0005', firstName: 'Sofia', lastName: 'Hernández', email: 'sofia.hernandez@empresa.com', department: 'Tecnología', position: 'Diseñadora UX/UI', status: 'active' }
];

const SAMPLE_LICENSE_TYPES: LicenseType[] = [
  { id: 'LT001', name: 'Vacaciones Anuales', code: 'VAC', category: 'Personal', unitControl: 'days', periodControl: 'annual', totalAvailable: 15, maxDaysPerRequest: 15, requiresJustification: false, isActive: true },
  { id: 'LT002', name: 'Licencia por Enfermedad', code: 'ENF', category: 'Enfermedad', unitControl: 'days', periodControl: 'annual', totalAvailable: 30, maxDaysPerRequest: 30, requiresJustification: true, isActive: true },
  { id: 'LT003', name: 'Licencia Personal', code: 'PER', category: 'Personal', unitControl: 'days', periodControl: 'annual', totalAvailable: 5, maxDaysPerRequest: 3, requiresJustification: true, isActive: true },
  { id: 'LT004', name: 'Licencia por Maternidad', code: 'MAT', category: 'Maternidad', unitControl: 'days', periodControl: 'none', totalAvailable: 84, maxDaysPerRequest: 84, requiresJustification: true, isActive: true },
  { id: 'LT005', name: 'Licencia por Paternidad', code: 'PAT', category: 'Familiar', unitControl: 'days', periodControl: 'none', totalAvailable: 10, maxDaysPerRequest: 10, requiresJustification: true, isActive: true },
  { id: 'LT006', name: 'Licencia Administrativa', code: 'ADM', category: 'Administrativa', unitControl: 'hours', periodControl: 'monthly', totalAvailable: 40, maxDaysPerRequest: 8, requiresJustification: true, isActive: true }
];

export const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedLicenseType, setSelectedLicenseType] = useState<LicenseType | null>(null);
  const [availableDays, setAvailableDays] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);

  const [form, setForm] = useState<NewRequestForm>({
    employeeId: '',
    licenseTypeId: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    reason: '',
    observations: '',
    priority: 'medium',
    isUrgent: false
  });

  // Simular carga de datos
  useEffect(() => {
    const loadData = () => {
      setEmployees(SAMPLE_EMPLOYEES);
      setLicenseTypes(SAMPLE_LICENSE_TYPES);
      setLoading(false);
    };

    setTimeout(loadData, 1000);
  }, []);

  // Actualizar empleado seleccionado
  useEffect(() => {
    if (form.employeeId) {
      const employee = employees.find(emp => emp.id === form.employeeId);
      setSelectedEmployee(employee || null);
    } else {
      setSelectedEmployee(null);
    }
  }, [form.employeeId, employees]);

  // Actualizar tipo de licencia seleccionado
  useEffect(() => {
    if (form.licenseTypeId) {
      const licenseType = licenseTypes.find(lt => lt.id === form.licenseTypeId);
      setSelectedLicenseType(licenseType || null);
      setAvailableDays(licenseType?.totalAvailable || 0);
    } else {
      setSelectedLicenseType(null);
      setAvailableDays(0);
    }
  }, [form.licenseTypeId, licenseTypes]);

  // Calcular días totales
  useEffect(() => {
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);
    } else {
      setTotalDays(0);
    }
  }, [form.startDate, form.endDate]);

  const handleInputChange = (field: keyof NewRequestForm, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!form.employeeId) errors.push('Debe seleccionar un empleado');
    if (!form.licenseTypeId) errors.push('Debe seleccionar un tipo de licencia');
    if (!form.startDate) errors.push('Debe seleccionar fecha de inicio');
    if (!form.endDate) errors.push('Debe seleccionar fecha de fin');
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
      errors.push('La fecha de inicio no puede ser posterior a la fecha de fin');
    }
    if (selectedLicenseType && totalDays > selectedLicenseType.maxDaysPerRequest) {
      errors.push(`Máximo ${selectedLicenseType.maxDaysPerRequest} días permitidos para este tipo de licencia`);
    }
    if (selectedLicenseType?.requiresJustification && !form.reason.trim()) {
      errors.push('Debe proporcionar una justificación para este tipo de licencia');
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      alert('Errores de validación:\n' + validation.errors.join('\n'));
      return;
    }

    setSaving(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear la solicitud
      const newRequest = {
        id: Date.now().toString(),
        requestId: `REQ${Date.now()}`,
        employeeId: form.employeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
        employeeDepartment: selectedEmployee?.department || '',
        licenseTypeId: form.licenseTypeId,
        licenseTypeName: selectedLicenseType?.name || '',
        licenseTypeCode: selectedLicenseType?.code || '',
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        reason: form.reason,
        observations: form.observations || undefined,
        status: 'pending' as const,
        requestedBy: 'Administrador',
        requestedAt: new Date(),
        totalDays,
        totalHours: selectedLicenseType?.unitControl === 'hours' ? totalDays * 8 : undefined,
        priority: form.priority,
        isUrgent: form.isUrgent
      };

      console.log('Nueva solicitud creada:', newRequest);
      
      alert('Solicitud creada exitosamente');
      navigate('/requests');
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      alert('Error al crear la solicitud. Intente nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando formulario...</p>
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
                onClick={() => navigate('/requests')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Nueva Solicitud de Licencia
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Empleado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Información del Empleado</span>
                </CardTitle>
                <CardDescription>
                  Seleccione el empleado para quien se creará la solicitud
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empleado *
                  </label>
                  <select
                    value={form.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar empleado</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.employeeId} - {employee.firstName} {employee.lastName} ({employee.department})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEmployee && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedEmployee.firstName} {selectedEmployee.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedEmployee.department}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedEmployee.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'}>
                          {selectedEmployee.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tipo de Licencia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Tipo de Licencia</span>
                </CardTitle>
                <CardDescription>
                  Seleccione el tipo de licencia que se solicitará
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Licencia *
                  </label>
                  <select
                    value={form.licenseTypeId}
                    onChange={(e) => handleInputChange('licenseTypeId', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar tipo de licencia</option>
                    {licenseTypes.filter(lt => lt.isActive).map(licenseType => (
                      <option key={licenseType.id} value={licenseType.id}>
                        {licenseType.code} - {licenseType.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedLicenseType && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Categoría:</span>
                        <p className="text-sm text-gray-600">{selectedLicenseType.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Disponible:</span>
                        <p className="text-sm text-gray-600">
                          {selectedLicenseType.totalAvailable} {selectedLicenseType.unitControl === 'days' ? 'días' : 'horas'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Máximo por solicitud:</span>
                        <p className="text-sm text-gray-600">
                          {selectedLicenseType.maxDaysPerRequest} {selectedLicenseType.unitControl === 'days' ? 'días' : 'horas'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fechas y Horarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Fechas y Horarios</span>
                </CardTitle>
                <CardDescription>
                  Defina el período de la licencia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {selectedLicenseType?.unitControl === 'hours' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Inicio
                      </label>
                      <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Fin
                      </label>
                      <input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {totalDays > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Total de días: {totalDays}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Justificación y Observaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Justificación y Observaciones</span>
                </CardTitle>
                <CardDescription>
                  Proporcione los detalles de la solicitud
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLicenseType?.requiresJustification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Justificación *
                    </label>
                    <textarea
                      value={form.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Describa el motivo de la solicitud..."
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={form.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Observaciones adicionales (opcional)..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prioridad y Configuración */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5" />
                  <span>Prioridad y Configuración</span>
                </CardTitle>
                <CardDescription>
                  Configure la prioridad y características especiales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      checked={form.isUrgent}
                      onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700">
                      Solicitud Urgente
                    </label>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${getPriorityColor(form.priority)}`}>
                  <div className="flex items-center space-x-2">
                    {form.priority === 'high' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : form.priority === 'medium' ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      Prioridad: {form.priority === 'high' ? 'Alta' : form.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  {form.isUrgent && (
                    <div className="flex items-center space-x-2 mt-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Solicitud marcada como urgente</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resumen de Validación */}
            {selectedLicenseType && totalDays > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Resumen de Validación</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Días solicitados:</span>
                      <span className="text-sm font-medium">{totalDays}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Máximo permitido:</span>
                      <span className="text-sm font-medium">{selectedLicenseType.maxDaysPerRequest}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Disponible:</span>
                      <span className="text-sm font-medium">{availableDays}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estado:</span>
                        <Badge variant={totalDays <= selectedLicenseType.maxDaysPerRequest ? 'default' : 'secondary'}>
                          {totalDays <= selectedLicenseType.maxDaysPerRequest ? 'Válido' : 'Excede límite'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/requests')}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Solicitud
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
