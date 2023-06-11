import React, { useState, createContext } from "react";

export const NotificationsContext = createContext();

export const NotificationsProvider = (props) => {
  const [notifications, setNotifications] = useState([]);
  return (
    <NotificationsContext.Provider value={[notifications, setNotifications]}>
      {props.children}
    </NotificationsContext.Provider>
  );
};
