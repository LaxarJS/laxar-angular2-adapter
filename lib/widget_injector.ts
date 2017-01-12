/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { Injector } from '@angular/core';

export class WidgetInjector implements Injector {

   constructor(
      private parentInjector: Injector,
      private widgetServices: any,
      private additionalServices: any = {}
   ) {};

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   get( token: any, notFoundValue?: any ): any {
      if( token && token.name ) {
         const instanceName = token.name.charAt( 0 ).toLowerCase() + token.name.substr( 1 );
         const service = this.widgetServices[ instanceName ];
         if( service ) {
            return service;
         }
         if( token.name in this.additionalServices ) {
            return this.additionalServices[ token.name ];
         }
      }
      return this.parentInjector.get( token, notFoundValue );
   }

}
