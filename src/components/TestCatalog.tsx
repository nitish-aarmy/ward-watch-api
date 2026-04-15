import { BLOOD_TESTS, URINE_TESTS, STOOL_TESTS, TestType } from "@/types/pathology";
import { useState } from "react";
import { ChevronDown, ChevronRight, Droplets, TestTube2, Microscope } from "lucide-react";

export function TestCatalog() {
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blood" | "urine" | "stool">("blood");

  const tabs = [
    { key: "blood" as const, label: "Blood Tests", icon: Droplets, tests: BLOOD_TESTS, count: BLOOD_TESTS.length },
    { key: "urine" as const, label: "Urine Tests", icon: TestTube2, tests: URINE_TESTS, count: URINE_TESTS.length },
    { key: "stool" as const, label: "Stool Tests", icon: Microscope, tests: STOOL_TESTS, count: STOOL_TESTS.length },
  ];

  const currentTests = tabs.find(t => t.key === activeTab)?.tests || [];

  return (
    <div className="space-y-4">
      <div className="neo-flat p-5">
        <h2 className="text-xl font-bold mb-1">Test Catalog</h2>
        <p className="text-sm text-muted-foreground mb-5">Complete list of available pathology tests with parameters and normal ranges</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setExpandedTest(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.key ? "neo-pressed text-primary" : "neo-btn"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className="text-xs opacity-70">({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Test List */}
        <div className="space-y-3">
          {currentTests.map(test => (
            <div key={test.id}>
              <button
                onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                className="w-full flex items-center justify-between p-4 neo-flat hover:shadow-lg transition-all text-left"
              >
                <div>
                  <div className="font-semibold">{test.name}</div>
                  <div className="text-xs text-muted-foreground">{test.code} • {test.subSections.reduce((sum, s) => sum + s.parameters.length, 0)} parameters • ₹{test.price}</div>
                </div>
                {expandedTest === test.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {expandedTest === test.id && (
                <div className="mt-2 ml-4 space-y-3">
                  {test.subSections.map(section => (
                    <div key={section.id} className="neo-pressed p-4">
                      <h4 className="text-sm font-semibold text-primary mb-3">{section.name}</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-muted-foreground uppercase">
                            <th className="text-left pb-2">Parameter</th>
                            <th className="text-left pb-2">Unit</th>
                            <th className="text-left pb-2">Normal Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.parameters.map(p => (
                            <tr key={p.id} className="border-t border-border/30">
                              <td className="py-1.5 font-medium">{p.name}</td>
                              <td className="py-1.5 text-muted-foreground">{p.unit || "—"}</td>
                              <td className="py-1.5 text-muted-foreground text-xs">{p.normalRange}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
