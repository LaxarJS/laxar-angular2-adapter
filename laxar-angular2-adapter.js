/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import 'reflect-metadata';
import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

export const technology = 'angular2';

export function bootstrap( { widgets, controls }, { artifactProvider } ) {

   const api = {
      create
   };

   return api;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function create( { widgetName, anchorElement, services } ) {

      const widgetId = services.axContext.widget.id;
      const provider = artifactProvider.forWidget( widgetName );

      let AdapterComponent;
      let AdapterModule;


      return Promise.all( [ provider.descriptor(), provider.module() ] )
         .then( setupWidget, err => { window.console.error( err ); } )
         .then( () => ( {
            domAttachTo,
            domDetach,
            destroy
         } ) );

      function setupWidget( [ descriptor, module ] ) {
         window.console.log( descriptor );
         window.console.log( module );

         const componentName = kebapToCamelcase( descriptor.name );
         const moduleName = `${componentName}Module`;

         AdapterComponent = Component( {
            selector: `#${anchorElement.id}`,
            template: `<${widgetName}></${widgetName}>`
         } )
         .Class( { constructor() {} } );

         AdapterModule = NgModule( {
            imports: [ BrowserModule, module[ moduleName ] ],
            declarations: [ AdapterComponent ],
            bootstrap: [ AdapterComponent ]
         } )
         .Class( { constructor() {} } );
      }

      function domAttachTo( areaElement ) {
         areaElement.appendChild( anchorElement );
         platformBrowserDynamic().bootstrapModule( AdapterModule );
      }

      function domDetach() {
         const parent = anchorElement.parentNode;
         if( parent ) {
            parent.removeChild( anchorElement );
         }
      }

      function destroy() {
         console.log( AdapterComponent._ref );
         console.log( 'destroying ' + widgetId );
anchorElement = null;
      }

      function kebapToCamelcase( str ) {
         const SEGMENTS_MATCHER = /[-]./g;
         return str.charAt( 0 ).toUpperCase() +
            str.substr( 1 ).replace( SEGMENTS_MATCHER, _ => _.charAt( 1 ).toUpperCase() );

      }

   }

}
