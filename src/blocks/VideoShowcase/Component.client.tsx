// blocks/VideoShowcase/Component.client.tsx

'use client'

import React, { useRef, useState } from 'react'
import type { VideoShowcaseBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export function VideoShowcaseClient(props: VideoShowcaseBlock) {
  const {
    sectionId,
    backgroundStyle = 'muted',
    content,
    cta,
    videoType,
    videoFile,
    videoUrl,
    youtubeId,
    thumbnail,
    caption,
  } = props

  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const backgroundClasses = {
    default: 'bg-background dark:bg-card',
    muted: 'bg-muted dark:bg-card',
    accent: 'bg-primary/5 dark:bg-card',
  }

  const thumbnailUrl = 
    typeof thumbnail === 'object' && thumbnail !== null
      ? (thumbnail as Media).url
      : null

  const getVideoUrl = (): string | null => {
    if (videoType === 'upload' && typeof videoFile === 'object' && videoFile !== null) {
      return (videoFile as Media).url || null
    }
    if (videoType === 'url' && videoUrl) {
      return videoUrl
    }
    if (videoType === 'youtube' && youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
    }
    return null
  }

  const handlePlay = () => {
    setIsPlaying(true)
    if (videoType !== 'youtube') {
      requestAnimationFrame(() => {
        videoRef.current?.play().catch(() => {})
      })
    }
  }

  const videoSrc = getVideoUrl()

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn('relative overflow-hidden border-b border-border py-12 md:py-16 lg:py-20', backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 lg:gap-12 xl:gap-16">
            
            {/* Left: Content */}
            <div className="text-center md:text-left">
              <div className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-4 prose-headings:mt-0
                prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:lg:text-5xl prose-h1:font-bold prose-h1:text-primary
                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:lg:text-4xl prose-h2:font-bold prose-h2:text-foreground
                prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:font-semibold prose-h3:text-foreground
                prose-p:text-base prose-p:sm:text-lg prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                prose-ul:text-foreground prose-li:text-foreground
                prose-strong:text-foreground prose-strong:font-bold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              ">
                <RichText 
                  data={content} 
                  enableGutter={false}
                  enableProse={true}
                />
              </div>

              {cta?.link && (
                <div className="mt-8 md:mt-10">
                  <CMSLink link={cta.link}>
                    <BorderButton
                      text={cta.link.label || 'Learn More'}
                      variant="filled"
                      className="min-w-[200px]"
                    />
                  </CMSLink>
                </div>
              )}
            </div>

            {/* Right: Video */}
            <div className="relative">
              <div className="relative w-full aspect-video overflow-hidden">
                <GradientBorders />
                
                {/* Thumbnail state */}
                {!isPlaying && thumbnailUrl && (
                  <>
                    <Image
                      src={thumbnailUrl}
                      alt="Video thumbnail"
                      fill
                      priority
                      className="object-cover"
                    />

                    {/* Caption */}
                    {caption && (
                      <div className="absolute bottom-3 left-4 right-4 text-left">
                        <p className="text-sm text-white/90 font-body drop-shadow-lg">
                          {caption}
                        </p>
                      </div>
                    )}

                    {/* Play button */}
                    <button
                      onClick={handlePlay}
                      className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white text-foreground shadow-lg transition-transform hover:scale-110 cursor-pointer flex items-center justify-center"
                      aria-label="Play video"
                      title="Play video"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-8 w-8 ml-1"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Video state */}
                {isPlaying && videoSrc && (
                  <>
                    {videoType === 'youtube' ? (
                      <iframe
                        src={videoSrc}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Video"
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                        autoPlay
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}