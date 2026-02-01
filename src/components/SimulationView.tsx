import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { LocationData } from '../types/location';

interface SimulationViewProps {
  viewType: 'original' | 'planned';
  locationData?: LocationData | null;
}

export const SimulationView: React.FC<SimulationViewProps> = ({ viewType, locationData }) => {
  // Image URLs - original uses imagePath (initial folder), planned uses finalImagePath (photos folder)
  const rawImages = {
    original: locationData?.imagePath ?? "https://images.unsplash.com/photo-1767028531579-545818fabbd5?w=1080",
    planned: locationData?.finalImagePath ?? locationData?.imagePath ?? "https://images.unsplash.com/photo-1708720500540-611d360140e9?w=1080",
  };
  // Encode local paths for spaces/special chars
  const images = {
    original: rawImages.original.startsWith('/') ? rawImages.original.split('/').map((s, i) => i ? encodeURIComponent(s) : s).join('/') : rawImages.original,
    planned: rawImages.planned.startsWith('/') ? rawImages.planned.split('/').map((s, i) => i ? encodeURIComponent(s) : s).join('/') : rawImages.planned,
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/5">
      <AnimatePresence mode="wait">
        <motion.div 
          key={viewType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <ImageWithFallback 
            src={images[viewType]} 
            alt={viewType}
            className="w-full h-full object-cover transition-all duration-700"
          />
        </motion.div>
      </AnimatePresence>

      {/* Labels & Branding */}
      <div className="absolute top-6 left-6 flex flex-col gap-2">
        <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#00FF88] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          {viewType === 'planned' ? 'Sustainable Deployment Plan' : 'Baseline Reference'}
        </div>
      </div>

      <div className="absolute top-6 right-6">
        <button className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors">
          <Info size={20} />
        </button>
      </div>
    </div>
  );
};

