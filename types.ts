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

export class AxContext {}

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

export class AxGlobalEventBus extends AxEventBus {
}
