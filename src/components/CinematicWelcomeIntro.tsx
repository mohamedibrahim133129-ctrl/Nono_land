import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  FastForward,
  Languages,
  Lock,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NonoLandLogo } from './NonoLandLogo';
import { useNonoLand } from '../context/NonoLandContext';
import { UNIFIED_STAGE_AGE_RANGE, UNIFIED_STAGE_NAME } from '../utils/ageAdaptation';
import { soundEngine } from '../utils/soundEngine';

export const INTRO_SKIP_STORAGE_KEY = 'nonoland_skip_intro_v1';

const MAGICAL_PARTICLES = [
  { x: '16%', delay: '0s', duration: '4.6s', size: 7, color: '#FFD84D' },
  { x: '28%', delay: '-1.4s', duration: '5.2s', size: 5, color: '#39BDF2' },
  { x: '42%', delay: '-0.7s', duration: '4.2s', size: 8, color: '#FFD84D' },
  { x: '56%', delay: '-2.3s', duration: '5.4s', size: 6, color: '#FF78B7' },
  { x: '70%', delay: '-1.1s', duration: '4.8s', size: 7, color: '#55D98B' },
  { x: '84%', delay: '-2.9s', duration: '5.0s', size: 5, color: '#FFD84D' },
];

const SKY_STARS = [
  { top: '8%', left: '9%', size: 14, color: '#FFD84D', delay: '0s' },
  { top: '14%', left: '84%', size: 16, color: '#39BDF2', delay: '-0.9s' },
  { top: '28%', left: '46%', size: 10, color: '#FFD84D', delay: '-1.8s' },
  { top: '72%', left: '7%', size: 12, color: '#FF78B7', delay: '-1.3s' },
  { top: '78%', left: '91%', size: 14, color: '#55D98B', delay: '-0.4s' },
  { top: '54%', left: '95%', size: 10, color: '#FFD84D', delay: '-2.2s' },
];

