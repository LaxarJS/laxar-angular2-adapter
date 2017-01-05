/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { Injector } from '@angular/core';

export class WidgetInjector implements Injector {

   constructor( private parentInjector: Injector, private widgetServices: any) {};

   get( token: any, notFoundValue?: any ): any {
      if( token && token.name ) {
         const instanceName = token.name.charAt( 0 ).toLowerCase() + token.name.substr( 1 );
         const service = this.widgetServices[ instanceName ];
         if( service ) {
            return service;
         }
      }
      return this.parentInjector.get( token, notFoundValue );
   }

}
