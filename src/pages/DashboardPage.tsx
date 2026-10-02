import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  TrendingDown,
  Users,
  RotateCcw,
  Download,
  Calendar,
  CheckCircle,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { RiskBadge } from '../components/RiskBadge';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Modal } from '../components/Modal';
import { DashboardMetrics, LoanApplication, ApplicationStatus } from '../types';
import { analyticsService } from '../services/analytics';
import { applicationService } from '../services/applications';
import { useTheme } from '../context/ThemeContext';

interface DashboardPageProps {
  onViewApplication: (id: string) => void;
  onNavigatePredict: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onViewApplication,
  onNavigatePredict,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentApplications, setRecentApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [reviewingApp, setReviewingApp] = useState<LoanApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, apps] = await Promise.all([
        analyticsService.getOverview(),
        applicationService.getApplications(),
      ]);
      setMetrics(overviewData);
      setRecentApplications(apps);
    } catch {
      setError('Unable to load loan risk overview. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleExportCsv = async () => {
    try {
      const csv = await analyticsService.exportCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `LoanGuard_Portfolio_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Unable to export portfolio CSV.');
    }
  };

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!reviewingApp) return;
    setUpdatingStatus(true);
    try {
      await applicationService.updateStatus(reviewingApp.id, newStatus, reviewNotes);
      setReviewingApp(null);
      setReviewNotes('');
      await loadDashboardData();
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // High risk applications for the Review Section
  const highRiskApplications = recentApplications.filter((a) => a.riskLevel === 'High');

  if (loading && !metrics) {
    return <LoadingState message="Aggregating portfolio risk metrics and applications..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  const COLORS = ['#16A34A', '#D97706', '#DC2626'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Loan Risk Overview"
        subtitle="Monitor application activity and portfolio risk."
        actions={
          <div className="flex items-center gap-2">
            {/* Date Range Selector */}
            <div className="flex items-center bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer dark:bg-[#111827] dark:text-slate-200"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last Quarter</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={loadDashboardData}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-md transition-colors"
              title="Refresh metrics"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Export */}
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-md transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Export</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Applications"
            value={metrics.totalApplications.toLocaleString()}
            changePct={metrics.totalApplicationsChangePct}
            changeLabel="vs previous period"
            icon={<FileText className="w-4 h-4" />}
          />
          <KpiCard
            label="Default Risk Rate"
            value={`${(metrics.defaultRiskRate * 100).toFixed(1)}%`}
            changePct={metrics.defaultRiskRateChangePct}
            changeLabel="vs previous period"
            icon={<TrendingDown className="w-4 h-4" />}
          />
          <KpiCard
            label="Average Risk Score"
            value={metrics.averageRiskScore.toFixed(3)}
            changePct={metrics.averageRiskScoreChangePct}
            changeLabel="vs previous period"
            icon={<Users className="w-4 h-4" />}
          />
          <KpiCard
            label="High-Risk Applications"
            value={metrics.highRiskCount.toLocaleString()}
            changePct={metrics.highRiskCountChangePct}
            changeLabel="vs previous period"
            icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
          />
        </div>
      )}

      {/* Dashboard Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Portfolio Risk Trend (Large Line/Area Chart) */}
        <ChartCard
          title="Portfolio Risk Trend"
          subtitle="Evolution of average predicted probability over time"
          className="lg:col-span-2"
        >
          {metrics && (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={metrics.portfolioTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#38BDF8' : '#0F172A'} stopOpacity={isDark ? 0.35 : 0.15} />
                    <stop offset="95%" stopColor={isDark ? '#38BDF8' : '#0F172A'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1E293B' : '#E2E8F0'} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }}
                  axisLine={{ stroke: isDark ? '#334155' : '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0.1, 0.2]}
                  tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-700 shadow-md text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{data.date}</p>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Average Risk Score:{' '}
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {(data.avgRiskScore * 100).toFixed(2)}%
                            </span>
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            High Risk Volume: {data.highRiskVolume} / {data.totalVolume} loans
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgRiskScore"
                  stroke={isDark ? '#38BDF8' : '#0F172A'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#riskScoreGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Risk Distribution Donut Chart */}
        <ChartCard
          title="Risk Distribution"
          subtitle="Portfolio segmentation by risk tier"
        >
          {metrics && (
            <div className="w-full flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={metrics.riskDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {metrics.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
                            <span className="font-semibold text-slate-900 dark:text-white">{data.name} Risk: </span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">{data.count.toLocaleString()} ({data.percentage}%)</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 text-xs mt-2">
                {metrics.riskDistribution.map((tier, idx) => (
                  <div key={tier.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[idx] }}
                    />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{tier.name}:</span>
                    <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">{tier.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Risk Exposure Horizontal Bar Chart */}
      {metrics && (
        <ChartCard
          title="Risk Exposure by Asset Class"
          subtitle="Portfolio capital distribution (USD) across low, medium, and high risk buckets"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={metrics.riskExposure}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#1E293B' : '#E2E8F0'} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: isDark ? '#94A3B8' : '#64748B' }}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 11, fill: isDark ? '#CBD5E1' : '#475569' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm text-xs space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
                        {payload.map((p: any) => (
                          <p key={p.name} className="flex justify-between gap-4 text-slate-600 dark:text-slate-300 font-mono">
                            <span style={{ color: p.color }}>{p.name}:</span>
                            <span>${(p.value / 1000000).toFixed(2)}M</span>
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="low" name="Low Risk" fill="#16A34A" stackId="a" />
              <Bar dataKey="medium" name="Medium Risk" fill="#D97706" stackId="a" />
              <Bar dataKey="high" name="High Risk" fill="#DC2626" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* High-Risk Review Section */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Applications Requiring Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-risk applications exceeding the 10.00% benchmark probability threshold
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded">
            {highRiskApplications.length} Flagged
          </span>
        </div>

        {highRiskApplications.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
            No high-risk applications pending underwriting review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-medium">
                  <th className="py-2.5 px-3">Application ID</th>
                  <th className="py-2.5 px-3">Applicant</th>
                  <th className="py-2.5 px-3 text-right">Probability</th>
                  <th className="py-2.5 px-3 text-center">Risk Level</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {highRiskApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                      {app.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{app.occupation}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                      {(app.predictedDefaultProbability * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <RiskBadge level={app.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {app.assessedAt.substring(0, 10)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewApplication(app.id)}
                          className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setReviewingApp(app)}
                          className="px-2.5 py-1 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Applications Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Applications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest assessed borrower profiles across underwriting queues
            </p>
          </div>
          <button
            onClick={onNavigatePredict}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-md transition-colors shadow-xs"
          >
            + Assess New Loan
          </button>
        </div>

        <DataTable
          applications={recentApplications.slice(0, 6)}
          onView={onViewApplication}
          onReview={(app) => setReviewingApp(app)}
          showCompactReview={true}
        />
      </div>

      {/* Underwriter Review Modal */}
      {reviewingApp && (
        <Modal
          isOpen={!!reviewingApp}
          onClose={() => setReviewingApp(null)}
          title={`Underwriter Review: ${reviewingApp.id}`}
          subtitle={`Applicant: ${reviewingApp.applicantName} · Default Probability: ${(reviewingApp.predictedDefaultProbability * 100).toFixed(2)}%`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Requested Loan:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">${reviewingApp.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Annual Income:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">${reviewingApp.annualIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{reviewingApp.status}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Underwriter Audit Notes
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter justification, secondary verification requirements, or credit committee memorandum..."
                className="w-full h-24 p-2.5 text-xs bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReviewingApp(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusUpdate('Declined')}
                className="px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/60"
              >
                Decline Application
              </button>
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusUpdate('Under Review')}
                className="px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/60"
              >
                Request Verification
              </button>
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusUpdate('Approved')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-md hover:bg-slate-800"
              >
                Clear / Approve
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
