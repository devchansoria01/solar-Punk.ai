import React, { useState, useEffect } from 'react';
import { BackgroundGradient } from './components/BackgroundGradient';
import { LocationInput } from './components/LocationInput';
import { Dashboard } from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'loading' | 'dashboard'>('input');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loadingDuration, setLoadingDuration] = useState(15000);

  const handleLocationSubmit = (location: string) => {
    setSelectedLocation(location);
    const duration = 10000 + Math.random() * 10000; // Random 10-20 seconds
    setLoadingDuration(duration);
    setStep('loading');
  };

  useEffect(() => {
    if (step !== 'loading') return;
    const timer = setTimeout(() => setStep('dashboard'), loadingDuration);
    return () => clearTimeout(timer);
  }, [step, loadingDuration]);

  const handleBack = () => {
    setStep('input');
  };

  return (
    <div className="relative min-h-screen w-full selection:bg-[#00FF88]/30 selection:text-[#00FF88]">
      <BackgroundGradient />
      
      <AnimatePresence mode="wait">
        {step === 'input' ? (
          <motion.div
            key="input-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
          >
            <LocationInput onLocationSubmit={handleLocationSubmit} />
          </motion.div>
        ) : step === 'loading' ? (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center space-y-8 max-w-md">
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                >
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    className="text-[#00FF88]"
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeOpacity="0.2"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="80 180"
                      style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                    />
                  </svg>
                </motion.div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#F5F5F5] mb-2">Analyzing {selectedLocation}</h2>
                <p className="text-[#DADADA]/70 mb-4">Generating sustainable planning scenarios...</p>
                <div className="h-1.5 w-full max-w-xs mx-auto bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00FF88] to-[#00FFFF] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: loadingDuration / 1000, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', damping: 25 }}
          >
            <Dashboard 
              location={selectedLocation} 
              onBack={handleBack} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Bottom Branding */}
      <footer className="fixed bottom-6 right-8 pointer-events-none opacity-20 hidden md:block">
        <p className="text-[10px] text-white uppercase tracking-[0.5em] font-black">
          Human-Centric Planning / Explainable AI
        </p>
      </footer>
    </div>
  );
};

export default App;
