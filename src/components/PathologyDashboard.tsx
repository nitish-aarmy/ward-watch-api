import { usePathology } from "@/hooks/usePathology";
import { ALL_TESTS, BLOOD_TESTS, URINE_TESTS, STOOL_TESTS } from "@/types/pathology";
import {
  FlaskConical, Clock, CheckCircle, Truck, Activity,
  Droplets, TestTube2, Microscope, TrendingUp
} from "lucide-react";

export function PathologyDashboard() {
  const { stats } = usePathology();

  const statCards = [
    { label: "Total Requests", value: stats.total, icon: FlaskConical, accent: "text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, accent: "text-warning" },
    { label: "In Progress", value: stats.inProgress, icon: Activity, accent: "text-primary" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, accent: "text-success" },
    { label: "Delivered", value: stats.delivered, icon: Truck, accent: "text-accent" },
    { label: "Today", value: stats.todayCount, icon: TrendingUp, accent: "text-primary" },
  ];

  const testCategories = [
    { label: "Blood Tests", count: BLOOD_TESTS.length, params: BLOOD_TESTS.reduce((s, t) => s + t.subSections.reduce((ss, sec) => ss + sec.parameters.length, 0), 0), icon: Droplets },
    { label: "Urine Tests", count: URINE_TESTS.length, params: URINE_TESTS.reduce((s, t) => s + t.subSections.reduce((ss, sec) => ss + sec.parameters.length, 0), 0), icon: TestTube2 },
    { label: "Stool Tests", count: STOOL_TESTS.length, params: STOOL_TESTS.reduce((s, t) => s + t.subSections.reduce((ss, sec) => ss + sec.parameters.length, 0), 0), icon: Microscope },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pathology Dashboard</h2>
        <p className="text-sm text-muted-foreground">Bhagwati Hospital — Diagnostic Lab Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="neo-flat p-4 text-center hover:shadow-lg transition-all">
              <div className={`w-10 h-10 rounded-full neo-circle mx-auto mb-2 flex items-center justify-center ${card.accent} bg-current/10`}>
                <Icon className={`h-5 w-5 ${card.accent}`} />
              </div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Test Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testCategories.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.label} className="neo-convex p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full neo-circle flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count} tests • {cat.params} parameters</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital Info */}
      <div className="neo-flat p-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-primary mb-1">BHAGWATI HOSPITAL</h3>
          <p className="text-sm text-muted-foreground">Daltonganj, Jharkhand — PIN 822101</p>
          <p className="text-xs text-muted-foreground mt-2">Pathology & Diagnostic Laboratory • All tests available with expert consultation</p>
        </div>
      </div>
    </div>
  );
}
