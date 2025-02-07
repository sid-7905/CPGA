import { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const shouldFetchData = (key, hours = 3) => {
  const storedData = getFromLocalStorage(key);
  if (!storedData || !storedData.timestamp) return true;
  const now = new Date().getTime();
  const elapsedHours = (now - storedData.timestamp) / (1000 * 60 * 60);
  return elapsedHours - hours;
};

function useFetchWithLocalStorage(
  key,
  fetchFunction,
  setData,
  setError,
  specialRefresh = false
) {
  let { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!id) {
    // Since the home page doesn't have id in URL
    id = user.id;
  }

  const fetchData = useCallback(
    async (specialRefresh, hour= 0) => {
      try {
        let hours = 3; // Default to 3 hours
        if (specialRefresh) hours = hour;
        let timeToFetch = shouldFetchData(key, hours);

        // For special refresh, handle time check first
        if (specialRefresh && timeToFetch < 0) {
            return parseInt(parseFloat(timeToFetch) * 60); // Return the time to wait for special refresh in minutes
        }

        if (id !== user.id || timeToFetch >= 0) {
          // Fetch new data
          try {
            const data = await fetchFunction(key, token, id);
            
            if (!data) {
              throw new Error('No data received from server');
            }

            if (id === user.id) {
              setToLocalStorage(key, { data, timestamp: new Date().getTime() });
            }
            setData(data);
            
            if (specialRefresh) {
              return parseInt(parseFloat(timeToFetch) * 60);
            }
          } catch (fetchError) {
            if (fetchError.response) {
              throw new Error(fetchError.response.data?.message || 'Server error occurred');
            } else if (fetchError.request) {
              throw new Error('No response from server');
            } else {
              throw new Error(fetchError.message || 'Failed to fetch data');
            }
          }
        } else {
          try {
            const cachedData = getFromLocalStorage(key);
            if (!cachedData || !cachedData.data) {
              throw new Error('Cache is invalid or empty');
            }
            setData(cachedData.data);
            if (specialRefresh) return parseInt(parseFloat(timeToFetch) * 60);
          } catch (cacheError) {
            console.error('Cache error:', cacheError);
            const data = await fetchFunction(key, token, id);
            setData(data);
            setToLocalStorage(key, { data, timestamp: new Date().getTime() });
          }
        }
      } catch (error) {
        console.error(`Error in fetchData for ${key}:`, error);
        
        if (error.message.includes('Cache is invalid')) {
          localStorage.removeItem(key);
        }

        // For special refresh, propagate error for toast
        if (specialRefresh) {
          throw error;
        } else {
          // For normal fetch, set error state if you have one
          setData(null);
          // Optionally set some error state
          setError(error.message);
        }
      }
    },
    [key, fetchFunction, id, setData, token, user.id, specialRefresh]
  );

  useEffect(() => {
    // Handle initial fetch errors
    fetchData().catch(error => {
      console.error('Initial fetch failed:', error);
      // Optionally set some error state
      setError(error.message);
    });
  }, [fetchData]);

  return fetchData; // Return the fetchData function
}

export default useFetchWithLocalStorage;
