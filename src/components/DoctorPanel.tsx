import { DOCTORS } from "@/types/pathology";
import { Stethoscope, Phone, Award } from "lucide-react";

export function DoctorPanel() {
  return (
    <div className="space-y-4">
      <div className="neo-flat p-5">
        <h2 className="text-xl font-bold mb-1">Our Doctors</h2>
        <p className="text-sm text-muted-foreground mb-5">Bhagwati Hospital — Pathology Department</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCTORS.map(doctor => (
            <div key={doctor.id} className="neo-flat p-5 hover:shadow-lg transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full neo-circle flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Award className="h-3 w-3" /> {doctor.specialization}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Bhagwati Hospital, Daltonganj</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
