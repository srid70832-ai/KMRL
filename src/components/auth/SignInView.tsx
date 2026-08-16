import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crown,
  Users,
  BarChart2,
  FileText,
  Radio,
  FileSpreadsheet,
  FileCode,
  Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { UserRole } from '../../types.js';

export const SignInView: React.FC = () => {
  const { login, availableUsers } = useAuth();
  const [email, setEmail] = useState('sr.inspector@safety.kmrl.co.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ANALYST');
  const [selectedPersonaName, setSelectedPersonaName] = useState('ELAYANITHISH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Exact 4 Personas as specified
  const personas = [
    {
      name: 'RISHI',
      role: 'ADMIN' as UserRole,
      email: 'rishi@kmrl.gov.in',
      icon: Crown,
      iconColor: 'text-amber-400',
    },
    {
      name: 'SRI',
      role: 'MANAGER' as UserRole,
      email: 'sri@kmrl.gov.in',
      icon: Users,
      iconColor: 'text-blue-400',
    },
    {
      name: 'ELAYANITHISH',
      role: 'ANALYST' as UserRole,
      email: 'sr.inspector@safety.kmrl.co.in',
      icon: BarChart2,
      iconColor: 'text-cyan-400',
    },
    {
      name: 'RITHIKA',
      role: 'VIEWER' as UserRole,
      email: 'rithika@kmrl.gov.in',
      icon: Eye,
      iconColor: 'text-emerald-400',
    }
  ];

  const handleSelectPersona = (p: typeof personas[0]) => {
    setSelectedPersonaName(p.name);
    setSelectedRole(p.role);
    setEmail(p.email);
    setPassword('KmrlSecure2026!');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter an authorized email address');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      await login(email, selectedRole);
    } catch {
      setErrorMessage('Authentication failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#030a1c] text-white relative overflow-hidden font-sans select-none">
      {/* Ambient Sci-Fi Background Elements */}
      <div className="absolute inset-0 bg-radial from-[#0a1e4a]/60 via-[#030919] to-[#01040e] pointer-events-none" />

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e265c15_1px,transparent_1px),linear-gradient(to_bottom,#0e265c15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

      {/* Ambient Pulsing Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Main Hero Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT WING: Kochi Metro Train & Cityscape */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-start justify-center relative space-y-6">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-1 pl-2"
            >
              <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-400/90 uppercase block font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                SMART DOCUMENTS
              </span>
              <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-400/90 uppercase block font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                SMART OPERATIONS
              </span>
            </motion.div>

            {/* Metro Viaduct & Train Graphic Representation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden flex items-end justify-center p-4 bg-gradient-to-t from-[#020b22] via-[#05143a]/70 to-transparent border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              {/* Cityscape Skyline Silhouettes */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,#00f5d410,transparent_70%)] pointer-events-none" />
              
              {/* City buildings SVG backdrop */}
              <svg className="absolute bottom-16 left-0 right-0 w-full h-44 text-slate-800/80 pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
                <rect x="10" y="30" width="18" height="70" fill="#081432" />
                <rect x="14" y="35" width="3" height="4" fill="#38bdf8" opacity="0.6" />
                <rect x="20" y="45" width="3" height="4" fill="#38bdf8" opacity="0.6" />
                <rect x="32" y="15" width="22" height="85" fill="#0a1a44" />
                <rect x="36" y="22" width="3" height="4" fill="#06b6d4" opacity="0.7" />
                <rect x="44" y="32" width="3" height="4" fill="#06b6d4" opacity="0.7" />
                <rect x="36" y="48" width="3" height="4" fill="#06b6d4" opacity="0.7" />
                <rect x="58" y="40" width="20" height="60" fill="#07122e" />
                <rect x="82" y="10" width="26" height="90" fill="#0b1e4c" />
                <rect x="88" y="20" width="4" height="4" fill="#38bdf8" opacity="0.8" />
                <rect x="98" y="30" width="4" height="4" fill="#38bdf8" opacity="0.8" />
                <rect x="88" y="45" width="4" height="4" fill="#38bdf8" opacity="0.8" />
                <rect x="112" y="35" width="20" height="65" fill="#09163a" />
                <rect x="136" y="25" width="24" height="75" fill="#0a1a44" />
                <rect x="164" y="40" width="26" height="60" fill="#07122e" />
              </svg>

              {/* Elevated Viaduct Track */}
              <div className="absolute bottom-12 left-0 right-0 h-4 bg-gradient-to-r from-slate-700 via-cyan-900 to-slate-800 border-t border-b border-cyan-500/40" />
              <div className="absolute bottom-0 left-6 w-5 h-12 bg-slate-800 border-l border-r border-slate-700" />
              <div className="absolute bottom-0 right-10 w-5 h-12 bg-slate-800 border-l border-r border-slate-700" />

              {/* Futuristic Kochi Metro Train */}
              <motion.div
                animate={{
                  y: [-2, 2, -2],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-full flex flex-col items-center"
              >
                {/* Train Front Illustration */}
                <div className="relative w-44 h-56 rounded-t-[42px] rounded-b-xl bg-gradient-to-b from-[#0e5c63] via-[#093540] to-[#041a24] border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.4)] flex flex-col items-center overflow-hidden">
                  
                  {/* Top Destination Display */}
                  <div className="w-20 h-4 mt-3 rounded bg-black/90 border border-amber-400/50 flex items-center justify-center shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                    <span className="text-[8px] font-mono font-bold text-amber-400 tracking-wider">
                      ALUVA - PETTA
                    </span>
                  </div>

                  {/* Windshield */}
                  <div className="w-36 h-20 mt-2 rounded-t-3xl rounded-b-lg bg-gradient-to-b from-[#021822] via-[#052c3c] to-[#041b24] border border-cyan-400/50 relative overflow-hidden shadow-inner flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-transparent transform -rotate-12 translate-y-2" />
                    {/* Interior driver cabin glow */}
                    <div className="w-12 h-6 rounded bg-amber-200/20 blur-[2px]" />
                  </div>

                  {/* KMRL Ribbon Logo on Front */}
                  <div className="my-2 flex flex-col items-center">
                    <div className="flex items-center space-x-0.5">
                      <div className="w-3 h-3 border-l-2 border-t-2 border-cyan-400 transform -rotate-45" />
                      <div className="w-3 h-3 border-r-2 border-t-2 border-teal-300 transform rotate-45" />
                    </div>
                    <span className="text-[8px] font-bold tracking-widest text-cyan-300 font-mono mt-0.5">
                      KMRL
                    </span>
                  </div>

                  {/* Glowing LED Headlights */}
                  <div className="w-full px-6 flex justify-between items-center mt-1">
                    <motion.div
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-7 h-4 rounded-full bg-cyan-300 shadow-[0_0_15px_#22d3ee] transform -rotate-12"
                    />
                    <motion.div
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-7 h-4 rounded-full bg-cyan-300 shadow-[0_0_15px_#22d3ee] transform rotate-12"
                    />
                  </div>

                  {/* Bottom Bumper & Cowcatcher */}
                  <div className="w-full mt-auto h-6 bg-slate-900 border-t border-cyan-500/50 flex items-center justify-center">
                    <div className="w-20 h-1.5 bg-cyan-400/60 rounded-full" />
                  </div>
                </div>

                {/* Headlight Beam Reflection on Ground */}
                <div className="w-48 h-8 bg-gradient-to-b from-cyan-400/20 to-transparent blur-md transform -translate-y-2 pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

          {/* CENTER: High-Tech Glassmorphism Login Card */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-lg relative bg-gradient-to-b from-[#0a183d]/90 via-[#06122e]/95 to-[#040d24]/95 border-2 border-cyan-500/50 rounded-[32px] p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl"
            >
              {/* Outer Neon Glow Halo */}
              <div className="absolute -inset-[2px] rounded-[34px] bg-gradient-to-b from-cyan-400/40 via-blue-500/20 to-transparent -z-10 blur-[6px] pointer-events-none" />

              {/* KMRL Top Geometric Logo */}
              <div className="flex flex-col items-center text-center mb-5">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-2"
                >
                  {/* Stylized KMRL Folded Geometric Ribbon Logo */}
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 transform -skew-x-12 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center font-black text-slate-950 text-xs">
                      K
                    </div>
                    <div className="w-10 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 transform -skew-x-12 rounded-sm shadow-[0_0_15px_rgba(20,184,166,0.5)] flex items-center justify-center font-black text-slate-950 text-xs">
                      MRL
                    </div>
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-300 font-bold block mt-1.5 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]">
                    KOCHI METRO RAIL LIMITED
                  </span>
                </motion.div>

                {/* Glowing Horizontal Accent Divider */}
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent my-1" />

                {/* Application Title */}
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 flex items-center justify-center gap-1.5">
                  <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">KMRL</span>
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                    IntelliDocs
                  </span>
                </h1>

                <p className="text-[11px] sm:text-xs text-slate-300 font-light mt-1 max-w-sm leading-relaxed">
                  Evidence-Based AI Document Operations Command Center
                </p>
              </div>

              {/* Quick-Switch Persona Section */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-mono mb-2.5 px-0.5">
                  <span className="text-slate-300 font-semibold tracking-wide">
                    Quick-Switch Persona
                  </span>
                  <span className="text-cyan-400 font-medium flex items-center gap-1 text-[11px] bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                    RBAC Aware
                  </span>
                </div>

                {/* 2x2 Persona Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {personas.map((p) => {
                    const isSelected = selectedPersonaName === p.name;
                    const Icon = p.icon;

                    return (
                      <motion.button
                        key={p.name}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectPersona(p)}
                        className={`relative p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden flex items-center gap-3 ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.35),inset_0_0_10px_rgba(6,182,212,0.2)]'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {/* Active Selection Left Neon Bar */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                        )}

                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold tracking-wide truncate text-white">
                            {p.name}
                          </div>
                          <div
                            className={`text-[10px] font-mono font-semibold uppercase ${
                              isSelected ? 'text-cyan-300' : 'text-slate-500'
                            }`}
                          >
                            {p.role}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Error notification */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Organizational Email Field */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1.5 font-mono">
                    Organizational Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@kmrl.gov.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Access Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-medium text-slate-300 font-mono">
                      Access Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset verification token dispatched to your official KMRL credentials.')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter corporate access token"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner font-mono transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Authenticating Identity &amp; Role...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-slate-950" />
                      <span>AUTHENTICATE &amp; ENTER COMMAND CENTER</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Registration Operator Profile Toggle */}
              <div className="mt-4 text-center text-xs text-slate-400">
                <span>Need additional project access?</span>{' '}
                <button
                  type="button"
                  onClick={() => alert('Operator profile registration requested. Compliance officer will provision access.')}
                  className="text-cyan-400 font-semibold hover:underline cursor-pointer ml-1"
                >
                  Register Operator Profile
                </button>
              </div>

              {/* FIPS-140 Security Badge */}
              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400 text-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>FIPS-140 &amp; Kerala State IT Security Standards Verified</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT WING: AI Neural Holographic Brain & Floating Document Badges */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-t from-[#020b22] via-[#05143a]/70 to-transparent border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              {/* Radial Hologram Backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#06b6d415,transparent_70%)] pointer-events-none" />

              {/* Concentric Rotating Hologram Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 rounded-full border border-dashed border-cyan-500/30 absolute flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-0 shadow-[0_0_10px_#22d3ee]" />
                <div className="w-1.5 h-1.5 rounded-full bg-teal-300 absolute bottom-0 shadow-[0_0_8px_#5eead4]" />
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-36 h-36 rounded-full border border-cyan-400/40 absolute flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 absolute left-0 shadow-[0_0_10px_#60a5fa]" />
              </motion.div>

              {/* Central Glowing AI Neural Brain Sphere */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    '0 0 25px rgba(6,182,212,0.4)',
                    '0 0 45px rgba(6,182,212,0.7)',
                    '0 0 25px rgba(6,182,212,0.4)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-900 via-blue-900 to-slate-900 border-2 border-cyan-400 flex flex-col items-center justify-center text-center shadow-[0_0_35px_rgba(6,182,212,0.5)]"
              >
                <motion.span
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-black tracking-wider text-cyan-300 drop-shadow-[0_0_10px_#22d3ee]"
                >
                  AI
                </motion.span>
                <span className="text-[7px] font-mono uppercase tracking-widest text-cyan-400/80">
                  NEURAL CORE
                </span>
              </motion.div>

              {/* Floating Document Hologram Badges with Smooth Bobbing */}
              {/* PDF Document Badge */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotate: [-2, 2, -2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-4 p-3 rounded-2xl bg-[#091e48]/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md flex flex-col items-center w-16"
              >
                <FileText className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-[9px] font-mono font-bold text-cyan-300 tracking-wider">
                  PDF
                </span>
                <div className="w-8 h-1 bg-cyan-400/40 rounded-full mt-1" />
                <div className="w-5 h-0.5 bg-cyan-400/30 rounded-full mt-0.5" />
              </motion.div>

              {/* DOCX Document Badge */}
              <motion.div
                animate={{
                  y: [6, -6, 6],
                  rotate: [2, -2, 2]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute right-2 top-32 p-3 rounded-2xl bg-[#091e48]/90 border border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md flex flex-col items-center w-16"
              >
                <FileSpreadsheet className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-[9px] font-mono font-bold text-blue-300 tracking-wider">
                  DOCX
                </span>
                <div className="w-8 h-1 bg-blue-400/40 rounded-full mt-1" />
                <div className="w-5 h-0.5 bg-blue-400/30 rounded-full mt-0.5" />
              </motion.div>

              {/* TXT Document Badge */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  rotate: [-1, 1, -1]
                }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 right-6 p-3 rounded-2xl bg-[#091e48]/90 border border-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.3)] backdrop-blur-md flex flex-col items-center w-16"
              >
                <FileCode className="w-5 h-5 text-teal-400 mb-1" />
                <span className="text-[9px] font-mono font-bold text-teal-300 tracking-wider">
                  TXT
                </span>
                <div className="w-8 h-1 bg-teal-400/40 rounded-full mt-1" />
                <div className="w-5 h-0.5 bg-teal-400/30 rounded-full mt-0.5" />
              </motion.div>

              {/* Connecting Holographic Data Beams */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <line x1="50" y1="50" x2="80" y2="25" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
                <line x1="50" y1="50" x2="85" y2="50" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
                <line x1="50" y1="50" x2="80" y2="78" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
              </svg>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Credit: "Developed by SC TECH ❤️" */}
      <footer className="relative z-10 py-3 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-1">
        <span>Developed by</span>
        <span className="text-cyan-400 font-bold tracking-wider hover:text-cyan-300 transition-colors">
          SC TECH
        </span>
        <span className="text-rose-500 animate-pulse text-sm">❤️</span>
      </footer>
    </div>
  );
};
