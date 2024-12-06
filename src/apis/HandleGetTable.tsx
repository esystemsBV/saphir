import { def } from "@/data/Links";
import { useEffect, useState } from "react";

interface fetchDataProps {
  page: string;
}

function fetchData({ page }: fetchDataProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([]);
  const [error, setError] = useState<boolean>(false);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const refresh = () => setRefreshFlag((prev) => !prev);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${def}/table/fetch/${page}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [refreshFlag]);

  return { loading, data, error, refresh, setLoading };
}

export default fetchData;
