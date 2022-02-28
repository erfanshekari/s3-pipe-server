


export type HTTPHeaderValue = string | number | readonly string[]

export type outGoingHTTPHeaders = {
    "Conetnt-Type"?: HTTPHeaderValue
    "Conetnt-Length"?: HTTPHeaderValue
    "Conetnt-Range"?: HTTPHeaderValue
}

export type S3Object = {
    Key: string
    Bucket: string
    Range?: string
}

export type CORSConfig = {
    [key: string]: string
    "Access-Control-Allow-Origin": string
    "Access-Control-Request-Method": string
    "Access-Control-Allow-Methods": string
    "Access-Control-Allow-Headers": string
}