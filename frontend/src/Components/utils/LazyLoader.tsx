import { Suspense } from "react";

const LazyLoader = ({
  children,
  fallback: FallbackComponent,
}: {
  children: React.ReactNode;
  fallback?: React.ElementType;
}) => {
  return (
    <Suspense fallback={FallbackComponent ? <FallbackComponent /> : null}>
      {children}
    </Suspense>
  );
};

export default LazyLoader;
