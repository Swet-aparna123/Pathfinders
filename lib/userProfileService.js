// User Profile Service for storing and syncing user registration data across all portals
import { calculateAssessmentResults } from './careerAssessmentEngine';

const STORAGE_KEY = 'pathfinders_user_profile_v3';

const DEFAULT_PROFILE = {
  id: 'guest_user',
  fullName: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'student', // 'student' | 'parent' | 'switch'
  currentJobRole: 'Software Engineering',
  currentIndustry: 'IT / Software',
  expYears: '5 Years',
  targetPivot: 'AI & Data Science Specialist',
  switchReason: 'Higher Salary & Industry Growth',
  educationLevel: '',
  age: '',
  academicStream: '',
  currentSemester: '',
  semesterClass: '',
  classYear: '',
  academicAchievements: '',
  favoriteSubjects: [],
  schoolName: '',
  collegeName: '',
  degree: '',
  branchMajor: '',
  targetGoal: '',
  avatarUrl: null,
  preferredLanguage: 'en',
  academicCompleted: false,
  rapidFireCompleted: false,
  rapidFireResult: null,
  adaptiveFollowupQuestions: [],
  assessmentCompleted: false,
  assessmentAnswers: {}, // Clean: never prefill answers for fresh accounts
  chatbotCompleted: false,
  chatbotResult: null,
  chatbotKeywords: [],
  matchScore: 0,
  skillsList: [],
  assessmentResults: null,
};

function ensureProfileHydrated(profile) {
  const merged = { ...DEFAULT_PROFILE, ...profile };
  
  // Migration: If legacy mock data had 'Undergraduate' without degree, normalize default to 'Class 8–10'
  if (merged.educationLevel === 'Undergraduate' && (!merged.degree || merged.degree === '') && (!merged.branchMajor || merged.branchMajor === '')) {
    merged.educationLevel = 'Class 8–10';
  }

  // Only calculate assessment results if the user has actually answered assessment questions
  const hasAnswers = Boolean(
    merged.assessmentAnswers &&
    typeof merged.assessmentAnswers === 'object' &&
    Object.keys(merged.assessmentAnswers).length > 0
  );

  let assessmentResults = null;
  let matchScore = 0;
  let skillsList = [];

  if (hasAnswers) {
    assessmentResults = calculateAssessmentResults(merged.assessmentAnswers, merged.targetPivot);
    matchScore = assessmentResults?.matchScore || 0;
    skillsList = assessmentResults?.skillsList || [];
  }

  const targetPivot = merged.targetPivot || (assessmentResults ? assessmentResults.pivotTarget : '');

  return {
    ...merged,
    targetPivot,
    matchScore,
    skillsList,
    assessmentResults
  };
}

