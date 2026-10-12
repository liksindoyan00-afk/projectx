import { prisma } from '@/lib/db';
import { DEFAULT_STATS } from '@/lib/defaults';
import { saveStats } from '../../actions';
import { ActionForm, SubmitButton } from '../../ui';
import StatsPreview from './preview';

export default async function StatsPage() {
  const s = (await prisma.siteStats.findUnique({ where: { id: 1 } })) ?? DEFAULT_STATS;
  return (
    <>
      <div className="a-top">
        <div>
          <h1>Statistics</h1>
          <p>Figures on the Home and Results pages. Changes go live as soon as you save.</p>
        </div>
      </div>
      <ActionForm action={saveStats}>
        <div className="detail">
          <div>
            <div className="card">
              <h2>Headline result</h2>
              <p className="hint">“18 of 20 students admitted to at least one target university” — Home and Results. The dot graphic follows these numbers.</p>
              <div className="grid cols-3">
                <label className="f">
                  <span>Students admitted</span>
                  <input className="in" type="number" name="admittedCount" min={0} max={100} defaultValue={s.admittedCount} required />
                </label>
                <label className="f">
                  <span>Total students</span>
                  <input className="in" type="number" name="totalCount" min={1} max={100} defaultValue={s.totalCount} required />
                </label>
                <label className="f">
                  <span>
                    Graduate admissions <small>· Results page</small>
                  </span>
                  <input className="in" type="number" name="graduateAdmissions" min={0} max={100} defaultValue={s.graduateAdmissions} required />
                </label>
              </div>
            </div>

            <div className="card">
              <h2>Funding range</h2>
              <p className="hint">The scale on Results, from the smallest partial award to a full ride.</p>
              <div className="grid cols-3">
                <label className="f">
                  <span>Smallest award, %</span>
                  <input className="in" type="number" name="fundingMinPct" min={0} max={100} defaultValue={s.fundingMinPct} required />
                </label>
                <label className="f">
                  <span>Largest award, %</span>
                  <input className="in" type="number" name="fundingMaxPct" min={0} max={100} defaultValue={s.fundingMaxPct} required />
                </label>
              </div>
            </div>

            <div className="card">
              <h2>Text beside the figures</h2>
              <p className="hint">Keep these consistent with the numbers above — e.g. “Twenty clients” when the total is 20.</p>
              <div className="grid">
                <span className="f-label">Note under the dot graphic (Results)</span>
                {(['Hy', 'Ru', 'En'] as const).map((l) => (
                  <label key={l} className="f">
                    <span>
                      <span className="lang-tag">{l.toUpperCase()}</span>
                    </span>
                    <textarea className="in" name={`practiceNote${l}`} rows={2} defaultValue={s[`practiceNote${l}`]} />
                  </label>
                ))}
                <span className="f-label" style={{ marginTop: 12 }}>
                  Caveat under the funding scale (Results)
                </span>
                {(['Hy', 'Ru', 'En'] as const).map((l) => (
                  <label key={l} className="f">
                    <span>
                      <span className="lang-tag">{l.toUpperCase()}</span>
                    </span>
                    <textarea className="in" name={`fundingCaveat${l}`} rows={2} defaultValue={s[`fundingCaveat${l}`]} />
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="card">
              <h2>Preview</h2>
              <p className="hint">How the headline reads on the site (English).</p>
              <StatsPreview initialA={s.admittedCount} initialT={s.totalCount} />
            </div>
            <div className="card">
              <div className="grid">
                <SubmitButton>Save and publish</SubmitButton>
              </div>
            </div>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
