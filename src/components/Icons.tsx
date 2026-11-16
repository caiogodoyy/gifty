type P = { className?: string };
const base = {
  width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
};

export const UsersIcon = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="9" cy="8" r="3.2" /><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" /><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14c1.8.7 3 2.3 3 5" /></svg>
);
export const GiftIcon = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3.5" y="9" width="17" height="4" rx="1" /><path d="M5 13v7h14v-7M12 9v11" /><path d="M12 9c-2.5 0-4.5-.8-4.5-2.6C7.5 5 8.600 4 9.800 4c1.800 0 2.200 2.600 2.200 5zm0 0c2.500 0 4.500-.8 4.500-2.600C16.500 5 15.400 4 14.200 4 12.400 4 12 6.600 12 9z" /></svg>
);
export const UserIcon = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.700 3.100-6 7-6s7 2.300 7 6" /></svg>
);
export const ChevronRight = ({ className }: P) => (
  <svg {...base} className={className}><path d="m9 5 7 7-7 7" /></svg>
);
export const ChevronLeft = ({ className }: P) => (
  <svg {...base} className={className}><path d="m15 5-7 7 7 7" /></svg>
);
export const PlusIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const ExternalIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M8 16 16 8M9 8h7v7" /></svg>
);
export const RulerIcon = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="8" width="18" height="8" rx="1.500" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></svg>
);
export const HelpIcon = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.7.400-1 .9-1 1.700M12 17h.01" /></svg>
);
export const ShirtIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="m8 4-5 3 2 4 2-1v10h10V10l2 1 2-4-5-3c-.5 1.300-1.800 2-4 2S8.500 5.300 8 4Z" /></svg>
);
export const PantsIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M7 3h10l1 18h-5l-1-10-1 10H6L7 3Z" /><path d="M7 7h10" /></svg>
);
export const ShoeIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M3 16V8l4 1.500c1 2 3 3 5 3h2c3 0 7 1 7 4v1H3v-2Z" /><path d="M3 18h18" /></svg>
);
export const LogoutIcon = ({ className }: P) => (
  <svg {...base} className={className}><path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" /></svg>
);
export const ImageIcon = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.800" /><path d="m4 18 5-5 4 4 3-3 4 4" /></svg>
);
