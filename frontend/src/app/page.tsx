/**
 * app/page.tsx — Landing Page
 * Hero, feature cards, stats, and CTAs.
 */

import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI Insurance Assistant",
    description:
      "Ask any question about car insurance — Zero Depreciation, NCB, IDV — and get clear, simple explanations powered by AI.",
    href: "/chat",
    cta: "Ask AI →",
  },
  {
    icon: "🎯",
    title: "Smart Recommendations",
    description:
      "Tell us your car, city, and budget. Our engine finds policies perfectly matched to your needs — ranked by claim settlement ratio.",
    href: "/recommend",
    cta: "Get Recommended →",
  },
  {
    icon: "⚖️",
    title: "Policy Comparison",
    description:
      "Browse all insurers side by side. Filter by budget, coverage type, and claim ratio. Pick the best policy with confidence.",
    href: "/compare",
    cta: "Compare Policies →",
  },
];

const stats = [
  { value: "20+", label: "Insurance Policies" },
  { value: "98%", label: "Claim Accuracy Tracked" },
  { value: "5 sec", label: "Recommendation Time" },
  { value: "AI", label: "Powered Explanations" },
];

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Decorative orbs */}
      <div
        className="orb orb-indigo"
        style={{ width: 600, height: 600, top: -200, left: -100 }}
      />
      <div
        className="orb orb-blue"
        style={{ width: 400, height: 400, top: 100, right: -100 }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "100px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container-main">
          {/* Chip */}
          <div
            className="animate-fade-up badge badge-purple"
            style={{ display: "inline-flex", marginBottom: "24px", fontSize: "0.8rem", padding: "6px 14px" }}
          >
            🚀 Phase 2 Backend Live — AI Coming in Phase 5
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-up delay-100"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            Understand Insurance,{" "}
            <span className="gradient-text">The Smart Way</span>
          </h1>

          {/* Subheading */}
          <p
            className="animate-fade-up delay-200"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "var(--text-muted)",
              maxWidth: "600px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            PolicyWise AI demystifies car insurance with an AI assistant,
            smart recommendations, and side-by-side policy comparison — all in one place.
          </p>

          {/* CTA buttons */}
          <div
            className="animate-fade-up delay-300"
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/recommend" className="btn-primary" style={{ padding: "14px 30px", fontSize: "1rem" }}>
              🎯 Get My Recommendation
            </Link>
            <Link href="/chat" className="btn-secondary" style={{ padding: "14px 30px", fontSize: "1rem" }}>
              🤖 Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 80px", position: "relative", zIndex: 1 }}>
        <div className="container-main">
          <div
            className="glass animate-fade-up delay-400"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: "32px 24px",
                  textAlign: "center",
                  borderRight: i < stats.length - 1 ? "1px solid var(--glass-border)" : "none",
                }}
              >
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    background: "var(--grad-brand)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ─────────────────────────────────────────────── */}
      <section style={{ padding: "0 0 120px", position: "relative", zIndex: 1 }}>
        <div className="container-main">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "12px" }}
              className="animate-fade-up"
            >
              Everything You Need to Choose{" "}
              <span className="gradient-text">the Right Policy</span>
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }} className="animate-fade-up delay-100">
              Three powerful tools to guide your insurance decisions from understanding to purchase.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {features.map((feature, i) => (
              <Link
                key={feature.title}
                href={feature.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`glass-card animate-fade-up delay-${(i + 1) * 100}`}
                  style={{
                    padding: "32px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "14px",
                      background: "var(--grad-brand)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "26px",
                    }}
                  >
                    {feature.icon}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                      {feature.description}
                    </p>
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--accent-blue)",
                      }}
                    >
                      {feature.cta}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
