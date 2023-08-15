import { createS3PipeServer } from './server/server';
import { IncomingMessage, ServerResponse, IncomingHttpHeaders } from 'http';
import { S3PipeServerCustomHandlers } from './server/interfaces';

const serverConfig: S3PipeServerCustomHandlers = {
  requestListener: (request: IncomingMessage, response: ServerResponse) => {},
  authenticate: async (headers: IncomingHttpHeaders): Promise<boolean> => {
    return true;
  },
};

const server = createS3PipeServer(serverConfig);

// default listen on port 9000
server.listen();
