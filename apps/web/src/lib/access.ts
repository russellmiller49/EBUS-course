import type { AppRouteId } from '@/content/types';
import { isCoursePretestUnlocked, isPracticeGateUnlocked, isPretestComplete } from '@/lib/courseWorkflow';
import type { LearnerProgressState } from '@/lib/progress';

export const COURSE_ADMIN_SHARED_PASSCODE = 'EBUS_2026';
export const COURSE_VENDOR_SHARED_PASSCODE = 'SoCal_EBUS_Sponsor';
export const PRETEST_ADMIN_UNLOCK_PASSCODE = COURSE_ADMIN_SHARED_PASSCODE;
export const COURSE_ADMIN_SESSION_KEY = 'socal-ebus-prep.web.admin-passcode';
export const COURSE_VENDOR_SESSION_KEY = 'socal-ebus-prep.web.vendor-passcode';
export const COURSE_ADMIN_SESSION_CHANGE_EVENT = 'socal-ebus-prep.admin-session-change';
export const COURSE_VENDOR_SESSION_CHANGE_EVENT = 'socal-ebus-prep.vendor-session-change';

type CourseAccessStorage = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;

export interface CourseAccessOptions {
  admin?: boolean;
  preview?: boolean;
}

export { isPretestComplete };

export function validateCourseAdminPasscode(value: string) {
  return value.trim() === COURSE_ADMIN_SHARED_PASSCODE;
}

export function validateCourseVendorPasscode(value: string) {
  return value.trim() === COURSE_VENDOR_SHARED_PASSCODE;
}

export function validatePretestAdminPasscode(value: string) {
  return validateCourseAdminPasscode(value);
}

function getBrowserSessionStorage(): CourseAccessStorage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function dispatchCourseAdminSessionChange() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(COURSE_ADMIN_SESSION_CHANGE_EVENT));
}

function dispatchCourseVendorSessionChange() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(COURSE_VENDOR_SESSION_CHANGE_EVENT));
}

export function getStoredCourseAdminPasscode(storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  const storedPasscode = storage?.getItem(COURSE_ADMIN_SESSION_KEY) ?? '';

  return validateCourseAdminPasscode(storedPasscode) ? storedPasscode : '';
}

export function getStoredCourseVendorPasscode(storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  const storedPasscode = storage?.getItem(COURSE_VENDOR_SESSION_KEY) ?? '';

  return validateCourseVendorPasscode(storedPasscode) ? storedPasscode : '';
}

export function isCourseAdminSessionActive(storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  return Boolean(getStoredCourseAdminPasscode(storage));
}

export function isCourseVendorSessionActive(storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  return Boolean(getStoredCourseVendorPasscode(storage));
}

export function storeCourseAdminPasscode(value: string, storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  storage?.setItem(COURSE_ADMIN_SESSION_KEY, value.trim());
  dispatchCourseAdminSessionChange();
}

export function storeCourseVendorPasscode(value: string, storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  storage?.setItem(COURSE_VENDOR_SESSION_KEY, value.trim());
  dispatchCourseVendorSessionChange();
}

export function clearCourseAdminPasscode(storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  storage?.removeItem(COURSE_ADMIN_SESSION_KEY);
  dispatchCourseAdminSessionChange();
}

export function clearCourseVendorPasscode(storage: CourseAccessStorage | null = getBrowserSessionStorage()) {
  storage?.removeItem(COURSE_VENDOR_SESSION_KEY);
  dispatchCourseVendorSessionChange();
}

export function routeRequiresPretest(routeId: AppRouteId | null) {
  return Boolean(routeId && !['home', 'admin', 'sponsors', 'lectures', 'pretest'].includes(routeId));
}

export function canAccessRoute(
  routeId: AppRouteId,
  state: Pick<LearnerProgressState, 'pretest' | 'lectureWatchStatus'>,
  options: CourseAccessOptions = {},
) {
  if (options.admin || options.preview) {
    return true;
  }

  if (routeId === 'home' || routeId === 'admin' || routeId === 'sponsors' || routeId === 'lectures') {
    return true;
  }

  if (routeId === 'pretest') {
    return isCoursePretestUnlocked(state);
  }

  return isPracticeGateUnlocked(state);
}

export function getLockedRoutePath(
  routeId: AppRouteId,
  path: string,
  state: Pick<LearnerProgressState, 'pretest' | 'lectureWatchStatus'>,
  options: CourseAccessOptions = {},
) {
  if (canAccessRoute(routeId, state, options)) {
    return path;
  }

  return isCoursePretestUnlocked(state) ? '/pretest' : '/lectures';
}

export function getRouteLockReason(
  routeId: AppRouteId,
  state: Pick<LearnerProgressState, 'pretest' | 'lectureWatchStatus'>,
  options: CourseAccessOptions = {},
) {
  if (canAccessRoute(routeId, state, options)) {
    return null;
  }

  if (routeId === 'pretest') {
    return 'Complete the welcome and course intro video to unlock the pre-test.';
  }

  return 'Complete the pre-test to unlock this module.';
}
