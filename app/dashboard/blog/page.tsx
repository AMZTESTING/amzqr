"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  X,
  FileText,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(""); setContent(""); setImageUrl("");
    setEditingPost(null); setShowForm(false);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.image_url || "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = { title, content, image_url: imageUrl || null };
    if (editingPost) {
      await supabase.from("blog_posts").update(postData).eq("id", editingPost.id);
    } else {
      await supabase.from("blog_posts").insert([postData]);
    }
    resetForm();
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-[#C08552] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500 mt-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition">
          <Plus size={18} /> New Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{editingPost ? "Edit Post" : "New Post"}</h2>
            <button onClick={resetForm} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="Post title..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Image URL</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Content *</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={6} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="Write your post..." />
            </div>
            <button type="submit" className="w-full bg-[#C08552] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#a07042] transition">
              {editingPost ? "Update Post" : "Publish Post"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-gray-600 text-sm mt-3 line-clamp-3">{post.content}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => handleEdit(post)} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}