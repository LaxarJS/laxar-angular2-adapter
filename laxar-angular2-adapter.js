"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require("reflect-metadata");
require("zone.js");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
exports.technology = 'angular2';
function bootstrap(_a, _b, applicationElement) {
    var widgets = _a.widgets, controls = _a.controls;
    var artifactProvider = _b.artifactProvider;
    var api = {
        create: create
    };
    var incubatorElement = document.createElement('DIV');
    document.body.appendChild(incubatorElement);
    return api;
    function create(_a) {
        var widgetName = _a.widgetName, anchorElement = _a.anchorElement, services = _a.services;
        var widgetId = services.axContext.widget.id;
        var provider = artifactProvider.forWidget(widgetName);
        var AdapterComponent_;
        var AdapterModule_;
        var component;
        var widgetContainer;
        var changeDetector;
        return Promise.all([provider.descriptor(), provider.module()])
            .then(setupWidget, function (err) { window.console.error(err); })
            .then(function () { return ({
            domAttachTo: domAttachTo,
            domDetach: domDetach,
            destroy: destroy
        }); });
        function setupWidget(_a) {
            var descriptor = _a[0], module = _a[1];
            var componentName = kebapToCamelcase(descriptor.name);
            var moduleName = componentName + "Module";
            var AdapterComponent = (function () {
                function AdapterComponent(resolver, ref) {
                    this.resolver = resolver;
                    changeDetector = ref;
                }
                AdapterComponent.prototype.ngOnInit = function () {
                    widgetContainer = this.widgetContainer;
                    var parentInjector = this.widgetContainer.parentInjector;
                    var LocalInjector = (function (_super) {
                        __extends(LocalInjector, _super);
                        function LocalInjector() {
                            return _super.apply(this, arguments) || this;
                        }
                        LocalInjector.prototype.get = function (token, notFoundValue) {
                            if (token === AxEventBus) {
                                return services.axEventBus;
                            }
                            return parentInjector.get(token, notFoundValue);
                        };
                        return LocalInjector;
                    }(core_1.Injector));
                    var injector = new LocalInjector();
                    var factory = this.resolver.resolveComponentFactory(module[componentName]);
                    component = factory.create(injector);
                    console.log('gefactoried');
                };
                return AdapterComponent;
            }());
            __decorate([
                core_1.ViewChild('widgetContainer', { read: core_1.ViewContainerRef }),
                __metadata("design:type", core_1.ViewContainerRef)
            ], AdapterComponent.prototype, "widgetContainer", void 0);
            AdapterComponent = __decorate([
                core_1.Component({
                    selector: "#" + anchorElement.id,
                    template: "<div #widgetContainer></div>",
                    entryComponents: [module[componentName]]
                }),
                __metadata("design:paramtypes", [core_1.ComponentFactoryResolver, core_1.ChangeDetectorRef])
            ], AdapterComponent);
            AdapterComponent_ = AdapterComponent;
            var AdapterModule = (function () {
                function AdapterModule() {
                }
                return AdapterModule;
            }());
            AdapterModule = __decorate([
                core_1.NgModule({
                    imports: [platform_browser_1.BrowserModule, module[moduleName]],
                    declarations: [AdapterComponent],
                    bootstrap: [AdapterComponent]
                }),
                __metadata("design:paramtypes", [])
            ], AdapterModule);
            AdapterModule_ = AdapterModule;
            incubatorElement.appendChild(anchorElement);
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AdapterModule_);
        }
        function domAttachTo(areaElement) {
            widgetContainer.insert(component.hostView);
            incubatorElement.removeChild(anchorElement);
            areaElement.appendChild(anchorElement);
            changeDetector.detectChanges();
        }
        function domDetach() {
            var parent = anchorElement.parentNode;
            if (parent) {
                parent.removeChild(anchorElement);
            }
        }
        function destroy() {
            console.log('destroying ' + widgetId);
            AdapterComponent_ = null;
        }
        function kebapToCamelcase(str) {
            var SEGMENTS_MATCHER = /[-]./g;
            return str.charAt(0).toUpperCase() +
                str.substr(1).replace(SEGMENTS_MATCHER, function (_) { return _.charAt(1).toUpperCase(); });
        }
    }
}
exports.bootstrap = bootstrap;
var AxEventBus = (function () {
    function AxEventBus() {
    }
    return AxEventBus;
}());
exports.AxEventBus = AxEventBus;
//# sourceMappingURL=laxar-angular2-adapter.js.map