export const userProfileService = {
  getActiveUserId() {
    if (typeof window === 'undefined') return 'default_guest';
    let uid = localStorage.getItem('pathfinders_active_user_id');
    if (!uid) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (p.id) uid = p.id;
          else if (p.email) uid = `usr_${p.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        }
      } catch (e) {}
      if (!uid) uid = 'default_user';
      localStorage.setItem('pathfinders_active_user_id', uid);
    }
    return uid;
  },

  setActiveUserId(uid) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('pathfinders_active_user_id', uid);
  },

  getUserStorageKey(uid = null) {
    const activeId = uid || this.getActiveUserId();
    return `pathfinders_user_profile_${activeId}`;
  },

  getProfile(targetUserId = null) {
    let loaded = { ...DEFAULT_PROFILE };
    if (typeof window !== 'undefined') {
      try {
        const userKey = this.getUserStorageKey(targetUserId);
        let raw = localStorage.getItem(userKey);
        if (!raw && !targetUserId) {
          // Fallback to legacy shared key if user-scoped key doesn't exist yet
          raw = localStorage.getItem(STORAGE_KEY);
        }
        if (raw) {
          loaded = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('Failed to load user profile from localStorage:', e);
      }
    }
    
    return ensureProfileHydrated(loaded);
  },

  saveProfile(profileData, targetUserId = null) {
    const current = this.getProfile(targetUserId);
    const updatedRaw = { ...current, ...profileData };

    const targetPivotRole = profileData.targetPivot || updatedRaw.targetPivot;
    const hasAnswers = Boolean(
      updatedRaw.assessmentAnswers &&
      typeof updatedRaw.assessmentAnswers === 'object' &&
      Object.keys(updatedRaw.assessmentAnswers).length > 0
    );

    const newResults = hasAnswers
      ? calculateAssessmentResults(updatedRaw.assessmentAnswers, targetPivotRole)
      : null;
    
    updatedRaw.assessmentResults = newResults;
    updatedRaw.targetPivot = targetPivotRole || (newResults ? newResults.pivotTarget : '');
    updatedRaw.matchScore = newResults ? newResults.matchScore : 0;
    updatedRaw.skillsList = newResults ? newResults.skillsList : [];

    const hydrated = ensureProfileHydrated(updatedRaw);

    if (typeof window !== 'undefined') {
      try {
        const userKey = this.getUserStorageKey(targetUserId || hydrated.id);
        localStorage.setItem(userKey, JSON.stringify(hydrated));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
        window.dispatchEvent(new CustomEvent('pathfinders_profile_updated', { detail: hydrated }));
      } catch (e) {
        console.warn('Failed to save user profile to localStorage:', e);
      }
    }
    return hydrated;
  },

  // Start fresh registration for a new user, clearing all previous answers, scores, and history
  createNewUser(accountData = {}) {
    const cleanEmail = (accountData.email || '').trim().toLowerCase();
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Clear all prior shared assessment and chat sessions from storage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pathfinders_student_assessment');
        localStorage.removeItem('pathfinders_chatbot_completed');
        localStorage.removeItem('pathfinders_saved_careers');
        localStorage.removeItem('pathfinders_selected_roadmap_career');
        localStorage.removeItem('pathfinders_selected_roadmap_slug');
        localStorage.removeItem('pathfinders_rapid_fire_active_session_v1');
        localStorage.removeItem('pathfinders_rapid_fire_session_v1');
        localStorage.removeItem(`pathfinders_student_assessment_${newId}`);
        localStorage.removeItem(`pathfinders_chatbot_completed_${newId}`);
        localStorage.removeItem(`pathfinders_saved_careers_${newId}`);
        sessionStorage.clear();
      } catch (e) {}
    }

    this.setActiveUserId(newId);

    const freshProfile = {
      ...DEFAULT_PROFILE,
      id: newId,
      fullName: (accountData.fullName || '').trim(),
      firstName: (accountData.firstName || '').trim(),
      middleName: (accountData.middleName || '').trim(),
      lastName: (accountData.lastName || '').trim(),
      email: cleanEmail,
      phone: (accountData.phone || '').trim(),
      role: accountData.role || 'student',
      avatarUrl: accountData.avatarUrl || null,
      educationLevel: accountData.educationLevel || '',
      academicStream: accountData.academicStream || '',
      schoolName: accountData.schoolName || '',
      collegeName: accountData.collegeName || '',
      degree: accountData.degree || '',
      branchMajor: accountData.branchMajor || '',
      favoriteSubjects: accountData.favoriteSubjects || [],
      academicCompleted: false,
      rapidFireCompleted: false,
      rapidFireResult: null,
      adaptiveFollowupQuestions: [],
      assessmentCompleted: false,
      assessmentAnswers: {}, // 100% clean, no prefilled answers
      chatbotCompleted: false,
      chatbotResult: null,
      chatbotKeywords: [],
      matchScore: 0,
      skillsList: [],
      assessmentResults: null,
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        const userKey = this.getUserStorageKey(newId);
        localStorage.setItem(userKey, JSON.stringify(freshProfile));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshProfile));
        window.dispatchEvent(new CustomEvent('pathfinders_profile_updated', { detail: freshProfile }));
      } catch (e) {}
    }

    return freshProfile;
  },

  saveRapidFireResult(analysis, followups = []) {
    return this.saveProfile({
      rapidFireCompleted: true,
      rapidFireResult: analysis,
      adaptiveFollowupQuestions: followups,
    });
  },

  clearRapidFireResult() {
  const current = this.getProfile();
  const updated = {
    ...current,
    rapidFireCompleted: false,
    rapidFireResult: null,
    adaptiveFollowupQuestions: [],
    adaptiveFollowupAnswers: {}
  };
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pathfinders_rapid_fire_active_session_v1');
        sessionStorage.removeItem('pathfinders_rapid_fire_active_session_v1');
      } catch (e) {}
    }
    return this.saveProfile(updated);
  },

  saveChatbotResult(chatData = {}) {
    return this.saveProfile({
      chatbotCompleted: true,
      chatbotResult: chatData,
      chatbotKeywords: chatData.keywords || [],
    });
  },

  getLanguageForRole(role = 'student') {
    if (typeof window === 'undefined') return 'en';
    try {
      const roleSpecificKey = `pathfinders_language_role_${role}`;
      const saved = localStorage.getItem(roleSpecificKey);
      if (saved) return saved;

      const profile = this.getProfile();
      return profile.preferredLanguage || 'en';
    } catch {
      return 'en';
    }
  },

  setLanguageForRole(role = 'student', langCode = 'en') {
    if (typeof window === 'undefined') return;
    try {
      const roleSpecificKey = `pathfinders_language_role_${role}`;
      localStorage.setItem(roleSpecificKey, langCode);
      const current = this.getProfile();
      this.saveProfile({ ...current, preferredLanguage: langCode });
    } catch (e) {
      console.warn('Failed to persist language for role:', e);
    }
  },
};
