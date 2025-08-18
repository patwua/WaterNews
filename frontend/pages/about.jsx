import Head from 'next/head'

export default function About() {
  return (
    <>
      <Head>
        <title>About Us — WaterNews</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>
      <header className="hero">
        <div className="brand-lockup">
          <img className="logo" src="/logo-mini.svg" alt="WaterNews mini logo" />
          <img className="logo-full" src="/logo-waternews.svg" alt="WaterNews full logo with tagline" />
        </div>
        <h1>About WaterNews</h1>
        <p className="tagline">Dive Into Current Stories — giving Guyanese, Caribbean, and diaspora voices a modern platform.</p>
        <div className="waves"></div>
      </header>

      <main className="container">
        <section className="card grid-2 section">
          <div>
            <div className="pill">Our Mission</div>
            <h2>Empower Our Communities with Truth &amp; Story</h2>
            <p className="lead">We deliver authentic, fact-checked news and engaging features that connect the Caribbean and its diaspora — from Georgetown to New York, Toronto and beyond.</p>
            <ul>
              <li>✅ Reliable reporting across current events, politics, and economy</li>
              <li>✅ Opinion &amp; Letters that invite debate and diverse perspectives</li>
              <li>✅ Lifestyle features celebrating culture, food, fashion, and everyday stories</li>
            </ul>
            <div className="cta">
              <a className="btn primary" href="#join">Join Our Team</a>
              <a className="btn outline" href="#suggest">Suggest a Story</a>
              <a className="btn outline" href="#follow">Follow for Updates</a>
            </div>
          </div>
          <div className="illus">
            <p className="hint">[Placeholder: Replace with stock/newsroom image]</p>
          </div>
        </section>

        <section className="section">
          <div className="iconhead">
            <div className="mini"><img src="/logo-mini.svg" alt="mini logo" style={{ width: '24px', height: '24px' }} /></div>
            <div>
              <h2 style={{ margin: 0 }}>Our Story</h2>
              <p className="lead" style={{ margin: '4px 0 0' }}>WaterNews was founded to counter misinformation and center regional voices with a platform designed for modern readers.</p>
            </div>
          </div>
          <div className="card" style={{ marginTop: '12px' }}>
            <p>Stories travel like waves — they echo from the coastlines of Guyana across the Caribbean and through diaspora communities worldwide. WaterNews captures those waves with clarity and context, keeping our readers informed and connected.</p>
          </div>
        </section>

        <section className="section">
          <div className="iconhead">
            <div className="mini"><img src="/logo-mini.svg" alt="mini logo" style={{ width: '24px', height: '24px' }} /></div>
            <div>
              <h2 style={{ margin: 0 }}>What We Publish</h2>
              <p className="lead" style={{ margin: '4px 0 0' }}>News articles, opinion letters, and lifestyle features designed for engagement and credibility.</p>
            </div>
          </div>
          <div className="values" style={{ marginTop: '12px' }}>
            <div className="value">
              <strong>News</strong>
              <p>Reporting on national and regional events, policy, economy, and public interest issues that matter now.</p>
            </div>
            <div className="value">
              <strong>Opinions &amp; Letters</strong>
              <p>Well-argued perspectives that challenge, explain, and invite constructive debate from our community.</p>
            </div>
            <div className="value">
              <strong>Lifestyle</strong>
              <p>Culture, food, fashion, and everyday life — the rhythms that shape who we are.</p>
            </div>
          </div>
        </section>

        <section className="section card" id="team">
          <div className="iconhead">
            <div className="mini"><img src="/logo-mini.svg" alt="mini logo" style={{ width: '24px', height: '24px' }} /></div>
            <h2 style={{ margin: 0 }}>Leadership</h2>
          </div>
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 6px' }}>Tatiana Chow</h3>
              <p className="lead" style={{ margin: '0 0 10px' }}>Editor-in-Chief &nbsp;•&nbsp; Current Events &amp; Lifestyle</p>
              <p>Guyana-born and rooted in regional culture, Tatiana leads WaterNews with a commitment to sharp reporting and inclusive storytelling. Her focus spans current events and lifestyle, bridging local narratives with global relevance.</p>
            </div>
            <div className="illus">
              <p className="hint">[Placeholder for Tatiana’s headshot]</p>
            </div>
          </div>
        </section>

        <section className="section card" id="join">
          <h2>Join Our Team</h2>
          <p className="lead">Writers, photographers, and editors — pitch your voice and help shape regional storytelling.</p>
          <div className="cta">
            <a className="btn primary" href="/apply">Become an Author</a>
            <a className="btn outline" href="#suggest">Suggest a Story</a>
          </div>
        </section>

        <section className="section card" id="suggest">
          <h2>Suggest a Story</h2>
          <p className="lead">See something our readers should know? Send us a tip or a fully formed pitch.</p>
          <div className="cta">
            <a className="btn outline" href="mailto:tips@waternewsgy.com">tips@waternewsgy.com</a>
          </div>
        </section>

        <section className="section card" id="follow">
          <h2>Follow Us for Updates</h2>
          <p className="lead">Get the latest headlines and features as they publish.</p>
          <div className="cta">
            <a className="btn outline" href="#">@WaterNewsGY</a>
            <a className="btn outline" href="#">Facebook</a>
            <a className="btn outline" href="#">Instagram</a>
            <a className="btn outline" href="#">X (Twitter)</a>
          </div>
        </section>
      </main>

      <footer>
        <img src="/logo-mini.svg" alt="WaterNews mini logo" style={{ width: '36px', height: '36px', borderRadius: '999px', verticalAlign: 'middle' }} />
        <div style={{ marginTop: '8px' }}>&copy; 2025 WaterNews — All rights reserved.</div>
      </footer>

      <style jsx>{`
        :root {
          --blue:#0F6CAD;
          --blue2:#1583C2;
          --gold:#F5B231;
          --ink:#0B2B3B;
          --bg:#F7FAFC;
          --muted:#5B7282;
          --card:#ffffff;
        }
        * { box-sizing: border-box; }
        body {
          margin:0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: var(--ink); background: var(--bg);
          line-height: 1.6;
        }
        a { color: var(--blue2); text-decoration: none; }
        header.hero {
          position: relative; color: #fff; min-height: 58vh; display: grid; place-items: center; text-align: center;
          background:
            radial-gradient(1200px 60% at 10% 10%, rgba(21,131,194,0.20), transparent 60%),
            radial-gradient(1000px 70% at 80% 30%, rgba(15,108,173,0.18), transparent 60%),
            linear-gradient(180deg, #0f6cad 0%, #0b5d95 40%, #0a4f7f 100%);
          overflow: hidden;
        }
        .hero .waves {
          position:absolute; inset:auto 0 0 0; height:180px; background:
            radial-gradient(45% 80% at 30% 20%, rgba(255,255,255,.15), transparent 60%),
            linear-gradient(0deg, rgba(255,255,255,.15), rgba(255,255,255,0.0) 60%);
          mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="200" viewBox="0 0 1600 200"><path d="M0 80 C 200 160, 400 0, 600 80 S 1000 160, 1200 80 S 1400 0, 1600 80 V200 H0 Z" fill="black"/></svg>') center/cover no-repeat;
          opacity:.5;
        }
        .brand-lockup {
          display:flex; align-items:center; gap:18px; justify-content: center; margin-bottom:18px;
        }
        .brand-lockup img.logo { width: 58px; height: 58px; border-radius: 999px; background: #fff; padding:6px; box-shadow: 0 6px 18px rgba(0,0,0,.15); }
        h1 { font-size: clamp(32px, 5vw, 54px); margin: 0; font-weight: 800; letter-spacing: -0.02em; }
        .tagline { font-family: Merriweather, Georgia, serif; font-size: clamp(16px, 2.2vw, 20px); opacity:.95; }
        .container { max-width: 1100px; margin: -80px auto 64px; padding: 0 18px; }
        .card { background: var(--card); border-radius: 18px; padding: 28px; box-shadow: 0 10px 30px rgba(15,108,173,0.08); }
        .grid-2 { display:grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px; }
        .grid-3 { display:grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .pill { display:inline-flex; align-items:center; gap:10px; padding:8px 12px; border-radius:999px; background:#e6f2fb; color: var(--blue); font-weight:600; font-size: 13px; }
        .section { margin: 48px 0; }
        h2 { font-size: 28px; margin: 0 0 8px; }
        p.lead { font-size: 18px; color: var(--muted); margin-top: 6px; }
        .iconhead { display:flex; align-items:center; gap:12px; margin-bottom: 8px; }
        .mini { width: 28px; height: 28px; border-radius:999px; background: #eaf4ff; display:grid; place-items:center; overflow:hidden; }
        .values { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .value { background:#fcfdff; border:1px solid #edf2f7; padding:16px; border-radius:14px; }
        .cta { display:flex; flex-wrap:wrap; gap:12px; }
        .btn { padding:12px 16px; border-radius:12px; font-weight:600; border: 1px solid transparent; }
        .btn.primary { background: var(--blue2); color:#fff; }
        .btn.outline { border-color: #cfe6f7; color: var(--blue2); background: #eff7fd; }
        footer { padding: 36px 0 60px; text-align:center; color: #5b7282; }
        .logo-full { max-width: 320px; width: 60%; height:auto; }
        .illus { background: linear-gradient(135deg, #e8f4fd, #f7fbff); border:1px solid #e5eef7; border-radius:16px; padding:16px; display:grid; place-items:center; min-height: 240px; }
        .illus .hint { color:#6b87a0; font-size:14px; }
        @media (max-width: 880px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .container { margin-top: -56px; }
        }
      `}</style>
    </>
  )
}
