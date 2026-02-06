import React, { useMemo, useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import Extras from "./extras";

type Skill = { name: string; level: number };

// UPDATED: support PDF links for certificate + grade
type Cert = {
  title: string;
  issuer: string;
  date: string;

  // old field (optional fallback)
  credentialUrl?: string;

  // NEW fields
  certificatePdf?: string; // link to certificate PDF
  gradePdf?: string;       // link to grade/result PDF
};

type ProjectLink = { label: string; url: string };
type Badge = { title: string; date: string; duration: string; shareUrl: string; img: string };

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

// Helpers to safely link PDFs with spaces in filenames
const BASE = import.meta.env.BASE_URL;
const certPdf = (fileName: string) => `${BASE}pdfs/certs/${encodeURIComponent(fileName)}`;
const gradePdf = (fileName: string) => `${BASE}pdfs/certs/grades/${encodeURIComponent(fileName)}`;



// ✅ NEW: helpers for images + docs (projects thumbnails + project PDFs)
const img = (fileName: string) => `${BASE}projects/${encodeURIComponent(fileName)}`;
const doc = (fileName: string) =>`${BASE}pdfs/${encodeURIComponent(fileName)}`;



const DATA = {
  profile: {
    name: "Weber Laurence",
    title: "BTS Cloud Computing Student",
    location: "Luxembourg",
    about:
      "I’m a Cloud Computing student passionate about systems, virtualization, and building practical projects. I enjoy working with Linux/Windows, Docker, cloud platforms, and automation.",
    email: "Weber.lori27@gmail.com",
    linkedin: "https://www.linkedin.com/in/laurence-weber-51b551330/",
    cv: {
      en: `${BASE}cv/CV_ENG.pdf`,
      fr: `${BASE}cv/CV_FR.pdf`,
    },
    avatarUrl: `${BASE}img/weber.jpg`,
  },

  skills: [
    { name: "Linux" },
    { name: "Windows Server / AD"},
    { name: "Docker"},
    { name: "Networking"},
    { name: "Azure fundamentals"},
    { name: "AWS fundamentals"},
    { name: "Python (Basics)"},
    { name: "PowerShell (Basics)"},
    { name: "Kubernetes"},
    { name: "Terraform"},
    { name: "Ansible"},
    { name: "Prometheus & Grafana" },
    { name: "SQL" },
  ] as Skill[],

  softSkills: ["Teamwork", "Organization", "Problem solving", "Adaptability", "Autonomous work"] as string[],

  certifications: {
    pluralsight: [
      { title: "Pluralsight: Docker Fundamentals", issuer: "Pluralsight", date: "2025-05", credentialUrl: "#" },
      { title: "Pluralsight: Linux Administration", issuer: "Pluralsight", date: "2025-06", credentialUrl: "#" },
    ] as Cert[],

    office365: [
      {
        title: "Microsoft Word",
        issuer: "Microsoft",
        date: "2025-09",
        certificatePdf: certPdf("word_associate.pdf"),
        gradePdf: gradePdf("Microsoft specialist -Associate.pdf"),
      },
      {
        title: "Microsoft Word Expert",
        issuer: "Microsoft",
        date: "2025-09",
        certificatePdf: certPdf("word_expert.pdf"),
        gradePdf: gradePdf("Microsoft word expert grades.pdf"),
      },
      {
        title: "Microsoft PowerPoint",
        issuer: "Microsoft",
        date: "2025-09",
        certificatePdf: certPdf("Powerpoint.pdf"),
        gradePdf: gradePdf("Microsoft powerpoints grades.pdf"),
      },
      {
        title: "Microsoft Excel",
        issuer: "Microsoft",
        date: "2025-09",
        certificatePdf: certPdf("Excel.pdf"),
        gradePdf: gradePdf("Microsoft Excel grades.pdf"),
      },
      {
        title: "Microsoft office specialist",
        issuer: "Microsoft",
        date: "2025-09",
        certificatePdf: certPdf("Microsoft specialist - Associate.pdf"),
        credentialUrl: "#",
      },
    ] as Cert[],

    azure: [
      {
        title: "Microsoft Azure Fundamentals (AZ-900)",
        issuer: "Microsoft",
        date: "2025-10",
        credentialUrl: "#",
      },
    ] as Cert[],
  },

  pluralsightBadges: [
    {
      title: "Maintaining, Monitoring and Troubleshooting Kubernetes",
      date: "October 8th 2025",
      duration: "2h 14m",
      shareUrl: "https://app.pluralsight.com/achievements/share/a6122542-2e38-43d2-ac25-7bec7a589a1f",
      img: "https://pluralsight2.imgix.net/achievements/assets/badges/content-completion/courses/business-skills-catch-all/intermediate/enabled-light.4ffd2a.png",
    },
    {
      title: "Certified Kubernetes Administrator: Kubernetes Foundations",
      date: "October 7th 2025",
      duration: "42m",
      shareUrl: "https://app.pluralsight.com/achievements/share/46941e9f-78ec-4b3b-b7a7-37ff06056b86",
      img: "https://pluralsight2.imgix.net/achievements/assets/badges/content-completion/courses/business-skills-catch-all/beginner/enabled-light.71eed8.png",
    },
    {
      title: "AWS Networking Fundamentals",
      date: "September 28th 2025",
      duration: "45m",
      shareUrl: "https://app.pluralsight.com/achievements/share/8620729f-8ac3-42ce-a8bc-2f071b4b2faf",
      img: "https://pluralsight2.imgix.net/achievements/assets/badges/content-completion/courses/business-skills-catch-all/beginner/enabled-light.71eed8.png",
    },
    {
      title: "Cloud-native Architecture and Design Principles",
      date: "May 5th 2025",
      duration: "25m",
      shareUrl: "https://app.pluralsight.com/achievements/share/d81e8a5a-74ba-45f7-b997-cc67a4b137cf",
      img: "https://pluralsight2.imgix.net/achievements/assets/badges/content-completion/courses/business-skills-catch-all/beginner/enabled-light.71eed8.png",
    },
    {
      title: "Cloud Computing Foundations",
      date: "April 29th 2025",
      duration: "",
      shareUrl: "https://app.pluralsight.com/achievements/share/0174d250-7175-48ac-98b8-f64a8492b5cf",
      img: "https://pluralsight2.imgix.net/achievements/assets/badges/content-completion/courses/it-and-cloud/beginner/enabled-light.fa8919.png",
    },
    {
      title: "Cloud Computing Fundamentals: Cloud Concepts",
      date: "April 28th 2025",
      duration: "1h 35m",
      shareUrl: "https://app.pluralsight.com/achievements/share/4a80e932-7ad0-468a-b7a7-3bceab823fa2",
      img: "https://pluralsight2.imgix.net/achievements/assets/badges/content-completion/courses/it-and-cloud/beginner/enabled-light.e1cf24.png",
    },
    {
      title: "Terraform: Getting Started",
      date: "January 31st 2026",
      duration: "1h 37m",
      shareUrl: "https://app.pluralsight.com/achievements/share/56fdd8dd-c22f-48a9-a418-464ba2304929",
      img: "https://pluralsight2.imgix.net/achievements/assets/badges/content-completion/courses/it-and-cloud/beginner/enabled-light.e1cf24.png",
    },
  ] as Badge[],

  inProgress: ["Microsoft Azure Security Az-500", "Microsoft Azure Fundamentals AZ-900"],

  
  projects: [
    {
      id: "moviestream",
      title: "MovieStream: Media Streaming Platform",
      tags: ["Kubernetes", "Docker", "Jellyfin", "Linux"],
      date: "2026-01",
      thumbnail: img("moviestream.png"), 
      summary:
        "Deployed a containerized media streaming platform using Kubernetes and Docker. Jellyfin was used as the media service and storage layer to host and stream movie content across the network.",
      details: [
        "Built and deployed a Kubernetes-based application stack for media streaming",
        "Containerized services using Docker and managed deployments with Kubernetes manifests",
        "Deployed Jellyfin as the media server for hosting and streaming movie content",
        "Configured persistent storage for Jellyfin to keep media data and configuration",
        "Set up networking and service exposure (ClusterIP/NodePort or Ingress depending on setup)",
        "Tested streaming access from client devices and validated performance/stability",
      ],
      
    },

    {
      id: "sushi-wizard",
      title: "Sushi Wizard: Cloud-based Sushi Ordering Application",
      tags: ["AWS", "Lambda", "API Gateway", "DynamoDB", "Web Development", "Microservices"],
      date: "2025-05",
      thumbnail: img("sushi-wizard.png"),
      summary:
        "Cloud-based web application allowing users to log in, browse sushi items, submit preferences, and receive personalized ordering options. The project focuses on integrating frontend components with AWS cloud services using a microservice-based architecture.",
      details: [
        "Designed and developed a web application for sushi browsing and preference-based ordering",
        "Implemented user login functionality using AWS Lambda and Amazon DynamoDB",
        "Connected frontend to backend services through Amazon API Gateway",
        "Designed and deployed a cloud database structure for storing users and preferences",
        "Used AWS CLI for backend configuration and database interaction",
        "Implemented a rating and preference system for users",
        "Managed project planning and progress tracking using ClickUp",
        "Performed debugging, testing, and integration between frontend and cloud services",
      ],
    },

    {
      id: "hypervisor-compare",
      title: "Type 1 Hypervisor Comparison (XCP-ng vs Proxmox)",
      tags: ["Virtualization", "Clustering", "Storage"],
      date: "2025-04",
      thumbnail: img("XCP-PROX.png"),
      summary:
        "Server virtualization project comparing XCP-ng and Proxmox VE across VM lifecycle management, clustering, storage integration, and automation.",
      details: [
        "Installed and configured XCP-ng and Proxmox VE on two physical servers",
        "Created and managed Windows and Linux virtual machines",
        "Implemented snapshots, backups, cloning, and live migration",
        "Integrated NAS storage using SMB, NFS, and iSCSI protocols",
        "Configured clustering and user permission management",
        "Developed CLI automation scripts for VM provisioning and monitoring",
        "Compared performance, usability, and automation capabilities between both platforms",
      ],
      links: [{ label: "Report", url:  doc("Virtualizaton.pdf") }],
    },

    {
      id: "itmos-checkmk",
      title: "Monitoring with Checkmk",
      tags: ["Monitoring", "Checkmk", "Proxmox", "SNMP", "SMTP", "Ubuntu"],
      date: "2026-01",
      thumbnail: img("checkmk.png"), 
      summary: "Deployed a centralized monitoring solution using Checkmk to monitor Proxmox hosts and VMs.",
      details: [
        "Deployed Checkmk Raw Edition on an Ubuntu VM as the monitoring server.",
        "Monitored a Proxmox host + multiple VMs with VM awareness (Proxmox integration).",
        "Implemented agent-based monitoring for Linux hosts and SNMP monitoring for a printer.",
        "Configured notifications/alerts via SMTP and created dashboards for visualization.",
      ],
    },
  ] as Project[],
};


function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="w-full px-4 py-6 flex-1">
        <div className="mx-auto w-[min(1100px,92%)]">{children}</div>
      </main>
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
          My Portfolio
        </Link>

        <nav className="flex flex-wrap gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }: { isActive: boolean }) => `${linkBase} ${isActive ? active : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/certifications"
            className={({ isActive }: { isActive: boolean }) => `${linkBase} ${isActive ? active : ""}`}
          >
            Certifications
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }: { isActive: boolean }) => `${linkBase} ${isActive ? active : ""}`}
          >
            Projects
          </NavLink>

          <NavLink to="/extras" className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}>
            Extras
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }: { isActive: boolean }) => `${linkBase} ${isActive ? active : ""}`}
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
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] " + className
      }
    >
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

