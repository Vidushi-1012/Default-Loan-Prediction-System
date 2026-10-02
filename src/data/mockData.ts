import { LoanApplication, DashboardMetrics, ModelMetrics, MonitoringData, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_8921',
  name: 'Vidushi Srivastava',
  email: 'vidushi.official1012@gmail.com',
  role: 'Senior Credit Risk Analyst',
  organization: 'Apex Institutional Capital',
  avatarUrl: '/src/assets/images/avatar_risk_officer_1790873328912.jpg',
};

export const INITIAL_APPLICATIONS: LoanApplication[] = [
  {
    id: 'LG-009412',
    applicantName: 'David K. Hensley',
    applicantEmail: 'd.hensley@capitaltech.io',
    age: 42,
    gender: 'M',
    familyStatus: 'Married',
    childrenCount: 2,
    familyMembersCount: 4,
    educationType: 'Higher education',
    incomeType: 'Commercial associate',
    employmentDurationYears: 8.5,
    occupation: 'Engineering Manager',
    organizationType: 'Technology / Software',
    annualIncome: 145000,
    loanAmount: 380000,
    loanAnnuity: 19800,
    goodsPrice: 380000,
    extSource1: 0.724,
    extSource2: 0.691,
    extSource3: 0.655,
    predictedDefaultProbability: 0.0482,
    riskLevel: 'Low',
    riskThreshold: 0.10,
    modelVersion: 'LoanGuard-M4',
    assessedAt: '2026-09-30T14:22:10Z',
    status: 'Approved',
    contributions: [
      { feature: 'ext_source_2', label: 'External Risk Score 2', impact: -0.114, valueFormatted: '0.691', relativeWeight: 92 },
      { feature: 'annual_income', label: 'Annual Income', impact: -0.082, valueFormatted: '$145,000', relativeWeight: 68 },
      { feature: 'employment_duration', label: 'Employment Duration', impact: -0.054, valueFormatted: '8.5 yrs', relativeWeight: 45 },
      { feature: 'loan_annuity_to_income', label: 'Annuity-to-Income Ratio', impact: 0.031, valueFormatted: '13.6%', relativeWeight: 26 },
      { feature: 'age', label: 'Applicant Age', impact: -0.021, valueFormatted: '42 yrs', relativeWeight: 18 },
    ],
    timeline: [
      { title: 'Application Submitted', description: 'Borrower portal ingestion complete', timestamp: '2026-09-30 14:20:00' },
      { title: 'Risk Assessment Generated', description: 'Scored by LoanGuard-M4 (Default Prob: 4.82%)', timestamp: '2026-09-30 14:22:10' },
      { title: 'Automated Clearance', description: 'Passed sub-10% threshold direct approval rule', timestamp: '2026-09-30 14:25:00' },
      { title: 'Approved', description: 'Underwriter sign-off finalized', timestamp: '2026-09-30 15:00:00', actor: 'V. Srivastava' }
    ]
  },
  {
    id: 'LG-009411',
    applicantName: 'Elena Rostova',
    applicantEmail: 'elena.rostova@medworks.org',
    age: 29,
    gender: 'F',
    familyStatus: 'Single',
    childrenCount: 0,
    familyMembersCount: 1,
    educationType: 'Higher education',
    incomeType: 'State servant',
    employmentDurationYears: 3.2,
    occupation: 'Clinical Researcher',
    organizationType: 'Healthcare / Public Sector',
    annualIncome: 88000,
    loanAmount: 260000,
    loanAnnuity: 15400,
    goodsPrice: 245000,
    extSource1: 0.512,
    extSource2: 0.448,
    extSource3: 0.485,
    predictedDefaultProbability: 0.1245,
    riskLevel: 'Medium',
    riskThreshold: 0.10,
    modelVersion: 'LoanGuard-M4',
    assessedAt: '2026-09-30T11:45:00Z',
    status: 'Under Review',
    contributions: [
      { feature: 'loan_amount_to_income', label: 'Loan-to-Income Ratio', impact: 0.068, valueFormatted: '2.95x', relativeWeight: 75 },
      { feature: 'ext_source_2', label: 'External Risk Score 2', impact: 0.042, valueFormatted: '0.448', relativeWeight: 52 },
      { feature: 'employment_duration', label: 'Employment Duration', impact: 0.028, valueFormatted: '3.2 yrs', relativeWeight: 34 },
      { feature: 'education_type', label: 'Education Level', impact: -0.035, valueFormatted: 'Higher Education', relativeWeight: 42 },
      { feature: 'goods_price_diff', label: 'Down Payment Coverage', impact: 0.021, valueFormatted: '$15,000 spread', relativeWeight: 25 },
    ],
    timeline: [
      { title: 'Application Submitted', description: 'Intake via direct banking channel', timestamp: '2026-09-30 11:40:00' },
      { title: 'Risk Assessment Generated', description: 'Scored by LoanGuard-M4 (Default Prob: 12.45%)', timestamp: '2026-09-30 11:45:00' },
      { title: 'Flagged for Underwriter Review', description: 'Probability exceeds 10.00% benchmark', timestamp: '2026-09-30 11:45:30' }
    ]
  },
  {
    id: 'LG-009410',
    applicantName: 'Marcus Vance',
    applicantEmail: 'mvance.freelance@logistics.net',
    age: 24,
    gender: 'M',
    familyStatus: 'Single',
    childrenCount: 0,
    familyMembersCount: 1,
    educationType: 'Secondary / secondary special',
    incomeType: 'Working',
    employmentDurationYears: 0.8,
    occupation: 'Logistics Courier',
    organizationType: 'Transportation / Delivery',
    annualIncome: 34000,
    loanAmount: 220000,
    loanAnnuity: 16200,
    goodsPrice: 195000,
    extSource1: 0.182,
    extSource2: 0.219,
    extSource3: 0.154,
    predictedDefaultProbability: 0.3840,
    riskLevel: 'High',
    riskThreshold: 0.10,
    modelVersion: 'LoanGuard-M4',
    assessedAt: '2026-09-29T18:12:44Z',
    status: 'Flagged',
    contributions: [
      { feature: 'ext_source_3', label: 'External Risk Score 3', impact: 0.162, valueFormatted: '0.154', relativeWeight: 98 },
      { feature: 'debt_to_income', label: 'Debt Service-to-Income', impact: 0.138, valueFormatted: '47.6%', relativeWeight: 84 },
      { feature: 'employment_duration', label: 'Employment Duration', impact: 0.089, valueFormatted: '0.8 yrs', relativeWeight: 54 },
      { feature: 'ext_source_2', label: 'External Risk Score 2', impact: 0.076, valueFormatted: '0.219', relativeWeight: 46 },
      { feature: 'age', label: 'Applicant Age', impact: 0.041, valueFormatted: '24 yrs', relativeWeight: 25 },
    ],
    timeline: [
      { title: 'Application Submitted', description: 'Partner API syndication feed', timestamp: '2026-09-29 18:10:00' },
      { title: 'Risk Assessment Generated', description: 'High probability alert (38.40%)', timestamp: '2026-09-29 18:12:44' },
      { title: 'Secondary Verification Required', description: 'Proof of income and bureau credit report audit', timestamp: '2026-09-29 18:15:00' }
    ]
  },
  {
    id: 'LG-009409',
    applicantName: 'Claire Beauchamp',
    applicantEmail: 'c.beauchamp@architects.co',
    age: 38,
    gender: 'F',
    familyStatus: 'Married',
    childrenCount: 1,
    familyMembersCount: 3,
    educationType: 'Higher education',
    incomeType: 'Commercial associate',
    employmentDurationYears: 9.0,
    occupation: 'Lead Architect',
    organizationType: 'Construction & Real Estate',
    annualIncome: 160000,
    loanAmount: 450000,
    loanAnnuity: 22800,
    goodsPrice: 450000,
    extSource1: 0.684,
    extSource2: 0.741,
    extSource3: 0.612,
    predictedDefaultProbability: 0.0390,
    riskLevel: 'Low',
    riskThreshold: 0.10,
    modelVersion: 'LoanGuard-M4',
    assessedAt: '2026-09-29T15:30:12Z',
    status: 'Approved',
    contributions: [
      { feature: 'ext_source_2', label: 'External Risk Score 2', impact: -0.125, valueFormatted: '0.741', relativeWeight: 95 },
      { feature: 'annual_income', label: 'Annual Income', impact: -0.091, valueFormatted: '$160,000', relativeWeight: 72 },
      { feature: 'employment_duration', label: 'Employment Duration', impact: -0.061, valueFormatted: '9.0 yrs', relativeWeight: 49 },
      { feature: 'loan_to_goods', label: 'Collateral Match Ratio', impact: -0.038, valueFormatted: '100%', relativeWeight: 31 },
    ],
    timeline: [
      { title: 'Application Submitted', description: 'In-branch digital submission', timestamp: '2026-09-29 15:25:00' },
      { title: 'Risk Assessment Generated', description: 'Scored by LoanGuard-M4 (3.90%)', timestamp: '2026-09-29 15:30:12' },
      { title: 'Auto-Approved', description: 'Tier 1 credit classification', timestamp: '2026-09-29 15:35:00' }
    ]
  },
  {
    id: 'LG-009408',
    applicantName: 'Tariq Al-Mansoor',
    applicantEmail: 'tariq.mansoor@freightlink.com',
    age: 33,
    gender: 'M',
    familyStatus: 'Civil marriage',
    childrenCount: 1,
    familyMembersCount: 3,
    educationType: 'Secondary / secondary special',
    incomeType: 'Working',
    employmentDurationYears: 4.1,
    occupation: 'Warehouse Supervisor',
    organizationType: 'Logistics',
    annualIncome: 58000,
    loanAmount: 180000,
    loanAnnuity: 13500,
    goodsPrice: 170000,
    extSource1: 0.389,
    extSource2: 0.412,
    extSource3: 0.345,
    predictedDefaultProbability: 0.1780,
    riskLevel: 'Medium',
    riskThreshold: 0.10,
    modelVersion: 'LoanGuard-M4',
    assessedAt: '2026-09-29T10:04:19Z',
    status: 'Under Review',
    contributions: [
      { feature: 'ext_source_3', label: 'External Risk Score 3', impact: 0.082, valueFormatted: '0.345', relativeWeight: 79 },
      { feature: 'loan_annuity_to_income', label: 'Debt Service Burden', impact: 0.064, valueFormatted: '23.3%', relativeWeight: 62 },
      { feature: 'ext_source_2', label: 'External Risk Score 2', impact: 0.048, valueFormatted: '0.412', relativeWeight: 47 },
      { feature: 'employment_duration', label: 'Employment Duration', impact: -0.024, valueFormatted: '4.1 yrs', relativeWeight: 24 },
    ],
    timeline: [
      { title: 'Application Submitted', description: 'Mobile channel intake', timestamp: '2026-09-29 10:00:00' },
      { title: 'Risk Assessment Generated', description: 'Medium risk calculated (17.80%)', timestamp: '2026-09-29 10:04:19' }
    ]
  },
  {
    id: 'LG-009407',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 's.jenkins@retailventures.com',
    age: 26,
    gender: 'F',
    familyStatus: 'Single',
    childrenCount: 0,
    familyMembersCount: 1,
    educationType: 'Secondary / secondary special',
    incomeType: 'Working',
    employmentDurationYears: 1.1,
    occupation: 'Sales Associate',
    organizationType: 'Retail & Consumer Goods',
    annualIncome: 31000,
    loanAmount: 195000,
    loanAnnuity: 14800,
    goodsPrice: 180000,
    extSource1: 0.221,
    extSource2: 0.284,
    extSource3: 0.203,
    predictedDefaultProbability: 0.3120,
    riskLevel: 'High',
    riskThreshold: 0.10,
    modelVersion: 'LoanGuard-M4',
    assessedAt: '2026-09-28T16:42:01Z',
    status: 'Declined',
    contributions: [
      { feature: 'loan_amount_to_income', label: 'Loan-to-Income Exposure', impact: 0.155, valueFormatted: '6.29x', relativeWeight: 94 },
      { feature: 'ext_source_3', label: 'External Risk Score 3', impact: 0.124, valueFormatted: '0.203', relativeWeight: 76 },
      { feature: 'debt_to_income', label: 'Debt Service Burden', impact: 0.102, valueFormatted: '47.7%', relativeWeight: 62 },
      { feature: 'employment_duration', label: 'Employment Duration', impact: 0.065, valueFormatted: '1.1 yrs', relativeWeight: 40 },
    ],
    timeline: [
      { title: 'Application Submitted', description: 'Online intake', timestamp: '2026-09-28 16:38:00' },
      { title: 'Risk Assessment Generated', description: 'High Risk (31.20%)', timestamp: '2026-09-28 16:42:01' },
      { title: 'Declined', description: 'Debt-to-income exceeds portfolio underwriting cap', timestamp: '2026-09-28 17:00:00', actor: 'Credit Committee' }
    ]
  },
  {
    id: 'LG-009406',
    applicantName: 'Robert Vance Jr.',
    applicantEmail: 'robert.vance@precisiontech.com',
    age: 48,
    gender: 'M',
    familyStatus: 'Married',
    childrenCount: 2,
    familyMembersCount: 4,
    educationType: 'Higher education',
    incomeType: 'Commercial associate',
    employmentDurationYears: 14.2,
    occupation: 'Principal Mechanical Engineer',
    organizationType: 'Manufacturing / Industrial',
    annualIncome: 172000,
    loanAmount: 420000,
    loanAnnuity: 21600,
    goodsPrice: 420000,
    extSource1: 0.781,
    extSource2: 0.814,
    extSource3: 0.722,
    predictedDefaultProbability: 0.0210,
    riskLevel: 'Low',
    riskThreshold: 0.10,
    modelVersion: 'LoanGuard-M4',
    assessedAt: '2026-09-28T14:15:33Z',
    status: 'Approved',
    contributions: [
      { feature: 'ext_source_2', label: 'External Risk Score 2', impact: -0.142, valueFormatted: '0.814', relativeWeight: 96 },
      { feature: 'employment_duration', label: 'Employment Duration', impact: -0.098, valueFormatted: '14.2 yrs', relativeWeight: 70 },
      { feature: 'annual_income', label: 'Annual Income', impact: -0.088, valueFormatted: '$172,000', relativeWeight: 63 },
      { feature: 'ext_source_1', label: 'External Risk Score 1', impact: -0.065, valueFormatted: '0.781', relativeWeight: 47 },
    ],
    timeline: [
      { title: 'Application Submitted', description: 'Executive portal workflow', timestamp: '2026-09-28 14:10:00' },
      { title: 'Risk Assessment Generated', description: 'Scored by LoanGuard-M4 (2.10%)', timestamp: '2026-09-28 14:15:33' },
      { title: 'Instant Approval Issued', description: 'Fast-track approval threshold satisfied', timestamp: '2026-09-28 14:16:00' }
    ]
  }
];

