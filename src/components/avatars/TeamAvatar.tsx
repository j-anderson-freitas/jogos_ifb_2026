import React from 'react';

export interface TeamAvatarProps {
  avatarKey: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TeamAvatar: React.FC<TeamAvatarProps> = ({
  avatarKey,
  name,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size];

  // Renderizador SVG vetorial exclusivo para cada avatar de equipe
  const renderEmblem = () => {
    switch (avatarKey) {
      case 'galaticos':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <defs>
              <linearGradient id="galGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19" fill="url(#galGrad)" />
            <polygon points="20,7 23,16 33,16 25,22 28,32 20,26 12,32 15,22 7,16 17,16" fill="#FDE047" />
            <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
          </svg>
        );

      case 'gatopreto':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#0F172A" />
            {/* Orelhas de Gato */}
            <polygon points="10,20 14,8 20,16" fill="#1E293B" />
            <polygon points="30,20 26,8 20,16" fill="#1E293B" />
            <circle cx="20" cy="23" r="11" fill="#1E293B" />
            {/* Olhos verdes brilhantes */}
            <circle cx="16" cy="22" r="2.5" fill="#22C55E" />
            <circle cx="24" cy="22" r="2.5" fill="#22C55E" />
            {/* Bigodes */}
            <line x1="8" y1="26" x2="14" y2="25" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="8" y1="28" x2="14" y2="28" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="32" y1="26" x2="26" y2="25" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="32" y1="28" x2="26" y2="28" stroke="#94A3B8" strokeWidth="1.5" />
          </svg>
        );

      case 'gama':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="20" fill="#047857" />
            <path d="M12 12 H28 V18 H19 V22 H26 V27 H19 V32 H12 Z" fill="#FFFFFF" />
            <polygon points="28,27 34,22 28,18" fill="#FACC15" />
          </svg>
        );

