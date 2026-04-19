import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const images = [
  "https://cdn.poehali.dev/projects/957a3b22-5fd8-4019-958f-03c509698ece/files/5a10e7c3-2af6-4777-aece-f2aae9534f73.jpg",
  "https://cdn.poehali.dev/projects/957a3b22-5fd8-4019-958f-03c509698ece/files/e687b0a9-e879-45d4-9b02-0293cf6923b0.jpg",
  "https://cdn.poehali.dev/projects/957a3b22-5fd8-4019-958f-03c509698ece/files/e5e67bac-38e2-475f-9e2e-9d3a915c32c2.jpg",
]

interface HeroSectionProps {
  onStartClick: () => void
}

export function HeroSection({ onStartClick }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, -15])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, 0])
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 15])
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const x3 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6 py-24"
    >
      {/* Stacked images */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-[280px] md:w-[320px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl"
          style={{ rotate: rotate1, x: x1, y, zIndex: 1 }}
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={images[0]} alt="Подарки" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          className="relative w-[280px] md:w-[320px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl"
          style={{ rotate: rotate2, y, zIndex: 2 }}
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={images[1]} alt="Напоминания" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          className="absolute w-[280px] md:w-[320px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl"
          style={{ rotate: rotate3, x: x3, y, zIndex: 1 }}
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={images[2]} alt="Открытки" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-center text-foreground mix-blend-difference">
          Важные даты, <em className="italic">под рукой</em>.
        </h1>
        <motion.button
          onClick={onStartClick}
          className="pointer-events-auto bg-foreground text-background px-8 py-4 rounded-full font-medium text-base hover:bg-foreground/90 transition-colors shadow-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          data-clickable
        >
          Начать бесплатно
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-2 rounded-full bg-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
