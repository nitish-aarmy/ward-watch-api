import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PathologyRequest, DOCTORS, ALL_TESTS } from "@/types/pathology";
import { Search, Eye, Trash2, Clock, CheckCircle, Truck, FlaskConical } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface PathologyRequestListProps {
  requests: PathologyRequest[];
  onView: (req: PathologyRequest) => void;
  onUpdateStatus: (id: string, status: PathologyRequest["status"]) => void;
  onDelete: (id: string) => void;
  onNewRequest: () => void;
}

export function PathologyRequestList({ requests, onView, onUpdateStatus, onDelete, onNewRequest }: PathologyRequestListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = requests.filter(r => {
    const matchSearch = r.patientName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: "Pending", color: "bg-warning/15 text-warning", icon: Clock },
    "in-progress": { label: "In Progress", color: "bg-primary/15 text-primary", icon: FlaskConical },
    completed: { label: "Completed", color: "bg-success/15 text-success", icon: CheckCircle },
    delivered: { label: "Delivered", color: "bg-accent/15 text-accent", icon: Truck },
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
      toast.success("Request deleted");
    }
  };

  return (
    <div className="space-y-4">
      <div className="neo-flat p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold">Pathology Requests</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} of {requests.length} requests</p>
          </div>
          <Button onClick={onNewRequest} className="neo-btn border-none bg-primary text-primary-foreground hover:bg-primary/90">
            + New Request
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 neo-pressed border-none" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "in-progress", "completed", "delivered"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === s ? "neo-pressed text-primary" : "neo-btn"
                }`}
              >
                {s === "all" ? "All" : statusConfig[s]?.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="neo-pressed p-10 text-center">
            <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No pathology requests found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(req => {
              const doctor = DOCTORS.find(d => d.id === req.doctorId);
              const tests = req.testIds.map(id => ALL_TESTS.find(t => t.id === id)).filter(Boolean);
              const sc = statusConfig[req.status];
              const StatusIcon = sc.icon;

              return (
                <div key={req.id} className="neo-flat p-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover:shadow-lg transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{req.patientName}</span>
                      <span className="text-xs text-muted-foreground">({req.patientAge}/{req.patientGender.charAt(0).toUpperCase()})</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {req.id} • {doctor?.name || "Unknown"} • {new Date(req.createdAt).toLocaleDateString("en-IN")}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tests.slice(0, 4).map(t => (
                        <span key={t!.id} className="text-xs px-2 py-0.5 rounded-full neo-pressed">{t!.code}</span>
                      ))}
                      {tests.length > 4 && <span className="text-xs px-2 py-0.5 rounded-full neo-pressed">+{tests.length - 4}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${sc.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onView(req)} className="neo-btn border-none h-8 w-8 p-0">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {req.status === "pending" && (
                        <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(req.id, "in-progress")} className="neo-btn border-none h-8 px-2 text-xs">
                          Start
                        </Button>
                      )}
                      {req.status === "in-progress" && (
                        <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(req.id, "completed")} className="neo-btn border-none h-8 px-2 text-xs">
                          Complete
                        </Button>
                      )}
                      {req.status === "completed" && (
                        <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(req.id, "delivered")} className="neo-btn border-none h-8 px-2 text-xs">
                          Deliver
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(req.id)} className="neo-btn border-none h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Request</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
