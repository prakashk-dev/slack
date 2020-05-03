import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

export const useFetch = (url, ...watch) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const watchArray = watch.length ? [...watch] : [];
  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchData() {
      try {
        const { data } = await axios.get(`/api/${url}`);
        data.error ? setError(data.error) : setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, watchArray);
  return [data, loading, error];
};
// have not been used
export const usePost = (url, data) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function postData() {
      try {
        await axios.post(`/api/${url}`, data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    postData();
  }, []);

  return [loading, error];
};
