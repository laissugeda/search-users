import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class NotificationService {
  message = signal<string | null>(null)
  isError = signal(false)

  notify(msg: string, isError = false) {
    this.message.set(msg)
    this.isError.set(isError)

    setTimeout(() => this.message.set(null), 5000)
  }
}
