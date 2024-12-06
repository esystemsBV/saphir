import { def } from "@/data/Links";
import axios from "axios";
import { useEffect, useState } from "react";

interface fetchDataProps {
  url: string;
}

function FetchTableURL({ url }: fetchDataProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[] | any>([]);
  const [error, setError] = useState<boolean>(false);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  const refresh = () => setRefreshFlag((prev) => !prev);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${def}${url}`);

        setData(response.data.data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [refreshFlag]);

  return { loading, data, error, refresh };
}

export default FetchTableURL;
