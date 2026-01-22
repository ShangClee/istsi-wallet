"use strict";
const electron$1 = require("electron");
const electronProcess = process;
function sendMessage(messageType, callID, ...args) {
  const responsePromise = new Promise((resolve, reject) => {
    const listener = (event, data) => {
      if (data.messageID === callID) {
        electron$1.ipcRenderer.removeListener(messageType, listener);
        if (data.error) {
          const error = Object.assign(Error(data.error.message), {
            name: data.error.name || "Error",
            stack: data.error.stack
          });
          reject(error);
        } else if (data.result) {
          resolve(data.result);
        } else {
          resolve(void 0);
        }
      }
    };
    electron$1.ipcRenderer.on(messageType, listener);
  });
  electron$1.ipcRenderer.send(messageType, { callID, args });
  return responsePromise;
}
async function sendIPCMessage(messageType, message) {
  const { args, callID } = message;
  return sendMessage(messageType, callID, ...args);
}
function subscribeToIPCMessages(messageType, subscribeCallback) {
  electron$1.ipcRenderer.on(messageType, subscribeCallback);
  const unsubscribe = () => electron$1.ipcRenderer.removeListener(messageType, subscribeCallback);
  return unsubscribe;
}
const electron = {
  sendIPCMessage,
  subscribeToIPCMessages
};
electron$1.contextBridge.exposeInMainWorld("electron", electron);
process.once("loaded", () => {
  const newProcess = {
    env: electronProcess.env,
    pid: electronProcess.pid,
    platform: electronProcess.platform
  };
  electron$1.contextBridge.exposeInMainWorld("process", newProcess);
});
