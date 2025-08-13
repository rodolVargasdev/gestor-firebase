import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp, type DocumentData, type QueryDocumentSnapshot, type Query,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  type LicenseRequest, 
  type LicenseAssignment, 
  type SearchFilters, 
  type SortOptions, 
  type PaginatedResponse,
  type RequestStatus,
  type RequestPriority
} from '../types';

export class RequestService {
  private static requestsCollectionName = 'licenseRequests';
  private static assignmentsCollectionName = 'licenseAssignments';
  // private static workflowsCollectionName = 'requestWorkflows';
  // private static notificationsCollectionName = 'requestNotifications';

  // ===== SOLICITUDES DE LICENCIAS =====
  
  static async getAllRequests(): Promise<LicenseRequest[]> {
    try {
      const q = query(
        collection(db, this.requestsCollectionName),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToRequest(doc));
    } catch (error) {
      console.error('Error al obtener todas las solicitudes:', error);
      throw error;
    }
  }

  static async getRequests(
    page: number = 1, 
    pageSize: number = 10, 
    filters?: SearchFilters, 
    sort?: SortOptions
  ): Promise<PaginatedResponse<LicenseRequest>> {
    try {
      let q: Query<DocumentData, DocumentData> = collection(db, this.requestsCollectionName);

      // Aplicar filtros
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.departmentId) {
        q = query(q, where('departmentId', '==', filters.departmentId));
      }
      // if (filters?.employeeId) {
      //   q = query(q, where('employeeId', '==', filters.employeeId));
      // }
      if (filters?.dateFrom) {
        q = query(q, where('requestDate', '>=', filters.dateFrom));
      }
      if (filters?.dateTo) {
        q = query(q, where('requestDate', '<=', filters.dateTo));
      }

      // Aplicar ordenamiento
      const sortField = sort?.field || 'requestDate';
      const sortDirection = sort?.direction || 'desc';
      q = query(q, orderBy(sortField, sortDirection));

      // Aplicar paginación
      // const offset = (page - 1) * pageSize;
      q = query(q, limit(pageSize));

      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => this.mapDocumentToRequest(doc));

      // Obtener total (esto es una aproximación, en producción usarías una subcolección)
      const totalSnapshot = await getDocs(collection(db, this.requestsCollectionName));
      const total = totalSnapshot.size;

