import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, Bell, X, Check, ArrowRight, ExternalLink } from 'lucide-react';
import { EmergencyAlert } from '../types';

interface AlertBannerProps {
  alerts: EmergencyAlert[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onSelectAlert?: (alert: EmergencyAlert) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts = [],
  isOpen,
  onClose,
  onMarkAsRead,
  onSelectAlert,
}) => {
  const safeAlerts = alerts || [];
  if (!isOpen) return null;

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-[#C62828] text-white';
      case 'HIGH':
        return 'bg-[#D97706] text-white';
      case 'MODERATE':
        return 'bg-[#2563EB] text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const getAlertBorder = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'border-l-4 border-l-[#C62828] bg-red-50/40';
      case 'HIGH':
        return 'border-l-4 border-l-[#D97706] bg-amber-50/40';
      case 'MODERATE':
        return 'border-l-4 border-l-[#2563EB] bg-blue-50/40';
      default:
        return 'border-l-4 border-l-slate-400 bg-slate-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#D9DEE7] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-[#172B4D] text-white px-5 py-4 flex items-center justify-between border-b border-[#243B61]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <div>
              <h2 className="text-sm font-bold tracking-tight">Emergency Incident Feeds</h2>
              <p className="text-[11px] text-slate-300">Live Real-time Alert Broadcasts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#243B61] text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {safeAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No active emergency alerts in current sector.</p>
            </div>
          ) : (
            safeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border border-slate-200 shadow-2xs transition-all ${getAlertBorder(alert.level)} ${
                  !alert.read ? 'ring-1 ring-blue-300' : 'opacity-90'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded ${getAlertBadge(alert.level)}`}>
                    {alert.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-[#0F172A] leading-snug">
                  {alert.title}
                </h4>

                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {alert.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-medium">{alert.location}</span>

                  <div className="flex items-center gap-2">
                    {!alert.read && (
                      <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Auto-refreshing via C-DAC telemetry</span>
          <button
            onClick={() => safeAlerts.forEach((a) => onMarkAsRead(a.id))}
            className="text-slate-700 hover:text-slate-900 font-bold"
          >
            Mark all read
          </button>
        </div>
      </div>
    </div>
  );
};
