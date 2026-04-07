import type { AppRouteId } from '@/content/types';
import type { LearnerProgressState } from '@/lib/progress';

export function isPretestComplete(state: Pick<LearnerProgressState, 'pretest'>) {
  return Boolean(state.pretest.submittedAt);
}

export function routeRequiresPretest(routeId: AppRouteId | null) {
  return Boolean(routeId && routeId !== 'home' && routeId !== 'pretest');
}

export function canAccessRoute(routeId: AppRouteId, state: Pick<LearnerProgressState, 'pretest'>) {
  if (!routeRequiresPretest(routeId)) {
    return true;
  }

  return isPretestComplete(state);
}

export function getLockedRoutePath(routeId: AppRouteId, path: string, state: Pick<LearnerProgressState, 'pretest'>) {
  return canAccessRoute(routeId, state) ? path : '/pretest';
}

export function getRouteLockReason(routeId: AppRouteId, state: Pick<LearnerProgressState, 'pretest'>) {
  if (canAccessRoute(routeId, state)) {
    return null;
  }

  return 'Complete the pretest to unlock this module.';
}
