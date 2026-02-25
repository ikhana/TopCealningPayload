// components/LabsImageCards.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/cn'
import Image from 'next/image'
import { ArrowRight, X, Clock, ShieldCheck, Droplet, ListChecks } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type CardItem = {
  id: string
  title: string
  desc: string
  img: string
  href?: string
}

const ITEMS: CardItem[] = [
  { id: 'hormones', title: 'Advanced hormones', desc: 'Our advanced hormones profiles provide detailed insight of your patient’s hormone functions and general health.', img: '/images/backgrounds/harmones.jpeg', href: '#' },
  { id: 'igg', title: 'Food Sensitivity, IgG', desc: 'Our Food sensitivity testing measures total IgG antibodies from 286 food antigens.', img: '/images/backgrounds/food-sensistivity.jpg', href: '#' },
  { id: 'ige', title: 'Environmental + Food IgE', desc: 'Evaluates 295 allergens from a wide range of environmental and food sources.', img: '/images/backgrounds/enviroment-test.jpg', href: '#' },
  { id: 'heart', title: 'Heart Health', desc: 'cardioPRO provides an in-depth look at lipoprotein particles, plaque buildup, and key functions of the heart.', img: '/images/backgrounds/moniter-health.jpg', href: '#' },
  { id: 'std', title: 'STD', desc: 'Next-day results allow for patients to be diagnosed and treated with speed and ease.', img: '/images/backgrounds/std.jpg', href: '#' },
  { id: 'immigration', title: 'Immigration', desc: 'TB (QFT-Gold) testing for DOS, USCIS and other required screenings—with less blood to draw.', img: '/images/backgrounds/immigration.jpg', href: '#' },
]

// Accent palette per card (for creative gradients)
const ACCENT: Record<string, { from: string; to: string; solid: string; chip: string }> = {
  hormones:    { from: '#0F2541', to: '#FF6B6B', solid: '#FF6B6B', chip: '#0F2541' },
  igg:         { from: '#0F2541', to: '#F59E0B', solid: '#F59E0B', chip: '#0F2541' },
  ige:         { from: '#0F2541', to: '#10B981', solid: '#10B981', chip: '#0F2541' },
  heart:       { from: '#0F2541', to: '#EF4444', solid: '#EF4444', chip: '#0F2541' },
  std:         { from: '#0F2541', to: '#8B5CF6', solid: '#8B5CF6', chip: '#0F2541' },
  immigration: { from: '#0F2541', to: '#22D3EE', solid: '#22D3EE', chip: '#0F2541' },
}

// extra details shown in the modal (creative but concise)
const DETAILS: Record<string, { highlights: string[]; sample: string; prep: string; tat: string }> = {
  hormones: { highlights: ['TSH, Free T3/T4', 'Estrogen / Progesterone', 'AM Cortisol', 'Vitamin D & B12'], sample: 'Blood (serum)', prep: '8–12h fasting recommended', tat: '24–48 hours' },
  igg: { highlights: ['286 food antigens', 'Elimination guidance', 'Color-coded report'], sample: 'Blood (serum)', prep: 'No special prep', tat: '2–3 days' },
  ige: { highlights: ['295 allergens', 'Environmental + food', 'Severity scale'], sample: 'Blood (serum)', prep: 'Avoid antihistamines 48h (if possible)', tat: '24–72 hours' },
  heart: { highlights: ['Advanced lipid profile (LDL-P)', 'ApoB / Lp(a)', 'hs-CRP'], sample: 'Blood (serum)', prep: '8–12h fasting recommended', tat: '24–48 hours' },
  std: { highlights: ['HIV, Hep B/C, Syphilis', 'Chlamydia & Gonorrhea', 'Discreet results'], sample: 'Blood / Urine', prep: 'No special prep', tat: 'Next day' },
  immigration: { highlights: ['TB (QFT-Gold) screening', 'Vaccination titers (if needed)', 'Physician-ready report'], sample: 'Blood', prep: 'No special prep', tat: '24–48 hours' },
}

