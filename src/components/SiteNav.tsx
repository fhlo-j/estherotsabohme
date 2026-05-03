import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'

type SiteNavHomeProps = {
  variant: 'home'
  onLogoClick: () => void
  onAboutBook: () => void
  onEvent: () => void
  onContact: () => void
}

type SiteNavBuyProps = {
  variant: 'buy'
}

export type SiteNavProps = SiteNavHomeProps | SiteNavBuyProps

const linkBase =
  'text-[#071b3d] hover:text-sky-600 transition-colors underline-offset-[5px] decoration-[#d4af37]/65 hover:underline'

export function SiteNav(props: SiteNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  const homeLinksDesktop = props.variant === 'home' && (
    <>
      <button
        type="button"
        onClick={() => props.onAboutBook()}
        className={`text-sm font-semibold tracking-wide ${linkBase}`}
      >
        About the Book
      </button>
      <button
        type="button"
        onClick={() => props.onEvent()}
        className={`text-sm font-semibold tracking-wide ${linkBase}`}
      >
        Event
      </button>
      <button
        type="button"
        onClick={() => props.onContact()}
        className={`text-sm font-semibold tracking-wide ${linkBase}`}
      >
        Contact
      </button>
    </>
  )

  const buyLinksDesktop = props.variant === 'buy' && (
    <>
      <Link
        to="/"
        className={`text-sm font-semibold tracking-wide ${linkBase}`}
      >
        Home
      </Link>
      <a
        href="#order-payment"
        className={`text-sm font-semibold tracking-wide ${linkBase}`}
      >
        Order & pay
      </a>
      <a
        href="#pickup-locations"
        className={`text-sm font-semibold tracking-wide ${linkBase}`}
      >
        Pickup shops
      </a>
    </>
  )

  const homeLinksMobile = props.variant === 'home' && (
    <>
      <button
        type="button"
        onClick={() => {
          props.onAboutBook()
          closeMobile()
        }}
        className={`text-base font-semibold ${linkBase} text-left py-1`}
      >
        About the Book
      </button>
      <button
        type="button"
        onClick={() => {
          props.onEvent()
          closeMobile()
        }}
        className={`text-base font-semibold ${linkBase} text-left py-1`}
      >
        Event
      </button>
      <button
        type="button"
        onClick={() => {
          props.onContact()
          closeMobile()
        }}
        className={`text-base font-semibold ${linkBase} text-left py-1`}
      >
        Contact
      </button>
    </>
  )

  const buyLinksMobile = props.variant === 'buy' && (
    <>
      <Link
        to="/"
        className={`text-base font-semibold ${linkBase} py-1`}
        onClick={closeMobile}
      >
        Home
      </Link>
      <a
        href="#order-payment"
        className={`text-base font-semibold ${linkBase} py-1`}
        onClick={closeMobile}
      >
        Order & pay
      </a>
      <a
        href="#pickup-locations"
        className={`text-base font-semibold ${linkBase} py-1`}
        onClick={closeMobile}
      >
        Pickup shops
      </a>
    </>
  )

  return (
    <header
      className={`${props.variant === 'buy' ? 'sticky' : 'static'} top-0 left-0 right-0 z-[100] text-[#071b3d] transition-[box-shadow,background-color] duration-300 ${
        scrolled
          ? 'bg-[#fcf9f2]/97 backdrop-blur-xl border-b border-[#cbb98f]/50 shadow-[0_10px_36px_rgba(7,27,61,0.1)]'
          : 'bg-[#fcf9f2]/92 backdrop-blur-md border-b border-[#dfc895]/38 shadow-[0_1px_0_rgba(7,37,71,0.05)]'
      }`}
    >
      <nav
        className="section-padding max-w-7xl mx-auto flex items-center justify-between gap-4 py-3.5 md:py-4"
        aria-label="Main"
      >
        {props.variant === 'home' ? (
          <button
            type="button"
            onClick={() => {
              props.onLogoClick()
              closeMobile()
            }}
            className="flex shrink-0 items-center gap-2 rounded-lg hover:opacity-85 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            <img
              src="/images/emo-foundation-logo.png"
              alt="E.M.O Foundation Logo"
              className="h-9 md:h-10 w-auto transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ) : (
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-lg hover:opacity-85 transition-opacity"
            onClick={closeMobile}
          >
            <img
              src="/images/emo-foundation-logo.png"
              alt="E.M.O Foundation Logo"
              className="h-9 md:h-10 w-auto"
            />
          </Link>
        )}

        <div className="hidden md:flex items-center gap-8">
          {homeLinksDesktop}
          {buyLinksDesktop}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/buy"
            className={[
              'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300',
              'bg-gradient-to-r from-[#071b3d] via-[#0d2f5e] to-[#123a73]',
              'ring-2 ring-[#d4af37]/35 hover:ring-[#efd358]/60 hover:brightness-[1.03] hover:-translate-y-0.5',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
            ].join(' ')}
            onClick={closeMobile}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            Buy now
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#cbb98f]/55 bg-white/80 text-[#071b3d] shadow-sm hover:bg-[#fffef8] hover:border-[#d4af37]/55 transition-colors"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      <div
        className="pointer-events-none h-[3px] w-full shrink-0 bg-gradient-to-r from-transparent via-[#d4af37]/85 to-transparent"
        aria-hidden
      />

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out border-t border-[#e8d9b8]/60 bg-[#fffdf9]/97 backdrop-blur-md ${
          mobileOpen ? 'max-h-[24rem]' : 'max-h-0 border-t-transparent'
        }`}
      >
        <div className="section-padding max-w-7xl mx-auto flex flex-col gap-4 py-5">
          {homeLinksMobile || buyLinksMobile}
        </div>
      </div>
    </header>
  )
}
