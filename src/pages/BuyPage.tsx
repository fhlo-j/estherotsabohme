import { useState } from 'react'
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Mail as MailIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

export function BuyPage() {
  const [step, setStep] = useState<
    'entry' | 'payment' | 'receipt' | 'tracking'
  >('entry')
  const [email, setEmail] = useState('')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/user/${email}`,
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
        `http://localhost:5000/api/orders/${orderData._id}/submit-receipt`,
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Complete Your Purchase
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {['Entry', 'Payment', 'Receipt', 'Tracking'].map(
              (_stepName, idx) => (
                <div
                  key={idx}
                  className="flex flex-1 items-center"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                      idx <
                      ['entry', 'payment', 'receipt', 'tracking'].indexOf(step)
                        ? 'bg-green-500 border-green-500 text-white'
                        : ['entry', 'payment', 'receipt', 'tracking'].indexOf(
                              step,
                            ) === idx
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-slate-200 border-slate-300 text-slate-600'
                    }`}
                  >
                    {idx <
                    ['entry', 'payment', 'receipt', 'tracking'].indexOf(
                      step,
                    ) ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        idx <
                        ['entry', 'payment', 'receipt', 'tracking'].indexOf(
                          step,
                        )
                          ? 'bg-green-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ),
            )}
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span>Entry</span>
            <span>Payment</span>
            <span>Receipt</span>
            <span>Tracking</span>
          </div>
        </div>

        {/* Step 1: Email Entry */}
        {step === 'entry' && (
          <Card>
            <CardHeader>
              <CardTitle>Find Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSearchOrder}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Enter Email Address
                  </label>
                  <p className="text-sm text-slate-600 mb-4">
                    We'll find your pending order so you can complete the
                    payment
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 text-sm">
                    <AlertCircle className="w-4 h-4 float-left mr-2" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                >
                  {loading ? 'Searching...' : 'Find My Order'}
                </Button>

                <p className="text-center text-sm text-slate-600">
                  Don't have an order yet?{' '}
                  <Link
                    to="/"
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    Create one now
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Payment Instructions */}
        {step === 'payment' && orderData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Order ID</p>
                    <p className="font-mono text-lg font-semibold cursor-pointer hover:text-amber-600 flex items-center gap-2">
                      {orderData._id?.slice(-8)}...
                      <Copy className="w-4 h-4" />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Format</p>
                    <p className="text-lg font-semibold">
                      {orderData.bookFormat === 'ebook'
                        ? '📱 E-Book'
                        : '📖 Hard Copy'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Quantity</p>
                    <p className="text-lg font-semibold">
                      {orderData.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Amount</p>
                    <p className="text-2xl font-bold text-amber-600">
                      ₦{orderData.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {orderData.bookFormat === 'hardcopy' && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-slate-600 mb-2">
                      Delivery Details
                    </p>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="font-medium">
                        {orderData.deliveryMethod === 'home-delivery'
                          ? '🚚 Home Delivery'
                          : '📍 Pickup'}
                      </p>
                      {orderData.deliveryMethod === 'pickup' && (
                        <p className="text-sm text-slate-600 mt-1">
                          {orderData.pickupLocation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900">
                  💳 Payment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Transfer to Account
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
                        Make a bank transfer of{' '}
                        <span className="font-bold">
                          ₦{orderData.totalAmount?.toLocaleString()}
                        </span>{' '}
                        to the designated account
                      </p>
                      <div className="mt-3 bg-white p-3 rounded border border-amber-300 font-mono text-sm">
                        <p>
                          Account Name: <strong>God First Ministries</strong>
                        </p>
                        <p>
                          Account Number: <strong>To be confirmed</strong>
                        </p>
                        <p>
                          Bank: <strong>To be confirmed</strong>
                        </p>
                        <p className="text-xs text-slate-600 mt-2">
                          Contact support for details
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Take Screenshot
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
                        Take a screenshot or save the payment confirmation
                        showing the transfer
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Upload Receipt
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
                        Click next to upload your payment receipt for
                        verification
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-300 rounded p-3">
                  <p className="text-sm text-blue-900">
                    ℹ️ <strong>Note:</strong> Reference your Order ID (
                    {orderData._id?.slice(-8)}) in your transfer for quick
                    processing
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Questions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://wa.me/2348061195076"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-300 rounded hover:bg-green-100 transition"
                >
                  <MailIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-900">
                      WhatsApp Support
                    </p>
                    <p className="text-sm text-slate-600">
                      Chat with us for help
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:admin@godfirstbook.com"
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition"
                >
                  <MailIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900">Email Support</p>
                    <p className="text-sm text-slate-600">
                      admin@godfirstbook.com
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Button
              onClick={() => setStep('receipt')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
            >
              I've Completed Payment → Upload Receipt
            </Button>
          </div>
        )}

        {/* Step 3: Receipt Upload */}
        {step === 'receipt' && orderData && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Payment Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmitReceipt}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Upload a screenshot or image of your payment confirmation.
                    Make sure it shows:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Amount transferred
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Date and time
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Bank name or transaction reference
                    </li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <div className="mb-4">
                    {uploadedFile ? (
                      <div>
                        <p className="font-medium text-green-600">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-slate-900">
                          Drag and drop your file here
                        </p>
                        <p className="text-sm text-slate-600">
                          or click to select
                        </p>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="text-amber-600 hover:text-amber-700 font-medium">
                      {uploadedFile ? 'Change file' : 'Click to browse'}
                    </span>
                  </label>
                  <p className="text-xs text-slate-500 mt-2">
                    PNG, JPG, PDF • Max 5MB
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800 text-sm">
                    <AlertCircle className="w-4 h-4 float-left mr-2" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep('payment')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !uploadedFile}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? 'Uploading...' : 'Submit Receipt'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Tracking */}
        {step === 'tracking' && orderData && (
          <div className="space-y-6">
            <Card className="border-2 border-green-500 bg-green-50">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Payment Received!
                </h2>
                <p className="text-green-700">
                  Your receipt has been submitted successfully. Our team will
                  verify and process it shortly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        Order Created
                      </p>
                      <p className="text-sm text-slate-600">
                        {orderData.createdAt
                          ? new Date(orderData.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        Receipt Submitted
                      </p>
                      <p className="text-sm text-slate-600">Just now</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        Awaiting Verification
                      </p>
                      <p className="text-sm text-slate-600">
                        Admin to confirm payment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Clock className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {orderData.bookFormat === 'ebook'
                          ? 'E-Book Delivery'
                          : orderData.deliveryMethod === 'home-delivery'
                            ? 'Shipping'
                            : 'Ready for Pickup'}
                      </p>
                      <p className="text-sm text-slate-600">Coming next</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-300 rounded p-4">
                  <p className="text-sm text-blue-900">
                    ℹ️ <strong>What happens next?</strong>
                    {orderData.bookFormat === 'ebook'
                      ? ' Once verified, your e-book will be sent to your email.'
                      : orderData.deliveryMethod === 'home-delivery'
                        ? ' Once verified, your book will be prepared for shipping.'
                        : " Once verified, your book will be prepared and you'll be notified to pick up."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Order ID</p>
                    <p className="font-mono font-semibold">
                      {orderData._id?.slice(-12)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-semibold">{orderData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Amount</p>
                    <p className="text-lg font-bold text-amber-600">
                      ₦{orderData.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Status</p>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                      Pending Verification
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Link
                to="/"
                className="flex-1"
              >
                <Button className="w-full bg-slate-600 hover:bg-slate-700">
                  Back to Home
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setStep('entry')
                  setEmail('')
                  setOrderData(null)
                  setUploadedFile(null)
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                Place Another Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
