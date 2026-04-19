import { useState, useEffect } from "react"
import { motion } from "framer-motion"

function ReminderAnimation() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="flex flex-col items-center gap-2"
        animate={{ scale: visible ? 1 : 1.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-5xl">🎂</span>
        <motion.div
          className="bg-primary/20 rounded-full px-4 py-1 text-sm text-primary font-medium"
          animate={{ opacity: visible ? 1 : 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Через 3 дня!
        </motion.div>
      </motion.div>
    </div>
  )
}

function GiftAnimation() {
  const [step, setStep] = useState(0)
  const gifts = ["🌸 Букет цветов", "🍫 Набор конфет", "🎁 Сертификат SPA"]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % gifts.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      {gifts.map((gift, i) => (
        <motion.div
          key={i}
          className="w-full max-w-[160px] bg-foreground/5 rounded-lg px-3 py-2 text-sm text-foreground"
          animate={{
            opacity: step === i ? 1 : 0.3,
            scale: step === i ? 1 : 0.95,
          }}
          transition={{ duration: 0.4 }}
        >
          {gift}
        </motion.div>
      ))}
    </div>
  )
}

function CalendarAnimation() {
  const [day, setDay] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDay((prev) => (prev % 28) + 1)
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <div className="bg-foreground/5 rounded-xl p-4 text-center w-[120px]">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Апрель</div>
        <motion.div
          key={day}
          className="text-5xl font-serif text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {day}
        </motion.div>
      </div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-muted-foreground text-sm uppercase tracking-widest mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Возможности
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reminders Card */}
          <motion.div
            className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
            data-clickable
          >
            <div className="flex-1">
              <ReminderAnimation />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">Умные напоминания</h3>
              <p className="text-muted-foreground text-sm mt-1">Получайте уведомления заранее — никогда не пропустите важный день.</p>
            </div>
          </motion.div>

          {/* Gift Ideas Card */}
          <motion.div
            className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <GiftAnimation />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">Идеи подарков</h3>
              <p className="text-muted-foreground text-sm mt-1">Список идей для каждого человека — всегда знайте, что подарить.</p>
            </div>
          </motion.div>

          {/* Calendar Card */}
          <motion.div
            className="bg-secondary rounded-xl p-8 min-h-[280px] flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.96 }}
            data-clickable
          >
            <div className="flex-1">
              <CalendarAnimation />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl text-foreground">Календарь дат</h3>
              <p className="text-muted-foreground text-sm mt-1">Все дни рождения, годовщины и праздники в одном месте.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
