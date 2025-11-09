// CONSTRUCTS THE URL BASED ON THE PARAMS PASSED IN
export function constructUrl(
  endpoint: string,
  baseUrl: string,
  params?: Record<string, unknown>
): URL {
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url;
}
