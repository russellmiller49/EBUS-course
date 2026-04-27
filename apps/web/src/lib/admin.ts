import { getSupabaseBrowserClient } from '@/lib/supabase';

export interface AdminModuleProgress {
  moduleId: string;
  percentComplete: number;
  visitedAt: string | null;
  completedAt: string | null;
  timeSpentSeconds: number;
}

export interface AdminLectureSummary {
  completedCount: number;
  totalWatchedSeconds: number;
  lastOpenedAt: string | null;
}

export interface AdminLearnerOverview {
  id: string;
  email: string | null;
  fullName: string | null;
  degree: string | null;
  institution: string | null;
  institutionalEmail: string | null;
  fellowshipYear: string | null;
  flexibleBronchoscopyCount: number | null;
  ebusCount: number | null;
  ebusConfidence: string | null;
  approvalStatus: 'pending' | 'approved';
  approvedAt: string | null;
  approvedBy: string | null;
  inviteSentAt: string | null;
  lastSignInAt: string | null;
  onboardingCompletedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  snapshotUpdatedAt: string | null;
  pretestPercent: number | null;
  pretestSubmittedAt: string | null;
  totalTimeSpentSeconds: number;
  moduleProgress: AdminModuleProgress[];
  lectureSummary: AdminLectureSummary;
}

export interface AdminProgressSummary {
  approvedCount: number;
  averageProgressPercent: number;
  pendingCount: number;
  totalLearners: number;
}

const DEFAULT_LECTURE_SUMMARY: AdminLectureSummary = {
  completedCount: 0,
  totalWatchedSeconds: 0,
  lastOpenedAt: null,
};

function readString(value: unknown) {
  return typeof value === 'string' ? value : null;
}

function readNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readApprovalStatus(value: unknown): 'pending' | 'approved' {
  return value === 'approved' ? 'approved' : 'pending';
}

function normalizeModuleProgress(candidate: unknown): AdminModuleProgress[] {
  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') {
      return [];
    }

    const raw = entry as Record<string, unknown>;
    const moduleId = readString(raw.moduleId);

    if (!moduleId) {
      return [];
    }

    return [
      {
        moduleId,
        percentComplete: Math.max(0, Math.min(100, readNumber(raw.percentComplete) ?? 0)),
        visitedAt: readString(raw.visitedAt),
        completedAt: readString(raw.completedAt),
        timeSpentSeconds: Math.max(0, Math.floor(readNumber(raw.timeSpentSeconds) ?? 0)),
      },
    ];
  });
}

function normalizeLectureSummary(candidate: unknown): AdminLectureSummary {
  if (!candidate || typeof candidate !== 'object') {
    return DEFAULT_LECTURE_SUMMARY;
  }

  const raw = candidate as Record<string, unknown>;

  return {
    completedCount: Math.max(0, Math.floor(readNumber(raw.completedCount) ?? 0)),
    totalWatchedSeconds: Math.max(0, Math.floor(readNumber(raw.totalWatchedSeconds) ?? 0)),
    lastOpenedAt: readString(raw.lastOpenedAt),
  };
}

export function normalizeAdminLearnerOverview(candidate: unknown): AdminLearnerOverview {
  const raw = candidate && typeof candidate === 'object' ? (candidate as Record<string, unknown>) : {};

  return {
    id: readString(raw.learner_id) ?? '',
    email: readString(raw.email),
    fullName: readString(raw.full_name),
    degree: readString(raw.degree),
    institution: readString(raw.institution),
    institutionalEmail: readString(raw.institutional_email),
    fellowshipYear: readString(raw.fellowship_year),
    flexibleBronchoscopyCount: readNumber(raw.flexible_bronchoscopy_count),
    ebusCount: readNumber(raw.ebus_count),
    ebusConfidence: readString(raw.ebus_confidence),
    approvalStatus: readApprovalStatus(raw.approval_status),
    approvedAt: readString(raw.approved_at),
    approvedBy: readString(raw.approved_by),
    inviteSentAt: readString(raw.invite_sent_at),
    lastSignInAt: readString(raw.last_sign_in_at),
    onboardingCompletedAt: readString(raw.onboarding_completed_at),
    createdAt: readString(raw.created_at),
    updatedAt: readString(raw.updated_at),
    snapshotUpdatedAt: readString(raw.snapshot_updated_at),
    pretestPercent: readNumber(raw.pretest_percent),
    pretestSubmittedAt: readString(raw.pretest_submitted_at),
    totalTimeSpentSeconds: Math.max(0, Math.floor(readNumber(raw.total_time_spent_seconds) ?? 0)),
    moduleProgress: normalizeModuleProgress(raw.module_progress),
    lectureSummary: normalizeLectureSummary(raw.lecture_summary),
  };
}

export function getLearnerAverageProgress(learner: Pick<AdminLearnerOverview, 'moduleProgress'>) {
  if (learner.moduleProgress.length === 0) {
    return 0;
  }

  const total = learner.moduleProgress.reduce((sum, module) => sum + module.percentComplete, 0);

  return Math.round(total / learner.moduleProgress.length);
}

export function buildAdminProgressSummary(learners: AdminLearnerOverview[]): AdminProgressSummary {
  const approvedCount = learners.filter((learner) => learner.approvalStatus === 'approved').length;
  const pendingCount = learners.length - approvedCount;
  const progressTotal = learners.reduce((sum, learner) => sum + getLearnerAverageProgress(learner), 0);

  return {
    approvedCount,
    averageProgressPercent: learners.length > 0 ? Math.round(progressTotal / learners.length) : 0,
    pendingCount,
    totalLearners: learners.length,
  };
}

export async function fetchAdminLearnerOverview(passcode: string) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    throw new Error('Supabase is not configured for this environment.');
  }

  const { data, error } = await client.rpc('get_admin_learner_overview', {
    admin_passcode: passcode,
  });

  if (error) {
    throw new Error(error.message);
  }

  return Array.isArray(data) ? data.map(normalizeAdminLearnerOverview) : [];
}

export async function approveLearner(passcode: string, learnerId: string) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    throw new Error('Supabase is not configured for this environment.');
  }

  const { error } = await client.rpc('approve_learner', {
    admin_passcode: passcode,
    target_learner_id: learnerId,
  });

  if (error) {
    throw new Error(error.message);
  }
}
