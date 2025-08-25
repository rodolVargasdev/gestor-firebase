import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { type Employee } from '../../types';

interface EmployeeSearchProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onEmployeeSelect: (employee: Employee | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  employees,
  selectedEmployee,
  onEmployeeSelect,
  placeholder = "Buscar empleado por código o nombre...",
  disabled = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar empleados basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee => {
        const searchLower = searchTerm.toLowerCase();
        const employeeId = employee.employeeId.toLowerCase();
        const firstName = employee.firstName.toLowerCase();
        const lastName = employee.lastName.toLowerCase();
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        
        return employeeId.includes(searchLower) || 
               firstName.includes(searchLower) || 
               lastName.includes(searchLower) ||
               fullName.includes(searchLower);
      });
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmployeeSelect = (employee: Employee) => {
    onEmployeeSelect(employee);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onEmployeeSelect(null);
    setSearchTerm('');
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={selectedEmployee ? `${selectedEmployee.employeeId} - ${selectedEmployee.firstName} ${selectedEmployee.lastName}` : searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {selectedEmployee && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 mr-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredEmployees.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">
              {searchTerm ? 'No se encontraron empleados' : 'No hay empleados disponibles'}
            </div>
          ) : (
            <div className="py-1">
              {filteredEmployees.map((employee) => (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => handleEmployeeSelect(employee)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {employee.employeeId} - {employee.firstName} {employee.lastName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {employee.department} • {employee.position}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
