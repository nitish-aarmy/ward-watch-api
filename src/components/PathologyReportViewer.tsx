import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PathologyRequest, DOCTORS, ALL_TESTS } from "@/types/pathology";
import { toast } from "sonner";
import { FileText, Printer, Save, ArrowLeft } from "lucide-react";

interface PathologyReportViewerProps {
  request: PathologyRequest;
  onSaveResults: (id: string, results: Record<string, string>, remarks?: string) => void;
  onBack: () => void;
}

export function PathologyReportViewer({ request, onSaveResults, onBack }: PathologyReportViewerProps) {
  const [results, setResults] = useState<Record<string, string>>(request.results || {});
  const [remarks, setRemarks] = useState(request.remarks || "");

  const doctor = DOCTORS.find(d => d.id === request.doctorId);
  const tests = request.testIds.map(id => ALL_TESTS.find(t => t.id === id)).filter(Boolean);

  const handleSave = () => {
    onSaveResults(request.id, results, remarks);
    toast.success("Results saved successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} className="neo-btn border-none">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex-1" />
        <Button onClick={handleSave} className="neo-btn border-none bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4 mr-1" /> Save Results
        </Button>
        <Button variant="outline" onClick={handlePrint} className="neo-btn border-none">
          <Printer className="h-4 w-4 mr-1" /> Print
        </Button>
      </div>

      {/* Report Header */}
      <div className="neo-flat p-6 print:shadow-none">
        <div className="text-center mb-6 border-b border-border pb-4">
          <h1 className="text-2xl font-extrabold text-primary">BHAGWATI HOSPITAL</h1>
          <p className="text-sm text-muted-foreground">Daltonganj, Jharkhand - 822101</p>
          <p className="text-xs text-muted-foreground mt-1">Pathology & Diagnostic Laboratory</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="neo-pressed p-3 rounded-lg">
            <span className="text-xs text-muted-foreground block">Patient</span>
            <span className="font-semibold">{request.patientName}</span>
          </div>
          <div className="neo-pressed p-3 rounded-lg">
            <span className="text-xs text-muted-foreground block">Age / Gender</span>
            <span className="font-semibold">{request.patientAge} / {request.patientGender.charAt(0).toUpperCase()}</span>
          </div>
          <div className="neo-pressed p-3 rounded-lg">
            <span className="text-xs text-muted-foreground block">Ref. Doctor</span>
            <span className="font-semibold">{doctor?.name}</span>
          </div>
          <div className="neo-pressed p-3 rounded-lg">
            <span className="text-xs text-muted-foreground block">Report ID</span>
            <span className="font-semibold">{request.id}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="neo-pressed p-3 rounded-lg">
            <span className="text-xs text-muted-foreground block">Date</span>
            <span className="font-semibold">{new Date(request.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="neo-pressed p-3 rounded-lg">
            <span className="text-xs text-muted-foreground block">Phone</span>
            <span className="font-semibold">{request.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {tests.map(test => {
        if (!test) return null;
        return (
          <div key={test.id} className="neo-flat p-6 print:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{test.name}</h3>
              <span className="text-xs neo-pressed px-2 py-0.5 rounded-full">{test.code}</span>
            </div>

            {test.subSections.map(section => (
              <div key={section.id} className="mb-4 last:mb-0">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section.name}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground uppercase">
                        <th className="pb-2 pr-4">Parameter</th>
                        <th className="pb-2 pr-4 w-32">Result</th>
                        <th className="pb-2 pr-4">Unit</th>
                        <th className="pb-2">Normal Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.parameters.map(param => {
                        const val = results[param.id] || "";
                        return (
                          <tr key={param.id} className="border-t border-border/50">
                            <td className="py-2 pr-4 font-medium">{param.name}</td>
                            <td className="py-2 pr-4">
                              {request.status === "completed" || request.status === "delivered" ? (
                                <span className="font-semibold">{val || "—"}</span>
                              ) : (
                                <Input
                                  value={val}
                                  onChange={e => setResults({ ...results, [param.id]: e.target.value })}
                                  className="h-7 text-sm neo-pressed border-none"
                                  placeholder="Enter"
                                />
                              )}
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground">{param.unit}</td>
                            <td className="py-2 text-muted-foreground text-xs">{param.normalRange}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Remarks */}
      <div className="neo-flat p-6 print:shadow-none">
        <h3 className="font-bold mb-3">Remarks / Notes</h3>
        {request.status === "completed" || request.status === "delivered" ? (
          <p className="text-sm text-muted-foreground">{remarks || "No remarks"}</p>
        ) : (
          <Textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="Add any remarks or observations..."
            className="neo-pressed border-none"
          />
        )}
      </div>

      {/* Footer */}
      <div className="neo-flat p-6 print:shadow-none text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">BHAGWATI HOSPITAL — Pathology Department</p>
        <p>Daltonganj, Jharkhand - 822101 | This is a computer generated report</p>
      </div>
    </div>
  );
}
