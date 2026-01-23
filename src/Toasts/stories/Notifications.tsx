import React from "react"
// Button removed - using native button
import { storiesOf } from "@storybook/react"
import NotificationContainer from "../components/NotificationContainer"
import { NotificationsContext, NotificationsProvider } from "~App/contexts/notifications"

function Buttons(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: React.Children.count(props.children) * 40,
        justifyContent: "space-between"
      }}
    >
      {props.children}
    </div>
  )
}

storiesOf("Notifications", module).add("All", () => (
  <NotificationsProvider>
    <NotificationContainer />
    <NotificationsContext.Consumer>
      {({ showError, showNotification }) => (
        <Buttons>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => showError(new Error("An error happened."))}
          >
            Show error notification
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => showNotification("info", "This is an informational message.")}
          >
            Show info notification
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => showNotification("success", "Action successful!")}
          >
            Show success notification
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => showNotification("info", "Click me.", { onClick: () => window.alert("Clicked!") })}
          >
            Show clickable notification
          </button>
        </Buttons>
      )}
    </NotificationsContext.Consumer>
  </NotificationsProvider>
))
