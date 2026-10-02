import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Info,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RiskBadge } from '../components/RiskBadge';
import { ContributionChart } from '../components/ContributionChart';
import { PredictRequest, PredictResponse, LoanApplication } from '../types';
import { predictionService } from '../services/predictions';

const defaultFormData: PredictRequest = {
  applicant_name: 'Jonathan Sterling',
  age: 36,
  gender: 'M',
  family_status: 'Married',
  children_count: 1,
  family_members_count: 3,
  education_type: 'Higher education',
  income_type: 'Commercial associate',
  employment_duration_years: 5.5,
  occupation: 'Financial Analyst',
  organization_type: 'Banking / Finance',
  annual_income: 115000,
  loan_amount: 320000,
  loan_annuity: 18500,
  goods_price: 310000,
  ext_source_1: 0.58,
  ext_source_2: 0.52,
  ext_source_3: 0.49,
};

interface PredictPageProps {
  onViewApplication: (id: string) => void;
  onNavigateHistory: () => void;
}

export const PredictPage: React.FC<PredictPageProps> = ({
  onViewApplication,
  onNavigateHistory,
}) => {
  const [formData, setFormData] = useState<PredictRequest>(defaultFormData);

  const [buttonState, setButtonState] = useState<'idle' | 'assessing' | 'complete'>('idle');
  const [predictionResult, setPredictionResult] = useState<PredictResponse['data'] | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.applicant_name?.trim()) newErrors.applicant_name = 'Applicant name is required';
    if (!formData.age || formData.age < 18 || formData.age > 99) newErrors.age = 'Age must be between 18 and 99';
    if (!formData.annual_income || formData.annual_income <= 0) newErrors.annual_income = 'Income must be greater than 0';
    if (!formData.loan_amount || formData.loan_amount <= 0) newErrors.loan_amount = 'Loan amount must be greater than 0';
    if (!formData.loan_annuity || formData.loan_annuity <= 0) newErrors.loan_annuity = 'Loan annuity must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PredictRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setButtonState('assessing');
    setPredictionResult(null);
    setSavedSuccess(false);

    try {
      const response = await predictionService.predict(formData);
      setPredictionResult(response.data);
      setButtonState('complete');

      const newApp: LoanApplication = {
        id: response.data.application_id,
        applicantName: formData.applicant_name || 'Anonymous Applicant',
        applicantEmail: `${(formData.applicant_name || 'applicant').toLowerCase().replace(/\s+/g, '.')}@client.internal`,
        age: Number(formData.age),
        gender: formData.gender as any,
        familyStatus: formData.family_status as any,
        childrenCount: Number(formData.children_count),
        familyMembersCount: Number(formData.family_members_count),
        educationType: formData.education_type as any,
        incomeType: formData.income_type as any,
        employmentDurationYears: Number(formData.employment_duration_years),
        occupation: formData.occupation,
        organizationType: formData.organization_type,
        annualIncome: Number(formData.annual_income),
        loanAmount: Number(formData.loan_amount),
        loanAnnuity: Number(formData.loan_annuity),
        goodsPrice: Number(formData.goods_price),
        extSource1: Number(formData.ext_source_1),
        extSource2: Number(formData.ext_source_2),
        extSource3: Number(formData.ext_source_3),
        predictedDefaultProbability: response.data.predicted_default_probability,
        riskLevel: response.data.risk_label,
        riskThreshold: response.data.risk_threshold,
        modelVersion: response.data.model_version,
        assessedAt: response.data.assessed_at,
        status: response.data.risk_label === 'High' ? 'Flagged' : response.data.risk_label === 'Medium' ? 'Under Review' : 'Approved',
        contributions: response.data.contributions,
        timeline: [
          {
            title: 'Application Ingested',
            description: 'Direct underwriter console intake',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          },
          {
            title: 'Risk Assessment Generated',
            description: `Evaluated by ${response.data.model_version} with probability ${(response.data.predicted_default_probability * 100).toFixed(2)}%`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          }
        ],
      };

      if (typeof window !== 'undefined') {
        const storageKey = 'loan-guard-applications';
        const existing = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as LoanApplication[];
        localStorage.setItem(storageKey, JSON.stringify([newApp, ...existing].slice(0, 25)));
      }
      setSavedSuccess(true);
    } 
    catch {
      alert('Risk calculation failed. Please check parameters.');
      setButtonState('idle');
    }
  };

  const handleResetForm = () => {
    setFormData(defaultFormData);
    setErrors({});
    setButtonState('idle');
    setPredictionResult(null);
    setSavedSuccess(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Assess Loan Risk"
        subtitle="Enter applicant and loan information to generate a model-based risk assessment."
        breadcrumbs={[
          { label: 'Risk Intelligence', onClick: onNavigateHistory },
          { label: 'Risk Prediction' },
        ]}
      />

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className={`space-y-6 transition-all duration-300 ${predictionResult ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <form onSubmit={handleAssess} className="space-y-6">
            {/* SECTION 1 — APPLICANT INFORMATION */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 rounded-lg p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Section 01
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Applicant Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Applicant Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.applicant_name}
                    onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                    className={`w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400 ${
                      errors.applicant_name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
                    }`}
                    placeholder="e.g. Jonathan Sterling"
                  />
                  {errors.applicant_name && (
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">
                      {errors.applicant_name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', Number(e.target.value))}
                    min={18}
                    max={99}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                  {errors.age && (
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">{errors.age}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  >
                    <option value="M" className="dark:bg-[#111827]">Male</option>
                    <option value="F" className="dark:bg-[#111827]">Female</option>
                    <option value="Other" className="dark:bg-[#111827]">Other / Non-disclosed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Family Status
                  </label>
                  <select
                    value={formData.family_status}
                    onChange={(e) => handleInputChange('family_status', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  >
                    <option value="Married" className="dark:bg-[#111827]">Married</option>
                    <option value="Single" className="dark:bg-[#111827]">Single / Not married</option>
                    <option value="Civil marriage" className="dark:bg-[#111827]">Civil marriage</option>
                    <option value="Separated" className="dark:bg-[#111827]">Separated</option>
                    <option value="Widow" className="dark:bg-[#111827]">Widow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    value={formData.children_count}
                    onChange={(e) => handleInputChange('children_count', Number(e.target.value))}
                    min={0}
                    max={12}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Family Members Count
                  </label>
                  <input
                    type="number"
                    value={formData.family_members_count}
                    onChange={(e) => handleInputChange('family_members_count', Number(e.target.value))}
                    min={1}
                    max={16}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Education Type
                  </label>
                  <select
                    value={formData.education_type}
                    onChange={(e) => handleInputChange('education_type', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  >
                    <option value="Higher education" className="dark:bg-[#111827]">Higher education</option>
                    <option value="Secondary / secondary special" className="dark:bg-[#111827]">Secondary / Secondary Special</option>
                    <option value="Incomplete higher" className="dark:bg-[#111827]">Incomplete higher</option>
                    <option value="Lower secondary" className="dark:bg-[#111827]">Lower secondary</option>
                    <option value="Academic degree" className="dark:bg-[#111827]">Academic degree (Doctorate / Masters)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Income Type
                  </label>
                  <select
                    value={formData.income_type}
                    onChange={(e) => handleInputChange('income_type', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  >
                    <option value="Working" className="dark:bg-[#111827]">Working / Commercial Employment</option>
                    <option value="Commercial associate" className="dark:bg-[#111827]">Commercial Associate / Business Owner</option>
                    <option value="State servant" className="dark:bg-[#111827]">State Servant / Government Civil Service</option>
                    <option value="Pensioner" className="dark:bg-[#111827]">Pensioner</option>
                    <option value="Student" className="dark:bg-[#111827]">Student</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2 — EMPLOYMENT */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 rounded-lg p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Section 02
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Employment & Tenure
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employment Duration (Years)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.employment_duration_years}
                    onChange={(e) => handleInputChange('employment_duration_years', Number(e.target.value))}
                    min={0}
                    max={50}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                    Continuous documented employment history
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                    placeholder="e.g. Financial Analyst"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Type
                  </label>
                  <select
                    value={formData.organization_type}
                    onChange={(e) => handleInputChange('organization_type', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                  >
                    <option value="Banking / Finance" className="dark:bg-[#111827]">Banking / Finance / Insurance</option>
                    <option value="Technology / Software" className="dark:bg-[#111827]">Technology / Telecommunication</option>
                    <option value="Healthcare / Public Sector" className="dark:bg-[#111827]">Healthcare / Medicine</option>
                    <option value="Manufacturing / Industrial" className="dark:bg-[#111827]">Manufacturing & Heavy Industry</option>
                    <option value="Construction & Real Estate" className="dark:bg-[#111827]">Construction & Real Estate</option>
                    <option value="Transportation / Delivery" className="dark:bg-[#111827]">Transport / Logistics</option>
                    <option value="Retail & Consumer Goods" className="dark:bg-[#111827]">Trade / Retail</option>
                    <option value="Other" className="dark:bg-[#111827]">Other Institutional Organization</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3 — FINANCIAL INFORMATION */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 rounded-lg p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Section 03
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Financial Terms & Exposure
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Annual Income (USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 dark:text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      value={formData.annual_income}
                      onChange={(e) => handleInputChange('annual_income', Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                      placeholder="115000"
                    />
                  </div>
                  {errors.annual_income && (
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">{errors.annual_income}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Loan Amount Requested <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 dark:text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      value={formData.loan_amount}
                      onChange={(e) => handleInputChange('loan_amount', Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                      placeholder="320000"
                    />
                  </div>
                  {errors.loan_amount && (
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 block">{errors.loan_amount}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Loan Annuity / Payment <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 dark:text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      value={formData.loan_annuity}
                      onChange={(e) => handleInputChange('loan_annuity', Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                      placeholder="18500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                    Expected annual amortized repayment
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Goods Price / Collateral Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 dark:text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      value={formData.goods_price}
                      onChange={(e) => handleInputChange('goods_price', Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 text-xs bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-400"
                      placeholder="310000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4 — CREDIT / EXTERNAL RISK SCORES */}
            <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 rounded-lg p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Section 04
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Credit Bureau & External Risk Models
                  </h3>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Normalized range [0.00 – 1.00]</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* External Score 1 */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      External Risk Score 1 (Credit Bureau Bureau Score)
                    </span>
                    <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
                      {formData.ext_source_1.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.ext_source_1}
                    onChange={(e) => handleInputChange('ext_source_1', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                    <span>0.00 (Adverse Credit)</span>
                    <span>0.50 (Median)</span>
                    <span>1.00 (Prime Quality)</span>
                  </div>
                </div>

                {/* External Score 2 */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      External Risk Score 2 (Alternative Telemetry / Banking Rating)
                    </span>
                    <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
                      {formData.ext_source_2.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.ext_source_2}
                    onChange={(e) => handleInputChange('ext_source_2', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                    <span>0.00 (Adverse)</span>
                    <span>0.50 (Median)</span>
                    <span>1.00 (Prime)</span>
                  </div>
                </div>

                {/* External Score 3 */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      External Risk Score 3 (Cross-Institutional Default Benchmark)
                    </span>
                    <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
                      {formData.ext_source_3.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.ext_source_3}
                    onChange={(e) => handleInputChange('ext_source_3', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                    <span>0.00 (Adverse)</span>
                    <span>0.50 (Median)</span>
                    <span>1.00 (Prime)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Values</span>
              </button>

              <button
                type="submit"
                disabled={buttonState === 'assessing'}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-md shadow-xs transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {buttonState === 'assessing' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Assessing...</span>
                  </>
                ) : buttonState === 'complete' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Assessment Complete — Re-run</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Assess Loan Risk</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Result Column with Signature Curved Depth Reveal */}
        {predictionResult && (
          <div className="lg:col-span-6 space-y-5 perspective-1000">
            <div className="animate-curved-reveal bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 space-y-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
                    {predictionResult.application_id}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {predictionResult.model_version}
                  </span>
                </div>
                <RiskBadge level={predictionResult.risk_label} size="md" />
              </div>

              {/* Primary Metric: Predicted Default Probability */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Predicted Default Probability
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <span
                    className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight tabular-nums ${
                      predictionResult.predicted_default_probability >= 0.25
                        ? 'text-rose-600 dark:text-rose-400'
                        : predictionResult.predicted_default_probability >= 0.10
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {(predictionResult.predicted_default_probability * 100).toFixed(2)}%
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    (Threshold: {(predictionResult.risk_threshold * 100).toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Classification Summary Box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Risk Classification:</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">
                    {predictionResult.risk_label} Risk
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Policy Benchmark:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">10.00% Baseline Cutoff</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Assessment Timestamp:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {new Date(predictionResult.assessed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
                  </span>
                </div>
              </div>

              {/* Model Contributions Component */}
              <ContributionChart contributions={predictionResult.contributions} />

              {/* Mandatory Model Disclaimer Notice */}
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-md border border-amber-200/80 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Notice:</strong> This assessment represents a model-based estimate and should not be interpreted as a guaranteed financial outcome. Underwriting decisions must comply with Fair Lending guidelines.
                </span>
              </div>

              {/* Actions: View Details or Review Applications */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => onViewApplication(predictionResult.application_id)}
                  className="w-full sm:flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>View Full Application Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onNavigateHistory}
                  className="w-full sm:w-auto py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  All Applications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
