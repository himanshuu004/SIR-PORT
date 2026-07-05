"use client"

import { useEffect, useState } from "react"
import { cva } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BorderBeam } from "@/components/ui/border-beam"

interface Review {
  id: number | string
  name: string
  avatar?: string
  text: string
  role?: string
  rating?: number
}

type ThemeColor = "default" | "primary" | "elegant" | "vibrant" | "minimal"

interface AnimatedReviewCardsProps {
  reviews?: Review[]
  interactionType?: "drag" | "click"
  animationDuration?: number
  scaleStep?: number
  verticalSpacing?: number
  horizontalSpacing?: number
  autoRotate?: boolean
  rotateInterval?: number
  theme?: ThemeColor
  showBorderBeam?: boolean
  classNames?: {
    container?: string
    card?: string
    cardContent?: string
    header?: string
    avatar?: string
    name?: string
    role?: string
    text?: string
    rating?: string
    star?: string
    activeStarColor?: string
    inactiveStarColor?: string
  }
}

const cardVariants = cva(
  "absolute h-[320px] w-[min(calc(100vw-2rem),300px)] overflow-hidden rounded-2xl bg-background sm:h-[340px] sm:w-[350px] md:h-[300px] md:w-[550px]",
  {
    variants: {
      theme: {
        default: "border border-border bg-background shadow-lg",
        primary: "bg-primary-50 border border-primary/20 shadow-lg",
        elegant:
          "border border-zinc-200 bg-zinc-50 text-zinc-900 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
        vibrant:
          "border border-fuchsia-400 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-lg dark:border-fuchsia-700 dark:from-fuchsia-600 dark:to-pink-600",
        minimal:
          "border border-gray-100 bg-gray-50 text-gray-900 shadow-lg dark:border-gray-900 dark:bg-gray-950 dark:text-gray-100",
      },
      cursor: {
        drag: "cursor-grab active:cursor-grabbing",
        click: "cursor-pointer",
      },
    },
  }
)

const nameVariants = cva("text-lg font-semibold", {
  variants: {
    theme: {
      default: "text-foreground",
      primary: "text-primary",
      elegant: "text-zinc-900 dark:text-zinc-100",
      vibrant: "text-white",
      minimal: "text-gray-900 dark:text-gray-100",
    },
  },
})

const roleVariants = cva("text-xs leading-snug", {
  variants: {
    theme: {
      default: "text-muted-foreground",
      primary: "text-primary/70",
      elegant: "text-zinc-500 dark:text-zinc-400",
      vibrant: "text-white/80",
      minimal: "text-gray-500 dark:text-gray-400",
    },
  },
})

const textVariants = cva("select-none text-start text-sm leading-relaxed", {
  variants: {
    theme: {
      default: "text-foreground/90",
      primary: "text-primary/80",
      elegant: "text-zinc-600 dark:text-zinc-300",
      vibrant: "text-white/90",
      minimal: "text-gray-600 dark:text-gray-400",
    },
  },
})

const starColorVariants = {
  default: {
    active: "text-yellow-400 fill-current",
    inactive: "text-muted stroke-muted-foreground/20",
  },
  primary: {
    active: "text-primary",
    inactive: "text-primary/20",
  },
  elegant: {
    active: "text-zinc-700 dark:text-zinc-300 fill-current",
    inactive: "text-zinc-300 dark:text-zinc-600",
  },
  vibrant: {
    active: "text-white fill-current",
    inactive: "text-white/40",
  },
  minimal: {
    active: "text-gray-900 dark:text-gray-100 fill-current",
    inactive: "text-gray-200 dark:text-gray-700",
  },
}

function getInitials(name: string) {
  const parts = name.replace(/^(Shri|Dr|Mr)\.?\s+/i, "").trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }
  return name.charAt(0).toUpperCase()
}

