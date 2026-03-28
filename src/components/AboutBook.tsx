import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AboutBookProps {
  onSectionRef?: (ref: React.RefObject<HTMLDivElement | null>) => void
}

export function AboutBook({ onSectionRef }: AboutBookProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onSectionRef?.(sectionRef)

    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current
      const target = sectionEl?.querySelector('.about-book-content')
      if (!sectionEl || !target) {
        return
      }

      gsap.fromTo(
        target,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 82%',
            once: true,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [onSectionRef])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      <div className="about-book-content section-padding max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="eyebrow mb-4">About the Book</p>
          <h2 className="heading-lg text-navy mb-6">God First</h2>
          <p className="heading-md text-[#705822] mb-2">
            Determination & Fulfilment
          </p>
        </div>

        {/* Book Content Structure */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Structured Content */}
          <div className="space-y-8">
            {/* Summary */}
            <div className="cloud-card p-8">
              <h3 className="heading-md text-navy mb-4">Summary</h3>
              <p className="body-text text-gray-600">
                God First is an inspiring journey about faith, determination,
                and discovering your true purpose. This book explores how
                placing God at the center of your life transforms every aspect
                of your existence and leads to genuine fulfillment.
              </p>
            </div>

            {/* Foundations */}
            <div className="cloud-card p-8">
              <h3 className="heading-md text-navy mb-4">Foundations</h3>
              <p className="body-text text-gray-600 mb-4">
                Understand the core principles that ground a faith-centered
                life. This section explores the spiritual foundations necessary
                for building a life of purpose, discipline, and unwavering
                commitment to God's principles.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Building spiritual strength through faith</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Establishing godly principles as your foundation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Developing moral clarity and conviction</span>
                </li>
              </ul>
            </div>

            {/* Growth & Challenges */}
            <div className="cloud-card p-8">
              <h3 className="heading-md text-navy mb-4">Growth & Challenges</h3>
              <p className="body-text text-gray-600 mb-4">
                Discover how embracing challenges as growth opportunities shapes
                your character. Learn from real-life experiences that
                demonstrate the transformative power of perseverance and faith
                through difficult seasons.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Navigating obstacles with faith</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Finding strength in adversity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Personal transformation through challenges</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Continued Content */}
          <div className="space-y-8">
            {/* Trust & Utilisation */}
            <div className="cloud-card p-8">
              <h3 className="heading-md text-navy mb-4">Trust & Utilisation</h3>
              <p className="body-text text-gray-600 mb-4">
                Explore the power of placing complete trust in God's plan and
                utilizing the gifts and resources He's given you. This section
                examines how surrendering control while stewarding your talents
                creates a powerful synergy for success.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Complete trust in divine guidance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Maximizing your God-given talents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Stewardship of responsibilities</span>
                </li>
              </ul>
            </div>

            {/* Fulfilment & Legacy */}
            <div className="cloud-card p-8">
              <h3 className="heading-md text-navy mb-4">Fulfilment & Legacy</h3>
              <p className="body-text text-gray-600 mb-4">
                Understand what true fulfillment looks like when it's rooted in
                purpose and faith. Learn how your choices today create a legacy
                of impact that extends far beyond your lifetime, inspiring
                generations to come.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Discovering lasting fulfillment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Creating positive generational impact</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-500 mt-1">•</span>
                  <span>Living a purposeful, meaningful life</span>
                </li>
              </ul>
            </div>

            {/* Key Quote */}
            <div className="cloud-card p-8 bg-gradient-to-r from-[#f9f1e0] to-white border-l-4 border-[#9a8759]">
              <p className="font-serif text-lg italic text-navy">
                "When we place God First, walk in faith and determination,
                fulfilment of purpose is inevitable."
              </p>
              <p className="text-sm text-gray-500 mt-4">— Esther Otsabomhe</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
