define("~fastboot/app-factory",["ember-guides/app","ember-guides/config/environment"],(function(e,t){return e=e.default,t=t.default,{default:function(){return e.create(t.APP)}}})),define("ember-guides/initializers/ajax",["exports","ember"],(function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var r=t.default.get,o=function(e){var t=r(this,"fastboot.request.protocol")
if(/^\/\//.test(e.url))e.url=t+e.url
else if(!/^https?:\/\//.test(e.url))try{e.url=t+"//"+r(this,"fastboot.request.host")+e.url}catch(o){throw new Error("You are using Ember Data with no host defined in your adapter. This will attempt to use the host of the FastBoot request, which is not configured for the current host of this request. Please set the hostWhitelist property for in your environment.js. FastBoot Error: "+o.message)}if(!najax)throw new Error("najax does not seem to be defined in your app. Did you override it via `addOrOverrideSandboxGlobals` in the fastboot server?")
najax(e)}
e.default={name:"ajax-service",initialize:function(e){e.register("ajax:node",o,{instantiate:!1})}}})),define("ember-guides/initializers/error-handler",["exports","ember"],(function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default={name:"error-handler",initialize:function(){t.default.onerror||(t.default.onerror=function(e){var t="There was an error running your app in fastboot. More info about the error: \n ".concat(e.stack||e)
console.error(t)})}}})),define("ember-guides/instance-initializers/setup-fetch",["exports","fetch"],(function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default={name:"fetch",initialize:function(e){var r=e.lookup("service:fastboot");(0,t.setupFastboot)(r.get("request"))}}}))
