"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Sparkles, ChevronDown, HelpCircle } from "lucide-react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { searchFAQs, faqCategories, type FAQ } from "@/lib/faq-data"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  faq?: FAQ
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hi! 👋 I'm here to help answer your questions about the QA Review system. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const results = searchFAQs(inputValue)
      
      let botResponse: Message

      if (results.length > 0) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: results[0].answer,
          timestamp: new Date(),
          faq: results[0]
        }
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "I couldn't find a specific answer to that question. Here are some common topics you might be interested in. You can also contact support for more help.",
          timestamp: new Date()
        }
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 800)
  }

  const handleQuickQuestion = (question: string, answer: string, faq: FAQ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: question,
      timestamp: new Date()
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: answer,
      timestamp: new Date(),
      faq
    }

    setMessages(prev => [...prev, userMessage, botMessage])
  }

  const suggestedQuestions = [
    { text: "What is a QA Review?", faq: faqCategories[0].faqs[0] },
    { text: "How does the process work?", faq: faqCategories[0].faqs[1] },
    { text: "What is the grading scale?", faq: faqCategories[1].faqs[0] },
    { text: "How do I upload documents?", faq: faqCategories[4].faqs[0] }
  ]

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 z-50",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 hover:scale-110"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
          <Card className="w-[380px] h-[600px] shadow-2xl border-2 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">QA Assistant</h3>
                  <p className="text-xs text-primary-foreground/80">Ask me anything!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.type === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-4 py-2.5 text-sm",
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                      {message.faq && (
                        <div className="mt-2 pt-2 border-t border-primary/20">
                          <p className="text-xs opacity-70">Related: {message.faq.question}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2.5">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Suggestions (show when no messages or just welcome) */}
                {messages.length <= 1 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <HelpCircle className="h-3 w-3" />
                      Quick questions:
                    </p>
                    {suggestedQuestions.map((q, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(q.text, q.faq.answer, q.faq)}
                        className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-primary/5"
                      >
                        <span className="text-xs">{q.text}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Category Badges (show after first interaction) */}
                {messages.length > 1 && messages.length < 10 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-muted-foreground">Browse by category:</p>
                    <div className="flex flex-wrap gap-1">
                      {faqCategories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                          onClick={() => {
                            const firstFAQ = category.faqs[0]
                            handleQuickQuestion(
                              `Tell me about ${category.name}`,
                              firstFAQ.answer,
                              firstFAQ
                            )
                          }}
                        >
                          <Icon icon={category.icon} className="h-3 w-3 mr-1" />
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 flex-shrink-0 bg-background">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Get instant answers to common questions
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