export default function LabsImageCards() {
  const [activeId, setActiveId] = useState<string | null>(null)

  // ESC close + body scroll lock while modal open
  useEffect(() => {
    if (!activeId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActiveId(null)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [activeId])

  return (
    <section className="relative py-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it, i) => {
            const accent = ACCENT[it.id] || ACCENT['hormones']
            return (
              <motion.article
                key={it.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition  hover:shadow-2xl dark:bg-[#25303f]"
              >
                {/* animated top border gradient */}
                {/* <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                  }}
                /> */}

                {/* Shared image element */}
                <motion.figure className="relative aspect-[4/3] overflow-hidden">
                  <motion.div layoutId={`img-${it.id}`} className="absolute inset-0">
                    <Image
                      src={it.img}
                      alt={it.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500"
                      priority={i < 2}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                </motion.figure>

                <div className="flex flex-col p-6">
                  {/* Shared title element */}
                  <motion.h3
                    layoutId={`title-${it.id}`}
                    className={cn(
                      'text-xl lg:text-2xl font-semibold leading-tight transition-colors dark:text-white',
                      'group-hover:text-[#FF6B6B]',
                    )}
                  >
                    {it.title}
                  </motion.h3>

                  <p className="mt-2 text-base lg:text-lg leading-relaxed">{it.desc}</p>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveId(it.id)}
                      className="group cursor-pointer inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#FF6B6B]
                                 ring-1 ring-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 transition"
                    >
                      See More
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>

      {/* Creative modal with shared element animation */}
      <AnimatePresence>
        {activeId && (
          <DetailsModal
            key={activeId}
            item={ITEMS.find((x) => x.id === activeId)!}
            details={DETAILS[activeId]}
            accent={ACCENT[activeId]}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function DetailsModal({
  item,
  details,
  accent,
  onClose,
}: {
  item: CardItem
  details: { highlights: string[]; sample: string; prep: string; tat: string }
  accent: { from: string; to: string; solid: string; chip: string }
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="
          relative z-10 w-[92%] max-w-4xl overflow-hidden rounded-3xl
          bg-white dark:bg-[#0F172017]
          text-coral dark:text-white
          shadow-2xl border border-coral/20 dark:border-white/10
        "
        initial={{ opacity: 0, scale: 0.97, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full
                     bg-coral/10 dark:bg-white/10 hover:bg-coral/15 dark:hover:bg-white/15"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-coral dark:text-white" />
        </button>

        <div className="relative h-56 sm:h-64 md:h-72">
          <motion.div layoutId={`img-${item.id}`} className="absolute inset-0">
            <Image src={item.img} alt={item.title} fill className="object-cover" sizes="768px" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-[#0F172017]" />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-coral" />
        </div>

        {/* body */}
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <motion.h3
              id="lab-title"
              layoutId={`title-${item.id}`}
              className="text-2xl sm:text-3xl font-medium text-slate-600 dark:text-white"
            >
              {item.title}
            </motion.h3>

            {/* body copy stays ONLY coral (light) / white (dark) */}
            <p className="mt-2 text-slate-600 dark:text-white">{item.desc}</p>

            {/* highlights (only coral/white) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {details.highlights.map((h, i) => (
                <span
                  key={i}
                  className="
                    rounded-full px-3 py-1.5 text-xs
                    border border-coral dark:border-white
                    text-slate-600 dark:text-white
                    bg-transparent
                  "
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* stats + CTA */}
          <div className="space-y-3">
            <StatRow icon={<Droplet className="h-4 w-4 text-coral dark:text-white" />} label="Sample" value={details.sample} />
            <StatRow icon={<ShieldCheck className="h-4 w-4 text-coral dark:text-white" />} label="Preparation" value={details.prep} />
            <StatRow icon={<Clock className="h-4 w-4 text-coral dark:text-white" />} label="Turnaround" value={details.tat} />

            <div className="pt-3">
              <button
                onClick={() => {
                  window.alert('You can start');
                  onClose();
                }}
                className="w-full rounded-lg bg-coral px-4 py-2.5 text-white font-medium shadow hover:opacity-95 transition"
              >
                Book this test
              </button>
              <p className="mt-2 text-center text-xs text-slate-600 dark:text-white">
                Certified collection • Home sample available • Secure portal
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-coral/20 dark:ring-white/10" />
      </motion.div>
    </motion.div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="
      flex items-center justify-between rounded-lg
      border border-coral/30 dark:border-white/15
      bg-transparent px-3 py-2.5
    ">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-coral/10 dark:bg-white/10">
          {icon}
        </span>
        <span className="text-sm text-coral dark:text-white">{label}</span>
      </div>
      <span className="text-sm font-medium text-coral dark:text-white">{value}</span>
    </div>
  );
}


