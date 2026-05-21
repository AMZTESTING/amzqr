"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  X,
  Coffee,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

const CATEGORIES = [
  { value: "hot", label: "Hot Coffee" },
  { value: "iced", label: "Iced Coffee" },
  { value: "dessert", label: "Dessert" },
  { value: "croissant", label: "Croissant" },
  { value: "juice", label: "Fresh Juice" },
  { value: "tea", label: "Tea" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("hot");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [hasSizes, setHasSizes] = useState(false);
  const [smallPrice, setSmallPrice] = useState("");
  const [mediumPrice, setMediumPrice] = useState("");
  const [largePrice, setLargePrice] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName(""); setCategory("hot"); setPrice(""); setImage(""); setDescription("");
    setHasSizes(false); setSmallPrice(""); setMediumPrice(""); setLargePrice("");
    setEditingProduct(null); setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setName(product.name || "");
    setCategory(product.category || "hot");
    setImage(product.image || "");
    setDescription(product.description || "");
    setHasSizes(product.hasSizes || false);
    setPrice(product.price ? String(product.price) : "");
    if (product.sizes && product.sizes.length > 0) {
      const s = product.sizes.find((sz: any) => sz.label === "Small");
      const m = product.sizes.find((sz: any) => sz.label === "Medium");
      const l = product.sizes.find((sz: any) => sz.label === "Large");
      setSmallPrice(s ? String(s.price) : "");
      setMediumPrice(m ? String(m.price) : "");
      setLargePrice(l ? String(l.price) : "");
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let sizesArray: any[] = [];
    if (hasSizes) {
      if (smallPrice && parseFloat(smallPrice) > 0) sizesArray.push({ label: "Small", price: String(smallPrice) });
      if (mediumPrice && parseFloat(mediumPrice) > 0) sizesArray.push({ label: "Medium", price: String(mediumPrice) });
      if (largePrice && parseFloat(largePrice) > 0) sizesArray.push({ label: "Large", price: String(largePrice) });
    }

    const productData = {
      name: name.trim(),
      category,
      price: hasSizes ? "0" : price,
      image: image.trim() || "",
      description: description.trim() || "",
      hasSizes,
      sizes: sizesArray,
    };

    if (editingProduct) {
      await supabase.from("products").update(productData).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert([productData]);
    }
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
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
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#C08552] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-[#a07042] transition"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "New Product"}</h2>
            <button onClick={resetForm} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">Product Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="Spanish Latte" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Image URL</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <button type="button" onClick={() => setHasSizes(!hasSizes)} className={`w-12 h-7 rounded-full transition relative ${hasSizes ? "bg-[#C08552]" : "bg-gray-300"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition ${hasSizes ? "left-6" : "left-1"}`} />
                </button>
                <span className="text-sm font-medium">Has Sizes (S/M/L)</span>
              </div>
            </div>

            {hasSizes ? (
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-gray-500 font-medium">Small (OMR)</label><input type="text" value={smallPrice} onChange={(e) => setSmallPrice(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="1.200" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Medium (OMR)</label><input type="text" value={mediumPrice} onChange={(e) => setMediumPrice(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="1.800" /></div>
                <div><label className="text-xs text-gray-500 font-medium">Large (OMR)</label><input type="text" value={largePrice} onChange={(e) => setLargePrice(e.target.value)} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="2.500" /></div>
              </div>
            ) : (
              <div>
                <label className="text-xs text-gray-500 font-medium">Price (OMR) *</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="3.000" />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 font-medium">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border rounded-xl px-3 py-2.5 mt-1 text-sm" placeholder="Product description..." />
            </div>

            <button type="submit" className="w-full bg-[#C08552] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#a07042] transition">
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="aspect-[4/3] bg-gray-100 relative">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee size={40} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">{p.name}</h3>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{p.category}</p>
              <div className="mt-2">
                {p.hasSizes && p.sizes?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {p.sizes.map((s: any) => (
                      <span key={s.label} className="bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-medium">
                        {s.label}: {s.price} OMR
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[#C08552] font-bold text-lg">{p.price} OMR</span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-medium hover:bg-gray-200 transition">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 py-2 rounded-xl text-xs font-medium hover:bg-red-100 transition">
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