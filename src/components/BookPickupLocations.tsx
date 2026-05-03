import { useState } from 'react'
import {
  MapPin,
  Phone,
  MessageCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  SITE_BANK_ACCOUNT_NAME,
  SITE_BANK_ACCOUNT_NUMBER_DISPLAY,
  SITE_BANK_NAME,
  SITE_PHONE_DISPLAY,
} from '@/lib/siteContact'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Bookshop {
  name: string
  address: string
}

interface LocationGroup {
  region: string
  bookshops: Bookshop[]
}

const bookshopLocations: LocationGroup[] = [
  {
    region: 'Eti-Osa LGA',
    bookshops: [
      { name: 'Ave Maria', address: 'Kusenla' },
      { name: 'Our Lady Star Of The Sea', address: 'Chevron' },
      { name: 'Church of Transfiguration', address: 'VGC' },
      { name: 'Regina Pacis', address: 'Lekki Epe Expressway' },
      { name: 'St. Theresa', address: 'Ikota Lekki' },
      { name: 'SS Philip & James', address: 'Idado, Lekki/Epe Expressway' },
      { name: 'Our Lady Mother Of Perpetual Help', address: 'Addo Ajah' },
    ],
  },
  {
    region: 'Lagos Island',
    bookshops: [
      { name: 'Charles Boromeo', address: '1004 Estate V/I' },
      { name: 'Catholic Cathedral Church Of Christ', address: 'Marina' },
      { name: 'Cathedral Of The Holy Cross', address: 'Lagos Island' },
      { name: 'Church Of The Assumption', address: 'Falomo Ikoyi' },
      { name: 'Our Lady Of Perpetual Help', address: 'V/I' },
      { name: "St. Michael's", address: 'Lafiaji Obalende' },
    ],
  },
  {
    region: 'Mainland',
    bookshops: [
      { name: 'St Timothy', address: 'Ojodu off Yakoyo Road' },
      {
        name: 'Catholic Church Of The Holy Spirit',
        address: 'Omole Estate Phase 1',
      },
      { name: 'St. Gerald', address: 'Adekunle Osomo Street, Gbagada' },
      {
        name: 'Our Lady Queen of Peace',
        address: 'Yetunde Brown Street, Ifako',
      },
      { name: 'Our Lady Queen of Apostles', address: 'Ilupeju' },
      { name: 'Sacred Heart', address: 'Ojota' },
      { name: 'SS Peter & Paul', address: 'Abeokuta Street, Shomolu' },
      { name: 'St Denis', address: 'Thomas Drive, Bariga' },
      {
        name: 'St Raphael The Archangel',
        address: 'Adewale Ayuba Street, Anthony',
      },
      { name: 'St Charles Lwanga', address: 'Army Cantonment, Ikeja' },
      { name: 'St Flavius', address: 'Akerele Street, Oworonshoki' },
      { name: "St Mary's", address: 'Ire Akari Estate Road, Oshodi-Isolo' },
      { name: 'Regina Mundi', address: '142-144 Agege Motor Road' },
      { name: 'St Theresa', address: '27 Ibari Street, Ifako Agege' },
      { name: 'St Louis', address: '10 Orelope Street, Egbeda' },
      { name: 'St Joachim & Ann', address: 'Ijegun' },
      { name: 'St Francis', address: 'Iliasu Road' },
      { name: 'St Bernadette', address: 'Ipaja' },
    ],
  },
  {
    region: 'Ikeja',
    bookshops: [
      { name: 'Chapel of Christ The Light', address: 'Alausa' },
      { name: "St Leo's", address: '1 Amore Street' },
      {
        name: 'Church Of The Presentation',
        address: 'Oba Akinjobi Street, GRA',
      },
      { name: 'St Francis', address: 'Oremeji Street, Oregun' },
      { name: 'Christ The King', address: 'off Shasha Road, Egbeda' },
      { name: 'St Jude', address: 'Mafoluku Oshodi' },
      { name: 'St Augustine', address: 'Airforce Base Ikeja' },
      { name: 'Church Of Resurrection', address: 'Ikosi Ketu' },
      { name: 'St Agnes', address: 'Mende Maryland' },
      {
        name: 'Holy Family Catholic Church',
        address: '2nd Avenue Festac Town',
      },
      { name: 'St Michael', address: 'Alapere Lagos' },
      { name: 'Jesus The Saviour', address: 'Isheri Osun' },
      {
        name: 'Archbishop Vining Memorial Church',
        address: 'Oba Akinjobi Way GRA',
      },
    ],
  },
  {
    region: 'Apapa',
    bookshops: [
      { name: 'Sacred Heart', address: '43 Creek Road, Apapa' },
      { name: 'St Vincent De Paul', address: 'Ebunoti Street' },
      { name: 'St Margaret', address: 'Musibau Oluwa' },
      { name: 'Church Of Visitation', address: '1st Avenue, Festac Town' },
      {
        name: 'Archangel Catholic Church',
        address: '1 Mission Street, Satellite Town',
      },
      { name: 'Watchman Charismatic Renewal Movement', address: 'Olodi Apapa' },
    ],
  },
  {
    region: 'Yaba',
    bookshops: [
      { name: "St Paul's", address: '88 Murtala Mohammed Way' },
      { name: "St Dominic's", address: 'Yaba' },
    ],
  },
  {
    region: 'Surulere',
    bookshops: [
      { name: 'Our Lady Of Fatima', address: '1-3 Adebayo Shode Street' },
      { name: "St Anthony's", address: '6-8 Gbaja Street' },
      {
        name: 'Queen of The Most Holy Rosary',
        address: '76 Sanya Street, Ijesha Tedo',
      },
    ],
  },
]

