/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import 'reflect-metadata';
import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { ChangeDetectorRef,  Component, ComponentFactoryResolver, Injector, NgModule, OpaqueToken, ViewChild, ViewContainerRef } from '@angular/core';

export const technology = 'angular2';

export function bootstrap( { widgets, controls }, { artifactProvider }, applicationElement ) {

   const api = {
      create
   };

   const incubatorElement = document.createElement( 'DIV' );
   document.body.appendChild( incubatorElement );

   return api;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function create( { widgetName, anchorElement, services } ) {

      const widgetId = services.axContext.widget.id;
      const provider = artifactProvider.forWidget( widgetName );

      let AdapterComponent_;
      let AdapterModule_;

      let component;
      let widgetContainer;
      let changeDetector;


      return Promise.all( [ provider.descriptor(), provider.module() ] )
         .then( setupWidget, err => { window.console.error( err ); } )
         .then( () => ( {
            domAttachTo,
            domDetach,
            destroy
         } ) );

      function setupWidget( [ descriptor, module ] ) {
         const componentName = kebapToCamelcase( descriptor.name );
         const moduleName = `${componentName}Module`;

         @Component( {
            selector: `#${anchorElement.id}`,
            template: `<div #widgetContainer></div>`,
            entryComponents: [ module[ componentName ] ]
         } )
         class AdapterComponent {

            @ViewChild('widgetContainer', { read: ViewContainerRef }) widgetContainer: ViewContainerRef;

            constructor(private resolver: ComponentFactoryResolver,ref: ChangeDetectorRef) {
               changeDetector = ref;
            }

            ngOnInit(): void {
               widgetContainer = this.widgetContainer;
               const parentInjector = this.widgetContainer.parentInjector;
               class LocalInjector extends Injector {
                  get( token: any, notFoundValue?: any ): any {
                     if( token === AxEventBus ) {
                        return services.axEventBus;
                     }
                     return parentInjector.get( token, notFoundValue );
                  }
               }
               const injector = new LocalInjector();
               const factory = this.resolver.resolveComponentFactory( module[ componentName ] );
               component = factory.create(injector);
               console.log( 'gefactoried' );
            }
         }
         AdapterComponent_ = AdapterComponent;

         @NgModule( {
            imports: [ BrowserModule, module[ moduleName ] ],
            declarations: [ AdapterComponent ],
            bootstrap: [ AdapterComponent ]
         } )
         class AdapterModule {
            constructor() {}
         }
         AdapterModule_ = AdapterModule;
         incubatorElement.appendChild( anchorElement );
         platformBrowserDynamic().bootstrapModule( AdapterModule_ );
      }

      function domAttachTo( areaElement ) {
         widgetContainer.insert( component.hostView );
         incubatorElement.removeChild( anchorElement );
         areaElement.appendChild( anchorElement );
         changeDetector.detectChanges();
      }

      function domDetach() {
         const parent = anchorElement.parentNode;
         if( parent ) {
            parent.removeChild( anchorElement );
         }
      }

      function destroy() {
         console.log( 'destroying ' + widgetId );
         AdapterComponent_ = null;
      }

      function kebapToCamelcase( str ) {
         const SEGMENTS_MATCHER = /[-]./g;
         return str.charAt( 0 ).toUpperCase() +
            str.substr( 1 ).replace( SEGMENTS_MATCHER, _ => _.charAt( 1 ).toUpperCase() );
      }

   }

}

export class AxEventBus {

}
