import SphereLoader from "@/components/ui/loader/SphereLoader";
import { Suspense } from "react";

const LazyLoader = ({
  children,
  fallback: FallbackComponent,
}: {
  children: React.ReactNode;
  fallback?: React.ElementType;
}) => {
  return (
    <Suspense fallback={FallbackComponent ? <FallbackComponent /> : <SphereLoader/>}>
      {children}
    </Suspense>
  );
};

export default LazyLoader;
