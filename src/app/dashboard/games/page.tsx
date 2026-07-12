import { PlayCircleOutlined } from "@ant-design/icons";

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

      <section className="rounded-3xl border border-orange-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
          🎮
        </div>
        <h2 className="mt-4 text-xl font-black text-slate-800">Game catalogue coming soon</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
          This page is ready for adding games, setting coin prices, and choosing which
          students can unlock them.
        </p>
      </section>
    </div>
  );
}
