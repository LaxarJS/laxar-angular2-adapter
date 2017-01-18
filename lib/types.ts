/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */

/*
 * This file defines all Services and APIs provided by these services as Typescript classes.
 * A widget then may include this file and use the defined types for dependency injection.
 */
import { ReflectiveInjector, ResolvedReflectiveProvider } from '@angular/core';

class ServiceRegistry {

   private types = [];
   private names = [];

   set( type: any, name: string ): void {
      this.types.push( type );
      this.names.push( name );
   }

   providers( widgetServices: any ): ResolvedReflectiveProvider[] {
      return ReflectiveInjector.resolve( this.types.map( ( type, index ) => ({
         provide: type,
         useFactory: () => widgetServices[ this.names[ index ] ]
      }) ) );
   }
};
const serviceRegistry = new ServiceRegistry();
export const providersForServices = _ => serviceRegistry.providers( _ );

export class StorageApi {
   getItem( key: string ): any {}
   setItem( key: string, value: any ): void {}
   removeItem( key: string ): void {}
};
export class AxI18nHandler {
   localize( value: any, fallbackValue?: any, languageTag?: string ): any {}
   update( languageTag: string ): Promise< any > {
      return Promise.resolve();
   }
   languageTag(): string {
      return '';
   }
   track( enabled?: boolean, property?: string ): void {}
   format( i18nValue: string, indexedReplacements?: any[], namedReplacements?: Object ): string {
      return '';
   }
   whenLocaleChanged( callback: Function ): void {}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxAreaHelper {
   fullName( localAreaName: string ): string {
      return '';
   }
   localName( fullAreaName: string ): string {
      return '';
   }
   register( localAreaName: string, element: HTMLElement ): void {}
}
serviceRegistry.set( AxAreaHelper, 'axAreaHelper' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxAssets extends Function {
   url( name: string ): Promise<string> {
      return Promise.resolve( '' );
   }
   forTheme( name: string ): Promise<string> {
      return Promise.resolve( '' );
   }
   urlForTheme( name: string ): Promise<string> {
      return Promise.resolve( '' );
   }
}
serviceRegistry.set( AxAssets, 'axAssets' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxConfiguration {
   get( key: string, fallback?: any ): any {}
   ensure( key: string ): any {}
}
serviceRegistry.set( AxConfiguration, 'axConfiguration' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxContext {
   public eventBus: AxEventBus;
   public features: any;
   public id: Function;
   public log: AxLog;
   public widget: Object;
}
serviceRegistry.set( AxContext, 'axContext' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxControls {
   load( controlRef: string ): Promise< any > {
      return Promise.resolve();
   }
   provide( controlRef: string ): any {}
}
serviceRegistry.set( AxControls, 'axControls' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxEventBus {
   subscribe( subject: string, callback: (event: any, meta: AxEventMeta) => void ): ()=>void {
      return () => {};
   }
   publish( event: {}, options?: {} ): Promise<void> {
      return Promise.resolve();
   }
   publishAndGatherReplies( event: {}, options?: {}) : Promise<Array<any>> {
      return Promise.resolve( [] );
   }
   addInspector( inspector: (any) => void ) {
   }
}
serviceRegistry.set( AxEventBus, 'axEventBus' );

export class AxEventMeta {
   public cycleId: string;
}

export class AxWidgetServices {
   axEventBus: AxEventBus
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxFlowService {
   constructAbsoluteUrl( targetOrPlace: string, parameters?: Object ): string {
      return '';
   }
}
serviceRegistry.set( AxFlowService, 'axFlowService' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxGlobalStorage {
   getLocalStorage( namespace: string ): StorageApi {
      return null;
   }
   getSessionStorage( namespace: string ): StorageApi {
      return null;
   }
   getApplicationLocalStorage(): StorageApi {
      return null;
   }
   getApplicationSessionStorage(): StorageApi {
      return null;
   }
}
serviceRegistry.set( AxGlobalStorage, 'axGlobalStorage' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxHeartbeat {
   registerHeartbeatListener( listener: Function ): Function {
      return  () => {};
   }
   onNext( func: Function ): void {}
   onBeforeNext( func: Function ): void {}
   onAfterNext( func: Function ): void {}
}
serviceRegistry.set( AxHeartbeat, 'axHeartbeat' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxI18n extends AxI18nHandler {
   forFeature( featurePath: string ): AxI18nHandler {
      return null;
   }
}
serviceRegistry.set( AxI18n, 'axI18n' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxId {}
serviceRegistry.set( AxId, 'axId' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxLog {
   log( level: number, message: string, ...replacements: any[] ): void {}
   trace( message: string, ...replacements: any[] ): void {}
   debug( message: string, ...replacements: any[] ): void {}
   info( message: string, ...replacements: any[] ): void {}
   warn( message: string, ...replacements: any[] ): void {}
   error( message: string, ...replacements: any[] ): void {}
   fatal( message: string, ...replacements: any[] ): void {}
   addLogChannel( channel: Function ): void {}
   removeLogChannel( channel: Function ): void {}
   addTag( tag: string, value: string ): void {}
   setTag( tag: string, value: string ): void {}
   removeTag( tag: string ): void {}
   gatherTags(): Object {
      return {};
   }
   setLogThreshold( threshold: number|string ): void {}
}
serviceRegistry.set( AxLog, 'axLog' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxStorage {
   public local: StorageApi;
   public session: StorageApi;
}
serviceRegistry.set( AxStorage, 'axStorage' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxTooling {
   public pages: any;
}
serviceRegistry.set( AxTooling, 'axTooling' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxVisibility {
   onShow( callback: Function ): AxVisibility {
      return this;
   }
   onHide( callback: Function ): AxVisibility {
      return this;
   }
   onChange( callback: Function ): AxVisibility {
      return this;
   }
   track( enabled?: boolean, property?: string ): AxVisibility {
      return this;
   }
   updateAreaVisibility( visibilityByLocalArea: Object, options?: Object ): Promise< void > {
      return Promise.resolve();
   }
   updateWidgetVisibility( visible: boolean ): AxVisibility {
      return this;
   }
   unsubscribe( callback: Function ): AxVisibility {
      return this;
   }
}
serviceRegistry.set( AxVisibility, 'axVisibility' );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxGlobalLog extends AxLog {}
serviceRegistry.set( AxGlobalLog, 'axGlobalLog' );
export class AxGlobalEventBus extends AxEventBus {}
serviceRegistry.set( AxGlobalEventBus, 'axGlobalEventBus' );

export { AxFeaturesHelper } from './services/ax_features_helper';
