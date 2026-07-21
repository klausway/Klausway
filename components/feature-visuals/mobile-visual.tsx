import { MapPin, Camera, Phone, Calendar } from "lucide-react";

const schedule = [
  {
    time: "10:30",
    name: "Meeting · Acme Corp",
    loc: "SoMa, San Francisco",
    badge: "bg-sky-400",
  },
  {
    time: "13:00",
    name: "Demo · Hooli Inc.",
    loc: "Online · Zoom",
    badge: "bg-fuchsia-400",
  },
  {
    time: "15:30",
    name: "Contract sign · Wayne Tech",
    loc: "Downtown, NYC",
    badge: "bg-lime-400",
  },
] as const;

const quickActions = [
  { icon: MapPin, label: "Check-in" },
  { icon: Camera, label: "Capture" },
  { icon: Phone, label: "Call" },
  { icon: Calendar, label: "Book" },
] as const;

const navItems = ["Home", "Deals", "Contacts", "You"] as const;

export function MobileVisual() {
  return (
    <div className="relative flex items-center justify-center py-6">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-blue-500/5 blur-2xl" />

      <div className="relative h-[500px] w-[240px] rounded-[2.6rem] border-[9px] border-zinc-300 bg-zinc-300 shadow-xl shadow-black/10">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-2.5 z-20 h-5 w-[72px] -translate-x-1/2 rounded-full bg-zinc-900" />

        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3.5 text-[9px] font-medium text-zinc-800">
            <span>9:41</span>
            <div className="flex items-center gap-0.5 text-[7px] tracking-tighter text-zinc-700">
              <span>●●●●</span>
            </div>
          </div>

          {/* Greeting */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="text-[13px] leading-tight text-zinc-800">
              Good morning{" "}
              <span className="font-semibold text-zinc-950">Sarah</span> 👋
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[9px] font-semibold text-white shadow-sm">
              SM
            </div>
          </div>

          {/* Revenue card */}
          <div className="mx-3.5 mt-3.5 rounded-2xl bg-gradient-to-br from-violet-100 via-fuchsia-50 to-indigo-50 p-3.5">
            <div className="text-[9px] font-medium text-zinc-500">
              Today&rsquo;s revenue
            </div>
            <div className="mt-0.5 text-[22px] font-semibold tracking-tight text-zinc-950">
              $28,500
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <div className="text-[9px] text-zinc-500">
                3 closed · 8 meetings
              </div>
              <div className="text-[10px] font-semibold text-emerald-500">
                +18%
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="mx-3.5 mt-3.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[11px] font-semibold text-zinc-900">
                Today&rsquo;s schedule
              </div>
              <div className="text-[9px] font-medium text-violet-500">
                View all
              </div>
            </div>
            <div className="space-y-1.5">
              {schedule.map((task) => (
                <div
                  key={task.time}
                  className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white px-2 py-1.5"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${task.badge}`}
                  >
                    <span className="text-[8px] font-bold text-white">
                      {task.time}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] font-semibold text-zinc-900">
                      {task.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-0.5 text-[8px] text-zinc-400">
                      <MapPin className="h-2 w-2 shrink-0" />
                      <span className="truncate">{task.loc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions — icon only, matching mock */}
          <div className="mx-3.5 mt-3 grid grid-cols-4 gap-2">
            {quickActions.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white py-2.5 text-zinc-600"
                aria-label={label}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-100 bg-white/95 px-3 py-2 backdrop-blur">
            <div className="flex justify-around">
              {navItems.map((nav, i) => (
                <div
                  key={nav}
                  className={`flex flex-col items-center gap-0.5 ${
                    i === 0 ? "text-violet-500" : "text-zinc-400"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-[3px] ${
                      i === 0 ? "bg-violet-500" : "bg-zinc-300"
                    }`}
                  />
                  <span className="text-[8px] font-medium">{nav}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-12 hidden w-44 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg shadow-black/8 md:block">
        <div className="flex items-start gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <MapPin className="h-3 w-3" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-medium text-zinc-900">
              Check-in successful
            </div>
            <div className="mt-0.5 text-[9px] text-zinc-500">
              Acme Corp, SoMa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
