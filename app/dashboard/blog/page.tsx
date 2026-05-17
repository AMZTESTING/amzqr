"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setEditingPost(null);
    setShowForm(false);
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
    const postData = {
      title,
      content,
      image_url: imageUrl || null,
    };

    if (editingPost) {
      await supabase.from("blog_posts").update(postData).eq("id", editingPost.id);
    } else {
      await supabase.from("blog_posts").insert([postData]);
    }

    resetForm();
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await supabase.from("blog_posts").delete().eq("id", id);
      fetchPosts();
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">📝 Blog</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#C08552] text-white px-6 py-3 rounded-xl font-medium"
        >
          + New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingPost ? "Edit Post" : "New Post"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                className="w-full border rounded-xl p-3"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#C08552] text-white px-8 py-3 rounded-xl font-medium"
          >
            {editingPost ? "Update Post" : "Publish Post"}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mt-3 line-clamp-2">{post.content}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}