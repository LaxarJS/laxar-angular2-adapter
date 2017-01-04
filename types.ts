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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxAssets extends Function {
   // NEEDS FIX A: How to document the function nature of this class?

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxConfiguration {
   get( key: string, fallback?: any ): any {}
   ensure( key: string ): any {}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxContext {
   public eventBus: AxEventBus;
   public features: AxFeatures;
   public id: Function;
   public log: AxLog;
   public widget: Object;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxControls {
   load( controlRef: string ): Promise< any > {
      return Promise.resolve();
   }
   provide( controlRef: string ): any {}
}

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

export class AxEventMeta {
   public cycleId: string;
}

export class AxWidgetServices {
   axEventBus: AxEventBus
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxFeatures {

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxFlowService {
   constructAbsoluteUrl( targetOrPlace: string, parameters?: Object ): string {
      return '';
   }
}

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxHeartbeat {
   registerHeartbeatListener( listener: Function ): Function {
      return  () => {};
   }
   onNext( func: Function ): void {}
   onBeforeNext( func: Function ): void {}
   onAfterNext( func: Function ): void {}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxI18n extends AxI18nHandler {
   forFeature( featurePath: string ): AxI18nHandler {
      return null;
   }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AxId = ( localId: string ) => string;

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxStorage {
   public local: StorageApi;
   public session: StorageApi;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxTooling {
   public pages: any;
}

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export class AxGlobalLog extends AxLog {}
export class AxGlobalEventBus extends AxEventBus {}
