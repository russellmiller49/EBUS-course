import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { BottomNav } from '@/components/BottomNav';
import { TopHeader } from '@/components/TopHeader';
import type { NavigationItem } from '@/content/types';

export function AppShell({
  children,
  navItems,
}: {
  children: ReactNode;
  navItems: NavigationItem[];
}) {
  return (
    <div className="app-shell">
      <div className="app-shell__frame">
        <TopHeader />
        <nav className="top-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              className={({ isActive }) => `top-nav__link${isActive ? ' top-nav__link--active' : ''}`}
              to={item.path}
              end={item.path === '/'}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <main className="app-shell__content">{children}</main>
      </div>
      <BottomNav items={navItems} />
    </div>
  );
}
