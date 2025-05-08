import { useReadingStore } from "@/store/useReadingStore";
import { compareAsc, compareDesc, getHours, isToday, isWithinInterval, parseISO, subDays } from "date-fns";

export const useReadingHistoryUtils = () => {
  const { readings, setFilteredReadings, filteredReadings } = useReadingStore()

  const filterFastingReadings = () => {
    const fasting = readings.filter((reading) => reading.mealTiming === "Fasting")
    setFilteredReadings(fasting)
  }

  const filterBeforeMealReadings = () => {
    const beforeMeal = readings.filter((reading) => reading.mealTiming === "Before Meal")
    setFilteredReadings(beforeMeal)
  }

  const filterAfterMealReadings = () => {
    const AfterMeal = readings.filter((reading) => reading.mealTiming === "After Meal")
    setFilteredReadings(AfterMeal)
  }

  const filterCustomMealReadings = () => {
    const customMeal = readings.filter((reading) => typeof reading.mealTiming !== "string")
    setFilteredReadings(customMeal)
  }

  const filterTodayReadings = () => {
    const today = readings.filter((reading) => isToday(new Date(reading.timestamp)))
    setFilteredReadings(today)
  }

  const filterLast7DayReadings = () => {
    const now = new Date();
    const lastSevenDays = subDays(now, 7);
    const result = readings.filter((reading) => isWithinInterval((new Date(reading.timestamp)), {
      start: lastSevenDays,
      end: now
    }));
    setFilteredReadings(result)
  }

  const filterLast30DayReadings = () => {
    const now = new Date();
    const lastThirtyDays = subDays(now, 30);
    const result = readings.filter((reading) => isWithinInterval((new Date(reading.timestamp)), {
      start: lastThirtyDays,
      end: now
    }));
    setFilteredReadings(result)
  }

  const filterMorningReadings = () => {
    const result = readings.filter((reading) => {
      const hour = getHours(new Date(reading.timestamp));
      return hour >= 5 && hour < 12;
    });
    setFilteredReadings(result);
  };

  const filterAfternoonReadings = () => {
    const result = readings.filter((reading) => {
      const hour = getHours(new Date(reading.timestamp));
      return hour >= 12 && hour < 17;
    });
    setFilteredReadings(result);
  };

  const filterEveningReadings = () => {
    const result = readings.filter((reading) => {
      const hour = getHours(new Date(reading.timestamp));
      return hour >= 17 && hour < 21;
    });
    setFilteredReadings(result);
  };

  const filterNightReadings = () => {
    const result = readings.filter((reading) => {
      const hour = getHours(new Date(reading.timestamp));
      return hour >= 21 || hour < 5;
    });
    setFilteredReadings(result);
  };

  const sortByNewestDate = () => {
    const result = [...filteredReadings].sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)
      return compareDesc(dateA, dateB)

    })
    setFilteredReadings(result)
  }

  const sortByOldestDate = () => {
    const result = [...filteredReadings].sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)
      return compareAsc(dateA, dateB)
    })
    setFilteredReadings(result)
  }

  const sortByHighestValue = () => {
    const result = [...filteredReadings.sort((a, b) => b.value - a.value)]
    setFilteredReadings(result)
  }

  const sortByLowestValue = () => {
    const result = [...filteredReadings.sort((a, b) => a.value - b.value)]
    setFilteredReadings(result)
  }

  const sortByMealAZ = () => {
    const sorted = [...filteredReadings].sort((a, b) => {
      const aMealTiming = a.mealTiming && typeof a.mealTiming === 'string' ? a.mealTiming : a.mealTiming?.custom ?? '';
      const bMealTiming = b.mealTiming && typeof b.mealTiming === 'string' ? b.mealTiming : b.mealTiming?.custom ?? '';

      return aMealTiming.localeCompare(bMealTiming);
    });
    setFilteredReadings(sorted);
  };

  const sortByMealZA = () => {
    const sorted = [...filteredReadings].sort((a, b) => {
      const aMealTiming = a.mealTiming && typeof a.mealTiming === 'string' ? a.mealTiming : a.mealTiming?.custom ?? '';
      const bMealTiming = b.mealTiming && typeof b.mealTiming === 'string' ? b.mealTiming : b.mealTiming?.custom ?? '';

      return bMealTiming.localeCompare(aMealTiming);
    });
    setFilteredReadings(sorted);
  };





  return {
    filterFastingReadings, filterAfterMealReadings, filterBeforeMealReadings, filterCustomMealReadings, filterTodayReadings, filterLast7DayReadings, filterLast30DayReadings, filterMorningReadings,
    filterAfternoonReadings,
    filterEveningReadings,
    filterNightReadings,
    sortByNewestDate,
    sortByOldestDate,
    sortByHighestValue,
    sortByLowestValue,
    sortByMealAZ,
    sortByMealZA
  }
}