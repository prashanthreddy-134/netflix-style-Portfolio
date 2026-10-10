import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getAllData } from '../data/portfolio';


type Data = ReturnType<typeof getAllData>;
type Project = Data['projects'][number];
type Experience = Data['experience'][number];
type Education = Data['education'][number];
type Certification = Data['certifications'][number];
type Achievement = Data['achievements'][number];
type SkillCategory = Data['skillCategories'][number];
type Skill = SkillCategory['skills'][number];

/** Skill categories are edited as plain name lists; mono/note are kept by name on save. */
type SkillForm = { id: string; title: string; subtitle: string; names: string[] };

type Tab = 'profile' | 'education' | 'experience' | 'projects' | 'certifications' | 'achievements' | 'skills' | 'advanced';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Internships & Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'skills', label: 'Skills' },
  { id: 'advanced', label: 'Advanced' },
];

const ADVANCED_KEYS = ['seasons', 'topPicks', 'introSlides', 'viewerProfiles', 'skillEvidence'] as const;
type AdvKey = (typeof ADVANCED_KEYS)[number];

const INPUT = 'w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-bone outline-none placeholder:text-smoke/60 focus:border-crimson-2';

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={INPUT} />
    </label>
  );
}

function Area({ label, value, onChange, rows = 3, hint }: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">
        {label} {hint && <span className="normal-case tracking-normal text-smoke/70">· {hint}</span>}
      </span>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={INPUT} />
    </label>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-bone">{title}</h3>
        {note && <p className="mt-1 text-xs text-smoke">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** Add / edit / remove a list of items. Each card renders its own fields. */
function ListEditor<T>({
  items,
  onChange,
  newItem,
  addLabel,
  titleOf,
  renderFields,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel: string;
  titleOf: (item: T) => string;
  renderFields: (item: T, set: (patch: Partial<T>) => void) => ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="truncate text-xs font-semibold text-bone">{titleOf(item) || `Untitled ${i + 1}`}</p>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 text-[11px] text-smoke hover:text-crimson-2"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {renderFields(item, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="rounded-md border border-dashed border-white/25 px-4 py-2 text-xs text-bone hover:border-crimson-2"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/** Small two-column list for metrics (value + label). */
function MetricsEditor({ metrics, onChange }: { metrics: Project['metrics']; onChange: (m: Project['metrics']) => void }) {
  return (
    <div className="md:col-span-2 space-y-2">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">Result metrics</span>
      {metrics.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input className={`${INPUT} w-32`} placeholder="92%" value={m.value} onChange={(e) => onChange(metrics.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
          <input className={INPUT} placeholder="accuracy" value={m.label} onChange={(e) => onChange(metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
          <button type="button" onClick={() => onChange(metrics.filter((_, j) => j !== i))} className="shrink-0 px-2 text-smoke hover:text-crimson-2">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...metrics, { value: '', label: '' }])} className="text-xs text-bone hover:text-crimson-2">+ Add metric</button>
    </div>
  );
}

/** Shrinks an uploaded image so it stays small enough to store with the content. */
function compressImage(file: File, max = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not available'));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image. Use a PNG, JPG or WebP file.'));
    };
    img.src = url;
  });
}

function ImageField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string | undefined) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(file: File) {
    setBusy(true);
    setError(null);
    try {
      onChange(await compressImage(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="md:col-span-2">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">{label}</span>
      {value && <img src={value} alt="" className="mb-2 max-h-40 rounded-md border border-white/10 bg-white object-contain" />}
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-md border border-white/20 px-3 py-2 text-xs text-bone hover:bg-white/10">
          {busy ? 'Processing…' : value ? 'Replace image' : 'Upload image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void pick(f);
              e.target.value = '';
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="text-xs text-smoke hover:text-crimson-2">
            Remove image
          </button>
        )}
        {error && <span className="text-xs text-crimson-2">{error}</span>}
      </div>
    </div>
  );
}

const list = (s: string) => s.split('\n');
const joinLines = (a: string[]) => a.join('\n');
const joinCsv = (a: string[]) => a.join(',');
const cleanLines = (a: string[]) => a.map((s) => s.trim()).filter(Boolean);

export function StudioEditor({ passcode, onClose }: { passcode: string; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [base] = useState<Data>(() => getAllData());
  const [tab, setTab] = useState<Tab>('profile');
  const [d, setD] = useState<Data>(() => getAllData());
  const [skills, setSkills] = useState<SkillForm[]>(() =>
    base.skillCategories.map((c) => ({ id: c.id, title: c.title, subtitle: c.subtitle, names: c.skills.map((s) => s.name) })),
  );
  const [adv, setAdv] = useState<Record<AdvKey, string>>(
    () => Object.fromEntries(ADVANCED_KEYS.map((k) => [k, JSON.stringify(base[k], null, 2)])) as Record<AdvKey, string>,
  );
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof Data>(key: K, value: Data[K]) => setD((prev) => ({ ...prev, [key]: value }));
  const setProfile = (patch: Partial<Data['profile']>) => set('profile', { ...d.profile, ...patch });

  /** Turns the form state into the full data object, or returns an error message. */
  function build(): Data | string {
    const advParsed = {} as Record<AdvKey, unknown>;
    for (const k of ADVANCED_KEYS) {
      try {
        advParsed[k] = JSON.parse(adv[k]);
      } catch (e) {
        setTab('advanced');
        return `Advanced › ${k}: invalid JSON (${(e as Error).message})`;
      }
    }

    const skillCategories: SkillCategory[] = skills.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      skills: cleanLines(c.names).map((name): Skill => {
        const existing = base.skillCategories.flatMap((x) => x.skills).find((s) => s.name === name);
        return existing ?? { name, mono: name.replace(/[^A-Za-z]/g, '').slice(0, 2) || '··' };
      }),
    }));

    const projects: Project[] = d.projects.map((p) => {
      const out: Project = {
        ...p,
        stack: p.stack.map((s) => s.trim()).filter(Boolean),
        build: cleanLines(p.build),
        features: cleanLines(p.features),
        metrics: p.metrics.filter((m) => m.value.trim() || m.label.trim()),
      };
      if (!out.github?.trim()) delete out.github;
      else out.github = out.github.trim();
      if (!out.website?.trim()) delete out.website;
      else out.website = out.website.trim();
      return out;
    });

    const achievements: Achievement[] = d.achievements.map((a) => {
      const out = { ...a };
      if (!out.link?.trim()) delete out.link;
      if (!out.image) delete out.image;
      return out;
    });

    const certifications: Certification[] = d.certifications.map((c) => {
      const out = { ...c };
      if (!out.image) delete out.image;
      return out;
    });

    return {
      ...d,
      profile: { ...d.profile, tagline: cleanLines(d.profile.tagline), interests: cleanLines(d.profile.interests) },
      experience: d.experience.map((x) => ({ ...x, points: cleanLines(x.points) })),
      projects,
      achievements,
      certifications,
      skillCategories,
      ...advParsed,
    } as Data;
  }

  /** Saves to the shared store. The server checks the passcode and commits the content. */
  async function apply() {
    const data = build();
    if (typeof data === 'string') return setMessage({ ok: false, text: data });
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Studio-Passcode': passcode },
        body: JSON.stringify(data),
      });
      if (res.status === 401) return setMessage({ ok: false, text: 'Wrong passcode. Close the editor and try again.' });
      if (!res.ok) {
        const info = await res.json().catch(() => ({}) as Record<string, unknown>);
        const reason = [info.error, info.githubStatus && `GitHub ${info.githubStatus}`, info.github].filter(Boolean).join(' · ');
        return setMessage({ ok: false, text: `Could not save (${res.status}): ${reason || 'no details'}` });
      }
      setMessage({ ok: true, text: 'Saved. Reloading…' });
      setTimeout(() => window.location.reload(), 600);
    } catch {
      setMessage({ ok: false, text: 'Could not reach the server. Check your connection, or use Export as a backup.' });
    } finally {
      setSaving(false);
    }
  }

  function exportFile() {
    const data = build();
    if (typeof data === 'string') return setMessage({ ok: false, text: data });
    const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'overrides.json';
    a.click();
    URL.revokeObjectURL(a.href);
    setMessage({ ok: true, text: 'Exported a backup file.' });
  }

  const p = d.profile;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col bg-ink/95 backdrop-blur-xl" role="dialog" aria-label="Studio editor">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-crimson-2">THE STUDIO</p>
          <p className="text-sm text-bone">Edit your portfolio</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-bone hover:bg-white/10">
          Close ✕
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-white/10 px-5 py-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-xs transition ${t.id === tab ? 'bg-crimson text-white' : 'border border-white/15 text-mist hover:text-bone'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>
        <div className="mx-auto max-w-3xl">
          {tab === 'profile' && (
            <Section title="Profile" note="Your name, intro and contact details shown across the site.">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Full name" value={p.fullName} onChange={(v) => setProfile({ fullName: v })} />
                <Field label="Display name" value={p.displayName} onChange={(v) => setProfile({ displayName: v })} />
                <Field label="First name (big title)" value={p.firstName} onChange={(v) => setProfile({ firstName: v })} />
                <Field label="Series tag" value={p.seriesTag} onChange={(v) => setProfile({ seriesTag: v })} />
                <Field label="Role" value={p.role} onChange={(v) => setProfile({ role: v })} />
                <Field label="Location" value={p.location} onChange={(v) => setProfile({ location: v })} />
                <Field label="Email" type="email" value={p.email} onChange={(v) => setProfile({ email: v })} />
                <Field label="LinkedIn URL" value={p.links.linkedin} onChange={(v) => setProfile({ links: { ...p.links, linkedin: v } })} />
                <Field label="GitHub URL" value={p.links.github} onChange={(v) => setProfile({ links: { ...p.links, github: v } })} />
                <Field label="Studio label" value={p.originalLabel} onChange={(v) => setProfile({ originalLabel: v })} />
                <Area label="Intro" rows={3} value={p.intro} onChange={(v) => setProfile({ intro: v })} />
                <Area label="Tagline" hint="one per line" rows={3} value={joinLines(p.tagline)} onChange={(v) => setProfile({ tagline: list(v) })} />
                <Area label="Interests" hint="one per line" rows={3} value={joinLines(p.interests)} onChange={(v) => setProfile({ interests: list(v) })} />
              </div>
            </Section>
          )}

          {tab === 'education' && (
            <Section title="Education" note="Degrees and schools.">
              <ListEditor<Education>
                items={d.education}
                onChange={(v) => set('education', v)}
                newItem={() => ({ school: '', place: '', degree: '', period: '', score: '' })}
                addLabel="Add education"
                titleOf={(e) => e.school}
                renderFields={(e, s) => (
                  <>
                    <Field label="School / college" value={e.school} onChange={(v) => s({ school: v })} />
                    <Field label="Place" value={e.place} onChange={(v) => s({ place: v })} />
                    <Field label="Degree" value={e.degree} onChange={(v) => s({ degree: v })} />
                    <Field label="Period" placeholder="2023 – 2027" value={e.period} onChange={(v) => s({ period: v })} />
                    <Field label="Score / CGPA / year" value={e.score} onChange={(v) => s({ score: v })} />
                  </>
                )}
              />
            </Section>
          )}

          {tab === 'experience' && (
            <Section title="Internships & work" note="Add every internship or job. They appear in the resume section.">
              <ListEditor<Experience>
                items={d.experience}
                onChange={(v) => set('experience', v)}
                newItem={() => ({ company: '', role: '', place: '', period: '', points: [] })}
                addLabel="Add internship / work"
                titleOf={(x) => `${x.role}${x.company ? ' · ' + x.company : ''}`}
                renderFields={(x, s) => (
                  <>
                    <Field label="Role / title" value={x.role} onChange={(v) => s({ role: v })} />
                    <Field label="Company / organisation" value={x.company} onChange={(v) => s({ company: v })} />
                    <Field label="Place" value={x.place} onChange={(v) => s({ place: v })} />
                    <Field label="Period" placeholder="August 2026" value={x.period} onChange={(v) => s({ period: v })} />
                    <Area label="What you did" hint="one point per line" rows={4} value={joinLines(x.points)} onChange={(v) => s({ points: list(v) })} />
                  </>
                )}
              />
            </Section>
          )}

          {tab === 'projects' && (
            <Section title="Projects" note="Add GitHub and website links to show buttons on each project.">
              <ListEditor<Project>
                items={d.projects}
                onChange={(v) => set('projects', v)}
                newItem={() => ({
                  id: `project-${Date.now()}`,
                  title: '',
                  year: '',
                  genre: '',
                  logline: '',
                  stack: [],
                  build: [],
                  features: [],
                  metrics: [],
                  github: '',
                  website: '',
                  palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
                  motif: 'flow',
                })}
                addLabel="Add project"
                titleOf={(x) => x.title}
                renderFields={(x, s) => (
                  <>
                    <Field label="Title" value={x.title} onChange={(v) => s({ title: v })} />
                    <Field label="Year / timeframe" value={x.year} onChange={(v) => s({ year: v })} />
                    <Field label="Genre / category" placeholder="Full-Stack • E-Commerce" value={x.genre} onChange={(v) => s({ genre: v })} />
                    <Field label="GitHub URL" placeholder="https://github.com/you/project" value={x.github ?? ''} onChange={(v) => s({ github: v })} />
                    <Field label="Website URL" placeholder="https://your-project.vercel.app" value={x.website ?? ''} onChange={(v) => s({ website: v })} />
                    <Area label="One-line summary" rows={2} value={x.logline} onChange={(v) => s({ logline: v })} />
                    <Field label="Tech stack (comma separated)" placeholder="React, Node.js, PostgreSQL" value={joinCsv(x.stack)} onChange={(v) => s({ stack: v.split(',') })} />
                    <Area label="What you built" hint="one per line" rows={3} value={joinLines(x.build)} onChange={(v) => s({ build: list(v) })} />
                    <Area label="Key features" hint="one per line" rows={3} value={joinLines(x.features)} onChange={(v) => s({ features: list(v) })} />
                    <MetricsEditor metrics={x.metrics} onChange={(m) => s({ metrics: m })} />
                  </>
                )}
              />
            </Section>
          )}

          {tab === 'certifications' && (
            <Section title="Certifications" note="Add every certificate. The link is optional.">
              <ListEditor<Certification>
                items={d.certifications}
                onChange={(v) => set('certifications', v)}
                newItem={() => ({ issuer: '', name: '', link: '' })}
                addLabel="Add certification"
                titleOf={(c) => c.name}
                renderFields={(c, s) => (
                  <>
                    <Field label="Certificate name" value={c.name} onChange={(v) => s({ name: v })} />
                    <Field label="Issued by" value={c.issuer} onChange={(v) => s({ issuer: v })} />
                    <Field label="Certificate link (optional)" placeholder="https://…" value={c.link} onChange={(v) => s({ link: v })} />
                    <ImageField label="Certificate image (optional)" value={c.image} onChange={(v) => s({ image: v })} />
                  </>
                )}
              />
            </Section>
          )}

          {tab === 'achievements' && (
            <Section title="Achievements" note="Highlights shown as Top Moments.">
              <ListEditor<Achievement>
                items={d.achievements}
                onChange={(v) => set('achievements', v)}
                newItem={() => ({ id: `achv-${Date.now()}`, title: '', org: '', detail: '', laurel: '', link: '' })}
                addLabel="Add achievement"
                titleOf={(a) => a.title}
                renderFields={(a, s) => (
                  <>
                    <Field label="Title" value={a.title} onChange={(v) => s({ title: v })} />
                    <Field label="Organisation / event" value={a.org} onChange={(v) => s({ org: v })} />
                    <Field label="Short label" placeholder="National Selection" value={a.laurel} onChange={(v) => s({ laurel: v })} />
                    <Field label="Link (optional)" placeholder="https://…" value={a.link ?? ''} onChange={(v) => s({ link: v })} />
                    <ImageField label="Certificate / proof image (optional)" value={a.image} onChange={(v) => s({ image: v })} />
                    <Area label="Details" rows={2} value={a.detail} onChange={(v) => s({ detail: v })} />
                  </>
                )}
              />
            </Section>
          )}

          {tab === 'skills' && (
            <Section title="Skills" note="One skill per line in each group. Existing skill codes are kept.">
              <ListEditor<SkillForm>
                items={skills}
                onChange={setSkills}
                newItem={() => ({ id: `skills-${Date.now()}`, title: '', subtitle: '', names: [] })}
                addLabel="Add skill group"
                titleOf={(c) => c.title}
                renderFields={(c, s) => (
                  <>
                    <Field label="Group title" value={c.title} onChange={(v) => s({ title: v })} />
                    <Field label="Subtitle" value={c.subtitle} onChange={(v) => s({ subtitle: v })} />
                    <Area label="Skills" hint="one per line" rows={5} value={joinLines(c.names)} onChange={(v) => s({ names: list(v) })} />
                  </>
                )}
              />
            </Section>
          )}

          {tab === 'advanced' && (
            <Section title="Advanced" note="Journey seasons, Top Picks, Play Intro slides, viewer profiles and skill evidence, as JSON. Keep the structure intact.">
              {ADVANCED_KEYS.map((k) => (
                <label key={k} className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">{k}</span>
                  <textarea
                    rows={8}
                    spellCheck={false}
                    value={adv[k]}
                    onChange={(e) => setAdv((a) => ({ ...a, [k]: e.target.value }))}
                    className={`${INPUT} font-mono text-xs`}
                  />
                </label>
              ))}
            </Section>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-5 py-4">
        {message && <span className={`mr-auto text-[11px] ${message.ok ? 'text-[#46e3a8]' : 'text-crimson-2'}`}>{message.text}</span>}
        <button type="button" disabled={saving} onClick={apply} className="rounded-md bg-bone px-4 py-2 text-xs font-bold text-ink hover:bg-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Save for everyone'}
        </button>
        <button type="button" onClick={exportFile} className="rounded-md border border-white/20 px-4 py-2 text-xs text-bone hover:bg-white/10">
          Export backup
        </button>

      </div>
    </div>,
    document.body,
  );
}
