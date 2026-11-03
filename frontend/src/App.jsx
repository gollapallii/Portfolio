import { useEffect, useState } from "react";

const NAV = ["About", "Skills", "Projects", "Journey", "Contact"];

function Hero({ d }) {
  const preview = {
    name: d.name,
    role: d.role,
    location: d.location,
    skills: Object.values(d.skills).flat().length,
    projects: d.projects.length,
  };
  return (
    <header className="hero" id="top">
      <div className="hero-text">
        <h1>
          Hi, I'm {d.name}. I build web apps that are easy to use.
        </h1>
        <p className="lead">{d.summary}</p>
        <div className="actions">
          <a className="btn primary" href="#projects">See my projects</a>
          <a className="btn" href="#contact">Contact me</a>
        </div>
      </div>
      <figure className="api" aria-label="Live response from the Django API">
        <figcaption><b>GET</b> /api/portfolio/ <span className="ok">200 OK</span></figcaption>
        <pre>{JSON.stringify(preview, null, 2)}</pre>
        <p>This page is React. Its content is served by Django.</p>
      </figure>
    </header>
  );
}

function Skills({ d }) {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="skill-grid">
        {Object.entries(d.skills).map(([group, items]) => (
          <div key={group} className="skill-group">
            <h3>{group}</h3>
            <ul className="chips">{items.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        ))}
      </div>
      <p className="strengths">Strengths: {d.strengths.join(", ")}.</p>
    </section>
  );
}

function Projects({ d }) {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="project-list">
        {d.projects.map((p) => (
          <article key={p.title} className="project">
            <div>
              <h3>{p.title}</h3>
              <p className="meta">{p.type}</p>
              <ul className="chips small">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <ul className="points">{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Journey({ d }) {
  return (
    <section id="journey">
      <h2>Journey</h2>
      <ol className="timeline">
        {d.journey.map((j) => (
          <li key={j.title}>
            <span className="when">{j.when}</span>
            <h3>{j.title}</h3>
            <p>{j.where}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Contact({ d }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState({ status: "idle", text: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function send(e) {
    e.preventDefault();
    setState({ status: "sending", text: "Sending message..." });
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Message not sent.");
      setForm({ name: "", email: "", message: "" });
      setState({ status: "ok", text: "Message sent. I'll reply by email." });
    } catch (err) {
      setState({ status: "err", text: err.message });
    }
  }

  return (
    <section id="contact">
      <h2>Contact</h2>
      <div className="contact">
        <div>
          <p className="lead">Open to entry-level frontend and full stack roles.</p>
          <ul className="links">
            <li><a href={`mailto:${d.email}`}>{d.email}</a></li>
            <li><a href={`tel:${d.phone}`}>{d.phone}</a></li>
            <li><a href={d.github} target="_blank" rel="noreferrer">github.com/gollapallii</a></li>
            <li>{d.location}</li>
          </ul>
        </div>
        <form onSubmit={send}>
          <label>Name<input value={form.name} onChange={set("name")} required autoComplete="name" /></label>
          <label>Email<input type="email" value={form.email} onChange={set("email")} required autoComplete="email" /></label>
          <label>Message<textarea rows="4" value={form.message} onChange={set("message")} required /></label>
          <button className="btn primary" disabled={state.status === "sending"}>Send message</button>
          <p className={`status ${state.status}`} role="status">{state.text}</p>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/portfolio/")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError("Could not reach the Django server. Start it with: python manage.py runserver"));
  }, []);

  if (error) return <p className="state">{error}</p>;
  if (!data) return <p className="state">Loading portfolio...</p>;

  return (
    <>
      <nav className="nav">
        <a href="#top" className="brand">SR</a>
        <ul>{NAV.map((n) => <li key={n}><a href={`#${n.toLowerCase()}`}>{n}</a></li>)}</ul>
      </nav>
      <main>
        <Hero d={data} />
        <Skills d={data} />
        <Projects d={data} />
        <Journey d={data} />
        <Contact d={data} />
      </main>
      <footer>© 2026 {data.name}. Built with React and Django.</footer>
    </>
  );
}
