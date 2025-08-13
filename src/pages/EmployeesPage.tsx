import React from 'react';
import { EmployeeList } from '../components/employees/EmployeeList';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { useEmployeeStore } from '../stores/employeeStore';

export const EmployeesPage: React.FC = () => {
  const { isFormOpen, currentEmployee, closeForm } = useEmployeeStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <EmployeeList />
      
      {isFormOpen && (
        <EmployeeForm
          employee={currentEmployee || undefined}
          onClose={closeForm}
        />
      )}
    </div>
  );
};
