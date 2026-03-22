import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BookOpen,
  Music,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  ChevronRight,
  Play,
  ExternalLink,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  DollarSign,
  Copy,
} from 'lucide-react'
import './App.css'
import { BookPickupLocations } from './components/BookPickupLocations'

gsap.registerPlugin(ScrollTrigger)

const AUTHOR_IMAGE_PRIMARY = '/images/AUTHOR IMAGE1.jpg'
const AUTHOR_IMAGE_SECONDARY = '/images/AUTHOR IMAGE 2.jpg'

function App() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [navScrolled, setNavScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const bookRevealRef = useRef<HTMLDivElement>(null)
  const eventRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const purchaseRef = useRef<HTMLDivElement>(null)
  const albumRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  // Countdown timer
  useEffect(() => {
    const eventDate = new Date('2026-04-25T16:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = eventDate - now

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo(
        '.hero-content',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.3 },
      )

      gsap.fromTo(
        '.hero-title span',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.5,
        },
      )

      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.9 },
      )

      gsap.fromTo(
        '.hero-buttons',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.1 },
      )

      // Floating clouds animation
      gsap.to('.floating-cloud-1', {
        y: -20,
        rotation: 3,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to('.floating-cloud-2', {
        y: -15,
        rotation: -2,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // Scroll-triggered animations for sections
      const sections = [
        { ref: bookRevealRef, selector: '.book-reveal-content' },
        { ref: eventRef, selector: '.event-content' },
        { ref: aboutRef, selector: '.about-content' },
        { ref: quoteRef, selector: '.quote-content' },
        { ref: purchaseRef, selector: '.purchase-content' },
        { ref: albumRef, selector: '.album-content' },
        { ref: contactRef, selector: '.contact-content' },
      ]

      sections.forEach(({ ref, selector }) => {
        if (ref.current) {
          gsap.fromTo(
            selector,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        }
      })
    })

    return () => ctx.revert()
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-sky-50">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* SVG Cloud Clip Path */}
      <svg
        width="0"
        height="0"
        className="absolute"
      >
        <defs>
          <clipPath
            id="cloud-clip"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M0.5,0.05 C0.75,0.05 0.9,0.15 0.95,0.3 C1,0.45 0.95,0.6 0.85,0.7 C0.9,0.8 0.85,0.92 0.7,0.95 C0.55,0.98 0.45,0.95 0.3,0.9 C0.15,0.95 0.05,0.85 0.02,0.7 C-0.01,0.55 0.05,0.4 0.15,0.3 C0.1,0.15 0.25,0.05 0.5,0.05 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="section-padding py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => scrollToSection(heroRef)}
              className="font-serif text-xl font-semibold text-navy hover:text-sky-500 transition-colors"
            >
              God First
            </button>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection(bookRevealRef)}
                className="text-sm font-medium text-navy/70 hover:text-sky-500 transition-colors"
              >
                Book
              </button>
              <button
                onClick={() => scrollToSection(eventRef)}
                className="text-sm font-medium text-navy/70 hover:text-sky-500 transition-colors"
              >
                Event
              </button>
              <button
                onClick={() => scrollToSection(albumRef)}
                className="text-sm font-medium text-navy/70 hover:text-sky-500 transition-colors"
              >
                Album
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-sm font-medium text-navy/70 hover:text-sky-500 transition-colors"
              >
                Contact
              </button>
            </div>

            <Link
              to="/buy"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-full hover:bg-sky-600 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Buy Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Sky */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/sky-bg.jpg)' }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 via-transparent to-sky-50/80" />

        {/* Floating Clouds */}
        <div className="floating-cloud-1 absolute top-20 left-10 w-32 h-20 bg-white/40 rounded-full blur-sm" />
        <div className="floating-cloud-2 absolute top-40 right-20 w-40 h-24 bg-white/30 rounded-full blur-sm" />
        <div
          className="floating-cloud-1 absolute bottom-40 left-1/4 w-24 h-16 bg-white/35 rounded-full blur-sm"
          style={{ animationDelay: '2s' }}
        />

        {/* Hero Content */}
        <div className="hero-content relative z-10 section-padding w-full max-w-6xl mx-auto pt-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-cloud-lg">
                  <img
                    src={AUTHOR_IMAGE_PRIMARY}
                    alt="Esther Otsabomhe portrait"
                    className="w-full h-full object-cover object-[center_12%]"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gold-400/20 rounded-full blur-2xl" />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="eyebrow mb-4">The Official Book Launch</p>

              <h1 className="hero-title heading-xl text-navy mb-4">
                <span className="inline-block">God</span>{' '}
                <span className="inline-block">First</span>
              </h1>

              <p className="heading-md text-sky-600 mb-2">
                Determination & Fulfilment
              </p>

              <p className="hero-subtitle text-lg text-gray-600 mb-2">
                by{' '}
                <span className="font-medium text-navy">Esther Otsabomhe</span>
              </p>

              <p className="body-text text-gray-500 mb-8 max-w-md mx-auto lg:mx-0">
                A book about determination, faith & fulfilment. Discover the
                path to purposeful living when we place God First.
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/buy"
                  className="btn-primary gap-2 inline-flex items-center"
                >
                  <BookOpen className="w-5 h-5" />
                  Buy the Book
                </Link>
                <a
                  href="https://push.fm/fl/qn89xxqt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline gap-2"
                >
                  <Music className="w-5 h-5" />
                  Listen to the Album
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-navy/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-navy/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-navy/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Book Reveal Section */}
      <section
        ref={bookRevealRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        <div className="book-reveal-content section-padding max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left: Book Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative flex justify-center">
                <div className="relative w-[280px] sm:w-[340px] lg:w-[400px]">
                  <img
                    src="/images/book-cover.jpg"
                    alt="God First Book Cover"
                    className="w-full h-auto drop-shadow-2xl"
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-sky-400/10 rounded-3xl blur-3xl -z-10 scale-110" />
                </div>
              </div>
            </div>

            {/* Right: Book Details */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="eyebrow mb-4">The Official Book Launch</p>

              <h2 className="heading-lg text-navy mb-2">God First</h2>
              <p className="heading-md text-sky-600 mb-4">
                Determination & Fulfilment
              </p>

              <p className="text-lg text-gray-600 mb-2">
                by{' '}
                <span className="font-medium text-navy">Esther Otsabomhe</span>
              </p>

              <div className="w-16 h-0.5 bg-sky-500 mx-auto lg:mx-0 my-6" />

              <p className="body-text text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0">
                This inspiring book takes you on a journey of faith,
                determination, and discovering your true purpose. Learn how
                placing God First transforms every aspect of your life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/buy"
                  className="btn-primary gap-2 inline-flex items-center"
                >
                  Get Your Copy
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Invitation Section */}
      <section
        ref={eventRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        <div className="event-content section-padding max-w-6xl mx-auto">
          <div className="cloud-card-lg p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Left: Image */}
              <div className="w-full lg:w-2/5">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <img
                    src={AUTHOR_IMAGE_SECONDARY}
                    alt="Esther Otsabomhe at the book launch"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right: Event Details */}
              <div className="w-full lg:w-3/5 flex flex-col justify-center">
                <p className="eyebrow mb-3">You're Invited</p>
                <h2 className="heading-lg text-navy mb-2">
                  to the official book launch of
                </h2>
                <h3 className="heading-md text-sky-600 mb-8">God First</h3>

                {/* Event Info Cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-navy">
                        Saturday 25th April 2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-navy">4:00 PM Prompt</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl sm:col-span-2">
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium text-navy">
                        Church of Assumption, Falomo, Ikoyi
                      </p>
                    </div>
                  </div>
                </div>

                {/* Countdown */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 mb-3">Event starts in:</p>
                  <div className="flex gap-3">
                    {[
                      { value: countdown.days, label: 'Days' },
                      { value: countdown.hours, label: 'Hours' },
                      { value: countdown.minutes, label: 'Mins' },
                      { value: countdown.seconds, label: 'Secs' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-navy rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {String(item.value).padStart(2, '0')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-primary w-full sm:w-auto gap-2">
                  <Mail className="w-5 h-5" />
                  RSVP Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Author Section */}
      <section
        ref={aboutRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        <div className="about-content section-padding max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left: Author Image */}
            <div className="w-full lg:w-2/5">
              <div className="relative">
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-cloud-lg">
                  <img
                    src={AUTHOR_IMAGE_PRIMARY}
                    alt="Esther Otsabomhe"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Decorative */}
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-sky-300 rounded-[2rem] -z-10" />
              </div>
            </div>

            {/* Right: Author Bio */}
            <div className="w-full lg:w-3/5">
              <p className="eyebrow mb-4">About the Author</p>
              <h2 className="heading-lg text-navy mb-6">Esther Otsabomhe</h2>

              <div className="space-y-4 body-text text-gray-600">
                <p>
                  Esther Otsabomhe is a woman of faith, a gospel music minister,
                  and a passionate advocate for purposeful living.
                </p>
                <p>
                  She is professionally trained in Law, Business, and Public
                  Relations, combining her legal and public relations background
                  with a deep commitment to service, leadership, and faith-based
                  inspiration.
                </p>
                <p>
                  She is the Co-Founder of the{' '}
                  <span className="font-medium text-navy">
                    Esther Mike Otsabomhe Foundation
                  </span>
                  , an initiative dedicated to supporting communities and
                  promoting positive social impact through compassion and
                  empowerment.
                </p>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-sky-50 to-white rounded-2xl border-l-4 border-sky-500">
                <p className="font-serif text-xl italic text-navy">
                  "When we place God First, walk in faith and determination,
                  fulfilment of purpose is inevitable."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Quote Section */}
      <section
        ref={quoteRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/sky-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-sky-50/80" />

        <div className="quote-content relative z-10 section-padding max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Image */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-cloud-lg">
                <img
                  src={AUTHOR_IMAGE_SECONDARY}
                  alt="Inspiration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Quote */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="text-6xl text-sky-300 font-serif mb-4">"</div>
              <blockquote className="heading-md text-navy mb-6">
                When we place God First, walk in faith and determination,
                fulfilment of purpose is inevitable.
              </blockquote>
              <cite className="text-lg text-gray-500 not-italic">
                —{' '}
                <span className="font-medium text-navy">Esther Otsabomhe</span>
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Section */}
      <section
        ref={purchaseRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        <div className="purchase-content section-padding max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Get Your Copy</p>
            <h2 className="heading-lg text-navy mb-4">Simple Payment Plan</h2>
            <p className="body-text text-gray-500 max-w-xl mx-auto">
              Follow these simple steps to get your copy of God First.
            </p>
          </div>

          {/* Payment Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Step 1 */}
            <div className="cloud-card p-8 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="heading-md text-navy mb-3 text-center">
                Pay to Account
              </h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                Transfer payment to our designated account
              </p>
              <div className="p-3 bg-sky-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Account Details</p>
                <p className="font-mono text-sm text-navy">
                  Contact us for details
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="cloud-card p-8 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="heading-md text-navy mb-3 text-center">
                Send Slip
              </h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                Send your payment slip to our email for confirmation
              </p>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-mono text-sm text-navy">
                  info@godfirstbook.com
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="cloud-card p-8 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Copy className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="heading-md text-navy mb-3 text-center">
                Choose Format
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Select E-Book or Hard Copy based on your preference
              </p>
            </div>
          </div>

          {/* Copy Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* E-Book Option */}
            <div className="cloud-card p-8 border-2 border-sky-200 hover:border-sky-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <Copy className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="heading-md text-navy">E-Book</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get instant digital access to God First
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sent directly to your email</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Read on any device</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Instant delivery after payment confirmation</span>
                </div>
              </div>
              <p className="text-sm text-sky-600 font-medium">
                No additional shipping cost
              </p>
            </div>

            {/* Hard Copy Option */}
            <div className="cloud-card p-8 border-2 border-green-200 hover:border-green-400 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="heading-md text-navy">Hard Copy</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get the physical book delivered to your door
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Buyer pays additional shipment cost</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Home delivery available</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>OR Pick up from Catholic bookshops</span>
                </div>
              </div>
              <p className="text-sm text-green-600 font-medium">
                Shipment cost calculated at checkout
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">📌 Note:</span> If you select Hard
              Copy, you have two options:{' '}
              <span className="font-medium">receive it by delivery</span> (with
              additional shipment cost) or{' '}
              <span className="font-medium">
                pick it up from one of our listed Catholic bookshops
              </span>{' '}
              (no delivery cost).
            </p>
          </div>
        </div>
      </section>

      {/* Book Pickup Locations Section */}
      <BookPickupLocations />

      {/* Album Section */}
      <section
        ref={albumRef}
        className="relative py-24 lg:py-32 overflow-hidden bg-navy"
      >
        {/* Subtle cloud texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(/images/sky-bg.jpg)',
            backgroundSize: 'cover',
          }}
        />

        <div className="album-content relative z-10 section-padding max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Album Cover */}
            <div className="w-full lg:w-2/5">
              <div className="relative max-w-[400px] mx-auto">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/album-cover.jpg"
                    alt="God First Album"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Play button overlay */}
                <a
                  href="https://push.fm/fl/qn89xxqt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-navy/40 opacity-0 hover:opacity-100 transition-opacity rounded-3xl"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play
                      className="w-8 h-8 text-navy ml-1"
                      fill="currentColor"
                    />
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Album Info */}
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              <p className="eyebrow text-gray-400 mb-4">Music</p>
              <h2 className="heading-lg text-white mb-4">
                Listen to the Album
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                A soundtrack of worship, hope, and purpose. Experience the
                divine melodies that complement the message of God First.
              </p>

              {/* Streaming Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Apple Music', icon: Music },
                  { name: 'Spotify', icon: Music },
                  { name: 'YouTube', icon: Play },
                  { name: 'Audiomack', icon: Music },
                ].map((platform, index) => (
                  <a
                    key={index}
                    href="https://push.fm/fl/qn89xxqt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <platform.icon className="w-6 h-6 text-white" />
                    <span className="text-sm text-white">{platform.name}</span>
                  </a>
                ))}
              </div>

              <a
                href="https://push.fm/fl/qn89xxqt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Play className="w-5 h-5" />
                Listen Now on Push.fm
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        <div className="contact-content section-padding max-w-5xl mx-auto">
          <div className="cloud-card-lg p-8 lg:p-12">
            <div className="text-center mb-10">
              <p className="eyebrow mb-4">Get in Touch</p>
              <h2 className="heading-lg text-navy mb-4">
                Connect With Our Team
              </h2>
              <p className="body-text text-gray-500 max-w-xl mx-auto">
                Have questions about the book, event, or partnership
                opportunities? We'd love to hear from you.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Contact Info */}
              <div className="w-full lg:w-2/5 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                  <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href="mailto:info@godfirstbook.com"
                      className="font-medium text-navy hover:text-sky-500 transition-colors"
                    >
                      info@godfirstbook.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <a
                      href="https://wa.me/234"
                      className="font-medium text-navy hover:text-green-500 transition-colors"
                    >
                      +234 XXX XXX XXXX
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href="tel:+234"
                      className="font-medium text-navy hover:text-sky-500 transition-colors"
                    >
                      +234 XXX XXX XXXX
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="w-full lg:w-3/5">
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter + Footer */}
      <footer
        ref={footerRef}
        className="relative py-16 lg:py-24 overflow-hidden bg-white"
      >
        <div className="section-padding max-w-6xl mx-auto">
          {/* Newsletter */}
          <div className="text-center mb-16">
            <h3 className="heading-md text-navy mb-4">Stay Inspired</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Subscribe to receive updates about the book, events, and
              inspirational content.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              />
              <button
                type="submit"
                className="btn-primary gap-2"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-100 mb-10" />

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <button
              onClick={() => scrollToSection(heroRef)}
              className="font-serif text-2xl font-semibold text-navy"
            >
              God First
            </button>

            {/* Navigation */}
            <nav className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => scrollToSection(heroRef)}
                className="text-sm text-gray-600 hover:text-sky-500 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection(bookRevealRef)}
                className="text-sm text-gray-600 hover:text-sky-500 transition-colors"
              >
                The Book
              </button>
              <button
                onClick={() => scrollToSection(albumRef)}
                className="text-sm text-gray-600 hover:text-sky-500 transition-colors"
              >
                The Album
              </button>
              <button
                onClick={() => scrollToSection(eventRef)}
                className="text-sm text-gray-600 hover:text-sky-500 transition-colors"
              >
                Event
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-sm text-gray-600 hover:text-sky-500 transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-10">
            <p className="text-sm text-gray-400">
              © 2026 God First. All rights reserved. |{' '}
              <a
                href="#"
                className="hover:text-sky-500 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
            <p className="text-xs text-gray-300 mt-2">
              Esther Mike Otsabomhe Foundation
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
