import { useEffect, useState } from 'react';

import {
  COURSE_ADMIN_SESSION_CHANGE_EVENT,
  COURSE_ADMIN_SESSION_KEY,
  isCourseAdminSessionActive,
} from '@/lib/access';

export function useCourseAdminSessionActive() {
  const [isAdminSessionActive, setIsAdminSessionActive] = useState(() => isCourseAdminSessionActive());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    function updateAdminSessionState() {
      setIsAdminSessionActive(isCourseAdminSessionActive());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === COURSE_ADMIN_SESSION_KEY || event.key === null) {
        updateAdminSessionState();
      }
    }

    updateAdminSessionState();
    window.addEventListener(COURSE_ADMIN_SESSION_CHANGE_EVENT, updateAdminSessionState);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(COURSE_ADMIN_SESSION_CHANGE_EVENT, updateAdminSessionState);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return isAdminSessionActive;
}
