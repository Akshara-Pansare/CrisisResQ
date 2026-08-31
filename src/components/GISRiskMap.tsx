import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  Navigation2, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  Compass, 
  Flame, 
  Home, 
  Route as RouteIcon, 
  ShieldAlert, 
  Info,
  Waves,
  MapPin
} from 'lucide-react';
import { Habitation, Shelter, EvacuationRoute, RiskLevel } from '../types';

interface GISRiskMapProps {
  habitations: Habitation[];
  shelters: Shelter[];
  routes: EvacuationRoute[];
  selectedHabitationId: string | null;
  onSelectHabitation: (habitation: Habitation) => void;
  selectedShelterId?: string | null;
  onSelectShelter?: (shelter: Shelter) => void;
  activeRouteId?: string | null;
  heightClass?: string;
  isInteractive?: boolean;
}

export const GISRiskMap: React.FC<GISRiskMapProps> = ({
  habitations,
  shelters,
  routes,
  selectedHabitationId,
  onSelectHabitation,
  selectedShelterId,
  onSelectShelter,
  activeRouteId = 'route-a',
  heightClass = 'h-[500px] lg:h-[530px]',
  isInteractive = true,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Layer Visibility toggles
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(true);
  const [showHabitations, setShowHabitations] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showTerrain, setShowTerrain] = useState(true);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Risk marker colors
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
        return '#C62828';
      case 'High':
        return '#D97706';
      case 'Moderate':
        return '#2563EB';
      case 'Low':
      case 'Safe':
        return '#15803D';
      default:
        return '#64748B';
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isInteractive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isInteractive) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={mapContainerRef}
      id="gis-risk-map-container"
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 h-screen bg-slate-900' : `${heightClass} bg-[#E9EDF2]`} rounded-xl border border-[#D9DEE7] shadow-sm overflow-hidden select-none transition-all`}
    >
      {/* GIS Map Canvas Viewport */}
      <div
        className={`w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} overflow-hidden relative`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full transition-transform duration-75 origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          }}
        >
          {/* Definitions for Gradients and Filters */}
          <defs>
            {/* Critical Heat Zone Gradient */}
            <radialGradient id="criticalHeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C62828" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#C62828" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C62828" stopOpacity="0" />
            </radialGradient>

            {/* High Heat Zone Gradient */}
            <radialGradient id="highHeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
              <stop offset="65%" stopColor="#D97706" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>

            {/* Moderate Heat Zone Gradient */}
            <radialGradient id="modHeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#2563EB" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </radialGradient>

            {/* Safe Zone Gradient */}
            <radialGradient id="safeHeat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#15803D" stopOpacity="0.3" />
              <stop offset="80%" stopColor="#15803D" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
            </radialGradient>

            {/* River pattern water texture */}
            <linearGradient id="riverWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.85" />
            </linearGradient>

            {/* Elevation topography pattern */}
            <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.5" strokeOpacity="0.6" />
            </pattern>
          </defs>

          {/* Background Map Base / Terrain Canvas */}
          <rect width="800" height="500" fill="#EDF1F7" />
          <rect width="800" height="500" fill="url(#topoGrid)" />

          {/* Topographic Contour Lines */}
          {showTerrain && (
            <g id="terrain-contours" stroke="#CBD5E1" strokeWidth="1" fill="none" strokeDasharray="3 3">
              <path d="M 50 120 Q 200 80, 400 130 T 750 90" />
              <path d="M 30 240 Q 250 200, 480 260 T 780 220" />
              <path d="M 60 380 Q 280 340, 520 410 T 770 360" />
              <path d="M 120 460 Q 350 420, 600 480" />
              {/* Hills in North Guwahati */}
              <ellipse cx="280" cy="110" rx="90" ry="45" fill="#E2E8F0" fillOpacity="0.5" />
              <ellipse cx="280" cy="110" rx="60" ry="30" fill="#CBD5E1" fillOpacity="0.5" />
              {/* Hills in South East Kamrup */}
              <ellipse cx="650" cy="380" rx="110" ry="60" fill="#E2E8F0" fillOpacity="0.5" />
              <ellipse cx="650" cy="380" rx="70" ry="35" fill="#CBD5E1" fillOpacity="0.5" />
            </g>
          )}

          {/* District Administrative Boundary */}
          <path
            d="M 120 50 L 380 40 L 680 70 L 760 220 L 720 440 L 450 470 L 150 440 L 80 260 Z"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* Major River Brahmaputra & Channels */}
          <g id="hydrology-network">
            {/* Main Brahmaputra Stream */}
            <path
              d="M 40 210 C 180 180, 260 240, 390 200 C 510 160, 620 220, 780 180 L 780 240 C 620 280, 500 220, 390 260 C 260 300, 180 240, 40 270 Z"
              fill="url(#riverWater)"
              stroke="#3B82F6"
              strokeWidth="1.2"
            />
            {/* River Sandbar Islets / Chars */}
            <ellipse cx="340" cy="225" rx="35" ry="14" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.8" />
            <ellipse cx="560" cy="205" rx="40" ry="16" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.8" />

            {/* Tributaries: Bharalu & Digaru */}
            <path
              d="M 390 260 Q 420 340, 450 430"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 540 230 Q 560 320, 590 440"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* River labels */}
            <text x="160" y="225" fill="#1E40AF" fontSize="10" fontWeight="600" fontStyle="italic" opacity="0.8">
              Brahmaputra River
            </text>
            <text x="580" y="195" fill="#1E40AF" fontSize="9" fontWeight="600" fontStyle="italic" opacity="0.8">
              North Channel
            </text>
          </g>

          {/* Road Network / Highways */}
          <g id="road-network" stroke="#64748B" strokeWidth="2.5" fill="none" strokeLinejoin="round">
            {/* NH-27 Highway Corridor */}
            <path d="M 80 340 L 260 330 L 410 320 L 530 350 L 740 370" stroke="#475569" strokeWidth="3.5" />
            <path d="M 80 340 L 260 330 L 410 320 L 530 350 L 740 370" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="5 5" />
            
            {/* Secondary Arterial roads */}
            <path d="M 280 110 L 330 200 L 400 270 L 450 340" stroke="#94A3B8" strokeWidth="2" />
            <path d="M 400 270 L 550 250 L 680 280" stroke="#94A3B8" strokeWidth="2" />

            {/* Highway Badge */}
            <g transform="translate(230, 318)">
              <rect x="0" y="0" width="34" height="16" rx="3" fill="#1E293B" stroke="#F8FAFC" strokeWidth="1" />
              <text x="17" y="11.5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                NH-27
              </text>
            </g>
          </g>

          {/* Risk Heatmap Multi-Zone Translucent Areas */}
          {showRiskHeatmap && (
            <g id="risk-heatmap-layer">
              {/* Critical Zones (Red) */}
              <ellipse cx="335" cy="220" rx="95" ry="65" fill="url(#criticalHeat)" />
              <ellipse cx="535" cy="335" rx="85" ry="60" fill="url(#criticalHeat)" />
              <ellipse cx="260" cy="365" rx="75" ry="55" fill="url(#criticalHeat)" />

              {/* High Risk Zones (Orange) */}
              <ellipse cx="385" cy="275" rx="90" ry="65" fill="url(#highHeat)" />
              <ellipse cx="290" cy="310" rx="85" ry="60" fill="url(#highHeat)" />

              {/* Moderate Risk Zones (Blue) */}
              <ellipse cx="360" cy="155" rx="80" ry="50" fill="url(#modHeat)" />
              <ellipse cx="270" cy="190" rx="75" ry="50" fill="url(#modHeat)" />

              {/* Safe / Low Risk Shelter Zones (Green) */}
              <ellipse cx="495" cy="355" rx="90" ry="65" fill="url(#safeHeat)" />
              <ellipse cx="425" cy="290" rx="90" ry="65" fill="url(#safeHeat)" />
              <ellipse cx="505" cy="260" rx="75" ry="50" fill="url(#safeHeat)" />
            </g>
          )}

          {/* Evacuation Routes Layer */}
          {showRoutes && (
            <g id="evacuation-routes-layer">
              {routes.map((route) => {
                const isActive = activeRouteId === route.id;
                const pathD = route.waypoints.reduce(
                  (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
                  ''
                );

                return (
                  <g key={route.id}>
                    {/* Shadow / Glow Line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={route.isRecommended ? '#2563EB' : route.obstructionRisk === 'High' ? '#DC2626' : '#64748B'}
                      strokeWidth={isActive ? 6 : 3.5}
                      strokeOpacity={isActive ? 0.9 : 0.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={route.obstructionRisk === 'High' ? '6 4' : 'none'}
                    />

                    {/* Animated moving pulse dots along recommended route */}
                    {route.isRecommended && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#93C5FD"
                        strokeWidth={2}
                        strokeDasharray="8 12"
                        strokeLinecap="round"
                      >
                        <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite" />
                      </path>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Shelter Markers Layer */}
          {showShelters && (
            <g id="shelters-layer">
              {shelters.map((shelter) => {
                const isSelected = selectedShelterId === shelter.id;
                return (
                  <g
                    key={shelter.id}
                    transform={`translate(${shelter.coordinates.x}, ${shelter.coordinates.y})`}
                    onClick={() => onSelectShelter?.(shelter)}
                    className="cursor-pointer group"
                  >
                    {/* Outer green ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 16 : 13}
                      fill="#15803D"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="shadow-lg transition-transform group-hover:scale-110"
                    />

                    {/* Shelter House Icon in SVG */}
                    <path
                      d="M -5 2 L -5 -2 L 0 -6 L 5 -2 L 5 2 Z"
                      fill="#FFFFFF"
                    />
                    <rect x="-1.5" y="0" width="3" height="3" fill="#15803D" />

                    {/* Shelter Name Label */}
                    <g transform="translate(0, 19)">
                      <rect
                        x="-45"
                        y="0"
                        width="90"
                        height="15"
                        rx="3"
                        fill="#15803D"
                        fillOpacity="0.9"
                      />
                      <text
                        x="0"
                        y="10.5"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {shelter.name.split(' ')[0]}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* Habitation Markers Layer */}
          {showHabitations && (
            <g id="habitations-layer">
              {habitations.map((hab) => {
                const isSelected = selectedHabitationId === hab.id;
                const riskColor = getRiskColor(hab.riskLevel);
                const isCritical = hab.riskLevel === 'Critical';

                return (
                  <g
                    key={hab.id}
                    id={`hab-marker-${hab.id}`}
                    transform={`translate(${hab.coordinates.x}, ${hab.coordinates.y})`}
                    onClick={() => onSelectHabitation(hab)}
                    className="cursor-pointer group"
                  >
                    {/* Critical Pulse Rings */}
                    {isCritical && (
                      <circle
                        cx="0"
                        cy="-8"
                        r="18"
                        fill="#C62828"
                        fillOpacity="0.25"
                        className="animate-pulse-ring pointer-events-none"
                      />
                    )}

                    {/* Active Selected halo */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="-8"
                        r="20"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        className="animate-spin duration-3000 pointer-events-none"
                      />
                    )}

                    {/* Modern Teardrop Pin Marker with Risk Color */}
                    <path
                      d="M 0 0 C -6 -7, -10 -12, -10 -17 C -10 -22.5, -5.5 -27, 0 -27 C 5.5 -27, 10 -22.5, 10 -17 C 10 -12, 6 -7, 0 0 Z"
                      fill={riskColor}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-125 filter drop-shadow-md"
                    />

                    {/* Center White Dot or Risk Icon */}
                    <circle cx="0" cy="-17" r="4.5" fill="#FFFFFF" />
                    <circle cx="0" cy="-17" r="2.5" fill={riskColor} />

                    {/* Habitation Title Label */}
                    <g transform="translate(0, 7)">
                      <rect
                        x="-40"
                        y="0"
                        width="80"
                        height="16"
                        rx="4"
                        fill={isSelected ? '#1E293B' : '#FFFFFF'}
                        stroke={isSelected ? '#2563EB' : '#CBD5E1'}
                        strokeWidth="1.2"
                        className="shadow-sm"
                      />
                      <text
                        x="0"
                        y="11"
                        textAnchor="middle"
                        fill={isSelected ? '#FFFFFF' : '#0F172A'}
                        fontSize="8.5"
                        fontWeight={isSelected ? 'bold' : '600'}
                      >
                        {hab.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Top Left: Floating Map Status & Scenario Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xs border border-[#D9DEE7] rounded-lg px-3 py-1.5 shadow-md flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
          <span className="text-xs font-bold text-[#0F172A] tracking-tight">
            GIS Live Inundation Model
          </span>
          <span className="text-[10px] bg-red-100 text-red-700 font-mono font-bold px-1.5 py-0.5 rounded">
            +0.82m SURGE
          </span>
        </div>
      </div>

      {/* Top Right: Zoom & Control Toolbar */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-white rounded-lg border border-[#D9DEE7] shadow-md flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 hover:bg-slate-100 text-slate-700 border-b border-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Center / Reset View */}
        <button
          onClick={handleResetView}
          title="Reset Center Focus"
          className="p-2 bg-white rounded-lg border border-[#D9DEE7] shadow-md hover:bg-slate-100 text-slate-700 transition-colors"
        >
          <Navigation2 className="w-4 h-4" />
        </button>

        {/* Layer Selector Toggle */}
        <div className="relative">
          <button
            onClick={() => setLayerMenuOpen(!layerMenuOpen)}
            title="GIS Layers"
            className={`p-2 rounded-lg border shadow-md transition-colors ${
              layerMenuOpen ? 'bg-[#2563EB] text-white border-blue-600' : 'bg-white border-[#D9DEE7] text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {layerMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg border border-[#D9DEE7] shadow-xl p-2 z-50 text-xs animate-in fade-in">
              <div className="font-bold text-slate-800 pb-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                <span>Map Layers</span>
                <span className="text-[10px] text-slate-400 font-mono">5 ACTIVE</span>
              </div>
              <label className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Risk Heat Zones
                </span>
                <input
                  type="checkbox"
                  checked={showRiskHeatmap}
                  onChange={(e) => setShowRiskHeatmap(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
              </label>
              <label className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-red-600" /> Habitations
                </span>
                <input
                  type="checkbox"
                  checked={showHabitations}
                  onChange={(e) => setShowHabitations(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
              </label>
              <label className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Home className="w-3.5 h-3.5 text-emerald-600" /> Shelters
                </span>
                <input
                  type="checkbox"
                  checked={showShelters}
                  onChange={(e) => setShowShelters(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
              </label>
              <label className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <RouteIcon className="w-3.5 h-3.5 text-blue-600" /> Evacuation Routes
                </span>
                <input
                  type="checkbox"
                  checked={showRoutes}
                  onChange={(e) => setShowRoutes(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
              </label>
              <label className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Waves className="w-3.5 h-3.5 text-blue-400" /> Hydro & Topography
                </span>
                <input
                  type="checkbox"
                  checked={showTerrain}
                  onChange={(e) => setShowTerrain(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
              </label>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          className="p-2 bg-white rounded-lg border border-[#D9DEE7] shadow-md hover:bg-slate-100 text-slate-700 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Left: Floating Map Legend exactly matching Reference Visuals */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs rounded-lg border border-[#D9DEE7] p-2.5 shadow-md text-xs pointer-events-auto max-w-[240px]">
        <div className="font-bold text-[#0F172A] uppercase text-[10px] tracking-wider mb-2 font-mono flex items-center justify-between border-b border-slate-100 pb-1">
          <span>MAP LEGEND</span>
          <span className="text-slate-400 font-normal">GIS Vector</span>
        </div>

        {/* Risk Categories */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#C62828] border border-white shadow-xs"></span>
            <span className="text-[#0F172A] font-medium text-[11px]">Critical Risk (&gt;75)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D97706] border border-white shadow-xs"></span>
            <span className="text-[#0F172A] font-medium text-[11px]">High Risk (60–74)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2563EB] border border-white shadow-xs"></span>
            <span className="text-[#0F172A] font-medium text-[11px]">Moderate Risk (40–59)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#15803D] border border-white shadow-xs"></span>
            <span className="text-[#0F172A] font-medium text-[11px]">Low Risk / Safe (&lt;40)</span>
          </div>

          <div className="pt-1.5 border-t border-slate-100 mt-1.5 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-red-600 flex items-center justify-center text-white text-[8px] font-bold">
                ●
              </div>
              <span className="text-slate-600 text-[11px]">Habitation Settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#15803D] flex items-center justify-center text-white text-[9px]">
                ⌂
              </div>
              <span className="text-slate-600 text-[11px]">Relief Shelter Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#2563EB] rounded"></div>
              <span className="text-slate-600 text-[11px]">Evacuation Corridor</span>
            </div>
          </div>
        </div>

        {/* Risk Gradient Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#C62828] via-[#D97706] via-[#2563EB] to-[#15803D]" />
          <div className="flex justify-between text-[9px] text-[#667085] mt-1 font-mono font-semibold">
            <span>CRITICAL</span>
            <span>HIGH</span>
            <span>MOD</span>
            <span>SAFE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
