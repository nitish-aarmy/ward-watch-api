export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  diagnosis: string;
  admittedDate: string;
  attendant: string;
  aadharCard: string;
  fatherName: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientRequest {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  diagnosis: string;
  admittedDate: string;
  attendant: string;
  aadharCard: string;
  fatherName: string;
  phoneNumber: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: string;
}