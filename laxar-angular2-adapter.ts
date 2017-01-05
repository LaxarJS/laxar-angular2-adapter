/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import 'reflect-metadata';
import 'zone.js';
import {
   BrowserModule,
   __platform_browser_private__ as platformBrowserPrivateApi
} from '@angular/platform-browser';
import { ResourceLoader, platformCoreDynamic } from '@angular/compiler';
import {
   ApplicationRef,
   Component,
   ComponentRef,
   ComponentFactoryResolver,
   Injector,
   NgModule,
   NgZone,
   COMPILER_OPTIONS,
   createPlatformFactory,
   Provider
} from '@angular/core';
import { AxEventBus, AxAreaHelper, AxContext } from 'laxar-types';
import { AxWidgetArea } from './lib/directives/widget_area';
import { ThemeAwareResourceLoader } from './lib/theme_aware_resource_loader';
import { WidgetInjector } from './lib/widget_injector';

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

   @Component( {
      selector: `[${adapterAttribute}]`,
      template: `<div></div>`
   } )
   class AppRootComponent {

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
      bootstrap: [ AppRootComponent ],
      providers: [{provide: ResourceLoader, useClass: class L extends ResourceLoader {}}]
   } )
   class AppRootModule {
      constructor( private applicationRef: ApplicationRef ) {}

      rootComponent(): AppRootComponent {
         return this.applicationRef.components[0].instance;
      }
   }

   const bootstrapPromise = createPlatformBrowserDynamic().bootstrapModule( AppRootModule );

   return api;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function create( { widgetName, anchorElement, services } ) {

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

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createPlatformBrowserDynamic() {
      const resourceLoader = new ThemeAwareResourceLoader( artifactProvider );
      const platformProviders: Provider[] = [
         platformBrowserPrivateApi.INTERNAL_BROWSER_PLATFORM_PROVIDERS, {
            provide: COMPILER_OPTIONS,
            useValue: {
               providers: [ { provide: ResourceLoader, useValue: resourceLoader } ]
            },
            multi: true
         },
      ];
      return createPlatformFactory( platformCoreDynamic, 'browserDynamic', platformProviders )();
   }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function kebapToCamelcase( str ) {
   const SEGMENTS_MATCHER = /[-]./g;
   return str.charAt( 0 ).toUpperCase() +
      str.substr( 1 ).replace( SEGMENTS_MATCHER, _ => _.charAt( 1 ).toUpperCase() );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

@NgModule( {
   declarations: [ AxWidgetArea ],
   exports: [ AxWidgetArea ]
} )
export class AxAngularModule {}
