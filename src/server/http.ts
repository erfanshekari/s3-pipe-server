import { ServerResponse } from "http"
import settings from "../settings.json"
import { CORSConfig } from "./types"

export const handleHttpResponse = async (response: ServerResponse, customHandler: (response: ServerResponse)=> Promise<any>) : Promise<any> => {
    
    if (settings["use-cors"]) {
        const corsConfig: CORSConfig = settings["cors-config"]
        for (const key in corsConfig) {
            response.setHeader(key, corsConfig[key])
        }
    }
    response.setHeader("Accept-Ranges", "bytes")
    return await customHandler(response)
}


export const httpErrorTemplate = (body: string, title?: string | undefined): string => {
    return `<html><head><title>${title}</title></head><body>` + body + "</body></html>"
}