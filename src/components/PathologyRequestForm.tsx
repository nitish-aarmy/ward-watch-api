import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DOCTORS, ALL_TESTS, BLOOD_TESTS, URINE_TESTS, STOOL_TESTS, TestType } from "@/types/pathology";
import { toast } from "sonner";
import { FlaskConical, Search, ChevronDown, ChevronRight } from "lucide-react";

interface PathologyRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PathologyRequestForm({ onSubmit, onCancel }: PathologyRequestFormProps) {
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState<number>(0);
  const [patientGender, setPatientGender] = useState<"male" | "female" | "other">("male");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("blood");

  const toggleTest = (testId: string) => {
    setSelectedTests(prev =>
      prev.includes(testId) ? prev.filter(t => t !== testId) : [...prev, testId]
    );
  };

  const totalPrice = selectedTests.reduce((sum, id) => {
    const test = ALL_TESTS.find(t => t.id === id);
    return sum + (test?.price || 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) { toast.error("Patient name is required"); return; }
    if (!patientAge || patientAge <= 0) { toast.error("Valid age is required"); return; }
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) { toast.error("Valid 10-digit phone required"); return; }
    if (!doctorId) { toast.error("Please select a doctor"); return; }
    if (selectedTests.length === 0) { toast.error("Please select at least one test"); return; }

    onSubmit({
      patientName,
      patientAge,
      patientGender,
      phoneNumber,
      referredBy,
      doctorId,
      testIds: selectedTests,
    });
  };

  const categories = [
    { key: "blood", label: "🩸 Blood Tests", tests: BLOOD_TESTS },
    { key: "urine", label: "🧪 Urine Tests", tests: URINE_TESTS },
    { key: "stool", label: "🔬 Stool Tests", tests: STOOL_TESTS },
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tests: cat.tests.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="neo-flat p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center neo-circle">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">New Pathology Request</h2>
            <p className="text-sm text-muted-foreground">Fill patient details and select tests</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Details */}
          <div className="neo-pressed p-5">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Patient Name *</Label>
                <Input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Full name" className="neo-pressed border-none" />
              </div>
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input type="number" value={patientAge || ""} onChange={e => setPatientAge(parseInt(e.target.value) || 0)} placeholder="Age" min="1" max="150" className="neo-pressed border-none" />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={patientGender} onValueChange={(v: any) => setPatientGender(v)}>
                  <SelectTrigger className="neo-pressed border-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="10-digit number" className="neo-pressed border-none" />
              </div>
              <div className="space-y-2">
                <Label>Referred By</Label>
                <Input value={referredBy} onChange={e => setReferredBy(e.target.value)} placeholder="Referral source" className="neo-pressed border-none" />
              </div>
              <div className="space-y-2">
                <Label>Doctor *</Label>
                <Select value={doctorId} onValueChange={setDoctorId}>
                  <SelectTrigger className="neo-pressed border-none"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    {DOCTORS.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Test Selection */}
          <div className="neo-pressed p-5">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Select Tests</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 neo-pressed border-none"
              />
            </div>

            <div className="space-y-3">
              {filteredCategories.map(cat => (
                <div key={cat.key}>
                  <button
                    type="button"
                    onClick={() => setExpandedCategory(expandedCategory === cat.key ? null : cat.key)}
                    className="w-full flex items-center justify-between p-3 neo-btn text-left"
                  >
                    <span className="font-semibold">{cat.label} ({cat.tests.length})</span>
                    {expandedCategory === cat.key ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {expandedCategory === cat.key && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 pl-2">
                      {cat.tests.map(test => (
                        <label
                          key={test.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            selectedTests.includes(test.id) ? "neo-pressed bg-primary/5" : "neo-flat hover:shadow-lg"
                          }`}
                        >
                          <Checkbox
                            checked={selectedTests.includes(test.id)}
                            onCheckedChange={() => toggleTest(test.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{test.name}</div>
                            <div className="text-xs text-muted-foreground">{test.code} • {test.subSections.length} sections</div>
                          </div>
                          <span className="text-sm font-semibold text-primary">₹{test.price}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedTests.length > 0 && (
            <div className="neo-convex p-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Selected Tests: </span>
                  <span className="font-bold">{selectedTests.length}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total: </span>
                  <span className="text-xl font-bold text-primary">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 neo-btn border-none bg-primary text-primary-foreground hover:bg-primary/90">
              Submit Request
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="neo-btn border-none">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
