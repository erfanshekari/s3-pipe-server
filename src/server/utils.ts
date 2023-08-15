export const getEnviron = (name: string): string => {
  if (process?.env[name]) {
    return `${process.env[name]}`;
  }
  return '';
};

export const getEnvironAsArray = (name: string): Array<string> => {
  if (process?.env[name]) {
    const envAry = process.env[name]?.split(',').map((value) => value.trim());
    if (envAry?.length) {
      return envAry;
    }
  }
  return [];
};

export const uriIsNotNaN = (uri: string): boolean => uri.split('/').length >= 1;

export const bucketIsRegistered = (bucket: string): boolean => {
  const allowedBuckets = getEnvironAsArray('STORAGE_BUCKETS');
  if (!allowedBuckets.length) return false;
  for (let i = 0; i < allowedBuckets.length; i++) {
    if (allowedBuckets[i] === bucket) {
      return true;
    }
  }
  return false;
};
