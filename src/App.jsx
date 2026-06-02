import { useState, useEffect, useRef } from 'react';
import { projects, skills, categories, experience } from './data';

/* ── Intersection Observer hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '' }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);

  /* navbar scroll */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  /* cursor glow */
  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  /* skills bar animation */
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSkillsVisible(true); obs.unobserve(el); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const navLinks = ['Home', 'About', 'Skills', 'Work', 'Experience', 'Contact'];

  return (
    <>
      {/* Cursor glow */}
      <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />

      {/* ── NAVBAR ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <a href="#home" className="nav-logo">Arun S Babu<span className="dot">.</span></a>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navLinks.map(n => (
            <li key={n}>
              <a href={`#${n.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
                {n}
              </a>
            </li>
          ))}
        </ul>
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-dotgrid" />
        <div className="hero-blob blob1" />
        <div className="hero-blob blob2" />
        <div className="hero-blob blob3" />
        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot" />
            Available for opportunities
          </div>
          <h1 className="hero-title">
            Crafting Digital<br />
            <span className="gradient-text">Experiences</span>
          </h1>
          <p className="hero-sub">
            UI/UX Designer with 3+ years of experience turning complex problems into intuitive, elegant digital products that users love.
          </p>
          <div className="hero-buttons">
            <a href="#work" className="btn-primary">View Projects →</a>
            <a href="#contact" className="btn-ghost">Get in Touch</a>
          </div>
          <div className="stats-row">
            {[
              ['3+', 'Years Experience'],
              ['35+', 'Projects Delivered'],
              ['7+', 'Industry Verticals'],
              ['100%', 'User-Centric'],
            ].map(([v, l]) => (
              <div className="stat" key={l}>
                <div className="stat-value">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="section" id="about">
        <Reveal>
          <div className="about-grid">
            <div className="about-text">
              <p className="section-label">About Me</p>
              <h2 className="section-title">Designing with purpose &amp; precision.</h2>
              <p>
                I'm Arun S Babu — a passionate UI/UX Designer based in Kerala, India.
                With a background spanning interior design and digital product design,
                I bring a unique spatial awareness and aesthetic sensibility to every screen I craft.
              </p>
              <p>
                Over 3+ years I've worked across healthcare, e-commerce, SaaS, POS, and
                corporate domains — always focusing on user-centric solutions that balance
                business goals with delightful experiences. I thrive in collaborative, agile
                environments where design and development move in lockstep.
              </p>
              <div className="about-pills">
                {['Figma', 'Auto Layout', 'Design Systems', 'Prototyping'].map(t => (
                  <span className="pill" key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="avatar-card">
              <div className="avatar-orbit">
                <span className="orbit-label">Figma</span>
                <span className="orbit-label">XD</span>
                <span className="orbit-label">PS</span>
                <span className="orbit-label">AI</span>
              </div>
              <div className="monogram">A</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── SKILLS ── */}
      <section className="section" id="skills" ref={skillsRef}>
        <Reveal>
          <p className="section-label">Toolkit</p>
          <h2 className="section-title">Core Skills</h2>
          <div className="skills-grid">
            {skills.map(s => (
              <div className="skill-item" key={s.name}>
                <div className="skill-header">
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-pct">{s.pct}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{ width: skillsVisible ? `${s.pct}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="category-grid">
            {categories.map(c => (
              <div className="category-card" key={c.title}>
                <h4>{c.title}</h4>
                <ul>
                  {c.items.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── PROJECTS ── */}
      <section className="section" id="work">
        <Reveal>
          <p className="section-label">Portfolio</p>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">A selection of projects I've designed across various domains and platforms.</p>
        </Reveal>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <Reveal key={i}>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  '--card-color': p.color,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color + '55';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${p.color}22`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div className="project-top">
                  <span className="project-emoji">{p.emoji}</span>
                  <span className="project-arrow">↗</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tags">
                  {p.tags.map(t => (
                    <span
                      key={t}
                      className="project-tag"
                      style={{
                        background: p.color + '15',
                        color: p.color,
                        border: `1px solid ${p.color}30`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="section" id="experience">
        <Reveal>
          <p className="section-label">Journey</p>
          <h2 className="section-title">Experience</h2>
        </Reveal>
        <div className="timeline">
          {experience.map((job, i) => (
            <Reveal key={i}>
              <div className="timeline-item">
                <div className="timeline-dot" style={{ borderColor: job.color }} />
                <div className="timeline-card">
                  <div className="timeline-role">{job.role}</div>
                  <div className="timeline-company" style={{ color: job.color }}>
                    {job.company}, {job.location}
                  </div>
                  <span
                    className="timeline-date"
                    style={{
                      background: job.color + '15',
                      color: job.color,
                      border: `1px solid ${job.color}30`,
                    }}
                  >
                    {job.date}
                  </span>
                  <ul>
                    {job.points.map((pt, j) => <li key={j}>{pt}</li>)}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact" id="contact">
        <Reveal>
          <p className="section-label">Let's Talk</p>
          <h2 className="section-title">Ready to build something great?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 0' }}>
            I'm always excited to collaborate on meaningful projects. Whether you need a full product design, a design system overhaul, or just want to chat about UX — let's connect.
          </p>
          <div className="contact-buttons">
            <a href="mailto:arunsbabu.job@gmail.com" className="btn-primary">
              Say Hello →
            </a>
            <a
              href="https://www.linkedin.com/in/arun-s-babu-20b1881ba/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              LinkedIn Profile
            </a>
          </div>
          <p className="contact-phone">✉️ arunsbabu.job@gmail.com &nbsp;|&nbsp; ✉️ arunworkmail25@gmail.com</p>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">Arun S Babu<span className="dot">.</span></div>
        <div className="footer-copy">© {new Date().getFullYear()} Arun S Babu. All rights reserved.</div>
        <div className="footer-tagline">Designed with ♥ in Kerala</div>
      </footer>
    </>
  );
}
