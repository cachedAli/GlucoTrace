import {
  ArrowDown01,
  ArrowUp10,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ArrowDownAZ,
  ArrowUpZA,
} from "lucide-react";
import { useReadingHistoryUtils } from "../../utils/useReadingHistoryUtils.js";

export const readingHistory = () => {
  const {
    filterFastingReadings,
    filterAfterMealReadings,
    filterBeforeMealReadings,
    filterCustomMealReadings,
    filterTodayReadings,
    filterLast7DayReadings,
    filterLast30DayReadings,
    filterMorningReadings,
    filterAfternoonReadings,
    filterEveningReadings,
    filterNightReadings,
    sortByNewestDate,
    sortByOldestDate,
    sortByHighestValue,
    sortByLowestValue,
    sortByMealAZ,
    sortByMealZA,
  } = useReadingHistoryUtils();

  const filterItems = [
    {
      label: "by meal timing",
      subMenu: [
        { label: "fasting", onClick: () => filterFastingReadings() },
        { label: "before meal", onClick: () => filterBeforeMealReadings() },
        { label: "after meal", onClick: () => filterAfterMealReadings() },
        { label: "custom", onClick: () => filterCustomMealReadings() },
      ],
    },
    {
      label: "by date range",
      subMenu: [
        { label: "today", onClick: () => filterTodayReadings() },
        { label: "last 7 days", onClick: () => filterLast7DayReadings() },
        { label: "last 30 days", onClick: () => filterLast30DayReadings() },
      ],
    },
    {
      label: "by time of day",
      subMenu: [
        { label: "morning", onClick: () => filterMorningReadings() },
        { label: "afternoon", onClick: () => filterAfternoonReadings() },
        { label: "evening", onClick: () => filterEveningReadings() },
        { label: "night", onClick: () => filterNightReadings() },
      ],
    },
  ];

  const sortItems = [
    {
      label: "Date: Newest",
      onClick: () => sortByNewestDate(),
      icon: <ArrowDown01 size={20} className="text-zinc-700 dark:text-white" />,
    },
    {
      label: "Date: Oldest",
      onClick: () => sortByOldestDate(),
      icon: <ArrowUp10 size={20} className="text-zinc-700 dark:text-white" />,
    },
    {
      label: "Value: High",
      onClick: () => sortByHighestValue(),
      icon: (
        <ArrowDownWideNarrow
          size={20}
          className="text-zinc-700 dark:text-white"
        />
      ),
    },
    {
      label: "Value: Low",
      onClick: () => sortByLowestValue(),
      icon: (
        <ArrowUpNarrowWide
          size={20}
          className="text-zinc-700 dark:text-white"
        />
      ),
    },
    {
      label: "Meal: A–Z",
      onClick: () => sortByMealAZ(),
      icon: <ArrowDownAZ size={20} className="text-zinc-700 dark:text-white" />,
    },
    {
      label: "Meal: Z–A",
      onClick: () => sortByMealZA(),
      icon: <ArrowUpZA size={20} className="text-zinc-700 dark:text-white" />,
    },
  ];
  return { filterItems, sortItems };
};
