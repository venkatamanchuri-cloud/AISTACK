export interface LocationInfo {
  name: string;
  country: string;
  admin1?: string; // State/Region
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone?: string;
  countryCode?: string;
}

export interface CurrentWeather {
  temperature: number; // °C
  temperatureF: number; // °F
  apparentTemperature: number;
  humidity: number; // %
  dewPoint: number;
  precipitation: number; // mm
  weatherCode: number;
  weatherLabel: string;
  isDay: boolean;
  cloudCover: number; // %
  pressureMsl: number; // hPa
  surfacePressure: number;
  windSpeed: number; // km/h
  windSpeedMph: number;
  windDirection: number; // degrees
  windGusts: number; // km/h
  visibility: number; // km
  uvIndex: number;
  soilMoisture?: number; // m³/m³
  soilTemperature?: number; // °C
  timestamp: string;
}

export interface HourlyForecast {
  time: string; // ISO or HH:mm
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  weatherLabel: string;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  cloudCover: number;
  humidity: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  weatherCode: number;
  weatherLabel: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface AirQualityData {
  usAqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number;
  so2: number;
  o3: number;
  co: number;
  healthAdvice: string;
}

export interface MarineData {
  waveHeight: number; // meters
  waveDirection: number; // degrees
  wavePeriod: number; // seconds
  seaSurfaceTemperature: number; // °C
  swellHeight: number;
}

export type IndustryType = 'logistics' | 'energy' | 'agriculture' | 'retail' | 'construction' | 'aviation';

export interface IndustryImpact {
  industry: IndustryType;
  title: string;
  score: number; // 0 - 100 risk score
  status: 'optimal' | 'notice' | 'warning' | 'severe';
  summary: string;
  keyMetrics: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
  actionItems: string[];
}

export interface EnterpriseAsset {
  id: string;
  name: string;
  type: 'Warehouse Hub' | 'Solar Farm' | 'Port Terminal' | 'Fleet Corridor' | 'Construction Site' | 'Data Center';
  city: string;
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  temperature: number;
  windSpeed: number;
  precipitationProb: number;
  activeAlertsCount: number;
  primaryRiskFactor: string;
  lastUpdated: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: 'temperature' | 'windSpeed' | 'precipitation' | 'uvIndex' | 'usAqi' | 'visibility';
  operator: '>' | '<' | '>=';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  assetTarget: string; // 'All Assets' or specific asset name
  enabled: boolean;
  lastTriggered?: string;
}

export interface AIIntelligenceReport {
  executiveSummary: string;
  riskRating: 'Low Risk' | 'Moderate Risk' | 'Elevated Threat' | 'Severe Hazard';
  threats: { title: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string; impactWindow: string }[];
  industryInsights: {
    logistics: string;
    energy: string;
    agriculture: string;
    construction: string;
  };
  operationalMitigations: string[];
  recommendedDispatchAdjustments: string;
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
