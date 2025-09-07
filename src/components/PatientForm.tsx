import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Patient, CreatePatientRequest } from "@/types/patient";
import { UserPlus, Save, X } from "lucide-react";

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: CreatePatientRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PatientForm({ patient, onSubmit, onCancel, isLoading }: PatientFormProps) {
  const [formData, setFormData] = useState<CreatePatientRequest>({
    name: patient?.name || "",
    age: patient?.age || 0,
    gender: patient?.gender || "male",
    diagnosis: patient?.diagnosis || "",
    admittedDate: patient?.admittedDate || new Date().toISOString().split('T')[0],
    attendant: patient?.attendant || "",
    aadharCard: patient?.aadharCard || "",
    fatherName: patient?.fatherName || "",
    phoneNumber: patient?.phoneNumber || "",
  });

  const [errors, setErrors] = useState<Partial<CreatePatientRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreatePatientRequest> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.age || formData.age <= 0 || formData.age > 150) {
      newErrors.age = "Please enter a valid age (1-150)" as any;
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required";
    }

    if (!formData.attendant.trim()) {
      newErrors.attendant = "Attendant name is required";
    }

    if (!formData.aadharCard.trim()) {
      newErrors.aadharCard = "Aadhar card number is required";
    } else if (!/^\d{12}$/.test(formData.aadharCard)) {
      newErrors.aadharCard = "Aadhar card must be 12 digits";
    }

    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father's name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.admittedDate) {
      newErrors.admittedDate = "Admitted date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      await onSubmit(formData);
      toast.success(patient ? "Patient updated successfully" : "Patient registered successfully");
    } catch (error) {
      toast.error("Failed to save patient");
      console.error(error);
    }
  };

  const handleInputChange = (field: keyof CreatePatientRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {patient ? "Update Patient" : "Register New Patient"}
        </CardTitle>
        <CardDescription>
          {patient ? "Update patient information" : "Enter patient details for admission"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter patient's full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ""}
                onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                placeholder="Enter age"
                min="1"
                max="150"
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value: "male" | "female" | "other") => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admittedDate">Admitted Date *</Label>
              <Input
                id="admittedDate"
                type="date"
                value={formData.admittedDate}
                onChange={(e) => handleInputChange("admittedDate", e.target.value)}
                className={errors.admittedDate ? "border-destructive" : ""}
              />
              {errors.admittedDate && <p className="text-sm text-destructive">{errors.admittedDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange("fatherName", e.target.value)}
                placeholder="Enter father's name"
                className={errors.fatherName ? "border-destructive" : ""}
              />
              {errors.fatherName && <p className="text-sm text-destructive">{errors.fatherName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendant">Attendant Name *</Label>
              <Input
                id="attendant"
                value={formData.attendant}
                onChange={(e) => handleInputChange("attendant", e.target.value)}
                placeholder="Enter attendant's name"
                className={errors.attendant ? "border-destructive" : ""}
              />
              {errors.attendant && <p className="text-sm text-destructive">{errors.attendant}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="10-digit phone number"
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadharCard">Aadhar Card Number *</Label>
              <Input
                id="aadharCard"
                value={formData.aadharCard}
                onChange={(e) => handleInputChange("aadharCard", e.target.value)}
                placeholder="12-digit Aadhar number"
                className={errors.aadharCard ? "border-destructive" : ""}
              />
              {errors.aadharCard && <p className="text-sm text-destructive">{errors.aadharCard}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange("diagnosis", e.target.value)}
              placeholder="Enter patient's diagnosis"
              className={`min-h-[100px] ${errors.diagnosis ? "border-destructive" : ""}`}
            />
            {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : patient ? "Update Patient" : "Register Patient"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}