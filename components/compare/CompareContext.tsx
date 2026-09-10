"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface CompareContextType {
  compareIds: string[];
  addCollege: (slugOrId: string) => boolean;
  removeCollege: (slugOrId: string) => void;
  clearCompare: () => void;
  isComparing: (slugOrId: string) => boolean;
  maxCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "collegeplex_compare_slugs";
const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount without blocking render
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCompareIds(parsed.slice(0, MAX_COMPARE));
          }
        }
      } catch {
        // Ignore localStorage errors
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    } catch {
      // Ignore localStorage write errors
    }
  }, [compareIds, isLoaded]);

  const addCollege = useCallback(
    (slugOrId: string): boolean => {
      const trimmed = slugOrId.trim();
      if (!trimmed) return false;

      if (compareIds.includes(trimmed)) {
        return false; // Already present
      }

      if (compareIds.length >= MAX_COMPARE) {
        alert("You can compare a maximum of 3 colleges at a time. Please remove one to add another.");
        return false;
      }

      setCompareIds((prev) => [...prev, trimmed]);
      return true;
    },
    [compareIds]
  );

  const removeCollege = useCallback((slugOrId: string) => {
    const trimmed = slugOrId.trim();
    setCompareIds((prev) => prev.filter((id) => id !== trimmed));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const isComparing = useCallback(
    (slugOrId: string) => {
      return compareIds.includes(slugOrId.trim());
    },
    [compareIds]
  );

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addCollege,
        removeCollege,
        clearCompare,
        isComparing,
        maxCount: MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
