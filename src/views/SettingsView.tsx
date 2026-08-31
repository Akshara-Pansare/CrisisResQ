import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  Database, 
  Server, 
  Lock, 
  Save, 
  Check, 
  Layers, 
  Radio 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [agencyName, setAgencyName] = useState('Assam State Disaster Management Authority (ASDMA)');
  const [eocDistrict, setEocDistrict] = useState('Kamrup Metro & Morigaon Emergency Operations Centre');
  const [smsGateway, setSmsGateway] = useState('Enabled (C-DAC National Disaster Alert Net)');
  const [criticalThreshold, setCriticalThreshold] = useState(75);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-4xl animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#D9DEE7]">
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#2563EB]" />
          Platform Settings & Authority Configuration
        </h1>
        <p className="text-xs text-[#667085]">
          Manage emergency operations agency profile, telemetry thresholds, GIS data layers, and broadcast channels.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Agency Profile */}
        <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A] uppercase font-mono">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Operational Agency Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">State / Regional Authority</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">EOC District Command Hub</label>
              <input
                type="text"
                value={eocDistrict}
                onChange={(e) => setEocDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Risk Thresholds & AI Parameters */}
        <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A] uppercase font-mono">
            <Radio className="w-4 h-4 text-blue-600" />
            <span>AI Risk Scoring & Automatic Triage Thresholds</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Critical Evacuation Trigger Score:</span>
                <span className="font-mono text-[#C62828] font-black">{criticalThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(parseInt(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Habitations reaching this risk score automatically trigger mandatory relocation order generation.
              </span>
            </div>
          </div>
        </div>

        {/* GIS & Telemetry Endpoints */}
        <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A] uppercase font-mono">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Connected Telemetry & Spatial GIS Feeds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0F172A] block">CWC River Gauges Stream</span>
                <span className="text-[10px] text-slate-500">Brahmaputra Hydro-Sensors</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#15803D] text-white text-[10px] font-bold">CONNECTED</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0F172A] block">ISRO Bhuvan Spatial Grid</span>
                <span className="text-[10px] text-slate-500">Sentinel SAR Inundation</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#15803D] text-white text-[10px] font-bold">CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" /> Settings updated successfully
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
