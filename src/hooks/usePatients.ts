import { useState, useEffect } from "react";
import { Patient, CreatePatientRequest, UpdatePatientRequest } from "@/types/patient";

// ✅ CHANGE: Added API base URL for your Spring Boot backend
// When deployed, replace "http://localhost:8080" with your server's public URL.
const API_URL = "http://localhost:8080/api/patients";

// ✅ CHANGE: PatientService now makes real API calls (fetch)
// ❌ REMOVED: All localStorage logic & mock delay
class PatientService {
  async getAllPatients(): Promise<Patient[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch patients");
    return response.json();
  }

  async getPatientById(id: string): Promise<Patient | null> {
    const response = await fetch(`${API_URL}/${id}`);
    if (response.status === 404) return null; // ✅ CHANGE: Handle 404 explicitly
    if (!response.ok) throw new Error("Failed to fetch patient");
    return response.json();
  }

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // ✅ CHANGE: Send JSON payload
    });
    if (!response.ok) throw new Error("Failed to create patient");
    return response.json();
  }

  async updatePatient(data: UpdatePatientRequest): Promise<Patient> {
    const response = await fetch(`${API_URL}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // ✅ CHANGE: Send JSON payload for updates
    });
    if (!response.ok) throw new Error("Failed to update patient");
    return response.json();
  }

  async deletePatient(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE", // ✅ CHANGE: Use DELETE method
    });
    if (!response.ok) throw new Error("Failed to delete patient");
  }
}

// ✅ SAME: Instantiate the service
const patientService = new PatientService();

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ SAME: Fetch patients from backend instead of localStorage
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (data: CreatePatientRequest) => {
    try {
      const newPatient = await patientService.createPatient(data);
      setPatients(prev => [newPatient, ...prev]); // ✅ CHANGE: Add newly created patient from backend
      return newPatient;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create patient");
    }
  };

  const updatePatient = async (data: UpdatePatientRequest) => {
    try {
      const updatedPatient = await patientService.updatePatient(data);
      setPatients(prev => prev.map(p => p.id === data.id ? updatedPatient : p)); // ✅ CHANGE: Replace updated patient
      return updatedPatient;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update patient");
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await patientService.deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id)); // ✅ CHANGE: Remove deleted patient
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete patient");
    }
  };

  const getPatientById = async (id: string) => {
    try {
      return await patientService.getPatientById(id);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to get patient");
    }
  };

  // ✅ SAME: Auto-fetch patients when component mounts
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
