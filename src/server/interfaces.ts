import { Server, RequestListener, IncomingHttpHeaders } from 'http';
import { ListenOptions } from 'net';
import { S3Object } from './types';

export interface S3PipeServerCustomHandlers {
  port?: number | undefined;
  host?: string | undefined;

  requestListener?: RequestListener;
  authenticate?: (headers: IncomingHttpHeaders) => Promise<boolean>;
  resolveObject?: (uri: string) => S3Object;
}

export interface S3PipeServerInterface {
  port: number | undefined;
  host: string | undefined;
  server?: Server;
  customHandlers: S3PipeServerCustomHandlers | undefined;
  requestListener: S3PipeServerRequestListenerInterface;

  listen(
    options?: ListenOptions,
    listeningListener?: () => void | undefined,
  ): Server;
}

export interface S3PipeServerRequestListenerInterface {
  customHandlers?: S3PipeServerCustomHandlers | undefined;

  createHandler(): RequestListener;
}