      return {
        data: requests,
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      throw error;
    }
  }

  static async getRequestById(id: string): Promise<LicenseRequest | null> {
    try {
      const docRef = doc(db, this.requestsCollectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return this.mapDocumentToRequest(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener solicitud por ID:', error);
      throw error;
    }
  }

  static async createRequest(requestData: Omit<LicenseRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<LicenseRequest> {
    try {
      const docRef = await addDoc(collection(db, this.requestsCollectionName), {
        ...requestData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newRequest = await this.getRequestById(docRef.id);
      if (!newRequest) {
        throw new Error('Error al crear la solicitud');
      }

      return newRequest;
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      throw error;
    }
  }

  static async updateRequest(id: string, updates: Partial<Omit<LicenseRequest, 'id' | 'createdAt'>>): Promise<LicenseRequest> {
    try {
      const docRef = doc(db, this.requestsCollectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      const updatedRequest = await this.getRequestById(id);
      if (!updatedRequest) {
        throw new Error('Error al actualizar la solicitud');
      }

      return updatedRequest;
    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
      throw error;
    }
  }

  static async deleteRequest(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.requestsCollectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
      throw error;
    }
  }

  static async approveRequest(id: string, approvedBy: string, notes?: string): Promise<LicenseRequest> {
    try {
      const updates = {
        status: 'approved' as RequestStatus,
        approvedBy,
        approvedAt: new Date(),
        notes: notes || '',
        updatedAt: new Date(),
      };

      return await this.updateRequest(id, updates);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      throw error;
    }
  }

  static async rejectRequest(id: string, rejectedBy: string, rejectionReason: string): Promise<LicenseRequest> {
    try {
      const updates = {
        status: 'rejected' as RequestStatus,
        approvedBy: rejectedBy,
        approvedAt: new Date(),
        rejectionReason,
        updatedAt: new Date(),
      };

      return await this.updateRequest(id, updates);
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      throw error;
    }
  }

  static async searchRequests(searchTerm: string): Promise<LicenseRequest[]> {
    try {
      // En Firestore, necesitarías un índice para búsquedas de texto
      // Por ahora, obtenemos todas y filtramos en el cliente
      const allRequests = await this.getAllRequests();
      return allRequests.filter(request => 
        request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error al buscar solicitudes:', error);
      throw error;
    }
  }

  static async getRequestsByStatus(status: RequestStatus): Promise<LicenseRequest[]> {
    try {
      const q = query(
        collection(db, this.requestsCollectionName),
        where('status', '==', status),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToRequest(doc));
    } catch (error) {
      console.error('Error al obtener solicitudes por estado:', error);
      throw error;
    }
  }

  static async getRequestsByEmployee(employeeId: string): Promise<LicenseRequest[]> {
    try {
      const q = query(
        collection(db, this.requestsCollectionName),
        where('employeeId', '==', employeeId),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToRequest(doc));
    } catch (error) {
      console.error('Error al obtener solicitudes por empleado:', error);
      throw error;
    }
  }

  static async getRequestsByDepartment(departmentId: string): Promise<LicenseRequest[]> {
    try {
      const q = query(
        collection(db, this.requestsCollectionName),
        where('departmentId', '==', departmentId),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToRequest(doc));
    } catch (error) {
      console.error('Error al obtener solicitudes por departamento:', error);
      throw error;
    }
  }

  static async getRequestStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    inProgress: number;
    byPriority: Record<RequestPriority, number>;
  }> {
    try {
      const allRequests = await this.getAllRequests();
      
      const stats = {
        total: allRequests.length,
        pending: allRequests.filter(r => r.status === 'pending').length,
        approved: allRequests.filter(r => r.status === 'approved').length,
        rejected: allRequests.filter(r => r.status === 'rejected').length,
        cancelled: allRequests.filter(r => r.status === 'cancelled').length,
        inProgress: allRequests.filter(r => r.status === 'in_progress').length,
        byPriority: {
          low: allRequests.filter(r => r.priority === 'low').length,
          medium: allRequests.filter(r => r.priority === 'medium').length,
          high: allRequests.filter(r => r.priority === 'high').length,
          urgent: allRequests.filter(r => r.priority === 'urgent').length,
        },
      };

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas de solicitudes:', error);
      throw error;
    }
  }

  // ===== ASIGNACIONES DE LICENCIAS =====

  static async createAssignment(assignmentData: Omit<LicenseAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<LicenseAssignment> {
    try {
      const docRef = await addDoc(collection(db, this.assignmentsCollectionName), {
        ...assignmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newAssignment = await this.getAssignmentById(docRef.id);
      if (!newAssignment) {
        throw new Error('Error al crear la asignación');
      }

      return newAssignment;
    } catch (error) {
      console.error('Error al crear asignación:', error);
      throw error;
    }
  }

  static async getAssignmentById(id: string): Promise<LicenseAssignment | null> {
    try {
      const docRef = doc(db, this.assignmentsCollectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return this.mapDocumentToAssignment(docSnap);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener asignación por ID:', error);
      throw error;
    }
  }

  static async getAssignmentsByEmployee(employeeId: string): Promise<LicenseAssignment[]> {
    try {
      const q = query(
        collection(db, this.assignmentsCollectionName),
        where('employeeId', '==', employeeId),
        where('isActive', '==', true),
        orderBy('assignedDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToAssignment(doc));
    } catch (error) {
      console.error('Error al obtener asignaciones por empleado:', error);
      throw error;
    }
  }

  static async updateAssignmentUsage(id: string, usedQuantity: number, description?: string): Promise<LicenseAssignment> {
    try {
      const assignment = await this.getAssignmentById(id);
      if (!assignment) {
        throw new Error('Asignación no encontrada');
      }

      const newUsedQuantity = assignment.usedQuantity + usedQuantity;
      const remainingQuantity = assignment.allocatedQuantity - newUsedQuantity;

      const usageEntry = {
        date: new Date(),
        quantity: usedQuantity,
        description: description || 'Uso registrado',
      };

      const updates = {
        usedQuantity: newUsedQuantity,
        remainingQuantity,
        lastUsageDate: new Date(),
        usageHistory: [...(assignment.usageHistory || []), usageEntry],
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, this.assignmentsCollectionName, id);
      await updateDoc(docRef, updates);

      const updatedAssignment = await this.getAssignmentById(id);
      if (!updatedAssignment) {
        throw new Error('Error al actualizar la asignación');
      }

      return updatedAssignment;
    } catch (error) {
      console.error('Error al actualizar uso de asignación:', error);
      throw error;
    }
  }

  // ===== MÉTODOS PRIVADOS =====

  private static mapDocumentToRequest(doc: QueryDocumentSnapshot<DocumentData> | any): LicenseRequest {
    const data = doc.data();
    return {
      id: doc.id,
      employeeId: data.employeeId,
      licenseTypeId: data.licenseTypeId,
      departmentId: data.departmentId,
      requestDate: data.requestDate?.toDate() || new Date(),
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      quantity: data.quantity || 0,
      reason: data.reason || '',
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt?.toDate(),
      rejectionReason: data.rejectionReason,
      actualUsage: data.actualUsage,
      actualStartDate: data.actualStartDate?.toDate(),
      actualEndDate: data.actualEndDate?.toDate(),
      notes: data.notes,
      attachments: data.attachments || [],
      // estimatedCost: data.estimatedCost, // Removido - no aplica para licencias laborales
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  private static mapDocumentToAssignment(doc: QueryDocumentSnapshot<DocumentData> | any): LicenseAssignment {
    const data = doc.data();
    return {
      id: doc.id,
      employeeId: data.employeeId,
      licenseTypeId: data.licenseTypeId,
      requestId: data.requestId,
      assignedDate: data.assignedDate?.toDate() || new Date(),
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      allocatedQuantity: data.allocatedQuantity || 0,
      usedQuantity: data.usedQuantity || 0,
      remainingQuantity: data.remainingQuantity || 0,
      status: data.status || 'active',
      isActive: data.isActive ?? true,
      notes: data.notes,
      lastUsageDate: data.lastUsageDate?.toDate(),
      usageHistory: data.usageHistory || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}
