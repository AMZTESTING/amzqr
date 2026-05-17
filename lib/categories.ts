export interface Category {
  name: string;
  label: string;
  image: string;
}

export const categories: Category[] = [
  {
    name: "all",
    label: "All",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  },
  {
    name: "hot",
    label: "Hot Coffee",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
  },
  {
    name: "iced",
    label: "Iced Coffee",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
  },
  {
    name: "dessert",
    label: "Dessert",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f",
  },
  {
    name: "croissant",
    label: "Croissant",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
  },
  {
    name: "juice",
    label: "Fresh Juice",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423",
  },
  {
    name: "tea",
    label: "Tea",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
  },
];

export const categoryOptions = categories.filter((cat) => cat.name !== "all");