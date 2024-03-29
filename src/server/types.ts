export type HTTPHeaderValue = string | number | readonly string[];

export type outGoingHTTPHeaders = {
  'Content-Type'?: HTTPHeaderValue;
  'Content-Length'?: HTTPHeaderValue;
  'Content-Range'?: HTTPHeaderValue;
  'Accept-Ranges'?: HTTPHeaderValue;
};

export type S3Object = {
  Key: string;
  Bucket: string;
  Range?: string;
};

export type CORSConfig = {
  [key: string]: string;
  'Access-Control-Allow-Origin': string;
  'Access-Control-Request-Method': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
};
