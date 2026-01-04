"use client";

import { useState, useEffect } from "react";
import { Search, LayoutGrid, List, FileText, Plus, ChevronLeft, ChevronRight, Trash2, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useWorkflowStore } from "@/store/workflowStore";
import UserDropdown from "@/components/UserDropdown";

interface Workflow {
  _id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export default function StartNowPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const clearWorkflow = useWorkflowStore((state) => state.clearWorkflow);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
    // Verify we're on the correct path
    if (typeof window !== "undefined" && pathname !== "/start-now") {
      router.replace("/start-now");
    }
  }, [pathname, router]);

  // Get user's name for workspace title
  const userName = user?.firstName || user?.lastName || user?.emailAddresses[0]?.emailAddress || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : userName;

  // Redirect if not authenticated (middleware should handle this, but adding safety check)
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // Fetch workflows from API
  useEffect(() => {
    if (user) {
      fetchWorkflows();
    }
  }, [user]);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch("/api/workflows");
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewFile = async () => {
    setIsCreating(true);
    try {
      // Clear the workflow store before creating a new file
      clearWorkflow();
      
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "untitled" }),
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to the new workflow editor
        if (data.workflow && data.workflow.id) {
          router.push(`/workflow/${data.workflow.id}`);
        } else {
          console.error("Invalid workflow response:", data);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to create workflow:", errorData);
      }
    } catch (error) {
      console.error("Error creating workflow:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const handleDeleteWorkflow = async (workflowId: string, workflowName: string) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${workflowName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(workflowId);
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setWorkflows(workflows.filter((w) => w._id !== workflowId));
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete workflow: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Failed to delete workflow. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-white items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-[#f7f7ad] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white">
      {/* Left Sidebar */}
      <aside className={`${isSidebarCollapsed ? "w-16" : "w-64"} border-r border-gray-800 flex flex-col transition-all duration-300`}>
        {/* User Profile Section with Dropdown */}
        <div className="p-4 border-b border-gray-800">
          {!isSidebarCollapsed ? (
            <UserDropdown 
              userName={fullName}
              userInitial={userInitial}
              userImage={user?.imageUrl}
            />
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                {userInitial}
              </div>
            </div>
          )}
        </div>

        {/* Create New File Button */}
        <div className="p-4">
          <button
            onClick={handleCreateNewFile}
            disabled={isCreating}
            className="w-full bg-[#f7f7ad] hover:bg-[#f5f595] text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {!isSidebarCollapsed && <span>{isCreating ? "Creating..." : "Create New File"}</span>}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/start-now"
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} w-full px-3 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors`}
            title={isSidebarCollapsed ? "My Files" : ""}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              {!isSidebarCollapsed && <span>My Files</span>}
            </div>
            {!isSidebarCollapsed && <Plus className="w-4 h-4" />}
          </Link>

          <button 
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : ""} space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors`}
            title={isSidebarCollapsed ? "Shared with me" : ""}
          >
            <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs">👥</span>
            </div>
            {!isSidebarCollapsed && <span>Shared with me</span>}
          </button>

          <button 
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : ""} space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors`}
            title={isSidebarCollapsed ? "Apps" : ""}
          >
            <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs">▶</span>
            </div>
            {!isSidebarCollapsed && <span>Apps</span>}
          </button>
        </nav>

        {/* Discord Link */}
        <div className="p-4 border-t border-gray-800">
          <button 
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : ""} space-x-2 text-gray-400 hover:text-white transition-colors`}
            title={isSidebarCollapsed ? "Discord" : ""}
          >
            <div className="w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center">
              <span className="text-xs">💬</span>
            </div>
            {!isSidebarCollapsed && <span className="text-sm">Discord</span>}
          </button>
        </div>

        {/* Collapse Toggle Button */}
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">{userName}'s Workspace</h1>
          </div>
          <button
            onClick={handleCreateNewFile}
            disabled={isCreating}
            className="bg-[#f7f7ad] hover:bg-[#f5f595] text-black font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? "Creating..." : "Create New File"}</span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* My Files Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">My files</h2>
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#f7f7ad] w-48"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    } transition-colors`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    } transition-colors`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-gray-700 border-t-[#f7f7ad] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading files...</p>
              </div>
            ) : (
              <>
                {/* Files Grid/List */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredWorkflows.map((workflow) => (
                      <div
                        key={workflow._id}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-[#f7f7ad] transition-colors group relative"
                      >
                        <Link
                          href={`/workflow/${workflow._id}`}
                          className="block cursor-pointer"
                        >
                          <div className="flex flex-col items-center justify-center h-32 mb-4">
                            <FileText className="w-12 h-12 text-gray-400 group-hover:text-[#f7f7ad] transition-colors" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium mb-1">{workflow.name}</p>
                            <p className="text-xs text-gray-400">Last edited {formatTimeAgo(workflow.updatedAt)}</p>
                          </div>
                        </Link>
                        {/* Delete Button - appears on hover */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteWorkflow(workflow._id, workflow.name);
                          }}
                          disabled={deletingId === workflow._id}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          title="Delete workflow"
                        >
                          {deletingId === workflow._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredWorkflows.map((workflow) => (
                      <div
                        key={workflow._id}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-[#f7f7ad] transition-colors flex items-center space-x-4 group relative"
                      >
                        <Link
                          href={`/workflow/${workflow._id}`}
                          className="flex items-center space-x-4 flex-1 cursor-pointer"
                        >
                          <FileText className="w-8 h-8 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{workflow.name}</p>
                            <p className="text-xs text-gray-400">Last edited {formatTimeAgo(workflow.updatedAt)}</p>
                          </div>
                        </Link>
                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteWorkflow(workflow._id, workflow.name);
                          }}
                          disabled={deletingId === workflow._id}
                          className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                          title="Delete workflow"
                        >
                          {deletingId === workflow._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {filteredWorkflows.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No files yet</p>
                    <button
                      onClick={handleCreateNewFile}
                      disabled={isCreating}
                      className="mt-4 bg-[#f7f7ad] hover:bg-[#f5f595] text-black font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isCreating ? "Creating..." : "Create New File"}
                    </button>
                  </div>
                )}
              </>
            )}
        </div>
      </div>
      </main>
    </div>
  );
}