type PickupContact = {
  name: string
  phone: string
  displayPhone?: string
}

const contactInfo: PickupContact[] = [
  {
    name: 'Esther Otsabomhe',
    phone: '08030519619',
    displayPhone: SITE_PHONE_DISPLAY,
  },
  { name: 'Joy', phone: '07064271315' },
  { name: 'Shola', phone: '08035064115' },
]

function whatsappHrefFromNgPhone(phone: string): string {
  let d = phone.replace(/\D/g, '')
  if (d.startsWith('0')) d = d.slice(1)
  else if (d.startsWith('234')) d = d.slice(3)
  return `https://wa.me/234${d}`
}

export function BookPickupLocations() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLocations =
    searchTerm.trim() === ''
      ? bookshopLocations
      : bookshopLocations
          .map((group) => ({
            ...group,
            bookshops: group.bookshops.filter(
              (bookshop) =>
                bookshop.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                bookshop.address
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                group.region.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
          }))
          .filter((group) => group.bookshops.length > 0)

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`
  }

  const handleWhatsApp = (phone: string) => {
    window.open(whatsappHrefFromNgPhone(phone), '_blank')
  }

  return (
    <section
      id="pickup-locations"
      className="w-full bg-gradient-to-b from-sky-50/90 via-white to-[#fdfbf7] py-16 md:py-24 scroll-mt-[5.25rem]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Catholic Bookshops to Pick From
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Buyers who select <span className="font-semibold">Hard Copy</span>{' '}
            during purchase can choose to pick up their book from any of the
            Catholic bookshops listed below.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by bookshop name, address, or region..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>
          {searchTerm && (
            <p className="text-sm text-slate-600 mt-2">
              Found{' '}
              {filteredLocations.reduce(
                (sum, loc) => sum + loc.bookshops.length,
                0,
              )}{' '}
              matching bookshop
              {filteredLocations.reduce(
                (sum, loc) => sum + loc.bookshops.length,
                0,
              ) !== 1
                ? 's'
                : ''}
            </p>
          )}
        </div>

        {/* Accordion Sections */}
        <div className="mb-16">
          <Accordion
            type="multiple"
            className="space-y-4"
            key={`accordion-${searchTerm}`}
          >
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => (
                <AccordionItem
                  key={index}
                  value={`region-${index}`}
                  className="border border-slate-200 rounded-lg overflow-hidden bg-white"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-amber-50 transition-colors">
                    <div className="flex items-center gap-3 text-left">
                      <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {location.region}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {location.bookshops.length} bookshop
                          {location.bookshops.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-slate-50">
                    <div className="grid gap-3">
                      {location.bookshops.map((bookshop, bookshopIndex) => (
                        <div
                          key={bookshopIndex}
                          className="p-3 bg-white border border-slate-200 rounded-lg hover:border-amber-300 transition-colors"
                        >
                          <p className="font-medium text-slate-900">
                            {bookshop.name}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {bookshop.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                  No bookshops found matching "{searchTerm}"
                </p>
              </div>
            )}
          </Accordion>
        </div>

        {/* Call to Action - Complete Purchase */}
        <div className="mb-16 p-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            Ready to Complete Your Purchase?
          </h3>
          <p className="text-amber-50 mb-6 max-w-2xl mx-auto">
            If you already have an order, proceed to the payment page to submit
            your payment receipt and track your order status.
          </p>
          <Link to="/buy">
            <Button className="bg-white text-amber-600 hover:bg-amber-50 font-semibold px-8 py-3 text-lg flex items-center gap-2 mx-auto">
              Go to Payment Page
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Contact Section */}
        <Card className="border-2 border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-amber-50/80 shadow-cloud">
          <CardHeader className="border-b border-sky-200/70 bg-white/70">
            <CardTitle className="text-2xl text-[#082040] flex items-center gap-2">
              <Phone className="w-6 h-6 text-sky-600" />
              Need Help With Pickup?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="mb-8 rounded-xl border border-[#e4cf98]/65 bg-[#fdfbf7] p-5 text-center text-[#082040]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#976f2f] mb-3">
                Book payment (transfer)
              </p>
              <p className="font-semibold text-navy">{SITE_BANK_NAME}</p>
              <p className="text-sm mt-2">
                Account name:{' '}
                <span className="font-mono font-semibold">{SITE_BANK_ACCOUNT_NAME}</span>
              </p>
              <p className="text-lg font-mono font-bold tracking-wide mt-2 text-[#082040]">
                {SITE_BANK_ACCOUNT_NUMBER_DISPLAY}
              </p>
            </div>
            <p className="text-slate-700 mb-8">
              Reach out to any of our team members for pickup enquiries and
              assistance:
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {contactInfo.map((contact, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-amber-200 rounded-lg"
                >
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {contact.name}
                  </h4>

                  <div className="space-y-3">
                    <Button
                      onClick={() => handleCall(contact.phone)}
                      className="w-full bg-[#071b3d] hover:bg-[#0a275a] text-white flex items-center justify-center gap-2 ring-1 ring-[#d4af37]/35"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>

                    <Button
                      onClick={() => handleWhatsApp(contact.phone)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>

                    <p className="text-center text-sm text-slate-600 font-mono tracking-wide">
                      {contact.displayPhone ?? contact.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-100 border border-amber-300 rounded-lg">
              <p className="text-sm text-amber-900">
                ℹ️ <span className="font-semibold">Pro Tip:</span> Contact us
                via WhatsApp for a faster response. Don't forget to mention your
                order number and preferred pickup location!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">
                Multiple Locations
              </h4>
              <p className="text-sm text-slate-600">
                Choose from over 70 Catholic bookshops across Lagos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Phone className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">
                Easy Contact
              </h4>
              <p className="text-sm text-slate-600">
                Call or WhatsApp our team for personalized assistance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <ChevronDown className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">
                Quick Lookup
              </h4>
              <p className="text-sm text-slate-600">
                Search and filter bookshops by name or location
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
