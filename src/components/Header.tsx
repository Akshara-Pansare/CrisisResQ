import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Bell, 
  ChevronDown, 
  Activity, 
  Radio, 
  Layers, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  RefreshCw,
  Search
} from 'lucide-react';
import { ScenarioType, EmergencyAlert } from '../types';
import { SCENARIOS } from '../data/mockData';

interface HeaderProps {
  currentScenario?: ScenarioType | string;
  selectedScenario?: string;
  onSelectScenario: (scenario: any) => void;
  selectedLocation?: string;
  selectedDistrict?: string;
  onSelectLocation?: (loc: string) => void;
  onSelectDistrict?: (district: string) => void;
  alerts?: EmergencyAlert[];
  unreadAlertsCount?: number;
  onOpenAlerts: () => void;
  onToggleMobileMenu?: () => void;
  onToggleMobileSidebar?: () => void;
  isMobileMenuOpen?: boolean;
  onRefreshData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  selectedScenario,
  onSelectScenario,
  selectedLocation,
  selectedDistrict,
  onSelectLocation,
  onSelectDistrict,
  alerts = [],
  unreadAlertsCount: propUnreadCount,
  onOpenAlerts,
  onToggleMobileMenu,
  onToggleMobileSidebar,
  isMobileMenuOpen = false,
  onRefreshData,
}) => {
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeScenario = currentScenario || selectedScenario || 'FLOOD (KAMRUP METRO)';
  const activeLocation = selectedLocation || selectedDistrict || 'Kamrup (Metro), Assam';

  const handleLocationChange = (loc: string) => {
    if (onSelectLocation) onSelectLocation(loc);
    if (onSelectDistrict) onSelectDistrict(loc);
  };

  const handleToggleMenu = () => {
    if (onToggleMobileMenu) onToggleMobileMenu();
    if (onToggleMobileSidebar) onToggleMobileSidebar();
  };

  const calculatedUnread = Array.isArray(alerts) ? alerts.filter(a => !a.read).length : 0;
  const unreadAlertsCount = propUnreadCount !== undefined ? propUnreadCount : calculatedUnread;

  const locations = [
    'Kamrup (Metro), Assam',
    'Kamrup (Rural), Assam',
    'Darrang District, Assam',
    'Morigaon District, Assam',
    'Nagaon Valley, Assam',
  ];

  return (
    <header id="main-header" className="h-[68px] bg-[#172B4D] text-white px-4 md:px-6 flex items-center justify-between border-b border-[#243B61] relative z-40 select-none shadow-md">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <button 
          id="mobile-menu-btn"
          onClick={handleToggleMenu}
          className="lg:hidden p-2 rounded hover:bg-[#243B61] text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Original CrisisResQ Shield Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] border border-blue-400/30 flex items-center justify-center shadow-inner relative group">
            <ShieldAlert className="w-5 h-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#172B4D] rounded-full animate-ping"></span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#172B4D] rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base lg:text-lg text-white uppercase font-mono">
                CRISIS<span className="text-[#3B82F6]">RESQ</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">
                v2.4 Live
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium tracking-tight hidden sm:block">
              Disaster Intelligence & Relocation Decision Engine
            </p>
          </div>
        </div>
      </div>

      {/* Center: Scenario & Location Operational Selectors */}
      <div className="hidden md:flex items-center gap-2 lg:gap-3">
        {/* Scenario Selector */}
        <div className="relative">
          <button
            id="scenario-selector-btn"
            onClick={() => {
              setScenarioDropdownOpen(!scenarioDropdownOpen);
              setLocationDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#22395E] hover:bg-[#2A4570] border border-[#344F7C] text-xs font-semibold tracking-wide text-slate-100 transition-colors"
          >
            <span className="text-slate-400 font-normal">Scenario:</span>
            <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white font-bold text-[11px] uppercase tracking-wider">
              {activeScenario}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {scenarioDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 bg-[#172B4D] border border-[#344F7C] rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-[#243B61] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Disaster Scenario
              </div>
              {SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc.id);
                    setScenarioDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#22395E] transition-colors ${
                    activeScenario === sc.id || activeScenario === sc.label ? 'bg-[#2563EB]/20 text-blue-300 font-semibold border-l-2 border-[#2563EB]' : 'text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-medium">{sc.label}</div>
                    <div className="text-[10px] text-slate-400">{sc.description}</div>
                  </div>
                  {(activeScenario === sc.id || activeScenario === sc.label) && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Selector */}
        <div className="relative">
          <button
            id="location-selector-btn"
            onClick={() => {
              setLocationDropdownOpen(!locationDropdownOpen);
              setScenarioDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#22395E] hover:bg-[#2A4570] border border-[#344F7C] text-xs font-semibold text-slate-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span className="text-slate-400 font-normal">Location:</span>
            <span className="truncate max-w-[150px]">{activeLocation}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {locationDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-[#172B4D] border border-[#344F7C] rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-[#243B61] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Jurisdiction / Area of Ops
              </div>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    handleLocationChange(loc);
                    setLocationDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#22395E] transition-colors ${
                    activeLocation === loc ? 'bg-[#2563EB]/20 text-blue-300 font-semibold border-l-2 border-[#2563EB]' : 'text-slate-200'
                  }`}
                >
                  <span>{loc}</span>
                  {activeLocation === loc && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Operational Telemetry, Notifications & User Avatar */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#10233F] border border-emerald-500/20 text-emerald-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="tracking-wide text-[11px] font-mono font-semibold uppercase">SYSTEM OPERATIONAL</span>
        </div>

        {/* Live Refresh */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Refresh Real-time Telemetry"
            className="p-2 rounded-md hover:bg-[#22395E] text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Notification Bell with Badge */}
        <button
          id="alerts-bell-btn"
          onClick={onOpenAlerts}
          className="relative p-2 rounded-md hover:bg-[#22395E] text-slate-200 hover:text-white transition-colors"
          aria-label="Emergency Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-[#C62828] rounded-full flex items-center justify-center border-2 border-[#172B4D] animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* User Account / EOC Admin Dropdown */}
        <div className="relative">
          <button
            id="user-profile-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-md hover:bg-[#22395E] transition-colors border border-transparent hover:border-[#344F7C]"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 border border-slate-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              EO
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">Commander S. Baruah</div>
              <div className="text-[10px] text-slate-400 leading-none">EOC Ops Director</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-[#172B4D] border border-[#344F7C] rounded-lg shadow-2xl py-1 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#243B61]">
                <p className="font-semibold text-slate-100">State Disaster Operations</p>
                <p className="text-[11px] text-slate-400">sdma-ops@assam.gov.in</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Connected: Guwahati Hub 01
                </div>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-[#22395E]">Incident Command Log</button>
                <button className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-[#22395E]">SOP Checklists & Protocols</button>
                <button className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-[#22395E]">District Dispatch Authority</button>
              </div>
              <div className="border-t border-[#243B61] pt-1">
                <button 
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-rose-300 hover:bg-[#22395E]"
                >
                  End Shift / Handover
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
