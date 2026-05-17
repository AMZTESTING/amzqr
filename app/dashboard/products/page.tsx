"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { value: "hot", label: "☕ Hot Coffee" },
  { value: "iced", label: "🧊 Iced Coffee" },
  { value: "dessert", label: "🍰 Dessert" },
  { value: "croissant", label: "🥐 Croissant" },
  { value: "juice", label: "🧃 Fresh Juice" },
  { value: "tea", label: "🍵 Tea" },
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setCategory("hot");
    setPrice("");
    setImage("");
    setDescription("");
    setHasSizes(false);
    setSmallPrice("");
    setMediumPrice("");
    setLargePrice("");
    setEditingProduct(null);
    setShowForm(false);
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
      if (smallPrice && parseInt(smallPrice) > 0)
        sizesArray.push({ label: "Small", price: parseInt(smallPrice) });
      if (mediumPrice && parseInt(mediumPrice) > 0)
        sizesArray.push({ label: "Medium", price: parseInt(mediumPrice) });
      if (largePrice && parseInt(largePrice) > 0)
        sizesArray.push({ label: "Large", price: parseInt(largePrice) });
    }

    const productData = {
      name: name.trim(),
      category,
      price: hasSizes ? 0 : parseInt(price) || 0,
      image: image.trim() || "",
      description: description.trim() || "",
      hasSizes,
      sizes: sizesArray,
    };

    if (editingProduct) {

  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", editingProduct.id);

  console.log("UPDATE DATA:", data);
  console.log("UPDATE ERROR:", error);

} else {

  const { data, error } = await supabase
    .from("products")
    .insert([productData]);

  console.log("INSERT DATA:", data);
  console.log("INSERT ERROR:", error);

}

    alert("✅ Saved!");
    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
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
        <h1 className="text-3xl font-bold">☕ Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#C08552] text-white px-6 py-3 rounded-xl font-medium"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="space-y-4">
            
            <div>
              <label className="block font-medium mb-1">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded-xl p-3"
                placeholder="e.g. Spanish Latte"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Image URL (optional)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border rounded-xl p-3"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="hasSizes"
                checked={hasSizes}
                onChange={(e) => setHasSizes(e.target.checked)}
                className="w-5 h-5 accent-[#C08552]"
              />
              <label htmlFor="hasSizes" className="font-medium text-lg">
                This product has sizes (Small / Medium / Large)
              </label>
            </div>

            {hasSizes ? (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block font-medium mb-1">Small (AED)</label>
                  <input
                    type="number"
                    value={smallPrice}
                    onChange={(e) => setSmallPrice(e.target.value)}
                    placeholder="18"
                    className="w-full border rounded-xl p-3"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Medium (AED)</label>
                  <input
                    type="number"
                    value={mediumPrice}
                    onChange={(e) => setMediumPrice(e.target.value)}
                    placeholder="22"
                    className="w-full border rounded-xl p-3"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Large (AED)</label>
                  <input
                    type="number"
                    value={largePrice}
                    onChange={(e) => setLargePrice(e.target.value)}
                    placeholder="26"
                    className="w-full border rounded-xl p-3"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-medium mb-1">Price (AED) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full border rounded-xl p-3"
                  placeholder="e.g. 32"
                />
              </div>
            )}

            <div>
              <label className="block font-medium mb-1">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-xl p-3 min-h-[80px]"
                placeholder="Product description..."
              />
            </div>

          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-[#C08552] text-white py-3 rounded-xl font-bold text-lg"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-4xl mb-4">
                ☕
              </div>
            )}
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{p.category}</p>

            {p.hasSizes && p.sizes?.length > 0 ? (
              <div className="flex gap-1 mt-2 flex-wrap">
                {p.sizes.map((s: any) => (
                  <span key={s.label} className="bg-gray-100 px-2 py-1 rounded-lg text-xs">
                    {s.label}: {s.price} AED
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#C08552] font-bold mt-1">{p.price} AED</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(p)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}