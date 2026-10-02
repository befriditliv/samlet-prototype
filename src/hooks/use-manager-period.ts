import { useEffect, useMemo, useState } from "react";
import { periodOptions, type PeriodKey } from "@/data/managerDemo";

const STORAGE_KEY = "jarvis_manager_period";

export const useManagerPeriod = () => {
  const [period, setPeriod] = useState<PeriodKey>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return periodOptions.some((item) => item.key === stored) ? stored as PeriodKey : "30d";
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, period), [period]);
  const option = useMemo(() => periodOptions.find((item) => item.key === period) ?? periodOptions[0], [period]);
  return { period, setPeriod, option, hasFixture: period === "30d" };
};
