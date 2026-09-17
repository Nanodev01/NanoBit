import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
      >
        {/* Escudo truncado (mitad izquierda sólida y mitad derecha con nodos de circuito) */}
        <path d="M50 10 L15 25 V45 C15 65 30 85 50 95 C50 95 50 65 50 45" fill="none" strokeWidth="4" />
        <path d="M50 10 L85 25 V45 C85 50 82 58 75 66" fill="none" strokeWidth="4" />
        
        {/* Nodos de circuito / pistas */}
        <path d="M50 35 H65" />
        <circle cx="68" cy="35" r="3" fill="currentColor" stroke="none" />
        
        <path d="M50 55 H75" />
        <circle cx="78" cy="55" r="3" fill="currentColor" stroke="none" />
        
        <path d="M50 75 H60" />
        <circle cx="63" cy="75" r="3" fill="currentColor" stroke="none" />
        
        {/* Nodo central */}
        <circle cx="50" cy="50" r="5" className="text-white" fill="currentColor" />
        <path d="M50 10 V50" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-white font-mono">
        nanobit<span className="text-cyan-400">.me</span>
      </span>
    </div>
  );
}
