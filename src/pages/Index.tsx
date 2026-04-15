import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PathologyDashboard } from "@/components/PathologyDashboard";
import { PathologyRequestForm } from "@/components/PathologyRequestForm";
import { PathologyRequestList } from "@/components/PathologyRequestList";
import { PathologyReportViewer } from "@/components/PathologyReportViewer";
import { TestCatalog } from "@/components/TestCatalog";
import { DoctorPanel } from "@/components/DoctorPanel";
import { PatientForm } from "@/components/PatientForm";
import { PatientList } from "@/components/PatientList";
import { usePathology } from "@/hooks/usePathology";
import { usePatients } from "@/hooks/usePatients";
import { PathologyRequest, DOCTORS } from "@/types/pathology";
import { Patient, CreatePatientRequest } from "@/types/patient";
import { toast } from "sonner";
import {
  Building2, LayoutDashboard, FlaskConical, Users, UserPlus,
  BookOpen, Stethoscope, Menu, X
} from "lucide-react";

type View =
  | "dashboard" | "requests" | "new-request" | "view-report"
  | "test-catalog" | "doctors"
  | "patients" | "add-patient" | "edit-patient";

const Index = () => {
  const { requests, createRequest, updateRequest, deleteRequest } = usePathology();
  const { patients, loading, createPatient, updatePatient, deletePatient } = usePatients();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [viewingRequest, setViewingRequest] = useState<PathologyRequest | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNewRequest = (data: any) => {
    createRequest(data);
    toast.success("Pathology request created!");
    setCurrentView("requests");
  };

  const handleViewReport = (req: PathologyRequest) => {
    setViewingRequest(req);
    setCurrentView("view-report");
  };

  const handleSaveResults = (id: string, results: Record<string, string>, remarks?: string) => {
    updateRequest(id, { results, remarks });
  };

  const handleAddPatient = async (data: CreatePatientRequest) => {
    setIsSubmitting(true);
    try {
      await createPatient(data);
      setCurrentView("patients");
      toast.success("Patient registered!");
    } catch (error) {
      toast.error("Failed to register patient");
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
      toast.success("Patient updated!");
    } catch (error) {
      toast.error("Failed to update patient");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "requests", label: "Lab Requests", icon: FlaskConical },
    { key: "new-request", label: "New Request", icon: UserPlus },
    { key: "test-catalog", label: "Test Catalog", icon: BookOpen },
    { key: "doctors", label: "Doctors", icon: Stethoscope },
    { key: "patients", label: "Patients", icon: Users },
  ];

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <PathologyDashboard />;
      case "requests":
        return (
          <PathologyRequestList
            requests={requests}
            onView={handleViewReport}
            onUpdateStatus={(id, status) => updateRequest(id, { status })}
            onDelete={deleteRequest}
            onNewRequest={() => setCurrentView("new-request")}
          />
        );
      case "new-request":
        return <PathologyRequestForm onSubmit={handleNewRequest} onCancel={() => setCurrentView("requests")} />;
      case "view-report":
        return viewingRequest ? (
          <PathologyReportViewer request={viewingRequest} onSaveResults={handleSaveResults} onBack={() => setCurrentView("requests")} />
        ) : null;
      case "test-catalog":
        return <TestCatalog />;
      case "doctors":
        return <DoctorPanel />;
      case "patients":
        return (
          <PatientList
            patients={patients}
            onEdit={(p) => { setEditingPatient(p); setCurrentView("edit-patient"); }}
            onDelete={deletePatient}
            onAdd={() => setCurrentView("add-patient")}
            isLoading={loading}
          />
        );
      case "add-patient":
        return <PatientForm onSubmit={handleAddPatient} onCancel={() => setCurrentView("patients")} isLoading={isSubmitting} />;
      case "edit-patient":
        return (
          <PatientForm
            patient={editingPatient || undefined}
            onSubmit={handleUpdatePatient}
            onCancel={() => { setCurrentView("patients"); setEditingPatient(null); }}
            isLoading={isSubmitting}
          />
        );
      default:
        return <PathologyDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} transition-all duration-300 flex-shrink-0`}>
        <div className="h-screen sticky top-0 flex flex-col neo-flat rounded-none">
          {/* Logo */}
          <div className="p-5 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neo-circle">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold leading-tight">BHAGWATI</h1>
                <h1 className="text-sm font-extrabold leading-tight text-primary">HOSPITAL</h1>
                <p className="text-[10px] text-muted-foreground">Daltonganj, JH - 822101</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.key ||
                (item.key === "requests" && currentView === "view-report") ||
                (item.key === "patients" && (currentView === "add-patient" || currentView === "edit-patient"));
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key as View)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "neo-pressed text-primary"
                      : "neo-btn hover:shadow-md"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground text-center">Pathology Management System</p>
            <p className="text-[10px] text-muted-foreground text-center">© 2026 Bhagwati Hospital</p>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 neo-flat rounded-none px-5 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="neo-btn p-2 rounded-xl">
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-bold capitalize">{currentView.replace(/-/g, " ")}</h2>
          </div>
          <div className="text-xs text-muted-foreground hidden md:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>

        {/* Content */}
        <main className="p-5 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Index;
