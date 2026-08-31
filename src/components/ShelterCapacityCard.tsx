import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface ShelterCapacityCardProps {
  onViewAll: () => void;
}

export const ShelterCapacityCard: React.FC<ShelterCapacityCardProps> = ({ onViewAll }) => {
  const data = [
    { name: 'Available', value: 3150, pct: '38%', color: '#15803D' },
    { name: 'Assigned', value: 3700, pct: '45%', color: '#D97706' },
    { name: 'Reserved', value: 1350, pct: '17%', color: '#2563EB' },
  ];

  const totalCapacity = 8200;

  return (
    <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            SHELTER CAPACITY STATUS
          </span>
          <span className="text-[11px] text-slate-500 font-medium">District Total</span>
        </div>

        {/* Donut Chart & Legend layout */}
        <div className="grid grid-cols-12 items-center gap-2 mt-2">
          {/* Chart Left */}
          <div className="col-span-5 relative h-28 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} people`, 'Capacity']}
                  contentStyle={{ fontSize: '11px', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs font-extrabold text-[#0F172A] font-mono leading-none">
                8,200
              </span>
              <span className="text-[9px] text-[#667085] font-medium leading-tight">
                Total
              </span>
            </div>
          </div>

          {/* Legend Right */}
          <div className="col-span-7 space-y-1.5 pl-2 text-xs">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#0F172A] text-xs font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#0F172A] font-mono">{item.value.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({item.pct})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group transition-colors"
        >
          <span>View all shelters</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
