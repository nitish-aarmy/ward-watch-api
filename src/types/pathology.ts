export interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Sushil Pander", specialization: "Pathologist" },
  { id: "d2", name: "Dr. Gautam", specialization: "Hematologist" },
  { id: "d3", name: "Dr. Ram Kinker Trivedi", specialization: "Biochemist" },
  { id: "d4", name: "Dr. Archana Pandey", specialization: "Microbiologist" },
  { id: "d5", name: "Dr. Pranav", specialization: "Clinical Pathologist" },
];

export type TestCategory = "blood" | "urine" | "stool" | "serology" | "thyroid" | "liver" | "kidney" | "lipid" | "diabetes" | "culture";

export interface TestParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  value?: string;
}

export interface TestSubSection {
  id: string;
  name: string;
  parameters: TestParameter[];
}

export interface TestType {
  id: string;
  category: TestCategory;
  name: string;
  code: string;
  subSections: TestSubSection[];
  price: number;
}

export interface PathologyRequest {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  phoneNumber: string;
  referredBy: string;
  doctorId: string;
  testIds: string[];
  status: "pending" | "in-progress" | "completed" | "delivered";
  createdAt: string;
  completedAt?: string;
  sampleCollectedAt?: string;
  results?: Record<string, string>;
  remarks?: string;
}

