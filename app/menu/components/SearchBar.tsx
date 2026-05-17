"use client";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <input
      className="w-full p-4 rounded-2xl bg-white shadow-md outline-none mt-4"
      placeholder="Search your coffee..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}