import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  UserPlus, Store, ShoppingBag, MessageCircle, TrendingUp, Search,
  Heart, Star, Shield, Bell, Users, Camera, Globe, ArrowRight,
  CheckCircle2, Sparkles, LayoutDashboard, Settings, Eye, Megaphone,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your free account in seconds using your email or social login. Verify your email to unlock all features.",
    icon: UserPlus,
    color: "bg-primary",
  },
  {
    number: "02",
    title: "Create Your Shop",
    description: "Set up your shop with a name, logo, description, and category. Add your contact details and social links. You can own multiple shops!",
    icon: Store,
    color: "bg-green-600",
  },
  {
    number: "03",
    title: "List & Sell",
    description: "Add products, services, or events with images, pricing, and descriptions. Your listings go live instantly for buyers to discover.",
    icon: ShoppingBag,
    color: "bg-blue-600",
  },
  {
    number: "04",
    title: "Connect & Chat",
    description: "Buyers message you directly through our built-in chat. Negotiate, answer questions, and close deals — all in one place.",
    icon: MessageCircle,
    color: "bg-purple-600",
  },
  {
    number: "05",
    title: "Grow Your Business",
    description: "Build your reputation with reviews, followers, and verified badges. Promote your shop and listings for extra visibility.",
    icon: TrendingUp,
    color: "bg-orange-600",
  },
];

const features = [
  {
    title: "Products",
    desc: "Browse and sell electronics, fashion, vehicles, property, sports gear, home goods, and more across all 47 counties.",
    icon: ShoppingBag,
  },
  {
    title: "Services",
    desc: "Find or offer professional services — from plumbing and photography to tutoring, catering, and IT support.",
    icon: Sparkles,
  },
  {
    title: "Events",
    desc: "Discover local events, workshops, parties, and gatherings. Or create and promote your own events to reach thousands.",
    icon: Globe,
  },
  {
    title: "Shops",
    desc: "Every seller gets their own branded shop page with a unique URL, logo, cover image, and full product catalog.",
    icon: Store,
  },
  {
    title: "Search & Filter",
    desc: "Find exactly what you need with powerful search, category filters, price sorting, and location-based browsing.",
    icon: Search,
  },
  {
    title: "Favorites",
    desc: "Save listings you love to your favorites list. Come back anytime to check prices or make a purchase.",
    icon: Heart,
  },
  {
    title: "Reviews & Ratings",
    desc: "Leave reviews for shops you've bought from. Ratings help the community identify the most trusted sellers.",
    icon: Star,
  },
  {
    title: "Verified Sellers",
    desc: "Look for the verified badge — it means the seller has been reviewed and approved by the SokoniArena team.",
    icon: Shield,
  },
  {
    title: "Notifications",
    desc: "Get real-time alerts when someone messages you, follows your shop, or interacts with your listings.",
    icon: Bell,
  },
  {
    title: "Dashboard",
    desc: "Manage all your listings, shops, messages, and analytics from one powerful seller dashboard.",
    icon: LayoutDashboard,
  },
  {
    title: "Promotions",
    desc: "Request to feature your listings or promote your shop for premium placement on the homepage and search results.",
    icon: Megaphone,
  },
  {
    title: "Shop Customization",
    desc: "Customize your shop with logos, cover images, social media links (WhatsApp, Instagram, Facebook, TikTok, and more).",
    icon: Settings,
  },
];

const funCircleFeatures = [
  {
    title: "Share Stories",
    desc: "Post text, images, or videos that your friends and followers can see. Stories expire after 24 hours for fresh content.",
    icon: Camera,
  },
  {
    title: "Make Friends",
    desc: "Send and accept friend requests. Get smart friend suggestions based on your network and activity.",
    icon: Users,
  },
  {
    title: "React & Comment",
    desc: "Like, love, or comment on stories from your circle. Stay engaged with your community.",
    icon: Heart,
  },
  {
    title: "Direct Messages",
    desc: "Chat privately with friends in the Fun Circle. Share deals, recommendations, and stay connected.",
    icon: MessageCircle,
  },
  {
    title: "Privacy Controls",
    desc: "Choose who sees your stories — everyone, friends only, or keep them private. You're in full control.",
    icon: Eye,
  },
];

const advantages = [
  "100% free to list products, services, and events",
  "No commission fees on any transactions",
  "Built specifically for the Kenyan market",
  "Own multiple shops under one account",
  "Direct buyer-seller communication via chat",
  "Mobile-friendly — works perfectly on any device",
  "SEO-optimized shop pages for Google visibility",
  "Real-time notifications so you never miss a lead",
  "Verified seller badges for trust and credibility",
  "Featured listings and shop promotions available",
  "Social features with Fun Circle for community building",
  "24/7 platform availability with dedicated support",
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Everything You Need to Know
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            How SokoniArena Works
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
            Your complete guide to buying, selling, and growing on Kenya's premier online marketplace. 
            From creating your account to running a successful shop — we've got you covered.
          </p>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Get Started in 5 Easy Steps
          </h2>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-12">
            From sign-up to your first sale — it takes just minutes
          </p>
          <div className="space-y-8 max-w-4xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex gap-6 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} text-white flex items-center justify-center text-lg font-bold shadow-lg`}>
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-0.5 h-12 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-display text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Everything on SokoniArena
          </h2>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-12">
            A full breakdown of every feature and tool available to you
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-card rounded-2xl p-6 border hover:shadow-lg transition-shadow">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fun Circle Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Users className="h-4 w-4" />
              Social Features
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Fun Circle — Your Social Space
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              SokoniArena isn't just a marketplace — it's a community. Fun Circle lets you connect, share stories, and build relationships with fellow buyers and sellers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {funCircleFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-card rounded-2xl p-6 border hover:shadow-lg transition-shadow">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent w-fit mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Profile & Dashboard */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Your Profile & Dashboard
          </h2>
          <p className="text-muted-foreground text-center text-lg mb-10">
            Everything you need to manage your marketplace presence
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl p-8 border">
              <h3 className="font-display text-xl font-bold mb-4">Your Profile</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> Add your name, bio, avatar, and contact info</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> Set your location for local discovery</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> View your public profile as others see it</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> Link your profile to your shops and listings</li>
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-8 border">
              <h3 className="font-display text-xl font-bold mb-4">Seller Dashboard</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> Create and manage multiple shops</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> Add, edit, and remove listings anytime</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> View messages from interested buyers</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> Request featured placements and promotions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 md:py-20">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose SokoniArena?
          </h2>
          <p className="text-muted-foreground text-center text-lg mb-10">
            Built for Kenyans, by Kenyans — here's what makes us different
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advantages.map((adv) => (
              <div key={adv} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-16 text-center">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join Kenya's premier marketplace today. Create your shop, list your products, and start growing your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/register">
                    Create Free Account
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  asChild
                >
                  <Link to="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
