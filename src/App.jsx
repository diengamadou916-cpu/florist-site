import { useState, useEffect, useRef } from "react";
import flowersImg from "./assets/angelina-jollivet-mNEpmNiFdXs-unsplash.jpg";
/* ─── Palette & tokens ─────────────────────────────────────── */
const C = {
  cream:    "#F7F3EE",
  parchment:"#EDE7DC",
  sage:     "#3D4F3C",
  sageLight:"#5A7059",
  moss:     "#2B3B2A",
  charcoal: "#1C1C1C",
  dust:     "#9B9086",
  blush:    "#D9BFB0",
  gold:     "#C4A882",
  white:    "#FFFFFF",
};

/* ─── Google Fonts injection ────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.cream}; font-family: 'Jost', sans-serif; color: ${C.charcoal}; overflow-x: hidden; }

    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body    { font-family: 'Jost', sans-serif; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.parchment}; }
    ::-webkit-scrollbar-thumb { background: ${C.gold}; border-radius: 2px; }

    /* Fade-in on scroll */
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.85s cubic-bezier(.22,1,.36,1), transform 0.85s cubic-bezier(.22,1,.36,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1); }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1); }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }

    /* Stagger children */
    .stagger > * { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .stagger.visible > *:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:.05s; }
    .stagger.visible > *:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:.18s; }
    .stagger.visible > *:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:.31s; }
    .stagger.visible > *:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:.44s; }

    /* Image hover zoom */
    .img-zoom { overflow: hidden; }
    .img-zoom img { transition: transform 0.9s cubic-bezier(.22,1,.36,1); }
    .img-zoom:hover img { transform: scale(1.06); }

    /* Nav link underline */
    .nav-link { position: relative; }
    .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:${C.gold}; transition: width 0.35s ease; }
    .nav-link:hover::after { width:100%; }

    /* Btn primary */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: ${C.moss}; color: ${C.cream};
      padding: 14px 36px; font-family:'Jost',sans-serif; font-weight:400; font-size:13px;
      letter-spacing: 0.14em; text-transform: uppercase;
      border: none; cursor: pointer;
      transition: background 0.3s, letter-spacing 0.3s;
    }
    .btn-primary:hover { background: ${C.sageLight}; letter-spacing: 0.2em; }

    /* Btn ghost */
    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; color: ${C.charcoal};
      padding: 13px 34px; font-family:'Jost',sans-serif; font-weight:400; font-size:13px;
      letter-spacing: 0.14em; text-transform: uppercase;
      border: 1px solid ${C.charcoal}; cursor: pointer;
      transition: background 0.3s, color 0.3s;
    }
    .btn-ghost:hover { background: ${C.charcoal}; color: ${C.cream}; }

    /* Card hover */
    .arrangement-card { transition: transform 0.4s ease; }
    .arrangement-card:hover { transform: translateY(-6px); }
    .arrangement-card:hover .card-label { color: ${C.gold}; }

    /* Testimonial card */
    .testimonial-card { transition: box-shadow 0.4s ease; }
    .testimonial-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.10); }

    /* Input focus */
    .elegant-input {
      background: transparent; border: none; border-bottom: 1px solid ${C.dust};
      padding: 12px 0; font-family:'Jost',sans-serif; font-size:14px; color:${C.charcoal};
      width:100%; outline:none; transition: border-color 0.3s;
    }
    .elegant-input::placeholder { color: ${C.dust}; }
    .elegant-input:focus { border-color: ${C.moss}; }

    /* Marquee */
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .marquee-track { display:flex; width: max-content; animation: marquee 28s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }

    /* Hero ken burns */
    @keyframes kenBurns { 0%{transform:scale(1.08) translateX(0)} 100%{transform:scale(1) translateX(-1%)} }
    .ken-burns { animation: kenBurns 18s ease-out forwards; }

    /* Line separator */
    .line-gold { height:1px; background: linear-gradient(90deg, transparent, ${C.gold}, transparent); }

    /* Section label */
    .section-label {
      font-family:'Jost',sans-serif; font-size:11px; letter-spacing:0.22em;
      text-transform:uppercase; color:${C.dust};
    }
  `}</style>
);

/* ─── Unsplash placeholder image URLs ──────────────────────── */
const IMGS = {
  hero:      "https://images.unsplash.com/photo-1490750967868-88df5691cc27?w=1800&q=80&fit=crop",
  about:     "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=80&fit=crop",
  arr1:      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=700&q=80&fit=crop",
  arr2:      "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=700&q=80&fit=crop",
  arr3:      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=700&q=80&fit=crop",
  arr4:      "https://images.unsplash.com/photo-1487530811015-780abb85-3-f2e2?w=700&q=80&fit=crop",
  seasonal:  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=80&fit=crop",
  sub:       "https://images.unsplash.com/photo-1444930694458-01babf71abde?w=900&q=80&fit=crop",
  gal1:      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&q=80&fit=crop",
  gal2:      "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=600&q=80&fit=crop",
  gal3: flowersImg, 
  gal4:      "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=600&q=80&fit=crop",
  gal5:      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=80&fit=crop",
};

/* ─── useReveal hook ────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .stagger");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════════ */
/*  COMPONENTS                                                  */
/* ═══════════════════════════════════════════════════════════ */

/* ─── Navigation ────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      padding: scrolled ? "16px 48px" : "28px 48px",
      background: scrolled ? "rgba(247,243,238,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.parchment}` : "none",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      transition:"all 0.45s ease",
    }}>
      {/* Logo */}
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:500, letterSpacing:"0.06em", color: scrolled ? C.charcoal : C.white }}>
        Flore<span style={{ color: C.gold }}>.</span>
      </div>

      {/* Desktop links */}
      <div style={{ display:"flex", gap:"40px", alignItems:"center" }}>
        {["Philosophie","Créations","Galerie","Services"].map(l => (
          <span key={l} className="nav-link" style={{ fontFamily:"'Jost',sans-serif", fontSize:"12px", letterSpacing:"0.16em", textTransform:"uppercase", color: scrolled ? C.charcoal : "rgba(255,255,255,0.85)", cursor:"pointer" }}>
            {l}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button className="btn-primary" style={{ padding:"11px 28px", fontSize:"11px" }}>
        Réserver
      </button>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ position:"relative", height:"100vh", minHeight:"700px", overflow:"hidden", background:"#1a1a18" }}>
      {/* bg image */}
      <img
        src={IMGS.hero}
        alt="Floral arrangement"
        className="ken-burns"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.72 }}
      />
      {/* overlay gradient */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(20,20,16,0.35) 0%, rgba(20,20,16,0.1) 50%, rgba(20,20,16,0.55) 100%)" }} />

      {/* Content */}
      <div style={{ position:"relative", zIndex:2, height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"0 24px" }}>
        <p className="section-label reveal" style={{ color:"rgba(255,255,255,0.6)", marginBottom:"32px" }}>
          Studio Floral — Paris
        </p>
        <h1 className="font-display reveal" style={{ fontSize:"clamp(52px,8vw,110px)", fontWeight:300, lineHeight:1.02, color:C.white, maxWidth:"860px", marginBottom:"32px" }}>
          Les fleurs racontent<br />
          <em style={{ fontStyle:"italic", color:C.gold }}>des histoires</em><br />
          que les mots taisent
        </h1>
        <p className="font-body reveal" style={{ fontSize:"15px", fontWeight:300, letterSpacing:"0.04em", color:"rgba(255,255,255,0.72)", maxWidth:"480px", lineHeight:1.8, marginBottom:"52px" }}>
          Chaque arrangement est une composition pensée — une émotion figée dans le temps,
          créée pour les âmes sensibles à la beauté éphémère.
        </p>
        <div className="reveal" style={{ display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:"center" }}>
          <button className="btn-primary">Explorer</button>
          <button className="btn-ghost" style={{ color:C.white, borderColor:"rgba(255,255,255,0.5)" }}>Réserver</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:"absolute", bottom:"36px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", color:"rgba(255,255,255,0.5)" }}>
        <span className="font-body" style={{ fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase" }}>Défiler</span>
        <div style={{ width:"1px", height:"48px", background:"linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
      </div>
    </section>
  );
}

/* ─── Marquee ticker ─────────────────────────────────────────── */
function Marquee() {
  const words = ["Pivoines","•","Dahlias","•","Roses de Jardin","•","Anémones","•","Renoncules","•","Muguet","•","Iris","•","Lisianthus","•"];
  return (
    <div style={{ background:C.moss, padding:"18px 0", overflow:"hidden" }}>
      <div className="marquee-track">
        {[...words,...words].map((w,i) => (
          <span key={i} className="font-display" style={{ fontSize:"15px", fontStyle:"italic", color:C.gold, padding:"0 28px", whiteSpace:"nowrap", fontWeight:300 }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── About ──────────────────────────────────────────────────── */
function About() {
  return (
    <section style={{ padding:"120px 5vw", background:C.cream, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center" }}>
      <div className="reveal-left img-zoom" style={{ borderRadius:"2px", overflow:"hidden", aspectRatio:"4/5" }}>
        <img src={IMGS.about} alt="Studio" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      </div>
      <div className="reveal-right" style={{ maxWidth:"520px" }}>
        <p className="section-label" style={{ marginBottom:"28px" }}>Notre philosophie</p>
        <h2 className="font-display" style={{ fontSize:"clamp(36px,4vw,58px)", fontWeight:300, lineHeight:1.12, color:C.charcoal, marginBottom:"36px" }}>
          L'art floral comme<br /><em style={{ fontStyle:"italic", color:C.sageLight }}>langage vivant</em>
        </h2>
        <div className="line-gold" style={{ width:"60px", marginBottom:"36px" }} />
        <p className="font-body" style={{ fontSize:"15px", fontWeight:300, lineHeight:1.9, color:C.dust, marginBottom:"24px" }}>
          Fondé à Paris en 2018, Flore. est un studio de création florale qui travaille à la frontière
          entre l'art contemporain et la nature sauvage. Chaque pièce est pensée comme une œuvre — organique, éphémère, irremplaçable.
        </p>
        <p className="font-body" style={{ fontSize:"15px", fontWeight:300, lineHeight:1.9, color:C.dust, marginBottom:"44px" }}>
          Nous travaillons avec des producteurs locaux, des variétés rares, et une sensibilité éditoriale
          forgée par des années à côtoyer les plus grands studios de mode et de décoration.
        </p>
        <button className="btn-ghost">Découvrir l'atelier</button>
      </div>
    </section>
  );
}

/* ─── Featured Arrangements ──────────────────────────────────── */
function Arrangements() {
  const cards = [
    { img: IMGS.arr1, title:"Songe d'Été",  tag:"Mariage", price:"À partir de 280€" },
    { img: IMGS.arr2, title:"Nocturne",     tag:"Événement", price:"À partir de 190€" },
    { img: IMGS.arr3, title:"Première Neige", tag:"Maison", price:"À partir de 95€" },
  ];
  return (
    <section style={{ padding:"100px 5vw", background:C.parchment }}>
      <div className="reveal" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"72px", flexWrap:"wrap", gap:"24px" }}>
        <div>
          <p className="section-label" style={{ marginBottom:"16px" }}>Créations vedettes</p>
          <h2 className="font-display" style={{ fontSize:"clamp(32px,4vw,54px)", fontWeight:300, lineHeight:1.1 }}>
            Compositions<br /><em style={{ fontStyle:"italic", color:C.sageLight }}>signature</em>
          </h2>
        </div>
        <button className="btn-ghost" style={{ alignSelf:"flex-end" }}>Voir tout le catalogue</button>
      </div>

      <div className="stagger" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px,1fr))", gap:"32px" }}>
        {cards.map((c,i) => (
          <div key={i} className="arrangement-card" style={{ cursor:"pointer" }}>
            <div className="img-zoom" style={{ aspectRatio:"3/4", borderRadius:"2px", overflow:"hidden", marginBottom:"20px" }}>
              <img src={c.img} alt={c.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <p className="section-label card-label" style={{ marginBottom:"8px", transition:"color 0.3s" }}>{c.tag}</p>
                <h3 className="font-display" style={{ fontSize:"24px", fontWeight:400 }}>{c.title}</h3>
              </div>
              <p className="font-body" style={{ fontSize:"13px", color:C.dust, paddingTop:"20px" }}>{c.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Seasonal Collection ─────────────────────────────────────── */
function Seasonal() {
  return (
    <section style={{ position:"relative", minHeight:"600px", overflow:"hidden" }}>
      <img src={IMGS.seasonal} alt="Seasonal" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg, rgba(43,59,42,0.88) 0%, rgba(43,59,42,0.3) 100%)" }} />
      <div className="reveal-left" style={{ position:"relative", zIndex:2, padding:"100px 8vw", maxWidth:"640px" }}>
        <p className="section-label" style={{ color:C.gold, marginBottom:"28px" }}>Collection de saison</p>
        <h2 className="font-display" style={{ fontSize:"clamp(38px,5vw,68px)", fontWeight:300, lineHeight:1.08, color:C.white, marginBottom:"32px" }}>
          L'automne<br />en <em style={{ color:C.gold, fontStyle:"italic" }}>fleur</em>
        </h2>
        <p className="font-body" style={{ fontSize:"15px", fontWeight:300, lineHeight:1.9, color:"rgba(255,255,255,0.7)", marginBottom:"44px", maxWidth:"420px" }}>
          Dahlias 'Café au Lait', cosmos chocolat, graminées dorées — notre collection
          automnale célèbre la richesse des tons chauds avant le grand silence hivernal.
        </p>
        <button className="btn-primary" style={{ background:C.gold, color:C.moss }}>
          Découvrir la collection
        </button>
      </div>
    </section>
  );
}

/* ─── Subscription ───────────────────────────────────────────── */
function Subscription() {
  const plans = [
    { name:"Essentiel",   freq:"Mensuel", flowers:"1 arrangement", price:"95€/mois",   desc:"Un bouquet de saison livré à domicile, selon l'humeur du studio." },
    { name:"Rituel",      freq:"Bimensuel", flowers:"2 arrangements", price:"165€/mois", desc:"Deux compositions par mois, sélectionnées parmi nos créations les plus récentes.", featured:true },
    { name:"Immersion",   freq:"Hebdomadaire", flowers:"4 arrangements", price:"280€/mois", desc:"Un abonnement pour celles et ceux qui vivent entourés de fleurs, chaque semaine." },
  ];
  return (
    <section style={{ padding:"120px 5vw", background:C.cream }}>
      <div className="reveal" style={{ textAlign:"center", marginBottom:"80px" }}>
        <p className="section-label" style={{ marginBottom:"16px" }}>Abonnement floral</p>
        <h2 className="font-display" style={{ fontSize:"clamp(34px,4.5vw,60px)", fontWeight:300, lineHeight:1.1, marginBottom:"20px" }}>
          Inscrivez la beauté<br /><em style={{ fontStyle:"italic", color:C.sageLight }}>dans votre quotidien</em>
        </h2>
        <p className="font-body" style={{ fontSize:"15px", fontWeight:300, color:C.dust, maxWidth:"460px", margin:"0 auto", lineHeight:1.9 }}>
          Recevez nos créations saisonnières directement chez vous.
          Chaque livraison est accompagnée d'une note d'intention florale.
        </p>
      </div>

      <div className="stagger" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:"24px", maxWidth:"960px", margin:"0 auto" }}>
        {plans.map((p,i) => (
          <div key={i} style={{
            padding:"44px 36px",
            background: p.featured ? C.moss : C.white,
            color: p.featured ? C.cream : C.charcoal,
            border: p.featured ? "none" : `1px solid ${C.parchment}`,
            borderRadius:"2px",
            position:"relative",
            transition:"transform 0.3s ease, box-shadow 0.3s ease",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="0 24px 60px rgba(0,0,0,0.12)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
          >
            {p.featured && <div style={{ position:"absolute", top:"20px", right:"20px", fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, fontFamily:"'Jost',sans-serif" }}>Populaire</div>}
            <p className="font-body" style={{ fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase", color: p.featured ? C.gold : C.dust, marginBottom:"16px" }}>{p.freq}</p>
            <h3 className="font-display" style={{ fontSize:"30px", fontWeight:400, marginBottom:"8px" }}>{p.name}</h3>
            <p className="font-display" style={{ fontSize:"40px", fontWeight:300, marginBottom:"28px", color: p.featured ? C.gold : C.sage }}>{p.price}</p>
            <div style={{ height:"1px", background: p.featured ? "rgba(255,255,255,0.15)" : C.parchment, marginBottom:"28px" }} />
            <p className="font-body" style={{ fontSize:"14px", fontWeight:300, lineHeight:1.8, color: p.featured ? "rgba(255,255,255,0.72)" : C.dust, marginBottom:"36px" }}>{p.desc}</p>
            <button className="btn-primary" style={{
              background: p.featured ? C.gold : C.moss,
              color: p.featured ? C.moss : C.cream,
              width:"100%", justifyContent:"center",
            }}>
              S'abonner
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Editorial Gallery ───────────────────────────────────────── */
function Gallery() {
  return (
    <section style={{ padding:"80px 5vw", background:C.parchment }}>
      <div className="reveal" style={{ marginBottom:"56px" }}>
        <p className="section-label" style={{ marginBottom:"16px" }}>Galerie</p>
        <h2 className="font-display" style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:300 }}>
          Moments <em style={{ fontStyle:"italic", color:C.sageLight }}>capturés</em>
        </h2>
      </div>

      {/* Masonry-ish bento grid */}
      <div className="stagger" style={{ display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridTemplateRows:"auto", gap:"12px" }}>
        {/* large left */}
        <div className="img-zoom" style={{ gridColumn:"1/6", gridRow:"1/3", borderRadius:"2px", overflow:"hidden", aspectRatio:"4/5" }}>
          <img src={IMGS.gal1} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        {/* top mid */}
        <div className="img-zoom" style={{ gridColumn:"6/9", gridRow:"1/2", borderRadius:"2px", overflow:"hidden" }}>
          <img src={IMGS.gal2} alt="" style={{ width:"100%", height:"260px", objectFit:"cover" }} />
        </div>
        {/* top right */}
        <div className="img-zoom" style={{ gridColumn:"9/13", gridRow:"1/2", borderRadius:"2px", overflow:"hidden" }}>
        <img 
        src={IMGS.gal3} 
        alt=""
        style={{ width:"100%", height:"100%", objectFit:"cover" }} 
        />
        </div>
        {/* bot mid */}
        <div className="img-zoom" style={{ gridColumn:"6/10", gridRow:"2/3", borderRadius:"2px", overflow:"hidden" }}>
          <img src={IMGS.gal4} alt="" style={{ width:"100%", height:"260px", objectFit:"cover" }} />
        </div>
        {/* bot right */}
        <div className="img-zoom" style={{ gridColumn:"10/13", gridRow:"2/3", borderRadius:"2px", overflow:"hidden" }}>
          <img src={IMGS.gal5} alt="" style={{ width:"100%", height:"260px", objectFit:"cover" }} />
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */
function Testimonials() {
  const items = [
    { quote:"Ces fleurs ont transformé mon mariage en quelque chose d'inoubliable. Chaque invité en a parlé le soir même.", name:"Marie Leclerc", role:"Mariée — Paris" },
    { quote:"Chaque arrangement arrive comme une lettre d'amour adressée à mon appartement. C'est devenu un rituel indispensable.", name:"Thomas Beaumont", role:"Collectionneur — Lyon" },
    { quote:"Ils ont compris ce que je voulais exprimer avant même que je ne le sache moi-même. Un art à part entière.", name:"Sophie Renard", role:"Directrice créative — Marseille" },
  ];
  return (
    <section style={{ padding:"120px 5vw", background:C.cream }}>
      <div className="reveal" style={{ marginBottom:"72px" }}>
        <p className="section-label" style={{ marginBottom:"16px" }}>Voix du studio</p>
        <h2 className="font-display" style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:300 }}>
          Ce qu'ils <em style={{ fontStyle:"italic", color:C.sageLight }}>ressentent</em>
        </h2>
      </div>

      <div className="stagger" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px,1fr))", gap:"24px" }}>
        {items.map((t,i) => (
          <div key={i} className="testimonial-card" style={{ padding:"44px 36px", background:C.white, borderRadius:"2px", border:`1px solid ${C.parchment}` }}>
            {/* Stars */}
            <div style={{ display:"flex", gap:"4px", marginBottom:"28px" }}>
              {[...Array(5)].map((_,j) => (
                <span key={j} style={{ color:C.gold, fontSize:"14px" }}>★</span>
              ))}
            </div>
            <p className="font-display" style={{ fontSize:"19px", fontStyle:"italic", fontWeight:400, lineHeight:1.65, color:C.charcoal, marginBottom:"36px" }}>
              "{t.quote}"
            </p>
            <div style={{ height:"1px", background:C.parchment, marginBottom:"24px" }} />
            <p className="font-body" style={{ fontSize:"13px", fontWeight:500, letterSpacing:"0.04em", color:C.charcoal, marginBottom:"4px" }}>{t.name}</p>
            <p className="font-body" style={{ fontSize:"12px", color:C.dust }}>{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Contact / Booking ──────────────────────────────────────── */
function Contact() {
  return (
    <section style={{ padding:"120px 5vw", background:C.moss, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"start" }}>
      <div className="reveal-left">
        <p className="section-label" style={{ color:C.gold, marginBottom:"28px" }}>Contact & Réservation</p>
        <h2 className="font-display" style={{ fontSize:"clamp(36px,4.5vw,62px)", fontWeight:300, lineHeight:1.08, color:C.white, marginBottom:"36px" }}>
          Créons quelque chose<br /><em style={{ color:C.gold, fontStyle:"italic" }}>d'inoubliable</em>
        </h2>
        <p className="font-body" style={{ fontSize:"15px", fontWeight:300, lineHeight:1.9, color:"rgba(255,255,255,0.6)", marginBottom:"48px", maxWidth:"380px" }}>
          Mariages, événements privés, décoration d'intérieur, shooting éditoriaux —
          partagez-nous votre vision, nous ferons le reste.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          {["studio@flore-paris.fr", "+33 1 42 00 00 00", "16 rue Oberkampf, 75011 Paris"].map((info,i) => (
            <p key={i} className="font-body" style={{ fontSize:"14px", color:"rgba(255,255,255,0.55)", letterSpacing:"0.04em" }}>{info}</p>
          ))}
        </div>
      </div>

      <div className="reveal-right" style={{ paddingTop:"8px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
          {[
            { label:"Prénom", ph:"Votre prénom" },
            { label:"Nom", ph:"Votre nom" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom:"36px" }}>
              <label className="font-body" style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"8px" }}>{f.label}</label>
              <input className="elegant-input" placeholder={f.ph} style={{ color:C.white, borderBottomColor:"rgba(255,255,255,0.25)" }} />
            </div>
          ))}
        </div>
        {[
          { label:"Email", ph:"votre@email.com" },
          { label:"Occasion", ph:"Mariage, événement, abonnement..." },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:"36px" }}>
            <label className="font-body" style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"8px" }}>{f.label}</label>
            <input className="elegant-input" placeholder={f.ph} style={{ color:C.white, borderBottomColor:"rgba(255,255,255,0.25)" }} />
          </div>
        ))}
        <div style={{ marginBottom:"44px" }}>
          <label className="font-body" style={{ fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", display:"block", marginBottom:"8px" }}>Message</label>
          <textarea className="elegant-input" placeholder="Décrivez votre projet, vos envies..." rows="4" style={{ color:C.white, borderBottomColor:"rgba(255,255,255,0.25)", resize:"none" }} />
        </div>
        <button className="btn-primary" style={{ background:C.gold, color:C.moss, width:"100%", justifyContent:"center", fontSize:"12px" }}>
          Envoyer la demande
        </button>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title:"Découvrir",  links:["À propos","Réalisations","Galerie","Abonnement","Contact"] },
    { title:"Services",   links:["Arrangement vedette","Événements","Ateliers","Commandes","Livraison"] },
    { title:"Nous suivre", links:["Instagram","Pinterest","Facebook","LinkedIn"] },
  ];
  return (
    <footer style={{ background:C.charcoal, padding:"80px 5vw 40px", color:C.white }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"60px", marginBottom:"72px" }}>
        {/* Brand */}
        <div>
          <div className="font-display" style={{ fontSize:"28px", fontWeight:400, letterSpacing:"0.06em", marginBottom:"20px" }}>
            Flore<span style={{ color:C.gold }}>.</span>
          </div>
          <p className="font-body" style={{ fontSize:"13px", fontWeight:300, lineHeight:1.9, color:"rgba(255,255,255,0.45)", maxWidth:"260px", marginBottom:"32px" }}>
            Studio de création florale fondé à Paris. L'art de la fleur au service de l'émotion.
          </p>
          {/* Newsletter mini */}
          <div style={{ display:"flex" }}>
            <input className="elegant-input" placeholder="Votre email" style={{ color:C.white, borderBottomColor:"rgba(255,255,255,0.2)", fontSize:"13px", flex:1 }} />
            <button style={{ background:"none", border:"none", color:C.gold, cursor:"pointer", fontFamily:"'Jost',sans-serif", fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", paddingLeft:"16px", whiteSpace:"nowrap" }}>
              S'abonner →
            </button>
          </div>
        </div>

        {cols.map(col => (
          <div key={col.title}>
            <p className="font-body" style={{ fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, marginBottom:"24px" }}>{col.title}</p>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"12px" }}>
              {col.links.map(l => (
                <li key={l}><a href="#" style={{ fontFamily:"'Jost',sans-serif", fontSize:"13px", fontWeight:300, color:"rgba(255,255,255,0.5)", textDecoration:"none", transition:"color 0.25s" }}
                  onMouseEnter={e=>e.target.style.color=C.white}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.5)"}
                >{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ height:"1px", background:"rgba(255,255,255,0.08)", marginBottom:"32px" }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
        <p className="font-body" style={{ fontSize:"12px", color:"rgba(255,255,255,0.28)" }}>© 2025 Flore. Studio Floral — Paris. Tous droits réservés.</p>
        <p className="font-body" style={{ fontSize:"12px", color:"rgba(255,255,255,0.28)" }}>Politique de confidentialité · Mentions légales</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  APP                                                         */
/* ═══════════════════════════════════════════════════════════ */
export default function App() {
  useReveal();
  return (
    <>
      <FontLink />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Arrangements />
      <Seasonal />
      <Subscription />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
