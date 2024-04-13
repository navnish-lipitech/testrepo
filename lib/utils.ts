import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const addDuration = (
  startDate: string,
  durationObject: { years: number; months: number; days: number },
  format = "YYYY-MM-DD"
) => {
  return dayjs(startDate, format)
    .add(durationObject.years, "y")
    .add(durationObject.months, "M")
    .add(durationObject.days, "d")
    .format(format);
};

export const pickObjectValues = (
  values: Record<string, any>,
  keys: string[]
) => {
  return Object.keys(values).reduce((acc, curr) => {
    if (keys.includes(curr)) {
      acc[curr] = values[curr];
    }

    return acc;
  }, {} as Record<string, any>);
};

export const capitalizeFirstLetter = (value: string) => {
  const [firstLetter, ...rest] = value.split("");
  return `${firstLetter.toUpperCase()}${rest.join("")}`;
};

export const isObject = (item: any): boolean =>
  item && typeof item === "object" && !Array.isArray(item);

export const compareObjects = (
  baseObj: AnyObject,
  obj2: AnyObject
): AnyObject => {
  const differences: AnyObject = {};

  for (const key in baseObj) {
    if (baseObj.hasOwnProperty(key)) {
      if (obj2.hasOwnProperty(key)) {
        if (isObject(baseObj[key]) && isObject(obj2[key])) {
          const nestedDifferences = compareObjects(baseObj[key], obj2[key]);
          if (Object.keys(nestedDifferences).length > 0) {
            differences[key] = nestedDifferences;
          }
        } else if (Array.isArray(baseObj[key]) && Array.isArray(obj2[key])) {
          const arrayDifferences = compareArrays(baseObj[key], obj2[key]);
          if (arrayDifferences.length > 0) {
            differences[key] = arrayDifferences;
          }
        } else if (baseObj[key] !== obj2[key]) {
          differences[key] = baseObj[key];
        }
      }
    }
  }

  return differences;
};

export const compareArrays = (arr1: any[], arr2: any[]): any[] => {
  const differences: any[] = [];

  for (let i = 0; i < arr1.length || i < arr2.length; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];

    if (i >= arr1.length || i >= arr2.length) {
      // Exclude items that don't exist in both arrays
      continue;
    }

    const itemDifferences = getObjectDifferences(item1, item2);
    if (Object.keys(itemDifferences).length > 0) {
      differences.push(itemDifferences);
    }
  }

  return differences;
};

interface AnyObject {
  [key: string]: any;
}

export const getObjectDifferences = (
  obj1: AnyObject,
  obj2: AnyObject
): AnyObject => {
  const differences: AnyObject = {};

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (obj2.hasOwnProperty(key)) {
        if (isObject(obj1[key]) && isObject(obj2[key])) {
          const nestedDifferences = getObjectDifferences(obj1[key], obj2[key]);
          if (Object.keys(nestedDifferences).length > 0) {
            differences[key] = nestedDifferences;
          }
        } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
          const arrayDifferences = compareArrays(obj1[key], obj2[key]);
          if (arrayDifferences.length > 0) {
            differences[key] = arrayDifferences;
          }
        } else if (obj1[key] !== obj2[key]) {
          differences[key] = obj1[key];
        }
      }
    }
  }

  return differences;
};
export const createParams = (
  params: Record<string, string | string[] | undefined>
) => {
  const urlParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (!value) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((value) => {
        urlParams.append(key, value);
      });
    } else {
      urlParams.append(key, value);
    }
  });

  return urlParams;
};