export const INITIAL_DASHBOARD_METRICS: DashboardMetrics = {
  totalApplications: 12482,
  totalApplicationsChangePct: 8.4,
  defaultRiskRate: 0.087, // 8.7%
  defaultRiskRateChangePct: -1.2,
  averageRiskScore: 0.142,
  averageRiskScoreChangePct: -0.008,
  highRiskCount: 384,
  highRiskCountChangePct: -4.3,
  riskDistribution: [
    { name: 'Low', count: 8740, percentage: 70.0, color: '#16A34A' },
    { name: 'Medium', count: 2854, percentage: 22.9, color: '#D97706' },
    { name: 'High', count: 888, percentage: 7.1, color: '#DC2626' }
  ],
  portfolioTrend: [
    { date: 'Sep 01', avgRiskScore: 0.158, highRiskVolume: 42, totalVolume: 410 },
    { date: 'Sep 06', avgRiskScore: 0.151, highRiskVolume: 38, totalVolume: 440 },
    { date: 'Sep 11', avgRiskScore: 0.147, highRiskVolume: 35, totalVolume: 425 },
    { date: 'Sep 16', avgRiskScore: 0.144, highRiskVolume: 31, totalVolume: 460 },
    { date: 'Sep 21', avgRiskScore: 0.141, highRiskVolume: 29, totalVolume: 480 },
    { date: 'Sep 26', avgRiskScore: 0.139, highRiskVolume: 26, totalVolume: 512 },
    { date: 'Sep 30', avgRiskScore: 0.142, highRiskVolume: 28, totalVolume: 495 }
  ],
  riskExposure: [
    { category: 'Consumer Installment', low: 4500000, medium: 1850000, high: 520000 },
    { category: 'Mortgage / Real Estate', low: 18200000, medium: 4100000, high: 890000 },
    { category: 'Commercial & SME', low: 9400000, medium: 3200000, high: 1100000 },
    { category: 'Auto Financing', low: 3100000, medium: 1400000, high: 430000 }
  ]
};

