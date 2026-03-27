import { ModuleCard } from '@/components/ModuleCard';
import { courseInfo } from '@/content/course';
import { homeModuleCards } from '@/content/modules';
import { useLearnerProgress } from '@/lib/progress';

export function HomePage() {
  const { state } = useLearnerProgress();
  const completedModules = Object.values(state.moduleProgress).filter((module) => module.completedAt).length;
  const reviewedLectures = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;
  const lastQuiz = state.quizScoreHistory[0];

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="eyebrow">Web beta</div>
        <h2>{courseInfo.courseTitle}</h2>
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
            <div className="eyebrow">Progress</div>
            <h2>Resume points across the web app</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          <article className="mini-card">
            <strong>{completedModules}</strong>
            <p>Completed modules</p>
          </article>
          <article className="mini-card">
            <strong>{state.bookmarkedStations.length}</strong>
            <p>Bookmarked stations</p>
          </article>
          <article className="mini-card">
            <strong>{reviewedLectures}</strong>
            <p>Reviewed lectures</p>
          </article>
          <article className="mini-card">
            <strong>{lastQuiz ? `${lastQuiz.percent}%` : 'No score yet'}</strong>
            <p>Latest quiz result</p>
          </article>
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
