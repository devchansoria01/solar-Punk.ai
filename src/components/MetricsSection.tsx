import React from 'react';
import { motion } from 'motion/react';
import { Zap, Leaf, Trees, Sun, Car } from 'lucide-react';
import type { LocationData } from '../types/location';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, unit, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[#0F0F0F]/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex items-center gap-4 min-w-[180px]"
  >
    <div className={`p-3 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${color}10`, color: color }}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-[#DADADA]/50 uppercase tracking-wider font-semibold">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#F5F5F5]">{value}</span>
        {unit && <span className="text-sm text-[#DADADA]/40 font-medium">{unit}</span>}
      </div>
    </div>
  </motion.div>
);

interface MetricsSectionProps {
  solarAdoptionLevel: number;
  greenCoveragePercent: number;
  locationData?: LocationData | null;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({ solarAdoptionLevel, greenCoveragePercent, locationData }) => {
  const multiplier = solarAdoptionLevel / 50;

  // When location data is available, show location-specific metrics scaled by sliders
  if (locationData) {
    const totalVehicles = locationData.vehicles.reduce((sum, v) => sum + v.count, 0);
    const evCount = locationData.vehicles.find((v) => v.type === 'Electric')?.count ?? 0;
    const solarPanels = Math.floor(locationData.solarPanelCount * (solarAdoptionLevel / 100));
    const displayedFinalTrees = Math.max(locationData.initialTreeCount, Math.floor(locationData.finalTreeCount * (greenCoveragePercent / 100)));
    const energyEfficiency = (locationData.percentageEnergyEfficiency * (solarAdoptionLevel / 100) * (greenCoveragePercent / 100)).toFixed(1);

    return (
      <div className="flex flex-wrap gap-4">
        <MetricCard 
          icon={<Trees size={20} />} 
          label="Tree Count" 
          value={`${locationData.initialTreeCount} → ${displayedFinalTrees}`}
          color="#00FF88" 
        />
        <MetricCard 
          icon={<Sun size={20} />} 
          label="Solar Panels" 
          value={solarPanels.toString()} 
          color="#39FF14" 
        />
        <MetricCard 
          icon={<Car size={20} />} 
          label="Vehicles" 
          value={totalVehicles.toString()} 
          unit={`(${evCount} EV)`}
          color="#00FFFF" 
        />
        <MetricCard 
          icon={<Zap size={20} />} 
          label="Energy Efficiency" 
          value={`+${energyEfficiency}%`} 
          color="#90EE90" 
        />
      </div>
    );
  }

  // Fallback to solar adoption-based metrics
  return (
    <div className="flex flex-wrap gap-4">
      <MetricCard 
        icon={<Zap size={20} />} 
        label="Energy Saved" 
        value={(24.5 * multiplier).toFixed(1)} 
        unit="MWh" 
        color="#00FF88" 
      />
      <MetricCard 
        icon={<Leaf size={20} />} 
        label="CO₂ Reduced" 
        value={(12.8 * multiplier).toFixed(1)} 
        unit="Tons" 
        color="#39FF14" 
      />
      <MetricCard 
        icon={<Trees size={20} />} 
        label="Air Quality" 
        value={(85 + (10 * multiplier)).toFixed(0)} 
        unit="AQI" 
        color="#00FFFF" 
      />
      <MetricCard 
        icon={<Leaf size={20} />} 
        label="Green Cover" 
        value={(15 + (25 * multiplier)).toFixed(0)} 
        unit="%" 
        color="#90EE90" 
      />
    </div>
  );
};
