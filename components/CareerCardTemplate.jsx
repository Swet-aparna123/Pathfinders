'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bookmark,
  BookmarkCheck,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatDate } from '@/lib/i18n/formatting';
import { userProfileService } from '@/lib/userProfileService';
import { createClient } from '@/lib/supabase/client';
import { getStudentMatchForCareer } from '@/lib/studentCareerMatch';
import { getRelatedCareerCards } from '@/lib/careerCardsData';
import CareerIllustration from './CareerIllustrations';
import Navbar from './Navbar';
import Footer from './Footer';

export default function CareerCardTemplate({ career, initialLang }) {
  const router = useRouter();
  const { language: contextLang, setLanguage, t } = useLanguage();
  const language = initialLang || contextLang;

  // Sync initial language if passed via server query param
  useEffect(() => {
    if (initialLang && initialLang !== contextLang) {
      setLanguage(initialLang);
    }
  }, [initialLang, contextLang, setLanguage]);

  // State management
  const [isSaved, setIsSaved] = useState(false);
  const [savedCareersUserId, setSavedCareersUserId] = useState(null);
  const [savedCareersLoading, setSavedCareersLoading] = useState(true);
  const [savingCareer, setSavingCareer] = useState(false);
  const [savedCareersError, setSavedCareersError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [studentMatch, setStudentMatch] = useState({ isVisible: false });
  const [userRole, setUserRole] = useState(null);

  const relatedCareers = getRelatedCareerCards(career?.slug);

  // Load saved state & calculate student RIASEC match
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const profile = userProfileService.getProfile();
    setUserRole(profile?.role || null);
    const match = getStudentMatchForCareer(career);
    setStudentMatch(match);

    let isCurrent = true;

    const loadSavedCareers = async () => {
      setIsSaved(false);
      setSavedCareersUserId(null);
      setSavedCareersError('');
      setSavedCareersLoading(true);

      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!isCurrent) return;

        if (!user) return;
        setSavedCareersUserId(user.id);

        const { data, error } = await supabase
          .from('saved_careers')
          .select('career_name')
          .eq('user_id', user.id);
        if (error) throw error;
        if (!isCurrent) return;

        setIsSaved(data?.some((savedCareer) => savedCareer.career_name === career?.slug) || false);
      } catch (error) {
        console.error('Failed to load saved careers:', error);
        if (isCurrent) setSavedCareersError('Could not load saved careers. Please try again.');
      } finally {
        if (isCurrent) setSavedCareersLoading(false);
      }
    };

    loadSavedCareers();

    return () => {
      isCurrent = false;
    };
  }, [career]);

  // Toast notifier
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle "Save to my list"
  const handleToggleSave = async () => {
    if (!savedCareersUserId) {
      showToast(savedCareersError || 'Please sign in to save careers.');
      return;
    }

    if (!career?.slug) {
      const message = 'Could not save this career because its identifier is missing.';
      setSavedCareersError(message);
      showToast(message);
      return;
    }

    setSavingCareer(true);
    setSavedCareersError('');

    try {
      const supabase = createClient();
      if (isSaved) {
        const { error } = await supabase
          .from('saved_careers')
          .delete()
          .eq('user_id', savedCareersUserId)
          .eq('career_name', career.slug);
        if (error) throw error;

        setIsSaved(false);
        showToast(`Removed ${career.title} from your list.`);
      } else {
        const { error } = await supabase
          .from('saved_careers')
          .upsert(
            {
              user_id: savedCareersUserId,
              career_name: career.slug,
              career_details: career,
            },
            { onConflict: 'user_id,career_name' }
          );
        if (error) throw error;

        setIsSaved(true);
        showToast(`Saved ${career.title} to your list!`);
      }
    } catch (error) {
      console.error('Error updating saved career:', error);
      const message = 'Could not update your saved careers. Please try again.';
      setSavedCareersError(message);
      showToast(message);
    } finally {
      setSavingCareer(false);
    }
  };

  // Open roadmap button action
  const handleOpenRoadmap = () => {
    try {
      localStorage.setItem('pathfinders_selected_roadmap_career', career.title);
      localStorage.setItem('pathfinders_selected_roadmap_slug', career.slug);
      showToast(`Selected ${career.title}! Opening your roadmap...`);
      setTimeout(() => {
        router.push(`/student-dashboard?tab=roadmap&career=${career.slug}`);
      }, 400);
    } catch {
      router.push('/student-dashboard');
    }
  };

  if (!career) return null;

  const isDraft = career.reviewStatus === 'draft';
  const isAdmin = userRole === 'admin' || userRole === 'staff';

  return (
    <div className="min-h-screen bg-parchment text-charcoal font-body antialiased selection:bg-brass selection:text-ink">
      {/* Top Global Navigation Bar */}
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[120] max-w-sm rounded-xl border border-brass-bright/50 bg-ink px-4 py-3 text-parchment font-mono text-xs shadow-2xl transition-all"
        >
          {toastMessage}
        </div>
      )}

      {/* Draft Banner (Shown clearly to admins, and informing preview visitors) */}
      {isDraft && (
        <aside
          aria-label="Draft Notice"
          className="bg-amber-950/90 text-amber-200 border-b border-amber-800/80 px-4 py-2.5 text-xs font-mono text-center flex items-center justify-center gap-2"
        >
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <strong>{t('careerCard.draftBanner', {}, 'Draft content, not yet reviewed')}:</strong>{' '}
            {t(
              'careerCard.draftNoticeAdmin',
              {},
              'This entry is marked as draft until every figure and institute is verified.'
            )}
          </span>
        </aside>
      )}

      <main>
        {/* ======================================================== */}
        {/* HEADER: DARK INK PANEL                                   */}
        {/* ======================================================== */}
        <section
          aria-labelledby="career-title"
          className="bg-ink text-parchment px-4 py-10 sm:px-8 sm:py-14 border-b border-parchment/15"
        >
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb / Back Link */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.history.length > 1) {
                    router.back();
                  } else {
                    router.push('/student-dashboard?tab=careers');
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-fog/75 hover:text-brass-bright transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brass-bright rounded px-2 cursor-pointer bg-transparent border-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{t('careerCard.backToDashboard', {}, 'Back to dashboard')}</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {language !== 'en' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-brass/20 text-brass-bright border border-brass/40">
                    {t('careerCard.availableEnglishOnly', {}, 'Available in English only')}
                  </span>
                )}
                {isDraft && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Draft
                  </span>
                )}
              </div>
            </div>

            {/* Header Content & Illustration Grid */}
            <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 items-center">
              {/* Left: Titles & Summary */}
              <div className="min-[900px]:col-span-8 space-y-4">
                {/* Small Mono Label */}
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brass-bright">
                  <span>{career.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t('careerCard.badge', {}, 'Career card')}</span>
                </div>

                {/* Large Serif Title */}
                <h1
                  id="career-title"
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-parchment leading-tight"
                >
                  {career.title}
                </h1>

                {/* Two-Line Summary */}
                <p className="text-fog/90 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                  {career.summary || career.tagline}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex items-center flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleToggleSave}
                    disabled={savedCareersLoading || savingCareer}
                    aria-busy={savedCareersLoading || savingCareer}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-mono uppercase tracking-wider min-h-[44px] min-w-[44px] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brass-bright ${
                      isSaved
                        ? 'bg-brass text-ink-deep font-bold border border-brass-bright shadow-md'
                        : 'bg-transparent text-parchment border border-parchment/30 hover:border-brass-bright hover:text-brass-bright'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    <span>
                      {isSaved
                        ? t('careerCard.savedToList', {}, 'Saved to list')
                        : t('careerCard.saveToList', {}, 'Save to my list')}
                    </span>
                  </button>

                  {savedCareersLoading && (
                    <p role="status" className="w-full text-xs font-mono text-fog/75">
                      Loading saved careers...
                    </p>
                  )}
                  {!savedCareersLoading && savedCareersError && (
                    <p role="alert" className="w-full text-xs font-mono text-amber-300">
                      {savedCareersError}
                    </p>
                  )}
                  {!savedCareersLoading && !savedCareersError && !savedCareersUserId && (
                    <p role="status" className="w-full text-xs font-mono text-fog/75">
                      Sign in to save careers to your account.
                    </p>
                  )}
                  {savingCareer && (
                    <p role="status" className="w-full text-xs font-mono text-fog/75">
                      Updating saved careers...
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleOpenRoadmap}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-mono uppercase tracking-wider bg-brass-bright text-ink-deep font-bold border border-brass-bright min-h-[44px] min-w-[44px] hover:bg-yellow-400 transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-parchment"
                  >
                    <Compass className="h-4 w-4" />
                    <span>{t('careerCard.openRoadmap', {}, 'Open roadmap')}</span>
                  </button>
                </div>
              </div>

              {/* Right: Technical Brass Line Illustration */}
              <div className="min-[900px]:col-span-4 flex items-center justify-center min-[900px]:justify-end">
                <div className="p-4 rounded-2xl border border-parchment/15 bg-ink-deep/60 flex items-center justify-center">
                  <CareerIllustration slug={career.slug} className="w-48 h-40 sm:w-56 sm:h-48" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* WHY THIS FITS YOU STRIP (Logged-in students only)       */}
        {/* ======================================================== */}
        {studentMatch.isVisible && (
          <aside
            aria-label="Personalized student compatibility analysis"
            className="bg-[#141f36] text-parchment border-b border-brass/40 px-4 py-4 sm:px-8"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-brass-bright/60 bg-brass/20 flex items-center justify-center shrink-0">
                  <span className="font-mono text-sm font-bold text-brass-bright">
                    {studentMatch.matchPct}%
                  </span>
                </div>
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-wider text-brass-bright font-bold">
                    {t('careerCard.whyFitsYou', {}, 'Why this fits you')}
                  </h2>
                  <p className="text-xs sm:text-sm text-fog/90">
                    {t(
                      'careerCard.topInterestsMatch',
                      { traits: studentMatch.traitLabel },
                      `Your top interest types: ${studentMatch.traitLabel} match this pathway`
                    )}
                  </p>
                </div>
              </div>

              <Link
                href="/student-dashboard"
                className="text-xs font-mono text-brass-bright hover:underline inline-flex items-center gap-1 min-h-[44px] px-2 focus:outline-none focus:ring-1 focus:ring-brass-bright rounded"
              >
                <span>View Holland RIASEC Profile</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        )}

        {/* ======================================================== */}
        {/* AT-A-GLANCE STRIP (Parchment: 4 key facts)              */}
        {/* ======================================================== */}
        {career.glanceStats && (
          <section
            aria-labelledby="at-a-glance-heading"
            className="bg-parchment border-b border-parchment-dim px-4 py-6 sm:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <h2 id="at-a-glance-heading" className="sr-only">
                {t('careerCard.atAGlance', {}, 'At a glance')}
              </h2>

              {/* Responsive: 2x2 below 900px, 4x1 at 900px and above */}
              <div className="grid grid-cols-2 min-[900px]:grid-cols-4 gap-4 sm:gap-6">
                {/* 1. Entry Salary */}
                <div className="p-4 rounded-xl border border-parchment-dim bg-[#fbf7ee]">
                  <span className="block font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold mb-1">
                    {t('careerCard.entrySalary', {}, 'Entry Salary')}
                  </span>
                  <div className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                    {career.glanceStats.entrySalary}
                  </div>
                  {career.glanceStats.entrySalaryNote && (
                    <span className="block font-mono text-[11px] text-[#7A5200]">
                      {career.glanceStats.entrySalaryNote}
                    </span>
                  )}
                </div>

                {/* 2. Degree Length */}
                <div className="p-4 rounded-xl border border-parchment-dim bg-[#fbf7ee]">
                  <span className="block font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold mb-1">
                    {t('careerCard.degreeLength', {}, 'Degree Length')}
                  </span>
                  <div className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                    {career.glanceStats.degreeLength}
                  </div>
                </div>

                {/* 3. Study Route */}
                <div className="p-4 rounded-xl border border-parchment-dim bg-[#fbf7ee]">
                  <span className="block font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold mb-1">
                    {t('careerCard.studyRoute', {}, 'Study Route')}
                  </span>
                  <div className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                    {career.glanceStats.studyRoute}
                  </div>
                </div>

                {/* 4. Demand */}
                <div className="p-4 rounded-xl border border-parchment-dim bg-[#fbf7ee]">
                  <span className="block font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold mb-1">
                    {t('careerCard.demand', {}, 'Demand')}
                  </span>
                  <div className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                    {career.glanceStats.demand}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TWO-COLUMN BODY (Below 900px becomes one column)         */}
        {/* ======================================================== */}
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-8">
          <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 items-start">
            {/* ---------------------------------------------------- */}
            {/* LEFT COLUMN: 01, 02, 03                              */}
            {/* ---------------------------------------------------- */}
            <div className="min-[900px]:col-span-7 space-y-10">
              {/* 01 Who it suits (four traits) */}
              {career.traits && career.traits.length > 0 && (
                <section aria-labelledby="section-who-it-suits" className="space-y-4">
                  <div className="border-b border-parchment-dim pb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                      01
                    </span>
                    <h2
                      id="section-who-it-suits"
                      className="font-serif text-xl sm:text-2xl font-bold text-charcoal"
                    >
                      {t('careerCard.whoItSuits', {}, 'Who it suits')}
                    </h2>
                  </div>

                  <ul className="space-y-3" role="list">
                    {career.traits.map((trait, idx) => (
                      <li
                        key={idx}
                        className="p-4 rounded-xl border border-parchment-dim bg-[#fbf7ee] flex items-start gap-3"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-parchment-dim text-[#7A5200] font-mono text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm sm:text-base leading-relaxed text-charcoal">
                          {trait}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 02 Pathway (one or more routes as vertical timelines) */}
              {career.pathwayRoutes && career.pathwayRoutes.length > 0 && (
                <section aria-labelledby="section-pathway" className="space-y-6">
                  <div className="border-b border-parchment-dim pb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                      02
                    </span>
                    <h2
                      id="section-pathway"
                      className="font-serif text-xl sm:text-2xl font-bold text-charcoal"
                    >
                      {t('careerCard.pathway', {}, 'Pathway')}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {career.pathwayRoutes.map((route, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-5 sm:p-6 rounded-2xl border border-parchment-dim bg-[#fbf7ee] space-y-4"
                      >
                        <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal">
                          {route.name}
                        </h3>

                        {/* Vertical Timeline */}
                        <ol className="relative border-l border-brass/50 ml-3 space-y-6 py-2" role="list">
                          {route.steps.map((step, sIdx) => (
                            <li key={sIdx} className="ml-5 relative">
                              <span
                                aria-hidden="true"
                                className="absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brass border-2 border-parchment"
                              />
                              <h4 className="font-bold text-sm sm:text-base text-charcoal">
                                {step.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                                {step.detail}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 03 Entrance exams (as pills) */}
              {career.entranceExams && career.entranceExams.length > 0 && (
                <section aria-labelledby="section-entrance-exams" className="space-y-4">
                  <div className="border-b border-parchment-dim pb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                      03
                    </span>
                    <h2
                      id="section-entrance-exams"
                      className="font-serif text-xl sm:text-2xl font-bold text-charcoal"
                    >
                      {t('careerCard.entranceExams', {}, 'Entrance exams')}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {career.entranceExams.map((exam, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-2 rounded-full border border-parchment-dim bg-[#fbf7ee] text-xs sm:text-sm font-semibold text-charcoal"
                      >
                        {typeof exam === 'string' ? exam : (
                          <>
                            {exam.name}
                            {exam.frequency && <span className="ml-1 font-normal text-stone-600">({exam.frequency})</span>}
                          </>
                        )}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT COLUMN: 04, 05, 06                             */}
            {/* ---------------------------------------------------- */}
            <div className="min-[900px]:col-span-5 space-y-8">
              {/* 04 Fees and pay (parchment box) */}
              {(career.feeNote || career.payNote) && (
                <section
                  aria-labelledby="section-fees-and-pay"
                  className="p-5 sm:p-6 rounded-2xl border border-parchment-dim bg-[#fbf7ee] space-y-4"
                >
                  <div className="border-b border-parchment-dim pb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                      04
                    </span>
                    <h2
                      id="section-fees-and-pay"
                      className="font-serif text-xl font-bold text-charcoal"
                    >
                      {t('careerCard.feesAndPay', {}, 'Fees and pay')}
                    </h2>
                  </div>

                  {career.feeNote && (
                    <div className="space-y-1">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold block">
                        {t('careerCard.feesNote', {}, 'Fees Note')}
                      </span>
                      <p className="text-sm leading-relaxed text-charcoal">{career.feeNote}</p>
                    </div>
                  )}

                  {career.payNote && (
                    <div className="space-y-1 pt-2 border-t border-parchment-dim">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold block">
                        {t('careerCard.payNote', {}, 'Pay Note')}
                      </span>
                      <p className="text-sm leading-relaxed text-charcoal">{career.payNote}</p>
                    </div>
                  )}

                  <span className="block font-mono text-[11px] text-[#7A5200] pt-2">
                    {t(
                      'careerCard.indicativeNote',
                      {},
                      'Every salary, fee and eligibility figure carries an indicative note. Verify before publishing.'
                    )}
                  </span>
                </section>
              )}

              {/* 05 Scholarships and loans (dark box with light text) */}
              {career.scholarships && career.scholarships.length > 0 && (
                <section
                  aria-labelledby="section-scholarships-loans"
                  className="p-5 sm:p-6 rounded-2xl border border-parchment/20 bg-ink text-parchment space-y-4"
                >
                  <div className="border-b border-parchment/15 pb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-brass-bright font-bold">
                      05
                    </span>
                    <h2
                      id="section-scholarships-loans"
                      className="font-serif text-xl font-bold text-parchment"
                    >
                      {t('careerCard.scholarshipsLoans', {}, 'Scholarships and loans')}
                    </h2>
                  </div>

                  <ul className="space-y-3.5" role="list">
                    {career.scholarships.map((item, idx) => (
                      <li key={idx} className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-sm text-parchment font-semibold">{item.name}</strong>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Official portal for ${item.name}`}
                              className="text-xs font-mono text-brass-bright hover:underline inline-flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center focus:outline-none focus:ring-1 focus:ring-brass-bright rounded"
                            >
                              <span>{t('careerCard.officialSite', {}, 'Official site')}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-fog/80 leading-relaxed">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 06 Where you'll work */}
              {(career.workplaces?.length > 0 || career.workEnvironment || career.accessibilityNote) && (
                <section
                  aria-labelledby="section-where-you-work"
                  className="p-5 sm:p-6 rounded-2xl border border-parchment-dim bg-[#fbf7ee] space-y-4"
                >
                  <div className="border-b border-parchment-dim pb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                      06
                    </span>
                    <h2
                      id="section-where-you-work"
                      className="font-serif text-xl font-bold text-charcoal"
                    >
                      {t('careerCard.whereYouWork', {}, "Where you'll work")}
                    </h2>
                  </div>

                  {career.workplaces && career.workplaces.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold block">
                        {t('careerCard.workplaces', {}, 'Workplaces')}
                      </span>
                      <ul className="space-y-1.5 list-disc list-inside text-sm text-stone-800" role="list">
                        {career.workplaces.map((place, idx) => (
                          <li key={idx}>{place}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {career.workEnvironment && (
                    <div className="space-y-1 pt-2 border-t border-parchment-dim">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold block">
                        {t('careerCard.workEnvironment', {}, 'Work environment')}
                      </span>
                      <p className="text-sm leading-relaxed text-stone-800">
                        {career.workEnvironment}
                      </p>
                    </div>
                  )}

                  {career.accessibilityNote && (
                    <div className="space-y-1 pt-2 border-t border-parchment-dim">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold block">
                        {t('careerCard.accessibilityNote', {}, 'Accessibility')}
                      </span>
                      <p className="text-xs leading-relaxed text-stone-700">
                        {career.accessibilityNote}
                      </p>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* FULL-WIDTH LOWER SECTIONS: 07, 08, 09                    */}
          {/* ======================================================== */}
          <div className="mt-14 space-y-12">
            {/* 07 Growth (chain of roles plus common specialisations) */}
            {(career.growthChain?.length > 0 || career.specialisations?.length > 0) && (
              <section
                aria-labelledby="section-growth"
                className="p-6 sm:p-8 rounded-3xl border border-parchment-dim bg-[#fbf7ee] space-y-6"
              >
                <div className="border-b border-parchment-dim pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                    07
                  </span>
                  <h2
                    id="section-growth"
                    className="font-serif text-2xl font-bold text-charcoal"
                  >
                    {t('careerCard.growth', {}, 'Growth')}
                  </h2>
                </div>

                {/* Chain of roles */}
                {career.growthChain && career.growthChain.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold block">
                      {t('careerCard.growthLadder', {}, 'Career Growth Ladder')}
                    </span>
                    <ol className="flex flex-wrap items-center gap-2 pt-1" role="list">
                      {career.growthChain.map((role, idx) => (
                        <li key={idx} className="flex items-center gap-2 flex-wrap">
                          <span className="px-4 py-2 rounded-xl bg-parchment border border-parchment-dim text-sm font-semibold text-charcoal shadow-xs">
                            {role}
                          </span>
                          {idx < career.growthChain.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-brass shrink-0" aria-hidden="true" />
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Specialisations */}
                {career.specialisations && career.specialisations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-parchment-dim">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold block">
                      {t('careerCard.specialisations', {}, 'Specialisations')}
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {career.specialisations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-full border border-brass/40 bg-brass/10 text-xs font-semibold text-[#7A5200]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 08 Where to study (government and private lists side by side) */}
            {career.institutes && (
              <section
                aria-labelledby="section-where-to-study"
                className="p-6 sm:p-8 rounded-3xl border border-parchment-dim bg-[#fbf7ee] space-y-6"
              >
                <div className="border-b border-parchment-dim pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                    08
                  </span>
                  <h2
                    id="section-where-to-study"
                    className="font-serif text-2xl font-bold text-charcoal"
                  >
                    {t('careerCard.whereToStudy', {}, 'Where to study')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Government Institutes */}
                  {career.institutes.government && career.institutes.government.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{t('careerCard.governmentInstitutes', {}, 'Government Institutes')}</span>
                      </h3>
                      <ul className="space-y-2" role="list">
                        {career.institutes.government.map((inst, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-xl border border-parchment-dim bg-parchment text-sm text-charcoal font-medium"
                          >
                            {typeof inst === 'string' ? inst : (
                              <>
                                <span>{inst.name}</span>
                                {inst.location && <span className="block text-xs text-stone-600">{inst.location}</span>}
                                {inst.flagshipProgram && <span className="block text-xs text-stone-600">{inst.flagshipProgram}</span>}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Private Institutes */}
                  {career.institutes.private && career.institutes.private.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>{t('careerCard.privateInstitutes', {}, 'Private Institutes')}</span>
                      </h3>
                      <ul className="space-y-2" role="list">
                        {career.institutes.private.map((inst, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-xl border border-parchment-dim bg-parchment text-sm text-charcoal font-medium"
                          >
                            {typeof inst === 'string' ? inst : (
                              <>
                                <span>{inst.name}</span>
                                {inst.location && <span className="block text-xs text-stone-600">{inst.location}</span>}
                                {inst.flagshipProgram && <span className="block text-xs text-stone-600">{inst.flagshipProgram}</span>}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Accreditation & Fee Confirmation Note */}
                <p className="text-xs text-stone-600 border-t border-parchment-dim pt-4 font-mono leading-relaxed">
                  {t(
                    'careerCard.accreditationNote',
                    {},
                    'Always confirm accreditation, university affiliation and approved fee structures directly on the official institute portals.'
                  )}
                </p>
              </section>
            )}

            {/* 09 Honest view (pros and challenges in two boxes) */}
            {(career.pros?.length > 0 || career.challenges?.length > 0) && (
              <section aria-labelledby="section-honest-view" className="space-y-6">
                <div className="border-b border-parchment-dim pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#7A5200] font-bold">
                    09
                  </span>
                  <h2
                    id="section-honest-view"
                    className="font-serif text-2xl font-bold text-charcoal"
                  >
                    {t('careerCard.honestView', {}, 'Honest view')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Pros Box */}
                  {career.pros && career.pros.length > 0 && (
                    <div className="p-6 rounded-3xl border border-parchment-dim bg-[#fbf7ee] space-y-4">
                      <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-700" />
                        <span>{t('careerCard.pros', {}, "What's Rewarding (Pros)")}</span>
                      </h3>
                      <ul className="space-y-2.5" role="list">
                        {career.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-stone-800 leading-relaxed flex items-start gap-2">
                            <span aria-hidden="true" className="text-emerald-700 font-bold">·</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Challenges Box */}
                  {career.challenges && career.challenges.length > 0 && (
                    <div className="p-6 rounded-3xl border border-parchment-dim bg-[#fbf7ee] space-y-4">
                      <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-700" />
                        <span>{t('careerCard.challenges', {}, "What's Demanding (Challenges)")}</span>
                      </h3>
                      <ul className="space-y-2.5" role="list">
                        {career.challenges.map((challenge, idx) => (
                          <li key={idx} className="text-sm text-stone-800 leading-relaxed flex items-start gap-2">
                            <span aria-hidden="true" className="text-amber-700 font-bold">·</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Related Careers */}
            {relatedCareers.length > 0 && (
              <section aria-labelledby="section-related-careers" className="space-y-6 pt-4">
                <div className="border-b border-parchment-dim pb-3">
                  <h2
                    id="section-related-careers"
                    className="font-serif text-2xl font-bold text-charcoal"
                  >
                    {t('careerCard.relatedCareers', {}, 'Related Careers')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {relatedCareers.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/careers/${rel.slug}`}
                      className="group p-5 rounded-2xl border border-parchment-dim bg-[#fbf7ee] hover:border-brass hover:bg-parchment transition-all flex flex-col justify-between space-y-3 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-brass"
                    >
                      <div className="space-y-1.5">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#7A5200] font-bold">
                          {rel.category}
                        </span>
                        <h3 className="font-serif font-bold text-base text-charcoal group-hover:text-[#7A5200] transition-colors">
                          {rel.title}
                        </h3>
                        <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                          {rel.tagline}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-brass group-hover:text-charcoal">
                        <span>View career card</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Review Governance & Indicative Disclaimer Footer Strip */}
            <footer className="pt-8 border-t border-parchment-dim text-xs font-mono text-stone-500 flex flex-wrap items-center justify-between gap-4">
              {career.lastReviewedDate && (
                <span>
                  {t(
                    'careerCard.lastReviewed',
                    { date: formatDate(career.lastReviewedDate, language) },
                    `Last reviewed: ${formatDate(career.lastReviewedDate, language)}`
                  )}
                </span>
              )}

              <span>
                {t(
                  'careerCard.indicativeNote',
                  {},
                  'Every salary, fee and eligibility figure carries an indicative note. Verify before publishing.'
                )}
              </span>
            </footer>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
