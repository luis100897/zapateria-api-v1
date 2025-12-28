function validateFormData(data) {
  if (Object.keys(data).length === 0) {
    return false;
  }

  for (const key in data) {
    //buena práctica usar hasOwnPropert` para evitar herencia de propiedades
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (
        value === null ||
        typeof value === "undefined" ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return false;
      }
    }
  }
  return true;
}
export default validateFormData;
