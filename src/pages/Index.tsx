import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PatientForm } from "@/components/PatientForm";
import { PatientList } from "@/components/PatientList";
import { Dashboard } from "@/components/Dashboard";
import { usePatients } from "@/hooks/usePatients";
import { Patient, CreatePatientRequest } from "@/types/patient";
import { toast } from "sonner";
import { Building2, LayoutDashboard, Users, UserPlus } from "lucide-react";

type View = "dashboard" | "patients" | "add-patient" | "edit-patient";

const Index = () => {
  const { patients, loading, createPatient, updatePatient, deletePatient } = usePatients();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPatient = async (data: CreatePatientRequest) => {
    setIsSubmitting(true);
    try {
      await createPatient(data);
      setCurrentView("patients");
      toast.success("Patient registered successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register patient");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePatient = async (data: CreatePatientRequest) => {
    if (!editingPatient) return;
    
    setIsSubmitting(true);
    try {
      await updatePatient({ ...data, id: editingPatient.id });
      setCurrentView("patients");
      setEditingPatient(null);
      toast.success("Patient updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update patient");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setCurrentView("edit-patient");
  };

  const handleDeletePatient = async (id: string) => {
    await deletePatient(id);
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard patients={patients} />;
      case "patients":
        return (
          <PatientList
            patients={patients}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            onAdd={() => setCurrentView("add-patient")}
            isLoading={loading}
          />
        );
      case "add-patient":
        return (
          <PatientForm
            onSubmit={handleAddPatient}
            onCancel={() => setCurrentView("patients")}
            isLoading={isSubmitting}
          />
        );
      case "edit-patient":
        return (
          <PatientForm
            patient={editingPatient || undefined}
            onSubmit={handleUpdatePatient}
            onCancel={() => {
              setCurrentView("patients");
              setEditingPatient(null);
            }}
            isLoading={isSubmitting}
          />
        );
      default:
        return <Dashboard patients={patients} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MediCare Hospital</h1>
                <p className="text-sm text-muted-foreground">Patient Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={currentView === "dashboard" ? "default" : "outline"}
                onClick={() => setCurrentView("dashboard")}
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={currentView === "patients" ? "default" : "outline"}
                onClick={() => setCurrentView("patients")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Patients
              </Button>
              <Button
                variant={currentView.includes("patient") && currentView !== "patients" ? "default" : "outline"}
                onClick={() => setCurrentView("add-patient")}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Patient
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
