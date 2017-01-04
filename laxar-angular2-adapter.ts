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
   Component,
   ComponentRef,
   ComponentFactoryResolver,
   EmbeddedViewRef,
   Injector,
   NgModule,
   NgZone,
   ViewChild,
   ViewContainerRef
} from '@angular/core';
import { AxEventBus } from 'laxar/types';

const typesMap = new Map< any, string >();
typesMap.set( AxEventBus, AxEventBus.name.toLowerCase() );
console.log( typesMap );
let adapterCounter = 0;

export const technology = 'angular2';

export function bootstrap( { widgets, controls }, { artifactProvider, heartbeat }, applicationElement ) {

   // Implementation of this adapter is heavily inspired by these:
   // - https://github.com/angular/angular/issues/9293#issuecomment-261329089
   // - https://github.com/angular/material2/blob/master/src/lib/core/portal/dom-portal-host.ts

   const api = {
      create
   };

   const adapterAttribute = `data-ax-angular2-${adapterCounter++}`;
   const adapterRootElement = document.createElement( 'DIV' );
   adapterRootElement.setAttribute( adapterAttribute, '' );
   adapterRootElement.style.display = 'none';
   document.body.appendChild( adapterRootElement );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   class WidgetInjector implements Injector {

      constructor( private parentInjector: Injector, private widgetServices: any) {};

      get( token: any, notFoundValue?: any ): any {
         if( token === AxEventBus ) {
            return this.widgetServices.axEventBus;
         }
         return this.parentInjector.get( token, notFoundValue );
      }

   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   @Component( {
      selector: `[${adapterAttribute}]`,
      template: `<div #viewContainer></div>`
   } )
   class AppRootComponent {

      @ViewChild('viewContainer', { read: ViewContainerRef })
      private viewContainerRef: ViewContainerRef;

      constructor(
         private resolver: ComponentFactoryResolver,
         private applicationRef: ApplicationRef,
         private rootInjector: Injector,
         private ngZone: NgZone
      ) {
         heartbeat.registerHeartbeatListener( () => { this.applicationRef.tick(); } );
      }

      registerWidgetComponent( component: any, widgetServices: any ): ComponentRef< any > {
         let componentRef;
         this.ngZone.run( () => {
            const injector = new WidgetInjector( this.rootInjector, widgetServices );
            const factory = this.resolver.resolveComponentFactory( component );
            componentRef = factory.create( injector );

            this.applicationRef.attachView(componentRef.hostView);
            componentRef.onDestroy( () => { this.applicationRef.detachView(componentRef.hostView); } );
         } );
         return componentRef;
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
   class AppRootModule {

      constructor( private appRef: ApplicationRef ) {}

      rootComponent(): AppRootComponent {
         return this.appRef.components[0].instance;
      }

   }

   const bootstrapPromise = platformBrowserDynamic().bootstrapModule( AppRootModule );

   return api;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function create( { widgetName, anchorElement, services } ) {

      const widgetId = services.axContext.widget.id;
      const provider = artifactProvider.forWidget( widgetName );

      let componentRef;

      return Promise.all( [ bootstrapPromise, provider.descriptor(), provider.module() ] )
         .then( setupWidget, err => { window.console.error( err ); } )
         .then( () => ( {
            domAttachTo,
            domDetach,
            destroy
         } ) );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function setupWidget( [ rootModuleInjector, descriptor, module ] ) {
         const componentName = kebapToCamelcase( descriptor.name );
         componentRef = rootModuleInjector.instance.rootComponent()
            .registerWidgetComponent( module[ componentName ], services );
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
