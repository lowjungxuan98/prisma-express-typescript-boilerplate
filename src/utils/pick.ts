const pick = (obj: object, keys: string[]) => {
  return keys.reduce<{ [key: string]: unknown }>((finalObj, key) => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof typeof obj];
      if (typeof value === 'string') {
        const lowerValue = (value as string).toLowerCase();
        if (lowerValue === 'true') {
          finalObj[key] = true;
        } else if (lowerValue === 'false') {
          finalObj[key] = false;
        } else {
          const numValue = Number(value);
          finalObj[key] = !isNaN(numValue) && value !== '' ? numValue : value;
        }
      } else {
        finalObj[key] = value;
      }
    }
    return finalObj;
  }, {});
};

export default pick;
