import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import "./App.css";
import "./banner.css";
import LogoScroller from "./LogoScroller";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Footers from "./Footers";
import FaqTestimonials from "./Faq_Testemonials";
import FeaturedListings from "./FeaturedListings";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1">
        <section className="banner relative overflow-hidden min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-32">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Drive Your Dream Car
              </h1>
              <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-200 leading-relaxed">
                Affordable Rides, Just a Click Away. Buy, Rent, or Auction Your
                Car with Ease.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
                <Link to="/CarExplore">
                  <button className="px-8 py-4 rounded-full bg-white text-black text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                    Browse Cars
                  </button>
                </Link>
                <Link to="../AboutUs">
                  <button className="px-8 py-4 rounded-full border-2 border-white text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-white hover:text-black">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0">
            <div className="background-images-wrapper">
              <div className="background-images">
                <div className="image-slide"></div>
                <div className="image-slide"></div>
                <div className="image-slide"></div>
              </div>
            </div>
          </div>
        </section>

        <LogoScroller />

        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white"
              id="services"
            >
              Our Services
            </h2>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Buy",
                  description:
                    "Find your perfect car from our wide selection of quality vehicles.",
                },
                {
                  title: "Rent",
                  description:
                    "Flexible rental options for any duration, from a day to months.",
                },
                {
                  title: "Auction",
                  description:
                    "Participate in live car auctions and get the best deals on your dream vehicle.",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FeaturedListings />

        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Why Choose Us
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                "Wide selection of quality vehicles",
                "Competitive pricing and financing options",
                "Transparent and hassle-free process",
                "Expert customer support",
                "Flexible rental terms",
                "Secure online transactions",
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-md"
                >
                  <ChevronRight className="text-black dark:text-white w-6 h-6 flex-shrink-0" />
                  <span className="text-gray-800 dark:text-gray-200 text-lg">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqTestimonials />
      </main>
      <Footers />
    </div>
  );
}
