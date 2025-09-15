export const jsonParser = (key) => {
  if (key && typeof key === "string") {
    try {
      return JSON.parse(key);
    } catch (err) {
      console.error(`Error parsing JSON for key "${key}":`, err);
      return null;
    }
  }
}