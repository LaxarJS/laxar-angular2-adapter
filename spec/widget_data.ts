/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { Component, NgModule, OnDestroy } from '@angular/core';
import { AxEventBus } from '../lib/types';


export const descriptor = {
   name: 'some-widget',
   integration: {
      type: 'widget',
      technology: 'angular2'
   },
   features: {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'object',
      properties: {
         myFeature: {
            type: 'object',
            properties: {
               myProp: {
                  type: 'string',
                  'default': 'x'
               }
            }
         }
      }
   }
};

export const widgetSpies = {
   constructor: jasmine.createSpy( 'widget.constructor' ),
   ngOnDestroy: jasmine.createSpy( 'widget.onDestroy' )
}

@Component( {
   templateUrl: 'ax-widget:template:some-widget'
} )
class SomeWidget implements OnDestroy {
   constructor( eventBus: AxEventBus ) {
      widgetSpies.constructor( eventBus );
   }


   ngOnDestroy(): void {
      widgetSpies.ngOnDestroy();
   }
}

@NgModule( {
   declarations: [ SomeWidget ]
} )
class SomeWidgetModule {}

export const module = { SomeWidget, SomeWidgetModule };

export const configuration = {
   area: 'contentArea',
   widget: 'some-widget',
   id: 'myWidget',
   features: {
      myFeature: {}
   }
};
