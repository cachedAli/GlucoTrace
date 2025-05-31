import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Heart, Home, RotateCcw, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import Button from "@/components/ui/common/Button";

interface ErrorPageProps {
  type?: "404" | "500" | "general";
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function ErrorPage({
  type = "404",
  title,
  message,
  showRetry = false,
  onRetry,
}: ErrorPageProps) {
  const getErrorContent = () => {
    switch (type) {
      case "404":
        return {
          title: title || "Page Not Found",
          message:
            message ||
            "We couldn't find the page you're looking for. Don't worry, your health data is safe and secure.",
          illustration: "404",
        };
      case "500":
        return {
          title: title || "Something Went Wrong",
          message:
            message ||
            "We're experiencing some technical difficulties. Your health data remains secure while we fix this.",
          illustration: "500",
        };
      default:
        return {
          title: title || "Oops! Something Happened",
          message:
            message ||
            "We encountered an unexpected issue. Your health tracking continues to be our priority.",
          illustration: "general",
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 flex items-center justify-center p-4 ">
      <div className="w-full max-w-2xl mx-auto">
        <div className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            {/* Health-themed illustration */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                  <Heart
                    className="w-12 h-12 md:w-16 md:h-16 text-blue-600"
                    fill="currentColor"
                  />
                </div>
                {/* Floating pulse animation */}
                <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 bg-blue-200 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            {/* Error code badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              {type.toUpperCase()} Error
            </div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {errorContent.title}
            </h1>

            {/* Supportive message */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
              {errorContent.message}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="fill"
                className="flex items-center justify-center relative"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Dashboard
                <Link to="/dashboard" className="absolute w-full h-full"></Link>
              </Button>

              <Button
                variant="transparent"
                className="flex items-center justify-center relative"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go to Homepage
                <Link to="/" className="absolute w-full h-full"></Link>
              </Button>

              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-lg flex items-center justify-center transition-colors duration-200 font-medium"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 404 Page Component
export function NotFoundPage() {
  return <ErrorPage type="404" />;
}

// Global Error Boundary Component
export function GlobalErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    // Log error to monitoring service
    console.error("Route Error:", error);
  }, [error]);

  const errorType =
    isRouteErrorResponse(error) && error.status === 404 ? "404" : "500";

  return (
    <ErrorPage
      type={errorType}
      title={errorType === "404" ? "Page Not Found" : "Critical Error"}
      message={
        errorType === "404"
          ? "We couldn't find the page you're looking for."
          : "We're experiencing a critical issue. Please try refreshing the page."
      }
      showRetry={errorType !== "404"}
      onRetry={() => window.location.reload()}
    />
  );
}
