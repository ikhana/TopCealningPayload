'use client'

import { Html, MeshReflectorMaterial, RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import Slider from 'react-slick'
import * as THREE from 'three'
import { Color, Group, Mesh, Vector3 } from 'three'

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

interface Card3DProps {
  children?: ReactNode
  className?: string
  maxRotation?: number
  scale?: number
  position?: [number, number, number]
  color?: string
  opacity?: number
  reflective?: boolean
  title?: string
  content?: ReactNode
  rotationSmoothness?: number
  hoverScale?: number
  hoverLift?: number
  hoverColor?: string
  hoverLightIntensity?: number
  dynamicLight?: boolean
}

const CardContent = ({
  content,
  cardRotation,
  mousePosition,
  viewport,
}: {
  title?: string
  content?: ReactNode
  cardRotation?: THREE.Euler
  mousePosition?: THREE.Vector2
  viewport?: { width: number; height: number }
}) => {
  const contentRef = useRef<THREE.Group>(null)
  const parallaxAmount = 0.1

  useFrame(() => {
    if (contentRef.current && cardRotation && mousePosition && viewport) {
      const parallaxX = -cardRotation.y * parallaxAmount * 10
      const parallaxY = cardRotation.x * parallaxAmount * 10

      contentRef.current.position.x = parallaxX
      contentRef.current.position.y = parallaxY
    }
  })

  return (
    <group ref={contentRef} position={[0, 0, 0.7]}>
      <Html transform pointerEvents="none">
        <div style={{}}>{content}</div>
      </Html>
    </group>
  )
}

const Scene = ({
  children,
  maxRotation = 0.05,
  scale = 1.2,
  position = [0, 0, 0],
  color = '#111',
  opacity = 0.9,
  reflective = true,
  title,
  content,
  rotationSmoothness = 0.1,
  hoverScale = 1.03,
  hoverLift = 0.3,
  hoverColor = '#333',
  hoverLightIntensity = 5,
  dynamicLight = true,
}: Omit<Card3DProps, 'className'>) => {
  const group = useRef<Group>(null)
  const cardMesh = useRef<Mesh>(null)
  const dynamicLightRef = useRef<THREE.PointLight>(null)

  const [hover, setHover] = useState(false)
  const { mouse, viewport, gl } = useThree()

  const targetRotation = useRef(new Vector3(0, 0, 0))
  const targetScale = useRef(scale)
  const targetZ = useRef(position[2])
  const targetColor = useRef(new Color(color))
  const baseColor = useRef(new Color(color))
  const hoverColorTarget = useRef(new Color(hoverColor))

  useEffect(() => {
    baseColor.current.set(color)
    hoverColorTarget.current.set(hoverColor)
    targetScale.current = scale
    targetZ.current = position[2]
    targetColor.current.set(color)
  }, [scale, position, color, hoverColor])

  useEffect(() => {
    if (hover) {
      targetScale.current = scale * hoverScale
      targetZ.current = position[2] + hoverLift
      targetColor.current.set(hoverColor)
    } else {
      targetScale.current = scale
      targetZ.current = position[2]
      targetColor.current.set(color)
    }
  }, [hover, scale, position, hoverScale, hoverLift, color, hoverColor])

  useFrame(() => {
    if (!group.current || !cardMesh.current) return

    const rotationTargetX = mouse.y * -maxRotation
    const rotationTargetY = mouse.x * maxRotation

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      hover ? rotationTargetX : 0,
      rotationSmoothness,
    )
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      hover ? rotationTargetY : 0,
      rotationSmoothness,
    )

    group.current.scale.x =
      group.current.scale.y =
      group.current.scale.z =
        THREE.MathUtils.lerp(group.current.scale.x, targetScale.current, rotationSmoothness)

    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      targetZ.current,
      rotationSmoothness,
    )

    if (cardMesh.current.material) {
      const material = cardMesh.current.material as THREE.Material & { color?: THREE.Color }
      if (material.color) {
        material.color.lerp(targetColor.current, rotationSmoothness * 0.5)
      }
    }

    if (dynamicLightRef.current && dynamicLight) {
      const lightOffset = new THREE.Vector3(
        group.current.rotation.y * 5,
        -group.current.rotation.x * 5 + 3,
        2,
      )

      lightOffset.applyEuler(group.current.rotation)

      dynamicLightRef.current.position.copy(lightOffset)

      dynamicLightRef.current.intensity = THREE.MathUtils.lerp(
        dynamicLightRef.current.intensity,
        hover ? hoverLightIntensity : 0,
        rotationSmoothness,
      )
    }
  })

  return (
    <group
      ref={group}
      scale={5}
      position={position}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <RoundedBox
        ref={cardMesh}
        args={[12, 8.4, 0.4]}
        radius={0.4}
        smoothness={10}
        castShadow
        receiveShadow
      >
        {reflective ? (
          <MeshReflectorMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            opacity={opacity}
            transparent={opacity < 1}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.7}
            opacity={opacity}
            transparent={opacity < 1}
          />
        )}
      </RoundedBox>

      <CardContent
        title={title}
        content={content}
        cardRotation={group.current ? group.current.rotation : undefined}
        mousePosition={mouse}
        viewport={viewport}
      />

      {dynamicLight && (
        <pointLight
          ref={dynamicLightRef}
          position={[0, 0, 0]}
          intensity={0}
          distance={15}
          decay={2}
          color="#ffffff"
          castShadow
          visible={false}
        />
      )}

      <group position={[0, 0, 0.16]}>{children}</group>
    </group>
  )
}

