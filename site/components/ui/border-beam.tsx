import { cn } from "@/lib/utils"

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 3,
  colorFrom = "#ffc040",
  colorTo = "#c850ff",
  delay = 0,
}: BorderBeamProps) => {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", className)}
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
    >
      {/* Ambient glow ring */}
      <div
        className="absolute inset-0 rounded-[inherit] border-beam-ambient"
        style={{
          boxShadow: `
            0 0 18px color-mix(in srgb, ${colorFrom} 70%, transparent),
            0 0 36px color-mix(in srgb, ${colorTo} 55%, transparent),
            0 0 54px color-mix(in srgb, ${colorFrom} 35%, transparent),
            inset 0 0 18px color-mix(in srgb, ${colorTo} 15%, transparent)
          `,
        }}
      />

      {/* Soft blurred glow trail */}
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
          "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
          "before:absolute before:inset-0 before:content-[''] before:aspect-square before:w-[calc(var(--size)*1px)] before:animate-border-beam before:[animation-delay:var(--delay)] before:[background:linear-gradient(to_left,var(--color-from),var(--color-to),var(--color-from),transparent)] before:[offset-anchor:calc(var(--anchor)*1%)_50%] before:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] before:opacity-70 before:blur-[6px] before:brightness-150",
        )}
      />

      {/* Bright core beam */}
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
          "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
          "after:absolute after:inset-0 after:content-[''] after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),#ffffff,var(--color-to),var(--color-from),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] after:blur-[1px] after:brightness-125 after:saturate-150",
        )}
      />
    </div>
  )
}
