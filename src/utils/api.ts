import { sleep } from "./sleep";
import { Api } from "./interfaces";
import axios from "axios";

export const fetchData = async <T>(api: Api): Promise<T> => {
  await sleep(1000);
  const { signal, name, url } = api;
  const response = await axios.get(url, {
    signal,
    headers: { "Content-Type": "application/json" },
    params: { name },
  });
  return response.data;
};
