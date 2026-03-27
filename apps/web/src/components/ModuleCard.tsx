import { Link } from 'react-router-dom';

import type { AppModuleCard } from '@/content/types';

export function ModuleCard({ module }: { module: AppModuleCard }) {
  return (
    <Link className="module-card" to={module.path}>
      <div className="module-card__icon" style={{ color: module.accent }}>
        {module.icon}
      </div>
      <div className="module-card__body">
        <h3>{module.title}</h3>
        <p>{module.description}</p>
      </div>
      <span className="module-card__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
