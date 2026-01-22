import { describe, it, expect, vi, afterEach } from "vitest"
import fc from "fast-check"
import * as ElectronIPC from "../src/Platform/ipc/electron"

describe("Property 6.6: Electron IPC Communication", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    // @ts-ignore
    delete window.electron
  })

  it("should resolve IPC call when matching response is received", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }), // messageType
        fc.array(fc.string()), // args (simplified to strings for easy serialization)
        fc.string(), // result
        async (messageType, args, result) => {
          const sendIPCMessage = vi.fn()
          const subscribeToIPCMessages = vi.fn()

          // @ts-ignore
          window.electron = {
            sendIPCMessage,
            subscribeToIPCMessages
          }

          let capturedCallback: Function | null = null
          subscribeToIPCMessages.mockImplementation((type, cb) => {
            if (type === messageType) {
              capturedCallback = cb
              return () => {} // unsubscribe
            }
            return () => {}
          })

          const promise = (ElectronIPC.call as any)(messageType, ...args)

          expect(sendIPCMessage).toHaveBeenCalledTimes(1)
          const sentPayload = sendIPCMessage.mock.calls[0][1]
          const sentCallID = sentPayload.callID

          expect(sentPayload.args).toEqual(args)
          expect(sentCallID).toBeDefined()

          if (!capturedCallback) {
            throw new Error("Callback not registered")
          }

          // Simulate unrelated message (wrong ID)
          // @ts-ignore
          capturedCallback(new Event("message"), { callID: sentCallID + 999, result: "wrong" })

          // Simulate correct message
          // @ts-ignore
          capturedCallback(new Event("message"), { callID: sentCallID, result })

          const resolved = await promise
          expect(resolved).toEqual(result)
        }
      ),
      { numRuns: 100 }
    )
  })
})
