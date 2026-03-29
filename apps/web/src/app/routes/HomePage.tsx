import { Link } from 'react-router-dom';

import { ModuleCard } from '@/components/ModuleCard';
import { buildHomeProgressModel } from '@/app/routes/home/progress';
import { courseInfo } from '@/content/course';
import { homeModuleCards } from '@/content/modules';
import { useLearnerProgress } from '@/lib/progress';

function ProgressMeter({ percent }: { percent: number }) {
  return (
    <span aria-hidden="true" className="progress-meter">
      <span className="progress-meter__bar" style={{ width: `${percent}%` }} />
    </span>
  );
}

export function HomePage() {
  const { state } = useLearnerProgress();
  const { learningSteps, resumeModule } = buildHomeProgressModel(state);
  const reviewedLectures = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;
  const lastQuiz = state.quizScoreHistory[0];

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="eyebrow">Web beta</div>
        <h2 className="page-title">{courseInfo.courseTitle}</h2>
        <p>{courseInfo.overview}</p>
        <div className="stats-grid">
          {courseInfo.quickFacts.map((fact) => (
            <div key={fact.label} className="stat-card">
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Recommended Path</div>
            <h2>Prepare in order</h2>
          </div>
        </div>
        <div className="learning-path">
          {learningSteps.map((step, index) => (
            <Link key={step.id} className="learning-path__step" to={step.path}>
              <span className={`learning-path__marker${step.percent >= 100 ? ' learning-path__marker--done' : ''}`}>
                {step.percent >= 100 ? '✓' : index + 1}
              </span>
              <div className="learning-path__body">
                <strong>{step.title}</strong>
                <ProgressMeter percent={step.percent} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Pick Up Where You Left Off</div>
            <h2>Your progress</h2>
          </div>
        </div>
        {resumeModule ? (
          <Link className="resume-card" to={resumeModule.path}>
            <div className="resume-card__body">
              <div className="eyebrow">Resume</div>
              <strong>{resumeModule.title}</strong>
              <ProgressMeter percent={resumeModule.percent} />
            </div>
            <span className="button">Resume</span>
          </Link>
        ) : null}
        <div className="progress-list">
          {learningSteps.map((step) => (
            <Link key={step.id} className="progress-row" to={step.path}>
              <span>{step.title}</span>
              <ProgressMeter percent={step.percent} />
              <span className="progress-row__label">{step.percent}%</span>
            </Link>
          ))}
        </div>
        <div className="tag-row">
          <span className="tag">{state.bookmarkedStations.length} bookmarked stations</span>
          <span className="tag">{reviewedLectures} reviewed lectures</span>
          <span className="tag">{lastQuiz ? `Latest quiz ${lastQuiz.percent}%` : 'No quiz saved yet'}</span>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Modules</div>
            <h2>Prototype shell, real repo content</h2>
          </div>
        </div>
        <div className="module-grid">
          {homeModuleCards.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Live day</div>
            <h2>Agenda snapshot</h2>
          </div>
        </div>
        <div className="schedule-list">
          {courseInfo.liveDayAgenda.map((item) => (
            <article key={`${item.time}-${item.title}`} className="schedule-item">
              <span>{item.time}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
