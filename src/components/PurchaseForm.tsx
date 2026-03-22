import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OrderData {
  _id: string
  email: string
  bookFormat: string
  quantity: number
  totalAmount: number
  deliveryMethod?: string
  pickupLocation?: string
  paymentStatus: string
  orderStatus: string
  createdAt: string
}

const PICKUP_LOCATIONS = [
  'Ave Maria - Kusenla',
  'Our Lady Star Of The Sea - Chevron',
  'Church of Transfiguration - VGC',
  'Regina Pacis - Lekki Epe Expressway',
  'Catholic Cathedral Church Of Christ - Marina',
  "St Paul's - 88 Murtala Mohammed Way",
  'St Timothy - Ojodu off Yakoyo Road',
  'Chapel of Christ The Light - Alausa',
]

export function PurchaseForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    bookFormat: 'ebook',
    quantity: 1,
    deliveryMethod: 'home-delivery',
    pickupLocation: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const bookPrices = {
    ebook: 5000,
    hardcopy: 8000,
  }

  const shippingCost =
    formData.bookFormat === 'hardcopy' &&
    formData.deliveryMethod === 'home-delivery'
      ? 2000
      : 0

  const totalPrice =
    (bookPrices[formData.bookFormat as keyof typeof bookPrices] +
      shippingCost) *
    formData.quantity

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? Number(value) : value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate form
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      ) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.bookFormat === 'hardcopy' && !formData.deliveryMethod) {
        setError('Please select a delivery method')
        setLoading(false)
        return
      }

      if (
        formData.bookFormat === 'hardcopy' &&
        formData.deliveryMethod === 'pickup' &&
        !formData.pickupLocation
      ) {
        setError('Please select a pickup location')
        setLoading(false)
        return
      }

      // Submit to API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            bookFormat: formData.bookFormat,
            quantity: Number(formData.quantity),
            deliveryMethod:
              formData.bookFormat === 'hardcopy'
                ? formData.deliveryMethod
                : null,
            pickupLocation:
              formData.bookFormat === 'hardcopy' &&
              formData.deliveryMethod === 'pickup'
                ? formData.pickupLocation
                : null,
          }),
        },
      )

      const data = await response.json()

      if (data.success) {
        setOrderData(data.order)
        setSuccessMessage('Order submitted! Redirecting to payment page...')
        // Redirect to buy page after 2 seconds
        setTimeout(() => {
          navigate('/buy', { state: { email: formData.email } })
        }, 2000)
      } else {
        setError(data.message || 'Error submitting order')
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (successMessage) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-green-500">
            <CardContent className="pt-12 text-center pb-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Order Created Successfully!
              </h2>

              <p className="text-slate-600 mb-8">{successMessage}</p>

              {orderData && (
                <div className="bg-slate-50 p-6 rounded-lg mb-8 text-left">
                  <div className="space-y-3 p-4 bg-white border border-slate-200 rounded">
                    <p className="font-medium text-slate-900">
                      Order ID:{' '}
                      <span className="font-mono text-green-600">
                        {orderData._id}
                      </span>
                    </p>
                    <p className="text-slate-700">
                      Email:{' '}
                      <span className="font-mono">{orderData.email}</span>
                    </p>
                    <p className="text-slate-700">
                      Format:{' '}
                      <span className="font-semibold">
                        {orderData.bookFormat === 'ebook'
                          ? 'E-Book'
                          : 'Hard Copy'}
                      </span>
                    </p>
                    <p className="text-slate-700">
                      Amount:{' '}
                      <span className="font-semibold text-lg">
                        ₦{orderData.totalAmount?.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm text-slate-500">
                Redirecting to payment page...
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Place Your Order
          </h2>
          <p className="text-lg text-slate-600">
            Fill out the form below to order your copy of God First
          </p>
        </div>

        <Card className="border-2 border-slate-200">
          <CardContent className="pt-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Book Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Select Your Copy
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="bookFormat"
                      value="ebook"
                      checked={formData.bookFormat === 'ebook'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.bookFormat === 'ebook'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <p className="font-semibold text-slate-900">E-Book</p>
                      <p className="text-sm text-slate-600">
                        ₦{bookPrices.ebook.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Instant digital delivery
                      </p>
                    </div>
                  </label>

                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="bookFormat"
                      value="hardcopy"
                      checked={formData.bookFormat === 'hardcopy'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.bookFormat === 'hardcopy'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <p className="font-semibold text-slate-900">Hard Copy</p>
                      <p className="text-sm text-slate-600">
                        ₦{bookPrices.hardcopy.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Physical book
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>
                <select
                  name="quantity"
                  value={String(formData.quantity)}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 10].map((qty) => (
                    <option
                      key={qty}
                      value={String(qty)}
                    >
                      {qty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hard Copy Delivery Options */}
              {formData.bookFormat === 'hardcopy' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Delivery Method
                  </h3>
                  <div className="space-y-3">
                    <label className="relative cursor-pointer flex items-center">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="home-delivery"
                        checked={formData.deliveryMethod === 'home-delivery'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <span className="text-slate-900">
                        Home Delivery ({' '}
                        <span className="font-semibold">
                          +₦{shippingCost.toLocaleString()}
                        </span>
                        )
                      </span>
                    </label>

                    <label className="relative cursor-pointer flex items-center">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={formData.deliveryMethod === 'pickup'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <span className="text-slate-900">
                        Pickup from Bookshop (No extra cost)
                      </span>
                    </label>
                  </div>

                  {formData.deliveryMethod === 'pickup' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Pickup Location *
                      </label>
                      <select
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">-- Select a location --</option>
                        {PICKUP_LOCATIONS.map((location) => (
                          <option
                            key={location}
                            value={location}
                          >
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Price Summary */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Book Price:</span>
                      <span className="font-medium">
                        ₦
                        {(
                          bookPrices[
                            formData.bookFormat as keyof typeof bookPrices
                          ] * formData.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Shipping:</span>
                        <span className="font-medium">
                          ₦{shippingCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="border-t-2 border-amber-200 pt-2 flex justify-between">
                      <span className="font-semibold text-slate-900">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-amber-600">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg"
              >
                {loading ? 'Processing...' : 'Submit Order'}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                By submitting this form, you agree to our terms and conditions
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
