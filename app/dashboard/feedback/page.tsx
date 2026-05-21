"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    // For demo, use localStorage to store feedback
    const saved = localStorage.getItem("storeFeedback");
    const data = saved ? JSON.parse(saved) : [
      { id: 1, customer: "Ahmed", rating: 5, comment: "Best Spanish Latte in town! The service was fast and friendly.", date: "2026-05-20", orderType: "dinein" },
      { id: 2, customer: "Sara", rating: 4, comment: "Great coffee but the wait time was a bit long.", date: "2026-05-19", orderType: "car" },
      { id: 3, customer: "Mohammed", rating: 5, comment: "Love the new AI assistant! Helped me choose perfectly.", date: "2026-05-18", orderType: "dinein" },
    ];
    
    setFeedback(data);
    const avg = data.reduce((sum: number, f: any) => sum + f.rating, 0) / data.length;
    setAverageRating(Math.round(avg * 10) / 10);
    setLoading(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
      />
    ));
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
          <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
          <p className="text-gray-500 mt-1">Customer reviews and ratings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star size={20} className="text-amber-500 fill-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
            </div>
          </div>
          <div className="flex gap-1">{renderStars(Math.round(averageRating))}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <ThumbsUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Positive Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{feedback.filter((f: any) => f.rating >= 4).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{feedback.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Reviews</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {feedback.map((f: any) => (
            <div key={f.id} className="p-5 hover:bg-gray-50/50 transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C08552]/10 flex items-center justify-center">
                    <User size={16} className="text-[#C08552]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{f.customer}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> {f.date} • {f.orderType}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">{renderStars(f.rating)}</div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{f.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}