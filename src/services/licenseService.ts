import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Query,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type LicenseType, type SearchFilters, type SortOptions, type PaginatedResponse } from '../types';

export class LicenseService {
  private static collectionName = 'licenseTypes';

  // Obtener todos los tipos de licencias
  static async getAllLicenseTypes(): Promise<LicenseType[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      return querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));
    } catch (error) {
      console.error('Error getting license types:', error);
      throw new Error('Error al obtener tipos de licencias');
    }
  }

  // Obtener tipos de licencias con paginación y filtros
  static async getLicenseTypes(
    page: number = 1,
    pageSize: number = 10,
    filters?: SearchFilters,
    sort?: SortOptions
  ): Promise<PaginatedResponse<LicenseType>> {
    try {
      let q: Query<DocumentData, DocumentData> = collection(db, this.collectionName);

      // Aplicar filtros
      // if (filters?.category) {
      //   q = query(q, where('category', '==', filters.category));
      // }
      if (filters?.status) {
        q = query(q, where('isActive', '==', filters.status === 'active'));
      }

      // Aplicar ordenamiento
      if (sort) {
        q = query(q, orderBy(sort.field, sort.direction));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      // Aplicar paginación
      q = query(q, limit(pageSize));

      const querySnapshot = await getDocs(q);
      const licenseTypes = querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));

      // Obtener total de documentos (esto es una aproximación)
      const totalSnapshot = await getDocs(collection(db, this.collectionName));
      const total = totalSnapshot.size;

      return {
        data: licenseTypes,
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error('Error getting license types with pagination:', error);
      throw new Error('Error al obtener tipos de licencias');
    }
  }

  // Obtener un tipo de licencia por ID
  static async getLicenseTypeById(id: string): Promise<LicenseType | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.mapDocumentToLicenseType(docSnap);
      }

      return null;
    } catch (error) {
      console.error('Error getting license type by ID:', error);
      throw new Error('Error al obtener tipo de licencia');
    }
  }

  // Crear un nuevo tipo de licencia
  static async createLicenseType(licenseTypeData: Omit<LicenseType, 'id' | 'createdAt' | 'updatedAt'>): Promise<LicenseType> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...licenseTypeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newDoc = await getDoc(docRef);
      return this.mapDocumentToLicenseType(newDoc);
    } catch (error) {
      console.error('Error creating license type:', error);
      throw new Error('Error al crear tipo de licencia');
    }
  }

  // Actualizar un tipo de licencia
  static async updateLicenseType(id: string, updates: Partial<Omit<LicenseType, 'id' | 'createdAt'>>): Promise<LicenseType> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      const updatedDoc = await getDoc(docRef);
      return this.mapDocumentToLicenseType(updatedDoc);
    } catch (error) {
      console.error('Error updating license type:', error);
      throw new Error('Error al actualizar tipo de licencia');
    }
  }

  // Eliminar un tipo de licencia
  static async deleteLicenseType(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting license type:', error);
      throw new Error('Error al eliminar tipo de licencia');
    }
  }

  // Buscar tipos de licencias por nombre
  static async searchLicenseTypes(searchTerm: string): Promise<LicenseType[]> {
    try {
      // Firestore no soporta búsqueda de texto completo, así que filtramos por nombre
      const q = query(
        collection(db, this.collectionName),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));
    } catch (error) {
      console.error('Error searching license types:', error);
      throw new Error('Error al buscar tipos de licencias');
    }
  }

  // Obtener tipos de licencias activos
  static async getActiveLicenseTypes(): Promise<LicenseType[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('isActive', '==', true),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));
    } catch (error) {
      console.error('Error getting active license types:', error);
      throw new Error('Error al obtener tipos de licencias activos');
    }
  }

  // Obtener tipos de licencias por categoría
  static async getLicenseTypesByCategory(category: string): Promise<LicenseType[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));
    } catch (error) {
      console.error('Error getting license types by category:', error);
      throw new Error('Error al obtener tipos de licencias por categoría');
    }
  }

  // Verificar si existe un tipo de licencia con el mismo nombre
  static async checkLicenseTypeNameExists(name: string, excludeId?: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('name', '==', name)
      );

      const querySnapshot = await getDocs(q);
      
      if (excludeId) {
        // Excluir el documento actual en caso de actualización
        return querySnapshot.docs.some(doc => doc.id !== excludeId);
      }

      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking license type name exists:', error);
      throw new Error('Error al verificar nombre de tipo de licencia');
    }
  }

  // Obtener estadísticas de tipos de licencias
  static async getLicenseTypeStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<string, number>;
  }> {
    try {
      const allLicenseTypes = await this.getAllLicenseTypes();
      
      const stats = {
        total: allLicenseTypes.length,
        active: allLicenseTypes.filter(lt => lt.isActive).length,
        inactive: allLicenseTypes.filter(lt => !lt.isActive).length,
        byCategory: {} as Record<string, number>,
      };

      // Contar por categoría
      allLicenseTypes.forEach(licenseType => {
        stats.byCategory[licenseType.category] = (stats.byCategory[licenseType.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting license type stats:', error);
      throw new Error('Error al obtener estadísticas de tipos de licencias');
    }
  }

  // Mapear documento de Firestore a objeto LicenseType
  private static mapDocumentToLicenseType(doc: QueryDocumentSnapshot<DocumentData> | any): LicenseType {
    const data = doc.data();
    return {
      id: doc.id,
      code: data.code,
      name: data.name,
      description: data.description,
      category: data.category,
      periodControl: data.periodControl,
      unitControl: data.unitControl,
      totalAvailable: data.totalAvailable,
      maxDaysPerRequest: data.maxDaysPerRequest,
      requiresJustification: data.requiresJustification,
      hasSalary: data.hasSalary,
      isAccumulable: data.isAccumulable,
      isTransferable: data.isTransferable,
      genderRestriction: data.genderRestriction,
      minSeniority: data.minSeniority,
      minAge: data.minAge,
      maxAge: data.maxAge,
      departmentRestriction: data.departmentRestriction,
      positionRestriction: data.positionRestriction,
      personalTypeRestriction: data.personalTypeRestriction,
      autoRenewal: data.autoRenewal,
      isActive: data.isActive,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }
}
