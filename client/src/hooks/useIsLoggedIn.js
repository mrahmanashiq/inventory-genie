import { useQuery } from "@tanstack/react-query";
import { isLoggedInApi } from "../apis/auth.apis";

export const useIsLoggedIn = () => {
  return useQuery(["isLoggedIn"], isLoggedInApi, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden) errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      // Only retry once for other errors
      return failureCount < 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes instead of 24 hours
    refetchInterval: false, // Don't auto-refetch
    
    select: (data) => {
      // Handle the new checkAuthStatus response format
      const responseData = data?.data;
      
      if (responseData?.data) {
        // New format from checkAuthStatus endpoint
        return {
          isLoggedIn: responseData.data.isLoggedIn,
          userData: responseData.data.user || {}
        };
      } else {
        // Fallback to old format (if any)
        const isLoggedIn = !!responseData?.data?.user?._id;
        const userData = responseData?.data?.user || {};
        return { isLoggedIn, userData };
      }
    },
    
    // Handle errors gracefully
    onError: (error) => {
      if (error?.response?.status === 401) {
        // User is not authenticated, but this is not an error state
        console.log('User is not authenticated');
      }
    },
    
    // Return default data when query fails due to 401
    useErrorBoundary: false,
  });
};
