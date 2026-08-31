import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  ListOrdered, 
  Building2, 
  Navigation, 
  Boxes, 
  BarChart3, 
  Settings, 
  ShieldAlert,
  ChevronRight,
  PhoneCall,
  Activity
} from 'lucide-react';

export type NavSection = 'overview' | 'risk-map' | 'priority' | 'shelters' | 'routes' | 'resources' | 'reports' | 'settings';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  criticalCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isMobileOpen = false,
  onCloseMobile,
  criticalCount = 6,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'risk-map', label: 'Risk Map', icon: Map },
    { id: 'priority', label: 'Priority', icon: ListOrdered, badge: criticalCount, badgeColor: 'bg-[#C62828] text-white' },
    { id: 'shelters', label: 'Shelters', icon: Building2 },
    { id: 'routes', label: 'Routes', icon: Navigation },
    { id: 'resources', label: 'Resources', icon: Boxes },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: NavSection) => {
    onSelectSection(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Persistent Sidebar */}
      <aside 
        id="main-sidebar"
        className={`fixed lg:static top-[68px] bottom-0 left-0 z-40 w-[185px] bg-[#172B4D] border-r border-[#243B61] flex flex-col justify-between select-none transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="py-3 px-2 flex-1 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            COMMAND NAV
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-150 group ${
                  isActive 
                    ? 'bg-[#2563EB] text-white shadow-sm font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-[#20375E]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full leading-none ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Emergency Hotline & Quick Ops Status Footer in Sidebar */}
        <div className="p-3 border-t border-[#243B61] bg-[#12223D]">
          <div className="rounded-md bg-[#1B2F52] p-2.5 border border-[#2D456E]">
            <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold uppercase tracking-wider">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>HELPLINE 1070</span>
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-tight">
              State EOC Direct Line active 24/7
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE SYNC
              </span>
              <span className="text-slate-400">0.4s ping</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
