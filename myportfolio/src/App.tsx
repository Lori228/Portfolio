import React, { useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

/**
 * Multi-page React Portfolio (Dynamic)
 * Pages: Home, Certifications, Projects, Project Detail, Contact
 * CV button opens a PDF from public/cv/
 */

type Skill = { name: string; level: number };
type Cert = { title: string; issuer: string; date: string; credentialUrl: string };
type ProjectLink = { label: string; url: string };
type Project = {
  id: string;
  title: string;
  tags: string[];
  date: string;
  thumbnail: string;
  summary: string;
  details: string[];
  links: ProjectLink[];
};

const DATA = {
  profile: {
    name: "Weber Laurence",
    title: "BTS Cloud Computing Student",
    location: "Luxembourg",
    about:
      "I’m a Cloud Computing student passionate about systems, virtualization, and building practical projects. I enjoy working with Linux/Windows, Docker, cloud platforms, and automation.",
    email: "your.email@example.com",
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourprofile/",
    cvUrl: "/cv/Weber_Laurence_CV.pdf", // put file in public/cv/
    avatarUrl: "/img/profile-placeholder.png", // put file in public/img/
  },
  skills: [
    { name: "Linux", level: 80 },
    { name: "Windows Server / AD", level: 75 },
    { name: "Docker", level: 70 },
    { name: "Networking", level: 65 },
    { name: "Azure (Basics)", level: 55 },
    { name: "Python (Basics)", level: 60 },
    { name: "PowerShell (Basics)", level: 55 },
  ] as Skill[],
  certifications: {
    pluralsight: [
      { title: "Pluralsight: Docker Fundamentals", issuer: "Pluralsight", date: "2025-05", credentialUrl: "#" },
      { title: "Pluralsight: Linux Administration", issuer: "Pluralsight", date: "2025-06", credentialUrl: "#" },
    ] as Cert[],
    office365: [
      { title: "Microsoft 365 Fundamentals (MS-900)", issuer: "Microsoft", date: "2025-09", credentialUrl: "#" },
    ] as Cert[],
    azure: [
      { title: "Microsoft Azure Fundamentals (AZ-900)", issuer: "Microsoft", date: "2025-10", credentialUrl: "#" },
    ] as Cert[],
  },
  projects: [
    {
      id: "nextcloud-pi",
      title: "Nextcloud on Raspberry Pi (Docker)",
      tags: ["Docker", "Raspberry Pi", "Nextcloud"],
      date: "Dec 2024",
      thumbnail: "/img/project-placeholder.png",
      summary:
        "Deployed Nextcloud in Docker on Raspberry Pi 4 with persistent storage, secure access, and documentation.",
      details: ["Docker compose setup", "Persistent volumes + backups", "Basic security hardening", "Team workflow with Planner/Teams"],
      links: [{ label: "GitHub", url: "#" }, { label: "Demo", url: "#" }],
    },
    {
      id: "hypervisor-compare",
      title: "Type 1 Hypervisor Comparison (XCP-ng vs Proxmox)",
      tags: ["Virtualization", "Clustering", "Storage"],
      date: "Jun 2025",
      thumbnail: "/img/project-placeholder.png",
      summary:
        "Compared two hypervisors using VM lifecycle tasks, snapshots, migrations, and NAS storage protocols.",
      details: ["VM creation + OS installation", "Live migration testing", "Snapshots + backups", "NAS storage (SMB/NFS/iSCSI)"],
      links: [{ label: "Report", url: "#" }],
    },
  ] as Project[],
};

/** UI helpers */
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto w-[min(1100px,92%)] py-6">{children}</main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const linkBase =
    "px-3 py-2 rounded-xl text-sm border border-transparent text-slate-300 hover:text-slate-100 hover:border-white/10 hover:bg-white/5";
  const active = "!text-slate-100 !border-white/10 !bg-white/5";

  return (
  <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
    <div className="mx-auto flex w-[min(1100px,92%)] items-center justify-between gap-3 py-3">
      <Link to="/" className="font-extrabold tracking-tight">
        MyPortfolio
      </Link>

      <nav className="flex flex-wrap gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }: { isActive: boolean }) =>
            `${linkBase} ${isActive ? active : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/certifications"
          className={({ isActive }: { isActive: boolean }) =>
            `${linkBase} ${isActive ? active : ""}`
          }
        >
          Certifications
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }: { isActive: boolean }) =>
            `${linkBase} ${isActive ? active : ""}`
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }: { isActive: boolean }) =>
            `${linkBase} ${isActive ? active : ""}`
          }
        >
          Contact
        </NavLink>
      </nav>
    </div>
  </header>
);
}


  function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-white/10 py-5 text-slate-400">
      <div className="mx-auto flex w-[min(1100px,92%)] flex-wrap items-center justify-between gap-3">
        <div>
          © {year} {DATA.profile.name}
        </div>
        <div className="flex gap-4">
          <a className="hover:text-slate-100" href={DATA.profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-slate-100" href={DATA.profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] " + className}>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-slate-300">
      {children}
    </span>
  );
}

function SkillBar({ name, level }: Skill) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <strong className="text-slate-200">{name}</strong>
        <span className="text-slate-400">{level}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-blue-400" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

function BtnLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20">
      {children}
    </Link>
  );
}

function BtnA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20">
      {children}
    </a>
  );
}

/** Pages */
function Home() {
  const certPeek = useMemo(() => {
    const all = [...DATA.certifications.pluralsight, ...DATA.certifications.office365, ...DATA.certifications.azure];
    return all.slice(0, 4);
  }, []);

  const projPeek = useMemo(() => DATA.projects.slice(0, 3), []);

  return (
    <Layout>
      <section className="grid gap-4 md:grid-cols-[1.4fr_.6fr]">
        <Card>
          <h1 className="text-3xl font-extrabold tracking-tight">{DATA.profile.name}</h1>
          <div className="mt-1 text-slate-400">
            {DATA.profile.title} • {DATA.profile.location}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <div className="font-bold">About Me</div>
            <p className="mt-2 leading-relaxed text-slate-300">{DATA.profile.about}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <BtnLink to="/projects">View Projects</BtnLink>
            <BtnLink to="/certifications">View Certifications</BtnLink>
            <BtnA href={DATA.profile.cvUrl}>View CV (PDF)</BtnA>
          </div>
        </Card>

        <Card>
          <div className="text-slate-400">Profile</div>
          <img
            src={DATA.profile.avatarUrl}
            alt="profile"
            className="mt-3 h-56 w-full rounded-2xl border border-white/10 object-cover"
          />
          <div className="mt-3 text-xs text-slate-500">
            Put images in <span className="font-mono">public/img</span>.
          </div>
        </Card>
      </section>

      <section className="mt-7">
        <h2 className="text-xl font-extrabold">Skills</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DATA.skills.map((s) => (
            <SkillBar key={s.name} {...s} />
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold">Certifications (Sneak Peek)</h2>
          <BtnLink to="/certifications">See all</BtnLink>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {certPeek.map((c) => (
            <Card key={c.title}>
              <div className="font-bold">{c.title}</div>
              <div className="mt-2 text-sm text-slate-400">
                {c.issuer} • {c.date}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold">Projects (Sneak Peek)</h2>
          <BtnLink to="/projects">See all</BtnLink>
        </div>

        <div className="mt-3 grid gap-3">
          {projPeek.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 md:grid-cols-[140px_1fr]"
            >
              <img src={p.thumbnail} alt={`${p.title} thumbnail`} className="h-full w-full object-cover" />
              <div className="p-4">
                <div className="font-extrabold">{p.title}</div>
                <div className="mt-1 text-sm text-slate-400">{p.summary}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold">Curriculum Vitae</div>
            <div className="text-slate-400">PDF format</div>
          </div>
          <BtnA href={DATA.profile.cvUrl}>View CV</BtnA>
        </Card>
      </section>
    </Layout>
  );
}

function Certifications() {
  const sections: Array<{ key: keyof typeof DATA.certifications; title: string }> = [
    { key: "pluralsight", title: "Pluralsight" },
    { key: "office365", title: "Office 365" },
    { key: "azure", title: "Azure" },
  ];

  return (
    <Layout>
      <Card>
        <h1 className="text-2xl font-extrabold">Certifications</h1>
        <p className="mt-2 text-slate-400">Grouped into Pluralsight, Office 365, and Azure.</p>
      </Card>

      <div className="mt-6 grid gap-6">
        {sections.map((s) => {
          const list = DATA.certifications[s.key] ?? [];
          return (
            <section key={s.key}>
              <h2 className="text-xl font-extrabold">{s.title}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.length === 0 ? (
                  <Card className="border-dashed text-slate-400">No certifications added yet.</Card>
                ) : (
                  list.map((c) => (
                    <Card key={c.title} className="flex flex-col gap-3">
                      <div>
                        <div className="font-extrabold">{c.title}</div>
                        <div className="mt-1 text-sm text-slate-400">
                          {c.issuer} • {c.date}
                        </div>
                      </div>
                      <div>
                        <BtnA href={c.credentialUrl}>View Credential</BtnA>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </Layout>
  );
}

function Projects() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return DATA.projects;
    return DATA.projects.filter((p) => `${p.title} ${p.summary} ${p.tags.join(" ")}`.toLowerCase().includes(query));
  }, [q]);

  return (
    <Layout>
      <Card>
        <h1 className="text-2xl font-extrabold">Projects</h1>
        <p className="mt-2 text-slate-400">Click a project to view a summary page.</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects (title, tags, summary)..."
          className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
        />
      </Card>

      <section className="mt-6 grid gap-3">
        {filtered.length === 0 ? (
          <Card className="border-dashed text-slate-400">No projects match your search.</Card>
        ) : (
          filtered.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 md:grid-cols-[160px_1fr]"
            >
              <img src={p.thumbnail} alt={`${p.title} thumbnail`} className="h-full w-full object-cover" />
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="font-extrabold">{p.title}</div>
                  <div className="text-sm text-slate-500">{p.date}</div>
                </div>
                <div className="mt-1 text-sm text-slate-400">{p.summary}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </Layout>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const project = useMemo(() => DATA.projects.find((p) => p.id === id), [id]);

  if (!project) {
    return (
      <Layout>
        <Card className="border-dashed text-slate-400">
          Project not found.
          <div className="mt-3">
            <BtnLink to="/projects">Back to Projects</BtnLink>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <div className="grid items-center gap-4 md:grid-cols-[260px_1fr]">
          <img src={project.thumbnail} alt={`${project.title} thumbnail`} className="h-44 w-full rounded-2xl border border-white/10 object-cover" />
          <div>
            <h1 className="text-2xl font-extrabold">{project.title}</h1>
            <div className="mt-1 text-slate-500">{project.date}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 leading-relaxed text-slate-300">{project.summary}</p>

        <h2 className="mt-6 text-lg font-extrabold">What I did</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-300">
          {project.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <h2 className="mt-6 text-lg font-extrabold">Links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.links.map((l) => (
            <BtnA key={l.label} href={l.url}>
              {l.label}
            </BtnA>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => nav(-1)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20"
          >
            ← Back
          </button>
        </div>
      </Card>
    </Layout>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${msg}`);
    window.location.href = `mailto:${DATA.profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Layout>
      <Card>
        <h1 className="text-2xl font-extrabold">Contact</h1>
        <p className="mt-2 text-slate-400">
          Email:{" "}
          <a className="underline hover:text-slate-100" href={`mailto:${DATA.profile.email}`}>
            {DATA.profile.email}
          </a>
        </p>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-extrabold">Send a message</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Your email"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            required
            placeholder="Your message"
            className="min-h-[160px] w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
          <button type="submit" className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:border-white/20">
            Send
          </button>
        </form>
      </Card>
    </Layout>
  );
}

/** App Router */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="*"
          element={
            <Layout>
              <Card className="border-dashed text-slate-400">
                Page not found.
                <div className="mt-3">
                  <BtnLink to="/">Go Home</BtnLink>
                </div>
              </Card>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

