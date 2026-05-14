import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { Button } from '@/components/ui/button'
import { LowImpactHero } from '@/heros/LowImpact'
import { getMeUser } from '@/utilities/getMeUser'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import React, { Fragment } from 'react'

import { AccountForm } from './AccountForm'
import { AccountNav } from '@/components/AccountNav'
import { Order, Booking } from '@/payload-types'
import { notFound } from 'next/navigation'
import { OrderItem } from '@/components/OrderItem'

export default async function Account() {
  const { user, token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/account')}`,
  })

  let orders: Order[] | null = null
  let recentBookings: Booking[] = []

  try {
    const bookingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings?depth=0&sort=-createdAt&limit=3&where[user][equals]=${user?.id}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (bookingsRes.ok) {
      const json = await bookingsRes.json()
      recentBookings = json.docs ?? []
    }
  } catch {
    // render empty
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: '#854d0e', confirmed: '#065f46', 'in-progress': '#1e40af',
    completed: '#166534', cancelled: '#6b7280', refunded: '#991b1b',
  }
  const STATUS_BG: Record<string, string> = {
    pending: '#fef9c3', confirmed: '#ccfbf1', 'in-progress': '#dbeafe',
    completed: '#dcfce7', cancelled: '#f3f4f6', refunded: '#fee2e2',
  }
  const SERVICE_LABELS: Record<string, string> = {
    residential: 'Residential', 'movein-out': 'Move In/Out', airbnb: 'Airbnb',
    commercial: 'Commercial', renovation: 'Post-Renovation', hoarding: 'Hoarding', custom: 'Custom',
  }

  try {
    orders = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?depth=0&sort=-createdAt&limit=5`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
      ?.then(async (res) => {
        if (!res.ok) notFound()
        const json = await res.json()
        if ('error' in json && json.error) notFound()
        if ('errors' in json && json.errors) notFound()
        return json
      })
      ?.then((json) => json.docs)
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  return (
    <div>
      <div className="container">
        <RenderParams className="" />
      </div>

      <div className="container mt-16 pb-32 flex gap-8">
        <AccountNav className="max-w-[17.5rem] grow flex flex-col items-start gap-4" />

        <div className="flex flex-col gap-12">
          <div className="border p-8 rounded-lg bg-primary-foreground">
            <h1 className="text-3xl font-medium mb-8">Account settings</h1>
            <AccountForm />
          </div>

          {/* Recent Bookings */}
          <div className="border p-8 rounded-lg bg-primary-foreground">
            <h2 className="text-3xl font-medium mb-4">Recent Bookings</h2>
            <div className="prose dark:prose-invert mb-6">
              <p>Your most recent cleaning bookings. Track status and details in My Bookings.</p>
            </div>

            {recentBookings.length === 0 ? (
              <p className="mb-6">No bookings yet. <Link href="/booking" className="underline">Book a cleaning →</Link></p>
            ) : (
              <ul className="flex flex-col gap-3 mb-6">
                {recentBookings.map((booking) => (
                  <li key={booking.id}>
                    <Link href={`/account/bookings/${booking.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '14px 18px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>
                            {SERVICE_LABELS[booking.serviceType] ?? booking.serviceType}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-teal)', letterSpacing: '0.08em' }}>
                            {booking.confirmationCode} · {booking.serviceDate ?? ''}
                          </div>
                        </div>
                        <span style={{
                          padding: '3px 10px',
                          background: STATUS_BG[booking.status] ?? '#f3f4f6',
                          color: STATUS_COLORS[booking.status] ?? '#6b7280',
                          fontSize: '0.65rem', fontWeight: 700,
                          fontFamily: 'var(--font-mono)', letterSpacing: '0.5px',
                          textTransform: 'uppercase', borderRadius: '2px',
                        }}>
                          {booking.status}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Button asChild variant="default">
              <Link href="/account/bookings">View all bookings</Link>
            </Button>
          </div>

          {/* Recent Orders hidden — Top Cleaning is service-only, no e-commerce yet.
              Re-enable if/when a shop is added.
          <div className=" border p-8 rounded-lg bg-primary-foreground">
            <h2 className="text-3xl font-medium mb-8">Recent Orders</h2>

            <div className="prose dark:prose-invert mb-8">
              <p>
                These are the most recent orders you have placed. Each order is associated with an
                payment. As you place more orders, they will appear in your orders list.
              </p>
            </div>

            {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
              <p className="mb-8">You have no orders.</p>
            )}

            {orders && orders.length > 0 && (
              <ul className="flex flex-col gap-6 mb-8">
                {orders?.map((order, index) => (
                  <li key={order.id}>
                    <OrderItem order={order} />
                  </li>
                ))}
              </ul>
            )}

            <Button asChild variant="default">
              <Link href="/orders">View all orders</Link>
            </Button>
          </div>
          */}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
