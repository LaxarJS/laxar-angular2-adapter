/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import {
   __platform_browser_dynamic_private__ as platformBrowserDynamicPrivateApi
} from '@angular/platform-browser-dynamic';

const { ResourceLoaderImpl } = platformBrowserDynamicPrivateApi;

export class ThemeAwareResourceLoader extends ResourceLoaderImpl {
   constructor( private artifactProvider: any ) {
      super();
   }
   get( url: string ): Promise< string > {
      console.log( 'ResourceLoader called with url: ' + url );
      if( !url.startsWith( 'ax-widget:' ) ) {
         return super.get( url );
      }

      const [ , type, widgetName ] = url.split( ':' );
      const provider = this.artifactProvider.forWidget( widgetName );
      if( type === 'template' ) {
         return provider.assetForTheme( `${widgetName}.html` );
      }

      throw new Error( `Unsupported asset type ${type}.` );
   }
}
