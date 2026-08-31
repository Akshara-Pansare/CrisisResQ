import React from 'react';
import { ArrowRight, Bus, Package, Droplets, HeartPulse, Boxes } from 'lucide-react';

interface ResourceOverviewCardProps {
  onViewAll: () => void;
}

export const ResourceOverviewCard: React.FC<ResourceOverviewCardProps> = ({ onViewAll }) => {
  const resourceMetrics = [
    { label: 'Buses Required', value: '25', unit: 'Vehicles', icon: Bus, color: 'text-blue-600 bg-blue-50' },
    { label: 'Food Packets', value: '3,720', unit: 'Packs', icon: Package, color: 'text-amber-600 bg-amber-50' },
    { label: 'Water (Liters)', value: '6,200 L', unit: 'Logistics', icon: Droplets, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Medical Teams', value: '3', unit: 'Field Platoons', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            RESOURCES OVERVIEW
          </span>
          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
            92% READY
          </span>
        </div>

        {/* 4 Metric items */}
        <div className="grid grid-cols-2 gap-2.5 mt-2.5">
          {resourceMetrics.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-2.5 rounded-lg border border-slate-100 bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667085] block font-medium leading-tight">
                      {item.label}
                    </span>
                    <span className="text-sm font-extrabold text-[#0F172A] font-mono leading-tight">
                      {item.value}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group transition-colors"
        >
          <span>View all resources</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
