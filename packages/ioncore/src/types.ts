import { Request as ExpressRequest } from 'express';
import { IonCore } from './server/index.js';

export interface IonCoreRequest extends ExpressRequest {
  ionbeam: IonCore;
}
