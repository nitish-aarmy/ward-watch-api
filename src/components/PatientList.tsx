import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Patient } from "@/types/patient";
import { Edit, Trash2, Search, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => void;
  isLoading?: boolean;
}

export function PatientList({ patients, onEdit, onDelete, onAdd, isLoading }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber.includes(searchTerm) ||
    patient.aadharCard.includes(searchTerm) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletePatient) return;

    try {
      await onDelete(deletePatient.id);
      toast.success("Patient deleted successfully");
    } catch (error) {
      toast.error("Failed to delete patient");
    } finally {
      setDeletePatient(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGenderBadgeVariant = (gender: string) => {
    switch (gender) {
      case 'male': return 'default';
      case 'female': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Patient Records
              </CardTitle>
              <CardDescription>
                Manage and view all patient information
              </CardDescription>
            </div>
            <Button onClick={onAdd} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, phone, Aadhar, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredPatients.length} of {patients.length} patients
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No patients found matching your search" : "No patients registered yet"}
              </p>
              {!searchTerm && (
                <Button onClick={onAdd} variant="outline" className="mt-2">
                  Register First Patient
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Details</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Medical Info</TableHead>
                    <TableHead>Admission</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Age: {patient.age} • Father: {patient.fatherName}
                          </div>
                          <Badge variant={getGenderBadgeVariant(patient.gender)} className="text-xs">
                            {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{patient.phoneNumber}</div>
                          <div className="text-muted-foreground">
                            Aadhar: {patient.aadharCard}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{patient.diagnosis}</div>
                          <div className="text-sm text-muted-foreground">
                            Attendant: {patient.attendant}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(patient.admittedDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(patient)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletePatient(patient)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletePatient} onOpenChange={() => setDeletePatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the record for <strong>{deletePatient?.name}</strong>? 
              This action cannot be undone and will permanently remove all patient data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}