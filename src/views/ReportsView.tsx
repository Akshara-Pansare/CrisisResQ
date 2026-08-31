import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  PieChart as PieIcon, 
  FileSpreadsheet, 
  CheckCircle2, 
  Printer, 
  Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const ReportsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'custom'>('24h');

  // Trend Data for Brahmaputra Water Levels & Rainfall
  const historicalTrendData = [
    { time: '00:00', gaugeLevel: 49.2, dangerMark: 49.5, rainfallMm: 12 },
    { time: '04:00', gaugeLevel: 49.4, dangerMark: 49.5, rainfallMm: 28 },
    { time: '08:00', gaugeLevel: 49.8, dangerMark: 49.5, rainfallMm: 45 },
    { time: '12:00', gaugeLevel: 50.32, dangerMark: 49.5, rainfallMm: 62 },
    { time: '16:00', gaugeLevel: 50.15, dangerMark: 49.5, rainfallMm: 35 },
    { time: '20:00', gaugeLevel: 50.05, dangerMark: 49.5, rainfallMm: 18 },
  ];

  // Habitation Risk Distribution
  const riskDistributionData = [
    { category: 'Critical (>75)', count: 3, fill: '#C62828' },
    { category: 'High (60-74)', count: 3, fill: '#D97706' },
    { category: 'Moderate (40-59)', count: 2, fill: '#2563EB' },
    { category: 'Low (<40)', count: 1, fill: '#15803D' },
  ];

  // Population Exposure by Revenue Circle
  const populationExposureData = [
    { circle: 'Chandrapur', totalPop: 2400, highRisk: 1240 },
    { circle: 'Sonapur', totalPop: 3100, highRisk: 1650 },
    { circle: 'Guwahati W', totalPop: 4200, highRisk: 1100 },
    { circle: 'Pandu Port', totalPop: 2900, highRisk: 1420 },
    { circle: 'N. Guwahati', totalPop: 1800, highRisk: 850 },
  ];

  // Resource Fulfillment Data
  const resourceAvailabilityData = [
    { item: 'Buses', required: 25, available: 32 },
    { item: 'Food (k)', required: 3.7, available: 4.8 },
    { item: 'Water (kL)', required: 6.2, available: 8.0 },
    { item: 'Medical', required: 4, available: 4 },
    { item: 'Boat Teams', required: 8, available: 8 },
  ];

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" />
            Disaster Intelligence Analytics & Incident Reports
          </h1>
          <p className="text-xs text-[#667085]">
            Consolidated telemetry reports, hydrologic gauges, capacity forecasting, and multi-agency response readiness.
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#D9DEE7] rounded-lg p-1 text-xs">
            {(['24h', '7d', '30d', 'custom'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded font-bold uppercase ${
                  timeRange === r ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'Custom'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF/CSV</span>
          </button>
        </div>
      </div>

      {/* Top 2 Primary Charts: Historical River Gauge Trend & Population Exposure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Line Chart: River Gauge vs Danger Mark */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-[#0F172A] font-mono uppercase">
                Historical Brahmaputra Water Level Trend
              </h3>
              <p className="text-[11px] text-slate-500">Gauge level vs Danger Mark (49.50m MSL)</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-[#C62828]">
              +0.82m ABOVE DANGER
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis domain={[48.5, 51.0]} stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line
                  type="monotone"
                  dataKey="gaugeLevel"
                  name="Water Gauge (m)"
                  stroke="#C62828"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="dangerMark"
                  name="Danger Threshold (m)"
                  stroke="#D97706"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Population Exposure */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-[#0F172A] font-mono uppercase">
                Population Exposure by Circle
              </h3>
              <p className="text-[11px] text-slate-500">Total population vs High-Risk bracket</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={populationExposureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="circle" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="totalPop" name="Total Residents" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highRisk" name="High Risk Group" fill="#C62828" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2 Charts: Risk Distribution & Resource Fulfillment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk Distribution Bar */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-[#0F172A] font-mono uppercase">
              Habitation Risk Distribution
            </h3>
            <span className="text-xs text-slate-500 font-mono">9 Habitations Active</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#64748B" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
                <Bar dataKey="count" name="Settlements" radius={[0, 4, 4, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Availability vs Requirement */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-[#0F172A] font-mono uppercase">
              Resource Stockpile Availability
            </h3>
            <span className="text-xs text-emerald-700 font-bold">100% Demand Met</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceAvailabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="item" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="available" name="Available Stockpile" fill="#15803D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="required" name="Required Demand" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
