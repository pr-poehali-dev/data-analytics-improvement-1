import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

const articles = [
  {
    title: "Как не забыть про день рождения лучшего друга",
    category: "Советы",
    image: "https://cdn.poehali.dev/projects/957a3b22-5fd8-4019-958f-03c509698ece/files/5a10e7c3-2af6-4777-aece-f2aae9534f73.jpg",
  },
  {
    title: "10 универсальных идей подарков на любой случай",
    category: "Подарки",
    image: "https://cdn.poehali.dev/projects/957a3b22-5fd8-4019-958f-03c509698ece/files/e5e67bac-38e2-475f-9e2e-9d3a915c32c2.jpg",
  },
  {
    title: "Годовщины и важные даты: как организовать память",
    category: "Организация",
    image: "https://cdn.poehali.dev/projects/957a3b22-5fd8-4019-958f-03c509698ece/files/e687b0a9-e879-45d4-9b02-0293cf6923b0.jpg",
  },
  {
    title: "Персональный подарок vs. сертификат: что выбрать",
    category: "Подарки",
    image: "https://cdn.poehali.dev/projects/957a3b22-5fd8-4019-958f-03c509698ece/files/5a10e7c3-2af6-4777-aece-f2aae9534f73.jpg",
  },
]

export function InsightsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <section className="bg-background px-6 py-24" onMouseMove={handleMouseMove}>
      <div className="max-w-4xl mx-auto">
        <motion.p
          className="text-muted-foreground text-sm uppercase tracking-widest mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Полезное
        </motion.p>

        <div className="divide-y divide-border">
          {articles.map((article, i) => (
            <motion.a
              key={i}
              href="#"
              className="group flex items-center justify-between py-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ paddingLeft: 16, paddingRight: 16 }}
              data-clickable
            >
              <div className="flex-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{article.category}</span>
                <h3 className="font-serif text-xl md:text-2xl text-foreground mt-1 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </div>

        {/* Floating hover image */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              className="fixed pointer-events-none z-50 w-[200px] md:w-[300px] rounded-lg overflow-hidden shadow-2xl hidden md:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: mousePosition.x + 20,
                y: mousePosition.y - 100,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={articles[hoveredIndex].image || "/placeholder.svg"}
                alt={articles[hoveredIndex].title}
                className="w-full h-auto"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
