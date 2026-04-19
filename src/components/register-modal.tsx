import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const REGISTER_URL = "https://functions.poehali.dev/e61b33ee-bdeb-4043-ab55-a65ac30eb23e"

const GIFT_TYPES = [
  { id: "flowers", label: "Цветы", emoji: "🌸" },
  { id: "sweets", label: "Сладости", emoji: "🍫" },
  { id: "certificate", label: "Сертификат", emoji: "🎟️" },
  { id: "gadget", label: "Гаджет", emoji: "📱" },
  { id: "clothes", label: "Одежда", emoji: "👗" },
  { id: "experience", label: "Впечатления", emoji: "🎭" },
  { id: "books", label: "Книги", emoji: "📚" },
  { id: "surprise", label: "Сюрприз", emoji: "🎁" },
]

const OCCASION_TYPES = [
  "День рождения",
  "Годовщина",
  "Новый год",
  "8 марта",
  "14 февраля",
  "Свадьба",
  "Выпускной",
  "Другое",
]

interface RegisterModalProps {
  open: boolean
  onClose: () => void
}

export function RegisterModal({ open, onClose }: RegisterModalProps) {
  const [step, setStep] = useState<"register" | "dates" | "done">("register")

  // Step 1
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Step 2
  const [personName, setPersonName] = useState("")
  const [occasion, setOccasion] = useState("")
  const [occasionDate, setOccasionDate] = useState("")
  const [selectedGifts, setSelectedGifts] = useState<string[]>([])
  const [giftComment, setGiftComment] = useState("")

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const toggleGift = (id: string) => {
    setSelectedGifts((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      })
      const data = await res.json()
      if (data.ok) {
        setStep("dates")
      } else {
        setErrorMsg(data.error || "Что-то пошло не так")
      }
    } catch {
      setErrorMsg("Ошибка соединения. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  const handleDatesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_dates",
          email,
          phone,
          personName,
          occasion,
          occasionDate,
          giftTypes: selectedGifts.map((id) => GIFT_TYPES.find((g) => g.id === id)?.label).join(", "),
          giftComment,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setStep("done")
      } else {
        setErrorMsg(data.error || "Что-то пошло не так")
      }
    } catch {
      setErrorMsg("Ошибка соединения. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setTimeout(() => {
        setStep("register")
        setEmail("")
        setPhone("")
        setPersonName("")
        setOccasion("")
        setOccasionDate("")
        setSelectedGifts([])
        setGiftComment("")
        setErrorMsg("")
      }, 300)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto relative overflow-hidden max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-secondary">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-primary to-purple-400"
                  animate={{ width: step === "register" ? "33%" : step === "dates" ? "66%" : "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="p-8">
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                  <Icon name="X" size={20} />
                </button>

                <AnimatePresence mode="wait">
                  {/* STEP 1 — Register */}
                  {step === "register" && (
                    <motion.form
                      key="register"
                      onSubmit={handleRegister}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Шаг 1 из 2</span>
                      </div>
                      <h2 className="font-serif text-2xl text-foreground mb-1">Начать бесплатно</h2>
                      <p className="text-muted-foreground text-sm mb-6">Укажите контакты для получения напоминаний</p>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">Email *</label>
                          <div className="relative">
                            <Icon name="Mail" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full bg-secondary rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">
                            Телефон <span className="text-muted-foreground/60">(для SMS-напоминаний)</span>
                          </label>
                          <div className="relative">
                            <Icon name="Phone" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+7 999 000 00 00"
                              className="w-full bg-secondary rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                          </div>
                        </div>

                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <><Icon name="Loader2" size={16} className="animate-spin" />Отправляем...</>
                          ) : (
                            <>Далее <Icon name="ArrowRight" size={16} /></>
                          )}
                        </button>

                        <p className="text-xs text-muted-foreground text-center">
                          Нажимая кнопку, вы соглашаетесь с условиями использования
                        </p>
                      </div>
                    </motion.form>
                  )}

                  {/* STEP 2 — Dates & Gifts */}
                  {step === "dates" && (
                    <motion.form
                      key="dates"
                      onSubmit={handleDatesSubmit}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Шаг 2 из 2</span>
                      </div>
                      <h2 className="font-serif text-2xl text-foreground mb-1">Добавьте первую дату 🗓️</h2>
                      <p className="text-muted-foreground text-sm mb-6">Расскажите, кому и когда нужно подарить что-то особенное</p>

                      <div className="space-y-5">
                        {/* Person name */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">Кому? *</label>
                          <div className="relative">
                            <Icon name="User" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              required
                              value={personName}
                              onChange={(e) => setPersonName(e.target.value)}
                              placeholder="Имя человека"
                              className="w-full bg-secondary rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                          </div>
                        </div>

                        {/* Occasion */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">Повод *</label>
                          <div className="grid grid-cols-2 gap-2">
                            {OCCASION_TYPES.map((occ) => (
                              <button
                                key={occ}
                                type="button"
                                onClick={() => setOccasion(occ)}
                                className={`px-3 py-2 rounded-xl text-sm text-left transition-all border ${
                                  occasion === occ
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary text-foreground border-transparent hover:border-primary/30"
                                }`}
                              >
                                {occ}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">Дата *</label>
                          <div className="relative">
                            <Icon name="Calendar" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="date"
                              required
                              value={occasionDate}
                              onChange={(e) => setOccasionDate(e.target.value)}
                              className="w-full bg-secondary rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                          </div>
                        </div>

                        {/* Gift types */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Тип подарка (можно несколько)</label>
                          <div className="grid grid-cols-4 gap-2">
                            {GIFT_TYPES.map((gift) => (
                              <button
                                key={gift.id}
                                type="button"
                                onClick={() => toggleGift(gift.id)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all border ${
                                  selectedGifts.includes(gift.id)
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-secondary border-transparent text-muted-foreground hover:border-primary/30"
                                }`}
                              >
                                <span className="text-xl">{gift.emoji}</span>
                                <span>{gift.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment */}
                        <div>
                          <label className="text-sm text-muted-foreground mb-1.5 block">
                            Комментарий <span className="text-muted-foreground/60">(необязательно)</span>
                          </label>
                          <textarea
                            value={giftComment}
                            onChange={(e) => setGiftComment(e.target.value)}
                            placeholder="Например: любит книги по психологии, размер одежды M"
                            rows={2}
                            className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                          />
                        </div>

                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep("register")}
                            className="px-4 py-3 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors"
                          >
                            <Icon name="ArrowLeft" size={16} />
                          </button>
                          <button
                            type="submit"
                            disabled={loading || !occasion}
                            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <><Icon name="Loader2" size={16} className="animate-spin" />Отправляем...</>
                            ) : (
                              "Отправить заявку"
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  )}

                  {/* DONE */}
                  {step === "done" && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-6"
                    >
                      <div className="text-5xl mb-4">🎉</div>
                      <h2 className="font-serif text-2xl text-foreground mb-2">Готово!</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                        Мы получили вашу заявку и напомним о дате <strong>{personName}</strong> вовремя. Ждите письмо на <strong>{email}</strong>.
                      </p>
                      <button
                        onClick={handleClose}
                        className="mt-8 w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                      >
                        Отлично!
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
