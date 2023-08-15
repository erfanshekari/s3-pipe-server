import { S3PipeServerInterface } from './interfaces';
import http, { Server } from 'http';
import { ListenOptions } from 'net';
import { S3PipeServerCustomHandlers } from './interfaces';
import { S3PipeServerRequestListener } from './listener';
import settings from '../settings.json';

export class S3PipeServer implements S3PipeServerInterface {
  port: number | undefined;

  host: string;

  server!: Server;

  customHandlers: S3PipeServerCustomHandlers | undefined;

  requestListener: S3PipeServerRequestListener;

  constructor(customHandlers?: S3PipeServerCustomHandlers | undefined) {
    if (customHandlers && customHandlers.port) {
      this.port = customHandlers.port;
    } else {
      this.port = 9000;
    }

    if (customHandlers && customHandlers.host) {
      this.host = customHandlers.host;
    } else {
      this.host = '0.0.0.0';
    }

    this.customHandlers = customHandlers;

    this.requestListener = new S3PipeServerRequestListener(this.customHandlers);

    this.server = http.createServer(this.requestListener.createHandler());

    this.server.setTimeout(settings['request-timeout']);
  }

  listen(
    options?: ListenOptions,
    listeningListener?: () => void | undefined,
  ): Server {
    if (options?.port) {
      this.port = options.port;
    }

    if (options?.host) {
      this.host = options.host;
    }

    var optionsOverwritten = {
      port: this.port,
      host: this.host,
    };

    if (options) {
      optionsOverwritten = { ...options, ...optionsOverwritten };
    }

    return this.server.listen(optionsOverwritten, listeningListener);
  }
}

export const createS3PipeServer = (
  customHandlers?: S3PipeServerCustomHandlers | undefined,
): S3PipeServer => new S3PipeServer(customHandlers);
