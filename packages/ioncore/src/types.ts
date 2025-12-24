import { Request as ExpressRequest } from 'express';
import { IonCoreContext } from './server/index.js';

export interface IonCoreRequest extends ExpressRequest {
  ioncore: IonCoreContext;
}
