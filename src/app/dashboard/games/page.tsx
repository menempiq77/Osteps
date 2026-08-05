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
              Choose a game
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Every student entry has a positive spendable-coin price. Between
            levels, students answer five questions from completed tracker
            topics; leaderboard points never decrease.
          </p>
        </div>

        <div className="space-y-5">
          <article className="group overflow-hidden rounded-[28px] border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-fuchsia-50 shadow-[0_18px_45px_rgba(14,116,144,0.14)]">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[330px] overflow-hidden bg-gradient-to-b from-cyan-200 via-sky-100 to-fuchsia-100 p-7 sm:p-9">
                <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-yellow-200 shadow-[0_0_60px_rgba(250,204,21,0.5)]" />
                <div className="relative z-10 max-w-lg">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-700 shadow-sm backdrop-blur">
                      New lightweight arcade
                    </span>
                    <span className="rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-fuchsia-700 shadow-sm backdrop-blur">
                      15 levels
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-cyan-700">
                    One-tap stacking challenge
                  </p>
                  <h3 className="mt-2 text-4xl font-black text-slate-900">
                    Neon Tower
                  </h3>
                  <p className="mt-3 max-w-md text-sm font-bold leading-6 text-slate-600">
                    Time every drop, build through five colorful worlds, earn
                    three stars per level, and climb all the way to the Neon
                    Crown.
                  </p>
                </div>

                <div className="absolute bottom-0 right-10 flex flex-col-reverse items-center sm:right-20">
                  {[
                    ["#22d3ee", 180],
                    ["#38bdf8", 164],
                    ["#818cf8", 148],
                    ["#c084fc", 130],
                    ["#f472b6", 112],
                    ["#facc15", 94],
                  ].map(([color, width], index) => (
                    <div
                      key={String(color)}
                      className="h-8 rounded-lg border-2 border-white/80 shadow-lg"
                      style={{
                        backgroundColor: String(color),
                        width: Number(width),
                        transform: `translateX(${index % 2 === 0 ? -4 : 5}px)`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      [Gamepad2, "15 levels", "Five bright worlds"],
                      [Sparkles, "1 tap", "Phone, tablet, PC"],
                      [Coins, "5 coins", "Two-hour pass"],
                    ].map(([Icon, title, detail]) => {
                      const CardIcon = Icon as typeof Gamepad2;
                      return (
                        <div
                          key={String(title)}
                          className="rounded-2xl border border-white bg-white/75 p-3 shadow-sm"
                        >
                          <CardIcon className="h-5 w-5 text-fuchsia-500" />
                          <p className="mt-2 text-xs font-black text-slate-900">
                            {String(title)}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-500">
                            {String(detail)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-3 text-sm font-bold text-slate-600">
                    {[
                      "Instant play with no heavy game engine",
                      "Unlimited retries during the arcade pass",
                      "Saved level unlocks and best stars",
                      "Sound, pause, touch, and keyboard controls",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/dashboard/games/neon-tower"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(79,70,229,.24)] transition group-hover:-translate-y-0.5"
                >
                  Play Neon Tower
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

          <article className="group overflow-hidden rounded-[28px] border border-violet-200 bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 text-white shadow-[0_18px_45px_rgba(76,29,149,0.22)]">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[330px] overflow-hidden p-7 sm:p-9">
                <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute -right-16 top-20 h-60 w-60 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <div className="relative z-10 max-w-lg">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200 backdrop-blur">
                      Classic arcade
                    </span>
                    <span className="rounded-full border border-fuchsia-200/30 bg-fuchsia-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-fuchsia-200 backdrop-blur">
                      15 levels
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                    Move. Bounce. Break them all.
                  </p>
                  <h3 className="mt-2 text-4xl font-black">Brick Bounce</h3>
                  <p className="mt-3 max-w-md text-sm font-bold leading-6 text-indigo-100">
                    Slide the paddle, protect three balls, smash every colorful
                    brick, and chase a bigger personal high score through five
                    increasingly challenging worlds.
                  </p>
                </div>

                <div className="absolute inset-x-10 bottom-7">
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 21 }, (_, index) => (
                      <div
                        key={index}
                        className="h-6 rounded-md border border-white/50 shadow-lg"
                        style={{
                          backgroundColor:
                            ["#22d3ee", "#818cf8", "#c084fc"][
                              Math.floor(index / 7)
                            ],
                        }}
                      />
                    ))}
                  </div>
                  <div className="mx-auto mt-12 h-4 w-28 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 shadow-[0_0_24px_rgba(34,211,238,.7)]" />
                  <div className="mx-auto -mt-11 h-5 w-5 rounded-full bg-yellow-200 shadow-[0_0_20px_rgba(254,240,138,.95)]" />
                </div>
              </div>

              <div className="flex flex-col justify-between border-white/10 p-7 sm:p-9 lg:border-l">
                <div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      [Gamepad2, "15 levels", "Five arcade worlds"],
                      [Sparkles, "3 balls", "Then game over"],
                      [Coins, "5 coins", "Two-hour pass"],
                    ].map(([Icon, title, detail]) => {
                      const CardIcon = Icon as typeof Gamepad2;
                      return (
                        <div
                          key={String(title)}
                          className="rounded-2xl border border-white/10 bg-white/[0.07] p-3"
                        >
                          <CardIcon className="h-5 w-5 text-cyan-300" />
                          <p className="mt-2 text-xs font-black">
                            {String(title)}
                          </p>
                          <p className="mt-1 text-[10px] text-indigo-200">
                            {String(detail)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-3 text-sm font-bold text-indigo-100">
                    {[
                      "Drag, arrow-key, and A/D paddle controls",
                      "Faster balls, tighter paddles, and tougher bricks",
                      "Saved unlocked levels, stars, and personal scores",
                      "Game score stays separate from leaderboard points",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/dashboard/games/brick-breaker"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(34,211,238,.2)] transition group-hover:-translate-y-0.5"
                >
                  Play Brick Bounce
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

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
                      Two levels playable
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
                    Restore the Gallery of the Ark, then enter the Hall of Signs
                    for visual discovery, lesson matching, and a magical
                    combination lock.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 text-white sm:p-9">
                <div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      [Gamepad2, "2 rooms", "Different challenges"],
                      [Sparkles, "Discover", "Clues and signs"],
                      [Coins, "10 coins", "Whole adventure"],
                    ].map(([Icon, title, detail]) => {
                      const CardIcon = Icon as typeof Gamepad2;
                      return (
                        <div
                          key={String(title)}
                          className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
                        >
                          <CardIcon className="h-5 w-5 text-amber-300" />
                          <p className="mt-2 text-xs font-black">
                            {String(title)}
                          </p>
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
                      "Timeline, matching, and symbol-lock puzzles",
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
        </div>
      </section>
    </div>
  );
}
