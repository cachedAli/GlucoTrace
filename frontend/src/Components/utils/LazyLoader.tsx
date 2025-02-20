import { Suspense } from "react";

const LazyLoader = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default LazyLoader;
