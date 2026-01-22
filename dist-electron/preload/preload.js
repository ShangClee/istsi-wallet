"use strict"
const s = require("electron"),
  t = process
function l(e, r, ...o) {
  const c = new Promise((i, p) => {
    const u = (P, n) => {
      if (n.messageID === r)
        if ((s.ipcRenderer.removeListener(e, u), n.error)) {
          const d = Object.assign(Error(n.error.message), { name: n.error.name || "Error", stack: n.error.stack })
          p(d)
        } else n.result ? i(n.result) : i(void 0)
    }
    s.ipcRenderer.on(e, u)
  })
  return s.ipcRenderer.send(e, { callID: r, args: o }), c
}
async function f(e, r) {
  const { args: o, callID: c } = r
  return l(e, c, ...o)
}
function m(e, r) {
  return s.ipcRenderer.on(e, r), () => s.ipcRenderer.removeListener(e, r)
}
const g = { sendIPCMessage: f, subscribeToIPCMessages: m }
s.contextBridge.exposeInMainWorld("electron", g)
process.once("loaded", () => {
  const e = { env: t.env, pid: t.pid, platform: t.platform }
  s.contextBridge.exposeInMainWorld("process", e)
})
