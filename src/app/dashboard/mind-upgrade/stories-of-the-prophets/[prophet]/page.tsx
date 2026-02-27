import Link from "next/link";
import { notFound } from "next/navigation";
import { getProphetStoryBySlug } from "../stories";
import StoryStepper from "@/components/stories/StoryStepper";

type PageProps = {
  params: Promise<{ prophet: string }>;
};

function getText(value: string | { en: string; ar: string }): string {
  return typeof value === "string" ? value : value.en;
}

export default async function ProphetStoryPage({ params }: PageProps) {
  const { prophet } = await params;
  const story = getProphetStoryBySlug(prophet);

  if (!story) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)",
        padding: "44px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: 18, display: "flex", gap: 10 }}>
          <Link
            href="/dashboard/mind-upgrade/stories-of-the-prophets"
            style={{
              color: "var(--foreground)",
              textDecoration: "none",
              fontWeight: 700,
              background: "var(--background)",
              border: "1px solid rgba(0,0,0,0.10)",
              padding: "10px 14px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            ← Back
          </Link>

          <Link
            href="/dashboard"
            style={{
              color: "var(--foreground)",
              textDecoration: "none",
              fontWeight: 700,
              background: "var(--background)",
              border: "1px solid rgba(0,0,0,0.10)",
              padding: "10px 14px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            Home
          </Link>
        </div>

        <section
          style={{
            background: "var(--background)",
            borderRadius: "18px",
            padding: "34px",
            border: "1px solid rgba(0,0,0,0.06)",
            color: "var(--foreground)",
          }}
        >
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "800",
              marginBottom: "10px",
              lineHeight: 1.15,
            }}
          >
            {story.name}
          </h1>

          <div
            style={{
              color: "#333",
              fontWeight: 650,
              marginBottom: 18,
              lineHeight: 1.75,
              fontSize: 16,
            }}
          >
            {getText(story.shortIntro)}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <StoryStepper story={story} basePath="/dashboard/mind-upgrade/stories-of-the-prophets" />

            <div
              style={{
                background: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                Qur'an references (surahs)
              </div>
              <div
                style={{
                  color: "#111",
                  fontWeight: 650,
                  lineHeight: 1.9,
                  fontSize: 16,
                }}
              >
                {story.quranSurahs.length ? story.quranSurahs.join(" • ") : "—"}
              </div>
              <div style={{ marginTop: 10, color: "#333", fontWeight: 650, lineHeight: 1.75 }}>
                Note: This is student-friendly, original wording based on Qur'an-guided learning. For deeper detail, consult trusted tafsir and seerah works (e.g., Tafsir Ibn Kathir) alongside the Qur'an.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
