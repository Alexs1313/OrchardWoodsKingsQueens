import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

type StoreContextValue = {
  isEnabledVibration: boolean;
  setIsEnabledVibration: React.Dispatch<React.SetStateAction<boolean>>;

  isEnabledSound: boolean;
  setIsEnabledSound: React.Dispatch<React.SetStateAction<boolean>>;
};

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined,
);

export const useStore = (): StoreContextValue => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within ContextProvider');
  }
  return ctx;
};

export const ContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isEnabledVibration, setIsEnabledVibration] = useState<boolean>(false);
  const [isEnabledSound, setIsEnabledSound] = useState<boolean>(false);

  const value = useMemo<StoreContextValue>(
    () => ({
      isEnabledVibration,
      setIsEnabledVibration,
      isEnabledSound,
      setIsEnabledSound,
    }),
    [isEnabledVibration, isEnabledSound],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