// ========== BLOOD TESTS ==========
export const BLOOD_TESTS: TestType[] = [
  {
    id: "cbc",
    category: "blood",
    name: "Complete Blood Count (CBC)",
    code: "CBC",
    price: 350,
    subSections: [
      {
        id: "cbc-rbc",
        name: "Red Blood Cell Parameters",
        parameters: [
          { id: "rbc-count", name: "RBC Count", unit: "million/µL", normalRange: "4.5–5.5 (M) / 4.0–5.0 (F)" },
          { id: "hemoglobin", name: "Hemoglobin (Hb)", unit: "g/dL", normalRange: "13.5–17.5 (M) / 12.0–16.0 (F)" },
          { id: "hematocrit", name: "Hematocrit (PCV)", unit: "%", normalRange: "38–50 (M) / 36–44 (F)" },
          { id: "mcv", name: "MCV", unit: "fL", normalRange: "80–100" },
          { id: "mch", name: "MCH", unit: "pg", normalRange: "27–33" },
          { id: "mchc", name: "MCHC", unit: "g/dL", normalRange: "32–36" },
          { id: "rdw", name: "RDW", unit: "%", normalRange: "11.5–14.5" },
        ],
      },
      {
        id: "cbc-wbc",
        name: "White Blood Cell Parameters",
        parameters: [
          { id: "wbc-count", name: "Total WBC Count", unit: "/µL", normalRange: "4,000–11,000" },
          { id: "neutrophils", name: "Neutrophils", unit: "%", normalRange: "40–70" },
          { id: "lymphocytes", name: "Lymphocytes", unit: "%", normalRange: "20–40" },
          { id: "monocytes", name: "Monocytes", unit: "%", normalRange: "2–8" },
          { id: "eosinophils", name: "Eosinophils", unit: "%", normalRange: "1–4" },
          { id: "basophils", name: "Basophils", unit: "%", normalRange: "0–1" },
        ],
      },
      {
        id: "cbc-platelet",
        name: "Platelet Parameters",
        parameters: [
          { id: "platelet-count", name: "Platelet Count", unit: "/µL", normalRange: "150,000–400,000" },
          { id: "mpv", name: "Mean Platelet Volume (MPV)", unit: "fL", normalRange: "7.5–11.5" },
        ],
      },
    ],
  },
  {
    id: "esr",
    category: "blood",
    name: "Erythrocyte Sedimentation Rate (ESR)",
    code: "ESR",
    price: 100,
    subSections: [
      {
        id: "esr-main",
        name: "ESR",
        parameters: [
          { id: "esr-1hr", name: "ESR (1st Hour)", unit: "mm/hr", normalRange: "0–15 (M) / 0–20 (F)" },
        ],
      },
    ],
  },
  {
    id: "blood-group",
    category: "blood",
    name: "Blood Grouping & Rh Typing",
    code: "BG",
    price: 150,
    subSections: [
      {
        id: "bg-main",
        name: "Blood Group",
        parameters: [
          { id: "abo-group", name: "ABO Blood Group", unit: "", normalRange: "A / B / AB / O" },
          { id: "rh-factor", name: "Rh Factor", unit: "", normalRange: "Positive / Negative" },
        ],
      },
    ],
  },
  {
    id: "blood-sugar",
    category: "diabetes",
    name: "Blood Sugar (Fasting/PP/Random)",
    code: "BSL",
    price: 80,
    subSections: [
      {
        id: "bsl-main",
        name: "Blood Sugar Levels",
        parameters: [
          { id: "fasting-sugar", name: "Fasting Blood Sugar", unit: "mg/dL", normalRange: "70–100" },
          { id: "pp-sugar", name: "Post Prandial Blood Sugar", unit: "mg/dL", normalRange: "< 140" },
          { id: "random-sugar", name: "Random Blood Sugar", unit: "mg/dL", normalRange: "< 200" },
        ],
      },
    ],
  },
  {
    id: "hba1c",
    category: "diabetes",
    name: "HbA1c (Glycated Hemoglobin)",
    code: "HBA1C",
    price: 450,
    subSections: [
      {
        id: "hba1c-main",
        name: "HbA1c",
        parameters: [
          { id: "hba1c-val", name: "HbA1c", unit: "%", normalRange: "< 5.7 (Normal) / 5.7–6.4 (Pre-diabetic) / ≥6.5 (Diabetic)" },
          { id: "eag", name: "Estimated Average Glucose", unit: "mg/dL", normalRange: "< 117" },
        ],
      },
    ],
  },
  {
    id: "lft",
    category: "liver",
    name: "Liver Function Test (LFT)",
    code: "LFT",
    price: 500,
    subSections: [
      {
        id: "lft-enzymes",
        name: "Liver Enzymes",
        parameters: [
          { id: "sgot", name: "SGOT (AST)", unit: "U/L", normalRange: "5–40" },
          { id: "sgpt", name: "SGPT (ALT)", unit: "U/L", normalRange: "7–56" },
          { id: "alp", name: "Alkaline Phosphatase (ALP)", unit: "U/L", normalRange: "44–147" },
          { id: "ggt", name: "GGT", unit: "U/L", normalRange: "9–48" },
        ],
      },
      {
        id: "lft-bilirubin",
        name: "Bilirubin",
        parameters: [
          { id: "total-bilirubin", name: "Total Bilirubin", unit: "mg/dL", normalRange: "0.1–1.2" },
          { id: "direct-bilirubin", name: "Direct Bilirubin", unit: "mg/dL", normalRange: "0–0.3" },
          { id: "indirect-bilirubin", name: "Indirect Bilirubin", unit: "mg/dL", normalRange: "0.1–0.9" },
        ],
      },
      {
        id: "lft-proteins",
        name: "Proteins",
        parameters: [
          { id: "total-protein", name: "Total Protein", unit: "g/dL", normalRange: "6.0–8.3" },
          { id: "albumin", name: "Albumin", unit: "g/dL", normalRange: "3.5–5.5" },
          { id: "globulin", name: "Globulin", unit: "g/dL", normalRange: "2.0–3.5" },
          { id: "ag-ratio", name: "A/G Ratio", unit: "", normalRange: "1.0–2.5" },
        ],
      },
    ],
  },
  {
    id: "kft",
    category: "kidney",
    name: "Kidney Function Test (KFT/RFT)",
    code: "KFT",
    price: 500,
    subSections: [
      {
        id: "kft-main",
        name: "Kidney Parameters",
        parameters: [
          { id: "urea", name: "Blood Urea", unit: "mg/dL", normalRange: "7–20" },
          { id: "bun", name: "BUN", unit: "mg/dL", normalRange: "6–24" },
          { id: "creatinine", name: "Serum Creatinine", unit: "mg/dL", normalRange: "0.7–1.3 (M) / 0.6–1.1 (F)" },
          { id: "uric-acid", name: "Uric Acid", unit: "mg/dL", normalRange: "3.4–7.0 (M) / 2.4–6.0 (F)" },
          { id: "egfr", name: "eGFR", unit: "mL/min/1.73m²", normalRange: "> 90" },
        ],
      },
      {
        id: "kft-electrolytes",
        name: "Electrolytes",
        parameters: [
          { id: "sodium", name: "Sodium (Na+)", unit: "mEq/L", normalRange: "136–145" },
          { id: "potassium", name: "Potassium (K+)", unit: "mEq/L", normalRange: "3.5–5.0" },
          { id: "chloride", name: "Chloride (Cl-)", unit: "mEq/L", normalRange: "98–106" },
          { id: "calcium", name: "Calcium", unit: "mg/dL", normalRange: "8.5–10.5" },
          { id: "phosphorus", name: "Phosphorus", unit: "mg/dL", normalRange: "2.5–4.5" },
        ],
      },
    ],
  },
  {
    id: "lipid-profile",
    category: "lipid",
    name: "Lipid Profile",
    code: "LIPID",
    price: 450,
    subSections: [
      {
        id: "lipid-main",
        name: "Lipid Panel",
        parameters: [
          { id: "total-cholesterol", name: "Total Cholesterol", unit: "mg/dL", normalRange: "< 200" },
          { id: "triglycerides", name: "Triglycerides", unit: "mg/dL", normalRange: "< 150" },
          { id: "hdl", name: "HDL Cholesterol", unit: "mg/dL", normalRange: "> 40 (M) / > 50 (F)" },
          { id: "ldl", name: "LDL Cholesterol", unit: "mg/dL", normalRange: "< 100" },
          { id: "vldl", name: "VLDL Cholesterol", unit: "mg/dL", normalRange: "< 30" },
          { id: "tc-hdl-ratio", name: "TC/HDL Ratio", unit: "", normalRange: "< 5.0" },
        ],
      },
    ],
  },
  {
    id: "thyroid",
    category: "thyroid",
    name: "Thyroid Function Test (TFT)",
    code: "TFT",
    price: 600,
    subSections: [
      {
        id: "tft-main",
        name: "Thyroid Hormones",
        parameters: [
          { id: "tsh", name: "TSH", unit: "µIU/mL", normalRange: "0.4–4.0" },
          { id: "t3", name: "T3 (Total)", unit: "ng/dL", normalRange: "80–200" },
          { id: "t4", name: "T4 (Total)", unit: "µg/dL", normalRange: "5.0–12.0" },
          { id: "ft3", name: "Free T3", unit: "pg/mL", normalRange: "2.3–4.2" },
          { id: "ft4", name: "Free T4", unit: "ng/dL", normalRange: "0.8–1.8" },
        ],
      },
    ],
  },
  {
    id: "coagulation",
    category: "blood",
    name: "Coagulation Profile",
    code: "COAG",
    price: 700,
    subSections: [
      {
        id: "coag-main",
        name: "Coagulation Tests",
        parameters: [
          { id: "pt", name: "Prothrombin Time (PT)", unit: "seconds", normalRange: "11–13.5" },
          { id: "inr", name: "INR", unit: "", normalRange: "0.8–1.1" },
          { id: "aptt", name: "aPTT", unit: "seconds", normalRange: "25–35" },
          { id: "bleeding-time", name: "Bleeding Time", unit: "minutes", normalRange: "2–7" },
          { id: "clotting-time", name: "Clotting Time", unit: "minutes", normalRange: "4–9" },
        ],
      },
    ],
  },
  {
    id: "serology",
    category: "serology",
    name: "Serology Panel",
    code: "SERO",
    price: 800,
    subSections: [
      {
        id: "sero-main",
        name: "Serological Tests",
        parameters: [
          { id: "hiv", name: "HIV I & II", unit: "", normalRange: "Non-Reactive" },
          { id: "hbsag", name: "HBsAg (Hepatitis B)", unit: "", normalRange: "Non-Reactive" },
          { id: "hcv", name: "HCV (Hepatitis C)", unit: "", normalRange: "Non-Reactive" },
          { id: "vdrl", name: "VDRL", unit: "", normalRange: "Non-Reactive" },
          { id: "widal", name: "Widal Test", unit: "", normalRange: "< 1:80" },
          { id: "ra-factor", name: "RA Factor", unit: "IU/mL", normalRange: "< 14" },
          { id: "crp", name: "CRP (C-Reactive Protein)", unit: "mg/L", normalRange: "< 6" },
          { id: "aso", name: "ASO Titre", unit: "IU/mL", normalRange: "< 200" },
        ],
      },
    ],
  },
  {
    id: "peripheral-smear",
    category: "blood",
    name: "Peripheral Blood Smear",
    code: "PBS",
    price: 200,
    subSections: [
      {
        id: "pbs-main",
        name: "Peripheral Smear",
        parameters: [
          { id: "rbc-morphology", name: "RBC Morphology", unit: "", normalRange: "Normocytic Normochromic" },
          { id: "wbc-morphology", name: "WBC Morphology", unit: "", normalRange: "Normal" },
          { id: "platelet-morphology", name: "Platelet Morphology", unit: "", normalRange: "Adequate" },
          { id: "parasites", name: "Malarial Parasite", unit: "", normalRange: "Not Seen" },
        ],
      },
    ],
  },
];

