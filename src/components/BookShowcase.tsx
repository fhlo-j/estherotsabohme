import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BookShowcaseProps {
  onSectionRef?: (ref: React.RefObject<HTMLDivElement | null>) => void
}

export function BookShowcase({ onSectionRef }: BookShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onSectionRef?.(sectionRef)
  }, [onSectionRef])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      <div className="book-showcase-content section-padding max-w-7xl mx-auto">
        <div className="text-center mb-12 preview-fade-in">
          <p className="eyebrow mb-4">Book Covers</p>
          <h2 className="heading-lg text-navy mb-4">Visual Preview</h2>
          <p className="body-text text-gray-500 max-w-xl mx-auto">
            Get a glimpse of the stunning design of God First
          </p>
        </div>

        {/* Single Cover Preview */}
        <div className="max-w-7xl mx-auto preview-fade-in preview-fade-in-delay-1">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-5xl md:max-w-6xl mb-6">
              <div className="aspect-[3/2] rounded-2xl overflow-hidden shadow-cloud-lg ring-1 ring-[#cbb98f]/50 bg-[#f7f2e8]">
                <img
                  src="/images/Cover.png"
                  alt="God First book cover"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="sync"
                />
              </div>
            </div>
            <h3 className="heading-md text-navy">Official Cover</h3>
            <p className="text-sm text-gray-500 mt-2">
              Premium edition artwork
            </p>
          </div>
        </div>

        {/* Book Details */}
        <div className="mt-16 cloud-card-lg p-8 lg:p-12 preview-fade-in preview-fade-in-delay-2">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <p className="text-sm text-gold-300/80 mb-2">Format</p>
              <p className="heading-md text-white">E-Book & Hardcopy</p>
            </div>
            <div>
              <p className="text-sm text-gold-300/80 mb-2">Language</p>
              <p className="heading-md text-white">English</p>
            </div>
            <div>
              <p className="text-sm text-gold-300/80 mb-2">Edition</p>
              <p className="heading-md text-white">First Edition 2026</p>
            </div>
          </div>

          <div className="w-full h-px bg-white/20 mb-10" />

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <p className="text-[#c8d6ea] mb-2">
                Secure your copy of God First today. Available in both digital
                and physical formats.
              </p>
              <p className="text-sm text-sky-300/85 mt-2">
                Shipped worldwide | Instant digital delivery
              </p>
            </div>
            <Link
              to="/buy"
              className="btn-primary gap-2 inline-flex items-center flex-shrink-0"
            >
              Get Your Copy
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
