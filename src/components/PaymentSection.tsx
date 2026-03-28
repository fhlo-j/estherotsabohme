import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Loader2,
  MapPin,
  Upload,
} from 'lucide-react'

const PICKUP_NOTICE =
  'See all approved pickup spots below and enter your preferred location.'

const MAX_RECEIPT_SIZE = 5 * 1024 * 1024

interface PaymentSectionProps {
  onSectionRef?: (ref: React.RefObject<HTMLDivElement | null>) => void
}

const toDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read file'))
    reader.readAsDataURL(file)
  })

export function PaymentSection({ onSectionRef }: PaymentSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [bookFormat, setBookFormat] = useState<'ebook' | 'hardcopy'>('ebook')
  const [deliveryMethod, setDeliveryMethod] = useState<
    'home-delivery' | 'pickup'
  >('home-delivery')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pickupLocation: '',
  })

  useEffect(() => {
    onSectionRef?.(sectionRef)
  }, [onSectionRef])

  const requiresAddress =
    bookFormat === 'hardcopy' && deliveryMethod === 'home-delivery'
  const requiresPickup =
    bookFormat === 'hardcopy' && deliveryMethod === 'pickup'

  const canProceedToPayment = useMemo(() => {
    if (bookFormat === 'ebook') {
      return formData.email.trim().length > 0
    }

    const hasBase =
      formData.fullName.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.phone.trim().length > 0

    if (!hasBase) return false
    if (requiresAddress) {
      return (
        formData.address.trim().length > 0 &&
        formData.city.trim().length > 0 &&
        formData.state.trim().length > 0 &&
        formData.country.trim().length > 0
      )
    }
    if (requiresPickup) {
      return formData.pickupLocation.trim().length > 0
    }

    return true
  }, [bookFormat, formData, requiresAddress, requiresPickup])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setMessage('')
  }

  const handleFile = (file: File | null) => {
    if (!file) return
    if (file.size > MAX_RECEIPT_SIZE) {
      setError('Receipt file must be 5MB or less.')
      return
    }
    setReceiptFile(file)
    setError('')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0] || null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!canProceedToPayment) {
      setError('Please complete the required details before submitting.')
      return
    }

    if (!receiptFile) {
      setError('Please upload your payment receipt before submitting.')
      return
    }

    try {
      setLoading(true)
      const dataUrl = await toDataUrl(receiptFile)

      const [firstName, ...restName] = (
        formData.fullName.trim() || 'Buyer'
      ).split(' ')
      const lastName = restName.join(' ') || 'N/A'

      const payload = {
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: bookFormat === 'hardcopy' ? formData.phone.trim() : 'N/A',
        address: requiresAddress ? formData.address.trim() : null,
        city: requiresAddress ? formData.city.trim() : null,
        state: requiresAddress ? formData.state.trim() : null,
        country: requiresAddress ? formData.country.trim() : null,
        bookFormat,
        quantity: 1,
        deliveryMethod: bookFormat === 'hardcopy' ? deliveryMethod : null,
        pickupLocation: requiresPickup ? formData.pickupLocation.trim() : null,
        paymentReceiptDataUrl: dataUrl,
        paymentReceiptFileName: receiptFile.name,
        paymentReceiptMimeType: receiptFile.type || 'application/octet-stream',
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit order right now.')
      }

      setMessage(
        'Order submitted successfully. Receipt has been sent to admin for verification.',
      )
      setReceiptFile(null)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      <div className="payment-content section-padding max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">Get Your Copy</p>
          <h2 className="heading-lg text-navy mb-4">Purchase & Delivery</h2>
          <p className="body-text text-gray-500 max-w-2xl mx-auto">
            Choose format, fill required details, make payment, then upload your
            receipt. Hardcopy delivery fee will be communicated based on your
            location.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="cloud-card-lg p-8 lg:p-12 space-y-8"
        >
          {error && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm flex items-start gap-2">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-4">
              Book Format *
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setBookFormat('ebook')
                  setDeliveryMethod('home-delivery')
                }}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  bookFormat === 'ebook'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-200 bg-white hover:border-sky-300'
                }`}
              >
                <p className="font-semibold text-navy mb-1">
                  Softcopy (E-Book)
                </p>
                <p className="text-sm text-gray-600">
                  Only your email is required for delivery.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBookFormat('hardcopy')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  bookFormat === 'hardcopy'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-200 bg-white hover:border-sky-300'
                }`}
              >
                <p className="font-semibold text-navy mb-1">Hardcopy</p>
                <p className="text-sm text-gray-600">
                  Delivery fee is shared after address review.
                </p>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {bookFormat === 'hardcopy' && (
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                required
              />
            </div>
          </div>

          {bookFormat === 'hardcopy' && (
            <>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                />
              </div>

              <div className="p-6 bg-sky-50 rounded-xl border border-sky-200">
                <h4 className="font-semibold text-navy mb-4">
                  Hardcopy Fulfillment *
                </h4>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryMethod === 'home-delivery'}
                      onChange={() => setDeliveryMethod('home-delivery')}
                      className="w-4 h-4 mt-1"
                    />
                    <span className="text-gray-700">
                      <span className="font-medium">Home Delivery</span>
                      <p className="text-xs text-gray-500 mt-1">
                        Delivery fee will be communicated after location review.
                      </p>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="w-4 h-4 mt-1"
                    />
                    <span className="text-gray-700">
                      <span className="font-medium">Pickup</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {PICKUP_NOTICE}
                      </p>
                    </span>
                  </label>
                </div>
              </div>

              {requiresAddress && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, street"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City or LGA"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {requiresPickup && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Preferred Pickup Spot *
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder="Type preferred pickup location from list below"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> All pickup spots are
                    listed below this section.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="border-t border-[#dccaa2] pt-8">
            <h3 className="heading-md text-navy mb-5">Payment Details</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                <p className="text-xs text-gray-500 mb-1">Account Name</p>
                <p className="font-mono font-medium text-navy">
                  Esther Mike Otsabomhe
                </p>
              </div>

              <div className="p-4 bg-[#f9f4e8] rounded-xl border border-[#e4d6b5]">
                <p className="text-xs text-gray-500 mb-1">Account Number</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-medium text-navy">1234567890</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('1234567890')}
                    className="ml-2 p-2 hover:bg-sky-200 rounded-lg transition-colors"
                    title="Copy account number"
                  >
                    <Copy className="w-4 h-4 text-sky-600" />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-2">Copied!</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-xl border-l-4 border-amber-500 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    Important
                  </h4>
                  <p className="text-sm text-amber-800">
                    Make transfer, then upload your receipt. For hardcopy home
                    delivery, final delivery fee will be communicated based on
                    location.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-3">
                Upload Payment Receipt *
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                {receiptFile ? (
                  <div>
                    <p className="font-medium text-navy mb-1">
                      {receiptFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setReceiptFile(null)}
                      className="text-xs text-sky-600 hover:text-sky-700 mt-2 underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 font-medium mb-1">
                      Drag and drop your receipt here
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      or click to select a file
                    </p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf"
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label
                      htmlFor="receipt-upload"
                      className="text-sm text-sky-600 hover:text-sky-700 underline cursor-pointer"
                    >
                      Browse files
                    </label>
                    <p className="text-xs text-gray-400 mt-3">
                      PNG, JPG, JPEG, PDF (Max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !canProceedToPayment}
            className="btn-primary w-full py-4 gap-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Order & Receipt'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
