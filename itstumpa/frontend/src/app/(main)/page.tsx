import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0F1419] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* mesh gradient background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-108 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl " />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#06B6D4]/20 rounded-full blur-3xl  " />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#334155] bg-[#1E2530]/50 text-sm text-[#94A3B8] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Real-time messaging platform
          </div>

          {/* headline */}
          <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Connect Instantly,{" "}
            <span className="bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
              Chat Seamlessly
            </span>
          </h1>

          <p className="text-[#94A3B8] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience lightning-fast real-time conversations with file sharing,
            read receipts, and typing indicators — all in one beautiful platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full xs:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] hover:opacity-90 transition-opacity shadow-lg shadow-[#06B6D4]/20 text-sm sm:text-base"
            >
              Start for Free →
            </Link>
            <Link
              href="/login"
              className="w-full xs:w-auto px-8 py-3.5 rounded-xl font-semibold text-[#F1F5F9] border border-[#334155] bg-[#1E2530]/50 hover:border-[#06B6D4]/50 hover:bg-[#1E2530] transition-all text-sm sm:text-base"
            >
              Sign In
            </Link>
          </div>

          {/* mock chat preview */}
          <div className="mt-16 max-w-md mx-auto bg-[#1E2530] rounded-2xl border border-[#334155] p-4 shadow-2xl shadow-black/40 text-left">
            {/* chat header */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#334155]">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#06B6D4]" />
              <div>
                <p className="text-sm font-medium text-[#F1F5F9]">Sarah</p>
                <p className="text-xs text-[#10B981]">● Online</p>
              </div>
            </div>
            {/* messages */}
            <div className="py-3 flex flex-col gap-2">
              <div className="flex justify-start">
                <span className="bg-[#1E293B] text-[#F1F5F9] text-xs sm:text-sm px-3 py-2 rounded-2xl rounded-tl-sm max-w-[75%]">
                  Hey! Did you check the new design? 👀
                </span>
              </div>
              <div className="flex justify-end">
                <span className="bg-[#0E7490] text-white text-xs sm:text-sm px-3 py-2 rounded-2xl rounded-tr-sm max-w-[75%]">
                  Yes! It looks amazing 🔥
                </span>
              </div>
              <div className="flex justify-start">
                <span className="bg-[#1E293B] text-[#F1F5F9] text-xs sm:text-sm px-3 py-2 rounded-2xl rounded-tl-sm max-w-[75%]">
                  Glad you liked it! Shipping today ✅
                </span>
              </div>
            </div>
            {/* typing indicator */}
            <div className="flex items-center gap-1 pt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce delay-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
              Everything you need to{" "}
              <span className="bg-linear-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
                stay connected
              </span>
            </h2>
            <p className="text-[#94A3B8] text-base sm:text-lg max-w-xl mx-auto">
              Built for speed, designed for humans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative group bg-[#1E2530] border border-[#334155] rounded-2xl p-6 hover:border-[#06B6D4]/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-[#F1F5F9] font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-[#334155] py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#8B5CF6] via-[#06B6D4] to-[#10B981] flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-bold bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
              LiveChat
            </span>
          </div>
          <p className="text-[#94A3B8] text-sm">
            © {new Date().getFullYear()} LiveChat. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["About", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "⚡",
    title: "Real-time Messaging",
    description:
      "Instant message delivery powered by Socket.IO. No refresh needed — messages appear the moment they're sent.",
  },
  {
    icon: "📎",
    title: "File Sharing",
    description:
      "Share images and documents effortlessly. Files are stored securely via Cloudinary with instant preview.",
  },
  {
    icon: "✅",
    title: "Read Receipts",
    description:
      "Know exactly when your message is delivered and read. Typing indicators show when someone is responding.",
  },
  {
    icon: "🔒",
    title: "Secure Auth",
    description:
      "JWT-based authentication with httpOnly cookies. Email verification and password reset built in.",
  },
  {
    icon: "🟢",
    title: "Online Status",
    description:
      "See who's online in real-time. Offline users show their last seen timestamp automatically.",
  },
  {
    icon: "👑",
    title: "Admin Controls",
    description:
      "Full admin dashboard to manage users, monitor conversations, and keep the platform healthy.",
  },
];