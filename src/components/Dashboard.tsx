import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  ChevronLeft, 
  Maximize2,
  Share2,
  Database
} from 'lucide-react';
import { SimulationView } from './SimulationView';
import { MetricsSection } from './MetricsSection';
import { getLocationData } from '../utils/locationData';

interface DashboardProps {
  location: string;
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ location, onBack }) => {
  const [activeLayer, setActiveLayer] = useState<'original' | 'planned'>('planned');
  const [solarAdoptionLevel, setSolarAdoptionLevel] = useState(65);
  const [greenCoveragePercent, setGreenCoveragePercent] = useState(80);

  const locationData = useMemo(() => getLocationData(location), [location]);

  const layers = [
    { id: 'original', label: 'Original View', sub: 'Baseline' },
    { id: 'planned', label: 'Planned View', sub: 'Strategic' },
  ];

  return (
    <div className="min-h-screen flex flex-col text-[#F5F5F5]">
      {/* Top Nav */}
      <nav className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00FF88] to-[#00FFFF] flex items-center justify-center">
              <Database size={24} className="text-black" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight leading-none">Smart Aftermarket</h2>
              <p className="text-[10px] text-[#00FF88] uppercase tracking-widest font-bold">Sustainable City Simulator</p>
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
          
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#DADADA]/60 hover:text-white transition-colors text-sm font-medium"
          >
            <ChevronLeft size={18} />
            {location}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-[#DADADA]/60 hover:text-[#00FF88] transition-colors"><History size={20} /></button>
          <button className="text-[#DADADA]/60 hover:text-[#00FF88] transition-colors"><Maximize2 size={20} /></button>
          <button className="text-[#DADADA]/60 hover:text-[#00FF88] transition-colors"><Settings size={20} /></button>
          <div className="h-8 w-[1px] bg-white/10" />
          <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-white/5">
            <Share2 size={16} />
            Export Plan
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-8 flex-1">
          
          {/* Left Sidebar - Layer Stack */}
          <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00FF88] mb-1">Scenario Layers</h3>
              <p className="text-xs text-[#DADADA]/40">Switch between simulation stages</p>
            </div>
            
            <div className="flex flex-col gap-4">
              {layers.map((layer, index) => (
                <motion.button
                  key={layer.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveLayer(layer.id as any)}
                  className={`relative group p-4 rounded-2xl border transition-all duration-300 text-left flex items-center gap-4 ${
                    activeLayer === layer.id 
                      ? 'bg-[#0F0F0F] border-[#00FF88]/50 shadow-[0_10px_30px_rgba(0,255,136,0.1)]' 
                      : 'bg-[#050505]/50 border-white/5 hover:border-white/20'
                  }`}
                  style={{ 
                    zIndex: activeLayer === layer.id ? 10 : 0,
                    marginTop: index > 0 ? '-1rem' : '0' 
                  }}
                >
                  <div className={`w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all ${activeLayer === layer.id ? 'grayscale-0' : ''}`}>
                    <div className={`w-full h-full bg-cover bg-center`} style={{ backgroundImage: `url(${(() => {
                      const p = layer.id === 'original' ? (locationData.imagePath || 'https://images.unsplash.com/photo-1767028531579-545818fabbd5?w=100') :
                        (locationData.finalImagePath || locationData.imagePath || 'https://images.unsplash.com/photo-1708720500540-611d360140e9?w=100');
                      return p.startsWith('/') ? p.split('/').map((s, i) => i ? encodeURIComponent(s) : s).join('/') : p;
                    })()})` }} />
                  </div>
                  <div>
                    <h4 className={`font-bold transition-colors ${activeLayer === layer.id ? 'text-[#00FF88]' : 'text-[#DADADA]'}`}>{layer.label}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-[#DADADA]/40 font-bold">{layer.sub}</p>
                  </div>
                  {activeLayer === layer.id && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-[#00FF88]" />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="bg-[#0F0F0F] border border-white/5 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-[#00FF88]">
                  <LayoutDashboard size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Planning Engine</span>
                </div>
                <p className="text-sm text-[#DADADA]/60 leading-relaxed">
                  Our AI engine analyzes traffic patterns, energy demand, and green space connectivity to propose optimal sustainability interventions.
                </p>
              </div>
            </div>
          </aside>

          {/* Center Panel - Main Simulation */}
          <section className="col-span-12 lg:col-span-9 flex flex-col gap-6">
            <div className="flex-1 relative min-h-[500px]">
              <SimulationView viewType={activeLayer} locationData={locationData} />
            </div>

            {/* Bottom Controls */}
            <div className="bg-[#0F0F0F] border border-white/5 p-8 rounded-3xl space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-6 flex-1 max-w-2xl">
                  {/* Solar Adoption Level Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#DADADA] mb-1">Solar Adoption Level</h3>
                        <p className="text-xs text-[#DADADA]/40">Solar panels scale with this percentage</p>
                      </div>
                      <span className="text-2xl font-black text-[#00FF88]">{solarAdoptionLevel}%</span>
                    </div>
                    <div className="relative h-4 flex items-center group">
                      <div className="absolute inset-0 bg-white/5 rounded-full" />
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all duration-300"
                        style={{ width: `${solarAdoptionLevel}%` }}
                      />
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={solarAdoptionLevel}
                        onChange={(e) => setSolarAdoptionLevel(parseInt(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-x-0 -bottom-4 flex justify-between px-1">
                        {[0, 25, 50, 75, 100].map(tick => (
                          <div key={tick} className="w-[1px] h-2 bg-white/10" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Green Coverage Percentage Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#DADADA] mb-1">Green Coverage</h3>
                        <p className="text-xs text-[#DADADA]/40">Final tree count scales with this (never below initial)</p>
                      </div>
                      <span className="text-2xl font-black text-[#00FF88]">{greenCoveragePercent}%</span>
                    </div>
                    <div className="relative h-4 flex items-center group">
                      <div className="absolute inset-0 bg-white/5 rounded-full" />
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all duration-300"
                        style={{ width: `${greenCoveragePercent}%` }}
                      />
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={greenCoveragePercent}
                        onChange={(e) => setGreenCoveragePercent(parseInt(e.target.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-x-0 -bottom-4 flex justify-between px-1">
                        {[0, 25, 50, 75, 100].map(tick => (
                          <div key={tick} className="w-[1px] h-2 bg-white/10" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-16 w-[1px] bg-white/10 hidden md:block" />

                <div className="flex-shrink-0">
                  <button className="bg-[#00FF88] hover:bg-[#39FF14] text-black px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] active:scale-95">
                    Generate New Scenario
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <MetricsSection solarAdoptionLevel={solarAdoptionLevel} greenCoveragePercent={greenCoveragePercent} locationData={locationData} />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};
