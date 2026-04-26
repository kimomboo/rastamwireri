import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, Smartphone, Cpu, Shirt, Home, Sparkles,
  Monitor, Dumbbell, Car, ShoppingBasket, Baby, Grid3x3,
  Percent, Store, Headphones, ArrowRight,
  ShieldCheck, Truck, RotateCcw, Star, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useListings } from "@/hooks/useListings";
import { parseImages } from "@/lib/utils";

const sidebarCategories = [
  { icon: Smartphone, label: "Phones & Tablets", href: "/products?category=electronics" },
  { icon: Cpu, label: "Electronics", href: "/products?category=electronics" },
  { icon: Shirt, label: "Fashion", href: "/products?category=fashion" },
  { icon: Home, label: "Home & Living", href: "/products?category=home" },
  { icon: Sparkles, label: "Beauty & Health", href: "/products?category=beauty" },
  { icon: Monitor, label: "Computing", href: "/products?category=computing" },
  { icon: Dumbbell, label: "Sports & Outdoors", href: "/products?category=sports" },
  { icon: Car, label: "Automotive", href: "/products?category=vehicles" },
  { icon: ShoppingBasket, label: "Groceries", href: "/products?category=groceries" },
  { icon: Baby, label: "Baby & Kids", href: "/products?category=baby" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function HeroSection() {
  const navigate = useNavigate();
  // Pull a wide pool of random listings for the rotating banner
  const { listings, isLoading } = useListings({ limit: 60 });

  const banners = useMemo(() => {
    const withImages = listings
      .map((l: any) => ({
        id: l.id,
        title: l.title,
        price: l.price,
        original_price: l.original_price,
        location: l.location,
        listing_type: l.listing_type as "product" | "service" | "event",
        image: parseImages(l.images)?.[0],
      }))
      .filter((l) => !!l.image);
    return shuffle(withImages);
  }, [listings]);

  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => {
      setBannerIdx((i) => (i + 1) % banners.length);
    }, 3000);
    return () => clearInterval(t);
  }, [banners.length]);

  const current = banners[bannerIdx];
  const goPrev = () => setBannerIdx((i) => (i - 1 + banners.length) % banners.length);
  const goNext = () => setBannerIdx((i) => (i + 1) % banners.length);

  const categoryPath = current
    ? current.listing_type === "product" ? "products"
      : current.listing_type === "service" ? "services" : "events"
    : "products";

  return (
    <section className="bg-background border-b border-border/60">
      <div className="container py-4 md:py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* SIDEBAR — categories (hidden on mobile) */}
          <aside className="hidden lg:block col-span-3 xl:col-span-3">
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-semibold">
                <Grid3x3 className="h-4 w-4" />
                All Categories
              </div>
              <nav className="py-1">
                {sidebarCategories.map((c) => (
                  <Link
                    key={c.label}
                    to={c.href}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <c.icon className="h-4 w-4 text-primary" />
                      {c.label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
                <Link
                  to="/products"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary border-t border-border hover:bg-muted"
                >
                  <Grid3x3 className="h-4 w-4" />
                  View All Categories
                </Link>
              </nav>
            </div>
          </aside>

          {/* CENTER — hero banner with rotating product imagery */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-6">
            <div className="relative h-[280px] sm:h-[360px] md:h-[440px] rounded-2xl overflow-hidden shadow-md
                            bg-[radial-gradient(circle_at_85%_50%,_hsl(var(--primary)/0.55),_transparent_60%),linear-gradient(135deg,_hsl(var(--primary))_0%,_hsl(142_70%_32%)_100%)]">
              {/* Decorative soft swirl */}
              <div className="absolute inset-0 opacity-30 pointer-events-none
                              bg-[radial-gradient(ellipse_at_75%_55%,_rgba(255,255,255,0.25),_transparent_55%)]" />

              {/* TEXT — left side (static copy, per reference) */}
              <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-8 text-primary-foreground max-w-full">
                <div className="max-w-[55%] sm:max-w-[52%]">
                  <span className="inline-block bg-white/15 backdrop-blur-sm text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4">
                    Mega Deals
                  </span>
                  <h1 className="font-display text-xl sm:text-3xl md:text-4xl font-bold leading-tight">
                    Discover Amazing Deals in Your Community
                  </h1>
                  <p className="hidden sm:block mt-3 text-sm md:text-[15px] text-white/90 leading-relaxed">
                    Buy, sell, and connect with trusted sellers.
                    From products to services to events —
                    find it all on SokoniArena.
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-5">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm"
                      onClick={() =>
                        current ? navigate(`/${categoryPath}/${current.id}`) : navigate("/products")
                      }
                    >
                      Shop Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent text-white border-white/70 hover:bg-white/10 hover:text-white font-semibold"
                      asChild
                    >
                      <Link to="/shops">Explore Shops</Link>
                    </Button>
                  </div>
                </div>

                {/* Trust row — bottom-left */}
                <div className="hidden sm:flex items-center gap-5 text-white/90 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> 100% Secure
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-4 w-4" /> Fast Delivery
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <RotateCcw className="h-4 w-4" /> Easy Returns
                  </span>
                </div>
              </div>

              {/* RIGHT — rotating listing image (floats on the green) */}
              {current && (
                <Link
                  to={`/${categoryPath}/${current.id}`}
                  className="absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-[5]
                             w-[42%] sm:w-[44%] md:w-[46%] aspect-square
                             flex items-center justify-center group"
                  aria-label={current.title}
                >
                  <div className="relative w-full h-full">
                    {/* glow ring */}
                    <div className="absolute inset-0 rounded-full
                                    bg-[radial-gradient(circle,_rgba(255,255,255,0.25)_0%,_transparent_65%)]" />
                    <OptimizedImage
                      src={current.image!}
                      alt={current.title}
                      className="relative w-full h-full object-contain drop-shadow-2xl
                                 transition-transform duration-700 group-hover:scale-[1.03]"
                      width={800}
                      priority
                    />
                  </div>

                  {/* Top-right star badge */}
                  <span className="absolute top-2 right-2 sm:top-4 sm:right-4 h-9 w-9 sm:h-11 sm:w-11
                                   rounded-full bg-yellow-400 text-yellow-900 inline-flex items-center justify-center
                                   shadow-lg ring-4 ring-yellow-300/40">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  </span>

                  {/* Bottom-right percent badge */}
                  <span className="absolute -bottom-1 -right-1 sm:bottom-2 sm:right-2
                                   h-12 w-12 sm:h-14 sm:w-14 inline-flex items-center justify-center
                                   text-white font-bold text-xs sm:text-sm
                                   bg-[hsl(142_70%_32%)] shadow-xl
                                   [clip-path:polygon(50%_0%,_61%_12%,_78%_5%,_82%_22%,_98%_28%,_90%_43%,_100%_58%,_85%_67%,_88%_85%,_70%_85%,_61%_100%,_50%_88%,_39%_100%,_30%_85%,_12%_85%,_15%_67%,_0%_58%,_10%_43%,_2%_28%,_18%_22%,_22%_5%,_39%_12%)]">
                    <Percent className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                </Link>
              )}

              {/* Carousel arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 hover:bg-white text-primary shadow-md inline-flex items-center justify-center"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 hover:bg-white text-primary shadow-md inline-flex items-center justify-center"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Dots — centered bottom */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                    {banners.slice(0, Math.min(5, banners.length)).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === bannerIdx % Math.min(5, banners.length)
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — info cards */}
          <aside className="col-span-12 lg:col-span-3 xl:col-span-3 grid grid-cols-3 lg:grid-cols-1 gap-3">
            <Link
              to="/products?sort=deals"
              className="rounded-2xl border border-border bg-card p-3 lg:p-4 flex items-center justify-between gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-sm lg:text-base">Daily Deals</h3>
                <p className="hidden lg:block text-xs text-muted-foreground mt-0.5">New deals every day</p>
                <span className="text-primary text-xs font-medium inline-flex items-center gap-1 mt-1 lg:mt-2">
                  View All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                <Percent className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="rounded-2xl border border-border bg-card p-3 lg:p-4 flex items-center justify-between gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-sm lg:text-base">Become a Seller</h3>
                <p className="hidden lg:block text-xs text-muted-foreground mt-0.5">Grow your business with SokoniArena</p>
                <span className="text-primary text-xs font-medium inline-flex items-center gap-1 mt-1 lg:mt-2">
                  Start Selling <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                <Store className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
            </Link>

            <Link
              to="/help"
              className="rounded-2xl border border-border bg-card p-3 lg:p-4 flex items-center justify-between gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-sm lg:text-base">Need Help?</h3>
                <p className="hidden lg:block text-xs text-muted-foreground mt-0.5">We're here to help you</p>
                <span className="text-primary text-xs font-medium inline-flex items-center gap-1 mt-1 lg:mt-2">
                  Contact Support <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                <Headphones className="h-5 w-5 lg:h-6 lg:w-6" />
              </div>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
