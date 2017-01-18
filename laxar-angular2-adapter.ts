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
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ResourceLoader, platformCoreDynamic } from '@angular/compiler';
import {
   COMPILER_OPTIONS,
   ApplicationRef,
   Component,
   ComponentRef,
   ComponentFactoryResolver,
   createPlatformFactory,
   Injector,
   NgModule,
   NgZone,
   Provider,
   ReflectiveInjector,
   Type
} from '@angular/core';
import { ThemeAwareResourceLoader } from './lib/theme_aware_resource_loader';
import { providersForServices } from './lib/types';
import { AxWidgetArea } from './lib/directives/widget_area';
import { AxFeaturesHelper } from './lib/services/ax_features_helper';

// Keeping track of all create adapters of all angular / laxar applications on a page.
// We need this to identify the correct DOM node for widget elements.
let adapterCounter = 0;
// For testing we need a reference to the current platform and are able to destroy it before a new one is
// created.
let currentPlatform = null;

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

      registerWidgetComponent( component: Type<any>, widgetServices: any ): ComponentRef< any > {
         return this.ngZone.run( () => {
            const injector = ReflectiveInjector.fromResolvedProviders(
               [ ...providersForServices( widgetServices ), ...additionalServices() ],
               this.rootInjector
            );
            const factory = this.resolver.resolveComponentFactory( component );
            const componentRef = factory.create( injector );

            this.applicationRef.attachView( componentRef.hostView );
            componentRef.onDestroy( () => { this.applicationRef.detachView( componentRef.hostView ); } );
            return componentRef;

            function additionalServices() {
               return ReflectiveInjector.resolve( [
                  {
                     provide: AxFeaturesHelper,
                     useFactory: () => new AxFeaturesHelper( widgetServices.axContext )
                  }
               ] );
            }
         } );
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
      constructor( private applicationRef: ApplicationRef ) {}

      rootComponent(): AppRootComponent {
         return this.applicationRef.components[0].instance;
      }
   }

   if( currentPlatform ) {
      currentPlatform.destroy();
   }
   currentPlatform = createLaxarPlatform();
   const bootstrapPromise = currentPlatform.bootstrapModule( AppRootModule );

   return api;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function create( { widgetName, anchorElement, services, onBeforeControllerCreation } ) {

      const provider = artifactProvider.forWidget( widgetName );

      return Promise.all( [ bootstrapPromise, provider.module() ] )
         .then( ( [ rootModuleInjector, module ] ) => {
            onBeforeControllerCreation( services );
            const componentName = kebapToCamelcase( widgetName );
            return rootModuleInjector.instance.rootComponent()
               .registerWidgetComponent( module[ componentName ], services );
         }, err => { window.console.error( err ); } )
         .then( componentRef => ( {

            domAttachTo( areaElement: HTMLElement ) {
               // Using cast to any to gain access to internal rootNodes
               const widgetNode = (componentRef as any).hostView.rootNodes[0];

               anchorElement.appendChild( widgetNode );
               areaElement.appendChild( anchorElement );
            },

            domDetach() {
               const parent = anchorElement.parentNode;
               if( parent ) {
                  parent.removeChild( anchorElement );
               }
            },

            destroy() {
               (componentRef as ComponentRef< any >).destroy();
            }

         } ) );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function createLaxarPlatform() {
      const resourceLoader = new ThemeAwareResourceLoader( artifactProvider );
      const platformProviders: Provider[] = [
         ...platformBrowserPrivateApi.INTERNAL_BROWSER_PLATFORM_PROVIDERS, {
            provide: COMPILER_OPTIONS,
            useValue: {
               providers: [ { provide: ResourceLoader, useValue: resourceLoader } ]
            },
            multi: true
         },
      ];
      return createPlatformFactory( platformBrowserDynamic, 'laxarWidgets', platformProviders )();
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
export * from './lib/types';
