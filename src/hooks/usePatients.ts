import { useState, useEffect } from "react";
import { Patient, CreatePatientRequest, UpdatePatientRequest } from "@/types/patient";

// Mock API service - in a real app, this would connect to your Spring Boot backend
class PatientService {
  private patients: Patient[] = [];
  private nextId = 1;

  constructor() {
    // Load from localStorage if available
    const stored = localStorage.getItem('hospital-patients');
    if (stored) {
      this.patients = JSON.parse(stored);
      this.nextId = Math.max(...this.patients.map(p => parseInt(p.id)), 0) + 1;
    }
  }

  private saveToStorage() {
    localStorage.setItem('hospital-patients', JSON.stringify(this.patients));
  }

  async getAllPatients(): Promise<Patient[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.patients];
  }

  async getPatientById(id: string): Promise<Patient | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.patients.find(p => p.id === id) || null;
  }

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check for duplicate Aadhar card
    if (this.patients.some(p => p.aadharCard === data.aadharCard)) {
      throw new Error('Patient with this Aadhar card already exists');
    }

    // Check for duplicate phone number
    if (this.patients.some(p => p.phoneNumber === data.phoneNumber)) {
      throw new Error('Patient with this phone number already exists');
    }

    const newPatient: Patient = {
      ...data,
      id: this.nextId.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.patients.push(newPatient);
    this.nextId++;
    this.saveToStorage();
    
    return newPatient;
  }

  async updatePatient(data: UpdatePatientRequest): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.patients.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error('Patient not found');
    }

    // Check for duplicate Aadhar card (excluding current patient)
    if (data.aadharCard && this.patients.some(p => p.id !== data.id && p.aadharCard === data.aadharCard)) {
      throw new Error('Another patient with this Aadhar card already exists');
    }

    // Check for duplicate phone number (excluding current patient)
    if (data.phoneNumber && this.patients.some(p => p.id !== data.id && p.phoneNumber === data.phoneNumber)) {
      throw new Error('Another patient with this phone number already exists');
    }

    const updatedPatient: Patient = {
      ...this.patients[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.patients[index] = updatedPatient;
    this.saveToStorage();
    
    return updatedPatient;
  }

  async deletePatient(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Patient not found');
    }

    this.patients.splice(index, 1);
    this.saveToStorage();
  }
}

const patientService = new PatientService();

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (data: CreatePatientRequest) => {
    try {
      const newPatient = await patientService.createPatient(data);
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create patient');
    }
  };

  const updatePatient = async (data: UpdatePatientRequest) => {
    try {
      const updatedPatient = await patientService.updatePatient(data);
      setPatients(prev => prev.map(p => p.id === data.id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update patient');
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await patientService.deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete patient');
    }
  };

  const getPatientById = async (id: string) => {
    try {
      return await patientService.getPatientById(id);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to get patient');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    refetch: fetchPatients,
  };
}