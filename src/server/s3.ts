
import { IncomingMessage, ServerResponse } from "http"

import { S3Object } from "./types"

import { S3Client, GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3"

import { getEnviron } from "./utils"

import { notFound } from "./errors"

import { handleHttpResponse } from "./http"

import { Readable } from "stream"

import settings from "../settings.json"

const credentials = {
    accessKeyId: getEnviron("STORAGE_ACCESS"),
    secretAccessKey: getEnviron("STORAGE_SECRET")
}

const s3Config = {
    endpoint: getEnviron("STORAGE_URL"),
    region: getEnviron("STORAGE_REGION"),
    credentials
}

export const createS3Client: ()=> S3Client = (): S3Client=> new S3Client(s3Config)


export const parseBucketFromURI = (uri: string): string => {
    const splited = uri.split("/")
    return (splited.length < 1) && "" || splited[1]
}

export const parseObjectKeyFromURI = (uri: string): string => {
    const uriAry = uri.split("/")
    if (uriAry.length < 2) return ""
    var Key = ""
    for (let i = 2; i <= uriAry.length; i++) {
        if (uriAry[i]) 
            Key += uriAry[i]
            if (i === (uriAry.length - 1))
                break
            Key += "/"
    }
    return Key
}

export const defaultObjectResolver = (uri: string): S3Object=> ({
    Bucket: parseBucketFromURI(uri),
    Key: parseObjectKeyFromURI(uri)
})


const contentLengthCaculator = (contentRange: string): number => {
    const splited: Array<string> = contentRange.split(" ")
    if (splited.length === 2) {
        const bytesRange = splited[1].split("/")[0].split("-").map(v=> parseInt(v))
        if (bytesRange.length === 2) {
            return bytesRange[1] - bytesRange[0]
        }
    }
    return 0
}


export const handleS3ObjectPipe = async (s3object: S3Object, request: IncomingMessage, response: ServerResponse): Promise<void> => {

    const range = request.headers.range

    const pauseable = settings.download.pauseable

    if (pauseable) {
        if (range) {
            s3object.Range = range
        } else {
            s3object.Range = 'bytes 0-'
        }
    } else {
        s3object.Range = 'bytes 0-'
    }

    const objectGetResponse: GetObjectCommandOutput = await createS3Client().send(new GetObjectCommand(s3object)).catch(r=>r)

    if (objectGetResponse.$metadata.httpStatusCode && objectGetResponse.$metadata.httpStatusCode !== 200 && objectGetResponse.$metadata.httpStatusCode !== 206) {
        notFound(response)
        return
    }

    await handleHttpResponse(response, async (res: ServerResponse)=> {

        if (objectGetResponse.ContentType) {
            res.setHeader("Content-Type", objectGetResponse.ContentType)
        }
    
        if (objectGetResponse.ETag) {
            res.setHeader("ETag", objectGetResponse.ETag)
        }
    
        if (objectGetResponse.ContentRange) {

            res.setHeader("Content-Range", objectGetResponse.ContentRange)
    
            if (pauseable) {
                const contentLength = contentLengthCaculator(objectGetResponse.ContentRange)
                if (contentLength) {
                    res.setHeader("Content-Length", contentLength)
                } else if (objectGetResponse.ContentLength) {
                    res.setHeader("Content-Length", objectGetResponse.ContentLength)
                }
                res.writeHead(206)
            } else {
                if (objectGetResponse.ContentLength) {
                    res.setHeader("Content-Length", objectGetResponse.ContentLength)
                }
            }

        }

        const Stream: Readable = objectGetResponse.Body
    
        Stream.pipe(res)
    
        request.on("close", () => Stream.destroy())

    })

}