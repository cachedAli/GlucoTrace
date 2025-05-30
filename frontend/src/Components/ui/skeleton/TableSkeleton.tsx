import { TableCell, TableRow } from "@mui/material";
import Skeleton from "react-loading-skeleton";

import { useThemeStore } from "@/store/useThemeStore";

const TableSkeleton = () => {
  const darkMode = useThemeStore((state) => state.darkMode);
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton
                height={20}
                width={30}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                height={20}
                width={100}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                height={20}
                width={80}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                height={20}
                width={60}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                height={20}
                width={90}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                height={20}
                width={120}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                height={20}
                width={100}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
            <TableCell>
              <Skeleton
                height={20}
                width={80}
                baseColor={darkMode ? "#4b5563" : "#e0e0e0"}
                highlightColor={darkMode ? "#6b7280" : "#f5f5f5"}
              />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default TableSkeleton;
