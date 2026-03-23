import {
  Car,
  Shield,
  Cpu,
  Calendar,
  Users,
  DollarSign,
  Lock,
  Leaf,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";

// import RENTGO logo (fix path if needed)
import rentgoLogo from "../src/main/Banner_images/RENTGO.png";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-white">
      <main className="container mx-auto px-4 py-16 space-y-24">
        {/* Hero Section with Logo */}
        <header className="text-center max-w-5xl mx-auto space-y-8 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 opacity-20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-orange-300 opacity-20 rounded-full blur-3xl" />
          </div>

          {/* Logo Container with 3D Effect */}
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full blur-2xl opacity-40 scale-110" />
            <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-50 rounded-full shadow-2xl" />
              <div className="absolute inset-4 bg-white/70 backdrop-blur-sm rounded-full" />

              {/* Actual RENTGO Logo */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img
                  src={rentgoLogo}
                  alt="RENTGO logo"
                  className="w-full h-full object-contain drop-shadow-2xl rounded-3xl"
                />
              </div>

              {/* Floating particles */}
              <div className="absolute top-10 right-10 w-3 h-3 bg-amber-500 rounded-full" />
              <div className="absolute bottom-20 left-10 w-2 h-2 bg-orange-400 rounded-full" />
              <div className="absolute top-1/2 right-5 w-2 h-2 bg-yellow-400 rounded-full" />
            </div>
          </div>

          {/* Brand Name with Animation */}
          <div className="relative z-10 space-y-4">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-amber-900 to-orange-900 bg-clip-text text-transparent">
              RENTGO
            </h1>
            <p className="text-2xl font-semibold tracking-widest text-amber-700">
              RENT · RIDE · GO!
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              About RENTGO
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Welcome to RENTGO – your trusted hub for buying, renting, bidding,
              and servicing vehicles, designed to meet every automotive need
              under one platform.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Car className="w-6 h-6 text-amber-600" />
                <p className="text-3xl font-bold text-gray-900">10K+</p>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Vehicles Listed
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-6 h-6 text-orange-600" />
                <p className="text-3xl font-bold text-gray-900">50K+</p>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Happy Customers
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
                <p className="text-3xl font-bold text-gray-900">100%</p>
              </div>
              <p className="text-sm text-gray-600 font-medium">Satisfaction</p>
            </div>
          </div>
        </header>

        {/* Who We Are & Mission */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <section className="space-y-6 p-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-amber-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              At RENTGO, we bring innovation to the automotive world by offering
              a complete ecosystem — from purchasing and renting vehicles to
              participating in exciting auctions and booking professional
              servicing. With advanced technology, transparent processes, and
              customer-first values, we make automotive access smarter and
              simpler.
            </p>
          </section>

          <section className="space-y-6 p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our mission is to empower individuals and businesses with a
              seamless vehicle experience — whether you're buying your dream
              car, renting for your travels, bidding for deals, or ensuring your
              vehicle's top condition through our servicing network. RENTGO
              makes it easy, secure, and accessible for everyone.
            </p>
          </section>
        </div>

        {/* What We Offer */}
        <section className="space-y-12 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">What We Offer</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive automotive solutions designed for the modern driver
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-start space-x-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    Quality-Assured Vehicles
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every vehicle listed on RENTGO goes through strict quality
                    checks to ensure you only buy, rent, or bid on the best.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-white border-2 border-amber-100 hover:border-orange-500 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-start space-x-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <Cpu className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    Smart Bidding System
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Participate in real-time vehicle auctions, place smart bids,
                    and win deals at your price with complete transparency.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-white border-2 border-amber-100 hover:border-rose-500 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-start space-x-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-rose-500 transition-colors">
                    Flexible Rental Plans
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Choose from daily, weekly, or monthly rental options — ideal
                    for personal adventures or business needs, all with clear
                    pricing and policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-white border-2 border-amber-100 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-start space-x-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    Professional Servicing
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Book vehicle servicing with trusted professionals easily
                    through our platform, ensuring your ride stays in perfect
                    condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose RENTGO */}
        <section className="space-y-12 max-w-6xl mx-auto bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_white,_transparent)]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Why Choose RENTGO?
            </h2>
            <p className="text-center text-amber-100 text-lg max-w-2xl mx-auto mb-12">
              We're more than just a platform—we're your automotive partner
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-white">
                      Trusted Marketplace
                    </h3>
                    <p className="text-amber-100 leading-relaxed">
                      Verified listings, reliable sellers, and secure
                      transactions — we ensure peace of mind at every step.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-white">
                      Best Value Deals
                    </h3>
                    <p className="text-amber-100 leading-relaxed">
                      Whether buying, renting, or bidding, our platform brings
                      you unbeatable prices and transparent offers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-white">
                      Secure & Easy Process
                    </h3>
                    <p className="text-amber-100 leading-relaxed">
                      Easy booking, secure payments, and user-friendly
                      navigation designed for the modern automotive buyer and
                      renter.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-white">
                      Sustainable Mobility
                    </h3>
                    <p className="text-amber-100 leading-relaxed">
                      Encouraging the reuse and extended lifecycle of vehicles
                      to promote eco-friendly automotive practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center max-w-4xl mx-auto space-y-8 py-12">
          <div className="inline-block p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6">
            <Car className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Experience the Future of Automotive Access
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Join thousands who trust RENTGO to buy, rent, bid, and service
            vehicles with ease, security, and innovation. Your journey to
            smarter mobility starts here.
          </p>
          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/CarExplore")}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Vehicles
            </button>
            <button
              onClick={() => (window.location.href = "/Contact")}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AboutUs;
