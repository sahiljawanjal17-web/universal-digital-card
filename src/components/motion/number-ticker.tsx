// Source: Magic UI — https://magicui.design/docs/components/number-ticker
// License: MIT (https://github.com/magicuidesign/magicui/blob/main/LICENSE.md)
// Adapted for this project: alias imports rewritten to @/lib/utils.
"use client"

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })
  const reduced = useReducedMotion()

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isInView) {
      // Adapted: no count-up animation when the user asked for less motion.
      if (reduced) {
        motionValue.jump(direction === "down" ? startValue : value)
      } else {
        timer = setTimeout(() => {
          motionValue.set(direction === "down" ? startValue : value)
        }, delay * 1000)
      }
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, delay, value, direction, startValue, reduced])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)))
        }
      }),
    [springValue, decimalPlaces]
  )

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-fg tabular-nums",
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  )
}