// Mock Service for Linking Child Account in PathFinders
// Designed with clear API function boundaries for easy API integration later.

const STORAGE_KEY = 'pathfinders_link_state_v1';

const DEFAULT_CHILD_PROFILE = {
  id: 'PF-84920',
  firstName: 'Alex',
  lastName: 'Morgan',
  fullName: 'Alex Morgan',
  grade: 'Class 11',
  school: "St. Xavier's High School",
  stream: 'PCM (Engineering & Tech Focus)',
  streamCode: 'PCM',
  dominantTrait: 'The Builder',
  dominantTraitIcon: '🛠️',
  milestoneProgress: 84,
  interestScores: [
    { domain: 'Robotics & Autonomous Systems', score: 92 },
    { domain: 'Software Engineering & AI', score: 88 },
    { domain: 'Physics & Applied Mathematics', score: 84 },
    { domain: 'Product Design & Prototyping', score: 76 },
  ],
  topCareerMatches: [
    { title: 'Robotics Systems Engineer', matchPct: 96, pathway: 'B.Tech Mechatronics / Automation' },
    { title: 'AI & Software Architect', matchPct: 91, pathway: 'B.Tech Computer Science' },
    { title: 'Autonomous Vehicles Engineer', matchPct: 89, pathway: 'B.E. Automobile / Electronics' },
  ],
};

const INITIAL_STATE = {
  status: 'not_linked', // 'not_linked' | 'pending' | 'linked' | 'declined' | 'revoked'
  parentName: 'Sarah Morgan',
  childEmail: '',
  inviteCode: '',
  inviteUrl: '',
  inviteExpiresAt: null,
  sharingLevel: 'summary_only', // 'summary_only' | 'full_results'
  requestTimestamp: null,
  lastActionMessage: '',
  childProfile: DEFAULT_CHILD_PROFILE,
};

let memoryState = { ...INITIAL_STATE };
const listeners = new Set();

// Helper to notify subscribers on state change
function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener({ ...memoryState });
    } catch (e) {
      console.error('Error in link service listener:', e);
    }
  });

  // Also dispatch a DOM custom event for cross-component reactivity
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pathfinders_link_state_change', { detail: memoryState }));
  }
}

// Read from localStorage if available
function loadState() {
  if (typeof window === 'undefined') return memoryState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      memoryState = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read link state from localStorage:', e);
  }
  return memoryState;
}

// Save state to localStorage
function saveState(newState) {
  memoryState = { ...memoryState, ...newState };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    } catch (e) {
      console.warn('Failed to save link state to localStorage:', e);
    }
  }
  notifyListeners();
  return memoryState;
}

// Generate random short 6-char code for invite link
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const linkService = {
  /**
   * Get current link state
   */
  getState() {
    return loadState();
  },

  /**
   * Subscribe to link state updates
   */
  subscribe(callback) {
    listeners.add(callback);
    callback(loadState());
    return () => listeners.delete(callback);
  },

  /**
   * Create link request by entering child's email
   */
  async createLinkRequestByEmail(email) {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 400));

    const updated = saveState({
      status: 'pending',
      childEmail: email,
      inviteCode: '',
      inviteUrl: '',
      requestTimestamp: new Date().toISOString(),
      lastActionMessage: `Link request sent to ${email}`,
    });

    return updated;
  },

  /**
   * Generate an invite link (valid 7 days)
   */
  async createInviteLink() {
    await new Promise((res) => setTimeout(res, 300));

    const code = generateCode();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const inviteUrl = `${origin}/register?role=student&invite=${code}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const updated = saveState({
      status: 'pending',
      childEmail: '',
      inviteCode: code,
      inviteUrl: inviteUrl,
      inviteExpiresAt: expiresAt,
      requestTimestamp: new Date().toISOString(),
      lastActionMessage: `Invite link generated: ${inviteUrl}`,
    });

    return updated;
  },

  /**
   * Cancel pending link request
   */
  async cancelLinkRequest() {
    await new Promise((res) => setTimeout(res, 200));

    const updated = saveState({
      status: 'not_linked',
      childEmail: '',
      inviteCode: '',
      inviteUrl: '',
      requestTimestamp: null,
      lastActionMessage: 'Link request cancelled.',
    });

    return updated;
  },

  /**
   * Resend link request notification
   */
  async resendLinkRequest() {
    await new Promise((res) => setTimeout(res, 300));

    const updated = saveState({
      requestTimestamp: new Date().toISOString(),
      lastActionMessage: 'Link request resent to your child.',
    });

    return updated;
  },

  /**
   * Approve link request (Student side or Dev simulation)
   */
  async approveLinkRequest(sharingLevel = 'summary_only') {
    await new Promise((res) => setTimeout(res, 300));

    const updated = saveState({
      status: 'linked',
      sharingLevel: sharingLevel,
      lastActionMessage: `Child approved account connection with sharing level: ${sharingLevel}`,
    });

    return updated;
  },

  /**
   * Decline link request (Student side or Dev simulation)
   */
  async declineLinkRequest() {
    await new Promise((res) => setTimeout(res, 300));

    const updated = saveState({
      status: 'declined',
      lastActionMessage: "The request wasn't approved this time.",
    });

    return updated;
  },

  /**
   * Update privacy sharing level (Student settings or Dev)
   */
  async updateSharingLevel(newLevel) {
    await new Promise((res) => setTimeout(res, 200));

    const updated = saveState({
      sharingLevel: newLevel,
      lastActionMessage: `Sharing level updated to ${newLevel}`,
    });

    return updated;
  },

  /**
   * Unlink child account (by either parent or student)
   */
  async unlinkChild() {
    await new Promise((res) => setTimeout(res, 300));

    const updated = saveState({
      status: 'not_linked',
      childEmail: '',
      inviteCode: '',
      inviteUrl: '',
      requestTimestamp: null,
      lastActionMessage: 'Child account unlinked. Operating in Standalone Parent Mode.',
    });

    return updated;
  },

  /**
   * Reset state for testing/demo
   */
  resetState() {
    saveState({ ...INITIAL_STATE });
  },
};
