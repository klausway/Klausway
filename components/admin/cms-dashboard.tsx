"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Plus,
  Search,
  Settings2,
  Trash2,
  Type,
  Users,
} from "lucide-react";
import { AdminAuthPanel } from "@/components/admin/admin-auth-panel";
import { AdminShell, type AdminSection } from "@/components/admin/admin-shell";
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
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { portfolioCategories } from "@/lib/portfolio";
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

type AdminUser = { name: string; email: string };
type AdminUserRecord = AdminUser & { id: string; createdAt: string };

type BlogRecord = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
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

type PreviewMode = "card" | "detail";

function parseLines(value: string) {
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

const emptyBlog = (): Partial<BlogRecord> & { originalSlug?: string } => ({
  slug: "", title: "", excerpt: "", content: "",
  coverImage: null, galleryImages: [], published: false,
  date: new Date().toISOString().slice(0, 10),
});

const emptyPortfolio = (): Partial<PortfolioRecord> & { originalSlug?: string } => ({
  slug: "", title: "", description: "", overview: "",
  coverImage: null, galleryImages: [], categories: [], tags: [],
  accent: "from-cyan-400 to-blue-500", keyFeatures: [], benefits: [], useCases: [],
  published: false,
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
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);

  const [blogSearch, setBlogSearch] = useState("");
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [blogPreviewMode, setBlogPreviewMode] = useState<PreviewMode>("card");
  const [portfolioPreviewMode, setPortfolioPreviewMode] = useState<PreviewMode>("card");
  const [blogEditorTab, setBlogEditorTab] = useState("basics");
  const [portfolioEditorTab, setPortfolioEditorTab] = useState("basics");

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const [editingBlog, setEditingBlog] = useState<(Partial<BlogRecord> & { originalSlug?: string }) | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<(Partial<PortfolioRecord> & { originalSlug?: string }) | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("cms_token");
    const savedUser = sessionStorage.getItem("cms_user");
    if (savedToken) setToken(savedToken);
    if (savedUser) {
      try { setUser(JSON.parse(savedUser) as AdminUser); } catch { sessionStorage.removeItem("cms_user"); }
    }
  }, []);

  useEffect(() => {
    void fetch("/api/admin/setup")
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

  const loadUsers = useCallback(async (authToken: string) => {
    const res = await fetch("/api/admin/users", { headers: authHeaders(authToken) });
    if (!res.ok) return;
    const users = (await res.json()) as AdminUserRecord[];
    setAdminUsers(users.map((u) => ({ ...u, createdAt: u.createdAt.slice(0, 10) })));
  }, []);

  const loadData = useCallback(async (authToken: string) => {
    setLoading(true);
    try {
      const [blogRes, portfolioRes] = await Promise.all([
        fetch("/api/admin/blog", { headers: authHeaders(authToken) }),
        fetch("/api/admin/portfolio", { headers: authHeaders(authToken) }),
      ]);
      if (blogRes.status === 401 || portfolioRes.status === 401) {
        sessionStorage.clear();
        setToken(null);
        setUser(null);
        throw new Error("Session expired. Please sign in again.");
      }
      if (!blogRes.ok || !portfolioRes.ok) throw new Error("Failed to load content.");

      const blogs = (await blogRes.json()) as BlogRecord[];
      const projects = (await portfolioRes.json()) as PortfolioRecord[];
      setBlogPosts(blogs.map((p) => ({ ...p, date: p.date.slice(0, 10), galleryImages: p.galleryImages ?? [] })));
      setPortfolioProjects(projects.map((p) => ({ ...p, galleryImages: p.galleryImages ?? [] })));
      await loadUsers(authToken);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Failed to load content.", "error");
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  useEffect(() => { if (token) void loadData(token); }, [token, loadData]);

  const stats = useMemo(() => ({
    blogTotal: blogPosts.length,
    blogPublished: blogPosts.filter((p) => p.published).length,
    portfolioTotal: portfolioProjects.length,
    portfolioPublished: portfolioProjects.filter((p) => p.published).length,
    admins: adminUsers.length,
  }), [blogPosts, portfolioProjects, adminUsers]);

  const filteredBlogs = blogPosts.filter((p) =>
    p.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(blogSearch.toLowerCase()),
  );

  const filteredPortfolio = portfolioProjects.filter((p) =>
    p.title.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
    p.slug.toLowerCase().includes(portfolioSearch.toLowerCase()),
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
  }

  async function bootstrapFirstAdmin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
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
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ name: newUserName, email: newUserEmail, password: newUserPassword }),
    });
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) { notify(payload.error ?? "Failed to create account.", "error"); return; }
    setNewUserName(""); setNewUserEmail(""); setNewUserPassword("");
    notify("Admin account created.");
    await loadUsers(token);
  }

  async function saveBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingBlog?.slug || !editingBlog.title || !editingBlog.excerpt) return;
    const isNew = !editingBlog.originalSlug;
    const res = await fetch(isNew ? "/api/admin/blog" : `/api/admin/blog/${editingBlog.originalSlug}`, {
      method: isNew ? "POST" : "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({
        slug: editingBlog.slug, title: editingBlog.title, excerpt: editingBlog.excerpt,
        content: editingBlog.content ?? editingBlog.excerpt,
        coverImage: editingBlog.coverImage ?? null,
        galleryImages: editingBlog.galleryImages ?? [],
        published: editingBlog.published ?? false,
        date: editingBlog.date ?? new Date().toISOString().slice(0, 10),
      }),
    });
    if (!res.ok) { notify("Failed to save blog post.", "error"); return; }
    setEditingBlog(null);
    notify("Blog post saved.");
    await loadData(token);
  }

  async function deleteBlog(slug: string) {
    if (!token || !confirm(`Delete blog post "${slug}"?`)) return;
    const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE", headers: authHeaders(token) });
    if (!res.ok) { notify("Failed to delete.", "error"); return; }
    if (editingBlog?.slug === slug) setEditingBlog(null);
    notify("Blog post deleted.");
    await loadData(token);
  }

  async function savePortfolio(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingPortfolio?.slug || !editingPortfolio.title || !editingPortfolio.description || !editingPortfolio.overview) return;
    const isNew = !editingPortfolio.originalSlug;
    const res = await fetch(isNew ? "/api/admin/portfolio" : `/api/admin/portfolio/${editingPortfolio.originalSlug}`, {
      method: isNew ? "POST" : "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(editingPortfolio),
    });
    if (!res.ok) { notify("Failed to save portfolio project.", "error"); return; }
    setEditingPortfolio(null);
    notify("Portfolio project saved.");
    await loadData(token);
  }

  async function deletePortfolio(slug: string) {
    if (!token || !confirm(`Delete portfolio project "${slug}"?`)) return;
    const res = await fetch(`/api/admin/portfolio/${slug}`, { method: "DELETE", headers: authHeaders(token) });
    if (!res.ok) { notify("Failed to delete.", "error"); return; }
    if (editingPortfolio?.slug === slug) setEditingPortfolio(null);
    notify("Portfolio project deleted.");
    await loadData(token);
  }

  if (!token && needsBootstrap) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
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
      <AdminShell section={section} onSectionChange={setSection} userName={user?.name} userEmail={user?.email} onLogout={logout}>
        {loading && section === "overview" ? (
          <p className="text-sm text-muted-foreground">Loading content…</p>
        ) : null}

        {section === "overview" && (
          <div className="space-y-8">
            <PageHeading
              title="Overview"
              subtitle="Summary of all website content managed from this panel"
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Blog posts" value={stats.blogTotal} hint={`${stats.blogPublished} published`} icon={FileText} />
              <StatCard label="Portfolio projects" value={stats.portfolioTotal} hint={`${stats.portfolioPublished} published`} icon={Briefcase} />
              <StatCard label="Admin users" value={stats.admins} hint="Team members with access" icon={Users} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <QuickAction title="New blog post" description="Create an article for /blog" onClick={() => { setSection("blog"); setBlogEditorTab("basics"); setEditingBlog(emptyBlog()); }} />
              <QuickAction title="New portfolio project" description="Create a project for /portfolio" onClick={() => { setSection("portfolio"); setPortfolioEditorTab("basics"); setEditingPortfolio(emptyPortfolio()); }} />
              <QuickAction title="Manage admin users" description="Invite another content editor" onClick={() => setSection("users")} />
            </div>
          </div>
        )}

        {section === "blog" && (
          editingBlog ? (
            <form onSubmit={saveBlog}>
              <ContentEditorLayout
                title={editingBlog.title || "Untitled post"}
                isNew={!editingBlog.originalSlug}
                published={editingBlog.published ?? false}
                publicPath={editingBlog.slug ? `/blog/${editingBlog.slug}/` : undefined}
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
                    title="Listing card info"
                    description="Title, date, and excerpt appear on the /blog grid"
                  >
                    <EditorFieldGrid>
                      <AdminField
                        label="Title"
                        value={editingBlog.title ?? ""}
                        onChange={(v) => setEditingBlog({ ...editingBlog, title: v })}
                        placeholder="Post title"
                      />
                      <AdminField
                        label="Publish date"
                        type="date"
                        value={editingBlog.date ?? ""}
                        onChange={(v) => setEditingBlog({ ...editingBlog, date: v })}
                      />
                    </EditorFieldGrid>
                    <AdminField
                      label="URL slug"
                      hint="Used in /blog/your-slug"
                      value={editingBlog.slug ?? ""}
                      onChange={(v) => setEditingBlog({ ...editingBlog, slug: v })}
                      placeholder="my-blog-post"
                    />
                    <AdminTextarea
                      label="Excerpt"
                      hint="Short summary on the listing card"
                      value={editingBlog.excerpt ?? ""}
                      onChange={(v) => setEditingBlog({ ...editingBlog, excerpt: v })}
                      rows={4}
                      placeholder="A brief intro that draws readers in…"
                    />
                  </EditorSection>
                )}

                {blogEditorTab === "media" && (
                  <EditorSection
                    title="Images"
                    description="Cover shows on cards and the article hero; gallery appears on the detail page"
                  >
                    <ImageFields
                      token={token}
                      folder="blog"
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
                    title="Article body"
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
                    description="Control visibility on the public website"
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
            <ContentListPage
              title="Blog"
              subtitle="Posts displayed on the public /blog page"
              search={blogSearch}
              onSearchChange={setBlogSearch}
              createLabel="New post"
              onCreate={() => { setBlogEditorTab("basics"); setEditingBlog(emptyBlog()); }}
              emptyTitle="No blog posts yet"
              emptyDescription="Create your first article to populate the blog page."
              items={filteredBlogs.map((post) => (
                <ContentListItem key={post.slug} title={post.title} subtitle={`/blog/${post.slug}`} published={post.published} coverImage={post.coverImage}
                  onEdit={() => { setBlogEditorTab("basics"); setEditingBlog({ ...post, originalSlug: post.slug }); }}
                  onDelete={() => void deleteBlog(post.slug)} />
              ))}
            />
          )
        )}

        {section === "portfolio" && (
          editingPortfolio ? (
            <form onSubmit={savePortfolio}>
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

        {section === "users" && (
          <div className="grid gap-8 xl:grid-cols-2">
            <div>
              <PageHeading title="Admin users" subtitle="People who can sign in and manage website content" />
              <ul className="mt-6 space-y-3">
                {adminUsers.map((admin) => (
                  <li key={admin.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-200">
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      <p className="text-xs text-muted-foreground">Joined {admin.createdAt}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={createAdminUser} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold">Create admin account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Only signed-in admins can invite new team members.
              </p>
              <div className="mt-6 space-y-4">
                <AdminField label="Full name" value={newUserName} onChange={setNewUserName} />
                <AdminField label="Email" type="email" value={newUserEmail} onChange={setNewUserEmail} />
                <AdminField label="Password" type="password" value={newUserPassword} onChange={setNewUserPassword} hint="Minimum 8 characters" />
                <AdminButton type="submit" className="w-full"><Plus className="h-4 w-4" />Create account</AdminButton>
              </div>
            </form>
          </div>
        )}
      </AdminShell>

      {toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null}
    </>
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
    <button type="button" onClick={onClick} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:border-brand-400/30 hover:bg-brand-500/5">
      <Plus className="h-5 w-5 text-brand-300" />
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
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400/50"
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
  title, subtitle, published, coverImage, onEdit, onDelete,
}: {
  title: string; subtitle: string; published: boolean;
  coverImage?: string | null; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
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
        <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
        <div className="mt-4 flex gap-2">
          <AdminButton variant="secondary" onClick={onEdit} className="flex-1 px-2 py-2 text-xs">Edit</AdminButton>
          <AdminButton variant="danger" onClick={onDelete} className="px-2 py-2"><Trash2 className="h-3.5 w-3.5" /></AdminButton>
        </div>
      </div>
    </div>
  );
}
