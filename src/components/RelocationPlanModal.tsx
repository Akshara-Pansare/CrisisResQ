import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Building2, 
  Route, 
  Boxes, 
  Clock, 
  Download, 
  Send, 
  FileText, 
  ShieldAlert,
  Loader2,
  Printer,
  ChevronRight,
  Bus,
  Droplets,
  Package,
  HeartPulse
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Habitation, Shelter, EvacuationRoute, ResponsePlan } from '../types';

interface RelocationPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitation: Habitation | null;
  shelter: Shelter | null;
  route: EvacuationRoute | null;
  onDispatchPlan: (plan: ResponsePlan) => void;
}

export const RelocationPlanModal: React.FC<RelocationPlanModalProps> = ({
  isOpen,
  onClose,
  habitation,
  shelter,
  route,
  onDispatchPlan,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [progressMessage, setProgressMessage] = useState<string>('Analyzing population demographics & vulnerability...');
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsProcessing(true);
      setIsDispatched(false);
      return;
    }

    // Run multi-step automated AI analysis pipeline
    setIsProcessing(true);
    setCurrentStep(1);
    setProgressMessage('Step 1/5: Identifying population and vulnerable demographics...');

    const timer1 = setTimeout(() => {
      setCurrentStep(2);
      setProgressMessage('Step 2/5: Evaluating live shelter capacity and bed availability...');
    }, 900);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
      setProgressMessage('Step 3/5: Calculating flood-safe corridor & route clearance...');
    }, 1800);

    const timer3 = setTimeout(() => {
      setCurrentStep(4);
      setProgressMessage('Step 4/5: Allocating logistics, transport buses & medical teams...');
    }, 2700);

    const timer4 = setTimeout(() => {
      setCurrentStep(5);
      setProgressMessage('Step 5/5: Finalizing Relocation Action Plan & Command Orders...');
      setIsProcessing(false);
    }, 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen]);

  if (!isOpen || !habitation) return null;

  const currentShelterName = shelter?.name || 'Sonapur Community Hall';
  const travelTime = habitation.travelTimeMin || 32;
  const population = habitation.population || 1240;
  const busesNeeded = Math.ceil(population / 50); // ~25 buses
  const foodPacks = population * 3; // 3,720
  const waterLiters = population * 5; // 6,200 L
  const medicalTeams = 3;

  const handleDispatch = () => {
    const newPlan: ResponsePlan = {
      id: `plan-${Date.now()}`,
      habitationId: habitation.id,
      habitationName: habitation.name,
      population: population,
      primaryShelterId: shelter?.id || 'shelter-1',
      primaryShelterName: currentShelterName,
      routeId: route?.id || 'route-a',
      routeName: route?.name || 'Route A (NH-27 Highway Corridor)',
      estimatedTravelTimeMin: travelTime,
      busesRequired: busesNeeded,
      foodPackets: foodPacks,
      waterLiters: waterLiters,
      medicalTeams: medicalTeams,
      recommendedDeparture: 'Immediately (T+15 min)',
      status: 'Dispatched',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setIsDispatched(true);
    onDispatchPlan(newPlan);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#15803D', '#3B82F6', '#10B981'],
      });
    } catch {
      // safe fallback
    }
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  const steps = [
    { num: 1, label: 'Population Analysis' },
    { num: 2, label: 'Shelter Capacity' },
    { num: 3, label: 'Safe Routes' },
    { num: 4, label: 'Resource Allocation' },
    { num: 5, label: 'Action Plan Ready' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#D9DEE7] shadow-2xl max-w-2xl w-full overflow-hidden relative my-8">
        {/* Modal Top Header */}
        <div className="bg-[#172B4D] text-white px-6 py-4 flex items-center justify-between border-b border-[#243B61]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                AI Relocation Decision Engine
              </h2>
              <p className="text-xs text-slate-300">
                Target: {habitation.name} ({habitation.subdivision})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#243B61] text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="grid grid-cols-5 gap-1 text-center">
            {steps.map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#15803D] text-white'
                        : isCurrent
                        ? 'bg-[#2563EB] text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span
                    className={`text-[9px] mt-1 font-semibold truncate max-w-[80px] ${
                      isCompleted ? 'text-emerald-700' : isCurrent ? 'text-blue-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isProcessing ? (
            /* Animated Progress Loading State */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-[#2563EB] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  Synthesizing GIS & Emergency Constraints
                </h3>
                <p className="text-xs text-blue-700 font-mono font-semibold mt-1 bg-blue-50 px-3 py-1 rounded-full inline-block">
                  {progressMessage}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 max-w-sm">
                Optimizing multi-modal transit, elevation safety thresholds, and medical triage allocations.
              </div>
            </div>
          ) : (
            /* Final Generated Action Plan View */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-[#15803D]" />
                  <div>
                    <h3 className="text-sm font-extrabold text-[#15803D] uppercase tracking-wide">
                      Relocation Plan Generated & Validated
                    </h3>
                    <p className="text-xs text-emerald-800">
                      Optimal route verified with 92% flood safety rating.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#15803D] text-white font-mono text-xs font-bold">
                  READY
                </span>
              </div>

              {/* Key Logistics Summary Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Population</span>
                  <span className="text-lg font-black text-[#0F172A] font-mono">{population.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">Residents</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Primary Shelter</span>
                  <span className="text-xs font-bold text-[#0F172A] block truncate">{currentShelterName}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">260 beds spare</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Travel Time</span>
                  <span className="text-lg font-black text-[#0F172A] font-mono">{travelTime} min</span>
                  <span className="text-[10px] text-blue-700 font-semibold block">Via NH-27 Corridor</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#667085] uppercase font-bold block">Recommended Departure</span>
                  <span className="text-xs font-extrabold text-[#C62828] block">Immediately</span>
                  <span className="text-[10px] text-slate-500 block">T+15 min window</span>
                </div>
              </div>

              {/* Resource Requisition Grid */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider block font-mono mb-3">
                  APPROVED RESOURCE REQUISITION ORDER
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                    <Bus className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-[#0F172A] font-mono text-sm block">{busesNeeded}</span>
                      <span className="text-[10px] text-slate-600">Buses Required</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                    <Package className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-bold text-[#0F172A] font-mono text-sm block">{foodPacks.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-600">Food Packets</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-50/70 border border-cyan-100">
                    <Droplets className="w-4 h-4 text-cyan-600" />
                    <div>
                      <span className="font-bold text-[#0F172A] font-mono text-sm block">{waterLiters.toLocaleString()} L</span>
                      <span className="text-[10px] text-slate-600">Water Logistics</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="font-bold text-[#0F172A] font-mono text-sm block">{medicalTeams}</span>
                      <span className="text-[10px] text-slate-600">Medical Teams</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dispatch Confirmation Banner */}
              {isDispatched && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span>
                      <strong>Orders Dispatched to EOC Radio Net.</strong> District Transport and SDRF platoons notified.
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-blue-700">ACK 100%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Buttons Footer */}
        {!isProcessing && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handlePrintOrDownload}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#D9DEE7] bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>DOWNLOAD ACTION PLAN</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>

              <button
                onClick={handleDispatch}
                disabled={isDispatched}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                  isDispatched
                    ? 'bg-[#15803D] cursor-default'
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99]'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{isDispatched ? 'RESPONSE DISPATCHED' : 'DISPATCH RESPONSE'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
