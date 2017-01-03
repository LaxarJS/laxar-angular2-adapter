/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import 'reflect-metadata';
import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import {
   ApplicationRef,
   ChangeDetectorRef,
   Component,
   ComponentFactoryResolver,
   Injector,
   NgModule,
   ViewChild,
   ViewContainerRef
} from '@angular/core';

export class AxEventBus {}

let adapterCounter = 0;

export const technology = 'angular2';

export function bootstrap( { widgets, controls }, { artifactProvider, heartbeat }, applicationElement ) {

   // Implementation of this adapter is heavily inspired by these:
   // - https://github.com/angular/angular/issues/9293#issuecomment-261329089
   // - https://github.com/angular/material2/blob/master/src/lib/core/portal/dom-portal-host.ts

   const api = {
      create
   };

   let appComponent;
   heartbeat.registerHeartbeatListener( () => {
      if( appComponent ) {
         appComponent.changeDetectorRef.detectChanges();
      }
   } );

   const adapterAttribute = `data-ax-angular2-${adapterCounter++}`;
   const adapterRootElement = document.createElement( 'DIV' );
   adapterRootElement.setAttribute( adapterAttribute, '' );
   adapterRootElement.style.display = 'none';
   document.body.appendChild( adapterRootElement );

   @Component( {
      selector: `[${adapterAttribute}]`,
      template: `<div #viewContainer></div>`
   } )
   class AppRootComponent {

      @ViewChild('viewContainer', { read: ViewContainerRef })
      public viewContainerRef: ViewContainerRef;

      constructor(
         public resolver: ComponentFactoryResolver,
         public changeDetectorRef: ChangeDetectorRef,
         public applicationRef: ApplicationRef
      ) {
         appComponent = this;
      }

   }

   const modules = widgets
      .map( widget => widget.module[ kebapToCamelcase( widget.descriptor.name ) + 'Module' ] );
   const components = widgets
      .map( widget => widget.module[ kebapToCamelcase( widget.descriptor.name ) ] );

   @NgModule( {
      imports: [ BrowserModule, ...modules ],
      entryComponents: components,
      declarations: [ AppRootComponent ],
      bootstrap: [ AppRootComponent ]
   } )
   class AppRootModule {}

   platformBrowserDynamic().bootstrapModule( AppRootModule );

   return api;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function create( { widgetName, anchorElement, services } ) {

      const widgetId = services.axContext.widget.id;
      const provider = artifactProvider.forWidget( widgetName );

      let componentRef;

      return Promise.all( [ provider.descriptor(), provider.module() ] )
         .then( setupWidget, err => { window.console.error( err ); } )
         .then( () => ( {
            domAttachTo,
            domDetach,
            destroy
         } ) );

      function setupWidget( [ descriptor, module ] ) {

         const parentInjector = appComponent.viewContainerRef.parentInjector;
         class LocalInjector extends Injector {
            get( token: any, notFoundValue?: any ): any {
               if( token === AxEventBus ) {
                  return services.axEventBus;
               }
               return parentInjector.get( token, notFoundValue );
            }
         }

         const injector = new LocalInjector();
         const componentName = kebapToCamelcase( descriptor.name );
         const factory = appComponent.resolver.resolveComponentFactory( module[ componentName ] );
         componentRef = appComponent.viewContainerRef
            .createComponent( factory, appComponent.viewContainerRef.length, injector );
      }

      function domAttachTo( areaElement ) {
         const widgetNode = componentRef.hostView.rootNodes[0];

         anchorElement.appendChild( widgetNode );
         areaElement.appendChild( anchorElement );
      }

      function domDetach() {
         const parent = anchorElement.parentNode;
         if( parent ) {
            parent.removeChild( anchorElement );
         }
      }

      function destroy() {
         componentRef.destroy();
      }

   }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function kebapToCamelcase( str ) {
   const SEGMENTS_MATCHER = /[-]./g;
   return str.charAt( 0 ).toUpperCase() +
      str.substr( 1 ).replace( SEGMENTS_MATCHER, _ => _.charAt( 1 ).toUpperCase() );
}
