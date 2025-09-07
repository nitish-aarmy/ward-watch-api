import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/types/patient";
import { Users, UserCheck, Calendar, Activity } from "lucide-react";

interface DashboardProps {
  patients: Patient[];
}

export function Dashboard({ patients }: DashboardProps) {
  const totalPatients = patients.length;
  const malePatients = patients.filter(p => p.gender === 'male').length;
  const femalePatients = patients.filter(p => p.gender === 'female').length;
  const otherPatients = patients.filter(p => p.gender === 'other').length;

  const today = new Date().toISOString().split('T')[0];
  const admissionsToday = patients.filter(p => p.admittedDate === today).length;

  const recentPatients = patients
    .sort((a, b) => new Date(b.admittedDate).getTime() - new Date(a.admittedDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hospital Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of patient management and hospital statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Registered in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Admissions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admissionsToday}</div>
            <p className="text-xs text-muted-foreground">
              Admitted today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{malePatients}M / {femalePatients}F</div>
            <p className="text-xs text-muted-foreground">
              {otherPatients > 0 && `${otherPatients} Other • `}Patient demographics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Active</div>
            <p className="text-xs text-muted-foreground">
              Hospital Management System
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Admissions</CardTitle>
            <CardDescription>
              Latest patients admitted to the hospital
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPatients.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No patients admitted yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Age {patient.age} • {patient.diagnosis}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={patient.gender === 'male' ? 'default' : patient.gender === 'female' ? 'secondary' : 'outline'}>
                        {patient.gender}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(patient.admittedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and system information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium">System Features</div>
                <div className="text-sm text-muted-foreground">
                  ✓ Patient Registration & Management<br />
                  ✓ Search & Filter Capabilities<br />
                  ✓ Input Validation & Error Handling<br />
                  ✓ Responsive Design
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Data Storage</div>
                <div className="text-sm text-muted-foreground">
                  Local storage with persistence<br />
                  Ready for backend integration
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}