function SkillBar({ name }: Skill) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
      <strong className="text-slate-200">{name}</strong>
    </div>
    );
  }


function BtnLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20"
    >
      {children}
    </Link>
  );
}

function BtnA({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20 ${
        props.className ?? ""
      }`}
    >
      {children}
    </a>
  );
}

const BTN_STYLE =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 text-slate-200 px-3 py-2 text-sm transition hover:bg-slate-800 hover:border-white/20";


function Btn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={BTN_STYLE}>
      {children}
    </button>
  );
}

/** Skills Modal (inside App.tsx so no import path issues) */
function SkillsModal({
  open,
  onClose,
  technicalSkills,
  softSkills,
}: {
  open: boolean;
  onClose: () => void;
  technicalSkills: Skill[];
  softSkills: string[];
}) {
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* background */}
    <div className="absolute inset-0 bg-black/60" onClick={onClose} />

    {/* modal */}
    <div className="relative z-10 w-full max-w-5xl max-h-[85vh] rounded-2xl border border-white/10 bg-slate-950 shadow-xl flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-extrabold">All Skills</h2>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20"
        >
          Close
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="overflow-y-auto px-6 py-6 grid gap-8 lg:grid-cols-2">

        <section>
          <h3 className="text-lg font-extrabold">Technical Skills</h3>
          <div className="mt-3 grid gap-3">
            {technicalSkills.map((s) => (
              <SkillBar key={s.name} {...s} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-extrabold">Soft Skills</h3>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <ul className="grid gap-2 sm:grid-cols-2">
              {softSkills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </div>
  </div>
);


}

/** Pages */
function Home() {
  const [skillsOpen, setSkillsOpen] = useState(false);

  const certPeek = useMemo(() => {
    const all = [...DATA.certifications.office365, ...DATA.certifications.azure];
    return all.slice(0, 4);
  }, []);

  const projPeek = useMemo(() => DATA.projects.slice(0, 3), []);
  const skillPeek = useMemo(() => DATA.skills.slice(0, 6), []);


  return (
    <>
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
            <BtnA href={DATA.profile.cv.en} target="_blank" rel="noreferrer">
              View CV
            </BtnA>
          </div>
        </Card>

        <Card>
          <div className="text-slate-300">Profile</div>
          <img src={DATA.profile.avatarUrl} alt="profile" className="mx-auto w-56 h-auto object-contain rounded-2xl" />
          <div className="mx-auto mt-4 w-64 h-auto rounded-2xl border border-white/10 object-contain" />
        </Card>
      </section>

      <section className="mt-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Skills</h2>
        <Btn onClick={() => setSkillsOpen(true)}>See all</Btn>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skillPeek.map((s) => (
          <SkillBar key={s.name} {...s} />
        ))}
      </div>

      <SkillsModal
        open={skillsOpen}
        onClose={() => setSkillsOpen(false)}
        technicalSkills={DATA.skills}
        softSkills={DATA.softSkills}
      />
    </section>


      <section className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold">Certifications</h2>
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
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold">Curriculum Vitae</div>
          </div>

          <div className="flex gap-2">
            <a
              href={DATA.profile.cv.en}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20"
            >
              English version
            </a>

            <a
              href={DATA.profile.cv.fr}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-white/20"
            >
              French version
            </a>
          </div>
        </Card>
      </section>

      <section className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold">Projects</h2>
          <BtnLink to="/projects">See all</BtnLink>
        </div>

        <div className="mt-3 grid gap-3">
          {projPeek.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 md:grid-cols-[140px_1fr]"
            >
              <img
                src={p.thumbnail}
                alt={`${p.title} thumbnail`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = img("project-placeholder.png");
                }}
              />
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
    </>
  );
}

function Certifications() {
  const official = [...DATA.certifications.office365];
  const inProgress = DATA.inProgress ?? [];

  return (
    <>
      <Card>
        <h1 className="text-2xl font-extrabold">Certifications</h1>
        <p className="mt-2 text-slate-400">List of my Certifications and Badges</p>
      </Card>

      <section className="mt-8">
        <h2 className="text-xl font-extrabold">Official Certifications</h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {official.length ? (
            official.map((c) => (
              <Card key={c.title} className="flex flex-col gap-3">
                <div>
                  <div className="font-extrabold">{c.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {c.issuer} • {c.date}
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {c.certificatePdf ? (
                    <BtnA
                      href={c.certificatePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-500/15 border-blue-400/20 hover:border-blue-300/30"
                    >
                      Certificate
                    </BtnA>
                  ) : null}

                  {c.gradePdf ? (
                    <BtnA href={c.gradePdf} target="_blank" rel="noreferrer">
                      Grades
                    </BtnA>
                  ) : null}

                  {!c.certificatePdf && !c.gradePdf && c.credentialUrl ? (
                    <BtnA href={c.credentialUrl} target="_blank" rel="noreferrer">
                      View
                    </BtnA>
                  ) : null}
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed text-slate-400">No official certifications added yet.</Card>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold">Unofficial Certifications</h2>
        <p className="mt-1 text-sm text-slate-400">Course completion badges and training achievements (Pluralsight).</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DATA.pluralsightBadges?.length ? (
            DATA.pluralsightBadges.map((b) => (
              <Card key={b.shareUrl} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 object-contain p-2"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="font-extrabold leading-snug">{b.title}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      {b.date}
                      {b.duration ? ` • ${b.duration}` : ""}
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <BtnA href={b.shareUrl} target="_blank" rel="noreferrer">
                    View on Pluralsight
                  </BtnA>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed text-slate-400">No unofficial certifications added yet.</Card>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold">In Progress</h2>
        <p className="mt-1 text-sm text-slate-400">Topics and certifications I’m currently working on.</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inProgress.length ? (
            inProgress.map((item) => (
              <Card key={item} className="border-dashed text-slate-400 flex items-center justify-center p-6 text-center">
                {item}
              </Card>
            ))
          ) : (
            <Card className="border-dashed text-slate-400">Nothing listed as in progress yet.</Card>
          )}
        </div>
      </section>
    </>
  );
}


function Projects() {
  const [q, setQ] = useState("");
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new"); // default: newest first

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    const filteredProjects = !query
      ? DATA.projects
      : DATA.projects.filter((p) =>
          `${p.title} ${p.summary} ${p.tags.join(" ")}`.toLowerCase().includes(query)
        );

    // Sort using date (recommended format: "YYYY-MM" or "YYYY-MM-DD")
    const sorted = [...filteredProjects].sort((a, b) => {
      const at = new Date(a.date).getTime();
      const bt = new Date(b.date).getTime();
      return sortOrder === "new" ? bt - at : at - bt; // new->old or old->new
    });

    return sorted;
  }, [q, sortOrder]);

  return (
    <>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">Projects</h1>
            <p className="mt-2 text-slate-400">List of my Projects</p>
          </div>

          
          <Btn
          type="button"
          onClick={() => setSortOrder((s) => (s === "new" ? "old" : "new"))}
        >
          {sortOrder === "new" ? "New → Old" : "Old → New"}
        </Btn>

        </div>

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
              <img
                src={p.thumbnail}
                alt={`${p.title} thumbnail`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // fallback if image missing
                  e.currentTarget.src = img("project-placeholder.png");
                }}
              />
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
    </>
  );
}

function Project() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    <>
      <Card>
        <div className="grid items-center gap-4 md:grid-cols-[260px_1fr]">
          <img
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            className="h-44 w-full rounded-2xl border border-white/10 object-cover"
            onError={(e) => {
              e.currentTarget.src = img("project-placeholder.png");
            }}
          />
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

        {/* ✅ show links if present */}
        {project.links?.length ? (
          <>
            <h2 className="mt-6 text-lg font-extrabold">Links</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.links.map((l) => (
                <BtnA key={l.label} href={l.url} target="_blank" rel="noreferrer">
                  {l.label}
                </BtnA>
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm hover:border-white/20 transition"
          >
            <span>←</span>
            Back
          </button>
        </div>
      </Card>
    </>
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
    <>
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
          <button
            type="submit"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 hover:border-white/20 transition"
          >
            Send
          </button>
        </form>
      </Card>
    </>
  );
}

function AppShell() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<Project />} />
        <Route path="/extras" element={<Extras />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="*"
          element={
            <Card className="border-dashed text-slate-400">
              Page not found.
              <div className="mt-3">
                <BtnLink to="/">Go Home</BtnLink>
              </div>
            </Card>
          }
        />
      </Routes>
    </Layout>
  );
}

/** App Router */
export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}






