// Addtional Experience.tsx
import React from "react";

type Workshop = {
  title: string;
  date: string;
  description: string;
  tags: string[];
};

const WORKSHOPS: Workshop[] = [
  {
    title: "ITIL ",
    date: "2025",
    description:
      "Introduction to ITIL concepts: IT service management, incidents, changes, and service lifecycle principles.",
    tags: ["ITIL", ],
  },
  {
    title: "Regulation ",
    date: "2025",
    description:
      "Covered IT regulations and compliance topics such as data protection principles, responsibilities, and good practices in IT environments.",
    tags: ["Regulation", "Compliance", "Data Protection"],
  },
  {
    title: "AWS Workshop",
    date: "2025",
    description:
      "Hands-on introduction to AWS fundamentals: core services, basic cloud architecture, and common use cases.",
    tags: ["AWS", "Cloud", "Architecture"],
  },
  {
    title: "Microsoft Azure Fundamentals (AZ-900) Workshop",
    date: "2025",
    description:
      "Azure cloud basics: core services, pricing concepts, governance, and security fundamentals aligned with AZ-900 objectives.",
    tags: ["Azure", "AZ-900", "Fundamentals"],
  },
  {
    title: "Microsoft Azure Administrator (AZ-104) Workshop",
    date: "2025",
    description:
      "Azure admin tasks: VMs, networking, storage, identity, and resource management aligned with AZ-104 objectives.",
    tags: ["Azure", "AZ-104", "Administration"],
  },
  {
    title: "AI Workshop",
    date: "2025",
    description:
      " Hands-on AI workshop where we worked with Nostra AI and developed a chatbot.",
    tags: ["AI", "Machine Learning", "Automation"],
  },
  {
    title: "Blockchain",
    date: "2025",
    description:
        "Introduction to blockchain technology and its core concepts",
    tags: ["Blockchain", "Distributed Systems", "Security"],
  },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"rounded-2xl border border-white/10 bg-white/[0.03] p-6 " + className}>{children}</div>;
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-slate-300">
      {children}
    </span>
  );
}

export default function Extras() {
  return (
    <div className="grid gap-6">
      <Card>
        <h1 className="text-2xl font-extrabold">Addtional Experience</h1>
        <p className="mt-2 text-slate-400">Workshops and learning experiences outside the classroom.</p>
      </Card>

      <section>
        <h2 className="text-xl font-extrabold">Workshops</h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSHOPS.map((w) => (
            <Card key={w.title} className="flex flex-col gap-3">
              <div>
                <div className="font-extrabold">{w.title}</div>
                <div className="mt-1 text-sm text-slate-400">{w.date}</div>
              </div>

              <p className="text-sm text-slate-300">{w.description}</p>

              <div className="mt-auto flex flex-wrap gap-2">
                {w.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-extrabold">Excursions</h2>
        <p className="mt-1 text-sm text-slate-400">
          Educational visits with my class to explore real-world IT environments.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="font-extrabold">LuxConnect</div>
            <div className="mt-2 text-sm text-slate-400">
              A class visit to a datacenter to learn about infrastructure, security, cooling, and operations.
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}


