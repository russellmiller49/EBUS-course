import { case001Manifest } from '@/content/cases';

export function Case001Page() {
  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Hidden route scaffold</div>
            <h2>{case001Manifest.title}</h2>
          </div>
        </div>
        <p>{case001Manifest.description}</p>
        <div className="mini-card-grid">
          <article className="mini-card">
            <strong>{case001Manifest.stations.length}</strong>
            <p>Stations in manifest</p>
          </article>
          <article className="mini-card">
            <strong>{case001Manifest.sliceSeries.axial.count}</strong>
            <p>Axial slices</p>
          </article>
          <article className="mini-card">
            <strong>{case001Manifest.sliceSeries.coronal.count}</strong>
            <p>Coronal slices</p>
          </article>
          <article className="mini-card">
            <strong>{case001Manifest.sliceSeries.sagittal.count}</strong>
            <p>Sagittal slices</p>
          </article>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Assets</div>
            <h2>Phase-two web viewer inputs</h2>
          </div>
        </div>
        <div className="stack-list">
          <article className="mini-card">
            <strong>GLB model</strong>
            <p>{case001Manifest.assets.glbFile}</p>
          </article>
          <article className="mini-card">
            <strong>CT volume</strong>
            <p>{case001Manifest.assets.ctVolumeFile}</p>
          </article>
          <article className="mini-card">
            <strong>Segmentation</strong>
            <p>{case001Manifest.assets.segmentationFile}</p>
          </article>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Next web pass</div>
            <h2>Keep 3D isolated from the learning routes</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          <article className="mini-card">
            <strong>Viewer target</strong>
            <p>React Three Fiber scene for the GLB model on desktop and tablet.</p>
          </article>
          <article className="mini-card">
            <strong>Side panels</strong>
            <p>Synchronized axial, coronal, and sagittal image panels keyed off the enriched manifest.</p>
          </article>
          <article className="mini-card">
            <strong>Deferred work</strong>
            <p>Co-registered slice planes inside 3D remain intentionally out of this first web pass.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
