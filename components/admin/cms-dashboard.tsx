"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  FileText,
  Image as ImageIcon,
  KeyRound,
  LayoutTemplate,
  Plus,
  Search,
  Settings2,
  Trash2,
  Type,
  UserRound,
  Users,
} from "lucide-react";
import { AdminAuthPanel } from "@/components/admin/admin-auth-panel";
import {
  AdminShell,
  navItemsForRole,
  type AdminSection,
} from "@/components/admin/admin-shell";
import type { AdminRole } from "@/lib/admin-roles";
import {
  BlogCardPreview,
  BlogDetailPreview,
  PortfolioCardPreview,
  PortfolioDetailPreview,
  PreviewPanel,
} from "@/components/admin/content-previews";
import {
  ContentEditorLayout,
  EditorFieldGrid,
  EditorListFields,
  EditorSection,
} from "@/components/admin/content-editor-layout";
import { ImageFields } from "@/components/admin/image-fields";
import { SingleImageField } from "@/components/admin/single-image-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { TeamMemberPhoto } from "@/components/team-member-photo";
import { portfolioCategories } from "@/lib/portfolio";
import {
  fromPrismaResourceType,
  resourceTypeLabels,
  resourceTypes,
  type ResourceType,
} from "@/lib/blog";
import { apiUrl } from "@/lib/api-path";
import { cn } from "@/lib/utils";
import {
  AdminButton,
  AdminField,
  AdminTextarea,
  EmptyState,
  PublishToggle,
  StatCard,
  StatusBadge,
  Toast,
} from "@/components/admin/admin-ui";

type AdminUser = { id?: string; name: string; email: string; role: AdminRole };
type AdminUserRecord = AdminUser & { id: string; createdAt: string };

type BlogRecord = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  type: ResourceType;
  coverImage?: string | null;
  galleryImages?: string[];
  published: boolean;
  date: string;
};

type PortfolioRecord = {
  slug: string;
  title: string;
  description: string;
  overview: string;
  coverImage?: string | null;
  galleryImages?: string[];
  categories: string[];
  tags: string[];
  accent: string;
  keyFeatures: string[];
  benefits: string[];
  useCases: string[];
  published: boolean;
};

type TeamRecord = {
  slug: string;
  name: string;
  role: string;
  image?: string | null;
  initials: string;
  accent: string;
  sortOrder: number;
  published: boolean;
};

type PreviewMode = "card" | "detail";

