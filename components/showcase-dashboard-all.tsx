"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Briefcase,
  Calendar,
  CalendarCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Flag,
  List,
  Plus,
  RefreshCw,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AnimatedCounter } from "./animation/animated-counter";
import { cn } from "@/lib/utils";
import {
  EVENT_TYPE_COLORS,
  EVENT_TYPE_NAMES,
  METRICS,
  MOCK_DASHBOARD_EVENTS,
  MOCK_DASHBOARD_TASKS,
  MOCK_DASHBOARD_USER,
} from "@/lib/showcase-dashboard-mock-data";

type ToastIcon = "success" | "info" | "warning" | "error";

function ShowcaseToast({
  message,
  icon,
  onClose,
}: {
  message: string;
  icon: ToastIcon;
  onClose: () => void;
}) {
  const iconClass =
    icon === "success"
      ? "text-lime-400"
      : icon === "warning"
        ? "text-amber-400"
        : icon === "error"
          ? "text-rose-400"
          : "text-brand-300";

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-white/10 bg-card/95 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl animate-fade-up"
    >
      <CheckCircle className={cn("mt-0.5 h-4 w-4 shrink-0", iconClass)} />
      <p className="flex-1 text-sm text-foreground">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
    </div>
  );
}

function formatTimeOnly(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function taskStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "todo":
      return "bg-amber-500/15 text-amber-300";
    case "in progress":
      return "bg-sky-500/15 text-sky-300";
    case "done":
      return "bg-lime-500/15 text-lime-300";
    default:
      return "bg-white/10 text-muted-foreground";
  }
}

