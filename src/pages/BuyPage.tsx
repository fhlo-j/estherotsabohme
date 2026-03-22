import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Mail as MailIcon,
  Search,
  CreditCard,
  FileText,
  Package,
  Sparkles,
  BookOpen,
  Phone,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

interface OrderData {
  _id?: string
  email?: string
  bookFormat?: string
  quantity?: number
  totalAmount?: number
  deliveryMethod?: string
  pickupLocation?: string
  paymentStatus?: string
  orderStatus?: string
  createdAt?: string
}

const STEPS = ['entry', 'payment', 'receipt', 'tracking'] as const
type Step = (typeof STEPS)[number]

const STEP_META: Record<Step, { label: string; icon: React.ElementType }> = {
  entry: { label: 'Find Order', icon: Search },
  payment: { label: 'Payment', icon: CreditCard },
  receipt: { label: 'Receipt', icon: FileText },
  tracking: { label: 'Tracking', icon: Package },
}

export function BuyPage() {
  const [step, setStep] = useState<Step>('entry')
  const [email, setEmail] = useState('')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Animate hero on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.buy-hero-content',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 },
      )
      gsap.fromTo(
        '.buy-step-bar',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.4 },
      )
      gsap.fromTo(
        '.buy-cloud-deco',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.15,
          delay: 0.2,
        },
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // Animate step content on step change
  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 32, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
    )
  }, [step])

  const goToStep = (next: Step) => {
    if (!contentRef.current) {
      setStep(next)
      return
    }
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -24,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => setStep(next),
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setUploadedFile(file)
      setError('')
    }
  }, [])

  const currentStepIndex = STEPS.indexOf(step)

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders/user/${email}`,
      )
      const data = await response.json()

      if (data.success && data.orders.length > 0) {
        // Get the most recent pending order
        const pendingOrder = data.orders.find(
          (o: OrderData) => o.paymentStatus === 'pending',
        )
        if (pendingOrder) {
          setOrderData(pendingOrder)
          setStep('payment')
        } else {
          setError('No pending orders found. Please create a new order first.')
        }
      } else {
        setError(
          'No orders found with this email. Please create a new order first.',
        )
      }
    } catch (err) {
      setError(
        `Error: ${err instanceof Error ? err.message : 'Failed to fetch order'}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setUploadedFile(file)
      setError('')
    }
  }

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedFile || !orderData) {
      setError('Please select a file to upload')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // In a real app, you'd upload the file to a server
      // For now, we'll simulate it
      const mockUrl = URL.createObjectURL(uploadedFile)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders/${orderData._id}/submit-receipt`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentSlipUrl: mockUrl }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setOrderData(data.order)
        setStep('tracking')
      } else {
        setError(data.message || 'Failed to submit receipt')
      }
    } catch (err) {
      setError(
        `Error: ${err instanceof Error ? err.message : 'Failed to submit receipt'}`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 overflow-x-hidden">
      {/* ─── Hero / Header ─────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/sky-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-sky-800/50 to-sky-50" />

        {/* Floating decorative clouds */}
        <div className="buy-cloud-deco absolute top-10 left-8 w-28 h-16 bg-white/30 rounded-full blur-md" />
        <div className="buy-cloud-deco absolute top-24 right-12 w-36 h-20 bg-white/20 rounded-full blur-lg" />
        <div className="buy-cloud-deco absolute bottom-8 left-1/3 w-20 h-12 bg-white/25 rounded-full blur-sm" />

        <div className="buy-hero-content relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Book thumbnail */}
            <div className="flex-shrink-0 w-24 h-32 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/30">
              <img
                src="/images/book-cover.jpg"
                alt="God First"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sky-200 text-xs font-medium tracking-widest uppercase mb-1">
                Official Book Launch
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-1">
                Complete Your <span className="text-amber-300">Purchase</span>
              </h1>
              <p className="text-sky-100 text-base">
                <span className="font-medium">God First</span> — Determination
                &amp; Fulfilment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Step Bar ──────────────────────────────────────────── */}
      <div className="buy-step-bar sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-sm border-b border-sky-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((s, idx) => {
              const meta = STEP_META[s]
              const Icon = meta.icon
              const done = idx < currentStepIndex
              const active = idx === currentStepIndex
              return (
                <div
                  key={s}
                  className="flex items-center flex-1"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm
                        ${done ? 'bg-green-500 text-white scale-95' : ''}
                        ${active ? 'bg-sky-500 text-white scale-110 shadow-glow ring-4 ring-sky-200' : ''}
                        ${!done && !active ? 'bg-slate-100 text-slate-400' : ''}
                      `}
                    >
                      {done ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block transition-colors ${active ? 'text-sky-600' : done ? 'text-green-600' : 'text-slate-400'}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div className="flex-1 mx-2 h-1 rounded-full overflow-hidden bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-green-400 transition-all duration-700"
                        style={{
                          width: idx < currentStepIndex ? '100%' : '0%',
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Step Content ──────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div ref={contentRef}>
          {/* ── Step 1: Email Entry ─────────────────────────────── */}
          {step === 'entry' && (
            <div className="max-w-lg mx-auto">
              <div className="cloud-card p-8 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-100 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="heading-md text-navy mb-1">Find Your Order</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Enter your email to retrieve your pending order and continue
                    to payment.
                  </p>

                  <form
                    onSubmit={handleSearchOrder}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border-2 border-sky-100 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-sky-50/50 transition-all duration-200 outline-none text-navy placeholder:text-gray-400"
                        required
                      />
                    </div>

                    {error && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary relative overflow-hidden"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Searching…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Search className="w-5 h-5" /> Find My Order
                        </span>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-sky-100 text-center">
                    <p className="text-sm text-gray-500">
                      Don't have an order yet?{' '}
                      <Link
                        to="/"
                        className="text-sky-600 hover:text-sky-700 font-semibold"
                      >
                        Create one on the home page
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature pills below */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {['E-Book', 'Hard Copy', 'Secure Payment', 'Fast Delivery'].map(
                  (t) => (
                    <span
                      key={t}
                      className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-sky-700 border border-sky-200 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 inline mr-1 text-amber-400" />
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Payment Instructions ──────────────────────── */}
          {step === 'payment' && orderData && (
            <div className="space-y-6">
              {/* Order summary card */}
              <div className="cloud-card-lg p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-56 h-56 bg-sky-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <p className="eyebrow mb-2">Your Order</p>
                  <h2 className="heading-md text-navy mb-6">Order Summary</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: 'Order ID',
                        value: orderData._id?.slice(-8) + '…',
                        mono: true,
                        copyVal: orderData._id,
                      },
                      {
                        label: 'Format',
                        value:
                          orderData.bookFormat === 'ebook'
                            ? '📱 E-Book'
                            : '📖 Hard Copy',
                      },
                      { label: 'Quantity', value: String(orderData.quantity) },
                      {
                        label: 'Total',
                        value: `₦${orderData.totalAmount?.toLocaleString()}`,
                        highlight: true,
                      },
                    ].map(({ label, value, mono, highlight, copyVal }) => (
                      <div
                        key={label}
                        className={`p-4 rounded-2xl ${highlight ? 'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200' : 'bg-sky-50 border border-sky-100'}`}
                      >
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p
                          className={`font-semibold flex items-center gap-2 ${mono ? 'font-mono text-sm' : ''} ${highlight ? 'text-2xl text-amber-600' : 'text-navy'}`}
                        >
                          {value}
                          {copyVal && (
                            <button
                              onClick={() => copyToClipboard(copyVal)}
                              className="text-gray-400 hover:text-sky-500 transition-colors"
                            >
                              {copied ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {orderData.bookFormat === 'hardcopy' && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs text-gray-500 mb-1">Delivery</p>
                      <p className="font-medium text-navy">
                        {orderData.deliveryMethod === 'home-delivery'
                          ? '🚚 Home Delivery'
                          : '📍 Pickup'}
                      </p>
                      {orderData.deliveryMethod === 'pickup' &&
                        orderData.pickupLocation && (
                          <p className="text-sm text-gray-600 mt-1">
                            {orderData.pickupLocation}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment instructions */}
              <div className="cloud-card p-6 sm:p-8 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-md">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-navy text-xl">
                        Payment Instructions
                      </h3>
                      <p className="text-xs text-amber-600 font-medium">
                        3 simple steps to complete your order
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      {
                        n: 1,
                        title: 'Transfer to Account',
                        body: (
                          <>
                            <p className="text-sm text-gray-600 mb-3">
                              Transfer{' '}
                              <span className="font-bold text-amber-600">
                                ₦{orderData.totalAmount?.toLocaleString()}
                              </span>{' '}
                              to:
                            </p>
                            <div className="bg-white border border-amber-200 rounded-xl p-4 font-mono text-sm space-y-1 shadow-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Account Name
                                </span>
                                <span className="font-semibold text-navy">
                                  God First Ministries
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Account No.
                                </span>
                                <span className="font-semibold text-navy">
                                  Contact support
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Bank</span>
                                <span className="font-semibold text-navy">
                                  Contact support
                                </span>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        n: 2,
                        title: 'Use your Order ID as reference',
                        body: (
                          <div className="flex items-center gap-3 mt-1 p-3 bg-sky-50 border border-sky-200 rounded-xl">
                            <span className="font-mono text-sky-700 font-semibold">
                              {orderData._id?.slice(-8)}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(orderData._id || '')
                              }
                              className="ml-auto text-gray-400 hover:text-sky-500 transition-colors"
                            >
                              {copied ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ),
                      },
                      {
                        n: 3,
                        title: 'Take a screenshot of the confirmation',
                        body: (
                          <p className="text-sm text-gray-600 mt-1">
                            You'll upload it in the next step.
                          </p>
                        ),
                      },
                    ].map(({ n, title, body }) => (
                      <div
                        key={n}
                        className="flex gap-4"
                      >
                        <div className="flex-shrink-0 w-9 h-9 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                          {n}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-navy mb-1">
                            {title}
                          </p>
                          {body}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="cloud-card p-5">
                <p className="text-sm font-semibold text-navy mb-3">
                  Need help?
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/2348061195076"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        WhatsApp
                      </p>
                      <p className="text-xs text-gray-500">Chat with us</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                  <a
                    href="mailto:admin@godfirstbook.com"
                    className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-200 rounded-xl hover:bg-sky-100 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <MailIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">Email</p>
                      <p className="text-xs text-gray-500">
                        admin@godfirstbook.com
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => goToStep('receipt')}
                className="btn-primary w-full gap-2"
              >
                I've Made the Transfer
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ── Step 3: Receipt Upload ─────────────────────────────── */}
          {step === 'receipt' && orderData && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="cloud-card p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-100 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                    <Upload className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="heading-md text-navy mb-1">
                    Upload Payment Receipt
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Make sure your screenshot shows the amount, date, and
                    transaction reference.
                  </p>

                  <form
                    onSubmit={handleSubmitReceipt}
                    className="space-y-6"
                  >
                    {/* Checklist */}
                    <div className="flex flex-col gap-2">
                      {[
                        'Amount transferred',
                        'Date and time',
                        'Bank name or transaction reference',
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 text-sm text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
                        ${dragOver ? 'border-sky-400 bg-sky-50 scale-[1.02]' : ''}
                        ${uploadedFile && !dragOver ? 'border-green-400 bg-green-50' : ''}
                        ${!uploadedFile && !dragOver ? 'border-slate-300 bg-slate-50 hover:border-sky-300 hover:bg-sky-50' : ''}
                      `}
                    >
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {uploadedFile ? (
                          <div className="space-y-2">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                            <p className="font-semibold text-green-700">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-green-600">
                              {(uploadedFile.size / 1024).toFixed(1)} KB — tap
                              to change
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div
                              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-sky-200' : 'bg-slate-200'}`}
                            >
                              <Upload
                                className={`w-8 h-8 ${dragOver ? 'text-sky-500' : 'text-slate-500'}`}
                              />
                            </div>
                            <p className="font-semibold text-navy">
                              {dragOver
                                ? 'Drop it here!'
                                : 'Drag & drop or click to browse'}
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, PDF · Max 5 MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>

                    {error && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => goToStep('payment')}
                        className="flex-1 px-6 py-3 rounded-full border-2 border-navy/20 text-navy font-medium hover:bg-navy hover:text-white transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || !uploadedFile}
                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Uploading…
                          </span>
                        ) : (
                          'Submit Receipt'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Tracking ───────────────────────────────────── */}
          {step === 'tracking' && orderData && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Success banner */}
              <div className="cloud-card p-8 text-center relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/40 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="heading-md text-green-900 mb-2">
                    Receipt Submitted!
                  </h2>
                  <p className="text-green-700 text-sm max-w-sm mx-auto">
                    Our team will verify your payment shortly. You'll be
                    notified at <strong>{orderData.email}</strong>.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="cloud-card p-6 sm:p-8">
                <h3 className="font-serif font-semibold text-navy text-xl mb-6">
                  Order Timeline
                </h3>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-green-400 via-amber-400 to-slate-200" />

                  <div className="space-y-6">
                    {[
                      {
                        icon: CheckCircle,
                        color: 'bg-green-500',
                        label: 'Order Created',
                        sub: orderData.createdAt
                          ? new Date(orderData.createdAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              },
                            )
                          : 'N/A',
                        done: true,
                      },
                      {
                        icon: CheckCircle,
                        color: 'bg-green-500',
                        label: 'Receipt Submitted',
                        sub: 'Just now',
                        done: true,
                      },
                      {
                        icon: Clock,
                        color: 'bg-amber-500',
                        label: 'Awaiting Verification',
                        sub: 'Admin confirms payment',
                        done: false,
                      },
                      {
                        icon: Package,
                        color: 'bg-slate-300',
                        done: false,
                        label:
                          orderData.bookFormat === 'ebook'
                            ? 'E-Book Delivery'
                            : orderData.deliveryMethod === 'home-delivery'
                              ? 'Shipping'
                              : 'Ready for Pickup',
                        sub: 'Coming next',
                      },
                    ].map(({ icon: Icon, color, label, sub, done }, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-5"
                      >
                        <div
                          className={`relative z-10 w-10 h-10 ${color} rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${done ? '' : 'opacity-60'}`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="pt-1.5">
                          <p
                            className={`font-semibold ${done ? 'text-navy' : 'text-gray-400'}`}
                          >
                            {label}
                          </p>
                          <p className="text-xs text-gray-400">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What happens next */}
                <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-sky-900">
                      <strong>What's next? </strong>
                      {orderData.bookFormat === 'ebook'
                        ? 'Once verified, your e-book will be sent to your email.'
                        : orderData.deliveryMethod === 'home-delivery'
                          ? 'Once verified, your book will be prepared for shipping.'
                          : "Once verified, you'll be notified when your book is ready for pickup."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order details */}
              <div className="cloud-card p-6">
                <h3 className="font-serif font-semibold text-navy text-lg mb-4">
                  Order Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {[
                    {
                      label: 'Order ID',
                      value: orderData._id?.slice(-12),
                      mono: true,
                    },
                    { label: 'Email', value: orderData.email },
                    {
                      label: 'Total Amount',
                      value: `₦${orderData.totalAmount?.toLocaleString()}`,
                      highlight: true,
                    },
                    {
                      label: 'Status',
                      value: 'Pending Verification',
                      badge: true,
                    },
                  ].map(({ label, value, mono, highlight, badge }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      {badge ? (
                        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                          {value}
                        </span>
                      ) : (
                        <p
                          className={`font-semibold ${mono ? 'font-mono text-xs' : ''} ${highlight ? 'text-amber-600 text-base' : 'text-navy'}`}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/"
                  className="flex-1"
                >
                  <button className="w-full px-6 py-3 rounded-full border-2 border-navy/20 text-navy font-medium hover:bg-navy hover:text-white transition-all duration-300">
                    Back to Home
                  </button>
                </Link>
                <button
                  onClick={() => {
                    goToStep('entry')
                    setEmail('')
                    setOrderData(null)
                    setUploadedFile(null)
                  }}
                  className="flex-1 btn-primary"
                >
                  Place Another Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
