export type ScenarioType = 'Flood' | 'Landslide' | 'Cyclone' | 'Earthquake' | 'Industrial Hazard';

export type RiskLevel = 'Critical' | 'High' | 'Moderate' | 'Low' | 'Safe';

export interface Habitation {
  id: string;
  name: string;
  subdivision: string;
  population: number;
  hazard: string;
  riskScore: number;
  riskLevel: RiskLevel;
  factors: {
    floodExposure: number;
    populationDensity: number;
    vulnerability: number;
    historicalIncidents: number;
  };
  vulnerablePop: {
    childrenPct: number;
    childrenCount: number;
    elderlyPct: number;
    elderlyCount: number;
    disabledPct: number;
    disabledCount: number;
  };
  recommendedShelterId: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  status: 'Evacuation Required' | 'Monitoring' | 'Alert Issued' | 'Evacuated' | 'Normal';
  distanceToShelterKm: number;
  travelTimeMin: number;
  nearestWaterBody: string;
  elevationMeters: number;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  totalCapacity: number;
  assignedCount: number;
  remainingCapacity: number;
  occupancyPct: number;
  status: 'Available' | 'Limited' | 'Full' | 'Standby';
  distanceKm: number;
  coordinates: { x: number; y: number; lat: number; lng: number };
  contactPerson: string;
  contactPhone: string;
  facilities: {
    medical: boolean;
    food: boolean;
    water: boolean;
    power: boolean;
    accessibility: boolean;
    sanitation: boolean;
  };
  suppliesDaysRemaining: number;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  originHabitationId: string;
  originName: string;
  destShelterId: string;
  destName: string;
  distanceKm: number;
  estimatedTimeMin: number;
  obstructionRisk: 'Low' | 'Medium' | 'High' | 'Blocked';
  floodExposurePct: number;
  roadCondition: 'Paved Highway' | 'Secondary Road' | 'Embankment Road' | 'Rural Link';
  trafficStatus: 'Clear' | 'Moderate' | 'Heavy Congestion';
  recommendedTransport: string;
  isRecommended: boolean;
  elevationProfile: number[];
  waypoints: { x: number; y: number }[];
  safetyScore: number;
}

export interface ResourceItem {
  id: string;
  category: 'Transport' | 'Food' | 'Water' | 'Medical' | 'Rescue Teams' | 'Shelter Kits';
  name: string;
  unit: string;
  available: number;
  allocated: number;
  required: number;
  shortage: number;
  status: 'Sufficient' | 'Low' | 'Critical Shortage';
  assignedZone: string;
}

export interface EmergencyAlert {
  id: string;
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  location: string;
  read: boolean;
  actionUrl?: string;
}

export interface ResponsePlan {
  id: string;
  habitationId: string;
  habitationName: string;
  population: number;
  primaryShelterId: string;
  primaryShelterName: string;
  routeId: string;
  routeName: string;
  estimatedTravelTimeMin: number;
  busesRequired: number;
  foodPackets: number;
  waterLiters: number;
  medicalTeams: number;
  recommendedDeparture: string;
  status: 'Draft' | 'Approved' | 'Dispatched' | 'Completed';
  createdAt: string;
}
