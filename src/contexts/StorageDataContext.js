import React, { useState, createContext } from "react";

export const StorageDataContext = createContext();

export const StorageDataProvider = (props) => {
  const [StorageData, setStorageData] = useState([]);
  return (
    <StorageDataContext.Provider value={[StorageData, setStorageData]}>
      {props.children}
    </StorageDataContext.Provider>
  );
};
