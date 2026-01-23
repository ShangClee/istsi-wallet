import * as ElectronImpl from "./ipc/electron"
import * as CordovaImpl from "./ipc/cordova"
import * as WebImpl from "./ipc/web"

// Global IPC.* types are defined in types/ipc.d.ts

function getImplementation() {
  if (window.electron) {
    return ElectronImpl
  } else if (typeof process !== "undefined" && process.env && (process.env.PLATFORM === "android" || process.env.PLATFORM === "ios")) {
    return CordovaImpl
  } else {
    return WebImpl
  }
}

const implementation: any = getImplementation()

export function call<Message extends keyof IPC.MessageType>(
  messageType: Message,
  ...args: IPC.MessageArgs<Message>
): Promise<IPC.MessageReturnType<Message>> {
  return implementation.call(messageType, ...args)
}

type UnsubscribeFn = () => void

export function subscribeToMessages<Message extends keyof IPC.MessageType>(
  messageType: Message,
  callback: (message: any) => void
): UnsubscribeFn {
  return implementation.subscribeToMessages(messageType, callback)
}