// ========== URINE TESTS ==========
export const URINE_TESTS: TestType[] = [
  {
    id: "urine-routine",
    category: "urine",
    name: "Urine Routine & Microscopy",
    code: "URM",
    price: 150,
    subSections: [
      {
        id: "urine-physical",
        name: "Physical Examination",
        parameters: [
          { id: "urine-color", name: "Color", unit: "", normalRange: "Pale Yellow to Amber" },
          { id: "urine-appearance", name: "Appearance", unit: "", normalRange: "Clear" },
          { id: "urine-volume", name: "Volume", unit: "mL", normalRange: "800–2000/day" },
          { id: "urine-sp-gravity", name: "Specific Gravity", unit: "", normalRange: "1.005–1.030" },
          { id: "urine-ph", name: "pH", unit: "", normalRange: "4.6–8.0" },
        ],
      },
      {
        id: "urine-chemical",
        name: "Chemical Examination",
        parameters: [
          { id: "urine-protein", name: "Protein (Albumin)", unit: "", normalRange: "Nil" },
          { id: "urine-glucose", name: "Glucose (Sugar)", unit: "", normalRange: "Nil" },
          { id: "urine-ketones", name: "Ketone Bodies", unit: "", normalRange: "Nil" },
          { id: "urine-bilirubin", name: "Bilirubin", unit: "", normalRange: "Nil" },
          { id: "urine-urobilinogen", name: "Urobilinogen", unit: "", normalRange: "Normal (0.2–1.0 EU/dL)" },
          { id: "urine-blood", name: "Blood (Occult)", unit: "", normalRange: "Nil" },
          { id: "urine-nitrite", name: "Nitrite", unit: "", normalRange: "Negative" },
          { id: "urine-leukocyte", name: "Leukocyte Esterase", unit: "", normalRange: "Negative" },
        ],
      },
      {
        id: "urine-microscopy",
        name: "Microscopic Examination",
        parameters: [
          { id: "urine-rbc", name: "RBCs", unit: "/HPF", normalRange: "0–2" },
          { id: "urine-wbc-pus", name: "WBCs (Pus Cells)", unit: "/HPF", normalRange: "0–5" },
          { id: "urine-epithelial", name: "Epithelial Cells", unit: "/HPF", normalRange: "Few" },
          { id: "urine-casts", name: "Casts", unit: "/LPF", normalRange: "Nil" },
          { id: "urine-crystals", name: "Crystals", unit: "", normalRange: "Nil" },
          { id: "urine-bacteria", name: "Bacteria", unit: "", normalRange: "Nil" },
          { id: "urine-yeast", name: "Yeast Cells", unit: "", normalRange: "Nil" },
        ],
      },
    ],
  },
  {
    id: "urine-culture",
    category: "culture",
    name: "Urine Culture & Sensitivity",
    code: "UCS",
    price: 500,
    subSections: [
      {
        id: "ucs-main",
        name: "Culture Results",
        parameters: [
          { id: "ucs-organism", name: "Organism Isolated", unit: "", normalRange: "No Growth" },
          { id: "ucs-colony-count", name: "Colony Count", unit: "CFU/mL", normalRange: "< 10,000" },
          { id: "ucs-sensitivity", name: "Antibiotic Sensitivity", unit: "", normalRange: "As per culture" },
        ],
      },
    ],
  },
  {
    id: "urine-microalbumin",
    category: "urine",
    name: "Urine Microalbumin",
    code: "UALB",
    price: 350,
    subSections: [
      {
        id: "ualb-main",
        name: "Microalbumin",
        parameters: [
          { id: "microalbumin", name: "Microalbumin", unit: "mg/L", normalRange: "< 20" },
          { id: "acr", name: "Albumin/Creatinine Ratio", unit: "mg/g", normalRange: "< 30" },
        ],
      },
    ],
  },
  {
    id: "urine-24hr-protein",
    category: "urine",
    name: "24-Hour Urine Protein",
    code: "U24P",
    price: 300,
    subSections: [
      {
        id: "u24p-main",
        name: "24-Hour Collection",
        parameters: [
          { id: "u24-volume", name: "Total Volume", unit: "mL", normalRange: "800–2000" },
          { id: "u24-protein", name: "Total Protein", unit: "mg/24hr", normalRange: "< 150" },
          { id: "u24-creatinine", name: "Creatinine Clearance", unit: "mL/min", normalRange: "88–128 (M) / 75–115 (F)" },
        ],
      },
    ],
  },
  {
    id: "urine-pregnancy",
    category: "urine",
    name: "Urine Pregnancy Test (UPT)",
    code: "UPT",
    price: 100,
    subSections: [
      {
        id: "upt-main",
        name: "Pregnancy Test",
        parameters: [
          { id: "upt-result", name: "hCG (Qualitative)", unit: "", normalRange: "Negative" },
        ],
      },
    ],
  },
  {
    id: "urine-drug-screen",
    category: "urine",
    name: "Urine Drug Screening",
    code: "UDS",
    price: 1200,
    subSections: [
      {
        id: "uds-main",
        name: "Drug Panel",
        parameters: [
          { id: "uds-amphetamine", name: "Amphetamines", unit: "", normalRange: "Negative" },
          { id: "uds-cannabis", name: "Cannabis (THC)", unit: "", normalRange: "Negative" },
          { id: "uds-cocaine", name: "Cocaine", unit: "", normalRange: "Negative" },
          { id: "uds-opiates", name: "Opiates", unit: "", normalRange: "Negative" },
          { id: "uds-benzodiazepine", name: "Benzodiazepines", unit: "", normalRange: "Negative" },
        ],
      },
    ],
  },
];

