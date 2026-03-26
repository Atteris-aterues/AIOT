// src/components/Dialog/utils/typingEffect.ts
export class TypingEffect {
  private fullText: string
  private callback: (text: string) => void
  private interval: number | null = null
  private currentIndex = 0
  private speed = 30 // 毫秒/字符

  constructor(fullText: string, callback: (text: string) => void, speed = 30) {
    this.fullText = fullText
    this.callback = callback
    this.speed = speed
  }

  start() {
    this.currentIndex = 0
    this.callback('')
    
    this.interval = window.setInterval(() => {
      if (this.currentIndex < this.fullText.length) {
        this.currentIndex++
        this.callback(this.fullText.substring(0, this.currentIndex))
      } else {
        this.stop()
      }
    }, this.speed)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    // 确保显示完整内容
    this.callback(this.fullText)
  }

  isRunning() {
    return this.interval !== null
  }
}