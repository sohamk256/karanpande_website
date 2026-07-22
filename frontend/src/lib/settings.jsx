import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchSettings } from "../lib/api";

const SettingsContext = createContext({
  settings: null,
  refresh: () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const s = await fetchSettings();
      setSettings(s);
    } catch {}
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() { return useContext(SettingsContext); }
