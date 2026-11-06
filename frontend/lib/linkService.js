const STORAGE_KEY = 'pathfinders_link_state_v1';
const MIGRATION_KEY = 'pathfinders_link_state_clean_v2';
const EMPTY_CHILD_PROFILE = {
  id: '', firstName: '', lastName: '', fullName: '', grade: '', school: '', stream: '',
  streamCode: '', dominantTrait: '', dominantTraitIcon: '', milestoneProgress: 0,
  interestScores: [], topCareerMatches: [],
};
const INITIAL_STATE = {
  status: 'not_linked', parentName: '', childEmail: '', inviteCode: '', inviteUrl: '',
  inviteExpiresAt: null, sharingLevel: 'summary_only', requestTimestamp: null,
  lastActionMessage: '', childProfile: EMPTY_CHILD_PROFILE,
};
let memoryState = { ...INITIAL_STATE };
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener({ ...memoryState }));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pathfinders_link_state_change', { detail: memoryState }));
  }
}
function loadState() {
  if (typeof window === 'undefined') return memoryState;
  try {
    if (!localStorage.getItem(MIGRATION_KEY)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(MIGRATION_KEY, '1');
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) memoryState = { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch (error) {
    console.warn('Could not read parent link state:', error);
  }
  return memoryState;
}
function saveState(update) {
  memoryState = { ...memoryState, ...update };
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
  notify();
  return memoryState;
}
function notConnected() {
  throw new Error('Parent and student account linking is not connected to a backend yet.');
}

export const linkService = {
  getState: loadState,
  subscribe(callback) {
    listeners.add(callback);
    callback(loadState());
    return () => listeners.delete(callback);
  },
  createLinkRequestByEmail: notConnected,
  createInviteLink: notConnected,
  approveLinkRequest: notConnected,
  declineLinkRequest: notConnected,
  async cancelLinkRequest() {
    return saveState({ ...INITIAL_STATE });
  },
  async resendLinkRequest() {
    return notConnected();
  },
  async updateSharingLevel(sharingLevel) {
    return saveState({ sharingLevel });
  },
  async unlinkChild() {
    return saveState({ ...INITIAL_STATE });
  },
  resetState() {
    return saveState({ ...INITIAL_STATE });
  },
};