function MetricCard({
  label,
  value,
  footer,
  icon: Icon,
  accent,
  iconColor,
  onClick,
  index = 0,
}: {
  label: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
  icon: LucideIcon;
  accent: string;
  iconColor: string;
  onClick: () => void;
  index?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${120 + index * 90}ms` }}
      className={cn(
        "showcase-metric-card showcase-shine hover-lift group relative w-full overflow-hidden rounded-xl border border-white/5 bg-background/40 p-3 text-left",
        "animate-fade-up-stagger transition-all hover:border-white/10 hover:bg-background/60 hover:shadow-lg hover:shadow-brand-500/10",
      )}
    >
      <div className="relative z-10 flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110",
            accent,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-xs text-muted-foreground transition-colors group-hover:text-brand-200">
            {label}
          </div>
          <div className="text-lg font-bold tabular-nums">{value}</div>
          {footer ? (
            <div className="text-[11px] text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </div>

      <Icon
        className={cn("metric-float -bottom-3 -left-2 h-20 w-20", iconColor)}
        aria-hidden
      />
      <Briefcase
        className={cn("metric-float metric-float-2 right-2 top-2 h-14 w-14", iconColor)}
        aria-hidden
      />
      <Icon
        className={cn("metric-float metric-float-3 bottom-4 right-6 h-10 w-10", iconColor)}
        aria-hidden
      />
    </button>
  );
}

function ShowcaseDashboardMetrics({
  onToast,
}: {
  onToast: (msg: string, icon?: ToastIcon) => void;
}) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        index={0}
        label="Leads"
        icon={Users}
        accent="bg-blue-500/15 text-blue-300"
        iconColor="text-blue-400"
        value={
          <AnimatedCounter to={METRICS.opportunities} className="font-bold" />
        }
        footer="Today"
        onClick={() => onToast(`Leads Today: ${METRICS.opportunities}`, "info")}
      />
      <MetricCard
        index={1}
        label="Set"
        icon={CalendarCheck}
        accent="bg-lime-500/15 text-lime-300"
        iconColor="text-lime-400"
        value={<AnimatedCounter to={METRICS.set} className="font-bold" />}
        footer="Today"
        onClick={() => onToast(`Set Today: ${METRICS.set}`, "info")}
      />
      <MetricCard
        index={2}
        label="Sold"
        icon={DollarSign}
        accent="bg-amber-500/15 text-amber-300"
        iconColor="text-amber-400"
        value={
          <AnimatedCounter
            to={METRICS.sold_value}
            prefix="$"
            className="font-bold"
          />
        }
        footer={`${METRICS.sold} Jobs Today`}
        onClick={() =>
          onToast(`Sold: $${METRICS.sold_value.toLocaleString()}`, "info")
        }
      />
      <MetricCard
        index={3}
        label="Closed"
        icon={CheckCircle}
        accent="bg-cyan-500/15 text-cyan-300"
        iconColor="text-cyan-400"
        value={<AnimatedCounter to={METRICS.closed} className="font-bold" />}
        footer="Today"
        onClick={() => onToast(`Closed Today: ${METRICS.closed}`, "info")}
      />
    </div>
  );
}

function PersonalTasksPanel({
  filterStatus,
  setFilterStatus,
  onToast,
}: {
  filterStatus: string | null;
  setFilterStatus: (s: string | null) => void;
  onToast: (msg: string, icon?: ToastIcon) => void;
}) {
  const filtered = filterStatus
    ? MOCK_DASHBOARD_TASKS.filter((t) => t.status === filterStatus)
    : MOCK_DASHBOARD_TASKS;

  return (
    <div
      className="hover-lift flex h-full flex-col rounded-xl border border-white/5 bg-background/40 animate-fade-up-stagger"
      style={{ animationDelay: "400ms" }}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2.5">
        <h3 className="text-sm font-semibold">Personal Tasks</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onToast("Add task (demo)", "info")}
            className="inline-flex items-center gap-1 rounded-md bg-brand-500/15 px-2 py-1 text-[10px] font-medium text-brand-300 transition-transform hover:scale-105"
          >
            <Plus className="h-3 w-3" />
            New
          </button>
          <button
            type="button"
            onClick={() => onToast("Open Personal Tasks (demo)", "info")}
            className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <List className="h-3 w-3" />
            View All
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-white/5 p-2">
        {[
          { label: "All", value: null },
          { label: "TODO", value: "TODO" },
          { label: "In Progress", value: "In Progress" },
          { label: "Done", value: "Done" },
        ].map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilterStatus(f.value)}
            className={cn(
              "rounded-md px-2 py-0.5 text-[10px] font-medium transition-all",
              filterStatus === f.value
                ? "scale-105 bg-brand-500/20 text-brand-200"
                : "bg-white/5 text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="max-h-[320px] flex-1 space-y-2 overflow-y-auto p-2">
        {filtered.map((task, i) => (
          <button
            key={task.task_id}
            type="button"
            onClick={() => onToast(`Edit task: ${task.task_name}`, "info")}
            style={{ animationDelay: `${480 + i * 60}ms` }}
            className="hover-lift w-full cursor-grab rounded-lg border border-white/5 bg-background/60 p-2.5 text-left animate-fade-up-stagger transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-background/80 hover:shadow-md hover:shadow-black/20"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="truncate text-xs font-semibold text-brand-200">
                {task.task_name}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium",
                  taskStatusStyle(task.status),
                )}
              >
                {task.status}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">
              {task.task_description}
            </p>
            <div className="mt-2 flex gap-3 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-brand-300" />
                {new Date(task.date_start).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Flag className="h-3 w-3 text-rose-400" />
                {task.due_date}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniCalendar({
  onToast,
}: {
  onToast: (msg: string, icon?: ToastIcon) => void;
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDay = useMemo(() => {
    const map = new Map<number, typeof MOCK_DASHBOARD_EVENTS>();
    for (const ev of MOCK_DASHBOARD_EVENTS) {
      const d = new Date(ev.start);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        const list = map.get(day) ?? [];
        list.push(ev);
        map.set(day, list);
      }
    }
    return map;
  }, [month, year]);

  return (
    <div
      className="hover-lift flex h-full flex-col rounded-xl border border-white/5 bg-background/40 animate-fade-up-stagger"
      style={{ animationDelay: "480ms" }}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2.5">
        <h3 className="text-sm font-semibold">{monthLabel}</h3>
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px border-b border-white/5 bg-white/5 px-2 py-1.5 text-center text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 gap-px bg-white/5 p-2">
        {cells.map((day, i) => {
          const dayEvents = day ? eventsByDay.get(day) : undefined;
          const isToday = day === now.getDate();
          return (
            <div
              key={i}
              className={cn(
                "min-h-[52px] rounded-md bg-background/60 p-0.5 transition-colors",
                isToday && "showcase-today-pulse ring-1 ring-brand-400/50",
                dayEvents?.length && !isToday && "hover:bg-background/80",
              )}
            >
              {day ? (
                <>
                  <div
                    className={cn(
                      "mb-0.5 text-right text-[10px]",
                      isToday
                        ? "font-bold text-brand-300"
                        : "text-muted-foreground",
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents?.slice(0, 2).map((ev) => (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() =>
                          onToast(`Event: ${ev.event_title}`, "info")
                        }
                        className="block w-full truncate rounded px-0.5 py-px text-left text-[8px] font-medium text-white transition-transform hover:scale-[1.03] hover:shadow-sm"
                        style={{ backgroundColor: ev.color }}
                        title={ev.event_title}
                      >
                        {ev.event_title}
                      </button>
                    ))}
                    {(dayEvents?.length ?? 0) > 2 ? (
                      <div className="text-[8px] text-muted-foreground">
                        +{(dayEvents?.length ?? 0) - 2} more
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingEventsPanel({
  onToast,
}: {
  onToast: (msg: string, icon?: ToastIcon) => void;
}) {
  const upcoming = useMemo(
    () =>
      [...MOCK_DASHBOARD_EVENTS]
        .filter((e) => ["EV0004", "EV0005"].includes(e.event_type_id))
        .sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        )
        .slice(0, 3),
    [],
  );

  return (
    <div
      className="hover-lift flex h-full flex-col rounded-xl border border-white/5 bg-background/40 animate-fade-up-stagger"
      style={{ animationDelay: "560ms" }}
    >
      <div className="border-b border-white/5 px-3 py-2.5">
        <h3 className="text-sm font-semibold">Upcoming events</h3>
      </div>
      <div className="max-h-[320px] flex-1 space-y-3 overflow-y-auto p-3">
        {upcoming.map((event, i) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onToast(`Event: ${event.event_title}`, "info")}
            style={{
              animationDelay: `${600 + i * 70}ms`,
              borderLeftColor: event.color,
            }}
            className="hover-lift w-full rounded-lg border-l-[3px] bg-background/60 p-2 text-left animate-fade-up-stagger transition-all hover:-translate-y-0.5 hover:bg-background/80 hover:shadow-md hover:shadow-black/20"
          >
            <div className="flex gap-3">
              <div className="shrink-0 text-center">
                <div className="text-lg font-bold text-brand-300">
                  {new Date(event.start).getDate()}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {new Date(event.start).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-foreground">
                  {formatTimeOnly(event.times_start)} -{" "}
                  {formatTimeOnly(event.time_end)}
                </div>
                <div className="text-xs font-semibold">
                  {event.event_title ?? "No Title"}
                </div>
                {"address_line1" in event && event.address_line1 ? (
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {event.address_line1} {event.city}, {event.state}{" "}
                    {event.postal_code}
                  </div>
                ) : null}
                {event.event_note ? (
                  <div className="text-[10px] text-muted-foreground">
                    {event.event_note}
                  </div>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EventLegends() {
  return (
    <div
      className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/5 pt-4 animate-fade-up-stagger"
      style={{ animationDelay: "720ms" }}
    >
      {Object.entries(EVENT_TYPE_NAMES).map(([typeId, typeName], i) => (
        <div
          key={typeId}
          className="flex items-center gap-1.5 transition-transform hover:scale-105"
          style={{ animationDelay: `${760 + i * 40}ms` }}
        >
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{
              backgroundColor: EVENT_TYPE_COLORS[typeId] ?? "#aaa",
            }}
          />
          <span className="text-[10px] text-muted-foreground">{typeName}</span>
        </div>
      ))}
    </div>
  );
}

export function ShowcaseDashboardAll() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    icon: ToastIcon;
  } | null>(null);

  const showToast = useCallback((message: string, icon: ToastIcon = "success") => {
    setToast({ message, icon });
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const handleSync = () => {
    setSyncing(true);
    showToast("Synced FileMaker Calendar (demo)", "success");
    window.setTimeout(() => setSyncing(false), 1200);
  };

  const user = MOCK_DASHBOARD_USER;

  return (
    <div className="relative mx-auto max-w-6xl overflow-visible px-2 sm:px-4 xl:px-8">
      <div className="absolute -inset-x-8 -inset-y-4 -z-10 rounded-3xl bg-gradient-to-b from-brand-500/10 via-fuchsia-500/5 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80 transition-transform hover:scale-110" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80 transition-transform hover:scale-110" />
            <span className="h-3 w-3 rounded-full bg-green-500/80 transition-transform hover:scale-110" />
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-white/5 bg-background/50 px-3 py-1 text-xs text-muted-foreground md:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-lime-400/60 animate-ping-soft" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400" />
            </span>
            app.klausway.com/portal/dashboard
          </div>
          <div className="w-12" />
        </div>

        <div className="max-h-[560px] overflow-y-auto p-4 md:p-5">
          <div
            className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-up-stagger"
            style={{ animationDelay: "80ms" }}
          >
            <h2 className="text-lg font-semibold md:text-xl">
              Hello,{" "}
              <span className="text-gradient-animated">
                {user.first_name} {user.last_name}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                defaultValue="v1"
                onChange={() => showToast("Version switch (demo)", "info")}
                className="rounded-lg border border-white/10 bg-background/50 px-2 py-1.5 text-xs text-foreground transition-colors hover:border-white/20"
              >
                <option value="v1">Version 1</option>
                <option value="v2">Version 2</option>
                <option value="v3">Version 3</option>
              </select>
              <button
                type="button"
                onClick={handleSync}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:scale-[1.02] hover:bg-white/5"
              >
                <RefreshCw
                  className={cn(
                    "h-3.5 w-3.5",
                    syncing && "animate-spin",
                  )}
                />
                Sync FileMaker
              </button>
              <button
                type="button"
                onClick={() => showToast("Create Event (demo)", "info")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-white/20"
              >
                <Plus className="h-3.5 w-3.5" />
                New Event
              </button>
            </div>
          </div>

          <ShowcaseDashboardMetrics onToast={showToast} />

          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <PersonalTasksPanel
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onToast={showToast}
              />
            </div>
            <div className="lg:col-span-6">
              <MiniCalendar onToast={showToast} />
            </div>
            <div className="lg:col-span-3">
              <UpcomingEventsPanel onToast={showToast} />
            </div>
          </div>

          <EventLegends />
        </div>
      </div>

      {toast ? (
        <ShowcaseToast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
