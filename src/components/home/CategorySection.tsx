import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Smartphone, Car, Home, Shirt, Dumbbell, Briefcase, Music, Utensils } from "lucide-react";
import "@/styles/featured-shops.css";
import { cn } from "@/lib/utils";
import categoryProducts from "@/assets/category-products.png";
import categoryServices from "@/assets/category-services.png";
import categoryEvents from "@/assets/category-events.png";
import categoryShops from "@/assets/category-shops.png";

const mainCategories = [
  {
    id: "products",
    title: "Products",
    description: "Shop electronics, fashion, home goods & more",
    logo: categoryProducts,
    href: "/products",
    gradient: "from-primary to-green-brand-dark",
    count: "1K+ items",
  },
  {
    id: "services",
    title: "Services",
    description: "Find skilled professionals near you",
    logo: categoryServices,
    href: "/services",
    gradient: "from-lavender to-purple-600",
    count: "500+ services",
  },
  {
    id: "events",
    title: "Events",
    description: "Discover parties, workshops & gatherings",
    logo: categoryEvents,
    href: "/events",
    gradient: "from-accent to-rose-600",
    count: "200+ events",
  },
  {
    id: "shops",
    title: "Shops",
    description: "Browse trusted sellers & branded stores",
    logo: categoryShops,
    href: "/shops",
    gradient: "from-orange-400 to-orange-600",
    count: "100+ shops",
  },
];

const subCategories = [
  { icon: Smartphone, label: "Electronics", href: "/products?category=electronics" },
  { icon: Car, label: "Vehicles", href: "/products?category=vehicles" },
  { icon: Home, label: "Property", href: "/products?category=property" },
  { icon: Shirt, label: "Fashion", href: "/products?category=fashion" },
  { icon: Dumbbell, label: "Sports", href: "/products?category=sports" },
  { icon: Briefcase, label: "Jobs", href: "/services?category=jobs" },
  { icon: Music, label: "Entertainment", href: "/events?category=entertainment" },
  { icon: Utensils, label: "Food & Dining", href: "/services?category=food" },
];

export function CategorySection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Explore Our Marketplace
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or discover — we've got you covered
          </p>
        </div>

        {/* Marquee ad banner */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 py-2.5 px-4">
          <div className="flex items-center gap-3">
            <span className="featured-shops-blink shrink-0 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Hot
            </span>
            <div className="overflow-hidden flex-1">
              <div className="featured-shops-marquee whitespace-nowrap text-sm font-medium text-foreground/80">
                {"🛒 Browse thousands of Products, Services & Events on SokoniArena! " +
                  "✅ Find electronics, fashion, vehicles & more at unbeatable prices " +
                  "✅ Hire verified professionals for any service you need " +
                  "✅ Discover exciting events & workshops near you " +
                  "✅ Create your FREE shop & start selling today " +
                  "🚀 Join Kenya's fastest-growing marketplace — Sign up now! " +
                  "🛒 Browse thousands of Products, Services & Events on SokoniArena! " +
                  "✅ Find electronics, fashion, vehicles & more at unbeatable prices " +
                  "✅ Hire verified professionals for any service you need " +
                  "✅ Discover exciting events & workshops near you " +
                  "✅ Create your FREE shop & start selling today " +
                  "🚀 Join Kenya's fastest-growing marketplace — Sign up now! "}
              </div>
            </div>
          </div>
        </div>

        {/* Compact main category tiles — logo + name only */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-10 max-w-2xl mx-auto">
          {mainCategories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group flex flex-col items-center gap-1.5 rounded-xl bg-card border border-border p-2 sm:p-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all"
              aria-label={`${category.title} — ${category.count}`}
            >
              <img
                src={category.logo}
                alt={`SokoniArena ${category.title}`}
                className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-sm group-hover:scale-110 transition-transform"
                loading="lazy"
              />
              <span className="font-semibold text-[11px] sm:text-sm text-foreground">
                {category.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Sub Categories */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {subCategories.map((sub) => {
            const Icon = sub.icon;
            return (
              <Link
                key={sub.label}
                to={sub.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="p-3 rounded-xl bg-background shadow-sm group-hover:shadow-md group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center">{sub.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