      case 'sarues':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#78350F" />
            <ellipse cx="20" cy="22" rx="12" ry="10" fill="#D97706" />
            <circle cx="15" cy="18" r="2.5" fill="#FFFFFF" />
            <circle cx="25" cy="18" r="2.5" fill="#FFFFFF" />
            <circle cx="15" cy="18" r="1.2" fill="#000000" />
            <circle cx="25" cy="18" r="1.2" fill="#000000" />
            <polygon points="20,21 17,25 23,25" fill="#EF4444" />
          </svg>
        );

      case 'canela':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="12" fill="#15803D" />
            {/* Flor Canela de Ema */}
            <circle cx="20" cy="20" r="5" fill="#FACC15" />
            <ellipse cx="20" cy="10" rx="4" ry="7" fill="#A855F7" />
            <ellipse cx="20" cy="30" rx="4" ry="7" fill="#A855F7" />
            <ellipse cx="10" cy="20" rx="7" ry="4" fill="#A855F7" />
            <ellipse cx="30" cy="20" rx="7" ry="4" fill="#A855F7" />
          </svg>
        );

      case 'cachorroes':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#DC2626" />
            <circle cx="20" cy="22" r="12" fill="#F8FAFC" />
            {/* Óculos escuros esportivos */}
            <rect x="12" y="16" width="7" height="6" rx="2" fill="#0F172A" />
            <rect x="21" y="16" width="7" height="6" rx="2" fill="#0F172A" />
            <line x1="18" y1="18" x2="22" y2="18" stroke="#0F172A" strokeWidth="2" />
            <ellipse cx="20" cy="25" rx="3" ry="2" fill="#000000" />
          </svg>
        );

      case 'next':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#2563EB" />
            <polygon points="10,12 24,20 10,28" fill="#FFFFFF" />
            <polygon points="20,12 34,20 20,28" fill="#67E8F9" />
          </svg>
        );

      case 'deepriver':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#0369A1" />
            <path d="M8 15 Q14 10 20 15 T32 15" stroke="#BAE6FD" strokeWidth="3" fill="none" />
            <path d="M8 22 Q14 17 20 22 T32 22" stroke="#FFFFFF" strokeWidth="3" fill="none" />
            <path d="M8 29 Q14 24 20 29 T32 29" stroke="#38BDF8" strokeWidth="3" fill="none" />
          </svg>
        );

      case 'estrutural':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="8" fill="#475569" />
            <polygon points="20,6 32,32 8,32" fill="none" stroke="#F8FAFC" strokeWidth="3" />
            <circle cx="20" cy="22" r="4" fill="#F59E0B" />
          </svg>
        );

      case 'donas':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#DB2777" />
            {/* Coroa */}
            <polygon points="12,18 16,12 20,16 24,12 28,18 20,28" fill="#FACC15" />
            <circle cx="20" cy="24" r="5" fill="#FFFFFF" />
            <circle cx="20" cy="24" r="2" fill="#DB2777" />
          </svg>
        );

      case 'sebastiana':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#0284C7" />
            <circle cx="20" cy="20" r="14" fill="#FFFFFF" />
            <path d="M16 14 C16 12, 24 12, 24 18 C24 22, 16 22, 16 26 C16 28, 24 28, 24 26" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );

      case 'voleibol_ctag':
      case 'cpla':
      case 'boratime':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#0D9488" />
            <circle cx="20" cy="20" r="12" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M20 8 Q26 20 20 32" stroke="#FDE047" strokeWidth="2" fill="none" />
            <path d="M9 16 Q20 24 31 16" stroke="#FDE047" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'titas':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <polygon points="20,4 34,14 34,26 20,36 6,26 6,14" fill="#EA580C" />
            <polygon points="20,10 28,16 28,24 20,30 12,24 12,16" fill="#FDE047" />
            <circle cx="20" cy="20" r="3" fill="#EA580C" />
          </svg>
        );

      case 'semdidatica':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#6B21A8" />
            {/* Prancheta com X e O */}
            <rect x="10" y="8" width="20" height="24" rx="3" fill="#FFFFFF" />
            <line x1="14" y1="15" x2="18" y2="19" stroke="#EF4444" strokeWidth="2" />
            <line x1="18" y1="15" x2="14" y2="19" stroke="#EF4444" strokeWidth="2" />
            <circle cx="24" cy="17" r="2.5" fill="none" stroke="#2563EB" strokeWidth="2" />
            <path d="M14 25 Q20 21 26 25" stroke="#16A34A" strokeWidth="2" fill="none" strokeDasharray="2,2" />
          </svg>
        );

      case 'ctaghoopers':
      case 'jordana':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#EA580C" />
            {/* Linhas de Basquete */}
            <circle cx="20" cy="20" r="18" fill="none" stroke="#000000" strokeWidth="1.5" />
            <line x1="2" y1="20" x2="38" y2="20" stroke="#000000" strokeWidth="2" />
            <line x1="20" y1="2" x2="20" y2="38" stroke="#000000" strokeWidth="2" />
            <path d="M9 7 C15 15, 15 25, 9 33" stroke="#000000" strokeWidth="2" fill="none" />
            <path d="M31 7 C25 15, 25 25, 31 33" stroke="#000000" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'quitados':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="8" fill="#1E293B" />
            <rect x="8" y="10" width="24" height="20" rx="2" fill="#FFFFFF" />
            <text x="12" y="24" fill="#16A34A" fontWeight="bold" fontSize="9">
              PAGO
            </text>
          </svg>
        );

      case 'cest':
      case 'bonde':
      case 'cei2':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#059669" />
            <circle cx="20" cy="20" r="12" fill="#F8FAFC" />
            <text x="11" y="25" fill="#059669" fontWeight="900" fontSize="12">
              CEI
            </text>
          </svg>
        );

      case 'sand':
      case 'sandstars':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#D97706" />
            {/* Sol e onda de areia */}
            <circle cx="20" cy="15" r="7" fill="#FEF08A" />
            <path d="M6 32 Q20 22 34 32" stroke="#FDE68A" strokeWidth="4" fill="none" />
          </svg>
        );

      case 'mtbrothers':
      case 'soberanas':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#0284C7" />
            <polygon points="20,6 24,14 33,15 26,22 28,31 20,26 12,31 14,22 7,15 16,14" fill="#FDE047" />
          </svg>
        );

      case 'elite':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#1E1B4B" />
            <polygon points="20,8 32,18 20,32 8,18" fill="#FACC15" />
            <polygon points="20,12 28,18 20,28 12,18" fill="#FFFFFF" />
          </svg>
        );

      case 'endorfinadas':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="19" fill="#9333EA" />
            <circle cx="14" cy="16" r="4" fill="#F472B6" />
            <circle cx="26" cy="16" r="4" fill="#F472B6" />
            <circle cx="20" cy="26" r="5" fill="#FBBF24" />
            <line x1="14" y1="16" x2="20" y2="26" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="26" y1="16" x2="20" y2="26" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        );

      case 'furia':
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" rx="10" fill="#B91C1C" />
            {/* Raio furioso */}
            <polygon points="22,6 12,20 20,20 16,34 30,16 22,16" fill="#FDE047" />
          </svg>
        );

      default:
        // Monograma inicial estilizado padrão
        return (
          <div className="w-full h-full rounded-m3-md bg-gradient-to-br from-emerald-600 to-slate-800 flex items-center justify-center font-bold text-white uppercase shadow-inner">
            {name.slice(0, 2)}
          </div>
        );
    }
  };

  return (
    <div
      title={name}
      className={`relative inline-block rounded-m3-md overflow-hidden flex-shrink-0 shadow-sm ${sizeMap} ${className}`}
    >
      {renderEmblem()}
    </div>
  );
};

