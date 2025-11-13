function trimObjectValues(obj) {
  if (obj === null || typeof obj !== "object") {
    return false;
  }

  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      typeof obj[key] === "string"
    ) {
      obj[key] = obj[key].trim();
    }
  }

  return obj;
}
export default trimObjectValues;
