import React, { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`/api/${url}`);
      console.log(res.data);
      setData(res.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { data, loading };
};

export default useFetch;