export const INITIAL_MODEL_METRICS: ModelMetrics = {
  version: 'LoanGuard-M4',
  modelType: 'LightGBM Ensemble + Gradient Boosting Classifier',
  trainingDataset: 'Home Credit Default Risk Benchmark (307,511 loans)',
  trainingDate: '2026-08-15',
  featureCount: 74,
  lastEvaluated: '2026-09-30 04:00 UTC',
  metrics: {
    rocAuc: 0.7942,
    prAuc: 0.3812,
    precision: 0.684,
    recall: 0.612,
    f1Score: 0.646,
    brierScore: 0.068
  },
  rocCurveData: [
    { fpr: 0.0, tpr: 0.0, baseline: 0.0 },
    { fpr: 0.05, tpr: 0.28, baseline: 0.05 },
    { fpr: 0.10, tpr: 0.46, baseline: 0.10 },
    { fpr: 0.15, tpr: 0.58, baseline: 0.15 },
    { fpr: 0.20, tpr: 0.67, baseline: 0.20 },
    { fpr: 0.30, tpr: 0.78, baseline: 0.30 },
    { fpr: 0.40, tpr: 0.85, baseline: 0.40 },
    { fpr: 0.50, tpr: 0.90, baseline: 0.50 },
    { fpr: 0.70, tpr: 0.96, baseline: 0.70 },
    { fpr: 1.0, tpr: 1.0, baseline: 1.0 }
  ],
  prCurveData: [
    { recall: 0.0, precision: 0.85, baseline: 0.087 },
    { recall: 0.1, precision: 0.79, baseline: 0.087 },
    { recall: 0.2, precision: 0.72, baseline: 0.087 },
    { recall: 0.3, precision: 0.65, baseline: 0.087 },
    { recall: 0.4, precision: 0.58, baseline: 0.087 },
    { recall: 0.5, precision: 0.51, baseline: 0.087 },
    { recall: 0.6, precision: 0.42, baseline: 0.087 },
    { recall: 0.7, precision: 0.33, baseline: 0.087 },
    { recall: 0.8, precision: 0.24, baseline: 0.087 },
    { recall: 0.9, precision: 0.16, baseline: 0.087 },
    { recall: 1.0, precision: 0.087, baseline: 0.087 }
  ],
  calibrationData: [
    { predictedProbability: 0.05, empiricalProbability: 0.048, perfect: 0.05 },
    { predictedProbability: 0.15, empiricalProbability: 0.142, perfect: 0.15 },
    { predictedProbability: 0.25, empiricalProbability: 0.261, perfect: 0.25 },
    { predictedProbability: 0.35, empiricalProbability: 0.339, perfect: 0.35 },
    { predictedProbability: 0.45, empiricalProbability: 0.458, perfect: 0.45 },
    { predictedProbability: 0.55, empiricalProbability: 0.542, perfect: 0.55 },
    { predictedProbability: 0.65, empiricalProbability: 0.638, perfect: 0.65 },
    { predictedProbability: 0.75, empiricalProbability: 0.762, perfect: 0.75 }
  ]
};