type NavItem = {
  title: string
  href: string
}

const componentItems = [
  {
    id: 'UI_001',
    title: 'Saliva',
    description:
      'No other lab in the US offers all 11 sex-hormones and adrenal testing utilizing LC/MS/MS. Results delivered within 24–48 hours.',
    previewImage: '/images/tests/SalivaTesting.png',
    url: 'https://21st.dev/nubmaster4568/sign-in-flow-1/default',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
  {
    id: 'UI_002',
    title: 'Heavy Metals',
    description:
      'We screen for the detection of 21 toxic and 16 nutritional metals. Results delivered within 48 hours.',
    previewImage: '/images/tests/HeavyMetals.png',
    url: 'https://21st.dev/nubmaster4568/animated-search-bar/default',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
  {
    id: 'UI_003',
    title: 'QuantiFeron-TB Gold',
    description:
      'With only 1 tube needed to draw, our easy collect QFT testing offers results with the highest specificity available anywhere within 48 hours.',
    previewImage: '/images/tests/CancerTesting.png',
    url: '/images/tests/CancerTesting.png',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
  {
    id: 'UI_004',
    title: 'Advanced hormones',
    description:
      'Our advanced hormones profiles provide detailed insight of your patient’s hormone functions and general health.',
    previewImage: '/images/tests/AdvancedHarmones.png',
    url: '/images/tests/AdvancedHarmones.png',
    list: [' TSH, Free T3/T4', ' Estrogen / Progesterone', 'AM Cortiso'],
  },
  {
    id: 'UI_005',
    title: 'Food Sensitivity, IgG',
    description:
      'Our Food sensitivity testing measures total IgG antibodies from 286 food antigens.',
    previewImage: '/images/tests/FoodSensitivity.png',
    url: '/images/tests/FoodSensitivity.png',
    list: [' 286 food antigens', ' 286 food antigens', 'Color-coded report'],
  },
  {
    id: 'UI_006',
    title: 'Environmental + Food IgE',
    description: 'Evaluates 295 allergens from a wide range of environmental and food sources.',
    previewImage: '/images/tests/EnvironmentalFood.png',
    url: '/images/tests/EnvironmentalFood.png',
    list: [' Color-coded report', ' Environmental + food', 'Severity scale'],
  },
  {
    id: 'UI_007',
    title: 'Heart Health',
    description:
      'cardioPRO provides an in-depth look at lipoprotein particles, plaque buildup, and key functions of the heart.',
    previewImage: '/images/tests/HeartHealth.png',
    url: '/images/tests/HeartHealth.png',
    list: [' Advanced lipid profile (LDL-P)', ' ApoB / Lp(a)', 'hs-CRP'],
  },
  {
    id: 'UI_008',
    title: 'STD',
    description:
      'Next-day results allow for patients to be diagnosed and treated with speed and ease.',
    previewImage: '/images/tests/STDTesting.png',
    url: '/images/tests/STDTesting.png',
    list: [' HIV, Hep B/C, Syphilis', ' Chlamydia & Gonorrhea', 'Discreet results'],
  },
  {
    id: 'UI_009',
    title: 'Immigration',
    description:
      'TB (QFT-Gold) testing for DOS, USCIS and other required screenings—with less blood to draw.',
    previewImage: '/images/tests/ImmigrationTesting.png',
    url: '/images/tests/ImmigrationTesting.png',
    list: [' TB (QFT-Gold) screening', ' Vaccination titers (if needed)', 'Physician-ready report'],
  },
  {
    id: 'UI_010',
    title: 'Weight Loss',
    description:
      'Designed to capture the key factors behind your body s weight-loss and weight-gain mechanisms.',
    previewImage: '/images/tests/WeightLoss.png',
    url: '/images/tests/WeightLoss.png',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
  {
    id: 'UI_011',
    title: 'Wellness Health',
    description:
      'Evaluates red blood cells, electrolytes, thyroid function, cardiac risk and more for better health.',
    previewImage: '/images/tests/WellnessHealth.png',
    url: '/images/tests/WellnessHealth.png',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
  {
    id: 'UI_012',
    title: 'Cancer Testing',
    description:
      'Panels include tumor markers that help detect cancers of the liver, pancreas, prostate, GI tract, breast and ovaries.',
    previewImage: '/images/tests/CancerTesting.png',
    url: '/images/tests/CancerTesting.png',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
  {
    id: 'UI_013',
    title: 'Traumatic Brain Injury',
    description:
      'Investigate symptoms linked to TBI—now recognized as a contributor to hormone deficiencies.',
    previewImage: '/images/tests/TraumaticBrainInjury.png',
    url: '/images/tests/TraumaticBrainInjury.png',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
  {
    id: 'UI_014',
    title: 'Traumatic Brain Injury',
    description:
      'Investigate symptoms linked to TBI—now recognized as a contributor to hormone deficiencies.',
    previewImage: '/images/tests/TraumaticBrainInjury.png',
    url: '/images/tests/TraumaticBrainInjury.png',
    list: [' Home sample available', ' Certified staff', 'Results in 24–48h'],
  },
]

function NavbarItem({ item }: { item: NavItem }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={item.href}
      className="relative py-2 text-xs font-medium tracking-wider text-white/70 transition-colors hover:text-white/100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="inline-block relative" style={{ width: `${item.title.length}ch` }}>
        {isHovered ? (
          <DecryptEffect text={item.title} />
        ) : (
          <span className="font-medium">{item.title}</span>
        )}
      </span>
    </Link>
  )
}

function MenuIcon({ isOpen = false, isWhite = true }: { isOpen?: boolean; isWhite?: boolean }) {
  if (isOpen) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 6L18 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1 6H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1 11H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ComponentLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="16" height="16" rx="2" stroke="white" strokeWidth="2" />
      <path
        d="M13 16L15 18L19 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ComponentsLink({ onDropdownChange }: { onDropdownChange?: (isOpen: boolean) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const megaDropdownRef = useRef<{ startClosingAnimation: () => void } | null>(null)
  const text = 'COMPONENTS'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (megaDropdownRef.current) {
          megaDropdownRef.current.startClosingAnimation()
        } else {
          setIsDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (onDropdownChange) {
      onDropdownChange(isDropdownOpen)
    }
  }, [isDropdownOpen, onDropdownChange])

  const showDottedGrid = isHovered && !isDropdownOpen

  return (
    <div
      className={`relative h-[1200px] overflow-auto  border-neutral-800`}
      ref={dropdownRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="w-full bg-white dark:bg-[#25303f] border-b border-white dark:border-white z-50 overflow-hidden" // z-index 50 is fine for the dropdown container
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 900, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
              opacity: { duration: 0.5 },
            }}
          >
            <MegaDropdown ref={megaDropdownRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MegaDropdown = React.forwardRef<{ startClosingAnimation: () => void }>(({ onClose }, ref) => {
  const [visibleRows, setVisibleRows] = useState<number>(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [lockedItem, setLockedItem] = useState<string | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isFlipped, setIsFlipped] = useState(false)
  const preloadImage = (src: string) => {
    if (loadedImages.has(src)) return

    const img = new globalThis.Image()
    img.src = src
    img.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(src))
    }
  }

  useEffect(() => {
    if (hoveredItem) {
      const item = componentItems.find((item) => item.id === hoveredItem)
      if (item) {
        preloadImage(item.previewImage)
      }
    }
  }, [hoveredItem])

  useEffect(() => {
    const imagesToPreload = componentItems.slice(0, 4)
    imagesToPreload.forEach((item) => {
      preloadImage(item.previewImage)
    })
  }, [])

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref({ startClosingAnimation })
      } else {
        ref.current = { startClosingAnimation }
      }
    }
  }, [ref])

  useEffect(() => {
    const rowsCount = Math.ceil(componentItems.length / 2)
    let currentRow = 0

    const timer = setInterval(() => {
      if (currentRow < rowsCount) {
        setVisibleRows((prev) => prev + 1)
        currentRow++
      } else {
        clearInterval(timer)
      }
    }, 200)

    return () => clearInterval(timer)
  }, [])

  const startClosingAnimation = () => {
    // onClose()
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lockedItem) {
          setLockedItem(null)
        } else {
          startClosingAnimation()
        }
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [lockedItem])

  const handleComponentClick = (id: string) => {
    if (lockedItem === id) {
      setLockedItem(null)
    } else {
      setLockedItem(id)
      const item = componentItems.find((item) => item.id === id)
      if (item) {
        preloadImage(item.previewImage)
      }
    }
  }

  const displayedComponent = lockedItem
    ? componentItems.find((item) => item.id === lockedItem)
    : hoveredItem
      ? componentItems.find((item) => item.id === hoveredItem)
      : null

  const rows = []
  for (let i = 0; i < componentItems.length; i += 2) {
    const rowItems = componentItems.slice(i, i + 2)
    rows.push(rowItems)
  }

  return (
    <div className="h-full overflow-auto">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_2fr] h-full"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.01,
              delayChildren: 0.05,
              ease: 'easeOut',
            },
          },
        }}
      >
        <motion.div
          className="p-10 flex flex-col h-full justify-between"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: 'easeOut' },
            },
          }}
        >
          <h2 className="font-heading dark:text-white font-bold tracking-tight transition-all duration-300 relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black   after:opacity-30 after:transition-all after:duration-300">
            Trusted Tests. Fast, Clinical-Grade Resultssss
          </h2>
          {!displayedComponent && (
            <div
              className="border border-coral h-[300px] flex justify-center items-center mx-14 rounded-md bg-white dark:bg-[#25303f] p-12
               overflow-hidden transform-gpu transition-transform duration-300 ease-out hover:scale-[1.04] hover:shadow-lg will-change-transform"
            >
              <h3 className="mt-2 mb-3 text-sm text-black text-center dark:text-white leading-relaxed">
                Hover over a component to preview or Click for Book the test
              </h3>
            </div>
          )}

          {displayedComponent && (
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
              <div>
                <div className="border mt-4 p-6 border-coral rounded-md">
                  <div className="mt-2 mb-3 text-sm text-black dark:text-white leading-relaxed">
                    {displayedComponent.description}
                  </div>
                  <span className="flex justify-center">
                    <img
                      src={displayedComponent.previewImage}
                      className="rounded-lg"
                      height={200}
                      width={400}
                      alt="Preview"
                    />
                  </span>
                  <div className="mt-4 flex justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="rounded-md text-coral border border-coral w-full px-3 py-2 text-sm ring-1 ring-current hover:opacity-90"
                    >
                      Learn More
                    </button>
                    <button
                      type="button"
                      className="rounded-md w-full bg-coral px-3 py-2 text-sm text-white hover:opacity-95 dark:bg-coral"
                    >
                      Book this test
                    </button>
                  </div>
                </div>
              </div>
              <div className="border mt-4 p-4 border-coral rounded-md">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="text-coral flex gap-2 cursor-pointer p-2"
                >
                  <ArrowLeft className="w-5 h-5" /> <span className="text-sm ">Back</span>
                </button>
                <div>
                  <div className="mt-2 text-slate-600 dark:text-white">
                    <span className="flex justify-center">
                      <img
                        src={displayedComponent.previewImage}
                        className="rounded-lg"
                        height={200}
                        width={400}
                        alt="Preview"
                      />
                    </span>
                    <ul className="mb-4 mt-4 list-disc pl-3 mt-3 space-y-1 text-sm text-black dark:text-white">
                      {displayedComponent.list.map((item, i) => (
                        <li key={i} className="">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="rounded-md w-full bg-coral px-3 py-2 text-sm text-white hover:opacity-95 dark:bg-coral"
                    >
                      Book this test
                    </button>
                  </div>
                </div>
              </div>
            </ReactCardFlip>
          )}
        </motion.div>

        <div
          className="grid grid-cols-1 h-full"
          style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}
        >
          {rows.slice(0, visibleRows).map((rowItems, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-1 sm:grid-cols-2 w-full">
              {rowItems.map((item) => (
                <motion.div
                  key={item.id}
                  className={`relative border-t border-l border-white dark:border-white text-center ${
                    rowIndex === rows.length - 1 ? 'border-b' : ''
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <motion.div
                    className="absolute top-0 left-0 w-0 h-[1px] bg-coral dark:bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute top-0 left-0 w-[1px] h-0 bg-coral dark:bg-white"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                  <div
                    className={`flex flex-col justify-center items-center h-full px-6 py-8 relative overflow-hidden cursor-pointer ${
                      lockedItem === item.id ? 'ring-1 ring-inset ring-white/20' : ''
                    }`}
                    onMouseEnter={() => {
                      if (!lockedItem) {
                        setHoveredItem(item.id)
                      }
                    }}
                    onMouseLeave={() => {
                      if (!lockedItem) {
                        setHoveredItem(null)
                      }
                    }}
                    onClick={() => handleComponentClick(item.id)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-neutral-500/20"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{
                        scaleX:
                          (hoveredItem === item.id && !lockedItem) || lockedItem === item.id
                            ? 1
                            : 0,
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                    <div className="text-xs text-neutral-500 mb-4 font-mono relative z-10 h-4 flex items-center justify-center">
                      <div
                        className="w-full text-center"
                        style={{ minWidth: `${`/ ${item.id}`.length}ch` }}
                      >
                        {(hoveredItem === item.id && !lockedItem) || lockedItem === item.id ? (
                          <DecryptEffect text={`/ ${item.id}`} startDecrypting={true} />
                        ) : (
                          `/ ${item.id}`
                        )}
                      </div>
                    </div>

                    <div className="dark:text-white text-coral text-[17px] font-extralight relative z-10">
                      {item.title}
                    </div>
                    {lockedItem === item.id && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
})

function DecryptEffect({
  text,
  startDecrypting = false,
}: {
  text: string
  startDecrypting?: boolean
}) {
  const [decodedText, setDecodedText] = useState(startDecrypting ? '' : text)

  useEffect(() => {
    let iteration = 0
    let shouldAnimate = true
    const frameRate = 24
    const speed = startDecrypting ? 0.3 : 0.5

    const interval = setInterval(() => {
      if (!shouldAnimate) return

      setDecodedText((prev) => {
        const result = text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }

            return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
              Math.floor(Math.random() * 62)
            ]
          })
          .join('')

        iteration += speed

        if (iteration >= text.length) {
          clearInterval(interval)
        }

        return result
      })
    }, 1000 / frameRate)

    return () => {
      shouldAnimate = false
      clearInterval(interval)
    }
  }, [text, startDecrypting])

  return <span className="inline-block font-medium">{decodedText}</span>
}

function StableDecryptEffect({ text }: { text: string }) {
  const [decodedText, setDecodedText] = useState(text)

  useEffect(() => {
    let iteration = 0
    let shouldAnimate = true
    const frameRate = 24
    const speed = 0.5

    const interval = setInterval(() => {
      if (!shouldAnimate) return

      setDecodedText((prev) => {
        const result = text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }

            return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
              Math.floor(Math.random() * 62)
            ]
          })
          .join('')

        iteration += speed

        if (iteration >= text.length) {
          clearInterval(interval)
        }

        return result
      })
    }, 1000 / frameRate)

    return () => {
      shouldAnimate = false
      clearInterval(interval)
    }
  }, [text])

  return <span style={{ fontFamily: 'inherit' }}>{decodedText}</span>
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTitleMenuOpen, setIsTitleMenuOpen] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTitle, setCurrentTitle] = useState(componentItems[0].title)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  // Search
  const [query, setQuery] = useState('')
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return componentItems
    return componentItems.filter((it) => {
      const haystack = [it.title, it.description, ...(it.list ?? [])].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  // SSR-safe width
  const [screenWidth, setScreenWidth] = useState(0)

  // Slider + wheel
  const sliderRef = useRef<Slider>(null)
  const wheelWrapRef = useRef<HTMLDivElement | null>(null)
  const wheelCooldownRef = useRef(false)
  const wheelLockUntilRef = useRef(0)

  // Keep title & index valid with filter changes
  useEffect(() => {
    if (filteredItems.length === 0) {
      setCurrentIndex(0)
      setCurrentTitle('No matches')
      sliderRef.current?.slickPause?.()
      return
    }
    if (currentIndex >= filteredItems.length) {
      setCurrentIndex(0)
      setCurrentTitle(filteredItems[0].title)
      sliderRef.current?.slickGoTo(0, true)
    } else {
      setCurrentTitle(filteredItems[currentIndex].title)
    }
  }, [filteredItems, currentIndex])
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    vertical: true,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnHover: true,
    swipe: flippedIndex === null,
    draggable: flippedIndex === null,
    arrows: flippedIndex === null,
    afterChange: (index: number) => {
      setCurrentIndex(index)
      setCurrentTitle(filteredItems[index]?.title ?? '')
    },
  }
  const handleFlip = (idx: number) => {
    setFlippedIndex((prev) => {
      const next = prev === idx ? null : idx
      if (next !== null) sliderRef.current?.slickPause()
      return next
    })
  }

  const handleJumpTo = (i: number) => {
    setIsTitleMenuOpen(false)
    setFlippedIndex(null)
    wheelLockUntilRef.current = performance.now() + 900
    sliderRef.current?.slickGoTo(i)
    setCurrentIndex(i)
    setCurrentTitle(filteredItems[i]?.title ?? '')
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const el = wheelWrapRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (
        filteredItems.length === 0 ||
        flippedIndex !== null ||
        isTitleMenuOpen ||
        isDropdownOpen
      ) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (performance.now() < wheelLockUntilRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (wheelCooldownRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      wheelCooldownRef.current = true
      setTimeout(() => (wheelCooldownRef.current = false), 350)

      e.preventDefault()
      e.stopPropagation()

      if (e.deltaY > 0) sliderRef.current?.slickNext()
      else sliderRef.current?.slickPrev()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel as EventListener)
  }, [isMobileMenuOpen, filteredItems.length, flippedIndex, isTitleMenuOpen, isDropdownOpen])

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(screenWidth < 768)
  }, [screenWidth])

  return (
    <nav
      className={`w-full text-white ${isMobileMenuOpen ? 'h-full' : 'h-[950px]'} dark:bg-[#25303f]`}
    >
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_auto_1fr_auto] items-center h-20">
        <div className="border-r border-neutral-800 h-full hidden md:block">
          <ComponentsLink />
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="relative w-full bg-gray-100 dark:bg-[#25303f] p-4">
            <h1 className="text-coral dark:text-white text-center">{currentTitle}</h1>
            <form
              className="mx-auto w-full max-w-md mb-3"
              onSubmit={(e) => {
                e.preventDefault()
                if (filteredItems.length > 0) handleJumpTo(0)
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tests…"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-coral"
              />
            </form>
            <div className="mx-auto w-full max-w-md">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTitleMenuOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  <span className="truncate">{currentTitle}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isTitleMenuOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isTitleMenuOpen && (
                  <div
                    className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <ul className="py-1 text-sm text-gray-800">
                      {filteredItems.map((item, i) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleJumpTo(i)}
                            className={`block w-full px-3 py-2 text-left hover:bg-gray-100 ${i === currentIndex ? 'bg-gray-50 font-semibold' : ''}`}
                          >
                            {item.title}
                          </button>
                        </li>
                      ))}
                      {filteredItems.length === 0 && (
                        <li className="px-3 py-2 text-gray-500">No matches</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10 relative overscroll-contain" ref={wheelWrapRef}>
              <Slider {...sliderSettings} ref={sliderRef}>
                {filteredItems.length === 0 ? (
                  <div className="flex h-[400px] items-center justify-center text-gray-600 dark:text-gray-300">
                    No matches found
                  </div>
                ) : (
                  filteredItems.map((item, index) => {
                    const isFlipped = flippedIndex === index
                    return (
                      <div key={item.id} className="flex justify-center">
                        <div className="w-full h-[400px] [perspective:1200px]">
                          <div
                            className={[
                              'relative w-full h-full rounded-lg shadow-md transition-transform duration-500 [transform-style:preserve-3d]',
                              isFlipped ? 'rotate-y-180' : '',
                            ].join(' ')}
                            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                          >
                            <div
                              className="absolute inset-0 bg-white dark:bg-[#25303f] p-4 rounded-lg"
                              style={{ backfaceVisibility: 'hidden' }}
                            >
                              <img
                                src={item.previewImage}
                                alt={item.title}
                                className="w-full h-50 object-cover rounded-md"
                              />
                              <h3 className="mt-4 text-lg font-semibold dark:text-white">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-white/80 line-clamp-4">
                                {item.description}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleFlip(index)}
                                  className="mt-4 w-full px-4 py-2 border border-coral text-coral rounded-md hover:bg-coral/5"
                                >
                                  Learn More
                                </button>
                                <button
                                  type="button"
                                  className="mt-4 w-full px-4 py-2 bg-coral text-white rounded-md hover:opacity-95"
                                >
                                  Book a Test
                                </button>
                              </div>
                            </div>

                            <div
                              className="absolute inset-0 bg-white dark:bg-[#25303f] p-4 rounded-lg"
                              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                              <button
                                onClick={() => handleFlip(index)}
                                className="text-coral flex gap-2 cursor-pointer p-2"
                              >
                                <ArrowLeft className="w-5 h-5" />{' '}
                                <span className="text-sm">Back</span>
                              </button>
                              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                                {item.title}
                              </h3>
                              <div className="text-sm text-gray-700 dark:text-white/90 overflow-auto h-[230px] pr-2">
                                <img
                                  src={item.previewImage}
                                  alt={item.title}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                {item.list?.length ? (
                                  <ul className="list-disc pl-5 mt-3 space-y-1 dark:text-white">
                                    {item.list.map((f: string, i: number) => (
                                      <li key={i}>{f}</li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                className="mt-4 w-full px-4 py-2 bg-coral text-white rounded-md hover:opacity-95"
                              >
                                Book a Test
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </Slider>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  )
}
