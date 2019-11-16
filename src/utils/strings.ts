export function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// @see https://gist.github.com/gordonbrander/2230317
export function generateRandomId() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

export function parseQuery(queryString: string): Record<string, string> {
  const pairs = (queryString[0] === "?"
    ? queryString.substr(1)
    : queryString
  ).split("&");
  return pairs.reduce(
    (prev, pair) => {
      const [name, value] = pair.split("=");
      return {
        ...prev,
        [decodeURIComponent(name)]: decodeURIComponent(value || "")
      };
    },
    {} as Record<string, string>
  );
}
