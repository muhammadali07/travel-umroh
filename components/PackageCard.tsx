
import React from 'react';
import { TravelPackage } from '../types';
import { ICONS } from '../constants';

interface PackageCardProps {
  pkg: TravelPackage;
  onSelect: (pkg: TravelPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(pkg.price);

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 startup-shadow hover:translate-y-[-12px] hover:border-emerald-100 transition-all duration-700 cursor-pointer flex flex-col h-full" onClick={() => onSelect(pkg)}>
      <div className="relative aspect-[16/11] overflow-hidden shrink-0">
        <img 
          src={pkg.image} 
          alt={pkg.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="bg-white/95 backdrop-blur-xl text-emerald-950 text-[10px] font-black px-4 py-2 rounded-full shadow-sm">
            {pkg.duration.toUpperCase()}
          </span>
          {pkg.isPopular && (
            <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl shadow-emerald-500/20">
              FEATURED
            </span>
          )}
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-5">
          {[...Array(5)].map((_, i) => (
            <ICONS.Star 
              key={i} 
              className={`w-3.5 h-3.5 ${i < pkg.hotelStar ? 'text-amber-400' : 'text-slate-100'}`} 
            />
          ))}
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-3 leading-[1.1] tracking-tight group-hover:text-emerald-800 transition-colors">
          {pkg.title}
        </h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 line-clamp-2">
          {pkg.description}
        </p>
        
        <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Package Total</p>
            <p className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tighter leading-none">{formattedPrice}</p>
          </div>
          <button className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-emerald-950 text-white rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:scale-110 transition-all active:scale-90 shadow-xl shadow-emerald-900/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
