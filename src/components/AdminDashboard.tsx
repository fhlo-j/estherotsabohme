import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const STATUS_COLORS = {
  'pending-payment': 'bg-yellow-100 text-yellow-800',
  'payment-confirmed': 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  'pickup-ready': 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

const PAYMENT_STATUS_COLORS = {
  pending: 'bg-orange-100 text-orange-800',
  confirmed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

type OrderStatus = keyof typeof STATUS_COLORS
type PaymentStatus = keyof typeof PAYMENT_STATUS_COLORS

interface Order {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  bookFormat: 'ebook' | 'hardcopy'
  quantity: number
  deliveryMethod?: 'home-delivery' | 'pickup'
  pickupLocation?: string
  totalAmount: number
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  createdAt: string
}

interface Stats {
  totalOrders: number
  pendingPayment: number
  confirmedPayment: number
  ebookOrders: number
  hardcopyOrders: number
  totalRevenue: number
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders`,
      )
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders/stats/dashboard`,
      )
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const confirmPayment = async (orderId: string) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders/${orderId}/confirm-payment`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentReference: 'Manual confirmation' }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setOrders(orders.map((o) => (o._id === orderId ? data.order : o)))
        setSelectedOrder(data.order)
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? ''}/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setOrders(orders.map((o) => (o._id === orderId ? data.order : o)))
        setSelectedOrder(data.order)
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredOrders =
    filter === 'all'
      ? orders
      : filter === 'pending'
        ? orders.filter((o) => o.paymentStatus === 'pending')
        : filter === 'confirmed'
          ? orders.filter((o) => o.paymentStatus === 'confirmed')
          : filter === 'ebook'
            ? orders.filter((o) => o.bookFormat === 'ebook')
            : orders.filter((o) => o.bookFormat === 'hardcopy')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Manage book orders and customer requests
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalOrders}
                </p>
                <p className="text-sm text-slate-600">Total Orders</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pendingPayment}
                </p>
                <p className="text-sm text-slate-600">Pending Payment</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-green-600">
                  {stats.confirmedPayment}
                </p>
                <p className="text-sm text-slate-600">Confirmed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-slate-900">
                  {stats.ebookOrders}
                </p>
                <p className="text-sm text-slate-600">E-Book Orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-slate-900">
                  {stats.hardcopyOrders}
                </p>
                <p className="text-sm text-slate-600">Hard Copy Orders</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-amber-600">
                  ₦{(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-slate-600">Revenue</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'ebook', 'hardcopy'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredOrders.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">
                      No orders found
                    </p>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedOrder?._id === order._id
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {order.firstName} {order.lastName}
                            </p>
                            <p className="text-sm text-slate-600">
                              {order.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₦{order.totalAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              STATUS_COLORS[order.orderStatus]
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              PAYMENT_STATUS_COLORS[order.paymentStatus]
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {order.bookFormat}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-medium w-24">Name:</span>
                      <span>
                        {selectedOrder.firstName} {selectedOrder.lastName}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${selectedOrder.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedOrder.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${selectedOrder.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedOrder.phone}
                      </a>
                    </p>
                    {selectedOrder.address && (
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>
                          {selectedOrder.address}
                          {selectedOrder.city ? ', ' + selectedOrder.city : ''}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Order Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Order ID:</span>
                      <span className="font-mono ml-2 text-xs">
                        {selectedOrder._id.slice(-8)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Format:</span>
                      <span className="ml-2">
                        {selectedOrder.bookFormat === 'ebook'
                          ? 'E-Book'
                          : 'Hard Copy'}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span>
                      <span className="ml-2">{selectedOrder.quantity}</span>
                    </p>
                    {selectedOrder.bookFormat === 'hardcopy' && (
                      <>
                        <p>
                          <span className="font-medium">Delivery:</span>
                          <span className="ml-2">
                            {selectedOrder.deliveryMethod === 'home-delivery'
                              ? 'Home Delivery'
                              : 'Pickup'}
                          </span>
                        </p>
                        {selectedOrder.pickupLocation && (
                          <p>
                            <span className="font-medium">Location:</span>
                            <span className="ml-2 text-xs">
                              {selectedOrder.pickupLocation}
                            </span>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Payment Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Total Amount:</span>
                      <span className="ml-2 font-bold text-lg">
                        ₦{selectedOrder.totalAmount.toLocaleString()}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus]
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {selectedOrder.paymentStatus === 'pending' && (
                  <Button
                    onClick={() => confirmPayment(selectedOrder._id)}
                    disabled={updatingStatus === selectedOrder._id}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {updatingStatus === selectedOrder._id
                      ? 'Confirming...'
                      : 'Confirm Payment'}
                  </Button>
                )}

                {selectedOrder.paymentStatus === 'confirmed' && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Update Status:</p>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(selectedOrder._id, e.target.value)
                      }
                      disabled={updatingStatus === selectedOrder._id}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="payment-confirmed">
                        Payment Confirmed
                      </option>
                      <option value="processing">Processing</option>
                      {selectedOrder.bookFormat === 'hardcopy' &&
                        selectedOrder.deliveryMethod === 'home-delivery' && (
                          <option value="shipped">Shipped</option>
                        )}
                      {selectedOrder.bookFormat === 'hardcopy' &&
                        selectedOrder.deliveryMethod === 'pickup' && (
                          <option value="pickup-ready">Pickup Ready</option>
                        )}
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
