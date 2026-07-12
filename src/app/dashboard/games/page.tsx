import { PlayCircleOutlined } from "@ant-design/icons";
import { ArrowRight, Coins, Gamepad2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function GamesPage() {
  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 px-6 py-8 shadow-lg md:px-10 md:py-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
        <div className="relative flex items-center gap-5">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-white/20 text-2xl text-white shadow-lg">
            <PlayCircleOutlined />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-950/70">
              Student rewards
            </p>
            <h1 className="text-2xl font-black text-white">Games</h1>
            <p className="mt-1 text-sm font-medium text-white/90">
              Manage games students can unlock with coins.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
              Game catalogue
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-800">
              Choose an adventure
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Games use spendable coins only. Leaderboard points never decrease.
          </p>
        </div>

        <article className="group overflow-hidden rounded-[28px] border border-indigo-200 bg-[#0b102c] shadow-[0_18px_45px_rgba(30,27,75,0.18)]">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div
              className="relative min-h-[330px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(7,11,34,.92), rgba(7,11,34,.48), rgba(7,11,34,.06)), url('/games/lost-library/library-room.webp')",
              }}
            >
              <div className="relative flex min-h-[330px] max-w-xl flex-col justify-center p-7 text-white sm:p-9">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-amber-200/30 bg-amber-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100 backdrop-blur">
                    Islamic Studies edition
                  </span>
                  <span className="rounded-full border border-cyan-200/30 bg-cyan-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
                    First room playable
                  </span>
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                  Escape the Lost Library
                </p>
                <h3 className="mt-2 text-3xl font-black sm:text-4xl">
                  The Lost Scrolls
                </h3>
                <p className="mt-2 text-lg font-bold text-amber-200">
                  Stories of the Prophets
                </p>
                <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-slate-200">
                  Explore the Gallery of the Ark, uncover hidden clues, and
                  restore the first scroll through movement, discovery, and a
                  timeline puzzle.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-7 text-white sm:p-9">
              <div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    [Gamepad2, "Explore", "Move around"],
                    [Sparkles, "Discover", "Find clues"],
                    [Coins, "10 coins", "Per student run"],
                  ].map(([Icon, title, detail]) => {
                    const CardIcon = Icon as typeof Gamepad2;
                    return (
                      <div
                        key={String(title)}
                        className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
                      >
                        <CardIcon className="h-5 w-5 text-amber-300" />
                        <p className="mt-2 text-xs font-black">{String(title)}</p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {String(detail)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  {[
                    "Keyboard and touch controls",
                    "Sound and animated reward feedback",
                    "Safe resume after refresh",
                    "No prophet is visually depicted",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/dashboard/games/lost-library"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 text-sm font-black text-amber-950 shadow-[0_10px_25px_rgba(251,191,36,.25)] transition group-hover:-translate-y-0.5"
              >
                Enter the Lost Library
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
