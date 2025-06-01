import React, { useRef, useState } from "react";
import clsx from "clsx";

import { ArrowDownUp, ListFilter, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { readingHistory } from "@/libs/constants/dashboard/readingHistory";
import { useDashboardStore } from "@/store/useDashboardStore";
import Dropdown from "@/components_temp/ui/dashboard/Dropdown";
import { useReadingStore } from "@/store/useReadingStore";
import Button from "@/components_temp/ui/common/Button";

const ActionButtons = () => {
  return (
    <div
      className={clsx(
        "w-full flex justify-end items-center gap-6 mt-3",
        "max-sm:justify-center max-sm:flex-col max-sm:gap-4"
      )}
    >
      <ResetButton />
      <div className={clsx("flex w-full gap-6", "sm:justify-end")}>
        {/* Sort By */}
        <SortByButton />

        {/* Filter Mobile*/}
        <MobileFilterButton />
      </div>

      {/* Add */}
      <AddButton />

      {/* Filter */}
      <FilterButton />
    </div>
  );
};

export default ActionButtons;

const SortByButton = () => {
  const [isSort, setIsSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const { sortItems } = readingHistory();

  const { selectedSortOption, setSelectedSortOption } = useDashboardStore();
  return (
    <div
      ref={sortRef}
      className={clsx(
        "relative flex flex-col items-center justify-center",
        " max-sm:w-1/2"
      )}
    >
      <Button
        className="w-32 max-sm:w-full"
        onClick={() => setIsSort((prev) => !prev)}
      >
        <ArrowDownUp size={20} />
        Sort By
      </Button>

      {isSort && (
        <Dropdown
          items={sortItems}
          direction="left"
          ref={sortRef}
          value={isSort}
          setValue={setIsSort}
          onSelect={setSelectedSortOption}
          selectedItem={selectedSortOption}
        />
      )}
    </div>
  );
};

const FilterButton = () => {
  const [isFilter, setIsFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { filterItems } = readingHistory();
  const { selectedFilterOption, setSelectedFilterOption } = useDashboardStore();
  return (
    <div
      ref={filterRef}
      className={clsx(
        "relative flex flex-col items-center justify-center ",
        "sm:order-3 max-sm:w-1/2 max-sm:hidden"
      )}
      onClick={() => setIsFilter((prev) => !prev)}
    >
      <Button className="w-32 max-sm:w-full">
        <ListFilter size={20} />
        Filter
      </Button>

      {isFilter && (
        <Dropdown
          items={filterItems}
          ref={filterRef}
          value={isFilter}
          setValue={setIsFilter}
          onSelect={setSelectedFilterOption}
          selectedItem={selectedFilterOption}
        />
      )}
    </div>
  );
};

const MobileFilterButton = () => {
  const [isMobileFilter, setIsMobileFilter] = useState(false);
  const mobileFilterRef = useRef<HTMLDivElement>(null);
  const { filterItems } = readingHistory();

  const { selectedFilterOption, setSelectedFilterOption } = useDashboardStore();
  return (
    <div
      ref={mobileFilterRef}
      className={clsx(
        "relative flex flex-col items-center justify-center",
        "sm:order-3 sm:hidden max-sm:w-1/2"
      )}
      onClick={() => setIsMobileFilter((prev) => !prev)}
    >
      <Button className="w-32 max-sm:w-full">
        <ListFilter size={20} />
        Filter
      </Button>

      {isMobileFilter && (
        <Dropdown
          items={filterItems}
          ref={mobileFilterRef}
          value={isMobileFilter}
          setValue={setIsMobileFilter}
          onSelect={setSelectedFilterOption}
          selectedItem={selectedFilterOption}
        />
      )}
    </div>
  );
};

const AddButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="fill"
      className="w-44 shrink-0 max-sm:w-full"
      onClick={() => navigate("/dashboard/add-reading")}
    >
      <Plus size={20} />
      Add Reading
    </Button>
  );
};

const ResetButton = () => {
  const resetFilteredReadings = useReadingStore(
    (state) => state.resetFilteredReadings
  );
  const { selectedSortOption, selectedFilterOption } = useDashboardStore();
  return (
    <>
      {(selectedSortOption !== undefined ||
        selectedFilterOption !== undefined) && (
        <Button
          variant="fill"
          className="w-full max-w-36 max-sm:max-w-full max-[664px]:min-[640px]:text-xs"
          onClick={resetFilteredReadings}
        >
          <X size={20} />
          Reset All
        </Button>
      )}
    </>
  );
};