export const CinematicWelcomeIntro: React.FC = () => {
  const {
    navigate,
    language,
    setLanguage,
    parentSettings,
    updateParentSettings,
    authSession,
  } = useNonoLand();

  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    try {
      return localStorage.getItem(INTRO_SKIP_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [bookPulseKey, setBookPulseKey] = useState(0);

  const osReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduced = Boolean(parentSettings.reducedMotion) || osReducedMotion;
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const destinationAfterIntro = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(INTRO_SKIP_STORAGE_KEY, 'true');
      } catch {
        // ignore storage quota errors
      }
    }
    soundEngine.playPop();
    if (authSession.authenticated && authSession.user) {
      const role = authSession.user.role;
      if (role === 'teacher') return navigate('teacher-dashboard');
      if (role === 'student') return navigate('exams');
      if (
        role === 'super_admin' ||
        role === 'content_admin' ||
        role === 'curriculum_manager' ||
        role === 'finance_admin' ||
        role === 'support_agent'
      ) {
        return navigate('admin-dashboard');
      }
      return navigate('home');
    }
    navigate('parent-auth');
  };

  // Respect authenticated session or saved "Don't show intro again" preference immediately
  useEffect(() => {
    if (authSession.authenticated) {
      destinationAfterIntro();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authSession.authenticated]);

  const toggleDontShow = (checked: boolean) => {
    setDontShowAgain(checked);
    try {
      if (checked) localStorage.setItem(INTRO_SKIP_STORAGE_KEY, 'true');
      else localStorage.removeItem(INTRO_SKIP_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleBookTap = () => {
    soundEngine.playMusicNote(bookPulseKey % 5);
    setBookPulseKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0F183E] via-[#1D2D6E] to-[#4A2B93] text-white flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-5 sm:py-7">
      {/* Atmospheric Storybook Sky, Distant Clouds & Twinkling Stars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Soft celestial nebulae */}
        <div className="absolute -top-36 -start-24 w-[32rem] h-[32rem] rounded-full bg-[#39BDF2]/18 blur-3xl" />
        <div className="absolute -bottom-36 -end-24 w-[34rem] h-[34rem] rounded-full bg-[#FF78B7]/14 blur-3xl" />
        <div className="hidden lg:block absolute top-1/3 start-1/2 -translate-x-1/2 w-[26rem] h-[26rem] rounded-full bg-[#FFD84D]/8 blur-3xl" />

        {/* Soft Drifting Clouds */}
        <div className="hidden md:block absolute top-20 start-[6%] w-44 h-14 rounded-full bg-white/[0.06] blur-[2px] animate-drift-cloud" />
        <div
          className="hidden md:block absolute top-28 end-[8%] w-56 h-16 rounded-full bg-white/[0.05] blur-[2px] animate-drift-cloud"
          style={{ animationDelay: '-5s' }}
        />

        {/* Twinkling Four-Point Stars */}
        {SKY_STARS.map((st, idx) => (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            className="absolute animate-twinkle"
            style={{
              top: st.top,
              left: st.left,
              width: st.size,
              height: st.size,
              animationDelay: st.delay,
            }}
          >
            <path
              d="M12 1.5 L14.4 9.6 L22.5 12 L14.4 14.4 L12 22.5 L9.6 14.4 L1.5 12 L9.6 9.6 Z"
              fill={st.color}
              opacity="0.88"
            />
          </svg>
        ))}
      </div>

      {/* Top Bar: Clean 3-Control Navigation Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        <NonoLandLogo variant="compact" size="md" tone="dark" language={language} />

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => updateParentSettings({ muted: !parentSettings.muted })}
            aria-label={parentSettings.muted ? 'Unmute intro audio' : 'Mute intro audio'}
            className="min-h-[44px] px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/18 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D]"
          >
            {parentSettings.muted ? (
              <VolumeX className="w-4 h-4 text-[#FF9360]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#FFD84D]" />
            )}
            <span className="hidden sm:inline">
              {parentSettings.muted
                ? language === 'ar'
                  ? 'صامت'
                  : 'Muted'
                : language === 'ar'
                  ? 'الصوت'
                  : 'Sound'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            aria-label="Toggle Arabic/English"
            className="min-h-[44px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/18 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D]"
          >
            <Languages className="w-4 h-4 text-[#FFD84D]" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={destinationAfterIntro}
            className="min-h-[44px] px-4 rounded-xl bg-white/16 hover:bg-white/28 border border-white/28 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D]"
          >
            <FastForward className="w-4 h-4 text-[#FFD84D]" />
            <span>{language === 'ar' ? 'تخطي المقدمة' : 'Skip Intro'}</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Split Stage (Right Content + Left Magical Book Portal in RTL) */}
      <main className="relative z-10 max-w-7xl w-full mx-auto my-auto py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* CONTENT AREA (Right side in Arabic RTL, Left side in English LTR) */}
          <motion.section
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-5 text-center lg:text-start order-2 lg:order-1"
          >
            {/* Unboxed Editorial Kicker (Zero pill clutter) */}
            <p className="text-xs sm:text-sm font-extrabold text-[#FFD84D] tracking-normal">
              {language === 'ar'
                ? 'عالم تعليمي تفاعلي للأطفال من سنة إلى ٤ سنوات · المستكشفون الصغار'
                : `Interactive Educational World for Ages 1 to 4 · ${UNIFIED_STAGE_NAME.en}`}
            </p>

            {/* Primary Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-[3.35rem] font-extrabold leading-[1.22] text-balance text-white">
              {language === 'ar'
                ? 'كل طفل جواه عالم من الخيال!'
                : 'Every Child Holds a World of Imagination!'}
            </h1>

            {/* Supporting Headline */}
            <p className="text-base sm:text-xl text-white/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              {language === 'ar'
                ? 'في NonoLand، كل يوم مغامرة جديدة للتعلم واللعب والاكتشاف.'
                : 'At NonoLand, every day is a new adventure to learn, play, and discover.'}
            </p>

            {/* Clear Target Audience Label & Unified Stage */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 text-sm font-extrabold text-[#8CE7FF]">
              <span>
                {language === 'ar'
                  ? 'مصمم للأطفال من سنة إلى ٤ سنوات'
                  : 'Designed for Ages 1 to 4 Years'}
              </span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span className="text-white/80 font-bold">
                {UNIFIED_STAGE_NAME[language]} ({UNIFIED_STAGE_AGE_RANGE[language]})
              </span>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={destinationAfterIntro}
                className="nono-btn-tactile min-h-[54px] px-8 rounded-2xl bg-[#FFD84D] hover:bg-[#ffe16e] text-[#1A2447] text-base sm:text-lg font-extrabold flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Sparkles className="w-5 h-5 shrink-0" />
                <span>{language === 'ar' ? 'هيا نكتشف!' : "Let's Explore!"}</span>
                <ArrowIcon className="w-5 h-5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  navigate('onboarding');
                }}
                className="min-h-[54px] px-6 rounded-2xl bg-white/12 hover:bg-white/22 border border-white/30 text-white text-base font-extrabold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D]"
              >
                <Compass className="w-5 h-5 text-[#39BDF2] shrink-0" />
                <span>{language === 'ar' ? 'جولة تعريفية' : 'Guided Tour'}</span>
              </button>
            </div>

            {/* Quiet Unboxed Learning Pillars */}
            <div className="pt-4 border-t border-white/12 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm font-bold text-white/75">
              <span>{language === 'ar' ? 'حروف وأصوات' : 'Letters & Phonics'}</span>
              <span aria-hidden="true" className="text-[#FFD84D]">
                ·
              </span>
              <span>{language === 'ar' ? 'ألوان وأرقام' : 'Colors & Counting'}</span>
              <span aria-hidden="true" className="text-[#FFD84D]">
                ·
              </span>
              <span>{language === 'ar' ? 'قصص ومختبر نونو' : "Stories & Nono's Lab"}</span>
            </div>
          </motion.section>

          {/* VISUAL AREA (Left side in Arabic RTL, Right side in English LTR) */}
          <motion.section
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-[33rem] mx-auto px-2 pt-3 pb-4">
              {/* Soft Ambient Book Glow Aura */}
              <div
                className="pointer-events-none absolute inset-x-6 top-6 bottom-10 rounded-[3rem] bg-gradient-to-tr from-[#39BDF2]/45 via-[#FFD84D]/35 to-[#FF78B7]/35 blur-2xl animate-magical-glow"
                aria-hidden="true"
              />

              {/* Subtle Castle Silhouette & Rainbow Halo Framing */}
              <div
                className="pointer-events-none absolute inset-x-2 -top-3 flex justify-center opacity-55"
                aria-hidden="true"
              >
                <svg viewBox="0 0 420 90" className="w-72 sm:w-88 h-auto">
                  <path
                    d="M40 84 Q210 4 380 84"
                    fill="none"
                    stroke="#FFD84D"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    opacity="0.7"
                  />
                  <path
                    d="M65 86 Q210 18 355 86"
                    fill="none"
                    stroke="#39BDF2"
                    strokeWidth="2"
                    opacity="0.55"
                  />
                </svg>
              </div>

              {/* Rising Magical Light Particles Emerging From The Book */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-8 top-0 overflow-hidden z-20"
                aria-hidden="true"
              >
                {MAGICAL_PARTICLES.map((p, idx) => (
                  <span
                    key={idx}
                    className="absolute bottom-14 rounded-full animate-float-particle"
                    style={{
                      left: p.x,
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                      boxShadow: `0 0 12px ${p.color}`,
                      animationDelay: p.delay,
                      animationDuration: p.duration,
                    }}
                  />
                ))}
              </div>

              {/* Storybook Showcase Container Housing the Approved NonoLand Artwork */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="animate-float-slow w-full flex justify-center">
                  <div className="relative rounded-[2rem] p-2 sm:p-3 bg-white/10 backdrop-blur-md border border-white/25 shadow-[0_24px_60px_-15px_rgba(9,15,44,0.65)]">
                    <NonoLandLogo
                      variant="main"
                      size="xl"
                      tone="dark"
                      showWordmark={false}
                      language={language}
                      className="[&>div]:w-full [&>div]:max-w-[26rem] sm:[&>div]:max-w-[28rem] [&>div]:shadow-xl"
                    />
                  </div>
                </div>

                {/* Interactive Glowing Open Magical Book Pedestal */}
                <button
                  type="button"
                  onClick={handleBookTap}
                  aria-label={
                    language === 'ar'
                      ? 'الكتاب السحري لنونو لاند — انقر لصوت موسيقي لطيف'
                      : 'NonoLand Magical Book — tap for a musical chime'
                  }
                  className="group relative -mt-4 w-72 sm:w-88 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD84D] rounded-2xl"
                >
                  <svg
                    viewBox="0 0 360 96"
                    className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-[1.02]"
                  >
                    <defs>
                      <radialGradient id="bookLightBeam" cx="50%" cy="20%" r="70%">
                        <stop offset="0%" stopColor="#FFE57F" stopOpacity="0.85" />
                        <stop offset="55%" stopColor="#39BDF2" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#39BDF2" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="bookCoverGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6D44C7" />
                        <stop offset="100%" stopColor="#3B2378" />
                      </linearGradient>
                      <linearGradient id="pageGradLeft" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FFF4D8" />
                        <stop offset="100%" stopColor="#FFFDF7" />
                      </linearGradient>
                      <linearGradient id="pageGradRight" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FFFDF7" />
                        <stop offset="100%" stopColor="#FFEFC8" />
                      </linearGradient>
                    </defs>
                    {/* Warm Upward Glow Cone */}
                    <ellipse cx="180" cy="24" rx="135" ry="22" fill="url(#bookLightBeam)" />
                    {/* Book Hardcover Base */}
                    <path
                      d="M28 48 Q104 68 180 62 Q256 68 332 48 L342 66 Q260 88 180 78 Q100 88 18 66 Z"
                      fill="url(#bookCoverGrad)"
                      stroke="#FFD84D"
                      strokeWidth="2.5"
                    />
                    {/* Left & Right Illuminated Open Pages */}
                    <path
                      d="M36 42 Q106 24 178 44 L178 62 Q106 54 32 52 Z"
                      fill="url(#pageGradLeft)"
                      stroke="#E9C97B"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M324 42 Q254 24 182 44 L182 62 Q254 54 328 52 Z"
                      fill="url(#pageGradRight)"
                      stroke="#E9C97B"
                      strokeWidth="1.5"
                    />
                    {/* Subtle Golden Story Lines */}
                    <path d="M68 42 Q115 34 156 45" stroke="#8054D9" strokeOpacity="0.35" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <path d="M64 49 Q115 43 156 52" stroke="#FF78B7" strokeOpacity="0.35" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <path d="M204 45 Q245 34 292 42" stroke="#39BDF2" strokeOpacity="0.4" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <path d="M204 52 Q245 43 296 49" stroke="#55D98B" strokeOpacity="0.4" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    {/* Center Spine Star Gem */}
                    <circle cx="180" cy="54" r="9" fill="#FFD84D" stroke="#27345C" strokeWidth="2" />
                    <circle cx="180" cy="54" r="3.5" fill="#FFFDF7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Quiet Accessible Footer */}
      <footer className="relative z-20 max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-white/75 pt-3 border-t border-white/12">
        <label className="inline-flex items-center gap-2 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => toggleDontShow(e.target.checked)}
            className="w-4 h-4 accent-[#FFD84D] rounded"
          />
          <span>
            {language === 'ar' ? 'لا تعرض هذه المقدمة مرة أخرى' : "Don't show this intro again"}
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <span>
            {language === 'ar'
              ? 'مساحة آمنة للأطفال (١–٤ سنوات) · بدون إعلانات'
              : 'Child-Safe Space (Ages 1–4) · Zero Ads'}
          </span>
          <button
            type="button"
            onClick={() => navigate('parent-auth')}
            className="min-h-[44px] inline-flex items-center gap-1.5 font-bold text-white/90 hover:text-[#FFD84D] underline cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'دخول الأهل' : 'Parent Sign In'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
