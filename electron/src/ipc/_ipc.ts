import { ipcMain } from "electron"
import pick from "lodash.pick"

export function expose<Message extends keyof IPC.MessageType>(
  messageType: Message,
  handler: (
    ...args: IPC.MessageArgs<Message>
  ) => IPC.MessageReturnType<Message> | Promise<IPC.MessageReturnType<Message>>
) {
  ipcMain.on(messageType, async (event: Electron.IpcMainEvent, payload: ElectronIPCCallMessage<Message>) => {
    const { args, callID } = payload
    try {
      const result = await handler(...args)
      event.sender.send(messageType, { callID, result })
    } catch (error) {
      // Type guard for error object
      const err = error as any
      const extras = pick(err, err.__extraProps || [])
      event.sender.send(messageType, {
        callID,
        error: {
          ...extras,
          __extraProps: err.__extraProps,
          message: err.message,
          name: err.name || "Error",
          stack: err.stack
        }
      })
    }
  })
}
