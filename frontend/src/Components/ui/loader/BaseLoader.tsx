import { useThemeStore } from "@/store/useThemeStore.js";
import { Loader, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

type BaseLoaderProps = {
  color?: "teal" | "blue";
};
const BaseLoader = ({ color = "teal" }: BaseLoaderProps) => {
  return <Loader color={color === "teal" ? "#7FFFD4" : "#137be2"} />;
};

export default BaseLoader;
