import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavSection } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AlertBanner } from './components/AlertBanner';
import { RelocationPlanModal } from './components/RelocationPlanModal';

import { OverviewView } from './views/OverviewView';
import { RiskMapView } from './views/RiskMapView';
import { PriorityHabitationsView } from './views/PriorityHabitationsView';
import { SheltersView } from './views/SheltersView';
import { EvacuationRoutesView } from './views/EvacuationRoutesView';
import { ResourcesView } from './views/ResourcesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

import { 
  INITIAL_HABITATIONS, 
  INITIAL_SHELTERS, 
  INITIAL_ROUTES, 
  INITIAL_RESOURCES, 
  INITIAL_ALERTS, 
  INITIAL_RESPONSE_PLANS 
} from './data/mockData';
import { Habitation, Shelter, EvacuationRoute, ResourceItem, EmergencyAlert, ResponsePlan } from './types';
import { CheckCircle2, Bell, AlertTriangle } from 'lucide-react';

export function App() {
  // Navigation State
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Application Data States
  const [habitations, setHabitations] = useState<Habitation[]>(INITIAL_HABITATIONS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [routes, setRoutes] = useState<EvacuationRoute[]>(INITIAL_ROUTES);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [plans, setPlans] = useState<ResponsePlan[]>(INITIAL_RESPONSE_PLANS);

  // Selected Entities
  const [selectedHabitation, setSelectedHabitation] = useState<Habitation>(INITIAL_HABITATIONS[0]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter>(INITIAL_SHELTERS[0]);

  // Scenario & District
  const [selectedScenario, setSelectedScenario] = useState<string>('Brahmaputra Flood Surge (Level 3)');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kamrup Metro & Morigaon');

  // Modals and Drawers
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState<boolean>(false);
  const [isRelocationModalOpen, setIsRelocationModalOpen] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Actions
  const handleSelectHabitation = (hab: Habitation) => {
    setSelectedHabitation(hab);
    const assignedShelter = shelters.find((s) => s.id === hab.recommendedShelterId) || shelters[0];
    setSelectedShelter(assignedShelter);
  };

  const handleSelectShelter = (shelter: Shelter) => {
    setSelectedShelter(shelter);
  };

  const handleGeneratePlan = () => {
    setIsRelocationModalOpen(true);
  };

  const handleDispatchPlan = (newPlan: ResponsePlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    showToast(
      'Operational Plan Dispatched',
      `Relocation orders for ${newPlan.habitationName} sent to District Transport and SDRF net.`
    );
  };

  const handleDispatchConvoy = (route: EvacuationRoute) => {
    showToast(
      'Convoy Dispatch Initiated',
      `Transit fleet deployed on ${route.name}. Emergency corridor beacons active.`
    );
  };

  const handleAllocateResource = (resourceId: string, amount: number) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const newAlloc = r.allocated + amount;
          return {
            ...r,
            allocated: newAlloc,
            status: newAlloc >= r.required ? 'Sufficient' : 'Low',
          };
        }
        return r;
      })
    );
    showToast('Resource Reallocated', `Updated ${amount} units in regional disaster supply inventory.`);
  };

  const handleMarkAlertRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const handleRefreshData = () => {
    showToast('Telemetry Synchronized', 'Updated river gauge stations and habitation vulnerability metrics.');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#0F172A] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        selectedScenario={selectedScenario}
        onSelectScenario={setSelectedScenario}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        alerts={alerts}
        unreadAlertsCount={unreadAlertsCount}
        onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Layout Body: Sidebar Left + Main Content Area Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(section) => {
            setActiveSection(section);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          criticalCount={habitations.filter((h) => h.riskScore >= 75).length}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {activeSection === 'overview' && (
            <OverviewView
              habitations={habitations}
              shelters={shelters}
              routes={routes}
              selectedHabitation={selectedHabitation}
              onSelectHabitation={handleSelectHabitation}
              selectedShelter={selectedShelter}
              onSelectShelter={handleSelectShelter}
              onGeneratePlan={handleGeneratePlan}
              onNavigate={(sec) => setActiveSection(sec)}
              onViewActionPlan={() => setActiveSection('priority')}
              onRefresh={handleRefreshData}
            />
          )}

          {activeSection === 'risk-map' && (
            <RiskMapView
              habitations={habitations}
              shelters={shelters}
              routes={routes}
              selectedHabitation={selectedHabitation}
              onSelectHabitation={handleSelectHabitation}
              selectedShelter={selectedShelter}
              onSelectShelter={handleSelectShelter}
              onGeneratePlan={handleGeneratePlan}
            />
          )}

          {activeSection === 'priority' && (
            <PriorityHabitationsView
              habitations={habitations}
              shelters={shelters}
              onSelectHabitation={handleSelectHabitation}
              onGeneratePlan={handleGeneratePlan}
            />
          )}

          {activeSection === 'shelters' && (
            <SheltersView
              shelters={shelters}
              onSelectShelter={handleSelectShelter}
            />
          )}

          {activeSection === 'routes' && (
            <EvacuationRoutesView
              routes={routes}
              habitations={habitations}
              shelters={shelters}
              selectedHabitation={selectedHabitation}
              onSelectHabitation={handleSelectHabitation}
              selectedShelter={selectedShelter}
              onSelectShelter={handleSelectShelter}
              onDispatchConvoy={handleDispatchConvoy}
            />
          )}

          {activeSection === 'resources' && (
            <ResourcesView
              resources={resources}
              onAllocateResource={handleAllocateResource}
            />
          )}

          {activeSection === 'reports' && <ReportsView />}

          {activeSection === 'settings' && <SettingsView />}

          {/* Operational Footer */}
          <Footer />
        </main>
      </div>

      {/* Persistent AI Relocation Workflow Modal */}
      <RelocationPlanModal
        isOpen={isRelocationModalOpen}
        onClose={() => setIsRelocationModalOpen(false)}
        habitation={selectedHabitation}
        shelter={selectedShelter}
        route={routes.find((r) => r.id === 'route-a') || routes[0]}
        onDispatchPlan={handleDispatchPlan}
      />

      {/* Emergency Alerts Drawer */}
      <AlertBanner
        alerts={alerts}
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        onMarkAsRead={handleMarkAlertRead}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#172B4D] text-white p-4 rounded-xl shadow-2xl border border-[#243B61] flex items-start gap-3 max-w-sm animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wide">
              {toastMessage.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">
              {toastMessage.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
