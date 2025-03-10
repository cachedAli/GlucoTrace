import { Suspense } from "react";

const LazyLoader = ({
  children,
  fallback: FallbackComponent,
}: {
  children: React.ReactNode;
  fallback?: React.ElementType;
}) => {
  return (
    <Suspense fallback={FallbackComponent ? <FallbackComponent /> : <div>loading</div>}>
      {children}
    </Suspense>
  );
};

export default LazyLoader;
