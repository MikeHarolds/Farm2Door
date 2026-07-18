import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ========== NAVIGATION ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200/50 group-hover:shadow-primary-300/60 transition-all duration-300">
                <span className="text-white text-lg font-extrabold tracking-tight">F2M</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900 leading-none block">Farm2Market</span>
                <span className="text-[10px] text-primary-600 font-semibold uppercase tracking-widest hidden sm:block">Agricultural Logistics</span>
              </div>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">How It Works</a>
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#for-everyone" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">For Everyone</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Stories</a>
              <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">FAQ</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-200/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started Free
                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-[112px] pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-40 -left-20 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary-100/40 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Text */}
            <div className="lg:max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 border border-primary-200 rounded-full mb-8">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-primary-800">Trusted by 2,500+ farmers across West Africa</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-gray-900 leading-[1.08] mb-6">
                Your Harvest Deserves a{" "}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Smarter Way</span>{" "}
                to Market
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-9 max-w-lg">
                Farm2Market connects hardworking farmers like you with trusted delivery partners — 
                so your fresh produce reaches market on time, every time. No more spoilage, 
                no more stress about logistics.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-base rounded-2xl hover:shadow-xl hover:shadow-primary-300/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Start Moving Your Produce
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold text-base rounded-2xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                  </svg>
                  See How It Works
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="-space-x-2 flex">
                    {["FJ", "AO", "ME", "CE"].map((initials) => (
                      <div key={initials} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600"><strong>2,500+</strong> active farmers</span>
                </div>
                <div className="text-sm text-gray-500">
                  ⭐⭐⭐⭐⭐ <span className="text-gray-700 font-semibold ml-1">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main image with decorative frame */}
                <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary-200/30">
                  <Image
                    src="/images/hero-farm.jpg"
                    alt="Lush green farmland at sunrise - the heart of African agriculture"
                    width={650}
                    height={480}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                    <p className="text-white/90 text-sm font-medium">Green Valley Farm, Kano State</p>
                  </div>
                </div>

                {/* Floating card - Stats */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white rounded-2xl shadow-xl p-5 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">15,000+</p>
                      <p className="text-sm text-gray-500">Deliveries Completed</p>
                    </div>
                  </div>
                </div>

                {/* Floating card - Testimonial */}
                <div className="absolute -top-4 -right-4 z-20 bg-white rounded-2xl shadow-xl p-5 max-w-[260px] animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-start gap-3">
                    <Image
                      src="/images/farmer-smile.jpg"
                      alt="Happy farmer John Okonkwo"
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="text-sm text-gray-600 italic leading-snug">&quot;Before Farm2Market, I lost half my tomatoes to logistics delays. Now? I deliver everything fresh.&quot;</p>
                      <p className="text-xs font-semibold text-gray-900 mt-2">— John Okonkwo, Farmer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROBLEM / STORY SECTION ========== */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
            </pattern>
            <rect width="100%" height="100%" fill="#000">
              <animateTransform attributeName="transform" type="translate" values="0,0;30,0;30,30;0,30;0,0" dur="40s" repeatCount="indefinite"/>
            </rect>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4">The Challenge We Solve</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                You&apos;ve Spent Months Growing Your Produce.<br />
                <span className="text-gray-400">Why Let It Spoil on the Journey?</span>
              </h2>
              
              <div className="space-y-5 mt-8">
                {[
                  { icon: "😰", title: "The Logistics Nightmare", desc: "Finding reliable transport for farm produce is unreliable, expensive, and often leads to hours of produce sitting in the sun." },
                  { icon: "💸", title: "Middlemen Take Your Profit", desc: "Without direct control of delivery, middlemen between farm and market eat into margins that should belong to farmers." },
                  { icon: "📱", title: "No Modern Tools", desc: "While other industries go digital, most smallholder farmers still rely on word-of-mouth and handwritten notes to manage their supply chain." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-red-100 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/fresh-produce.jpg"
                  alt="Beautiful assortment of fresh farm produce - tomatoes, peppers, cassava and leafy greens"
                  width={550}
                  height={420}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Counter card */}
              <div className="absolute -bottom-8 right-4 z-10 bg-red-600 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-4xl font-bold">45%</p>
                <p className="text-red-100 text-sm mt-1">of farm produce in Africa is lost<br/>to post-harvest losses</p>
                <p className="text-red-200 text-xs mt-2">— FAO Report 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
              From Your Farm to Market in 4 Simple Steps
            </h2>
            <p className="text-lg text-gray-600">
              No complex processes. No paperwork headaches. Just sign up, add your harvest, book a driver, and track it all in real-time.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="relative">
            {/* Connection line (desktop) */}
            <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-200 via-blue-200 to-green-200 rounded-full"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {[
                {
                  step: "01",
                  icon: "📝",
                  color: "from-primary-500 to-primary-600",
                  bgColor: "bg-primary-50",
                  title: "Create Your Account",
                  desc: "Sign up as a farmer in under 2 minutes. Tell us about your farm location and what you grow.",
                  detail: "Free forever • No credit card required",
                },
                {
                  step: "02",
                  icon: "🌾",
                  color: "from-yellow-500 to-orange-500",
                  bgColor: "bg-orange-50",
                  title: "Log Your Harvest",
                  desc: "Record each harvest — what crop, how much, quality condition, and when it was picked.",
                  detail: "Track by date • Condition grading included",
                },
                {
                  step: "03",
                  icon: "🚚",
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "bg-blue-50",
                  title: "Book Delivery",
                  desc: "Pick your destination, choose pickup time, and we match you with verified drivers nearby.",
                  detail: "Competitive pricing • Price estimates upfront",
                },
                {
                  step: "04",
                  icon: "✅",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "bg-green-50",
                  title: "Track & Get Paid",
                  desc: "Follow your delivery in real-time from pickup to drop-off. Receive confirmation on delivery.",
                  detail: "Live GPS updates • Delivery photos",
                },
              ].map((item, index) => (
                <div key={item.step} className="relative group">
                  {/* Step number badge */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white text-xl font-bold shadow-lg mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                    {item.step}
                  </div>

                  <div className={`${item.bgColor} rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300`}>
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.desc}</p>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image showcase */}
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-lg relative group">
              <Image
                src="/images/delivery-truck.jpg"
                alt="Delivery truck transporting fresh farm produce along rural road"
                width={560}
                height={320}
                className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="font-semibold text-lg">Verified Drivers & Vehicles</p>
                  <p className="text-white/70 text-sm">Every driver is background-checked and vehicle-inspected</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 flex flex-col justify-center text-white">
              <blockquote className="text-lg italic leading-relaxed mb-4">
                &quot;I used to spend days looking for truck drivers who wouldn&apos;t overcharge or disappear with my goods. Now I book in minutes and sleep knowing my produce will arrive safe.&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">AM</div>
                <div>
                  <p className="font-semibold">Amara Nwachukwu</p>
                  <p className="text-primary-200 text-sm">Tomato Farmer • Anambra State</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
              Everything Built Around Real Farmers&apos; Needs
            </h2>
            <p className="text-lg text-gray-600">
              We spoke with hundreds of farmers across Nigeria and Ghana before building these tools. Every feature solves a real problem.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                color: "text-primary-600 bg-primary-50",
                title: "Harvest Tracking Dashboard",
                desc: "Record every harvest with quantity, quality grade (Fresh, Good, Fair), condition notes, and expected destination. Know exactly what you have at all times.",
                highlight: true,
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                ),
                color: "text-blue-600 bg-blue-50",
                title: "One-Click Logistics Booking",
                desc: "Pick up location, destination, quantity, preferred date. Get price estimates instantly. No phone calls needed — no one trying to upsell you.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: "text-cyan-600 bg-cyan-50",
                title: "Real-Time Order Tracking",
                desc: "See exactly where your order is: pending → accepted → en route → picked up → in transit → delivered. Never wonder again.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                color: "text-orange-600 bg-orange-50",
                title: "Your Own Farm Store",
                desc: "List produce for sale with pricing, availability status, organic certification, and descriptions. Future-ready marketplace integration.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                color: "text-indigo-600 bg-indigo-50",
                title: "For Delivery Partners",
                desc: "Manage your fleet, assign orders to drivers, view real-time capacity, and coordinate deliveries — all from one dashboard.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                color: "text-green-600 bg-green-50",
                title: "Secure & Trusted Platform",
                desc: "Bank-level security, role-based access control, encrypted data, and admin oversight. Your business data stays protected.",
              },
            ].map((feature) => (
              <div key={feature.title} className="group p-7 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-gradient-to-b hover:from-white hover:to-primary-50/30 hover:shadow-lg hover:shadow-primary-100/30 transition-all duration-300">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                
                {feature.highlight && (
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200 inline-block">
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOR EVERYONE SECTION ========== */}
      <section id="for-everyone" className="py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="farm-grid" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="none" stroke="white" strokeWidth="0.5"/>
              <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="0.25"/>
              <line x1="20" y1="0" x2="0" y2="20" stroke="white" strokeWidth="0.25"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#farm-grid)"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-primary-200 text-sm font-semibold rounded-full mb-4 border border-white/20">
              Something For Everyone
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
              Built for the Entire<br/>
              Agricultural Supply Chain
            </h2>
            <p className="text-lg text-primary-200/80">
              Whether you&apos;re a farmer, a delivery company, or a driver — there&apos;s a place for you here.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Farmers */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="text-5xl mb-5 group-hover:scale-110 inline-block transition-transform">🌾</div>
              <h3 className="text-xl font-bold mb-3">For Farmers</h3>
              <ul className="space-y-3 text-sm text-primary-100/90 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Log &amp; track all harvests digitally
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Book reliable delivery in minutes
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  List produce in your store front
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Track orders end-to-end
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center py-3 px-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
              >
                Join as Farmer →
              </Link>
            </div>

            {/* Delivery Partners */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="text-5xl mb-5 group-hover:scale-110 inline-block transition-transform">🏢</div>
              <h3 className="text-xl font-bold mb-3">For Partners</h3>
              <ul className="space-y-3 text-sm text-primary-100/90 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Manage entire fleet easily
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Accept &amp; assign orders
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Track driver locations
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Capacity management tools
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center py-3 px-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
              >
                Join as Partner →
              </Link>
            </div>

            {/* Drivers */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="text-5xl mb-5 group-hover:scale-110 inline-block transition-transform">🚛</div>
              <h3 className="text-xl font-bold mb-3">For Drivers</h3>
              <ul className="space-y-3 text-sm text-primary-100/90 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  View &amp; accept new jobs
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Update delivery status live
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Build your rating &amp; earnings
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Full pickup &amp; destination details
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center py-3 px-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-colors"
              >
                Join as Driver →
              </Link>
            </div>

            {/* Admins */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="text-5xl mb-5 group-hover:scale-110 inline-block transition-transform">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Platform Admins</h3>
              <ul className="space-y-3 text-sm text-primary-100/90 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Onboard &amp; verify users
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Activate / deactivate accounts
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  View all platform activity
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Complete audit logs
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center py-3 px-4 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-xl transition-colors"
              >
                Login as Admin →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS / STORIES ========== */}
      <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
              Real Farmers. Real Results.
            </h2>
            <p className="text-lg text-gray-600">
              Hear directly from people whose livelihoods have changed since they started using Farm2Market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I used to lose 30% of my tomato harvest because I couldn't find trucks fast enough. Now I have a dedicated network of drivers and spoilage is down to under 5%. That's money going back to my family.",
                name: "John Okonkwo",
                role: "Tomato Farmer · Kano State",
                location: "🇳🇬 Nigeria",
                avatar: "JO",
                metric: "↓ 83% less spoilage",
                image: "/images/farmer-harvest.jpg",
              },
              {
                quote: "Managing 15 drivers used to mean endless phone calls. With Farm2Market's dashboard, I see everyone's status in one screen. My dispatch efficiency has tripled this year.",
                name: "Emeka Adebayo",
                role: "Operations Manager, FastTrack Logistics",
                location: "🇳🇬 Lagos",
                avatar: "EA",
                metric: "↑ 3x dispatch efficiency",
                image: "/images/delivery-truck.jpg",
              },
              {
                quote: "As a driver, I love that I can accept jobs on my phone and update progress as I move. The transparency means no disputes about timing — everybody sees the same thing.",
                name: "Chidi Eze",
                role: "Truck Driver, FastTrack Logistics",
                location: "🇳🇬 Abuja-Kaduna Route",
                avatar: "CE",
                metric: "47 deliveries completed",
                image: null,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {testimonial.image && (
                  <div className="h-44 overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={`Photo of ${testimonial.name}`}
                      width={400}
                      height={176}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-7">
                  {/* Metric pill */}
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-4">
                    {testimonial.metric}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6 text-[15px] italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS / NUMBERS SECTION ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-[2rem] p-10 lg:p-16 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Farm2Market By The Numbers</h2>
                <p className="text-primary-200 text-lg">Growing steadily, serving communities that matter.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {[
                  { number: "2,500+", label: "Active Farmers", sub: "Across 22 states" },
                  { number: "200+", label: "Delivery Companies", sub: "Fully vetted partners" },
                  { number: "15,000+", label: "Deliveries Completed", sub: "With 94% success rate" },
                  { number: "$2.4M+", label: "Farmer Revenue Protected", sub: "From reduced losses" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-4xl lg:text-5xl font-extrabold mb-2 bg-white/10 rounded-2xl py-4">{stat.number}</p>
                    <p className="font-semibold text-lg">{stat.label}</p>
                    <p className="text-primary-300 text-sm mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section id="faq" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-secondary-100 text-secondary-700 text-sm font-semibold rounded-full mb-4">
              Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">Everything you need to know to get started.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Farm2Market really free for farmers?",
                a: "Yes! Creating an account, logging harvests, and booking delivery are all free for farmers. We make our money from transaction fees on logistics bookings — which still saves you money compared to finding transport yourself.",
              },
              {
                q: "What areas does Farm2Market cover?",
                a: "We currently operate across 22 states in Nigeria, including major agricultural hubs like Kano, Kaduna, Plateau, Benue, Oyo, Osun, Edo, Delta, Rivers, and more. We're expanding monthly.",
              },
              {
                q: "How do I know if my produce will arrive safely?",
                a: "All delivery partners and drivers go through a verification process. Orders are tracked in real-time from pickup to delivery, and you receive notifications at every stage. If something goes wrong, support responds within minutes.",
              },
              {
                q: "Can I use Farm2Market if I don't have a smartphone?",
                a: "Farm2Market works best on smartphones through our web portal (no app download needed!). However, if you can access any internet browser, even a basic phone browser, you can use the full platform. We recommend Chrome on Android or Safari on iPhone.",
              },
              {
                q: "What types of vehicles are available?",
                a: "Our partner network includes motor tricycles (for small loads), pickup trucks, vans, medium-sized trucks, and large lorries. When you book, you specify your cargo size and we match you with the right vehicle.",
              },
              {
                q: "Can a delivery company sign up multiple drivers?",
                a: "Absolutely. As a delivery partner, you can register your company and then onboard as many drivers as you want. Each driver gets their own login, accepts orders independently, and you can see all of them from your partner dashboard.",
              },
              {
                q: "Is my data secure?",
                a: "100%. Farm2Market uses bank-grade encryption, role-based access controls, and secure authentication. Your personal data, financial information, and business details are never shared with third parties without explicit consent.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-gray-900 list-none hover:bg-gray-50 transition-colors">
                  <span className="pr-4 text-left">{faq.q}</span>
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 shrink-0 group-open:bg-primary-600 group-open:text-white transition-colors">
                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA / JOIN BANNER ========== */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700"></div>
        
        {/* Decorative images */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 opacity-10">
            <Image src="/images/farmer-harvest.jpg" alt="" width={300} height={300} className="rounded-full object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10">
            <Image src="/images/fresh-produce.jpg" alt="" width={400} height={400} className="rounded-full object-cover" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform How You Move<br/>Your Harvest to Market?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of farmers who&apos;ve already made the switch. Free to start. Takes 2 minutes to set up.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold text-lg rounded-2xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Create Free Account
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-colors"
            >
              Learn More First
            </a>
          </div>

          <p className="text-primary-200 text-sm mt-8">
            📱 Works on any device • 🔒 Bank-grade security • ✋ No credit card required
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-extrabold">F2M</span>
                </div>
                <span className="text-xl font-bold text-white">Farm2Market</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-sm">
                Building Africa&apos;s most trusted agricultural logistics platform — connecting farmers with markets through technology and community.
              </p>
              <div className="flex gap-3">
                {["X (Twitter)", "Facebook", "LinkedIn"].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-sm transition-colors">
                    {social.charAt(0)}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><span className="opacity-50 cursor-not-allowed">Mobile App (Coming Soon)</span></li>
              </ul>
            </div>

            {/* For Users */}
            <div>
              <h4 className="font-semibold text-white mb-4">For Users</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Farmer Portal</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Delivery Partners</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Drivers</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Admin Console</Link></li>
                <li><a href="#for-everyone" className="hover:text-white transition-colors">Compare Plans</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              </ul>
            </div>
          </div>

          {/* Legal + Copyright */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Farm2Market Technologies Limited. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
