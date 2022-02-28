

import { createS3PipeServer } from "./server/server";


const server = createS3PipeServer({
    requestListener: (request, response) => {
        console.log(request, response)
    },
    authenticate: async headers => {
        return true
    },
    resolveObject: url => ({Key: "", Bucket: "" })
})

server.listen()