// ========== STOOL TESTS ==========
export const STOOL_TESTS: TestType[] = [
  {
    id: "stool-routine",
    category: "stool",
    name: "Stool Routine & Microscopy",
    code: "SRM",
    price: 150,
    subSections: [
      {
        id: "stool-physical",
        name: "Physical Examination",
        parameters: [
          { id: "stool-color", name: "Color", unit: "", normalRange: "Brown" },
          { id: "stool-consistency", name: "Consistency", unit: "", normalRange: "Formed" },
          { id: "stool-mucus", name: "Mucus", unit: "", normalRange: "Absent" },
          { id: "stool-blood-visible", name: "Blood (Visible)", unit: "", normalRange: "Absent" },
        ],
      },
      {
        id: "stool-micro",
        name: "Microscopic Examination",
        parameters: [
          { id: "stool-rbc", name: "RBCs", unit: "/HPF", normalRange: "Nil" },
          { id: "stool-wbc", name: "WBCs (Pus Cells)", unit: "/HPF", normalRange: "0–5" },
          { id: "stool-ova", name: "Ova/Parasites", unit: "", normalRange: "Not Seen" },
          { id: "stool-cysts", name: "Cysts", unit: "", normalRange: "Not Seen" },
          { id: "stool-occult-blood", name: "Occult Blood", unit: "", normalRange: "Negative" },
        ],
      },
    ],
  },
];

export const ALL_TESTS: TestType[] = [...BLOOD_TESTS, ...URINE_TESTS, ...STOOL_TESTS];

export function getTestsByCategory(category: TestCategory): TestType[] {
  return ALL_TESTS.filter(t => t.category === category);
}