function parseLines(value: string) {
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

const emptyBlog = (
  type: ResourceType = "article",
): Partial<BlogRecord> & { originalSlug?: string } => ({
  slug: "", title: "", excerpt: "", content: "",
  type,
  coverImage: null, galleryImages: [], published: false,
  date: new Date().toISOString().slice(0, 10),
});

const emptyPortfolio = (): Partial<PortfolioRecord> & { originalSlug?: string } => ({
  slug: "", title: "", description: "", overview: "",
  coverImage: null, galleryImages: [], categories: [], tags: [],
  accent: "from-cyan-400 to-blue-500", keyFeatures: [], benefits: [], useCases: [],
  published: false,
});

const emptyTeam = (): Partial<TeamRecord> & { originalSlug?: string } => ({
  slug: "",
  name: "",
  role: "",
  image: null,
  initials: "",
  accent: "from-brand-500 to-violet-600",
  sortOrder: 0,
  published: true,
});

export function CmsDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [section, setSection] = useState<AdminSection>("overview");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "info" | "error" } | null>(null);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);

  const [blogPosts, setBlogPosts] = useState<BlogRecord[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamRecord[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);

  const [blogSearch, setBlogSearch] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState<
    ResourceType | "all"
  >("all");
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [blogPreviewMode, setBlogPreviewMode] = useState<PreviewMode>("card");
  const [portfolioPreviewMode, setPortfolioPreviewMode] = useState<PreviewMode>("card");
  const [blogEditorTab, setBlogEditorTab] = useState("basics");
  const [portfolioEditorTab, setPortfolioEditorTab] = useState("basics");
  const [teamEditorTab, setTeamEditorTab] = useState("basics");

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<AdminRole>("content");
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFullAdmin = user?.role === "admin";

  const [editingBlog, setEditingBlog] = useState<(Partial<BlogRecord> & { originalSlug?: string }) | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<(Partial<PortfolioRecord> & { originalSlug?: string }) | null>(null);
  const [editingTeam, setEditingTeam] = useState<(Partial<TeamRecord> & { originalSlug?: string }) | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("cms_token");
    const savedUser = sessionStorage.getItem("cms_user");
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try { setUser(JSON.parse(savedUser) as AdminUser); } catch { sessionStorage.removeItem("cms_user"); }
    }
  }, []);

  useEffect(() => {
    void fetch(apiUrl("/api/admin/setup"))
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { needsBootstrap?: boolean };
        if (data.needsBootstrap) setNeedsBootstrap(true);
      })
      .catch(() => {});
  }, []);

  const notify = (message: string, type: "info" | "error" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUsers = useCallback(async (authToken: string, asAdmin: boolean) => {
    if (!asAdmin) {
      setAdminUsers([]);
      return;
    }
    const res = await fetch(apiUrl("/api/admin/users"), { headers: authHeaders(authToken) });
    if (res.status === 403) {
      setAdminUsers([]);
      return;
    }
    if (!res.ok) return;
    const users = (await res.json()) as AdminUserRecord[];
    setAdminUsers(users.map((u) => ({ ...u, createdAt: u.createdAt.slice(0, 10) })));
  }, []);

  const loadData = useCallback(async (authToken: string, asAdmin: boolean) => {
    setLoading(true);
    try {
      const [blogRes, portfolioRes, teamRes] = await Promise.all([
        fetch(apiUrl("/api/admin/blog"), { headers: authHeaders(authToken) }),
        fetch(apiUrl("/api/admin/portfolio"), { headers: authHeaders(authToken) }),
        fetch(apiUrl("/api/admin/team"), { headers: authHeaders(authToken) }),
      ]);
      if (blogRes.status === 401 || portfolioRes.status === 401 || teamRes.status === 401) {
        sessionStorage.clear();
        setToken(null);
        setUser(null);
        throw new Error("Session expired. Please sign in again.");
      }
      if (!blogRes.ok || !portfolioRes.ok) throw new Error("Failed to load content.");

      const blogs = (await blogRes.json()) as BlogRecord[];
      const projects = (await portfolioRes.json()) as PortfolioRecord[];
      setBlogPosts(blogs.map((p) => ({
        ...p,
        date: p.date.slice(0, 10),
        galleryImages: p.galleryImages ?? [],
        type: fromPrismaResourceType(
          (p as BlogRecord & { type?: string }).type,
        ),
      })));
      setPortfolioProjects(projects.map((p) => ({ ...p, galleryImages: p.galleryImages ?? [] })));

      if (teamRes.ok) {
        const members = (await teamRes.json()) as TeamRecord[];
        setTeamMembers(members.map((m) => ({ ...m, image: m.image ?? null })));
      } else {
        setTeamMembers([]);
        notify("Team members could not be loaded. Other content is available.", "error");
      }

      await loadUsers(authToken, asAdmin);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Failed to load content.", "error");
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  useEffect(() => {
    if (token) void loadData(token, user?.role === "admin");
  }, [token, user?.role, loadData]);

  useEffect(() => {
    if (!user) return;
    const allowed = navItemsForRole(user.role).map((i) => i.id);
    if (!allowed.includes(section)) {
      setSection(user.role === "admin" ? "overview" : "resources");
    }
  }, [user, section]);

  const stats = useMemo(() => ({
    blogTotal: blogPosts.length,
    blogPublished: blogPosts.filter((p) => p.published).length,
    byType: Object.fromEntries(
      resourceTypes.map((type) => [
        type,
        blogPosts.filter((p) => p.type === type).length,
      ]),
    ) as Record<ResourceType, number>,
    portfolioTotal: portfolioProjects.length,
    portfolioPublished: portfolioProjects.filter((p) => p.published).length,
    teamTotal: teamMembers.length,
    teamPublished: teamMembers.filter((m) => m.published).length,
    admins: adminUsers.length,
  }), [blogPosts, portfolioProjects, teamMembers, adminUsers]);

  const filteredBlogs = blogPosts.filter((p) => {
    const q = blogSearch.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (resourceTypeLabels[p.type] ?? "").toLowerCase().includes(q);
    const matchesType =
      resourceTypeFilter === "all" || p.type === resourceTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredPortfolio = portfolioProjects.filter((p) =>
    p.title.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(portfolioSearch.toLowerCase()),
  );

  const filteredTeam = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(teamSearch.toLowerCase()) ||
    m.slug.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  function handleAuthenticated(authToken: string, authUser: AdminUser) {
    sessionStorage.setItem("cms_token", authToken);
    sessionStorage.setItem("cms_user", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    setNeedsBootstrap(false);
  }

  function logout() {
    sessionStorage.removeItem("cms_token");
    sessionStorage.removeItem("cms_user");
    setToken(null);
    setUser(null);
    setEditingBlog(null);
    setEditingPortfolio(null);
    setEditingTeam(null);
  }

  async function bootstrapFirstAdmin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(apiUrl("/api/admin/users"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUserName, email: newUserEmail, password: newUserPassword }),
    });
    const payload = (await res.json()) as { error?: string; token?: string; user?: AdminUser };
    if (!res.ok || !payload.token || !payload.user) {
      notify(payload.error ?? "Failed to create the first admin account.", "error");
      return;
    }
    setNewUserName(""); setNewUserEmail(""); setNewUserPassword("");
    handleAuthenticated(payload.token, payload.user);
    notify("First admin account created.");
  }

  async function createAdminUser(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    const res = await fetch(apiUrl("/api/admin/users"), {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) { notify(payload.error ?? "Failed to create account.", "error"); return; }
    setNewUserName(""); setNewUserEmail(""); setNewUserPassword("");
    setNewUserRole("content");
    notify("Team account created.");
    await loadUsers(token, true);
  }

  async function updateUserRole(userId: string, role: AdminRole) {
    if (!token) return;
    const res = await fetch(apiUrl(`/api/admin/users/${userId}`), {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ role }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) {
      notify(payload.error ?? "Failed to update role.", "error");
      return;
    }
    notify("Role updated.");
    await loadUsers(token, true);
  }

  async function resetUserPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !resetPasswordUserId) return;
    const res = await fetch(apiUrl(`/api/admin/users/${resetPasswordUserId}`), {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ password: resetPasswordValue }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) {
      notify(payload.error ?? "Failed to reset password.", "error");
      return;
    }
    setResetPasswordUserId(null);
    setResetPasswordValue("");
    notify("Password updated.");
  }

  async function changeOwnPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (newPassword !== confirmPassword) {
      notify("New passwords do not match.", "error");
      return;
    }
    const res = await fetch(apiUrl("/api/admin/me/password"), {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) {
      notify(payload.error ?? "Failed to change password.", "error");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    notify("Password changed.");
  }

  async function saveBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingBlog?.slug || !editingBlog.title || !editingBlog.excerpt) return;
    const isNew = !editingBlog.originalSlug;
    const res = await fetch(
      isNew ? apiUrl("/api/admin/blog") : apiUrl(`/api/admin/blog/${editingBlog.originalSlug}`),
      {
      method: isNew ? "POST" : "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({
        slug: editingBlog.slug, title: editingBlog.title, excerpt: editingBlog.excerpt,
        content: editingBlog.content ?? editingBlog.excerpt,
        type: editingBlog.type ?? "article",
        coverImage: editingBlog.coverImage ?? null,
        galleryImages: editingBlog.galleryImages ?? [],
        published: editingBlog.published ?? false,
        date: editingBlog.date ?? new Date().toISOString().slice(0, 10),
      }),
    });
    if (!res.ok) { notify("Failed to save resource.", "error"); return; }
    setEditingBlog(null);
    notify("Resource saved.");
    await loadData(token, isFullAdmin);
  }

  async function deleteBlog(slug: string) {
    if (!token || !confirm(`Delete resource "${slug}"?`)) return;
    const res = await fetch(apiUrl(`/api/admin/blog/${slug}`), { method: "DELETE", headers: authHeaders(token) });
    if (!res.ok) { notify("Failed to delete.", "error"); return; }
    if (editingBlog?.slug === slug) setEditingBlog(null);
    notify("Resource deleted.");
    await loadData(token, isFullAdmin);
  }

  async function savePortfolio(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingPortfolio?.slug || !editingPortfolio.title || !editingPortfolio.description || !editingPortfolio.overview) return;
    const isNew = !editingPortfolio.originalSlug;
    const res = await fetch(
      isNew ? apiUrl("/api/admin/portfolio") : apiUrl(`/api/admin/portfolio/${editingPortfolio.originalSlug}`),
      {
      method: isNew ? "POST" : "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(editingPortfolio),
    });
    if (!res.ok) { notify("Failed to save portfolio project.", "error"); return; }
    setEditingPortfolio(null);
    notify("Portfolio project saved.");
    await loadData(token, isFullAdmin);
  }

  async function deletePortfolio(slug: string) {
    if (!token || !confirm(`Delete portfolio project "${slug}"?`)) return;
    const res = await fetch(apiUrl(`/api/admin/portfolio/${slug}`), { method: "DELETE", headers: authHeaders(token) });
    if (!res.ok) { notify("Failed to delete.", "error"); return; }
    if (editingPortfolio?.slug === slug) setEditingPortfolio(null);
    notify("Portfolio project deleted.");
    await loadData(token, isFullAdmin);
  }

  async function saveTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingTeam?.name || !editingTeam.role) return;
    const slug =
      editingTeam.slug?.trim() ||
      editingTeam.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const initials =
      editingTeam.initials?.trim() ||
      editingTeam.name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const isNew = !editingTeam.originalSlug;
    const payload = {
      ...editingTeam,
      slug,
      initials,
      image: editingTeam.image ?? null,
      sortOrder: Number(editingTeam.sortOrder) || 0,
      published: editingTeam.published ?? true,
    };
    const res = await fetch(
      isNew ? apiUrl("/api/admin/team") : apiUrl(`/api/admin/team/${editingTeam.originalSlug}`),
      {
        method: isNew ? "POST" : "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      notify("Failed to save team member.", "error");
      return;
    }
    setEditingTeam(null);
    notify("Team member saved.");
    await loadData(token, isFullAdmin);
  }

  async function deleteTeam(slug: string) {
    if (!token || !confirm(`Delete team member "${slug}"?`)) return;
    const res = await fetch(apiUrl(`/api/admin/team/${slug}`), {
      method: "DELETE",
      headers: authHeaders(token),
    });
    if (!res.ok) {
      notify("Failed to delete.", "error");
      return;
    }
    if (editingTeam?.slug === slug) setEditingTeam(null);
    notify("Team member deleted.");
    await loadData(token, isFullAdmin);
  }

  if (!token && needsBootstrap) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-black/[0.03] p-8">
          <h1 className="text-xl font-semibold">Set up your first admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No admin accounts exist yet. Create the first account to access Content Studio.
          </p>
          <form onSubmit={bootstrapFirstAdmin} className="mt-6 space-y-4">
            <AdminField label="Full name" value={newUserName} onChange={setNewUserName} />
            <AdminField label="Email" type="email" value={newUserEmail} onChange={setNewUserEmail} />
            <AdminField label="Password" type="password" value={newUserPassword} onChange={setNewUserPassword} hint="Minimum 8 characters" />
            <AdminButton type="submit" className="w-full">Create first admin</AdminButton>
          </form>
        </div>
      </div>
    );
  }

  if (!token) return <AdminAuthPanel onAuthenticated={handleAuthenticated} />;

  return (
    <>
      <AdminShell
        section={section}
        onSectionChange={setSection}
        userRole={user?.role ?? "content"}
        userName={user?.name}
        userEmail={user?.email}
        onLogout={logout}
      >
        {loading && section === "overview" ? (
          <p className="text-sm text-muted-foreground">Loading content…</p>
        ) : null}

        {section === "overview" && isFullAdmin && (
          <div className="space-y-8">
            <PageHeading
              title="Overview"
              subtitle="Summary of all website content managed from this panel"
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Resources" value={stats.blogTotal} hint={`${stats.blogPublished} published`} icon={FileText} />
              <StatCard label="Portfolio projects" value={stats.portfolioTotal} hint={`${stats.portfolioPublished} published`} icon={Briefcase} />
              <StatCard label="Our Team" value={stats.teamTotal} hint={`${stats.teamPublished} published`} icon={UserRound} />
              <StatCard label="Admin users" value={stats.admins} hint="Accounts with CMS access" icon={Users} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAction title="New resource" description="Article, guide, news, or case study" onClick={() => { setSection("resources"); setBlogEditorTab("basics"); setEditingBlog(emptyBlog()); }} />
              <QuickAction title="New portfolio project" description="Create a project for /portfolio" onClick={() => { setSection("portfolio"); setPortfolioEditorTab("basics"); setEditingPortfolio(emptyPortfolio()); }} />
              <QuickAction title="Add team member" description="Photo + bio for /about" onClick={() => { setSection("our-team"); setTeamEditorTab("basics"); setEditingTeam(emptyTeam()); }} />
              <QuickAction title="Manage admins" description="Invite another content editor" onClick={() => setSection("users")} />
            </div>
          </div>
        )}

        {section === "resources" && (
          editingBlog ? (
            <form onSubmit={saveBlog} className="flex h-full min-h-0 flex-col">
              <ContentEditorLayout
                title={editingBlog.title || "Untitled resource"}
                isNew={!editingBlog.originalSlug}
                published={editingBlog.published ?? false}
                publicPath={editingBlog.slug ? `/resources/${editingBlog.slug}/` : undefined}
                tabs={[
                  { id: "basics", label: "Basics", icon: LayoutTemplate },
                  { id: "media", label: "Media", icon: ImageIcon },
                  { id: "content", label: "Content", icon: Type },
                  { id: "settings", label: "Settings", icon: Settings2 },
                ]}
                activeTab={blogEditorTab}
                onTabChange={setBlogEditorTab}
                onBack={() => setEditingBlog(null)}
                preview={
                  <PreviewPanel mode={blogPreviewMode} onModeChange={setBlogPreviewMode}>
                    {blogPreviewMode === "card" ? (
                      <BlogCardPreview data={editingBlog} />
                    ) : (
                      <BlogDetailPreview data={editingBlog} />
                    )}
                  </PreviewPanel>
                }
                footer={<FormActions onCancel={() => setEditingBlog(null)} />}
              >
                {blogEditorTab === "basics" && (
                  <EditorSection
                    title="Basics"
                    description="Shown on the /resources listing and detail page"
                  >
                    <AdminField
                      label="Title"
                      value={editingBlog.title ?? ""}
                      onChange={(v) => setEditingBlog({ ...editingBlog, title: v })}
                      placeholder="Resource title"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium">Type</span>
                        <select
                          value={editingBlog.type ?? "article"}
                          onChange={(e) =>
                            setEditingBlog({
                              ...editingBlog,
                              type: e.target.value as ResourceType,
                            })
                          }
                          className="w-full rounded-xl border border-black/10 bg-background/80 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20"
                        >
                          {resourceTypes.map((type) => (
                            <option key={type} value={type}>
                              {resourceTypeLabels[type]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <AdminField
                        label="Publish date"
                        type="date"
                        value={editingBlog.date ?? ""}
                        onChange={(v) => setEditingBlog({ ...editingBlog, date: v })}
                      />
                    </div>
                    <AdminField
                      label="URL slug"
                      hint="Used in /resources/your-slug"
                      value={editingBlog.slug ?? ""}
                      onChange={(v) => setEditingBlog({ ...editingBlog, slug: v })}
                      placeholder="my-resource"
                    />
                    <AdminTextarea
                      label="Excerpt"
                      hint="Short summary on the listing card"
                      value={editingBlog.excerpt ?? ""}
                      onChange={(v) => setEditingBlog({ ...editingBlog, excerpt: v })}
                      rows={3}
                      placeholder="A brief intro that draws readers in…"
                    />
                  </EditorSection>
                )}

                {blogEditorTab === "media" && (
                  <EditorSection
                    title="Images"
                    description="Cover shows on cards and the resource hero; gallery appears on the detail page"
                  >
                    <ImageFields
                      token={token}
                      folder="resources"
                      coverImage={editingBlog.coverImage}
                      galleryImages={editingBlog.galleryImages ?? []}
                      onCoverChange={(url) => setEditingBlog({ ...editingBlog, coverImage: url })}
                      onGalleryChange={(urls) =>
                        setEditingBlog({ ...editingBlog, galleryImages: urls })
                      }
                    />
                  </EditorSection>
                )}

                {blogEditorTab === "content" && (
                  <EditorSection
                    title="Body"
                    description="Full formatted content on the detail page"
                  >
                    <RichTextEditor
                      label="Body"
                      hint="Headings, lists, links, and quotes supported"
                      value={editingBlog.content ?? ""}
                      onChange={(v) => setEditingBlog({ ...editingBlog, content: v })}
                      minHeight="360px"
                    />
                  </EditorSection>
                )}

                {blogEditorTab === "settings" && (
                  <EditorSection
                    title="Publish settings"
                    description="Control visibility on the public Resources page"
                  >
                    <PublishToggle
                      checked={editingBlog.published ?? false}
                      onChange={(v) => setEditingBlog({ ...editingBlog, published: v })}
                    />
                  </EditorSection>
                )}
              </ContentEditorLayout>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Resources</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stats.blogPublished} published · {stats.blogTotal} total on /resources
                  </p>
                </div>
                <AdminButton
                  onClick={() => {
                    setBlogEditorTab("basics");
                    setEditingBlog(
                      emptyBlog(
                        resourceTypeFilter === "all"
                          ? "article"
                          : resourceTypeFilter,
                      ),
                    );
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New resource
                </AdminButton>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-black/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: "all" as const, label: "All", count: stats.blogTotal },
                      ...resourceTypes.map((type) => ({
                        id: type,
                        label: resourceTypeLabels[type],
                        count: stats.byType[type] ?? 0,
                      })),
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setResourceTypeFilter(item.id)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        resourceTypeFilter === item.id
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-black/[0.05] hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <span className="ml-1.5 tabular-nums opacity-70">
                        {item.count}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    placeholder="Search resources…"
                    className="w-full rounded-xl border border-black/10 bg-background py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-400/50"
                  />
                </div>
              </div>

              {filteredBlogs.length === 0 ? (
                <EmptyState
                  title="No resources match"
                  description="Try another filter, or create a new resource in this category."
                  action={
                    <AdminButton
                      onClick={() => {
                        setBlogEditorTab("basics");
                        setEditingBlog(
                          emptyBlog(
                            resourceTypeFilter === "all"
                              ? "article"
                              : resourceTypeFilter,
                          ),
                        );
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      New resource
                    </AdminButton>
                  }
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-black/10">
                  <ul className="divide-y divide-black/[0.06]">
                    {filteredBlogs.map((post) => (
                      <li
                        key={post.slug}
                        className="flex flex-col gap-3 bg-card/30 p-3 transition-colors hover:bg-black/[0.02] sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-3"
                      >
                        <div className="h-16 w-full shrink-0 overflow-hidden rounded-lg border border-black/10 sm:h-14 sm:w-20">
                          {post.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.coverImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-brand-500/20 to-fuchsia-500/10" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                              {resourceTypeLabels[post.type] ?? "Article"}
                            </span>
                            <StatusBadge published={post.published} />
                          </div>
                          <p className="mt-1 truncate font-medium">{post.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            /resources/{post.slug} ·{" "}
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <AdminButton
                            variant="secondary"
                            className="px-3 py-2 text-xs"
                            onClick={() => {
                              setBlogEditorTab("basics");
                              setEditingBlog({
                                ...post,
                                originalSlug: post.slug,
                              });
                            }}
                          >
                            Edit
                          </AdminButton>
                          <AdminButton
                            variant="danger"
                            className="px-2 py-2"
                            onClick={() => void deleteBlog(post.slug)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </AdminButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        )}

        {section === "portfolio" && (
          editingPortfolio ? (
            <form onSubmit={savePortfolio} className="flex h-full min-h-0 flex-col">
              <ContentEditorLayout
                title={editingPortfolio.title || "Untitled project"}
                isNew={!editingPortfolio.originalSlug}
                published={editingPortfolio.published ?? false}
                publicPath={
                  editingPortfolio.slug ? `/portfolio/${editingPortfolio.slug}/` : undefined
                }
                tabs={[
                  { id: "basics", label: "Basics", icon: LayoutTemplate },
                  { id: "media", label: "Media", icon: ImageIcon },
                  { id: "detail", label: "Detail page", icon: FileText },
                  { id: "settings", label: "Settings", icon: Settings2 },
                ]}
                activeTab={portfolioEditorTab}
                onTabChange={setPortfolioEditorTab}
                onBack={() => setEditingPortfolio(null)}
                preview={
                  <PreviewPanel
                    mode={portfolioPreviewMode}
                    onModeChange={setPortfolioPreviewMode}
                  >
                    {portfolioPreviewMode === "card" ? (
                      <PortfolioCardPreview data={editingPortfolio} />
                    ) : (
                      <PortfolioDetailPreview data={editingPortfolio} />
                    )}
                  </PreviewPanel>
                }
                footer={<FormActions onCancel={() => setEditingPortfolio(null)} />}
              >
                {portfolioEditorTab === "basics" && (
                  <EditorSection
                    title="Listing card info"
                    description="Title, description, and tags on the /portfolio grid"
                  >
                    <EditorFieldGrid>
                      <AdminField
                        label="Project title"
                        value={editingPortfolio.title ?? ""}
                        onChange={(v) => setEditingPortfolio({ ...editingPortfolio, title: v })}
                      />
                      <AdminField
                        label="URL slug"
                        hint="Used in /portfolio/your-slug"
                        value={editingPortfolio.slug ?? ""}
                        onChange={(v) => setEditingPortfolio({ ...editingPortfolio, slug: v })}
                      />
                    </EditorFieldGrid>
                    <AdminField
                      label="Accent gradient"
                      hint="Tailwind classes e.g. from-cyan-400 to-blue-500"
                      value={editingPortfolio.accent ?? ""}
                      onChange={(v) => setEditingPortfolio({ ...editingPortfolio, accent: v })}
                      required={false}
                    />
                    <AdminTextarea
                      label="Short description"
                      hint="Shown on the portfolio grid card"
                      value={editingPortfolio.description ?? ""}
                      onChange={(v) =>
                        setEditingPortfolio({ ...editingPortfolio, description: v })
                      }
                      rows={3}
                    />
                    <AdminTextarea
                      label="Tags"
                      hint="One tag per line — shown as pills on the card"
                      value={(editingPortfolio.tags ?? []).join("\n")}
                      onChange={(v) =>
                        setEditingPortfolio({
                          ...editingPortfolio,
                          categories: editingPortfolio.categories,
                          tags: parseLines(v),
                        })
                      }
                      rows={2}
                    />
                  </EditorSection>
                )}

                {portfolioEditorTab === "media" && (
                  <EditorSection
                    title="Images"
                    description="Cover on grid cards; cover + gallery on the project page"
                  >
                    <ImageFields
                      token={token}
                      folder="portfolio"
                      coverImage={editingPortfolio.coverImage}
                      galleryImages={editingPortfolio.galleryImages ?? []}
                      onCoverChange={(url) =>
                        setEditingPortfolio({ ...editingPortfolio, coverImage: url })
                      }
                      onGalleryChange={(urls) =>
                        setEditingPortfolio({ ...editingPortfolio, galleryImages: urls })
                      }
                    />
                  </EditorSection>
                )}

                {portfolioEditorTab === "detail" && (
                  <EditorSection
                    title="Detail page content"
                    description="Overview and structured sections on the project page"
                  >
                    <RichTextEditor
                      label="Overview"
                      hint="Main intro paragraph — supports rich formatting"
                      value={editingPortfolio.overview ?? ""}
                      onChange={(v) => setEditingPortfolio({ ...editingPortfolio, overview: v })}
                      minHeight="240px"
                    />
                    <EditorListFields
                      items={[
                        {
                          title: "Categories",
                          description: `Valid: ${portfolioCategories.join(", ")}`,
                          content: (
                            <AdminTextarea
                              label=""
                              value={(editingPortfolio.categories ?? []).join("\n")}
                              onChange={(v) =>
                                setEditingPortfolio({
                                  ...editingPortfolio,
                                  categories: parseLines(v),
                                })
                              }
                              rows={2}
                              placeholder="One category per line"
                            />
                          ),
                        },
                        {
                          title: "Key features",
                          description: "Bullet list on the detail page",
                          content: (
                            <AdminTextarea
                              label=""
                              value={(editingPortfolio.keyFeatures ?? []).join("\n")}
                              onChange={(v) =>
                                setEditingPortfolio({
                                  ...editingPortfolio,
                                  keyFeatures: parseLines(v),
                                })
                              }
                              rows={3}
                              placeholder="One feature per line"
                            />
                          ),
                        },
                        {
                          title: "Benefits",
                          description: "Benefits section on the detail page",
                          content: (
                            <AdminTextarea
                              label=""
                              value={(editingPortfolio.benefits ?? []).join("\n")}
                              onChange={(v) =>
                                setEditingPortfolio({
                                  ...editingPortfolio,
                                  benefits: parseLines(v),
                                })
                              }
                              rows={3}
                              placeholder="One benefit per line"
                            />
                          ),
                        },
                        {
                          title: "Use cases",
                          description: "Use cases section on the detail page",
                          content: (
                            <AdminTextarea
                              label=""
                              value={(editingPortfolio.useCases ?? []).join("\n")}
                              onChange={(v) =>
                                setEditingPortfolio({
                                  ...editingPortfolio,
                                  useCases: parseLines(v),
                                })
                              }
                              rows={3}
                              placeholder="One use case per line"
                            />
                          ),
                        },
                      ]}
                    />
                  </EditorSection>
                )}

                {portfolioEditorTab === "settings" && (
                  <EditorSection
                    title="Publish settings"
                    description="Control visibility on the public website"
                  >
                    <PublishToggle
                      checked={editingPortfolio.published ?? false}
                      onChange={(v) => setEditingPortfolio({ ...editingPortfolio, published: v })}
                    />
                  </EditorSection>
                )}
              </ContentEditorLayout>
            </form>
          ) : (
            <ContentListPage
              title="Portfolio"
              subtitle="Projects displayed on the public /portfolio page"
              search={portfolioSearch}
              onSearchChange={setPortfolioSearch}
              createLabel="New project"
              onCreate={() => { setPortfolioEditorTab("basics"); setEditingPortfolio(emptyPortfolio()); }}
              emptyTitle="No portfolio projects yet"
              emptyDescription="Add your first project to populate the portfolio page."
              items={filteredPortfolio.map((project) => (
                <ContentListItem key={project.slug} title={project.title} subtitle={`/portfolio/${project.slug}`} published={project.published} coverImage={project.coverImage}
                  onEdit={() => { setPortfolioEditorTab("basics"); setEditingPortfolio({ ...project, originalSlug: project.slug }); }}
                  onDelete={() => void deletePortfolio(project.slug)} />
              ))}
            />
          )
        )}

        {section === "our-team" && (
          editingTeam ? (
            <form onSubmit={saveTeam} className="flex h-full min-h-0 flex-col">
              <ContentEditorLayout
                title={editingTeam.name || "Untitled member"}
                isNew={!editingTeam.originalSlug}
                published={editingTeam.published ?? true}
                publicPath="/about/#team"
                tabs={[
                  { id: "basics", label: "Basics", icon: LayoutTemplate },
                  { id: "photo", label: "Photo", icon: ImageIcon },
                  { id: "settings", label: "Settings", icon: Settings2 },
                ]}
                activeTab={teamEditorTab}
                onTabChange={setTeamEditorTab}
                onBack={() => setEditingTeam(null)}
                preview={
                  <div className="overflow-hidden rounded-2xl border border-black/10 bg-card/40">
                    <TeamMemberPhoto
                      member={{
                        name: editingTeam.name || "Name",
                        initials: editingTeam.initials || "?",
                        accent: editingTeam.accent || "from-brand-500 to-violet-600",
                        image: editingTeam.image,
                      }}
                      className="rounded-none"
                    />
                    <div className="p-5 text-center">
                      <p className="text-lg font-semibold tracking-tight">
                        {editingTeam.name || "Name"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {editingTeam.role || "Role"}
                      </p>
                    </div>
                  </div>
                }
                footer={<FormActions onCancel={() => setEditingTeam(null)} />}
              >
                {teamEditorTab === "basics" && (
                  <EditorSection
                    title="Profile"
                    description="Shown on the About page Meet Our Team section"
                  >
                    <EditorFieldGrid>
                      <AdminField
                        label="Name"
                        value={editingTeam.name ?? ""}
                        onChange={(v) => setEditingTeam({ ...editingTeam, name: v })}
                        placeholder="Full name"
                      />
                      <AdminField
                        label="Role"
                        value={editingTeam.role ?? ""}
                        onChange={(v) => setEditingTeam({ ...editingTeam, role: v })}
                        placeholder="Job title"
                      />
                    </EditorFieldGrid>
                    <EditorFieldGrid>
                      <AdminField
                        label="URL slug"
                        hint="Internal id, e.g. jim"
                        value={editingTeam.slug ?? ""}
                        onChange={(v) => setEditingTeam({ ...editingTeam, slug: v })}
                        placeholder="jim"
                      />
                      <AdminField
                        label="Initials"
                        hint="Fallback when no photo is attached"
                        value={editingTeam.initials ?? ""}
                        onChange={(v) => setEditingTeam({ ...editingTeam, initials: v })}
                        placeholder="J"
                      />
                    </EditorFieldGrid>
                    <AdminField
                      label="Sort order"
                      type="number"
                      hint="Lower numbers appear first"
                      value={String(editingTeam.sortOrder ?? 0)}
                      onChange={(v) =>
                        setEditingTeam({ ...editingTeam, sortOrder: Number(v) || 0 })
                      }
                    />
                  </EditorSection>
                )}

                {teamEditorTab === "photo" && token ? (
                  <EditorSection
                    title="Portrait photo"
                    description="Upload a headshot — used on the About page team grid"
                  >
                    <SingleImageField
                      token={token}
                      image={editingTeam.image}
                      folder="team"
                      label="Team photo"
                      hint="Portrait crop works best (4:5)"
                      onChange={(url) => setEditingTeam({ ...editingTeam, image: url })}
                    />
                  </EditorSection>
                ) : null}

                {teamEditorTab === "settings" && (
                  <EditorSection
                    title="Publish settings"
                    description="Control visibility on the public About page"
                  >
                    <PublishToggle
                      checked={editingTeam.published ?? true}
                      onChange={(v) => setEditingTeam({ ...editingTeam, published: v })}
                    />
                    <AdminField
                      label="Accent gradient"
                      hint="Used for initials fallback, e.g. from-brand-500 to-violet-600"
                      value={editingTeam.accent ?? ""}
                      onChange={(v) => setEditingTeam({ ...editingTeam, accent: v })}
                    />
                  </EditorSection>
                )}
              </ContentEditorLayout>
            </form>
          ) : (
            <ContentListPage
              title="Our Team"
              subtitle="People shown in Meet Our Team on /about"
              search={teamSearch}
              onSearchChange={setTeamSearch}
              createLabel="Add member"
              onCreate={() => {
                setTeamEditorTab("basics");
                setEditingTeam(emptyTeam());
              }}
              emptyTitle="No team members yet"
              emptyDescription="Add teammates and attach portrait photos for the About page."
              items={filteredTeam.map((member) => (
                <ContentListItem
                  key={member.slug}
                  title={member.name}
                  subtitle={member.role}
                  published={member.published}
                  coverImage={member.image}
                  onEdit={() => {
                    setTeamEditorTab("basics");
                    setEditingTeam({ ...member, originalSlug: member.slug });
                  }}
                  onDelete={() => void deleteTeam(member.slug)}
                />
              ))}
            />
          )
        )}

        {section === "users" && isFullAdmin && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <PageHeading
                title="Admins"
                subtitle="Invite editors and control who can publish website content"
              />
              <div className="flex gap-3">
                <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Total
                  </p>
                  <p className="text-lg font-semibold tabular-nums">{adminUsers.length}</p>
                </div>
                <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Admins
                  </p>
                  <p className="text-lg font-semibold tabular-nums">
                    {adminUsers.filter((u) => u.role === "admin").length}
                  </p>
                </div>
                <div className="rounded-xl border border-black/10 bg-black/[0.03] px-4 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Content
                  </p>
                  <p className="text-lg font-semibold tabular-nums">
                    {adminUsers.filter((u) => u.role === "content").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <section className="min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-card/40">
                <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
                  <div>
                    <h3 className="text-sm font-semibold">People with access</h3>
                    <p className="text-xs text-muted-foreground">
                      Change roles or reset passwords for each account
                    </p>
                  </div>
                </div>

                {adminUsers.length === 0 ? (
                  <div className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-medium">No accounts loaded</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Create the first editor on the right, or refresh if this looks wrong.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-black/[0.06]">
                    {adminUsers.map((member) => {
                      const isSelf = member.id === user?.id;
                      return (
                        <li key={member.id} className="px-5 py-4 transition-colors hover:bg-black/[0.02]">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                                  member.role === "admin"
                                    ? "bg-brand-500/15 text-brand-700"
                                    : "bg-black/[0.05] text-foreground/80",
                                )}
                              >
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate font-medium">{member.name}</p>
                                  {isSelf ? (
                                    <span className="rounded-md bg-black/[0.05] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                      You
                                    </span>
                                  ) : null}
                                  <RoleBadge role={member.role} />
                                </div>
                                <p className="truncate text-sm text-muted-foreground">
                                  {member.email}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Joined {member.createdAt}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                              <div className="inline-flex rounded-xl border border-black/10 bg-background/80 p-1">
                                {(["admin", "content"] as const).map((role) => (
                                  <button
                                    key={role}
                                    type="button"
                                    disabled={isSelf && member.role === "admin" && role !== "admin"}
                                    onClick={() => {
                                      if (member.role === role) return;
                                      void updateUserRole(member.id, role);
                                    }}
                                    className={cn(
                                      "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                                      member.role === role
                                        ? "bg-foreground text-background"
                                        : "text-muted-foreground hover:text-foreground",
                                      isSelf &&
                                        member.role === "admin" &&
                                        role !== "admin" &&
                                        "cursor-not-allowed opacity-40",
                                    )}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                              <AdminButton
                                type="button"
                                variant="secondary"
                                className="text-xs"
                                onClick={() => {
                                  setResetPasswordUserId(
                                    resetPasswordUserId === member.id ? null : member.id,
                                  );
                                  setResetPasswordValue("");
                                }}
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                                Password
                              </AdminButton>
                            </div>
                          </div>

                          {resetPasswordUserId === member.id ? (
                            <form
                              onSubmit={resetUserPassword}
                              className="mt-4 rounded-xl border border-black/10 bg-muted/40 p-4"
                            >
                              <p className="text-sm font-medium">
                                Reset password for {member.name}
                              </p>
                              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="min-w-0 flex-1">
                                  <AdminField
                                    label="New password"
                                    type="password"
                                    value={resetPasswordValue}
                                    onChange={setResetPasswordValue}
                                    hint="Minimum 8 characters"
                                  />
                                </div>
                                <div className="flex gap-2 pb-0.5">
                                  <AdminButton type="submit" className="text-xs">
                                    Save
                                  </AdminButton>
                                  <AdminButton
                                    type="button"
                                    variant="ghost"
                                    className="text-xs"
                                    onClick={() => setResetPasswordUserId(null)}
                                  >
                                    Cancel
                                  </AdminButton>
                                </div>
                              </div>
                            </form>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <aside className="xl:sticky xl:top-8 xl:self-start">
                <form
                  onSubmit={createAdminUser}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-brand-500/[0.06] to-transparent"
                >
                  <div className="border-b border-black/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Invite account</h3>
                        <p className="text-xs text-muted-foreground">
                          New people can sign in to Content Studio
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <AdminField
                      label="Full name"
                      value={newUserName}
                      onChange={setNewUserName}
                      placeholder="Jane Doe"
                    />
                    <AdminField
                      label="Email"
                      type="email"
                      value={newUserEmail}
                      onChange={setNewUserEmail}
                      placeholder="jane@klausway.com"
                    />
                    <AdminField
                      label="Temporary password"
                      type="password"
                      value={newUserPassword}
                      onChange={setNewUserPassword}
                      hint="They can change it later in Account"
                    />

                    <fieldset>
                      <legend className="mb-2 text-sm font-medium">Access level</legend>
                      <div className="grid gap-2">
                        {(
                          [
                            {
                              value: "content" as const,
                              title: "Content",
                              description: "Resources, Portfolio & Our Team",
                            },
                            {
                              value: "admin" as const,
                              title: "Admin",
                              description: "Full studio access + invites",
                            },
                          ] as const
                        ).map((option) => (
                          <label
                            key={option.value}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
                              newUserRole === option.value
                                ? "border-brand-400/40 bg-brand-500/10"
                                : "border-black/10 bg-background/70 hover:border-black/20",
                            )}
                          >
                            <input
                              type="radio"
                              name="new-user-role"
                              value={option.value}
                              checked={newUserRole === option.value}
                              onChange={() => setNewUserRole(option.value)}
                              className="mt-1 accent-brand-600"
                            />
                            <span>
                              <span className="block text-sm font-medium">{option.title}</span>
                              <span className="block text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <AdminButton type="submit" className="w-full">
                      <Plus className="h-4 w-4" />
                      Create account
                    </AdminButton>
                  </div>
                </form>

                <div className="mt-4 rounded-2xl border border-dashed border-black/10 px-4 py-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground/80">Role guide</p>
                  <p className="mt-1">
                    <span className="font-medium text-foreground">Content</span> edits public
                    pages. <span className="font-medium text-foreground">Admin</span> also
                    manages accounts and overview.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        )}

        {section === "account" && (
          <div className="mx-auto max-w-md">
            <PageHeading
              title="Account"
              subtitle="Change the password for your signed-in account"
            />
            <form
              onSubmit={changeOwnPassword}
              className="mt-6 space-y-4 rounded-2xl border border-black/10 bg-black/[0.03] p-6"
            >
              <AdminField
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <AdminField
                label="New password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                hint="Minimum 8 characters"
              />
              <AdminField
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
              <AdminButton type="submit" className="w-full">
                Update password
              </AdminButton>
            </form>
          </div>
        )}
      </AdminShell>

      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </>
  );
}

function RoleBadge({ role }: { role: AdminRole }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        role === "admin"
          ? "bg-brand-400/15 text-brand-700"
          : "bg-black/[0.05] text-muted-foreground",
      )}
    >
      {role === "admin" ? "Admin" : "Content"}
    </span>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function QuickAction({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-left transition-colors hover:border-brand-400/30 hover:bg-brand-500/5">
      <Plus className="h-5 w-5 text-brand-600" />
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

function ContentListPage({
  title, subtitle, search, onSearchChange, createLabel, onCreate,
  emptyTitle, emptyDescription, items,
}: {
  title: string; subtitle: string; search: string; onSearchChange: (v: string) => void;
  createLabel: string; onCreate: () => void; emptyTitle: string; emptyDescription: string;
  items: React.ReactNode;
}) {
  const isEmpty = !items || (Array.isArray(items) && items.length === 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <PageHeading title={title} subtitle={subtitle} />
        <AdminButton onClick={onCreate}><Plus className="h-4 w-4" />{createLabel}</AdminButton>
      </div>
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or slug…"
          className="w-full rounded-xl border border-black/10 bg-black/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400/50"
        />
      </div>
      {isEmpty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} action={<AdminButton onClick={onCreate}><Plus className="h-4 w-4" />{createLabel}</AdminButton>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items}</div>
      )}
    </div>
  );
}

function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <AdminButton type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </AdminButton>
      <AdminButton type="submit">Save changes</AdminButton>
    </div>
  );
}
function ContentListItem({
  title, subtitle, published, coverImage, onEdit, onDelete, badge,
}: {
  title: string; subtitle: string; published: boolean;
  coverImage?: string | null; onEdit: () => void; onDelete: () => void;
  badge?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-black/10 bg-black/[0.03] transition-colors hover:border-black/15">
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="" className="aspect-[16/10] w-full object-cover" />
      ) : (
        <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-500/20 to-fuchsia-500/10" />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 font-medium leading-snug">{title}</p>
          <StatusBadge published={published} />
        </div>
        {badge ? (
          <span className="mt-2 inline-flex w-fit rounded-md bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
            {badge}
          </span>
        ) : null}
        <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
        <div className="mt-4 flex gap-2">
          <AdminButton variant="secondary" onClick={onEdit} className="flex-1 px-2 py-2 text-xs">Edit</AdminButton>
          <AdminButton variant="danger" onClick={onDelete} className="px-2 py-2"><Trash2 className="h-3.5 w-3.5" /></AdminButton>
        </div>
      </div>
    </div>
  );
}
