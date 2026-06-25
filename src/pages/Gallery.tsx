import React, { useState } from 'react';
import { sampleGalleryImages } from '../data/menu';
import { ZoomIn, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Gallery: React.FC = () => {
  const [selectedImgId, setSelectedImgId] = useState<string | null>(null);

  const selectedImg = sampleGalleryImages.find(i => i.id === selectedImgId);

  return (
    <div id="gallery-view" className="bg-[#050505] text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-400">The Visual Ledger</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-white mt-2 tracking-tight">Atmosphere & Artistry</h1>
          <div className="h-[1px] w-20 bg-purple-500/50 mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
          <p className="text-gray-400 text-xs font-light max-w-2xl mx-auto mt-4 leading-relaxed">
            Step inside our twilight sanctuary. Every shadow is deliberate, every lavender scent curated, and every ceramic bowl hand-crafted to capture dining perfection.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleGalleryImages.map((img) => (
            <motion.div
              key={img.id}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setSelectedImgId(img.id)}
              className="relative group rounded-2xl overflow-hidden h-72 border border-white/10 cursor-pointer shadow-2xl bg-white/5 backdrop-blur-sm"
            >
              <img 
                src={img.url} 
                alt={img.caption} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Blur Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="flex justify-end">
                  <span className="p-2 bg-purple-600 rounded-full text-white shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xs text-white font-medium leading-relaxed uppercase tracking-wider">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImg && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            >
              <button 
                onClick={() => setSelectedImgId(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full transition-colors border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-w-4xl w-full flex flex-col items-center gap-4">
                <img 
                  src={selectedImg.url} 
                  alt={selectedImg.caption} 
                  className="max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]"
                />
                <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10 text-xs max-w-xl text-center text-slate-200 shadow-xl mt-2 font-light backdrop-blur-md">
                  <Info className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{selectedImg.caption}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
export default Gallery;
