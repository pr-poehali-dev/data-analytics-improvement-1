import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const REGISTER_URL = "https://functions.poehali.dev/e61b33ee-bdeb-4043-ab55-a65ac30eb23e"

interface RegisterModalProps {
  open: boolean
  onClose: () => void
}

export function RegisterModal({ open, onClose }: RegisterModalProps) {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMsg(data.error || "Что-то пошло не так")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Ошибка соединения. Попробуйте ещё раз.")
    }
  }

  const handleClose = () => {
    if (status !== "loading") {
      onClose()
      setTimeout(() => {
        setStatus("idle")
        setEmail("")
        setPhone("")
        setErrorMsg("")
      }, 300)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto relative overflow-hidden"
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Gradient accent top */}
              <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-primary to-purple-400" />

              <div className="p-8">
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>

                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-6"
                    >
                      <div className="text-5xl mb-4">🎉</div>
                      <h2 className="font-serif text-2xl text-foreground mb-2">Вы в команде!</h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Мы отправили приветственное письмо на <strong>{email}</strong>.
                        {phone && " А также SMS на указанный номер."}
                      </p>
                      <button
                        onClick={handleClose}
                        className="mt-8 w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                      >
                        Отлично!
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="font-serif text-2xl text-foreground mb-1">Начать бесплатно</h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Введите email — и мы сразу напомним о первой важной дате
                      </p>

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

                        {errorMsg && (
                          <p className="text-red-500 text-sm">{errorMsg}</p>
                        )}

                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {status === "loading" ? (
                            <>
                              <Icon name="Loader2" size={16} className="animate-spin" />
                              Отправляем...
                            </>
                          ) : (
                            "Зарегистрироваться"
                          )}
                        </button>

                        <p className="text-xs text-muted-foreground text-center">
                          Нажимая кнопку, вы соглашаетесь с условиями использования
                        </p>
                      </div>
                    </motion.form>
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