export const INITIAL_MONITORING_DATA: MonitoringData = {
  healthStatus: 'Healthy',
  lastHealthCheck: '2026-10-01 08:30 UTC',
  isSimulated: true,
  activeDriftAlerts: 1,
  dataFreshnessHours: 1.2,
  featureDrift: [
    {
      feature: 'EXT_SOURCE_2',
      psi: 0.042,
      referencePeriod: '2026-Q2 Baseline',
      currentPeriod: 'Past 30 Days',
      status: 'Low'
    },
    {
      feature: 'AMT_INCOME_TOTAL',
      psi: 0.078,
      referencePeriod: '2026-Q2 Baseline',
      currentPeriod: 'Past 30 Days',
      status: 'Low'
    },
    {
      feature: 'AMT_ANNUITY / AMT_INCOME',
      psi: 0.134,
      referencePeriod: '2026-Q2 Baseline',
      currentPeriod: 'Past 30 Days',
      status: 'Moderate'
    },
    {
      feature: 'DAYS_EMPLOYED',
      psi: 0.061,
      referencePeriod: '2026-Q2 Baseline',
      currentPeriod: 'Past 30 Days',
      status: 'Low'
    },
    {
      feature: 'EXT_SOURCE_3',
      psi: 0.089,
      referencePeriod: '2026-Q2 Baseline',
      currentPeriod: 'Past 30 Days',
      status: 'Low'
    },
    {
      feature: 'ORGANIZATION_TYPE',
      psi: 0.162,
      referencePeriod: '2026-Q2 Baseline',
      currentPeriod: 'Past 30 Days',
      status: 'Moderate'
    }
  ],
  predictionDrift: [
    { bucket: '0.00 - 0.05', referenceDistribution: 48.2, productionDistribution: 47.1 },
    { bucket: '0.05 - 0.10', referenceDistribution: 22.4, productionDistribution: 23.2 },
    { bucket: '0.10 - 0.20', referenceDistribution: 16.5, productionDistribution: 17.1 },
    { bucket: '0.20 - 0.35', referenceDistribution: 8.1, productionDistribution: 7.9 },
    { bucket: '0.35 - 0.50', referenceDistribution: 3.4, productionDistribution: 3.2 },
    { bucket: '> 0.50', referenceDistribution: 1.4, productionDistribution: 1.5 }
  ],
  dataQuality: {
    totalRecordsAudited: 12482,
    missingValuesCount: 14,
    missingValuesPct: 0.11,
    uniqueApplicantsPct: 99.8,
    invalidValuesCount: 2,
    schemaChanges: 'None detected (Version 4.1 Schema Spec)'
  }
};
