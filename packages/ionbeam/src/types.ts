import { Request as ExpressRequest } from 'express';
import { IonBeam } from './server/index.js';

export interface IonBeamRequest extends ExpressRequest {
  ionbeam: IonBeam;
}
