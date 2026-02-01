import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { getLocationSuggestions, ALL_LOCATION_NAMES } from '../utils/locationData';

interface LocationInputProps {
  onLocationSubmit: (location: string) => void;
}

const SUGGESTION_LIMIT = 8;

export const LocationInput: React.FC<LocationInputProps> = ({ onLocationSubmit }) => {
  const [value, setValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = getLocationSuggestions(value).slice(0, SUGGESTION_LIMIT);
  const showDropdown = isDropdownOpen && value.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onLocationSubmit(value);
    }
  };

  const handleSuggestionClick = (location: string) => {
    setValue(location);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    onLocationSubmit(location);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.h1
            className="text-5xl md:text-6xl font-bold tracking-tight text-[#F5F5F5]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            What location do you want to <span className="text-[#00FF88]">reimagine</span> today?
          </motion.h1>
          <motion.p
            className="text-xl text-[#DADADA] opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Enter a place to visualize sustainable and smart planning possibilities.
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF88] to-[#00FFFF] rounded-3xl blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
          <div className="relative">
            <div className="relative flex items-center bg-[#0F0F0F] border border-white/10 rounded-2xl p-2 transition-all duration-300 focus-within:border-[#00FF88]/50">
              <div className="pl-4 text-[#DADADA]/50" style={{ flexShrink: 0 }}>
                <MapPin size={24} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setIsDropdownOpen(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => value.trim() && setIsDropdownOpen(true)}
                onBlur={() => setHighlightedIndex(-1)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a location (e.g., Connaught Place, Delhi)"
                className="bg-transparent border-none text-xl px-4 py-4 text-[#F5F5F5] placeholder:text-[#DADADA]/30 focus:outline-none"
                style={{ flex: 1, minWidth: 0 }}
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-[#00FF88] hover:bg-[#39FF14] text-black rounded-xl p-4 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] active:scale-95 flex items-center justify-center"
                style={{ flexShrink: 0, minWidth: 56, height: 48 }}
              >
                <ArrowRight size={24} strokeWidth={3} />
              </button>
            </div>

            <AnimatePresence>
              {showDropdown && suggestions.length > 0 && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-xl max-h-64 overflow-y-auto z-50"
                  style={{ padding: '1rem 1.5rem' }}
                >
                  {suggestions.map((location, index) => (
                    <button
                      key={location}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(location);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full text-left text-base text-[#F5F5F5] hover:bg-[#00FF88]/10 transition-colors rounded-lg ${
                        index === highlightedIndex ? 'bg-[#00FF88]/10 text-[#00FF88]' : ''
                      }`}
                      style={{ padding: '0.75rem 1.25rem' }}
                    >
                      {location}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 pt-4"
        >
          {ALL_LOCATION_NAMES.slice(0, 6).map((city) => (
            <button
              key={city}
              onClick={() => onLocationSubmit(city)}
              className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-[#DADADA] text-sm hover:bg-[#00FF88]/10 hover:border-[#00FF88]/30 transition-all duration-200"
            >
              {city}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