export const AnimatedReviewCards = ({
  reviews: initialReviewsProp = [],
  interactionType = "click",
  animationDuration = 0.3,
  scaleStep = 0.05,
  verticalSpacing = 10,
  horizontalSpacing = 20,
  autoRotate = true,
  rotateInterval = 6000,
  theme = "default",
  showBorderBeam = true,
  classNames,
}: AnimatedReviewCardsProps) => {
  const starColors = starColorVariants[theme]
  const [reviews, setReviews] = useState(initialReviewsProp)
  const [isInteracting, setIsInteracting] = useState(false)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return

    const mql = window.matchMedia("(max-width: 640px)")
    const update = () => setIsMobile(mql.matches)

    update()
    mql.addEventListener?.("change", update)
    mql.addListener?.(update)

    return () => {
      mql.removeEventListener?.("change", update)
      mql.removeListener?.(update)
    }
  }, [])

  const handleInteraction = (index: number) => {
    setReviews((prevReviews) => {
      const newReviews = [...prevReviews]
      const [removed] = newReviews.splice(index, 1)
      newReviews.push(removed)
      return newReviews
    })
  }

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null
    if (autoRotate && !isInteracting) {
      intervalId = setInterval(() => {
        handleInteraction(0)
      }, rotateInterval)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoRotate, rotateInterval, isInteracting])

  return (
    <div
      className={cn(
        "not-prose relative flex h-[380px] w-full items-center justify-center sm:h-[420px] md:h-[380px]",
        classNames?.container
      )}
      role="region"
      aria-label="Testimonials carousel"
      aria-live="polite"
    >
      <AnimatePresence>
        {reviews.map((review, index) => (
          <motion.div
            key={review?.id}
            initial={{ scale: 0.8, y: 100, opacity: 0 }}
            animate={{
              scale: 1 + index * scaleStep,
              y: index * -verticalSpacing,
              x: !isMobile ? index * horizontalSpacing : undefined,
              opacity: index === reviews?.length - 1 ? 0.7 : 1,
              zIndex: reviews.length - index,
            }}
            exit={{ scale: 0.8, y: 100, opacity: 0 }}
            transition={{ duration: animationDuration }}
            drag={interactionType === "drag" ? "y" : false}
            dragConstraints={interactionType === "drag" ? { top: 0, bottom: 0 } : undefined}
            onDragStart={() => setIsInteracting(true)}
            onDragEnd={() => {
              setIsInteracting(false)
              if (interactionType === "drag") handleInteraction(index)
            }}
            onClick={() => {
              if (interactionType === "click") {
                setIsInteracting(true)
                handleInteraction(index)
                setTimeout(() => setIsInteracting(false), 300)
              }
            }}
            title={interactionType === "drag" ? "Drag me" : "Click me"}
            className={cardVariants({
              theme,
              cursor: interactionType,
              className: cn(
                classNames?.card,
                index === 0 && showBorderBeam && "border-beam-card-glow"
              ),
            })}
            style={
              index === 0 && showBorderBeam
                ? {
                    boxShadow:
                      "0 0 24px rgba(255, 192, 64, 0.45), 0 0 48px rgba(200, 80, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.12)",
                  }
                : undefined
            }
          >
            <div className={cn("relative flex h-full w-full flex-col rounded-2xl p-6", classNames?.cardContent)}>
              <div className={cn("mb-4 flex items-start gap-4", classNames?.header)}>
                <Avatar className={cn("h-11 w-11 shrink-0", classNames?.avatar)}>
                  {review?.avatar ? (
                    <AvatarImage src={review.avatar} alt={review?.name} />
                  ) : null}
                  <AvatarFallback className="bg-[#3B5B54] text-sm font-bold text-white">
                    {getInitials(review?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className={nameVariants({ theme, className: classNames?.name })}>
                    {review?.name}
                  </h2>
                  {review?.role ? (
                    <p className={roleVariants({ theme, className: classNames?.role })}>
                      {review.role}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className={cn("flex-1 overflow-y-auto pr-1 italic", textVariants({ theme, className: classNames?.text }))}>
                &ldquo;{review?.text}&rdquo;
              </p>

              {typeof review?.rating === "number" ? (
                <div className={cn("mt-4 flex items-center", classNames?.rating)}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < review.rating!
                          ? classNames?.activeStarColor || starColors.active
                          : classNames?.inactiveStarColor || starColors.inactive,
                        classNames?.star
                      )}
                    />
                  ))}
                </div>
              ) : null}

              {index === 0 && showBorderBeam ? (
                <BorderBeam
                  size={280}
                  borderWidth={3.5}
                  colorFrom="#ffc040"
                  colorTo="#c850ff"
                  duration={10}
                  delay={0}
                />
              ) : null}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
