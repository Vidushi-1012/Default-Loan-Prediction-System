import { DashboardMetrics, LoanApplication, ModelMetrics, MonitoringData } from '../types';
import { INITIAL_APPLICATIONS } from '../data/mockData';

const getApplications = (): LoanApplication[] => {
  if (typeof window === 'undefined') return INITIAL_APPLICATIONS;
  try {
    const raw = window.localStorage.getItem('loan-guard-applications');
    return raw ? (JSON.parse(raw) as LoanApplication[]) : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
};

export const analyticsService = {
  async getOverview(): Promise<DashboardMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const apps = getApplications();

    const totalApplications = apps.length;
    const defaultRiskRate = apps.length ? apps.filter((app) => app.riskLevel === 'High').length / apps.length : 0;
    const averageRiskScore = apps.length ? apps.reduce((sum, app) => sum + app.predictedDefaultProbability, 0) / apps.length : 0;
    const highRiskCount = apps.filter((app) => app.riskLevel === 'High').length;

    return {
      totalApplications,
      totalApplicationsChangePct: 12.4,
      defaultRiskRate,
      defaultRiskRateChangePct: -1.8,
      averageRiskScore,
      averageRiskScoreChangePct: 2.3,
      highRiskCount,
      highRiskCountChangePct: 4.1,
      riskDistribution: [
        { name: 'Low', count: apps.filter((app) => app.riskLevel === 'Low').length, percentage: 45, color: '#16A34A' },
        { name: 'Medium', count: apps.filter((app) => app.riskLevel === 'Medium').length, percentage: 35, color: '#D97706' },
        { name: 'High', count: highRiskCount, percentage: 20, color: '#DC2626' },
      ],
      portfolioTrend: [
        { date: 'Jan', avgRiskScore: 0.18, highRiskVolume: 4, totalVolume: 18 },
        { date: 'Feb', avgRiskScore: 0.17, highRiskVolume: 5, totalVolume: 20 },
        { date: 'Mar', avgRiskScore: 0.2, highRiskVolume: 6, totalVolume: 22 },
        { date: 'Apr', avgRiskScore: 0.19, highRiskVolume: 4, totalVolume: 21 },
      ],
      riskExposure: [
        { category: 'Consumer', low: 900000, medium: 650000, high: 430000 },
        { category: 'SME', low: 710000, medium: 550000, high: 490000 },
        { category: 'Mortgage', low: 880000, medium: 620000, high: 310000 },
      ],
    };
  },

  async getModels(): Promise<ModelMetrics[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
      {
        version: 'LoanGuard-M4',
        modelType: 'Gradient Boosted Trees',
        trainingDataset: 'Home Credit - 2026 Portfolio',
        trainingDate: '2026-08-15',
        featureCount: 18,
        lastEvaluated: '2026-09-30',
        metrics: { rocAuc: 0.87, prAuc: 0.71, precision: 0.82, recall: 0.78, f1Score: 0.8, brierScore: 0.11 },
        rocCurveData: [],
        prCurveData: [],
        calibrationData: [],
      },
    ];
  },

  async getMonitoring(): Promise<MonitoringData> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      healthStatus: 'Healthy',
      lastHealthCheck: new Date().toISOString(),
      isSimulated: true,
      activeDriftAlerts: 1,
      dataFreshnessHours: 2,
      featureDrift: [
        { feature: 'annual_income', psi: 0.013, referencePeriod: 'Aug 2026', currentPeriod: 'Sep 2026', status: 'Low' },
        { feature: 'employment_duration', psi: 0.045, referencePeriod: 'Aug 2026', currentPeriod: 'Sep 2026', status: 'Moderate' },
      ],
      predictionDrift: [
        { bucket: '0-10%', referenceDistribution: 0.36, productionDistribution: 0.33 },
        { bucket: '10-25%', referenceDistribution: 0.42, productionDistribution: 0.46 },
      ],
      dataQuality: {
        totalRecordsAudited: 2450,
        missingValuesCount: 17,
        missingValuesPct: 0.69,
        uniqueApplicantsPct: 98.4,
        invalidValuesCount: 4,
        schemaChanges: 'No critical schema changes detected',
      },
    };
  },

  async exportCsv(): Promise<string> {
    const apps = getApplications();
    const rows = [
      ['id', 'applicantName', 'riskLevel', 'predictedDefaultProbability', 'status'],
      ...apps.map((app) => [app.id, app.applicantName, app.riskLevel, String(app.predictedDefaultProbability), app.status]),
    ];
    return rows.map((row) => row.join(',')).join('\n');
  },
};
