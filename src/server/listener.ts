import {
    RequestListener, 
    IncomingMessage, 
    ServerResponse } from "http"
import { 
    S3PipeServerCustomHandlers,
    S3PipeServerRequestListenerInterface } from "./interfaces"

import { unAuthorizedError, badRequest, notFound } from "./errors"

import { handleHttpResponse } from "./http"

import { uriIsNotNaN, bucketIsRegistered } from "./utils"

import { S3Object } from "./types"

import { defaultObjectResolver, handleS3ObjectPipe } from "./s3"

import settings from "../settings.json"


const handleHttpOptionsMethod = async (response: ServerResponse): Promise<void> => await handleHttpResponse(response, async res=> {
    res.writeHead(200, {
        "Allow": "OPTIONS, GET"
    })
    res.end()
    return
})

const listenerHandler = async (request: IncomingMessage, response: ServerResponse, customHandler : S3PipeServerCustomHandlers): Promise<any> => {
    
    const { authenticate ,resolveObject }: S3PipeServerCustomHandlers = customHandler
     
    if (authenticate) {
        if (!(await authenticate(request.headers))) {
            unAuthorizedError(response)
            return
        }
    }

    const { method, url } = request

    const uri:string = url || ""

    if (method !== "OPTIONS" && method !== "GET") {
        badRequest(response)
        return
    }

    if (method === 'OPTIONS') {
        await handleHttpOptionsMethod(response)
        return
    }

    if (method === 'GET') {

        if (!uriIsNotNaN(uri)) {
            notFound(response)
            return
        }
        
        var s3Object: S3Object
        if (resolveObject) {
            s3Object = resolveObject(uri)
        } else {

            s3Object = defaultObjectResolver(uri)

            if (!settings.buckets["allow-any"]) {
                if (!bucketIsRegistered(s3Object.Bucket)) {
                    notFound(response)
                    return
                }
            }

        }

        if (!s3Object.Bucket || !s3Object.Key) {
            notFound(response)
            return
        }

        await handleS3ObjectPipe(s3Object, request, response)
    }
}



export class S3PipeServerRequestListener implements S3PipeServerRequestListenerInterface {

    customHandlers: S3PipeServerCustomHandlers | undefined

    constructor(customHandlers?: S3PipeServerCustomHandlers | undefined) {
        this.customHandlers = customHandlers
    }

    createHandler(): RequestListener {
        return (request: IncomingMessage, response: ServerResponse) => {

            if (this.customHandlers?.requestListener) {
                this.customHandlers.requestListener(request, response)
            }


            listenerHandler(request, response, this.customHandlers || {})
            .catch(e => {
                console.log(e)
            })

        }
    }

}