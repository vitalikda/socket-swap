const API_KEY = process.env.NEXT_PUBLIC_SOCKET_API_KEY;
const API_URL =
  process.env.NEXT_PUBLIC_SOCKET_API_URL || "https://api.socket.tech";

if (!API_KEY) {
  throw new Error("Missing Socket API key");
}

type FetchOptions = RequestInit & {
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

export const socketApiClient = async <T>(
  path: string,
  { searchParams, headers, ...options }: FetchOptions = {}
): Promise<T> => {
  const url = new URL(path, API_URL);

  if (searchParams) {
    const params = Object.fromEntries(
      Object.entries(searchParams).filter(
        ([_k, v]) => v !== undefined && v !== null && v !== ""
      )
    ) as Record<string, string>;
    url.search = new URLSearchParams(params).toString();
  }

  console.log(options.method ?? "GET", url.toString());
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "API-KEY": API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};
