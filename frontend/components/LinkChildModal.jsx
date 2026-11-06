'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Copy,
  Check,
  Clock,
  Send,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  X,
  Sparkles,
  Lock,
  UserCheck,
  UserX,
  ExternalLink
} from 'lucide-react';
import { linkService } from '@/lib/linkService';

export default function LinkChildModal({ isOpen, onClose, onNotification }) {
  const [linkState, setLinkState] = useState(linkService.getState());
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'new'
  const [emailInput, setEmailInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationShown, setConfirmationShown] = useState(false);

  const modalRef = useRef(null);

  // Subscribe to linkService state updates
  useEffect(() => {
    const unsubscribe = linkService.subscribe((state) => {
      setLinkState(state);
    });
    return () => unsubscribe();
  }, []);

  // Trap focus and handle Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus into modal
    const timeout = setTimeout(() => {
      if (modalRef.current) {
        const firstInputOrButton = modalRef.current.querySelector('input, button');
        if (firstInputOrButton) firstInputOrButton.focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [isOpen, onClose]);

  // Handle Option 1: Email Request submission
  const handleSendEmailRequest = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsSubmitting(true);
    try {
      await linkService.createLinkRequestByEmail(emailInput.trim());
      setConfirmationShown(true);
    } catch (error) {
      onNotification?.(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Option 2: Generate Invite Link
  const handleGenerateInvite = async () => {
    setIsSubmitting(true);
    try {
      await linkService.createInviteLink();
    } catch (error) {
      onNotification?.(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy Invite Link to Clipboard
  const handleCopyLink = () => {
    if (!linkState.inviteUrl) return;
    navigator.clipboard.writeText(linkState.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (onNotification) {
      onNotification('ðŸ“‹ Invite link copied to clipboard!');
    }
  };

  // Handle Cancel Request
  const handleCancelRequest = async () => {
    setIsSubmitting(true);
    await linkService.cancelLinkRequest();
    setIsSubmitting(false);
    setConfirmationShown(false);
    if (onNotification) {
      onNotification('Cancelled pending link request.');
    }
  };

  // Handle Resend Request
  const handleResendRequest = async () => {
    setIsSubmitting(true);
    await linkService.resendLinkRequest();
    setIsSubmitting(false);
    if (onNotification) {
      onNotification('ðŸ”„ Link request notification resent to your child.');
    }
  };

  const handleUnlink = async () => {
    await linkService.unlinkChild();
    if (onNotification) {
      onNotification('Child account unlinked. Operating in Standalone Parent Mode.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="link-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#18202F] border border-[#B8860B]/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-[#F3EAD3] space-y-6 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-[#1C2536] border border-[#F3EAD3]/20 text-fog hover:text-[#F3EAD3] hover:border-[#B8860B] transition-all flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 border-b border-[#F3EAD3]/15 pb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B8860B] bg-[#B8860B]/15 text-[#B8860B] text-xl shadow-[0_0_15px_rgba(184,134,11,0.2)]">
              ðŸŽ“
            </span>
            <div>
              <h2 id="link-modal-title" className="font-serif font-bold text-xl text-[#F3EAD3] tracking-wide">
                Link Child Account
              </h2>
              <p className="text-xs text-fog/70 font-mono mt-0.5">
                Connect your child&apos;s PathFinders profile with student consent
              </p>
            </div>
          </div>

          {/* Warm Privacy Principle Note */}
          <div className="p-3.5 rounded-xl border border-[#B8860B]/30 bg-[#B8860B]/10 text-xs text-fog/90 space-y-1 font-body">
            <div className="font-semibold text-[#F3EAD3] flex items-center gap-1.5 font-mono text-[0.75rem]">
              <ShieldCheck className="h-4 w-4 text-[#B8860B]" />
              <span>Student Ownership &amp; Privacy First</span>
            </div>
            <p className="text-[0.72rem] leading-relaxed text-[#F3EAD3]/80">
              Your child always approves any account link request and chooses how much information to share with you. You can return to Standalone Parent Mode anytime.
            </p>
          </div>

          {/* ======================================================== */}
          {/* STATE 1: NOT LINKED (Select Option A or B) */}
          {/* ======================================================== */}
          {linkState.status === 'not_linked' && (
            <div className="space-y-5">
              {/* Option Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-[#141A26] p-1.5 rounded-xl border border-[#F3EAD3]/15 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('existing')}
                  className={`py-2.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer ${
                    activeTab === 'existing'
                      ? 'bg-[#B8860B] text-[#18202F] shadow-sm'
                      : 'text-fog hover:text-[#F3EAD3]'
                  }`}
                >
                  My child has an account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('new');
                    if (!linkState.inviteUrl) handleGenerateInvite();
                  }}
                  className={`py-2.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer ${
                    activeTab === 'new'
                      ? 'bg-[#B8860B] text-[#18202F] shadow-sm'
                      : 'text-fog hover:text-[#F3EAD3]'
                  }`}
                >
                  Doesn&apos;t have account yet
                </button>
              </div>

              {/* TAB A: Child Has Account (Enter Email) */}
              {activeTab === 'existing' && (
                <form onSubmit={handleSendEmailRequest} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-fog/80 mb-2">
                      Child&apos;s Registered PathFinders Email
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Child's Registered Email"
                      className="w-full rounded-xl border border-[#F3EAD3]/20 bg-[#141A26] px-4 py-3 text-sm text-[#F3EAD3] placeholder-fog/40 focus:border-[#B8860B] focus:outline-none font-mono"
                    />
                  </div>

                  {/* Always show uniform warm confirmation copy (no account enumeration leak) */}
                  <div className="p-3.5 rounded-xl border border-[#F3EAD3]/15 bg-[#141A26] text-xs text-fog/80 leading-relaxed font-mono">
                    â„¹ï¸ If this email belongs to a PathFinders student, we&apos;ve sent them a request. Your child will choose whether to approve and what to share.
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-[#F3EAD3]/20 text-fog hover:text-[#F3EAD3] text-xs font-mono font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !emailInput.trim()}
                      className="px-6 py-2.5 rounded-xl bg-[#B8860B] text-[#18202F] hover:bg-[#D9A548] disabled:opacity-50 text-xs font-mono font-bold shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Sending Request...' : 'Send Link Request'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB B: Child Doesn't Have Account (Generate Invite Link) */}
              {activeTab === 'new' && (
                <div className="space-y-4">
                  <p className="text-xs text-fog/80 leading-relaxed font-body">
                    Generate a personalized 7-day invite link for your child. When they register using this link, a parent connection request will be created automatically.
                  </p>

                  {linkState.inviteUrl ? (
                    <div className="space-y-3">
                      <label className="block text-[0.7rem] font-mono uppercase tracking-wider text-fog/70">
                        7-Day Student Invite URL
                      </label>
                      <div className="flex items-center gap-2 bg-[#141A26] border border-[#B8860B]/40 p-2.5 rounded-xl font-mono text-xs">
                        <span className="flex-1 truncate text-[#F3EAD3] text-[0.75rem]">
                          {linkState.inviteUrl}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 rounded-lg bg-[#B8860B] text-[#18202F] hover:bg-[#D9A548] font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-[#18202F]" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                      </div>

                      <div className="text-[0.68rem] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Valid for 7 days. Automatic connection created on signup.</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerateInvite}
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-[#B8860B] text-[#18202F] hover:bg-[#D9A548] text-xs font-mono font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate 7-Day Student Invite Link</span>
                    </button>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl border border-[#F3EAD3]/20 text-fog hover:text-[#F3EAD3] text-xs font-mono font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STATE 2: PENDING APPROVAL (Waiting Screen) */}
          {/* ======================================================== */}
          {linkState.status === 'pending' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Clock className="h-4 w-4 animate-spin text-amber-400" />
                    Waiting for Child Approval
                  </span>
                  <span className="text-[0.68rem] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    Pending
                  </span>
                </div>

                <p className="text-xs text-amber-100/90 leading-relaxed font-body">
                  We&apos;ve sent a link request to {linkState.childEmail ? <strong>{linkState.childEmail}</strong> : 'your child'}. Once your child logs into their PathFinders portal and approves the request, your portals will connect automatically.
                </p>

                {linkState.inviteUrl && (
                  <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300/80 truncate max-w-[240px]">Invite Code: {linkState.inviteCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="text-amber-300 hover:underline font-bold flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleCancelRequest}
                  className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 font-semibold"
                >
                  Cancel Request
                </button>
                <button
                  type="button"
                  onClick={handleResendRequest}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-[#B8860B]/50 bg-[#B8860B]/20 text-[#F3EAD3] hover:bg-[#B8860B]/30 font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Resend Notification</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STATE 3: DECLINED OR REVOKED */}
          {/* ======================================================== */}
          {linkState.status === 'declined' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-stone-500/30 bg-[#141A26] space-y-3 text-stone-200">
                <div className="flex items-center gap-2 font-serif text-base font-bold text-[#F3EAD3]">
                  <UserX className="h-5 w-5 text-amber-400" />
                  <span>Request Not Approved</span>
                </div>
                <p className="text-xs text-fog/90 leading-relaxed font-body">
                  The request wasn&apos;t approved this time. You can keep using standalone mode, and nothing you&apos;ve done is lost. Your parent assessment, mindsets, and counselling access remain completely intact.
                </p>
              </div>

              <div className="flex justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={async () => {
                    await linkService.cancelLinkRequest();
                    setActiveTab('existing');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#B8860B] text-[#18202F] hover:bg-[#D9A548] font-bold"
                >
                  Try Again (Send New Request)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#F3EAD3]/20 text-fog hover:text-[#F3EAD3] font-semibold"
                >
                  Continue in Standalone Mode
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STATE 4: LINKED */}
          {/* ======================================================== */}
          {linkState.status === 'linked' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 space-y-3 text-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-serif font-bold text-emerald-300 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-emerald-400" />
                    Connected with {linkState.childProfile.fullName}
                  </span>
                  <span className="text-[0.68rem] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold">
                    Connection Active
                  </span>
                </div>

                <div className="text-xs font-mono bg-[#141A26] p-3 rounded-xl border border-emerald-500/20 space-y-1">
                  <div>ðŸŽ“ <strong>Child Profile:</strong> {linkState.childProfile.fullName} ({linkState.childProfile.grade})</div>
                  <div>ðŸ›¡ï¸ <strong>Current Sharing Level:</strong> <span className="text-emerald-400 font-bold uppercase">{linkState.sharingLevel === 'summary_only' ? 'Summary Only (Default)' : 'Full Results'}</span></div>
                </div>

                <p className="text-[0.72rem] text-emerald-100/80 leading-relaxed font-body">
                  {linkState.sharingLevel === 'summary_only'
                    ? 'Your child has granted summary access (name, class, stream, trait badge, and overall progress). Raw assessment answers and transcripts are never shared.'
                    : 'Your child has granted full results access (including detailed domain scores and top career matches). Raw answers and transcripts remain private.'}
                </p>
              </div>

              {/* Unlink Action */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F3EAD3]/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleUnlink}
                  className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 font-semibold text-xs"
                >
                  Unlink Child Account
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#B8860B] text-[#18202F] font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}





