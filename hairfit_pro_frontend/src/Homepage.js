import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample data for routines and testimonials
const routines = [
  {
    id: 1,
    title: "Curly Hair Revival",
    desc: "Bounce back curls with a 3-step moisture routine.",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Shine Booster",
    desc: "Get glossy straight locks with natural oils.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Volume Express",
    desc: "Amp up body for thin hair types.",
    image: "https://images.unsplash.com/photo-1588776814546-b3f7d9a6652f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Protective Routine",
    desc: "Safeguard color & reduce heat damage.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    title: "Gentle Detox",
    desc: "Clarify scalp for all hair types.",
    image: "https://images.unsplash.com/photo-1519340333755-c5c2a3d51f51?auto=format&fit=crop&w=400&q=80",
  },
];

const testimonials = [
  {
    name: "Sophie Lee",
    text: "HairFit Pro completely changed my hair! I finally understand what works for my curls and my hair feels healthier than ever.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "Jasmine Brown",
    text: "The routine suggestions are spot-on. The micro-animations and clean look keep me coming back every week.",
    avatar: "https://randomuser.me/api/portraits/women/46.jpg"
  },
  {
    name: "Alex Kim",
    text: "I love the product recommendations and the community tips. It’s so easy to use!",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg"
  },
];

function useOnScreen(ref) {
  // Utility: detect if component is on screen for fade-in
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => { observer.disconnect(); };
  }, [ref]);

  return visible;
}

// PUBLIC_INTERFACE
function Homepage() {
  const navigate = useNavigate();

  // Testimonials: slider state
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonialRef = useRef(null);
  const testimonialIsVisible = useOnScreen(testimonialRef);

  // Carousel scroll (routines)
  const carouselRef = useRef(null);

  // Animation: auto-advance testimonials
  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonialIdx((idx) => (idx + 1) % testimonials.length);
    }, 5500);
    return () => clearTimeout(timer);
  }, [testimonialIdx]);

  const goNextTestimonial = () =>
    setTestimonialIdx(idx => (idx + 1) % testimonials.length);
  const goPrevTestimonial = () =>
    setTestimonialIdx(idx => (idx - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HERO SECTION */}
      <section
        className="w-full flex flex-col items-center justify-center text-center py-16 px-4"
        style={{ background: "linear-gradient(90deg, #F9FAFB 60%, #D0BCFF30 100%)" }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-6 transition-all duration-300">
          Your Hair. <span className="text-[#7F56D9]">Your Routine.</span> Perfected.
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto transition-all duration-300">
          Discover the ultimate personalized routines for every hair type—tried, tested, and tailored just for you.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="rounded-full px-8 py-3 bg-[#7F56D9] text-white font-semibold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F56D9]"
        >
          Find Your Hair Type
        </button>
      </section>

      {/* TRENDING ROUTINES CAROUSEL */}
      <section className="mt-6 py-8">
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#111827]">Trending Routines</h2>
        </div>
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-[#7F56D9]/40 scrollbar-track-gray-200 px-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {routines.map(routine => (
            <div
              key={routine.id}
              className="flex-shrink-0 w-[270px] sm:w-[320px] bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
              tabIndex={0}
              aria-label={routine.title}
            >
              <div className="overflow-hidden rounded-xl mb-3 aspect-[4/3] bg-[#F3F1FE]">
                <img
                  src={routine.image}
                  alt={routine.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1 text-[#7F56D9]">{routine.title}</h3>
              <p className="text-sm text-gray-600">{routine.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL SLIDER */}
      <section className="py-12 px-4 transition-all duration-700">
        <h2 className="text-2xl font-bold text-[#111827] text-center mb-8">
          What users are saying
        </h2>
        <div
          ref={testimonialRef}
          className={`mx-auto max-w-xl min-h-[220px] flex flex-col items-center transition-opacity duration-1000 ease-in-out ${
            testimonialIsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative w-full bg-white rounded-2xl p-8 shadow-md flex flex-col items-center">
            <img
              src={testimonials[testimonialIdx].avatar}
              alt={testimonials[testimonialIdx].name}
              className="w-16 h-16 rounded-full border-4 border-[#D0BCFF] shadow-lg mb-4"
              loading="lazy"
              style={{background: "#F5F3FF"}}
            />
            <p className="text-md text-gray-700 italic mb-3 transition-all duration-300">{`"${testimonials[testimonialIdx].text}"`}</p>
            <span className="font-semibold text-[#7F56D9]">{testimonials[testimonialIdx].name}</span>
            {/* Testimonial navigation dots */}
            <div className="flex items-center space-x-3 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ${i === testimonialIdx ? "bg-[#7F56D9]" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <button
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#F5F3FF] text-[#7F56D9] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-[#7F56D9] hover:text-white transition-all duration-300"
              style={{zIndex: 2}}
              onClick={goPrevTestimonial}
            >
              <span className="text-xl">&#8592;</span>
            </button>
            <button
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#F5F3FF] text-[#7F56D9] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-[#7F56D9] hover:text-white transition-all duration-300"
              style={{zIndex: 2}}
              onClick={goNextTestimonial}
            >
              <span className="text-xl">&#8594;</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
