import React from 'react';
import { RequestList } from '../components/requests/RequestList';
import { RequestForm } from '../components/requests/RequestForm';
import { useRequestStore } from '../stores/requestStore';

export const RequestsPage: React.FC = () => {
  const { isFormOpen, currentRequest, closeForm } = useRequestStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <RequestList />
      {isFormOpen && (
        <RequestForm
          request={currentRequest || undefined}
          onClose={closeForm}
        />
      )}
    </div>
  );
};
