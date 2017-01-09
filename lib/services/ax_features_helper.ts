/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { object } from 'laxar';
import { Injectable } from '@angular/core';
import { AxContext } from 'laxar-types';

@Injectable()
export class AxFeaturesHelper {

   constructor( private axContext: AxContext ) {}

   get( key: string, fallback?: any ): any {
      return object.path( this.axContext.features, key, fallback );
   }

}
