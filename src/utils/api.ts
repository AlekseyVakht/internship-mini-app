import { sleep } from "./sleep";
import axios from "axios";

type Api = {
  signal?: AbortSignal;
  name?: string;
  url: string;
};

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
