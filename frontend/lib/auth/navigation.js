export function getRoleHome(profile) {
  if (profile?.role === 'parent') return '/parent-dashboard';
  if (profile?.role === 'switch') return '/career-switcher-dashboard';
  if (profile?.role === 'student') {
    return profile.academicCompleted ? '/student-dashboard' : '/academic-background';
  }
  return '/';
}

export function getLoginDestination(profile, requestedPath) {
  if (typeof requestedPath === 'string') {
    try {
      const target = new URL(requestedPath, 'https://pathfinders.invalid');
      const protectedPaths = [
        '/dashboard',
        '/student-dashboard',
        '/academic-background',
        '/parent-dashboard',
        '/career-switcher-dashboard',
        '/rapid-fire',
      ];
      const allowed = protectedPaths.some((path) => (
        target.pathname === path || target.pathname.startsWith(`${path}/`)
      ));
      if (target.origin === 'https://pathfinders.invalid' && allowed) {
        const role = profile?.role;
        const targetIsStudent = ['/dashboard', '/student-dashboard', '/academic-background', '/rapid-fire']
          .some((path) => target.pathname === path || target.pathname.startsWith(`${path}/`));
        const targetIsParent = target.pathname === '/parent-dashboard' || target.pathname.startsWith('/parent-dashboard/');
        const targetIsSwitcher = target.pathname === '/career-switcher-dashboard'
          || target.pathname.startsWith('/career-switcher-dashboard/');
        if ((role === 'parent' && targetIsParent)
          || (role === 'switch' && targetIsSwitcher)
          || (role === 'student' && targetIsStudent)) {
          return `${target.pathname}${target.search}${target.hash}`;
        }
      }
    } catch {
      return getRoleHome(profile);
    }
  }
  return getRoleHome(profile);
}
