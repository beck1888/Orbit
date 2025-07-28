// IndexedDB Database Management for Assignment Tracker
export interface Class {
  id?: number;
  name: string;
  emoji: string; // Added emoji field
  slug: string; // Added slug field for routing
  createdAt: string;
}

export interface Assignment {
  id?: number;
  classId: number;
  title: string; // Correct property for assignment name
  description?: string;
  type: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export class AssignmentDatabase {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'AssignmentTracker';
  private readonly version = 3;

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create classes store
        if (!db.objectStoreNames.contains('classes')) {
          const classStore = db.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
          classStore.createIndex('name', 'name', { unique: true });
          classStore.createIndex('slug', 'slug', { unique: true });
        } else if (event.oldVersion < 3) {
          // Add slug index for existing stores
          const classStore = request.transaction!.objectStore('classes');
          if (!classStore.indexNames.contains('slug')) {
            classStore.createIndex('slug', 'slug', { unique: true });
          }
        }

        // Create assignments store
        if (!db.objectStoreNames.contains('assignments')) {
          const assignmentStore = db.createObjectStore('assignments', { keyPath: 'id', autoIncrement: true });
          assignmentStore.createIndex('classId', 'classId', { unique: false });
          assignmentStore.createIndex('dueDate', 'dueDate', { unique: false });
        }
      };
    });
  }

  async addClass(className: string, classEmoji: string, classSlug: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['classes'], 'readwrite');
    const store = transaction.objectStore('classes');
    
    const classData: Omit<Class, 'id'> = {
      name: className,
      emoji: classEmoji,
      slug: classSlug,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(classData);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllClasses(): Promise<Class[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['classes'], 'readonly');
    const store = transaction.objectStore('classes');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getClassBySlug(slug: string): Promise<Class | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['classes'], 'readonly');
    const store = transaction.objectStore('classes');
    const index = store.index('slug');

    return new Promise((resolve, reject) => {
      const request = index.get(slug);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async isSlugUnique(slug: string, excludeId?: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['classes'], 'readonly');
    const store = transaction.objectStore('classes');
    const index = store.index('slug');

    return new Promise((resolve, reject) => {
      const request = index.get(slug);
      request.onsuccess = () => {
        const existingClass = request.result;
        if (!existingClass) {
          resolve(true);
        } else if (excludeId && existingClass.id === excludeId) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteClass(classId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['classes', 'assignments'], 'readwrite');
    const classStore = transaction.objectStore('classes');
    const assignmentStore = transaction.objectStore('assignments');

    // Delete the class
    classStore.delete(classId);

    // Delete all assignments for this class
    const assignmentIndex = assignmentStore.index('classId');
    const request = assignmentIndex.openCursor(IDBKeyRange.only(classId));

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addAssignment(assignmentData: Omit<Assignment, 'id' | 'completed' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['assignments'], 'readwrite');
    const store = transaction.objectStore('assignments');

    const assignment: Omit<Assignment, 'id'> = {
      ...assignmentData,
      completed: false,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(assignment);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getAssignmentsByClass(classId: number): Promise<Assignment[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['assignments'], 'readonly');
    const store = transaction.objectStore('assignments');
    const index = store.index('classId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(classId);
      request.onsuccess = () => {
        const assignments = request.result;
        // Sort by due date
        assignments.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        resolve(assignments);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateAssignment(assignmentId: number, updates: Partial<Assignment>): Promise<Assignment> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['assignments'], 'readwrite');
    const store = transaction.objectStore('assignments');

    return new Promise((resolve, reject) => {
      const getRequest = store.get(assignmentId);
      getRequest.onsuccess = () => {
        const assignment = getRequest.result;
        if (assignment) {
          // If the completed status is changing to true, set completedAt timestamp
          if (updates.completed === true && !assignment.completed) {
            updates.completedAt = new Date().toISOString();
          }
          // If the completed status is changing to false, remove completedAt timestamp
          else if (updates.completed === false && assignment.completed) {
            updates.completedAt = undefined;
          }
          
          Object.assign(assignment, updates);
          const updateRequest = store.put(assignment);
          updateRequest.onsuccess = () => resolve(assignment);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Assignment not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteAssignment(assignmentId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['assignments'], 'readwrite');
    const store = transaction.objectStore('assignments');

    return new Promise((resolve, reject) => {
      const request = store.delete(assignmentId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllUpcomingAssignments(): Promise<Assignment[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['assignments'], 'readonly');
    const store = transaction.objectStore('assignments');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const assignments = request.result;
        const now = new Date();
        const upcoming = assignments
          .filter(assignment => !assignment.completed && assignment.dueDate)
          .filter(assignment => new Date(assignment.dueDate!).getTime() >= now.getTime())
          .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
        resolve(upcoming);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllIncompleteAssignments(): Promise<Assignment[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['assignments'], 'readonly');
    const store = transaction.objectStore('assignments');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const assignments = request.result;
        const incomplete = assignments
          .filter(assignment => !assignment.completed)
          .sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });
        resolve(incomplete);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCompletedAssignments(): Promise<Assignment[]> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(['assignments'], 'readonly');
    const store = transaction.objectStore('assignments');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const assignments = request.result;
        console.log('Fetched assignments:', assignments); // Debug log
        const completed = assignments
          .filter(assignment => assignment.completed)
          .sort((a, b) => {
            // Sort by completion date, most recent first
            if (!a.completedAt && !b.completedAt) return 0;
            if (!a.completedAt) return 1;
            if (!b.completedAt) return -1;
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
          });
        resolve(completed);
      };
      request.onerror = () => reject(request.error);
    });
  }
}
