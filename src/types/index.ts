export type RiskLevel = 'Low' | 'Medium' | 'High';

export type ApplicationStatus = 'Approved' | 'Under Review' | 'Flagged' | 'Declined';

export interface ModelContribution {
  feature: string;
  label: string;
  impact: number; // positive = increased risk, negative = decreased risk
  valueFormatted: string;
  relativeWeight: number; // 0 to 100 for visual bar
}

export interface LoanApplication {
  id: string; // e.g. LG-008492
  applicantName: string;
  applicantEmail: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  familyStatus: 'Married' | 'Single' | 'Civil marriage' | 'Separated' | 'Widow';
  childrenCount: number;
  familyMembersCount: number;
  educationType: 'Higher education' | 'Secondary / secondary special' | 'Incomplete higher' | 'Lower secondary' | 'Academic degree';
  incomeType: 'Working' | 'Commercial associate' | 'State servant' | 'Pensioner' | 'Student';
  
  // Employment
  employmentDurationYears: number;
  occupation: string;
  organizationType: string;
  
  // Financial
  annualIncome: number;
  loanAmount: number;
  loanAnnuity: number;
  goodsPrice: number;
  
  // External Risk Scores (Home Credit / Bureau features 0.0 to 1.0)
  extSource1: number;
  extSource2: number;
  extSource3: number;
  
  // Prediction Output
  predictedDefaultProbability: number; // e.g. 0.1834
  riskLevel: RiskLevel;
  riskThreshold: number; // default 0.10
  modelVersion: string; // "LoanGuard-M4"
  assessedAt: string; // ISO date
  
  status: ApplicationStatus;
  contributions: ModelContribution[];
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    actor?: string;
  }[];
}

export interface PredictRequest {
  applicant_name?: string;
  age: number;
  gender: string;
  family_status: string;
  children_count: number;
  family_members_count: number;
  education_type: string;
  income_type: string;
  employment_duration_years: number;
  occupation: string;
  organization_type: string;
  annual_income: number;
  loan_amount: number;
  loan_annuity: number;
  goods_price: number;
  ext_source_1: number;
  ext_source_2: number;
  ext_source_3: number;
}

export interface PredictResponse {
  success: boolean;
  data: {
    application_id: string;
    predicted_default_probability: number;
    risk_label: RiskLevel;
    risk_threshold: number;
    model_version: string;
    assessed_at: string;
    contributions: ModelContribution[];
  };
}

export interface DashboardMetrics {
  totalApplications: number;
  totalApplicationsChangePct: number;
  defaultRiskRate: number;
  defaultRiskRateChangePct: number;
  averageRiskScore: number;
  averageRiskScoreChangePct: number;
  highRiskCount: number;
  highRiskCountChangePct: number;
  riskDistribution: {
    name: RiskLevel;
    count: number;
    percentage: number;
    color: string;
  }[];
  portfolioTrend: {
    date: string;
    avgRiskScore: number;
    highRiskVolume: number;
    totalVolume: number;
  }[];
  riskExposure: {
    category: string;
    low: number;
    medium: number;
    high: number;
  }[];
}

export interface ModelMetrics {
  version: string;
  modelType: string;
  trainingDataset: string;
  trainingDate: string;
  featureCount: number;
  lastEvaluated: string;
  metrics: {
    rocAuc: number | null;
    prAuc: number | null;
    precision: number | null;
    recall: number | null;
    f1Score: number | null;
    brierScore: number | null;
  };
  rocCurveData: { fpr: number; tpr: number; baseline: number }[];
  prCurveData: { recall: number; precision: number; baseline: number }[];
  calibrationData: { predictedProbability: number; empiricalProbability: number; perfect: number }[];
}

export interface MonitoringData {
  healthStatus: 'Healthy' | 'Warning' | 'Critical';
  lastHealthCheck: string;
  isSimulated: boolean;
  activeDriftAlerts: number;
  dataFreshnessHours: number;
  featureDrift: {
    feature: string;
    psi: number;
    referencePeriod: string;
    currentPeriod: string;
    status: 'Low' | 'Moderate' | 'High';
  }[];
  predictionDrift: {
    bucket: string;
    referenceDistribution: number;
    productionDistribution: number;
  }[];
  dataQuality: {
    totalRecordsAudited: number;
    missingValuesCount: number;
    missingValuesPct: number;
    uniqueApplicantsPct: number;
    invalidValuesCount: number;
    schemaChanges: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl?: string;
}
