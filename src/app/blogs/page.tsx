"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Marcellus, Jost } from "next/font/google";
import {
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  X,
  Edit2,
} from "lucide-react";
import AnimatedContainer from "@/components/shared/AnimatedContainer";
import { blogApi, type Blog } from "@/lib/api";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
  });
  const [editBlog, setEditBlog] = useState<{
    id: string;
    title: string;
    description: string;
  }>({
    id: "",
    title: "",
    description: "",
  });
  const itemsPerPage = 9;

  useEffect(() => {
    fetchBlogs();
    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const checkAdminStatus = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAdmin(user.role === "ADMIN" || user.role === "SUPER_ADMIN");
        } catch {
          setIsAdmin(false);
        }
      }
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll({
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response && response.data) {
        setBlogs(response.data);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalRecords(response.pagination.totalRecords);
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExcerpt = (description: string, maxLength: number = 150) => {
    const text = stripHtmlTags(description);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddBlog = async () => {
    if (!newBlog.title.trim() || !newBlog.description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await blogApi.create({
        title: newBlog.title,
        description: newBlog.description,
      });

      if (response && response.success) {
        alert("Blog created successfully!");
        setShowAddModal(false);
        setNewBlog({ title: "", description: "" });
        setCurrentPage(1);
        fetchBlogs();
      } else {
        alert("Failed to create blog. Please try again.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert(error instanceof Error ? error.message : "Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (blog: Blog, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    setEditBlog({
      id: blog._id,
      title: blog.title,
      description: blog.description,
    });
    setShowEditModal(true);
  };

  const handleUpdateBlog = async () => {
    if (!editBlog.title.trim() || !editBlog.description.trim()) {
      alert("Please fill in both title and description");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await blogApi.update(editBlog.id, {
        title: editBlog.title,
        description: editBlog.description,
      });

      if (response && response.success) {
        alert("Blog updated successfully!");
        setShowEditModal(false);
        setEditBlog({ id: "", title: "", description: "" });
        fetchBlogs();
      } else {
        alert("Failed to update blog. Please try again.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert(error instanceof Error ? error.message : "Failed to update blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-none border transition-colors ${
            currentPage === 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-[#c89e3a] text-[#c89e3a] hover:bg-[#c89e3a] hover:text-white"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-4 py-2 rounded-none border border-[#c89e3a] text-[#c89e3a] hover:bg-[#c89e3a] hover:text-white transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-none border transition-colors ${
              currentPage === page
                ? "bg-[#c89e3a] text-white border-[#c89e3a]"
                : "border-[#c89e3a] text-[#c89e3a] hover:bg-[#c89e3a] hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-4 py-2 rounded-none border border-[#c89e3a] text-[#c89e3a] hover:bg-[#c89e3a] hover:text-white transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-none border transition-colors ${
            currentPage === totalPages
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-[#c89e3a] text-[#c89e3a] hover:bg-[#c89e3a] hover:text-white"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-7xl">
          <AnimatedContainer direction="up">
            <div className="text-center mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-32"></div>

                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl text-[#2d2d2d] font-normal tracking-tight ${marcellus.className}`}
                >
                  Our Blog
                </h1>

                <div className="w-32 flex justify-end">
                  {isAdmin && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#c89e3a] text-white rounded-none hover:bg-[#9d7400] transition-colors"
                      title="Add New Blog"
                    >
                      <Plus size={20} />
                      <span
                        className={`text-sm font-semibold ${jost.className}`}
                      >
                        Add Blog
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <div className="w-20 h-1 bg-[#c89e3a] mx-auto mb-6"></div>
              <p
                className={`text-gray-600 text-lg md:text-xl max-w-3xl mx-auto font-light ${jost.className}`}
              >
                Insights, trends, and knowledge about diamonds and the jewelry
                industry
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </section>

      {/* Blogs Grid Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className={`text-gray-600 text-xl ${jost.className}`}>
                No blogs available at the moment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <AnimatedContainer
                    key={blog._id}
                    direction="up"
                    delay={index * 0.1}
                  >
                    <div
                      className="bg-white rounded-none shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col relative"
                      onClick={() => router.push(`/blogs/${blog._id}`)}
                    >
                      {/* Edit Button - Only visible for Admin */}
                      {isAdmin && (
                        <button
                          onClick={(e) => handleEditClick(blog, e)}
                          className="absolute top-4 cursor-pointer right-4 z-10 p-2 bg-white rounded-none shadow-md hover:bg-[#c89e3a] hover:text-white transition-colors group"
                          title="Edit Blog"
                        >
                          <Edit2
                            size={18}
                            className="text-[#c89e3a] group-hover:text-white"
                          />
                        </button>
                      )}

                      <div className="p-6 flex-1 flex flex-col">
                        <h3
                          className={`text-xl md:text-2xl font-semibold text-[#2d2d2d] mb-3 hover:text-[#c89e3a] transition-colors pr-10 ${marcellus.className}`}
                        >
                          {blog.title}
                        </h3>

                        <p
                          className={`text-gray-600 mb-4 flex-1 ${jost.className}`}
                        >
                          {getExcerpt(blog.description)}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User size={16} />
                            <span className={jost.className}>
                              {blog.authorName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            <span className={jost.className}>
                              {formatDate(blog.createdAt)}
                            </span>
                          </div>
                        </div>

                        <button
                          className={`mt-4 text-[#c89e3a] hover:text-[#9d7400] font-semibold text-sm transition-colors ${jost.className}`}
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </AnimatedContainer>
                ))}
              </div>

              {renderPagination()}

              <div className="text-center mt-8">
                <p className={`text-gray-600 text-sm ${jost.className}`}>
                  Showing {blogs.length} of {totalRecords} blog
                  {totalRecords !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Add Blog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2
                className={`text-2xl font-semibold text-[#2d2d2d] ${marcellus.className}`}
              >
                Add New Blog
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewBlog({ title: "", description: "" });
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${jost.className}`}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                  className={`w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#c89e3a] bg-white text-gray-900 ${jost.className}`}
                  placeholder="Enter blog title"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${jost.className}`}
                >
                  Description (HTML supported)
                </label>
                <textarea
                  value={newBlog.description}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, description: e.target.value })
                  }
                  className={`w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#c89e3a] min-h-[200px] bg-white text-gray-900 ${jost.className}`}
                  placeholder="<h1>Welcome!</h1><p>Your blog content here...</p>"
                  disabled={isSubmitting}
                />
                <p className={`text-xs text-gray-500 mt-2 ${jost.className}`}>
                  You can use HTML tags like &lt;h1&gt;, &lt;p&gt;,
                  &lt;strong&gt;, etc.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewBlog({ title: "", description: "" });
                  }}
                  className={`px-6 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors ${jost.className}`}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBlog}
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-[#c89e3a] text-white rounded-none hover:bg-[#9d7400] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${jost.className}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
                      Creating...
                    </>
                  ) : (
                    "Create Blog"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2
                className={`text-2xl font-semibold text-[#2d2d2d] ${marcellus.className}`}
              >
                Edit Blog
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditBlog({ id: "", title: "", description: "" });
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${jost.className}`}
                >
                  Title
                </label>
                <input
                  type="text"
                  value={editBlog.title}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, title: e.target.value })
                  }
                  className={`w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#c89e3a] bg-white text-gray-900 ${jost.className}`}
                  placeholder="Enter blog title"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm font-semibold text-gray-700 mb-2 ${jost.className}`}
                >
                  Description (HTML supported)
                </label>
                <textarea
                  value={editBlog.description}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, description: e.target.value })
                  }
                  className={`w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#c89e3a] min-h-[200px] bg-white text-gray-900 ${jost.className}`}
                  placeholder="<h1>Welcome!</h1><p>Your blog content here...</p>"
                  disabled={isSubmitting}
                />
                <p className={`text-xs text-gray-500 mt-2 ${jost.className}`}>
                  You can use HTML tags like &lt;h1&gt;, &lt;p&gt;,
                  &lt;strong&gt;, etc.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditBlog({ id: "", title: "", description: "" });
                  }}
                  className={`px-6 py-2 border border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors ${jost.className}`}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBlog}
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-[#c89e3a] text-white rounded-none hover:bg-[#9d7400] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${jost.className}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-12 h-12 animate-spin text-[#FAF6EB] mx-auto mb-4" />
                      Updating...
                    </>
                  ) : (
                    "Update Blog"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
