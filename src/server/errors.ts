import { ServerResponse } from "http"
import { httpErrorTemplate } from "./http"


export const unAuthorizedError = (response: ServerResponse): void => {
    response.writeHead(403)
    response.write(httpErrorTemplate("<center><h1>403 Unauthorized User</h1></center>", "Permission Denied" ))
    response.end()
}


export const notFound = (response: ServerResponse): void => {
    response.writeHead(404)
    response.write(httpErrorTemplate("<center><h1>404 Notfound</h1></center>", "404 Notfound" ))
    response.end()
}


export const badRequest = (response: ServerResponse): void => {
    response.writeHead(400)
    response.write(httpErrorTemplate("<center><h1>400 Bad Request</h1></center>", "400 Bad Request" ))
    response.end()
}