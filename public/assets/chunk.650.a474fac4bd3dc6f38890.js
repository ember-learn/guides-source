/*! For license information please see chunk.650.a474fac4bd3dc6f38890.js.LICENSE.txt */
(self.webpackChunk_ember_auto_import_=self.webpackChunk_ember_auto_import_||[]).push([[650],[,,function(e,t,r){var n,a,o
function i(e){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i(e)}o=function(){"use strict"
function e(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function t(e,t){var r=Object.keys(e)
if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e)
t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function r(r){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{}
n%2?t(Object(a),!0).forEach((function(t){e(r,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(a)):t(Object(a)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(a,e))}))}return r}function n(e,t){if(null==e)return{}
var r,n,a=function(e,t){if(null==e)return{}
var r,n,a={},o=Object.keys(e)
for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r])
return a}(e,t)
if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e)
for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var r=[],n=!0,a=!1,o=void 0
try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{n||null==s.return||s.return()}finally{if(a)throw o}}return r}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function o(e){return function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t]
return r}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function i(e){var t,r="algoliasearch-client-js-".concat(e.key),n=function(){return void 0===t&&(t=e.localStorage||window.localStorage),t},o=function(){return JSON.parse(n().getItem(r)||"{}")},i=function(e){n().setItem(r,JSON.stringify(e))},s=function(){var t=e.timeToLive?1e3*e.timeToLive:null,r=o(),n=Object.fromEntries(Object.entries(r).filter((function(e){return void 0!==a(e,2)[1].timestamp})))
if(i(n),t){var s=Object.fromEntries(Object.entries(n).filter((function(e){var r=a(e,2)[1],n=(new Date).getTime()
return!(r.timestamp+t<n)})))
i(s)}}
return{get:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}}
return Promise.resolve().then((function(){s()
var t=JSON.stringify(e)
return o()[t]})).then((function(e){return Promise.all([e?e.value:t(),void 0!==e])})).then((function(e){var t=a(e,2),n=t[0],o=t[1]
return Promise.all([n,o||r.miss(n)])})).then((function(e){return a(e,1)[0]}))},set:function(e,t){return Promise.resolve().then((function(){var a=o()
return a[JSON.stringify(e)]={timestamp:(new Date).getTime(),value:t},n().setItem(r,JSON.stringify(a)),t}))},delete:function(e){return Promise.resolve().then((function(){var t=o()
delete t[JSON.stringify(e)],n().setItem(r,JSON.stringify(t))}))},clear:function(){return Promise.resolve().then((function(){n().removeItem(r)}))}}}function s(e){var t=o(e.caches),r=t.shift()
return void 0===r?{get:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}}
return t().then((function(e){return Promise.all([e,r.miss(e)])})).then((function(e){return a(e,1)[0]}))},set:function(e,t){return Promise.resolve(t)},delete:function(e){return Promise.resolve()},clear:function(){return Promise.resolve()}}:{get:function(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}}
return r.get(e,n,a).catch((function(){return s({caches:t}).get(e,n,a)}))},set:function(e,n){return r.set(e,n).catch((function(){return s({caches:t}).set(e,n)}))},delete:function(e){return r.delete(e).catch((function(){return s({caches:t}).delete(e)}))},clear:function(){return r.clear().catch((function(){return s({caches:t}).clear()}))}}}function c(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{serializable:!0},t={}
return{get:function(r,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{miss:function(){return Promise.resolve()}},o=JSON.stringify(r)
if(o in t)return Promise.resolve(e.serializable?JSON.parse(t[o]):t[o])
var i=n(),s=a&&a.miss||function(){return Promise.resolve()}
return i.then((function(e){return s(e)})).then((function(){return i}))},set:function(r,n){return t[JSON.stringify(r)]=e.serializable?JSON.stringify(n):n,Promise.resolve(n)},delete:function(e){return delete t[JSON.stringify(e)],Promise.resolve()},clear:function(){return t={},Promise.resolve()}}}function u(e,t,r){var n={"x-algolia-api-key":r,"x-algolia-application-id":t}
return{headers:function(){return e===m.WithinHeaders?n:{}},queryParameters:function(){return e===m.WithinQueryParameters?n:{}}}}function l(e){var t=0
return e((function r(){return t++,new Promise((function(n){setTimeout((function(){n(e(r))}),Math.min(100*t,1e3))}))}))}function d(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e,t){return Promise.resolve()}
return Object.assign(e,{wait:function(r){return d(e.then((function(e){return Promise.all([t(e,r),e])})).then((function(e){return e[1]})))}})}function h(e){for(var t=e.length-1;t>0;t--){var r=Math.floor(Math.random()*(t+1)),n=e[t]
e[t]=e[r],e[r]=n}return e}function p(e,t){return t?(Object.keys(t).forEach((function(r){e[r]=t[r](e)})),e):e}function f(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n]
var a=0
return e.replace(/%s/g,(function(){return encodeURIComponent(r[a++])}))}var m={WithinQueryParameters:0,WithinHeaders:1}
function g(e,t){var r=e||{},n=r.data||{}
return Object.keys(r).forEach((function(e){-1===["timeout","headers","queryParameters","data","cacheable"].indexOf(e)&&(n[e]=r[e])})),{data:Object.entries(n).length>0?n:void 0,timeout:r.timeout||t,headers:r.headers||{},queryParameters:r.queryParameters||{},cacheable:r.cacheable}}var b={Read:1,Write:2,Any:3},_=1,w=2,v=3
function y(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:_
return r(r({},e),{},{status:t,lastUpdate:Date.now()})}function k(e){return"string"==typeof e?{protocol:"https",url:e,accept:b.Any}:{protocol:e.protocol||"https",url:e.url,accept:e.accept||b.Any}}var x="DELETE",P="GET",j="POST",S="PUT"
function E(e,t,n,a){var i=[],s=function(e,t){if(e.method!==P&&(void 0!==e.data||void 0!==t.data)){var n=Array.isArray(e.data)?e.data:r(r({},e.data),t.data)
return JSON.stringify(n)}}(n,a),c=function(e,t){var n=r(r({},e.headers),t.headers),a={}
return Object.keys(n).forEach((function(e){var t=n[e]
a[e.toLowerCase()]=t})),a}(e,a),u=n.method,l=n.method!==P?{}:r(r({},n.data),a.data),d=r(r(r({"x-algolia-agent":e.userAgent.value},e.queryParameters),l),a.queryParameters),h=0,p=function t(r,o){var l=r.pop()
if(void 0===l)throw{name:"RetryError",message:"Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.",transporterStackTrace:T(i)}
var p={data:s,headers:c,method:u,url:z(l,n.path,d),connectTimeout:o(h,e.timeouts.connect),responseTimeout:o(h,a.timeout)},f=function(e){var t={request:p,response:e,host:l,triesLeft:r.length}
return i.push(t),t},m={onSuccess:function(e){return function(e){try{return JSON.parse(e.content)}catch(t){throw function(e,t){return{name:"DeserializationError",message:e,response:t}}(t.message,e)}}(e)},onRetry:function(n){var a=f(n)
return n.isTimedOut&&h++,Promise.all([e.logger.info("Retryable failure",I(a)),e.hostsCache.set(l,y(l,n.isTimedOut?v:w))]).then((function(){return t(r,o)}))},onFail:function(e){throw f(e),function(e,t){var r=e.content,n=e.status,a=r
try{a=JSON.parse(r).message}catch(e){}return function(e,t,r){return{name:"ApiError",message:e,status:t,transporterStackTrace:r}}(a,n,t)}(e,T(i))}}
return e.requester.send(p).then((function(e){return function(e,t){return function(e){var t=e.status
return e.isTimedOut||function(e){var t=e.isTimedOut,r=e.status
return!t&&0==~~r}(e)||2!=~~(t/100)&&4!=~~(t/100)}(e)?t.onRetry(e):2==~~(e.status/100)?t.onSuccess(e):t.onFail(e)}(e,m)}))}
return function(e,t){return Promise.all(t.map((function(t){return e.get(t,(function(){return Promise.resolve(y(t))}))}))).then((function(e){var r=e.filter((function(e){return function(e){return e.status===_||Date.now()-e.lastUpdate>12e4}(e)})),n=e.filter((function(e){return function(e){return e.status===v&&Date.now()-e.lastUpdate<=12e4}(e)})),a=[].concat(o(r),o(n))
return{getTimeout:function(e,t){return(0===n.length&&0===e?1:n.length+3+e)*t},statelessHosts:a.length>0?a.map((function(e){return k(e)})):t}}))}(e.hostsCache,t).then((function(e){return p(o(e.statelessHosts).reverse(),e.getTimeout)}))}function C(e){var t=e.hostsCache,r=e.logger,n=e.requester,o=e.requestsCache,i=e.responsesCache,s=e.timeouts,c=e.userAgent,u=e.hosts,l=e.queryParameters,d={hostsCache:t,logger:r,requester:n,requestsCache:o,responsesCache:i,timeouts:s,userAgent:c,headers:e.headers,queryParameters:l,hosts:u.map((function(e){return k(e)})),read:function(e,t){var r=g(t,d.timeouts.read),n=function(){return E(d,d.hosts.filter((function(e){return 0!=(e.accept&b.Read)})),e,r)}
if(!0!==(void 0!==r.cacheable?r.cacheable:e.cacheable))return n()
var o={request:e,mappedRequestOptions:r,transporter:{queryParameters:d.queryParameters,headers:d.headers}}
return d.responsesCache.get(o,(function(){return d.requestsCache.get(o,(function(){return d.requestsCache.set(o,n()).then((function(e){return Promise.all([d.requestsCache.delete(o),e])}),(function(e){return Promise.all([d.requestsCache.delete(o),Promise.reject(e)])})).then((function(e){var t=a(e,2)
return t[0],t[1]}))}))}),{miss:function(e){return d.responsesCache.set(o,e)}})},write:function(e,t){return E(d,d.hosts.filter((function(e){return 0!=(e.accept&b.Write)})),e,g(t,d.timeouts.write))}}
return d}function O(e){var t={value:"Algolia for JavaScript (".concat(e,")"),add:function(e){var r="; ".concat(e.segment).concat(void 0!==e.version?" (".concat(e.version,")"):"")
return-1===t.value.indexOf(r)&&(t.value="".concat(t.value).concat(r)),t}}
return t}function z(e,t,r){var n=A(r),a="".concat(e.protocol,"://").concat(e.url,"/").concat("/"===t.charAt(0)?t.substr(1):t)
return n.length&&(a+="?".concat(n)),a}function A(e){return Object.keys(e).map((function(t){return f("%s=%s",t,(r=e[t],"[object Object]"===Object.prototype.toString.call(r)||"[object Array]"===Object.prototype.toString.call(r)?JSON.stringify(e[t]):e[t]))
var r})).join("&")}function T(e){return e.map((function(e){return I(e)}))}function I(e){var t=e.request.headers["x-algolia-api-key"]?{"x-algolia-api-key":"*****"}:{}
return r(r({},e),{},{request:r(r({},e.request),{},{headers:r(r({},e.request.headers),t)})})}var M=function(e){return function(t,r){return e.transporter.write({method:j,path:"2/abtests",data:t},r)}},D=function(e){return function(t,r){return e.transporter.write({method:x,path:f("2/abtests/%s",t)},r)}},q=function(e){return function(t,r){return e.transporter.read({method:P,path:f("2/abtests/%s",t)},r)}},L=function(e){return function(t){return e.transporter.read({method:P,path:"2/abtests"},t)}},N=function(e){return function(t,r){return e.transporter.write({method:j,path:f("2/abtests/%s/stop",t)},r)}},R=function(e){return function(t){return e.transporter.read({method:P,path:"1/strategies/personalization"},t)}},B=function(e){return function(t,r){return e.transporter.write({method:j,path:"1/strategies/personalization",data:t},r)}}
function H(e){return function t(r){return e.request(r).then((function(n){if(void 0!==e.batch&&e.batch(n.hits),!e.shouldStop(n))return n.cursor?t({cursor:n.cursor}):t({page:(r.page||0)+1})}))}({})}var $=function(e){return function(t,a){var o=a||{},i=o.queryParameters,s=n(o,["queryParameters"]),c=r({acl:t},void 0!==i?{queryParameters:i}:{})
return d(e.transporter.write({method:j,path:"1/keys",data:c},s),(function(t,r){return l((function(n){return Q(e)(t.key,r).catch((function(e){if(404!==e.status)throw e
return n()}))}))}))}},U=function(e){return function(t,r,n){var a=g(n)
return a.queryParameters["X-Algolia-User-ID"]=t,e.transporter.write({method:j,path:"1/clusters/mapping",data:{cluster:r}},a)}},F=function(e){return function(t,r,n){return e.transporter.write({method:j,path:"1/clusters/mapping/batch",data:{users:t,cluster:r}},n)}},W=function(e){return function(t,r){return d(e.transporter.write({method:j,path:f("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!0,requests:{action:"addEntry",body:[]}}},r),(function(t,r){return Pe(e)(t.taskID,r)}))}},V=function(e){return function(t,r,n){return d(e.transporter.write({method:j,path:f("1/indexes/%s/operation",t),data:{operation:"copy",destination:r}},n),(function(r,n){return ie(e)(t,{methods:{waitTask:lt}}).waitTask(r.taskID,n)}))}},G=function(e){return function(t,n,a){return V(e)(t,n,r(r({},a),{},{scope:[ht.Rules]}))}},K=function(e){return function(t,n,a){return V(e)(t,n,r(r({},a),{},{scope:[ht.Settings]}))}},X=function(e){return function(t,n,a){return V(e)(t,n,r(r({},a),{},{scope:[ht.Synonyms]}))}},J=function(e){return function(t,r){return t.method===P?e.transporter.read(t,r):e.transporter.write(t,r)}},Y=function(e){return function(t,r){return d(e.transporter.write({method:x,path:f("1/keys/%s",t)},r),(function(r,n){return l((function(r){return Q(e)(t,n).then(r).catch((function(e){if(404!==e.status)throw e}))}))}))}},Z=function(e){return function(t,r,n){var a=r.map((function(e){return{action:"deleteEntry",body:{objectID:e}}}))
return d(e.transporter.write({method:j,path:f("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!1,requests:a}},n),(function(t,r){return Pe(e)(t.taskID,r)}))}},Q=function(e){return function(t,r){return e.transporter.read({method:P,path:f("1/keys/%s",t)},r)}},ee=function(e){return function(t,r){return e.transporter.read({method:P,path:f("1/task/%s",t.toString())},r)}},te=function(e){return function(t){return e.transporter.read({method:P,path:"/1/dictionaries/*/settings"},t)}},re=function(e){return function(t){return e.transporter.read({method:P,path:"1/logs"},t)}},ne=function(e){return function(t){return e.transporter.read({method:P,path:"1/clusters/mapping/top"},t)}},ae=function(e){return function(t,r){return e.transporter.read({method:P,path:f("1/clusters/mapping/%s",t)},r)}},oe=function(e){return function(t){var r=t||{},a=r.retrieveMappings,o=n(r,["retrieveMappings"])
return!0===a&&(o.getClusters=!0),e.transporter.read({method:P,path:"1/clusters/mapping/pending"},o)}},ie=function(e){return function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
return p({transporter:e.transporter,appId:e.appId,indexName:t},r.methods)}},se=function(e){return function(t){return e.transporter.read({method:P,path:"1/keys"},t)}},ce=function(e){return function(t){return e.transporter.read({method:P,path:"1/clusters"},t)}},ue=function(e){return function(t){return e.transporter.read({method:P,path:"1/indexes"},t)}},le=function(e){return function(t){return e.transporter.read({method:P,path:"1/clusters/mapping"},t)}},de=function(e){return function(t,r,n){return d(e.transporter.write({method:j,path:f("1/indexes/%s/operation",t),data:{operation:"move",destination:r}},n),(function(r,n){return ie(e)(t,{methods:{waitTask:lt}}).waitTask(r.taskID,n)}))}},he=function(e){return function(t,r){return d(e.transporter.write({method:j,path:"1/indexes/*/batch",data:{requests:t}},r),(function(t,r){return Promise.all(Object.keys(t.taskID).map((function(n){return ie(e)(n,{methods:{waitTask:lt}}).waitTask(t.taskID[n],r)})))}))}},pe=function(e){return function(t,r){return e.transporter.read({method:j,path:"1/indexes/*/objects",data:{requests:t}},r)}},fe=function(e){return function(t,n){var a=t.map((function(e){return r(r({},e),{},{params:A(e.params||{})})}))
return e.transporter.read({method:j,path:"1/indexes/*/queries",data:{requests:a},cacheable:!0},n)}},me=function(e){return function(t,a){return Promise.all(t.map((function(t){var o=t.params,i=o.facetName,s=o.facetQuery,c=n(o,["facetName","facetQuery"])
return ie(e)(t.indexName,{methods:{searchForFacetValues:it}}).searchForFacetValues(i,s,r(r({},a),c))})))}},ge=function(e){return function(t,r){var n=g(r)
return n.queryParameters["X-Algolia-User-ID"]=t,e.transporter.write({method:x,path:"1/clusters/mapping"},n)}},be=function(e){return function(t,r,n){var a=r.map((function(e){return{action:"addEntry",body:e}}))
return d(e.transporter.write({method:j,path:f("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!0,requests:a}},n),(function(t,r){return Pe(e)(t.taskID,r)}))}},_e=function(e){return function(t,r){return d(e.transporter.write({method:j,path:f("1/keys/%s/restore",t)},r),(function(r,n){return l((function(r){return Q(e)(t,n).catch((function(e){if(404!==e.status)throw e
return r()}))}))}))}},we=function(e){return function(t,r,n){var a=r.map((function(e){return{action:"addEntry",body:e}}))
return d(e.transporter.write({method:j,path:f("/1/dictionaries/%s/batch",t),data:{clearExistingDictionaryEntries:!1,requests:a}},n),(function(t,r){return Pe(e)(t.taskID,r)}))}},ve=function(e){return function(t,r,n){return e.transporter.read({method:j,path:f("/1/dictionaries/%s/search",t),data:{query:r},cacheable:!0},n)}},ye=function(e){return function(t,r){return e.transporter.read({method:j,path:"1/clusters/mapping/search",data:{query:t}},r)}},ke=function(e){return function(t,r){return d(e.transporter.write({method:S,path:"/1/dictionaries/*/settings",data:t},r),(function(t,r){return Pe(e)(t.taskID,r)}))}},xe=function(e){return function(t,r){var a=Object.assign({},r),o=r||{},i=o.queryParameters,s=n(o,["queryParameters"]),c=i?{queryParameters:i}:{},u=["acl","indexes","referers","restrictSources","queryParameters","description","maxQueriesPerIPPerHour","maxHitsPerQuery"]
return d(e.transporter.write({method:S,path:f("1/keys/%s",t),data:c},s),(function(r,n){return l((function(r){return Q(e)(t,n).then((function(e){return function(e){return Object.keys(a).filter((function(e){return-1!==u.indexOf(e)})).every((function(t){if(Array.isArray(e[t])&&Array.isArray(a[t])){var r=e[t]
return r.length===a[t].length&&r.every((function(e,r){return e===a[t][r]}))}return e[t]===a[t]}))}(e)?Promise.resolve():r()}))}))}))}},Pe=function(e){return function(t,r){return l((function(n){return ee(e)(t,r).then((function(e){return"published"!==e.status?n():void 0}))}))}},je=function(e){return function(t,r){return d(e.transporter.write({method:j,path:f("1/indexes/%s/batch",e.indexName),data:{requests:t}},r),(function(t,r){return lt(e)(t.taskID,r)}))}},Se=function(e){return function(t){return H(r(r({shouldStop:function(e){return void 0===e.cursor}},t),{},{request:function(r){return e.transporter.read({method:j,path:f("1/indexes/%s/browse",e.indexName),data:r},t)}}))}},Ee=function(e){return function(t){var n=r({hitsPerPage:1e3},t)
return H(r(r({shouldStop:function(e){return e.hits.length<n.hitsPerPage}},n),{},{request:function(t){return st(e)("",r(r({},n),t)).then((function(e){return r(r({},e),{},{hits:e.hits.map((function(e){return delete e._highlightResult,e}))})}))}}))}},Ce=function(e){return function(t){var n=r({hitsPerPage:1e3},t)
return H(r(r({shouldStop:function(e){return e.hits.length<n.hitsPerPage}},n),{},{request:function(t){return ct(e)("",r(r({},n),t)).then((function(e){return r(r({},e),{},{hits:e.hits.map((function(e){return delete e._highlightResult,e}))})}))}}))}},Oe=function(e){return function(t,r,a){var o=a||{},i=o.batchSize,s=n(o,["batchSize"]),c={taskIDs:[],objectIDs:[]}
return d(function n(){var a,o=[]
for(a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;a<t.length&&(o.push(t[a]),o.length!==(i||1e3));a++);return 0===o.length?Promise.resolve(c):je(e)(o.map((function(e){return{action:r,body:e}})),s).then((function(e){return c.objectIDs=c.objectIDs.concat(e.objectIDs),c.taskIDs.push(e.taskID),a++,n(a)}))}(),(function(t,r){return Promise.all(t.taskIDs.map((function(t){return lt(e)(t,r)})))}))}},ze=function(e){return function(t){return d(e.transporter.write({method:j,path:f("1/indexes/%s/clear",e.indexName)},t),(function(t,r){return lt(e)(t.taskID,r)}))}},Ae=function(e){return function(t){var r=t||{},a=r.forwardToReplicas,o=g(n(r,["forwardToReplicas"]))
return a&&(o.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:j,path:f("1/indexes/%s/rules/clear",e.indexName)},o),(function(t,r){return lt(e)(t.taskID,r)}))}},Te=function(e){return function(t){var r=t||{},a=r.forwardToReplicas,o=g(n(r,["forwardToReplicas"]))
return a&&(o.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:j,path:f("1/indexes/%s/synonyms/clear",e.indexName)},o),(function(t,r){return lt(e)(t.taskID,r)}))}},Ie=function(e){return function(t,r){return d(e.transporter.write({method:j,path:f("1/indexes/%s/deleteByQuery",e.indexName),data:t},r),(function(t,r){return lt(e)(t.taskID,r)}))}},Me=function(e){return function(t){return d(e.transporter.write({method:x,path:f("1/indexes/%s",e.indexName)},t),(function(t,r){return lt(e)(t.taskID,r)}))}},De=function(e){return function(t,r){return d(qe(e)([t],r).then((function(e){return{taskID:e.taskIDs[0]}})),(function(t,r){return lt(e)(t.taskID,r)}))}},qe=function(e){return function(t,r){var n=t.map((function(e){return{objectID:e}}))
return Oe(e)(n,dt.DeleteObject,r)}},Le=function(e){return function(t,r){var a=r||{},o=a.forwardToReplicas,i=g(n(a,["forwardToReplicas"]))
return o&&(i.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:x,path:f("1/indexes/%s/rules/%s",e.indexName,t)},i),(function(t,r){return lt(e)(t.taskID,r)}))}},Ne=function(e){return function(t,r){var a=r||{},o=a.forwardToReplicas,i=g(n(a,["forwardToReplicas"]))
return o&&(i.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:x,path:f("1/indexes/%s/synonyms/%s",e.indexName,t)},i),(function(t,r){return lt(e)(t.taskID,r)}))}},Re=function(e){return function(t){return Ve(e)(t).then((function(){return!0})).catch((function(e){if(404!==e.status)throw e
return!1}))}},Be=function(e){return function(t,r,n){return e.transporter.read({method:j,path:f("1/answers/%s/prediction",e.indexName),data:{query:t,queryLanguages:r},cacheable:!0},n)}},He=function(e){return function(t,o){var i=o||{},s=i.query,c=i.paginate,u=n(i,["query","paginate"]),l=0
return function n(){return ot(e)(s||"",r(r({},u),{},{page:l})).then((function(e){for(var r=0,o=Object.entries(e.hits);r<o.length;r++){var i=a(o[r],2),s=i[0],u=i[1]
if(t(u))return{object:u,position:parseInt(s,10),page:l}}if(l++,!1===c||l>=e.nbPages)throw{name:"ObjectNotFoundError",message:"Object not found."}
return n()}))}()}},$e=function(e){return function(t,r){return e.transporter.read({method:P,path:f("1/indexes/%s/%s",e.indexName,t)},r)}},Ue=function(){return function(e,t){for(var r=0,n=Object.entries(e.hits);r<n.length;r++){var o=a(n[r],2),i=o[0]
if(o[1].objectID===t)return parseInt(i,10)}return-1}},Fe=function(e){return function(t,a){var o=a||{},i=o.attributesToRetrieve,s=n(o,["attributesToRetrieve"]),c=t.map((function(t){return r({indexName:e.indexName,objectID:t},i?{attributesToRetrieve:i}:{})}))
return e.transporter.read({method:j,path:"1/indexes/*/objects",data:{requests:c}},s)}},We=function(e){return function(t,r){return e.transporter.read({method:P,path:f("1/indexes/%s/rules/%s",e.indexName,t)},r)}},Ve=function(e){return function(t){return e.transporter.read({method:P,path:f("1/indexes/%s/settings",e.indexName),data:{getVersion:2}},t)}},Ge=function(e){return function(t,r){return e.transporter.read({method:P,path:f("1/indexes/%s/synonyms/%s",e.indexName,t)},r)}},Ke=function(e){return function(t,r){return d(Xe(e)([t],r).then((function(e){return{objectID:e.objectIDs[0],taskID:e.taskIDs[0]}})),(function(t,r){return lt(e)(t.taskID,r)}))}},Xe=function(e){return function(t,r){var a=r||{},o=a.createIfNotExists,i=n(a,["createIfNotExists"]),s=o?dt.PartialUpdateObject:dt.PartialUpdateObjectNoCreate
return Oe(e)(t,s,i)}},Je=function(e){return function(t,i){var s=i||{},c=s.safe,u=s.autoGenerateObjectIDIfNotExist,l=s.batchSize,h=n(s,["safe","autoGenerateObjectIDIfNotExist","batchSize"]),p=function(t,r,n,a){return d(e.transporter.write({method:j,path:f("1/indexes/%s/operation",t),data:{operation:n,destination:r}},a),(function(t,r){return lt(e)(t.taskID,r)}))},m=Math.random().toString(36).substring(7),g="".concat(e.indexName,"_tmp_").concat(m),b=et({appId:e.appId,transporter:e.transporter,indexName:g}),_=[],w=p(e.indexName,g,"copy",r(r({},h),{},{scope:["settings","synonyms","rules"]}))
return _.push(w),d((c?w.wait(h):w).then((function(){var e=b(t,r(r({},h),{},{autoGenerateObjectIDIfNotExist:u,batchSize:l}))
return _.push(e),c?e.wait(h):e})).then((function(){var t=p(g,e.indexName,"move",h)
return _.push(t),c?t.wait(h):t})).then((function(){return Promise.all(_)})).then((function(e){var t=a(e,3),r=t[0],n=t[1],i=t[2]
return{objectIDs:n.objectIDs,taskIDs:[r.taskID].concat(o(n.taskIDs),[i.taskID])}})),(function(e,t){return Promise.all(_.map((function(e){return e.wait(t)})))}))}},Ye=function(e){return function(t,n){return rt(e)(t,r(r({},n),{},{clearExistingRules:!0}))}},Ze=function(e){return function(t,n){return at(e)(t,r(r({},n),{},{clearExistingSynonyms:!0}))}},Qe=function(e){return function(t,r){return d(et(e)([t],r).then((function(e){return{objectID:e.objectIDs[0],taskID:e.taskIDs[0]}})),(function(t,r){return lt(e)(t.taskID,r)}))}},et=function(e){return function(t,r){var a=r||{},o=a.autoGenerateObjectIDIfNotExist,i=n(a,["autoGenerateObjectIDIfNotExist"]),s=o?dt.AddObject:dt.UpdateObject
if(s===dt.UpdateObject){var c=!0,u=!1,l=void 0
try{for(var h,p=t[Symbol.iterator]();!(c=(h=p.next()).done);c=!0)if(void 0===h.value.objectID)return d(Promise.reject({name:"MissingObjectIDError",message:"All objects must have an unique objectID (like a primary key) to be valid. Algolia is also able to generate objectIDs automatically but *it's not recommended*. To do it, use the `{'autoGenerateObjectIDIfNotExist': true}` option."}))}catch(e){u=!0,l=e}finally{try{c||null==p.return||p.return()}finally{if(u)throw l}}}return Oe(e)(t,s,i)}},tt=function(e){return function(t,r){return rt(e)([t],r)}},rt=function(e){return function(t,r){var a=r||{},o=a.forwardToReplicas,i=a.clearExistingRules,s=g(n(a,["forwardToReplicas","clearExistingRules"]))
return o&&(s.queryParameters.forwardToReplicas=1),i&&(s.queryParameters.clearExistingRules=1),d(e.transporter.write({method:j,path:f("1/indexes/%s/rules/batch",e.indexName),data:t},s),(function(t,r){return lt(e)(t.taskID,r)}))}},nt=function(e){return function(t,r){return at(e)([t],r)}},at=function(e){return function(t,r){var a=r||{},o=a.forwardToReplicas,i=a.clearExistingSynonyms,s=a.replaceExistingSynonyms,c=g(n(a,["forwardToReplicas","clearExistingSynonyms","replaceExistingSynonyms"]))
return o&&(c.queryParameters.forwardToReplicas=1),(s||i)&&(c.queryParameters.replaceExistingSynonyms=1),d(e.transporter.write({method:j,path:f("1/indexes/%s/synonyms/batch",e.indexName),data:t},c),(function(t,r){return lt(e)(t.taskID,r)}))}},ot=function(e){return function(t,r){return e.transporter.read({method:j,path:f("1/indexes/%s/query",e.indexName),data:{query:t},cacheable:!0},r)}},it=function(e){return function(t,r,n){return e.transporter.read({method:j,path:f("1/indexes/%s/facets/%s/query",e.indexName,t),data:{facetQuery:r},cacheable:!0},n)}},st=function(e){return function(t,r){return e.transporter.read({method:j,path:f("1/indexes/%s/rules/search",e.indexName),data:{query:t}},r)}},ct=function(e){return function(t,r){return e.transporter.read({method:j,path:f("1/indexes/%s/synonyms/search",e.indexName),data:{query:t}},r)}},ut=function(e){return function(t,r){var a=r||{},o=a.forwardToReplicas,i=g(n(a,["forwardToReplicas"]))
return o&&(i.queryParameters.forwardToReplicas=1),d(e.transporter.write({method:S,path:f("1/indexes/%s/settings",e.indexName),data:t},i),(function(t,r){return lt(e)(t.taskID,r)}))}},lt=function(e){return function(t,r){return l((function(n){return function(e){return function(t,r){return e.transporter.read({method:P,path:f("1/indexes/%s/task/%s",e.indexName,t.toString())},r)}}(e)(t,r).then((function(e){return"published"!==e.status?n():void 0}))}))}},dt={AddObject:"addObject",UpdateObject:"updateObject",PartialUpdateObject:"partialUpdateObject",PartialUpdateObjectNoCreate:"partialUpdateObjectNoCreate",DeleteObject:"deleteObject",DeleteIndex:"delete",ClearIndex:"clear"},ht={Settings:"settings",Synonyms:"synonyms",Rules:"rules"}
function pt(e,t,n){var a={appId:e,apiKey:t,timeouts:{connect:1,read:2,write:30},requester:{send:function(e){return new Promise((function(t){var r=new XMLHttpRequest
r.open(e.method,e.url,!0),Object.keys(e.headers).forEach((function(t){return r.setRequestHeader(t,e.headers[t])}))
var n,a=function(e,n){return setTimeout((function(){r.abort(),t({status:0,content:n,isTimedOut:!0})}),1e3*e)},o=a(e.connectTimeout,"Connection timeout")
r.onreadystatechange=function(){r.readyState>r.OPENED&&void 0===n&&(clearTimeout(o),n=a(e.responseTimeout,"Socket timeout"))},r.onerror=function(){0===r.status&&(clearTimeout(o),clearTimeout(n),t({content:r.responseText||"Network request failed",status:r.status,isTimedOut:!1}))},r.onload=function(){clearTimeout(o),clearTimeout(n),t({content:r.responseText,status:r.status,isTimedOut:!1})},r.send(e.data)}))}},logger:{debug:function(e,t){return Promise.resolve()},info:function(e,t){return Promise.resolve()},error:function(e,t){return console.error(e,t),Promise.resolve()}},responsesCache:c(),requestsCache:c({serializable:!1}),hostsCache:s({caches:[i({key:"".concat("4.18.0","-").concat(e)}),c()]}),userAgent:O("4.18.0").add({segment:"Browser"})},o=r(r({},a),n),l=function(){return function(e){return function(e){var t=e.region||"us",n=u(m.WithinHeaders,e.appId,e.apiKey),a=C(r(r({hosts:[{url:"personalization.".concat(t,".algolia.com")}]},e),{},{headers:r(r(r({},n.headers()),{"content-type":"application/json"}),e.headers),queryParameters:r(r({},n.queryParameters()),e.queryParameters)}))
return p({appId:e.appId,transporter:a},e.methods)}(r(r(r({},a),e),{},{methods:{getPersonalizationStrategy:R,setPersonalizationStrategy:B}}))}}
return function(e){var t=e.appId,n=u(void 0!==e.authMode?e.authMode:m.WithinHeaders,t,e.apiKey),a=C(r(r({hosts:[{url:"".concat(t,"-dsn.algolia.net"),accept:b.Read},{url:"".concat(t,".algolia.net"),accept:b.Write}].concat(h([{url:"".concat(t,"-1.algolianet.com")},{url:"".concat(t,"-2.algolianet.com")},{url:"".concat(t,"-3.algolianet.com")}]))},e),{},{headers:r(r(r({},n.headers()),{"content-type":"application/x-www-form-urlencoded"}),e.headers),queryParameters:r(r({},n.queryParameters()),e.queryParameters)}))
return p({transporter:a,appId:t,addAlgoliaAgent:function(e,t){a.userAgent.add({segment:e,version:t})},clearCache:function(){return Promise.all([a.requestsCache.clear(),a.responsesCache.clear()]).then((function(){}))}},e.methods)}(r(r({},o),{},{methods:{search:fe,searchForFacetValues:me,multipleBatch:he,multipleGetObjects:pe,multipleQueries:fe,copyIndex:V,copySettings:K,copySynonyms:X,copyRules:G,moveIndex:de,listIndices:ue,getLogs:re,listClusters:ce,multipleSearchForFacetValues:me,getApiKey:Q,addApiKey:$,listApiKeys:se,updateApiKey:xe,deleteApiKey:Y,restoreApiKey:_e,assignUserID:U,assignUserIDs:F,getUserID:ae,searchUserIDs:ye,listUserIDs:le,getTopUserIDs:ne,removeUserID:ge,hasPendingMappings:oe,clearDictionaryEntries:W,deleteDictionaryEntries:Z,getDictionarySettings:te,getAppTask:ee,replaceDictionaryEntries:be,saveDictionaryEntries:we,searchDictionaryEntries:ve,setDictionarySettings:ke,waitAppTask:Pe,customRequest:J,initIndex:function(e){return function(t){return ie(e)(t,{methods:{batch:je,delete:Me,findAnswers:Be,getObject:$e,getObjects:Fe,saveObject:Qe,saveObjects:et,search:ot,searchForFacetValues:it,waitTask:lt,setSettings:ut,getSettings:Ve,partialUpdateObject:Ke,partialUpdateObjects:Xe,deleteObject:De,deleteObjects:qe,deleteBy:Ie,clearObjects:ze,browseObjects:Se,getObjectPosition:Ue,findObject:He,exists:Re,saveSynonym:nt,saveSynonyms:at,getSynonym:Ge,searchSynonyms:ct,browseSynonyms:Ce,deleteSynonym:Ne,clearSynonyms:Te,replaceAllObjects:Je,replaceAllSynonyms:Ze,searchRules:st,getRule:We,deleteRule:Le,saveRule:tt,saveRules:rt,replaceAllRules:Ye,browseRules:Ee,clearRules:Ae}})}},initAnalytics:function(){return function(e){return function(e){var t=e.region||"us",n=u(m.WithinHeaders,e.appId,e.apiKey),a=C(r(r({hosts:[{url:"analytics.".concat(t,".algolia.com")}]},e),{},{headers:r(r(r({},n.headers()),{"content-type":"application/json"}),e.headers),queryParameters:r(r({},n.queryParameters()),e.queryParameters)}))
return p({appId:e.appId,transporter:a},e.methods)}(r(r(r({},a),e),{},{methods:{addABTest:M,getABTest:q,getABTests:L,stopABTest:N,deleteABTest:D}}))}},initPersonalization:l,initRecommendation:function(){return function(e){return o.logger.info("The `initRecommendation` method is deprecated. Use `initPersonalization` instead."),l()(e)}}}}))}return pt.version="4.18.0",pt},"object"==i(t)?e.exports=o():void 0===(a="function"==typeof(n=o)?n.call(t,r,t,e):n)||(e.exports=a)},,function(e,t){var r,n
function a(e){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(e)}void 0===(n="function"==typeof(r=function(){var e=/^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i
function t(e){var t,r=e.replace(/^v/,"").replace(/\+.*$/,""),n=("-",-1===(t=r).indexOf("-")?t.length:t.indexOf("-")),a=r.substring(0,n).split(".")
return a.push(r.substring(n+1)),a}function r(e){return isNaN(Number(e))?e:Number(e)}function n(t){if("string"!=typeof t)throw new TypeError("Invalid argument expected string")
if(!e.test(t))throw new Error("Invalid argument not valid semver ('"+t+"' received)")}function o(e,a){[e,a].forEach(n)
for(var o=t(e),i=t(a),s=0;s<Math.max(o.length-1,i.length-1);s++){var c=parseInt(o[s]||0,10),u=parseInt(i[s]||0,10)
if(c>u)return 1
if(u>c)return-1}var l=o[o.length-1],d=i[i.length-1]
if(l&&d){var h=l.split(".").map(r),p=d.split(".").map(r)
for(s=0;s<Math.max(h.length,p.length);s++){if(void 0===h[s]||"string"==typeof p[s]&&"number"==typeof h[s])return-1
if(void 0===p[s]||"string"==typeof h[s]&&"number"==typeof p[s])return 1
if(h[s]>p[s])return 1
if(p[s]>h[s])return-1}}else if(l||d)return l?-1:1
return 0}var i=[">",">=","=","<","<="],s={">":[1],">=":[0,1],"=":[0],"<=":[-1,0],"<":[-1]}
return o.validate=function(t){return"string"==typeof t&&e.test(t)},o.compare=function(e,t,r){!function(e){if("string"!=typeof e)throw new TypeError("Invalid operator type, expected string but got "+a(e))
if(-1===i.indexOf(e))throw new TypeError("Invalid operator, expected one of "+i.join("|"))}(r)
var n=o(e,t)
return s[r].indexOf(n)>-1},o})?r.apply(t,[]):r)||(e.exports=n)},function(e,t,r){var n,a,o
function i(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]
if(null!=r){var n,a,o,i,s=[],c=!0,u=!1
try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return
c=!1}else for(;!(c=(n=o.call(r)).done)&&(s.push(n.value),s.length!==t);c=!0);}catch(e){u=!0,a=e}finally{try{if(!c&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(u)throw a}}return s}}(e,t)||function(e,t){if(e){if("string"==typeof e)return s(e,t)
var r=Object.prototype.toString.call(e).slice(8,-1)
return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?s(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length)
for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r]
return n}a=[t,r(6)],n=function(e,t){"use strict"
function r(){return{type:"output",filter:function(e){for(var t="",r=!1,n=!1,a="",o=0;o<e.length;o+=1)e.substring(o,o+3).match(/<h\d/)&&(n=!0,r&&(t+="</section>\n")),n&&e.substring(o,o+4).match(/id="/)&&(a=i(e.substring(o,e.length).match(/^id="(.*)"/),2)[1]),e.substring(o-5,o).match(/<\/h\d>/)&&(t+='\n<section aria-labelledby="'.concat(a,'">'),a="",n=!1,r=!0),t+=e[o]
return r&&(t+="\n</section>"),t}}}var n
Object.defineProperty(e,"__esModule",{value:!0}),e.default=r,(n=t,n&&n.__esModule?n:{default:n}).default.extension("section-groups",r)},void 0===(o=n.apply(t,a))||(e.exports=o)},function(e,t,r){var n
function a(e){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(e)}(function(){function o(e){"use strict"
var t={omitExtraWLInCodeBlocks:{defaultValue:!1,describe:"Omit the default extra whiteline added to code blocks",type:"boolean"},noHeaderId:{defaultValue:!1,describe:"Turn on/off generated header id",type:"boolean"},prefixHeaderId:{defaultValue:!1,describe:"Add a prefix to the generated header ids. Passing a string will prefix that string to the header id. Setting to true will add a generic 'section-' prefix",type:"string"},rawPrefixHeaderId:{defaultValue:!1,describe:'Setting this option to true will prevent showdown from modifying the prefix. This might result in malformed IDs (if, for instance, the " char is used in the prefix)',type:"boolean"},ghCompatibleHeaderId:{defaultValue:!1,describe:"Generate header ids compatible with github style (spaces are replaced with dashes, a bunch of non alphanumeric chars are removed)",type:"boolean"},rawHeaderId:{defaultValue:!1,describe:"Remove only spaces, ' and \" from generated header ids (including prefixes), replacing them with dashes (-). WARNING: This might result in malformed ids",type:"boolean"},headerLevelStart:{defaultValue:!1,describe:"The header blocks level start",type:"integer"},parseImgDimensions:{defaultValue:!1,describe:"Turn on/off image dimension parsing",type:"boolean"},simplifiedAutoLink:{defaultValue:!1,describe:"Turn on/off GFM autolink style",type:"boolean"},excludeTrailingPunctuationFromURLs:{defaultValue:!1,describe:"Excludes trailing punctuation from links generated with autoLinking",type:"boolean"},literalMidWordUnderscores:{defaultValue:!1,describe:"Parse midword underscores as literal underscores",type:"boolean"},literalMidWordAsterisks:{defaultValue:!1,describe:"Parse midword asterisks as literal asterisks",type:"boolean"},strikethrough:{defaultValue:!1,describe:"Turn on/off strikethrough support",type:"boolean"},tables:{defaultValue:!1,describe:"Turn on/off tables support",type:"boolean"},tablesHeaderId:{defaultValue:!1,describe:"Add an id to table headers",type:"boolean"},ghCodeBlocks:{defaultValue:!0,describe:"Turn on/off GFM fenced code blocks support",type:"boolean"},tasklists:{defaultValue:!1,describe:"Turn on/off GFM tasklist support",type:"boolean"},smoothLivePreview:{defaultValue:!1,describe:"Prevents weird effects in live previews due to incomplete input",type:"boolean"},smartIndentationFix:{defaultValue:!1,description:"Tries to smartly fix indentation in es6 strings",type:"boolean"},disableForced4SpacesIndentedSublists:{defaultValue:!1,description:"Disables the requirement of indenting nested sublists by 4 spaces",type:"boolean"},simpleLineBreaks:{defaultValue:!1,description:"Parses simple line breaks as <br> (GFM Style)",type:"boolean"},requireSpaceBeforeHeadingText:{defaultValue:!1,description:"Makes adding a space between `#` and the header text mandatory (GFM Style)",type:"boolean"},ghMentions:{defaultValue:!1,description:"Enables github @mentions",type:"boolean"},ghMentionsLink:{defaultValue:"https://github.com/{u}",description:"Changes the link generated by @mentions. Only applies if ghMentions option is enabled.",type:"string"},encodeEmails:{defaultValue:!0,description:"Encode e-mail addresses through the use of Character Entities, transforming ASCII e-mail addresses into its equivalent decimal entities",type:"boolean"},openLinksInNewWindow:{defaultValue:!1,description:"Open all links in new windows",type:"boolean"},backslashEscapesHTMLTags:{defaultValue:!1,description:"Support for HTML Tag escaping. ex: <div>foo</div>",type:"boolean"},emoji:{defaultValue:!1,description:"Enable emoji support. Ex: `this is a :smile: emoji`",type:"boolean"},underline:{defaultValue:!1,description:"Enable support for underline. Syntax is double or triple underscores: `__underline word__`. With this option enabled, underscores no longer parses into `<em>` and `<strong>`",type:"boolean"},completeHTMLDocument:{defaultValue:!1,description:"Outputs a complete html document, including `<html>`, `<head>` and `<body>` tags",type:"boolean"},metadata:{defaultValue:!1,description:"Enable support for document metadata (defined at the top of the document between `«««` and `»»»` or between `---` and `---`).",type:"boolean"},splitAdjacentBlockquotes:{defaultValue:!1,description:"Split adjacent blockquote blocks",type:"boolean"}}
if(!1===e)return JSON.parse(JSON.stringify(t))
var r={}
for(var n in t)t.hasOwnProperty(n)&&(r[n]=t[n].defaultValue)
return r}var i={},s={},c={},u=o(!0),l="vanilla",d={github:{omitExtraWLInCodeBlocks:!0,simplifiedAutoLink:!0,excludeTrailingPunctuationFromURLs:!0,literalMidWordUnderscores:!0,strikethrough:!0,tables:!0,tablesHeaderId:!0,ghCodeBlocks:!0,tasklists:!0,disableForced4SpacesIndentedSublists:!0,simpleLineBreaks:!0,requireSpaceBeforeHeadingText:!0,ghCompatibleHeaderId:!0,ghMentions:!0,backslashEscapesHTMLTags:!0,emoji:!0,splitAdjacentBlockquotes:!0},original:{noHeaderId:!0,ghCodeBlocks:!1},ghost:{omitExtraWLInCodeBlocks:!0,parseImgDimensions:!0,simplifiedAutoLink:!0,excludeTrailingPunctuationFromURLs:!0,literalMidWordUnderscores:!0,strikethrough:!0,tables:!0,tablesHeaderId:!0,ghCodeBlocks:!0,tasklists:!0,smoothLivePreview:!0,simpleLineBreaks:!0,requireSpaceBeforeHeadingText:!0,ghMentions:!1,encodeEmails:!0},vanilla:o(!0),allOn:function(){"use strict"
var e=o(!0),t={}
for(var r in e)e.hasOwnProperty(r)&&(t[r]=!0)
return t}()}
function h(e,t){"use strict"
var r=t?"Error in "+t+" extension->":"Error in unnamed extension",n={valid:!0,error:""}
i.helper.isArray(e)||(e=[e])
for(var o=0;o<e.length;++o){var s=r+" sub-extension "+o+": ",c=e[o]
if("object"!==a(c))return n.valid=!1,n.error=s+"must be an object, but "+a(c)+" given",n
if(!i.helper.isString(c.type))return n.valid=!1,n.error=s+'property "type" must be a string, but '+a(c.type)+" given",n
var u=c.type=c.type.toLowerCase()
if("language"===u&&(u=c.type="lang"),"html"===u&&(u=c.type="output"),"lang"!==u&&"output"!==u&&"listener"!==u)return n.valid=!1,n.error=s+"type "+u+' is not recognized. Valid values: "lang/language", "output/html" or "listener"',n
if("listener"===u){if(i.helper.isUndefined(c.listeners))return n.valid=!1,n.error=s+'. Extensions of type "listener" must have a property called "listeners"',n}else if(i.helper.isUndefined(c.filter)&&i.helper.isUndefined(c.regex))return n.valid=!1,n.error=s+u+' extensions must define either a "regex" property or a "filter" method',n
if(c.listeners){if("object"!==a(c.listeners))return n.valid=!1,n.error=s+'"listeners" property must be an object but '+a(c.listeners)+" given",n
for(var l in c.listeners)if(c.listeners.hasOwnProperty(l)&&"function"!=typeof c.listeners[l])return n.valid=!1,n.error=s+'"listeners" property must be an hash of [event name]: [callback]. listeners.'+l+" must be a function but "+a(c.listeners[l])+" given",n}if(c.filter){if("function"!=typeof c.filter)return n.valid=!1,n.error=s+'"filter" must be a function, but '+a(c.filter)+" given",n}else if(c.regex){if(i.helper.isString(c.regex)&&(c.regex=new RegExp(c.regex,"g")),!(c.regex instanceof RegExp))return n.valid=!1,n.error=s+'"regex" property must either be a string or a RegExp object, but '+a(c.regex)+" given",n
if(i.helper.isUndefined(c.replace))return n.valid=!1,n.error=s+'"regex" extensions must implement a replace string or function',n}}return n}function p(e,t){"use strict"
return"¨E"+t.charCodeAt(0)+"E"}i.helper={},i.extensions={},i.setOption=function(e,t){"use strict"
return u[e]=t,this},i.getOption=function(e){"use strict"
return u[e]},i.getOptions=function(){"use strict"
return u},i.resetOptions=function(){"use strict"
u=o(!0)},i.setFlavor=function(e){"use strict"
if(!d.hasOwnProperty(e))throw Error(e+" flavor was not found")
i.resetOptions()
var t=d[e]
for(var r in l=e,t)t.hasOwnProperty(r)&&(u[r]=t[r])},i.getFlavor=function(){"use strict"
return l},i.getFlavorOptions=function(e){"use strict"
if(d.hasOwnProperty(e))return d[e]},i.getDefaultOptions=function(e){"use strict"
return o(e)},i.subParser=function(e,t){"use strict"
if(i.helper.isString(e)){if(void 0===t){if(s.hasOwnProperty(e))return s[e]
throw Error("SubParser named "+e+" not registered!")}s[e]=t}},i.extension=function(e,t){"use strict"
if(!i.helper.isString(e))throw Error("Extension 'name' must be a string")
if(e=i.helper.stdExtName(e),i.helper.isUndefined(t)){if(!c.hasOwnProperty(e))throw Error("Extension named "+e+" is not registered!")
return c[e]}"function"==typeof t&&(t=t()),i.helper.isArray(t)||(t=[t])
var r=h(t,e)
if(!r.valid)throw Error(r.error)
c[e]=t},i.getAllExtensions=function(){"use strict"
return c},i.removeExtension=function(e){"use strict"
delete c[e]},i.resetExtensions=function(){"use strict"
c={}},i.validateExtension=function(e){"use strict"
var t=h(e,null)
return!!t.valid||(console.warn(t.error),!1)},i.hasOwnProperty("helper")||(i.helper={}),i.helper.isString=function(e){"use strict"
return"string"==typeof e||e instanceof String},i.helper.isFunction=function(e){"use strict"
return e&&"[object Function]"==={}.toString.call(e)},i.helper.isArray=function(e){"use strict"
return Array.isArray(e)},i.helper.isUndefined=function(e){"use strict"
return void 0===e},i.helper.forEach=function(e,t){"use strict"
if(i.helper.isUndefined(e))throw new Error("obj param is required")
if(i.helper.isUndefined(t))throw new Error("callback param is required")
if(!i.helper.isFunction(t))throw new Error("callback param must be a function/closure")
if("function"==typeof e.forEach)e.forEach(t)
else if(i.helper.isArray(e))for(var r=0;r<e.length;r++)t(e[r],r,e)
else{if("object"!==a(e))throw new Error("obj does not seem to be an array or an iterable object")
for(var n in e)e.hasOwnProperty(n)&&t(e[n],n,e)}},i.helper.stdExtName=function(e){"use strict"
return e.replace(/[_?*+\/\\.^-]/g,"").replace(/\s/g,"").toLowerCase()},i.helper.escapeCharactersCallback=p,i.helper.escapeCharacters=function(e,t,r){"use strict"
var n="(["+t.replace(/([\[\]\\])/g,"\\$1")+"])"
r&&(n="\\\\"+n)
var a=new RegExp(n,"g")
return e.replace(a,p)},i.helper.unescapeHTMLEntities=function(e){"use strict"
return e.replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}
var f=function(e,t,r,n){"use strict"
var a,o,i,s,c,u=n||"",l=u.indexOf("g")>-1,d=new RegExp(t+"|"+r,"g"+u.replace(/g/g,"")),h=new RegExp(t,u.replace(/g/g,"")),p=[]
do{for(a=0;i=d.exec(e);)if(h.test(i[0]))a++||(s=(o=d.lastIndex)-i[0].length)
else if(a&&!--a){c=i.index+i[0].length
var f={left:{start:s,end:o},match:{start:o,end:i.index},right:{start:i.index,end:c},wholeMatch:{start:s,end:c}}
if(p.push(f),!l)return p}}while(a&&(d.lastIndex=o))
return p}
i.helper.matchRecursiveRegExp=function(e,t,r,n){"use strict"
for(var a=f(e,t,r,n),o=[],i=0;i<a.length;++i)o.push([e.slice(a[i].wholeMatch.start,a[i].wholeMatch.end),e.slice(a[i].match.start,a[i].match.end),e.slice(a[i].left.start,a[i].left.end),e.slice(a[i].right.start,a[i].right.end)])
return o},i.helper.replaceRecursiveRegExp=function(e,t,r,n,a){"use strict"
if(!i.helper.isFunction(t)){var o=t
t=function(){return o}}var s=f(e,r,n,a),c=e,u=s.length
if(u>0){var l=[]
0!==s[0].wholeMatch.start&&l.push(e.slice(0,s[0].wholeMatch.start))
for(var d=0;d<u;++d)l.push(t(e.slice(s[d].wholeMatch.start,s[d].wholeMatch.end),e.slice(s[d].match.start,s[d].match.end),e.slice(s[d].left.start,s[d].left.end),e.slice(s[d].right.start,s[d].right.end))),d<u-1&&l.push(e.slice(s[d].wholeMatch.end,s[d+1].wholeMatch.start))
s[u-1].wholeMatch.end<e.length&&l.push(e.slice(s[u-1].wholeMatch.end)),c=l.join("")}return c},i.helper.regexIndexOf=function(e,t,r){"use strict"
if(!i.helper.isString(e))throw"InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string"
if(t instanceof RegExp==0)throw"InvalidArgumentError: second parameter of showdown.helper.regexIndexOf function must be an instance of RegExp"
var n=e.substring(r||0).search(t)
return n>=0?n+(r||0):n},i.helper.splitAtIndex=function(e,t){"use strict"
if(!i.helper.isString(e))throw"InvalidArgumentError: first parameter of showdown.helper.regexIndexOf function must be a string"
return[e.substring(0,t),e.substring(t)]},i.helper.encodeEmailAddress=function(e){"use strict"
var t=[function(e){return"&#"+e.charCodeAt(0)+";"},function(e){return"&#x"+e.charCodeAt(0).toString(16)+";"},function(e){return e}]
return e.replace(/./g,(function(e){if("@"===e)e=t[Math.floor(2*Math.random())](e)
else{var r=Math.random()
e=r>.9?t[2](e):r>.45?t[1](e):t[0](e)}return e}))},i.helper.padEnd=function(e,t,r){"use strict"
return t>>=0,r=String(r||" "),e.length>t?String(e):((t-=e.length)>r.length&&(r+=r.repeat(t/r.length)),String(e)+r.slice(0,t))},"undefined"==typeof console&&(console={warn:function(e){"use strict"
alert(e)},log:function(e){"use strict"
alert(e)},error:function(e){"use strict"
throw e}}),i.helper.regexes={asteriskDashAndColon:/([*_:~])/g},i.helper.emojis={"+1":"👍","-1":"👎",100:"💯",1234:"🔢","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉","8ball":"🎱",a:"🅰️",ab:"🆎",abc:"🔤",abcd:"🔡",accept:"🉑",aerial_tramway:"🚡",airplane:"✈️",alarm_clock:"⏰",alembic:"⚗️",alien:"👽",ambulance:"🚑",amphora:"🏺",anchor:"⚓️",angel:"👼",anger:"💢",angry:"😠",anguished:"😧",ant:"🐜",apple:"🍎",aquarius:"♒️",aries:"♈️",arrow_backward:"◀️",arrow_double_down:"⏬",arrow_double_up:"⏫",arrow_down:"⬇️",arrow_down_small:"🔽",arrow_forward:"▶️",arrow_heading_down:"⤵️",arrow_heading_up:"⤴️",arrow_left:"⬅️",arrow_lower_left:"↙️",arrow_lower_right:"↘️",arrow_right:"➡️",arrow_right_hook:"↪️",arrow_up:"⬆️",arrow_up_down:"↕️",arrow_up_small:"🔼",arrow_upper_left:"↖️",arrow_upper_right:"↗️",arrows_clockwise:"🔃",arrows_counterclockwise:"🔄",art:"🎨",articulated_lorry:"🚛",artificial_satellite:"🛰",astonished:"😲",athletic_shoe:"👟",atm:"🏧",atom_symbol:"⚛️",avocado:"🥑",b:"🅱️",baby:"👶",baby_bottle:"🍼",baby_chick:"🐤",baby_symbol:"🚼",back:"🔙",bacon:"🥓",badminton:"🏸",baggage_claim:"🛄",baguette_bread:"🥖",balance_scale:"⚖️",balloon:"🎈",ballot_box:"🗳",ballot_box_with_check:"☑️",bamboo:"🎍",banana:"🍌",bangbang:"‼️",bank:"🏦",bar_chart:"📊",barber:"💈",baseball:"⚾️",basketball:"🏀",basketball_man:"⛹️",basketball_woman:"⛹️&zwj;♀️",bat:"🦇",bath:"🛀",bathtub:"🛁",battery:"🔋",beach_umbrella:"🏖",bear:"🐻",bed:"🛏",bee:"🐝",beer:"🍺",beers:"🍻",beetle:"🐞",beginner:"🔰",bell:"🔔",bellhop_bell:"🛎",bento:"🍱",biking_man:"🚴",bike:"🚲",biking_woman:"🚴&zwj;♀️",bikini:"👙",biohazard:"☣️",bird:"🐦",birthday:"🎂",black_circle:"⚫️",black_flag:"🏴",black_heart:"🖤",black_joker:"🃏",black_large_square:"⬛️",black_medium_small_square:"◾️",black_medium_square:"◼️",black_nib:"✒️",black_small_square:"▪️",black_square_button:"🔲",blonde_man:"👱",blonde_woman:"👱&zwj;♀️",blossom:"🌼",blowfish:"🐡",blue_book:"📘",blue_car:"🚙",blue_heart:"💙",blush:"😊",boar:"🐗",boat:"⛵️",bomb:"💣",book:"📖",bookmark:"🔖",bookmark_tabs:"📑",books:"📚",boom:"💥",boot:"👢",bouquet:"💐",bowing_man:"🙇",bow_and_arrow:"🏹",bowing_woman:"🙇&zwj;♀️",bowling:"🎳",boxing_glove:"🥊",boy:"👦",bread:"🍞",bride_with_veil:"👰",bridge_at_night:"🌉",briefcase:"💼",broken_heart:"💔",bug:"🐛",building_construction:"🏗",bulb:"💡",bullettrain_front:"🚅",bullettrain_side:"🚄",burrito:"🌯",bus:"🚌",business_suit_levitating:"🕴",busstop:"🚏",bust_in_silhouette:"👤",busts_in_silhouette:"👥",butterfly:"🦋",cactus:"🌵",cake:"🍰",calendar:"📆",call_me_hand:"🤙",calling:"📲",camel:"🐫",camera:"📷",camera_flash:"📸",camping:"🏕",cancer:"♋️",candle:"🕯",candy:"🍬",canoe:"🛶",capital_abcd:"🔠",capricorn:"♑️",car:"🚗",card_file_box:"🗃",card_index:"📇",card_index_dividers:"🗂",carousel_horse:"🎠",carrot:"🥕",cat:"🐱",cat2:"🐈",cd:"💿",chains:"⛓",champagne:"🍾",chart:"💹",chart_with_downwards_trend:"📉",chart_with_upwards_trend:"📈",checkered_flag:"🏁",cheese:"🧀",cherries:"🍒",cherry_blossom:"🌸",chestnut:"🌰",chicken:"🐔",children_crossing:"🚸",chipmunk:"🐿",chocolate_bar:"🍫",christmas_tree:"🎄",church:"⛪️",cinema:"🎦",circus_tent:"🎪",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",cl:"🆑",clamp:"🗜",clap:"👏",clapper:"🎬",classical_building:"🏛",clinking_glasses:"🥂",clipboard:"📋",clock1:"🕐",clock10:"🕙",clock1030:"🕥",clock11:"🕚",clock1130:"🕦",clock12:"🕛",clock1230:"🕧",clock130:"🕜",clock2:"🕑",clock230:"🕝",clock3:"🕒",clock330:"🕞",clock4:"🕓",clock430:"🕟",clock5:"🕔",clock530:"🕠",clock6:"🕕",clock630:"🕡",clock7:"🕖",clock730:"🕢",clock8:"🕗",clock830:"🕣",clock9:"🕘",clock930:"🕤",closed_book:"📕",closed_lock_with_key:"🔐",closed_umbrella:"🌂",cloud:"☁️",cloud_with_lightning:"🌩",cloud_with_lightning_and_rain:"⛈",cloud_with_rain:"🌧",cloud_with_snow:"🌨",clown_face:"🤡",clubs:"♣️",cocktail:"🍸",coffee:"☕️",coffin:"⚰️",cold_sweat:"😰",comet:"☄️",computer:"💻",computer_mouse:"🖱",confetti_ball:"🎊",confounded:"😖",confused:"😕",congratulations:"㊗️",construction:"🚧",construction_worker_man:"👷",construction_worker_woman:"👷&zwj;♀️",control_knobs:"🎛",convenience_store:"🏪",cookie:"🍪",cool:"🆒",policeman:"👮",copyright:"©️",corn:"🌽",couch_and_lamp:"🛋",couple:"👫",couple_with_heart_woman_man:"💑",couple_with_heart_man_man:"👨&zwj;❤️&zwj;👨",couple_with_heart_woman_woman:"👩&zwj;❤️&zwj;👩",couplekiss_man_man:"👨&zwj;❤️&zwj;💋&zwj;👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩&zwj;❤️&zwj;💋&zwj;👩",cow:"🐮",cow2:"🐄",cowboy_hat_face:"🤠",crab:"🦀",crayon:"🖍",credit_card:"💳",crescent_moon:"🌙",cricket:"🏏",crocodile:"🐊",croissant:"🥐",crossed_fingers:"🤞",crossed_flags:"🎌",crossed_swords:"⚔️",crown:"👑",cry:"😢",crying_cat_face:"😿",crystal_ball:"🔮",cucumber:"🥒",cupid:"💘",curly_loop:"➰",currency_exchange:"💱",curry:"🍛",custard:"🍮",customs:"🛃",cyclone:"🌀",dagger:"🗡",dancer:"💃",dancing_women:"👯",dancing_men:"👯&zwj;♂️",dango:"🍡",dark_sunglasses:"🕶",dart:"🎯",dash:"💨",date:"📅",deciduous_tree:"🌳",deer:"🦌",department_store:"🏬",derelict_house:"🏚",desert:"🏜",desert_island:"🏝",desktop_computer:"🖥",male_detective:"🕵️",diamond_shape_with_a_dot_inside:"💠",diamonds:"♦️",disappointed:"😞",disappointed_relieved:"😥",dizzy:"💫",dizzy_face:"😵",do_not_litter:"🚯",dog:"🐶",dog2:"🐕",dollar:"💵",dolls:"🎎",dolphin:"🐬",door:"🚪",doughnut:"🍩",dove:"🕊",dragon:"🐉",dragon_face:"🐲",dress:"👗",dromedary_camel:"🐪",drooling_face:"🤤",droplet:"💧",drum:"🥁",duck:"🦆",dvd:"📀","e-mail":"📧",eagle:"🦅",ear:"👂",ear_of_rice:"🌾",earth_africa:"🌍",earth_americas:"🌎",earth_asia:"🌏",egg:"🥚",eggplant:"🍆",eight_pointed_black_star:"✴️",eight_spoked_asterisk:"✳️",electric_plug:"🔌",elephant:"🐘",email:"✉️",end:"🔚",envelope_with_arrow:"📩",euro:"💶",european_castle:"🏰",european_post_office:"🏤",evergreen_tree:"🌲",exclamation:"❗️",expressionless:"😑",eye:"👁",eye_speech_bubble:"👁&zwj;🗨",eyeglasses:"👓",eyes:"👀",face_with_head_bandage:"🤕",face_with_thermometer:"🤒",fist_oncoming:"👊",factory:"🏭",fallen_leaf:"🍂",family_man_woman_boy:"👪",family_man_boy:"👨&zwj;👦",family_man_boy_boy:"👨&zwj;👦&zwj;👦",family_man_girl:"👨&zwj;👧",family_man_girl_boy:"👨&zwj;👧&zwj;👦",family_man_girl_girl:"👨&zwj;👧&zwj;👧",family_man_man_boy:"👨&zwj;👨&zwj;👦",family_man_man_boy_boy:"👨&zwj;👨&zwj;👦&zwj;👦",family_man_man_girl:"👨&zwj;👨&zwj;👧",family_man_man_girl_boy:"👨&zwj;👨&zwj;👧&zwj;👦",family_man_man_girl_girl:"👨&zwj;👨&zwj;👧&zwj;👧",family_man_woman_boy_boy:"👨&zwj;👩&zwj;👦&zwj;👦",family_man_woman_girl:"👨&zwj;👩&zwj;👧",family_man_woman_girl_boy:"👨&zwj;👩&zwj;👧&zwj;👦",family_man_woman_girl_girl:"👨&zwj;👩&zwj;👧&zwj;👧",family_woman_boy:"👩&zwj;👦",family_woman_boy_boy:"👩&zwj;👦&zwj;👦",family_woman_girl:"👩&zwj;👧",family_woman_girl_boy:"👩&zwj;👧&zwj;👦",family_woman_girl_girl:"👩&zwj;👧&zwj;👧",family_woman_woman_boy:"👩&zwj;👩&zwj;👦",family_woman_woman_boy_boy:"👩&zwj;👩&zwj;👦&zwj;👦",family_woman_woman_girl:"👩&zwj;👩&zwj;👧",family_woman_woman_girl_boy:"👩&zwj;👩&zwj;👧&zwj;👦",family_woman_woman_girl_girl:"👩&zwj;👩&zwj;👧&zwj;👧",fast_forward:"⏩",fax:"📠",fearful:"😨",feet:"🐾",female_detective:"🕵️&zwj;♀️",ferris_wheel:"🎡",ferry:"⛴",field_hockey:"🏑",file_cabinet:"🗄",file_folder:"📁",film_projector:"📽",film_strip:"🎞",fire:"🔥",fire_engine:"🚒",fireworks:"🎆",first_quarter_moon:"🌓",first_quarter_moon_with_face:"🌛",fish:"🐟",fish_cake:"🍥",fishing_pole_and_fish:"🎣",fist_raised:"✊",fist_left:"🤛",fist_right:"🤜",flags:"🎏",flashlight:"🔦",fleur_de_lis:"⚜️",flight_arrival:"🛬",flight_departure:"🛫",floppy_disk:"💾",flower_playing_cards:"🎴",flushed:"😳",fog:"🌫",foggy:"🌁",football:"🏈",footprints:"👣",fork_and_knife:"🍴",fountain:"⛲️",fountain_pen:"🖋",four_leaf_clover:"🍀",fox_face:"🦊",framed_picture:"🖼",free:"🆓",fried_egg:"🍳",fried_shrimp:"🍤",fries:"🍟",frog:"🐸",frowning:"😦",frowning_face:"☹️",frowning_man:"🙍&zwj;♂️",frowning_woman:"🙍",middle_finger:"🖕",fuelpump:"⛽️",full_moon:"🌕",full_moon_with_face:"🌝",funeral_urn:"⚱️",game_die:"🎲",gear:"⚙️",gem:"💎",gemini:"♊️",ghost:"👻",gift:"🎁",gift_heart:"💝",girl:"👧",globe_with_meridians:"🌐",goal_net:"🥅",goat:"🐐",golf:"⛳️",golfing_man:"🏌️",golfing_woman:"🏌️&zwj;♀️",gorilla:"🦍",grapes:"🍇",green_apple:"🍏",green_book:"📗",green_heart:"💚",green_salad:"🥗",grey_exclamation:"❕",grey_question:"❔",grimacing:"😬",grin:"😁",grinning:"😀",guardsman:"💂",guardswoman:"💂&zwj;♀️",guitar:"🎸",gun:"🔫",haircut_woman:"💇",haircut_man:"💇&zwj;♂️",hamburger:"🍔",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",hamster:"🐹",hand:"✋",handbag:"👜",handshake:"🤝",hankey:"💩",hatched_chick:"🐥",hatching_chick:"🐣",headphones:"🎧",hear_no_evil:"🙉",heart:"❤️",heart_decoration:"💟",heart_eyes:"😍",heart_eyes_cat:"😻",heartbeat:"💓",heartpulse:"💗",hearts:"♥️",heavy_check_mark:"✔️",heavy_division_sign:"➗",heavy_dollar_sign:"💲",heavy_heart_exclamation:"❣️",heavy_minus_sign:"➖",heavy_multiplication_x:"✖️",heavy_plus_sign:"➕",helicopter:"🚁",herb:"🌿",hibiscus:"🌺",high_brightness:"🔆",high_heel:"👠",hocho:"🔪",hole:"🕳",honey_pot:"🍯",horse:"🐴",horse_racing:"🏇",hospital:"🏥",hot_pepper:"🌶",hotdog:"🌭",hotel:"🏨",hotsprings:"♨️",hourglass:"⌛️",hourglass_flowing_sand:"⏳",house:"🏠",house_with_garden:"🏡",houses:"🏘",hugs:"🤗",hushed:"😯",ice_cream:"🍨",ice_hockey:"🏒",ice_skate:"⛸",icecream:"🍦",id:"🆔",ideograph_advantage:"🉐",imp:"👿",inbox_tray:"📥",incoming_envelope:"📨",tipping_hand_woman:"💁",information_source:"ℹ️",innocent:"😇",interrobang:"⁉️",iphone:"📱",izakaya_lantern:"🏮",jack_o_lantern:"🎃",japan:"🗾",japanese_castle:"🏯",japanese_goblin:"👺",japanese_ogre:"👹",jeans:"👖",joy:"😂",joy_cat:"😹",joystick:"🕹",kaaba:"🕋",key:"🔑",keyboard:"⌨️",keycap_ten:"🔟",kick_scooter:"🛴",kimono:"👘",kiss:"💋",kissing:"😗",kissing_cat:"😽",kissing_closed_eyes:"😚",kissing_heart:"😘",kissing_smiling_eyes:"😙",kiwi_fruit:"🥝",koala:"🐨",koko:"🈁",label:"🏷",large_blue_circle:"🔵",large_blue_diamond:"🔷",large_orange_diamond:"🔶",last_quarter_moon:"🌗",last_quarter_moon_with_face:"🌜",latin_cross:"✝️",laughing:"😆",leaves:"🍃",ledger:"📒",left_luggage:"🛅",left_right_arrow:"↔️",leftwards_arrow_with_hook:"↩️",lemon:"🍋",leo:"♌️",leopard:"🐆",level_slider:"🎚",libra:"♎️",light_rail:"🚈",link:"🔗",lion:"🦁",lips:"👄",lipstick:"💄",lizard:"🦎",lock:"🔒",lock_with_ink_pen:"🔏",lollipop:"🍭",loop:"➿",loud_sound:"🔊",loudspeaker:"📢",love_hotel:"🏩",love_letter:"💌",low_brightness:"🔅",lying_face:"🤥",m:"Ⓜ️",mag:"🔍",mag_right:"🔎",mahjong:"🀄️",mailbox:"📫",mailbox_closed:"📪",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",man:"👨",man_artist:"👨&zwj;🎨",man_astronaut:"👨&zwj;🚀",man_cartwheeling:"🤸&zwj;♂️",man_cook:"👨&zwj;🍳",man_dancing:"🕺",man_facepalming:"🤦&zwj;♂️",man_factory_worker:"👨&zwj;🏭",man_farmer:"👨&zwj;🌾",man_firefighter:"👨&zwj;🚒",man_health_worker:"👨&zwj;⚕️",man_in_tuxedo:"🤵",man_judge:"👨&zwj;⚖️",man_juggling:"🤹&zwj;♂️",man_mechanic:"👨&zwj;🔧",man_office_worker:"👨&zwj;💼",man_pilot:"👨&zwj;✈️",man_playing_handball:"🤾&zwj;♂️",man_playing_water_polo:"🤽&zwj;♂️",man_scientist:"👨&zwj;🔬",man_shrugging:"🤷&zwj;♂️",man_singer:"👨&zwj;🎤",man_student:"👨&zwj;🎓",man_teacher:"👨&zwj;🏫",man_technologist:"👨&zwj;💻",man_with_gua_pi_mao:"👲",man_with_turban:"👳",tangerine:"🍊",mans_shoe:"👞",mantelpiece_clock:"🕰",maple_leaf:"🍁",martial_arts_uniform:"🥋",mask:"😷",massage_woman:"💆",massage_man:"💆&zwj;♂️",meat_on_bone:"🍖",medal_military:"🎖",medal_sports:"🏅",mega:"📣",melon:"🍈",memo:"📝",men_wrestling:"🤼&zwj;♂️",menorah:"🕎",mens:"🚹",metal:"🤘",metro:"🚇",microphone:"🎤",microscope:"🔬",milk_glass:"🥛",milky_way:"🌌",minibus:"🚐",minidisc:"💽",mobile_phone_off:"📴",money_mouth_face:"🤑",money_with_wings:"💸",moneybag:"💰",monkey:"🐒",monkey_face:"🐵",monorail:"🚝",moon:"🌔",mortar_board:"🎓",mosque:"🕌",motor_boat:"🛥",motor_scooter:"🛵",motorcycle:"🏍",motorway:"🛣",mount_fuji:"🗻",mountain:"⛰",mountain_biking_man:"🚵",mountain_biking_woman:"🚵&zwj;♀️",mountain_cableway:"🚠",mountain_railway:"🚞",mountain_snow:"🏔",mouse:"🐭",mouse2:"🐁",movie_camera:"🎥",moyai:"🗿",mrs_claus:"🤶",muscle:"💪",mushroom:"🍄",musical_keyboard:"🎹",musical_note:"🎵",musical_score:"🎼",mute:"🔇",nail_care:"💅",name_badge:"📛",national_park:"🏞",nauseated_face:"🤢",necktie:"👔",negative_squared_cross_mark:"❎",nerd_face:"🤓",neutral_face:"😐",new:"🆕",new_moon:"🌑",new_moon_with_face:"🌚",newspaper:"📰",newspaper_roll:"🗞",next_track_button:"⏭",ng:"🆖",no_good_man:"🙅&zwj;♂️",no_good_woman:"🙅",night_with_stars:"🌃",no_bell:"🔕",no_bicycles:"🚳",no_entry:"⛔️",no_entry_sign:"🚫",no_mobile_phones:"📵",no_mouth:"😶",no_pedestrians:"🚷",no_smoking:"🚭","non-potable_water":"🚱",nose:"👃",notebook:"📓",notebook_with_decorative_cover:"📔",notes:"🎶",nut_and_bolt:"🔩",o:"⭕️",o2:"🅾️",ocean:"🌊",octopus:"🐙",oden:"🍢",office:"🏢",oil_drum:"🛢",ok:"🆗",ok_hand:"👌",ok_man:"🙆&zwj;♂️",ok_woman:"🙆",old_key:"🗝",older_man:"👴",older_woman:"👵",om:"🕉",on:"🔛",oncoming_automobile:"🚘",oncoming_bus:"🚍",oncoming_police_car:"🚔",oncoming_taxi:"🚖",open_file_folder:"📂",open_hands:"👐",open_mouth:"😮",open_umbrella:"☂️",ophiuchus:"⛎",orange_book:"📙",orthodox_cross:"☦️",outbox_tray:"📤",owl:"🦉",ox:"🐂",package:"📦",page_facing_up:"📄",page_with_curl:"📃",pager:"📟",paintbrush:"🖌",palm_tree:"🌴",pancakes:"🥞",panda_face:"🐼",paperclip:"📎",paperclips:"🖇",parasol_on_ground:"⛱",parking:"🅿️",part_alternation_mark:"〽️",partly_sunny:"⛅️",passenger_ship:"🛳",passport_control:"🛂",pause_button:"⏸",peace_symbol:"☮️",peach:"🍑",peanuts:"🥜",pear:"🍐",pen:"🖊",pencil2:"✏️",penguin:"🐧",pensive:"😔",performing_arts:"🎭",persevere:"😣",person_fencing:"🤺",pouting_woman:"🙎",phone:"☎️",pick:"⛏",pig:"🐷",pig2:"🐖",pig_nose:"🐽",pill:"💊",pineapple:"🍍",ping_pong:"🏓",pisces:"♓️",pizza:"🍕",place_of_worship:"🛐",plate_with_cutlery:"🍽",play_or_pause_button:"⏯",point_down:"👇",point_left:"👈",point_right:"👉",point_up:"☝️",point_up_2:"👆",police_car:"🚓",policewoman:"👮&zwj;♀️",poodle:"🐩",popcorn:"🍿",post_office:"🏣",postal_horn:"📯",postbox:"📮",potable_water:"🚰",potato:"🥔",pouch:"👝",poultry_leg:"🍗",pound:"💷",rage:"😡",pouting_cat:"😾",pouting_man:"🙎&zwj;♂️",pray:"🙏",prayer_beads:"📿",pregnant_woman:"🤰",previous_track_button:"⏮",prince:"🤴",princess:"👸",printer:"🖨",purple_heart:"💜",purse:"👛",pushpin:"📌",put_litter_in_its_place:"🚮",question:"❓",rabbit:"🐰",rabbit2:"🐇",racehorse:"🐎",racing_car:"🏎",radio:"📻",radio_button:"🔘",radioactive:"☢️",railway_car:"🚃",railway_track:"🛤",rainbow:"🌈",rainbow_flag:"🏳️&zwj;🌈",raised_back_of_hand:"🤚",raised_hand_with_fingers_splayed:"🖐",raised_hands:"🙌",raising_hand_woman:"🙋",raising_hand_man:"🙋&zwj;♂️",ram:"🐏",ramen:"🍜",rat:"🐀",record_button:"⏺",recycle:"♻️",red_circle:"🔴",registered:"®️",relaxed:"☺️",relieved:"😌",reminder_ribbon:"🎗",repeat:"🔁",repeat_one:"🔂",rescue_worker_helmet:"⛑",restroom:"🚻",revolving_hearts:"💞",rewind:"⏪",rhinoceros:"🦏",ribbon:"🎀",rice:"🍚",rice_ball:"🍙",rice_cracker:"🍘",rice_scene:"🎑",right_anger_bubble:"🗯",ring:"💍",robot:"🤖",rocket:"🚀",rofl:"🤣",roll_eyes:"🙄",roller_coaster:"🎢",rooster:"🐓",rose:"🌹",rosette:"🏵",rotating_light:"🚨",round_pushpin:"📍",rowing_man:"🚣",rowing_woman:"🚣&zwj;♀️",rugby_football:"🏉",running_man:"🏃",running_shirt_with_sash:"🎽",running_woman:"🏃&zwj;♀️",sa:"🈂️",sagittarius:"♐️",sake:"🍶",sandal:"👡",santa:"🎅",satellite:"📡",saxophone:"🎷",school:"🏫",school_satchel:"🎒",scissors:"✂️",scorpion:"🦂",scorpius:"♏️",scream:"😱",scream_cat:"🙀",scroll:"📜",seat:"💺",secret:"㊙️",see_no_evil:"🙈",seedling:"🌱",selfie:"🤳",shallow_pan_of_food:"🥘",shamrock:"☘️",shark:"🦈",shaved_ice:"🍧",sheep:"🐑",shell:"🐚",shield:"🛡",shinto_shrine:"⛩",ship:"🚢",shirt:"👕",shopping:"🛍",shopping_cart:"🛒",shower:"🚿",shrimp:"🦐",signal_strength:"📶",six_pointed_star:"🔯",ski:"🎿",skier:"⛷",skull:"💀",skull_and_crossbones:"☠️",sleeping:"😴",sleeping_bed:"🛌",sleepy:"😪",slightly_frowning_face:"🙁",slightly_smiling_face:"🙂",slot_machine:"🎰",small_airplane:"🛩",small_blue_diamond:"🔹",small_orange_diamond:"🔸",small_red_triangle:"🔺",small_red_triangle_down:"🔻",smile:"😄",smile_cat:"😸",smiley:"😃",smiley_cat:"😺",smiling_imp:"😈",smirk:"😏",smirk_cat:"😼",smoking:"🚬",snail:"🐌",snake:"🐍",sneezing_face:"🤧",snowboarder:"🏂",snowflake:"❄️",snowman:"⛄️",snowman_with_snow:"☃️",sob:"😭",soccer:"⚽️",soon:"🔜",sos:"🆘",sound:"🔉",space_invader:"👾",spades:"♠️",spaghetti:"🍝",sparkle:"❇️",sparkler:"🎇",sparkles:"✨",sparkling_heart:"💖",speak_no_evil:"🙊",speaker:"🔈",speaking_head:"🗣",speech_balloon:"💬",speedboat:"🚤",spider:"🕷",spider_web:"🕸",spiral_calendar:"🗓",spiral_notepad:"🗒",spoon:"🥄",squid:"🦑",stadium:"🏟",star:"⭐️",star2:"🌟",star_and_crescent:"☪️",star_of_david:"✡️",stars:"🌠",station:"🚉",statue_of_liberty:"🗽",steam_locomotive:"🚂",stew:"🍲",stop_button:"⏹",stop_sign:"🛑",stopwatch:"⏱",straight_ruler:"📏",strawberry:"🍓",stuck_out_tongue:"😛",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue_winking_eye:"😜",studio_microphone:"🎙",stuffed_flatbread:"🥙",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",sun_behind_small_cloud:"🌤",sun_with_face:"🌞",sunflower:"🌻",sunglasses:"😎",sunny:"☀️",sunrise:"🌅",sunrise_over_mountains:"🌄",surfing_man:"🏄",surfing_woman:"🏄&zwj;♀️",sushi:"🍣",suspension_railway:"🚟",sweat:"😓",sweat_drops:"💦",sweat_smile:"😅",sweet_potato:"🍠",swimming_man:"🏊",swimming_woman:"🏊&zwj;♀️",symbols:"🔣",synagogue:"🕍",syringe:"💉",taco:"🌮",tada:"🎉",tanabata_tree:"🎋",taurus:"♉️",taxi:"🚕",tea:"🍵",telephone_receiver:"📞",telescope:"🔭",tennis:"🎾",tent:"⛺️",thermometer:"🌡",thinking:"🤔",thought_balloon:"💭",ticket:"🎫",tickets:"🎟",tiger:"🐯",tiger2:"🐅",timer_clock:"⏲",tipping_hand_man:"💁&zwj;♂️",tired_face:"😫",tm:"™️",toilet:"🚽",tokyo_tower:"🗼",tomato:"🍅",tongue:"👅",top:"🔝",tophat:"🎩",tornado:"🌪",trackball:"🖲",tractor:"🚜",traffic_light:"🚥",train:"🚋",train2:"🚆",tram:"🚊",triangular_flag_on_post:"🚩",triangular_ruler:"📐",trident:"🔱",triumph:"😤",trolleybus:"🚎",trophy:"🏆",tropical_drink:"🍹",tropical_fish:"🐠",truck:"🚚",trumpet:"🎺",tulip:"🌷",tumbler_glass:"🥃",turkey:"🦃",turtle:"🐢",tv:"📺",twisted_rightwards_arrows:"🔀",two_hearts:"💕",two_men_holding_hands:"👬",two_women_holding_hands:"👭",u5272:"🈹",u5408:"🈴",u55b6:"🈺",u6307:"🈯️",u6708:"🈷️",u6709:"🈶",u6e80:"🈵",u7121:"🈚️",u7533:"🈸",u7981:"🈲",u7a7a:"🈳",umbrella:"☔️",unamused:"😒",underage:"🔞",unicorn:"🦄",unlock:"🔓",up:"🆙",upside_down_face:"🙃",v:"✌️",vertical_traffic_light:"🚦",vhs:"📼",vibration_mode:"📳",video_camera:"📹",video_game:"🎮",violin:"🎻",virgo:"♍️",volcano:"🌋",volleyball:"🏐",vs:"🆚",vulcan_salute:"🖖",walking_man:"🚶",walking_woman:"🚶&zwj;♀️",waning_crescent_moon:"🌘",waning_gibbous_moon:"🌖",warning:"⚠️",wastebasket:"🗑",watch:"⌚️",water_buffalo:"🐃",watermelon:"🍉",wave:"👋",wavy_dash:"〰️",waxing_crescent_moon:"🌒",wc:"🚾",weary:"😩",wedding:"💒",weight_lifting_man:"🏋️",weight_lifting_woman:"🏋️&zwj;♀️",whale:"🐳",whale2:"🐋",wheel_of_dharma:"☸️",wheelchair:"♿️",white_check_mark:"✅",white_circle:"⚪️",white_flag:"🏳️",white_flower:"💮",white_large_square:"⬜️",white_medium_small_square:"◽️",white_medium_square:"◻️",white_small_square:"▫️",white_square_button:"🔳",wilted_flower:"🥀",wind_chime:"🎐",wind_face:"🌬",wine_glass:"🍷",wink:"😉",wolf:"🐺",woman:"👩",woman_artist:"👩&zwj;🎨",woman_astronaut:"👩&zwj;🚀",woman_cartwheeling:"🤸&zwj;♀️",woman_cook:"👩&zwj;🍳",woman_facepalming:"🤦&zwj;♀️",woman_factory_worker:"👩&zwj;🏭",woman_farmer:"👩&zwj;🌾",woman_firefighter:"👩&zwj;🚒",woman_health_worker:"👩&zwj;⚕️",woman_judge:"👩&zwj;⚖️",woman_juggling:"🤹&zwj;♀️",woman_mechanic:"👩&zwj;🔧",woman_office_worker:"👩&zwj;💼",woman_pilot:"👩&zwj;✈️",woman_playing_handball:"🤾&zwj;♀️",woman_playing_water_polo:"🤽&zwj;♀️",woman_scientist:"👩&zwj;🔬",woman_shrugging:"🤷&zwj;♀️",woman_singer:"👩&zwj;🎤",woman_student:"👩&zwj;🎓",woman_teacher:"👩&zwj;🏫",woman_technologist:"👩&zwj;💻",woman_with_turban:"👳&zwj;♀️",womans_clothes:"👚",womans_hat:"👒",women_wrestling:"🤼&zwj;♀️",womens:"🚺",world_map:"🗺",worried:"😟",wrench:"🔧",writing_hand:"✍️",x:"❌",yellow_heart:"💛",yen:"💴",yin_yang:"☯️",yum:"😋",zap:"⚡️",zipper_mouth_face:"🤐",zzz:"💤",octocat:'<img alt=":octocat:" height="20" width="20" align="absmiddle" src="https://assets-cdn.github.com/images/icons/emoji/octocat.png">',showdown:"<span style=\"font-family: 'Anonymous Pro', monospace; text-decoration: underline; text-decoration-style: dashed; text-decoration-color: #3e8b8a;text-underline-position: under;\">S</span>"},i.Converter=function(e){"use strict"
var t={},r=[],n=[],o={},s=l,p={parsed:{},raw:"",format:""}
function f(e,t){if(t=t||null,i.helper.isString(e)){if(t=e=i.helper.stdExtName(e),i.extensions[e])return console.warn("DEPRECATION WARNING: "+e+" is an old extension that uses a deprecated loading method.Please inform the developer that the extension should be updated!"),void function(e,t){"function"==typeof e&&(e=e(new i.Converter)),i.helper.isArray(e)||(e=[e])
var a=h(e,t)
if(!a.valid)throw Error(a.error)
for(var o=0;o<e.length;++o)switch(e[o].type){case"lang":r.push(e[o])
break
case"output":n.push(e[o])
break
default:throw Error("Extension loader error: Type unrecognized!!!")}}(i.extensions[e],e)
if(i.helper.isUndefined(c[e]))throw Error('Extension "'+e+'" could not be loaded. It was either not found or is not a valid extension.')
e=c[e]}"function"==typeof e&&(e=e()),i.helper.isArray(e)||(e=[e])
var a=h(e,t)
if(!a.valid)throw Error(a.error)
for(var o=0;o<e.length;++o){switch(e[o].type){case"lang":r.push(e[o])
break
case"output":n.push(e[o])}if(e[o].hasOwnProperty("listeners"))for(var s in e[o].listeners)e[o].listeners.hasOwnProperty(s)&&m(s,e[o].listeners[s])}}function m(e,t){if(!i.helper.isString(e))throw Error("Invalid argument in converter.listen() method: name must be a string, but "+a(e)+" given")
if("function"!=typeof t)throw Error("Invalid argument in converter.listen() method: callback must be a function, but "+a(t)+" given")
o.hasOwnProperty(e)||(o[e]=[]),o[e].push(t)}!function(){for(var r in e=e||{},u)u.hasOwnProperty(r)&&(t[r]=u[r])
if("object"!==a(e))throw Error("Converter expects the passed parameter to be an object, but "+a(e)+" was passed instead.")
for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])
t.extensions&&i.helper.forEach(t.extensions,f)}(),this._dispatch=function(e,t,r,n){if(o.hasOwnProperty(e))for(var a=0;a<o[e].length;++a){var i=o[e][a](e,t,this,r,n)
i&&void 0!==i&&(t=i)}return t},this.listen=function(e,t){return m(e,t),this},this.makeHtml=function(e){if(!e)return e
var a={gHtmlBlocks:[],gHtmlMdBlocks:[],gHtmlSpans:[],gUrls:{},gTitles:{},gDimensions:{},gListLevel:0,hashLinkCounts:{},langExtensions:r,outputModifiers:n,converter:this,ghCodeBlocks:[],metadata:{parsed:{},raw:"",format:""}}
return e=(e=(e=(e=(e=e.replace(/¨/g,"¨T")).replace(/\$/g,"¨D")).replace(/\r\n/g,"\n")).replace(/\r/g,"\n")).replace(/\u00A0/g,"&nbsp;"),t.smartIndentationFix&&(e=function(e){var t=e.match(/^\s*/)[0].length,r=new RegExp("^\\s{0,"+t+"}","gm")
return e.replace(r,"")}(e)),e="\n\n"+e+"\n\n",e=(e=i.subParser("detab")(e,t,a)).replace(/^[ \t]+$/gm,""),i.helper.forEach(r,(function(r){e=i.subParser("runExtension")(r,e,t,a)})),e=i.subParser("metadata")(e,t,a),e=i.subParser("hashPreCodeTags")(e,t,a),e=i.subParser("githubCodeBlocks")(e,t,a),e=i.subParser("hashHTMLBlocks")(e,t,a),e=i.subParser("hashCodeTags")(e,t,a),e=i.subParser("stripLinkDefinitions")(e,t,a),e=i.subParser("blockGamut")(e,t,a),e=i.subParser("unhashHTMLSpans")(e,t,a),e=(e=(e=i.subParser("unescapeSpecialChars")(e,t,a)).replace(/¨D/g,"$$")).replace(/¨T/g,"¨"),e=i.subParser("completeHTMLDocument")(e,t,a),i.helper.forEach(n,(function(r){e=i.subParser("runExtension")(r,e,t,a)})),p=a.metadata,e},this.makeMarkdown=this.makeMd=function(e,t){if(e=(e=(e=e.replace(/\r\n/g,"\n")).replace(/\r/g,"\n")).replace(/>[ \t]+</,">¨NBSP;<"),!t){if(!window||!window.document)throw new Error("HTMLParser is undefined. If in a webworker or nodejs environment, you need to provide a WHATWG DOM and HTML such as JSDOM")
t=window.document}var r=t.createElement("div")
r.innerHTML=e
var n={preList:function(e){for(var t=e.querySelectorAll("pre"),r=[],n=0;n<t.length;++n)if(1===t[n].childElementCount&&"code"===t[n].firstChild.tagName.toLowerCase()){var a=t[n].firstChild.innerHTML.trim(),o=t[n].firstChild.getAttribute("data-language")||""
if(""===o)for(var s=t[n].firstChild.className.split(" "),c=0;c<s.length;++c){var u=s[c].match(/^language-(.+)$/)
if(null!==u){o=u[1]
break}}a=i.helper.unescapeHTMLEntities(a),r.push(a),t[n].outerHTML='<precode language="'+o+'" precodenum="'+n.toString()+'"></precode>'}else r.push(t[n].innerHTML),t[n].innerHTML="",t[n].setAttribute("prenum",n.toString())
return r}(r)}
!function e(t){for(var r=0;r<t.childNodes.length;++r){var n=t.childNodes[r]
3===n.nodeType?/\S/.test(n.nodeValue)?(n.nodeValue=n.nodeValue.split("\n").join(" "),n.nodeValue=n.nodeValue.replace(/(\s)+/g,"$1")):(t.removeChild(n),--r):1===n.nodeType&&e(n)}}(r)
for(var a=r.childNodes,o="",s=0;s<a.length;s++)o+=i.subParser("makeMarkdown.node")(a[s],n)
return o},this.setOption=function(e,r){t[e]=r},this.getOption=function(e){return t[e]},this.getOptions=function(){return t},this.addExtension=function(e,t){f(e,t=t||null)},this.useExtension=function(e){f(e)},this.setFlavor=function(e){if(!d.hasOwnProperty(e))throw Error(e+" flavor was not found")
var r=d[e]
for(var n in s=e,r)r.hasOwnProperty(n)&&(t[n]=r[n])},this.getFlavor=function(){return s},this.removeExtension=function(e){i.helper.isArray(e)||(e=[e])
for(var t=0;t<e.length;++t){for(var a=e[t],o=0;o<r.length;++o)r[o]===a&&r[o].splice(o,1)
for(;0<n.length;++o)n[0]===a&&n[0].splice(o,1)}},this.getAllExtensions=function(){return{language:r,output:n}},this.getMetadata=function(e){return e?p.raw:p.parsed},this.getMetadataFormat=function(){return p.format},this._setMetadataPair=function(e,t){p.parsed[e]=t},this._setMetadataFormat=function(e){p.format=e},this._setMetadataRaw=function(e){p.raw=e}},i.subParser("anchors",(function(e,t,r){"use strict"
var n=function(e,n,a,o,s,c,u){if(i.helper.isUndefined(u)&&(u=""),a=a.toLowerCase(),e.search(/\(<?\s*>? ?(['"].*['"])?\)$/m)>-1)o=""
else if(!o){if(a||(a=n.toLowerCase().replace(/ ?\n/g," ")),o="#"+a,i.helper.isUndefined(r.gUrls[a]))return e
o=r.gUrls[a],i.helper.isUndefined(r.gTitles[a])||(u=r.gTitles[a])}var l='<a href="'+(o=o.replace(i.helper.regexes.asteriskDashAndColon,i.helper.escapeCharactersCallback))+'"'
return""!==u&&null!==u&&(l+=' title="'+(u=(u=u.replace(/"/g,"&quot;")).replace(i.helper.regexes.asteriskDashAndColon,i.helper.escapeCharactersCallback))+'"'),t.openLinksInNewWindow&&!/^#/.test(o)&&(l+=' rel="noopener noreferrer" target="¨E95Eblank"'),l+">"+n+"</a>"}
return e=(e=(e=(e=(e=r.converter._dispatch("anchors.before",e,t,r)).replace(/\[((?:\[[^\]]*]|[^\[\]])*)] ?(?:\n *)?\[(.*?)]()()()()/g,n)).replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<([^>]*)>(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,n)).replace(/\[((?:\[[^\]]*]|[^\[\]])*)]()[ \t]*\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?:[ \t]*((["'])([^"]*?)\5))?[ \t]?\)/g,n)).replace(/\[([^\[\]]+)]()()()()()/g,n),t.ghMentions&&(e=e.replace(/(^|\s)(\\)?(@([a-z\d]+(?:[a-z\d.-]+?[a-z\d]+)*))/gim,(function(e,r,n,a,o){if("\\"===n)return r+a
if(!i.helper.isString(t.ghMentionsLink))throw new Error("ghMentionsLink option must be a string")
var s=t.ghMentionsLink.replace(/\{u}/g,o),c=""
return t.openLinksInNewWindow&&(c=' rel="noopener noreferrer" target="¨E95Eblank"'),r+'<a href="'+s+'"'+c+">"+a+"</a>"}))),r.converter._dispatch("anchors.after",e,t,r)}))
var m=/([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+?\.[^'">\s]+?)()(\1)?(?=\s|$)(?!["<>])/gi,g=/([*~_]+|\b)(((https?|ftp|dict):\/\/|www\.)[^'">\s]+\.[^'">\s]+?)([.!?,()\[\]])?(\1)?(?=\s|$)(?!["<>])/gi,b=/()<(((https?|ftp|dict):\/\/|www\.)[^'">\s]+)()>()/gi,_=/(^|\s)(?:mailto:)?([A-Za-z0-9!#$%&'*+-/=?^_`{|}~.]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)(?=$|\s)/gim,w=/<()(?:mailto:)?([-.\w]+@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,v=function(e){"use strict"
return function(t,r,n,a,o,s,c){var u=n=n.replace(i.helper.regexes.asteriskDashAndColon,i.helper.escapeCharactersCallback),l="",d="",h=r||"",p=c||""
return/^www\./i.test(n)&&(n=n.replace(/^www\./i,"http://www.")),e.excludeTrailingPunctuationFromURLs&&s&&(l=s),e.openLinksInNewWindow&&(d=' rel="noopener noreferrer" target="¨E95Eblank"'),h+'<a href="'+n+'"'+d+">"+u+"</a>"+l+p}},y=function(e,t){"use strict"
return function(r,n,a){var o="mailto:"
return n=n||"",a=i.subParser("unescapeSpecialChars")(a,e,t),e.encodeEmails?(o=i.helper.encodeEmailAddress(o+a),a=i.helper.encodeEmailAddress(a)):o+=a,n+'<a href="'+o+'">'+a+"</a>"}}
i.subParser("autoLinks",(function(e,t,r){"use strict"
return e=(e=(e=r.converter._dispatch("autoLinks.before",e,t,r)).replace(b,v(t))).replace(w,y(t,r)),r.converter._dispatch("autoLinks.after",e,t,r)})),i.subParser("simplifiedAutoLinks",(function(e,t,r){"use strict"
return t.simplifiedAutoLink?(e=r.converter._dispatch("simplifiedAutoLinks.before",e,t,r),e=(e=t.excludeTrailingPunctuationFromURLs?e.replace(g,v(t)):e.replace(m,v(t))).replace(_,y(t,r)),e=r.converter._dispatch("simplifiedAutoLinks.after",e,t,r)):e})),i.subParser("blockGamut",(function(e,t,r){"use strict"
return e=r.converter._dispatch("blockGamut.before",e,t,r),e=i.subParser("blockQuotes")(e,t,r),e=i.subParser("headers")(e,t,r),e=i.subParser("horizontalRule")(e,t,r),e=i.subParser("lists")(e,t,r),e=i.subParser("codeBlocks")(e,t,r),e=i.subParser("tables")(e,t,r),e=i.subParser("hashHTMLBlocks")(e,t,r),e=i.subParser("paragraphs")(e,t,r),r.converter._dispatch("blockGamut.after",e,t,r)})),i.subParser("blockQuotes",(function(e,t,r){"use strict"
e=r.converter._dispatch("blockQuotes.before",e,t,r),e+="\n\n"
var n=/(^ {0,3}>[ \t]?.+\n(.+\n)*\n*)+/gm
return t.splitAdjacentBlockquotes&&(n=/^ {0,3}>[\s\S]*?(?:\n\n)/gm),e=e.replace(n,(function(e){return e=(e=(e=e.replace(/^[ \t]*>[ \t]?/gm,"")).replace(/¨0/g,"")).replace(/^[ \t]+$/gm,""),e=i.subParser("githubCodeBlocks")(e,t,r),e=(e=(e=i.subParser("blockGamut")(e,t,r)).replace(/(^|\n)/g,"$1  ")).replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,(function(e,t){return t.replace(/^  /gm,"¨0").replace(/¨0/g,"")})),i.subParser("hashBlock")("<blockquote>\n"+e+"\n</blockquote>",t,r)})),r.converter._dispatch("blockQuotes.after",e,t,r)})),i.subParser("codeBlocks",(function(e,t,r){"use strict"
return e=r.converter._dispatch("codeBlocks.before",e,t,r),e=(e=(e+="¨0").replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=¨0))/g,(function(e,n,a){var o=n,s=a,c="\n"
return o=i.subParser("outdent")(o,t,r),o=i.subParser("encodeCode")(o,t,r),o=(o=(o=i.subParser("detab")(o,t,r)).replace(/^\n+/g,"")).replace(/\n+$/g,""),t.omitExtraWLInCodeBlocks&&(c=""),o="<pre><code>"+o+c+"</code></pre>",i.subParser("hashBlock")(o,t,r)+s}))).replace(/¨0/,""),r.converter._dispatch("codeBlocks.after",e,t,r)})),i.subParser("codeSpans",(function(e,t,r){"use strict"
return void 0===(e=r.converter._dispatch("codeSpans.before",e,t,r))&&(e=""),e=e.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,(function(e,n,a,o){var s=o
return s=(s=s.replace(/^([ \t]*)/g,"")).replace(/[ \t]*$/g,""),s=n+"<code>"+(s=i.subParser("encodeCode")(s,t,r))+"</code>",i.subParser("hashHTMLSpans")(s,t,r)})),r.converter._dispatch("codeSpans.after",e,t,r)})),i.subParser("completeHTMLDocument",(function(e,t,r){"use strict"
if(!t.completeHTMLDocument)return e
e=r.converter._dispatch("completeHTMLDocument.before",e,t,r)
var n="html",a="<!DOCTYPE HTML>\n",o="",i='<meta charset="utf-8">\n',s="",c=""
for(var u in void 0!==r.metadata.parsed.doctype&&(a="<!DOCTYPE "+r.metadata.parsed.doctype+">\n","html"!==(n=r.metadata.parsed.doctype.toString().toLowerCase())&&"html5"!==n||(i='<meta charset="utf-8">')),r.metadata.parsed)if(r.metadata.parsed.hasOwnProperty(u))switch(u.toLowerCase()){case"doctype":break
case"title":o="<title>"+r.metadata.parsed.title+"</title>\n"
break
case"charset":i="html"===n||"html5"===n?'<meta charset="'+r.metadata.parsed.charset+'">\n':'<meta name="charset" content="'+r.metadata.parsed.charset+'">\n'
break
case"language":case"lang":s=' lang="'+r.metadata.parsed[u]+'"',c+='<meta name="'+u+'" content="'+r.metadata.parsed[u]+'">\n'
break
default:c+='<meta name="'+u+'" content="'+r.metadata.parsed[u]+'">\n'}return e=a+"<html"+s+">\n<head>\n"+o+i+c+"</head>\n<body>\n"+e.trim()+"\n</body>\n</html>",r.converter._dispatch("completeHTMLDocument.after",e,t,r)})),i.subParser("detab",(function(e,t,r){"use strict"
return e=(e=(e=(e=(e=(e=r.converter._dispatch("detab.before",e,t,r)).replace(/\t(?=\t)/g,"    ")).replace(/\t/g,"¨A¨B")).replace(/¨B(.+?)¨A/g,(function(e,t){for(var r=t,n=4-r.length%4,a=0;a<n;a++)r+=" "
return r}))).replace(/¨A/g,"    ")).replace(/¨B/g,""),r.converter._dispatch("detab.after",e,t,r)})),i.subParser("ellipsis",(function(e,t,r){"use strict"
return e=(e=r.converter._dispatch("ellipsis.before",e,t,r)).replace(/\.\.\./g,"…"),r.converter._dispatch("ellipsis.after",e,t,r)})),i.subParser("emoji",(function(e,t,r){"use strict"
return t.emoji?(e=(e=r.converter._dispatch("emoji.before",e,t,r)).replace(/:([\S]+?):/g,(function(e,t){return i.helper.emojis.hasOwnProperty(t)?i.helper.emojis[t]:e})),r.converter._dispatch("emoji.after",e,t,r)):e})),i.subParser("encodeAmpsAndAngles",(function(e,t,r){"use strict"
return e=(e=(e=(e=(e=r.converter._dispatch("encodeAmpsAndAngles.before",e,t,r)).replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;")).replace(/<(?![a-z\/?$!])/gi,"&lt;")).replace(/</g,"&lt;")).replace(/>/g,"&gt;"),r.converter._dispatch("encodeAmpsAndAngles.after",e,t,r)})),i.subParser("encodeBackslashEscapes",(function(e,t,r){"use strict"
return e=(e=(e=r.converter._dispatch("encodeBackslashEscapes.before",e,t,r)).replace(/\\(\\)/g,i.helper.escapeCharactersCallback)).replace(/\\([`*_{}\[\]()>#+.!~=|-])/g,i.helper.escapeCharactersCallback),r.converter._dispatch("encodeBackslashEscapes.after",e,t,r)})),i.subParser("encodeCode",(function(e,t,r){"use strict"
return e=(e=r.converter._dispatch("encodeCode.before",e,t,r)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/([*_{}\[\]\\=~-])/g,i.helper.escapeCharactersCallback),r.converter._dispatch("encodeCode.after",e,t,r)})),i.subParser("escapeSpecialCharsWithinTagAttributes",(function(e,t,r){"use strict"
return e=(e=(e=r.converter._dispatch("escapeSpecialCharsWithinTagAttributes.before",e,t,r)).replace(/<\/?[a-z\d_:-]+(?:[\s]+[\s\S]+?)?>/gi,(function(e){return e.replace(/(.)<\/?code>(?=.)/g,"$1`").replace(/([\\`*_~=|])/g,i.helper.escapeCharactersCallback)}))).replace(/<!(--(?:(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>/gi,(function(e){return e.replace(/([\\`*_~=|])/g,i.helper.escapeCharactersCallback)})),r.converter._dispatch("escapeSpecialCharsWithinTagAttributes.after",e,t,r)})),i.subParser("githubCodeBlocks",(function(e,t,r){"use strict"
return t.ghCodeBlocks?(e=r.converter._dispatch("githubCodeBlocks.before",e,t,r),e=(e=(e+="¨0").replace(/(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*)\n([\s\S]*?)\n(?: {0,3})\1/g,(function(e,n,a,o){var s=t.omitExtraWLInCodeBlocks?"":"\n"
return o=i.subParser("encodeCode")(o,t,r),o="<pre><code"+(a?' class="'+a+" language-"+a+'"':"")+">"+(o=(o=(o=i.subParser("detab")(o,t,r)).replace(/^\n+/g,"")).replace(/\n+$/g,""))+s+"</code></pre>",o=i.subParser("hashBlock")(o,t,r),"\n\n¨G"+(r.ghCodeBlocks.push({text:e,codeblock:o})-1)+"G\n\n"}))).replace(/¨0/,""),r.converter._dispatch("githubCodeBlocks.after",e,t,r)):e})),i.subParser("hashBlock",(function(e,t,r){"use strict"
return e=(e=r.converter._dispatch("hashBlock.before",e,t,r)).replace(/(^\n+|\n+$)/g,""),e="\n\n¨K"+(r.gHtmlBlocks.push(e)-1)+"K\n\n",r.converter._dispatch("hashBlock.after",e,t,r)})),i.subParser("hashCodeTags",(function(e,t,r){"use strict"
return e=r.converter._dispatch("hashCodeTags.before",e,t,r),e=i.helper.replaceRecursiveRegExp(e,(function(e,n,a,o){var s=a+i.subParser("encodeCode")(n,t,r)+o
return"¨C"+(r.gHtmlSpans.push(s)-1)+"C"}),"<code\\b[^>]*>","</code>","gim"),r.converter._dispatch("hashCodeTags.after",e,t,r)})),i.subParser("hashElement",(function(e,t,r){"use strict"
return function(e,t){var n=t
return n=(n=(n=n.replace(/\n\n/g,"\n")).replace(/^\n/,"")).replace(/\n+$/g,""),"\n\n¨K"+(r.gHtmlBlocks.push(n)-1)+"K\n\n"}})),i.subParser("hashHTMLBlocks",(function(e,t,r){"use strict"
e=r.converter._dispatch("hashHTMLBlocks.before",e,t,r)
var n=["pre","div","h1","h2","h3","h4","h5","h6","blockquote","table","dl","ol","ul","script","noscript","form","fieldset","iframe","math","style","section","header","footer","nav","article","aside","address","audio","canvas","figure","hgroup","output","video","p"],a=function(e,t,n,a){var o=e
return-1!==n.search(/\bmarkdown\b/)&&(o=n+r.converter.makeHtml(t)+a),"\n\n¨K"+(r.gHtmlBlocks.push(o)-1)+"K\n\n"}
t.backslashEscapesHTMLTags&&(e=e.replace(/\\<(\/?[^>]+?)>/g,(function(e,t){return"&lt;"+t+"&gt;"})))
for(var o=0;o<n.length;++o)for(var s,c=new RegExp("^ {0,3}(<"+n[o]+"\\b[^>]*>)","im"),u="<"+n[o]+"\\b[^>]*>",l="</"+n[o]+">";-1!==(s=i.helper.regexIndexOf(e,c));){var d=i.helper.splitAtIndex(e,s),h=i.helper.replaceRecursiveRegExp(d[1],a,u,l,"im")
if(h===d[1])break
e=d[0].concat(h)}return e=e.replace(/(\n {0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,i.subParser("hashElement")(e,t,r)),e=(e=i.helper.replaceRecursiveRegExp(e,(function(e){return"\n\n¨K"+(r.gHtmlBlocks.push(e)-1)+"K\n\n"}),"^ {0,3}\x3c!--","--\x3e","gm")).replace(/(?:\n\n)( {0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,i.subParser("hashElement")(e,t,r)),r.converter._dispatch("hashHTMLBlocks.after",e,t,r)})),i.subParser("hashHTMLSpans",(function(e,t,r){"use strict"
function n(e){return"¨C"+(r.gHtmlSpans.push(e)-1)+"C"}return e=(e=(e=(e=(e=r.converter._dispatch("hashHTMLSpans.before",e,t,r)).replace(/<[^>]+?\/>/gi,(function(e){return n(e)}))).replace(/<([^>]+?)>[\s\S]*?<\/\1>/g,(function(e){return n(e)}))).replace(/<([^>]+?)\s[^>]+?>[\s\S]*?<\/\1>/g,(function(e){return n(e)}))).replace(/<[^>]+?>/gi,(function(e){return n(e)})),r.converter._dispatch("hashHTMLSpans.after",e,t,r)})),i.subParser("unhashHTMLSpans",(function(e,t,r){"use strict"
e=r.converter._dispatch("unhashHTMLSpans.before",e,t,r)
for(var n=0;n<r.gHtmlSpans.length;++n){for(var a=r.gHtmlSpans[n],o=0;/¨C(\d+)C/.test(a);){var i=RegExp.$1
if(a=a.replace("¨C"+i+"C",r.gHtmlSpans[i]),10===o){console.error("maximum nesting of 10 spans reached!!!")
break}++o}e=e.replace("¨C"+n+"C",a)}return r.converter._dispatch("unhashHTMLSpans.after",e,t,r)})),i.subParser("hashPreCodeTags",(function(e,t,r){"use strict"
return e=r.converter._dispatch("hashPreCodeTags.before",e,t,r),e=i.helper.replaceRecursiveRegExp(e,(function(e,n,a,o){var s=a+i.subParser("encodeCode")(n,t,r)+o
return"\n\n¨G"+(r.ghCodeBlocks.push({text:e,codeblock:s})-1)+"G\n\n"}),"^ {0,3}<pre\\b[^>]*>\\s*<code\\b[^>]*>","^ {0,3}</code>\\s*</pre>","gim"),r.converter._dispatch("hashPreCodeTags.after",e,t,r)})),i.subParser("headers",(function(e,t,r){"use strict"
e=r.converter._dispatch("headers.before",e,t,r)
var n=isNaN(parseInt(t.headerLevelStart))?1:parseInt(t.headerLevelStart),a=t.smoothLivePreview?/^(.+)[ \t]*\n={2,}[ \t]*\n+/gm:/^(.+)[ \t]*\n=+[ \t]*\n+/gm,o=t.smoothLivePreview?/^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm:/^(.+)[ \t]*\n-+[ \t]*\n+/gm
e=(e=e.replace(a,(function(e,a){var o=i.subParser("spanGamut")(a,t,r),s=t.noHeaderId?"":' id="'+c(a)+'"',u="<h"+n+s+">"+o+"</h"+n+">"
return i.subParser("hashBlock")(u,t,r)}))).replace(o,(function(e,a){var o=i.subParser("spanGamut")(a,t,r),s=t.noHeaderId?"":' id="'+c(a)+'"',u=n+1,l="<h"+u+s+">"+o+"</h"+u+">"
return i.subParser("hashBlock")(l,t,r)}))
var s=t.requireSpaceBeforeHeadingText?/^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm:/^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm
function c(e){var n,a
if(t.customizedHeaderId){var o=e.match(/\{([^{]+?)}\s*$/)
o&&o[1]&&(e=o[1])}return n=e,a=i.helper.isString(t.prefixHeaderId)?t.prefixHeaderId:!0===t.prefixHeaderId?"section-":"",t.rawPrefixHeaderId||(n=a+n),n=t.ghCompatibleHeaderId?n.replace(/ /g,"-").replace(/&amp;/g,"").replace(/¨T/g,"").replace(/¨D/g,"").replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g,"").toLowerCase():t.rawHeaderId?n.replace(/ /g,"-").replace(/&amp;/g,"&").replace(/¨T/g,"¨").replace(/¨D/g,"$").replace(/["']/g,"-").toLowerCase():n.replace(/[^\w]/g,"").toLowerCase(),t.rawPrefixHeaderId&&(n=a+n),r.hashLinkCounts[n]?n=n+"-"+r.hashLinkCounts[n]++:r.hashLinkCounts[n]=1,n}return e=e.replace(s,(function(e,a,o){var s=o
t.customizedHeaderId&&(s=o.replace(/\s?\{([^{]+?)}\s*$/,""))
var u=i.subParser("spanGamut")(s,t,r),l=t.noHeaderId?"":' id="'+c(o)+'"',d=n-1+a.length,h="<h"+d+l+">"+u+"</h"+d+">"
return i.subParser("hashBlock")(h,t,r)})),r.converter._dispatch("headers.after",e,t,r)})),i.subParser("horizontalRule",(function(e,t,r){"use strict"
e=r.converter._dispatch("horizontalRule.before",e,t,r)
var n=i.subParser("hashBlock")("<hr />",t,r)
return e=(e=(e=e.replace(/^ {0,2}( ?-){3,}[ \t]*$/gm,n)).replace(/^ {0,2}( ?\*){3,}[ \t]*$/gm,n)).replace(/^ {0,2}( ?_){3,}[ \t]*$/gm,n),r.converter._dispatch("horizontalRule.after",e,t,r)})),i.subParser("images",(function(e,t,r){"use strict"
function n(e,t,n,a,o,s,c,u){var l=r.gUrls,d=r.gTitles,h=r.gDimensions
if(n=n.toLowerCase(),u||(u=""),e.search(/\(<?\s*>? ?(['"].*['"])?\)$/m)>-1)a=""
else if(""===a||null===a){if(""!==n&&null!==n||(n=t.toLowerCase().replace(/ ?\n/g," ")),a="#"+n,i.helper.isUndefined(l[n]))return e
a=l[n],i.helper.isUndefined(d[n])||(u=d[n]),i.helper.isUndefined(h[n])||(o=h[n].width,s=h[n].height)}t=t.replace(/"/g,"&quot;").replace(i.helper.regexes.asteriskDashAndColon,i.helper.escapeCharactersCallback)
var p='<img src="'+(a=a.replace(i.helper.regexes.asteriskDashAndColon,i.helper.escapeCharactersCallback))+'" alt="'+t+'"'
return u&&i.helper.isString(u)&&(p+=' title="'+(u=u.replace(/"/g,"&quot;").replace(i.helper.regexes.asteriskDashAndColon,i.helper.escapeCharactersCallback))+'"'),o&&s&&(p+=' width="'+(o="*"===o?"auto":o)+'"',p+=' height="'+(s="*"===s?"auto":s)+'"'),p+" />"}return e=(e=(e=(e=(e=(e=r.converter._dispatch("images.before",e,t,r)).replace(/!\[([^\]]*?)] ?(?:\n *)?\[([\s\S]*?)]()()()()()/g,n)).replace(/!\[([^\]]*?)][ \t]*()\([ \t]?<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g,(function(e,t,r,a,o,i,s,c){return n(e,t,r,a=a.replace(/\s/g,""),o,i,0,c)}))).replace(/!\[([^\]]*?)][ \t]*()\([ \t]?<([^>]*)>(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(?:(["'])([^"]*?)\6))?[ \t]?\)/g,n)).replace(/!\[([^\]]*?)][ \t]*()\([ \t]?<?([\S]+?(?:\([\S]*?\)[\S]*?)?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*(?:(["'])([^"]*?)\6)?[ \t]?\)/g,n)).replace(/!\[([^\[\]]+)]()()()()()/g,n),r.converter._dispatch("images.after",e,t,r)})),i.subParser("italicsAndBold",(function(e,t,r){"use strict"
function n(e,t,r){return t+e+r}return e=r.converter._dispatch("italicsAndBold.before",e,t,r),e=t.literalMidWordUnderscores?(e=(e=e.replace(/\b___(\S[\s\S]*?)___\b/g,(function(e,t){return n(t,"<strong><em>","</em></strong>")}))).replace(/\b__(\S[\s\S]*?)__\b/g,(function(e,t){return n(t,"<strong>","</strong>")}))).replace(/\b_(\S[\s\S]*?)_\b/g,(function(e,t){return n(t,"<em>","</em>")})):(e=(e=e.replace(/___(\S[\s\S]*?)___/g,(function(e,t){return/\S$/.test(t)?n(t,"<strong><em>","</em></strong>"):e}))).replace(/__(\S[\s\S]*?)__/g,(function(e,t){return/\S$/.test(t)?n(t,"<strong>","</strong>"):e}))).replace(/_([^\s_][\s\S]*?)_/g,(function(e,t){return/\S$/.test(t)?n(t,"<em>","</em>"):e})),e=t.literalMidWordAsterisks?(e=(e=e.replace(/([^*]|^)\B\*\*\*(\S[\s\S]*?)\*\*\*\B(?!\*)/g,(function(e,t,r){return n(r,t+"<strong><em>","</em></strong>")}))).replace(/([^*]|^)\B\*\*(\S[\s\S]*?)\*\*\B(?!\*)/g,(function(e,t,r){return n(r,t+"<strong>","</strong>")}))).replace(/([^*]|^)\B\*(\S[\s\S]*?)\*\B(?!\*)/g,(function(e,t,r){return n(r,t+"<em>","</em>")})):(e=(e=e.replace(/\*\*\*(\S[\s\S]*?)\*\*\*/g,(function(e,t){return/\S$/.test(t)?n(t,"<strong><em>","</em></strong>"):e}))).replace(/\*\*(\S[\s\S]*?)\*\*/g,(function(e,t){return/\S$/.test(t)?n(t,"<strong>","</strong>"):e}))).replace(/\*([^\s*][\s\S]*?)\*/g,(function(e,t){return/\S$/.test(t)?n(t,"<em>","</em>"):e})),r.converter._dispatch("italicsAndBold.after",e,t,r)})),i.subParser("lists",(function(e,t,r){"use strict"
function n(e,n){r.gListLevel++,e=e.replace(/\n{2,}$/,"\n")
var a=/(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0| {0,3}([*+-]|\d+[.])[ \t]+))/gm,o=/\n[ \t]*\n(?!¨0)/.test(e+="¨0")
return t.disableForced4SpacesIndentedSublists&&(a=/(\n)?(^ {0,3})([*+-]|\d+[.])[ \t]+((\[(x|X| )?])?[ \t]*[^\r]+?(\n{1,2}))(?=\n*(¨0|\2([*+-]|\d+[.])[ \t]+))/gm),e=(e=e.replace(a,(function(e,n,a,s,c,u,l){l=l&&""!==l.trim()
var d=i.subParser("outdent")(c,t,r),h=""
return u&&t.tasklists&&(h=' class="task-list-item" style="list-style-type: none;"',d=d.replace(/^[ \t]*\[(x|X| )?]/m,(function(){var e='<input type="checkbox" disabled style="margin: 0px 0.35em 0.25em -1.6em; vertical-align: middle;"'
return l&&(e+=" checked"),e+">"}))),d=d.replace(/^([-*+]|\d\.)[ \t]+[\S\n ]*/g,(function(e){return"¨A"+e})),n||d.search(/\n{2,}/)>-1?(d=i.subParser("githubCodeBlocks")(d,t,r),d=i.subParser("blockGamut")(d,t,r)):(d=(d=i.subParser("lists")(d,t,r)).replace(/\n$/,""),d=(d=i.subParser("hashHTMLBlocks")(d,t,r)).replace(/\n\n+/g,"\n\n"),d=o?i.subParser("paragraphs")(d,t,r):i.subParser("spanGamut")(d,t,r)),"<li"+h+">"+(d=d.replace("¨A",""))+"</li>\n"}))).replace(/¨0/g,""),r.gListLevel--,n&&(e=e.replace(/\s+$/,"")),e}function a(e,t){if("ol"===t){var r=e.match(/^ *(\d+)\./)
if(r&&"1"!==r[1])return' start="'+r[1]+'"'}return""}function o(e,r,o){var i=t.disableForced4SpacesIndentedSublists?/^ ?\d+\.[ \t]/gm:/^ {0,3}\d+\.[ \t]/gm,s=t.disableForced4SpacesIndentedSublists?/^ ?[*+-][ \t]/gm:/^ {0,3}[*+-][ \t]/gm,c="ul"===r?i:s,u=""
if(-1!==e.search(c))!function t(l){var d=l.search(c),h=a(e,r);-1!==d?(u+="\n\n<"+r+h+">\n"+n(l.slice(0,d),!!o)+"</"+r+">\n",c="ul"==(r="ul"===r?"ol":"ul")?i:s,t(l.slice(d))):u+="\n\n<"+r+h+">\n"+n(l,!!o)+"</"+r+">\n"}(e)
else{var l=a(e,r)
u="\n\n<"+r+l+">\n"+n(e,!!o)+"</"+r+">\n"}return u}return e=r.converter._dispatch("lists.before",e,t,r),e+="¨0",e=(e=r.gListLevel?e.replace(/^(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,(function(e,t,r){return o(t,r.search(/[*+-]/g)>-1?"ul":"ol",!0)})):e.replace(/(\n\n|^\n?)(( {0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(¨0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm,(function(e,t,r,n){return o(r,n.search(/[*+-]/g)>-1?"ul":"ol",!1)}))).replace(/¨0/,""),r.converter._dispatch("lists.after",e,t,r)})),i.subParser("metadata",(function(e,t,r){"use strict"
if(!t.metadata)return e
function n(e){r.metadata.raw=e,(e=(e=e.replace(/&/g,"&amp;").replace(/"/g,"&quot;")).replace(/\n {4}/g," ")).replace(/^([\S ]+): +([\s\S]+?)$/gm,(function(e,t,n){return r.metadata.parsed[t]=n,""}))}return e=(e=(e=(e=r.converter._dispatch("metadata.before",e,t,r)).replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/,(function(e,t,r){return n(r),"¨M"}))).replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/,(function(e,t,a){return t&&(r.metadata.format=t),n(a),"¨M"}))).replace(/¨M/g,""),r.converter._dispatch("metadata.after",e,t,r)})),i.subParser("outdent",(function(e,t,r){"use strict"
return e=(e=(e=r.converter._dispatch("outdent.before",e,t,r)).replace(/^(\t|[ ]{1,4})/gm,"¨0")).replace(/¨0/g,""),r.converter._dispatch("outdent.after",e,t,r)})),i.subParser("paragraphs",(function(e,t,r){"use strict"
for(var n=(e=(e=(e=r.converter._dispatch("paragraphs.before",e,t,r)).replace(/^\n+/g,"")).replace(/\n+$/g,"")).split(/\n{2,}/g),a=[],o=n.length,s=0;s<o;s++){var c=n[s]
c.search(/¨(K|G)(\d+)\1/g)>=0?a.push(c):c.search(/\S/)>=0&&(c=(c=i.subParser("spanGamut")(c,t,r)).replace(/^([ \t]*)/g,"<p>"),c+="</p>",a.push(c))}for(o=a.length,s=0;s<o;s++){for(var u="",l=a[s],d=!1;/¨(K|G)(\d+)\1/.test(l);){var h=RegExp.$1,p=RegExp.$2
u=(u="K"===h?r.gHtmlBlocks[p]:d?i.subParser("encodeCode")(r.ghCodeBlocks[p].text,t,r):r.ghCodeBlocks[p].codeblock).replace(/\$/g,"$$$$"),l=l.replace(/(\n\n)?¨(K|G)\d+\2(\n\n)?/,u),/^<pre\b[^>]*>\s*<code\b[^>]*>/.test(l)&&(d=!0)}a[s]=l}return e=(e=(e=a.join("\n")).replace(/^\n+/g,"")).replace(/\n+$/g,""),r.converter._dispatch("paragraphs.after",e,t,r)})),i.subParser("runExtension",(function(e,t,r,n){"use strict"
if(e.filter)t=e.filter(t,n.converter,r)
else if(e.regex){var a=e.regex
a instanceof RegExp||(a=new RegExp(a,"g")),t=t.replace(a,e.replace)}return t})),i.subParser("spanGamut",(function(e,t,r){"use strict"
return e=r.converter._dispatch("spanGamut.before",e,t,r),e=i.subParser("codeSpans")(e,t,r),e=i.subParser("escapeSpecialCharsWithinTagAttributes")(e,t,r),e=i.subParser("encodeBackslashEscapes")(e,t,r),e=i.subParser("images")(e,t,r),e=i.subParser("anchors")(e,t,r),e=i.subParser("autoLinks")(e,t,r),e=i.subParser("simplifiedAutoLinks")(e,t,r),e=i.subParser("emoji")(e,t,r),e=i.subParser("underline")(e,t,r),e=i.subParser("italicsAndBold")(e,t,r),e=i.subParser("strikethrough")(e,t,r),e=i.subParser("ellipsis")(e,t,r),e=i.subParser("hashHTMLSpans")(e,t,r),e=i.subParser("encodeAmpsAndAngles")(e,t,r),t.simpleLineBreaks?/\n\n¨K/.test(e)||(e=e.replace(/\n+/g,"<br />\n")):e=e.replace(/  +\n/g,"<br />\n"),r.converter._dispatch("spanGamut.after",e,t,r)})),i.subParser("strikethrough",(function(e,t,r){"use strict"
return t.strikethrough&&(e=(e=r.converter._dispatch("strikethrough.before",e,t,r)).replace(/(?:~){2}([\s\S]+?)(?:~){2}/g,(function(e,n){return function(e){return t.simplifiedAutoLink&&(e=i.subParser("simplifiedAutoLinks")(e,t,r)),"<del>"+e+"</del>"}(n)})),e=r.converter._dispatch("strikethrough.after",e,t,r)),e})),i.subParser("stripLinkDefinitions",(function(e,t,r){"use strict"
var n=function(e,n,a,o,s,c,u){return n=n.toLowerCase(),a.match(/^data:.+?\/.+?;base64,/)?r.gUrls[n]=a.replace(/\s/g,""):r.gUrls[n]=i.subParser("encodeAmpsAndAngles")(a,t,r),c?c+u:(u&&(r.gTitles[n]=u.replace(/"|'/g,"&quot;")),t.parseImgDimensions&&o&&s&&(r.gDimensions[n]={width:o,height:s}),"")}
return(e=(e=(e+="¨0").replace(/^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(data:.+?\/.+?;base64,[A-Za-z0-9+/=\n]+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n\n|(?=¨0)|(?=\n\[))/gm,n)).replace(/^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?([^>\s]+)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=¨0))/gm,n)).replace(/¨0/,"")})),i.subParser("tables",(function(e,t,r){"use strict"
if(!t.tables)return e
function n(e,n){return"<td"+n+">"+i.subParser("spanGamut")(e,t,r)+"</td>\n"}function a(e){var a,o=e.split("\n")
for(a=0;a<o.length;++a)/^ {0,3}\|/.test(o[a])&&(o[a]=o[a].replace(/^ {0,3}\|/,"")),/\|[ \t]*$/.test(o[a])&&(o[a]=o[a].replace(/\|[ \t]*$/,"")),o[a]=i.subParser("codeSpans")(o[a],t,r)
var s,c,u,l,d=o[0].split("|").map((function(e){return e.trim()})),h=o[1].split("|").map((function(e){return e.trim()})),p=[],f=[],m=[],g=[]
for(o.shift(),o.shift(),a=0;a<o.length;++a)""!==o[a].trim()&&p.push(o[a].split("|").map((function(e){return e.trim()})))
if(d.length<h.length)return e
for(a=0;a<h.length;++a)m.push((s=h[a],/^:[ \t]*--*$/.test(s)?' style="text-align:left;"':/^--*[ \t]*:[ \t]*$/.test(s)?' style="text-align:right;"':/^:[ \t]*--*[ \t]*:$/.test(s)?' style="text-align:center;"':""))
for(a=0;a<d.length;++a)i.helper.isUndefined(m[a])&&(m[a]=""),f.push((c=d[a],u=m[a],l=void 0,l="",c=c.trim(),(t.tablesHeaderId||t.tableHeaderId)&&(l=' id="'+c.replace(/ /g,"_").toLowerCase()+'"'),"<th"+l+u+">"+(c=i.subParser("spanGamut")(c,t,r))+"</th>\n"))
for(a=0;a<p.length;++a){for(var b=[],_=0;_<f.length;++_)i.helper.isUndefined(p[a][_]),b.push(n(p[a][_],m[_]))
g.push(b)}return function(e,t){for(var r="<table>\n<thead>\n<tr>\n",n=e.length,a=0;a<n;++a)r+=e[a]
for(r+="</tr>\n</thead>\n<tbody>\n",a=0;a<t.length;++a){r+="<tr>\n"
for(var o=0;o<n;++o)r+=t[a][o]
r+="</tr>\n"}return r+"</tbody>\n</table>\n"}(f,g)}return e=(e=(e=(e=r.converter._dispatch("tables.before",e,t,r)).replace(/\\(\|)/g,i.helper.escapeCharactersCallback)).replace(/^ {0,3}\|?.+\|.+\n {0,3}\|?[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*:?[ \t]*(?:[-=]){2,}[\s\S]+?(?:\n\n|¨0)/gm,a)).replace(/^ {0,3}\|.+\|[ \t]*\n {0,3}\|[ \t]*:?[ \t]*(?:[-=]){2,}[ \t]*:?[ \t]*\|[ \t]*\n( {0,3}\|.+\|[ \t]*\n)*(?:\n|¨0)/gm,a),r.converter._dispatch("tables.after",e,t,r)})),i.subParser("underline",(function(e,t,r){"use strict"
return t.underline?(e=r.converter._dispatch("underline.before",e,t,r),e=(e=t.literalMidWordUnderscores?(e=e.replace(/\b___(\S[\s\S]*?)___\b/g,(function(e,t){return"<u>"+t+"</u>"}))).replace(/\b__(\S[\s\S]*?)__\b/g,(function(e,t){return"<u>"+t+"</u>"})):(e=e.replace(/___(\S[\s\S]*?)___/g,(function(e,t){return/\S$/.test(t)?"<u>"+t+"</u>":e}))).replace(/__(\S[\s\S]*?)__/g,(function(e,t){return/\S$/.test(t)?"<u>"+t+"</u>":e}))).replace(/(_)/g,i.helper.escapeCharactersCallback),e=r.converter._dispatch("underline.after",e,t,r)):e})),i.subParser("unescapeSpecialChars",(function(e,t,r){"use strict"
return e=(e=r.converter._dispatch("unescapeSpecialChars.before",e,t,r)).replace(/¨E(\d+)E/g,(function(e,t){var r=parseInt(t)
return String.fromCharCode(r)})),r.converter._dispatch("unescapeSpecialChars.after",e,t,r)})),i.subParser("makeMarkdown.blockquote",(function(e,t){"use strict"
var r=""
if(e.hasChildNodes())for(var n=e.childNodes,a=n.length,o=0;o<a;++o){var s=i.subParser("makeMarkdown.node")(n[o],t)
""!==s&&(r+=s)}return"> "+(r=r.trim()).split("\n").join("\n> ")})),i.subParser("makeMarkdown.codeBlock",(function(e,t){"use strict"
var r=e.getAttribute("language"),n=e.getAttribute("precodenum")
return"```"+r+"\n"+t.preList[n]+"\n```"})),i.subParser("makeMarkdown.codeSpan",(function(e){"use strict"
return"`"+e.innerHTML+"`"})),i.subParser("makeMarkdown.emphasis",(function(e,t){"use strict"
var r=""
if(e.hasChildNodes()){r+="*"
for(var n=e.childNodes,a=n.length,o=0;o<a;++o)r+=i.subParser("makeMarkdown.node")(n[o],t)
r+="*"}return r})),i.subParser("makeMarkdown.header",(function(e,t,r){"use strict"
var n=new Array(r+1).join("#"),a=""
if(e.hasChildNodes()){a=n+" "
for(var o=e.childNodes,s=o.length,c=0;c<s;++c)a+=i.subParser("makeMarkdown.node")(o[c],t)}return a})),i.subParser("makeMarkdown.hr",(function(){"use strict"
return"---"})),i.subParser("makeMarkdown.image",(function(e){"use strict"
var t=""
return e.hasAttribute("src")&&(t+="!["+e.getAttribute("alt")+"](",t+="<"+e.getAttribute("src")+">",e.hasAttribute("width")&&e.hasAttribute("height")&&(t+=" ="+e.getAttribute("width")+"x"+e.getAttribute("height")),e.hasAttribute("title")&&(t+=' "'+e.getAttribute("title")+'"'),t+=")"),t})),i.subParser("makeMarkdown.links",(function(e,t){"use strict"
var r=""
if(e.hasChildNodes()&&e.hasAttribute("href")){var n=e.childNodes,a=n.length
r="["
for(var o=0;o<a;++o)r+=i.subParser("makeMarkdown.node")(n[o],t)
r+="](",r+="<"+e.getAttribute("href")+">",e.hasAttribute("title")&&(r+=' "'+e.getAttribute("title")+'"'),r+=")"}return r})),i.subParser("makeMarkdown.list",(function(e,t,r){"use strict"
var n=""
if(!e.hasChildNodes())return""
for(var a=e.childNodes,o=a.length,s=e.getAttribute("start")||1,c=0;c<o;++c)void 0!==a[c].tagName&&"li"===a[c].tagName.toLowerCase()&&(n+=("ol"===r?s.toString()+". ":"- ")+i.subParser("makeMarkdown.listItem")(a[c],t),++s)
return(n+="\n\x3c!-- --\x3e\n").trim()})),i.subParser("makeMarkdown.listItem",(function(e,t){"use strict"
for(var r="",n=e.childNodes,a=n.length,o=0;o<a;++o)r+=i.subParser("makeMarkdown.node")(n[o],t)
return/\n$/.test(r)?r=r.split("\n").join("\n    ").replace(/^ {4}$/gm,"").replace(/\n\n+/g,"\n\n"):r+="\n",r})),i.subParser("makeMarkdown.node",(function(e,t,r){"use strict"
r=r||!1
var n=""
if(3===e.nodeType)return i.subParser("makeMarkdown.txt")(e,t)
if(8===e.nodeType)return"\x3c!--"+e.data+"--\x3e\n\n"
if(1!==e.nodeType)return""
switch(e.tagName.toLowerCase()){case"h1":r||(n=i.subParser("makeMarkdown.header")(e,t,1)+"\n\n")
break
case"h2":r||(n=i.subParser("makeMarkdown.header")(e,t,2)+"\n\n")
break
case"h3":r||(n=i.subParser("makeMarkdown.header")(e,t,3)+"\n\n")
break
case"h4":r||(n=i.subParser("makeMarkdown.header")(e,t,4)+"\n\n")
break
case"h5":r||(n=i.subParser("makeMarkdown.header")(e,t,5)+"\n\n")
break
case"h6":r||(n=i.subParser("makeMarkdown.header")(e,t,6)+"\n\n")
break
case"p":r||(n=i.subParser("makeMarkdown.paragraph")(e,t)+"\n\n")
break
case"blockquote":r||(n=i.subParser("makeMarkdown.blockquote")(e,t)+"\n\n")
break
case"hr":r||(n=i.subParser("makeMarkdown.hr")(e,t)+"\n\n")
break
case"ol":r||(n=i.subParser("makeMarkdown.list")(e,t,"ol")+"\n\n")
break
case"ul":r||(n=i.subParser("makeMarkdown.list")(e,t,"ul")+"\n\n")
break
case"precode":r||(n=i.subParser("makeMarkdown.codeBlock")(e,t)+"\n\n")
break
case"pre":r||(n=i.subParser("makeMarkdown.pre")(e,t)+"\n\n")
break
case"table":r||(n=i.subParser("makeMarkdown.table")(e,t)+"\n\n")
break
case"code":n=i.subParser("makeMarkdown.codeSpan")(e,t)
break
case"em":case"i":n=i.subParser("makeMarkdown.emphasis")(e,t)
break
case"strong":case"b":n=i.subParser("makeMarkdown.strong")(e,t)
break
case"del":n=i.subParser("makeMarkdown.strikethrough")(e,t)
break
case"a":n=i.subParser("makeMarkdown.links")(e,t)
break
case"img":n=i.subParser("makeMarkdown.image")(e,t)
break
default:n=e.outerHTML+"\n\n"}return n})),i.subParser("makeMarkdown.paragraph",(function(e,t){"use strict"
var r=""
if(e.hasChildNodes())for(var n=e.childNodes,a=n.length,o=0;o<a;++o)r+=i.subParser("makeMarkdown.node")(n[o],t)
return r.trim()})),i.subParser("makeMarkdown.pre",(function(e,t){"use strict"
var r=e.getAttribute("prenum")
return"<pre>"+t.preList[r]+"</pre>"})),i.subParser("makeMarkdown.strikethrough",(function(e,t){"use strict"
var r=""
if(e.hasChildNodes()){r+="~~"
for(var n=e.childNodes,a=n.length,o=0;o<a;++o)r+=i.subParser("makeMarkdown.node")(n[o],t)
r+="~~"}return r})),i.subParser("makeMarkdown.strong",(function(e,t){"use strict"
var r=""
if(e.hasChildNodes()){r+="**"
for(var n=e.childNodes,a=n.length,o=0;o<a;++o)r+=i.subParser("makeMarkdown.node")(n[o],t)
r+="**"}return r})),i.subParser("makeMarkdown.table",(function(e,t){"use strict"
var r,n,a="",o=[[],[]],s=e.querySelectorAll("thead>tr>th"),c=e.querySelectorAll("tbody>tr")
for(r=0;r<s.length;++r){var u=i.subParser("makeMarkdown.tableCell")(s[r],t),l="---"
if(s[r].hasAttribute("style"))switch(s[r].getAttribute("style").toLowerCase().replace(/\s/g,"")){case"text-align:left;":l=":---"
break
case"text-align:right;":l="---:"
break
case"text-align:center;":l=":---:"}o[0][r]=u.trim(),o[1][r]=l}for(r=0;r<c.length;++r){var d=o.push([])-1,h=c[r].getElementsByTagName("td")
for(n=0;n<s.length;++n){var p=" "
void 0!==h[n]&&(p=i.subParser("makeMarkdown.tableCell")(h[n],t)),o[d].push(p)}}var f=3
for(r=0;r<o.length;++r)for(n=0;n<o[r].length;++n){var m=o[r][n].length
m>f&&(f=m)}for(r=0;r<o.length;++r){for(n=0;n<o[r].length;++n)1===r?":"===o[r][n].slice(-1)?o[r][n]=i.helper.padEnd(o[r][n].slice(-1),f-1,"-")+":":o[r][n]=i.helper.padEnd(o[r][n],f,"-"):o[r][n]=i.helper.padEnd(o[r][n],f)
a+="| "+o[r].join(" | ")+" |\n"}return a.trim()})),i.subParser("makeMarkdown.tableCell",(function(e,t){"use strict"
var r=""
if(!e.hasChildNodes())return""
for(var n=e.childNodes,a=n.length,o=0;o<a;++o)r+=i.subParser("makeMarkdown.node")(n[o],t,!0)
return r.trim()})),i.subParser("makeMarkdown.txt",(function(e){"use strict"
var t=e.nodeValue
return t=(t=t.replace(/ +/g," ")).replace(/¨NBSP;/g," "),(t=(t=(t=(t=(t=(t=(t=(t=i.helper.unescapeHTMLEntities(t)).replace(/([*_~|`])/g,"\\$1")).replace(/^(\s*)>/g,"\\$1>")).replace(/^#/gm,"\\#")).replace(/^(\s*)([-=]{3,})(\s*)$/,"$1\\$2$3")).replace(/^( {0,3}\d+)\./gm,"$1\\.")).replace(/^( {0,3})([+-])/gm,"$1\\$2")).replace(/]([\s]*)\(/g,"\\]$1\\(")).replace(/^ {0,3}\[([\S \t]*?)]:/gm,"\\[$1]:")})),void 0===(n=function(){"use strict"
return i}.call(t,r,t,e))||(e.exports=n)}).call(this)},function(e,t){var r,n
function a(e){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(e)}r=function(){"use strict"
var e=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=void 0
void 0===r&&(r={modules:[]})
var n=null
function o(e){var t=e.getBoundingClientRect(),r={}
for(var n in t)r[n]=t[n]
try{if(e.ownerDocument!==document){var a=e.ownerDocument.defaultView.frameElement
if(a){var i=o(a)
r.top+=i.top,r.bottom+=i.top,r.left+=i.left,r.right+=i.left}}}catch(e){}return r}function i(e){var t=(getComputedStyle(e)||{}).position,r=[]
if("fixed"===t)return[e]
for(var n=e;(n=n.parentNode)&&n&&1===n.nodeType;){var a=void 0
try{a=getComputedStyle(n)}catch(e){}if(null==a)return r.push(n),r
var o=a,i=o.overflow,s=o.overflowX,c=o.overflowY;/(auto|scroll|overlay)/.test(i+c+s)&&("absolute"!==t||["relative","absolute","fixed"].indexOf(a.position)>=0)&&r.push(n)}return r.push(e.ownerDocument.body),e.ownerDocument!==document&&r.push(e.ownerDocument.defaultView),r}var s,c=(s=0,function(){return++s}),u={},l=function(){var e=n
e&&document.body.contains(e)||((e=document.createElement("div")).setAttribute("data-tether-id",c()),g(e.style,{top:0,left:0,position:"absolute"}),document.body.appendChild(e),n=e)
var t=e.getAttribute("data-tether-id")
return void 0===u[t]&&(u[t]=o(e),P((function(){delete u[t]}))),u[t]}
function d(){n&&document.body.removeChild(n),n=null}function h(e){var t=void 0
e===document?(t=document,e=document.documentElement):t=e.ownerDocument
var r=t.documentElement,n=o(e),a=l()
return n.top-=a.top,n.left-=a.left,void 0===n.width&&(n.width=document.body.scrollWidth-n.left-n.right),void 0===n.height&&(n.height=document.body.scrollHeight-n.top-n.bottom),n.top=n.top-r.clientTop,n.left=n.left-r.clientLeft,n.right=t.body.clientWidth-n.width-n.left,n.bottom=t.body.clientHeight-n.height-n.top,n}function p(e){return e.offsetParent||document.documentElement}var f=null
function m(){if(f)return f
var e=document.createElement("div")
e.style.width="100%",e.style.height="200px"
var t=document.createElement("div")
g(t.style,{position:"absolute",top:0,left:0,pointerEvents:"none",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),t.appendChild(e),document.body.appendChild(t)
var r=e.offsetWidth
t.style.overflow="scroll"
var n=e.offsetWidth
r===n&&(n=t.clientWidth),document.body.removeChild(t)
var a=r-n
return f={width:a,height:a}}function g(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],t=[]
return Array.prototype.push.apply(t,arguments),t.slice(1).forEach((function(t){if(t)for(var r in t)({}).hasOwnProperty.call(t,r)&&(e[r]=t[r])})),e}function b(e,t){if(void 0!==e.classList)t.split(" ").forEach((function(t){t.trim()&&e.classList.remove(t)}))
else{var r=new RegExp("(^| )"+t.split(" ").join("|")+"( |$)","gi"),n=v(e).replace(r," ")
y(e,n)}}function _(e,t){if(void 0!==e.classList)t.split(" ").forEach((function(t){t.trim()&&e.classList.add(t)}))
else{b(e,t)
var r=v(e)+" "+t
y(e,r)}}function w(e,t){if(void 0!==e.classList)return e.classList.contains(t)
var r=v(e)
return new RegExp("(^| )"+t+"( |$)","gi").test(r)}function v(e){return e.className instanceof e.ownerDocument.defaultView.SVGAnimatedString?e.className.baseVal:e.className}function y(e,t){e.setAttribute("class",t)}function k(e,t,r){r.forEach((function(r){-1===t.indexOf(r)&&w(e,r)&&b(e,r)})),t.forEach((function(t){w(e,t)||_(e,t)}))}var x=[],P=function(e){x.push(e)},j=function(){for(var e=void 0;e=x.pop();)e()},S=function(){function r(){t(this,r)}return e(r,[{key:"on",value:function(e,t,r){var n=!(arguments.length<=3||void 0===arguments[3])&&arguments[3]
void 0===this.bindings&&(this.bindings={}),void 0===this.bindings[e]&&(this.bindings[e]=[]),this.bindings[e].push({handler:t,ctx:r,once:n})}},{key:"once",value:function(e,t,r){this.on(e,t,r,!0)}},{key:"off",value:function(e,t){if(void 0!==this.bindings&&void 0!==this.bindings[e])if(void 0===t)delete this.bindings[e]
else for(var r=0;r<this.bindings[e].length;)this.bindings[e][r].handler===t?this.bindings[e].splice(r,1):++r}},{key:"trigger",value:function(e){if(void 0!==this.bindings&&this.bindings[e]){for(var t=0,r=arguments.length,n=Array(r>1?r-1:0),a=1;a<r;a++)n[a-1]=arguments[a]
for(;t<this.bindings[e].length;){var o=this.bindings[e][t],i=o.handler,s=o.ctx,c=o.once,u=s
void 0===u&&(u=this),i.apply(u,n),c?this.bindings[e].splice(t,1):++t}}}}]),r}()
r.Utils={getActualBoundingClientRect:o,getScrollParents:i,getBounds:h,getOffsetParent:p,extend:g,addClass:_,removeClass:b,hasClass:w,updateClasses:k,defer:P,flush:j,uniqueId:c,Evented:S,getScrollBarSize:m,removeUtilElements:d}
var E=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,a=!1,o=void 0
try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(a)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")},C=(e=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),function(e,t,r){for(var n=!0;n;){var a=e,o=t,i=r
n=!1,null===a&&(a=Function.prototype)
var s=Object.getOwnPropertyDescriptor(a,o)
if(void 0!==s){if("value"in s)return s.value
var c=s.get
if(void 0===c)return
return c.call(i)}var u=Object.getPrototypeOf(a)
if(null===u)return
e=u,t=o,r=i,n=!0,s=u=void 0}})
function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}if(void 0===r)throw new Error("You must include the utils.js file before tether.js")
var i=(X=r.Utils).getScrollParents,p=(h=X.getBounds,X.getOffsetParent),_=(g=X.extend,X.addClass),b=X.removeClass,m=(k=X.updateClasses,P=X.defer,j=X.flush,X.getScrollBarSize),d=X.removeUtilElements
function O(e,t){var r=arguments.length<=2||void 0===arguments[2]?1:arguments[2]
return e+r>=t&&t>=e-r}var z,A,T,I,M=function(){if("undefined"==typeof document)return""
for(var e=document.createElement("div"),t=["transform","WebkitTransform","OTransform","MozTransform","msTransform"],r=0;r<t.length;++r){var n=t[r]
if(void 0!==e.style[n])return n}}(),D=[],q=function(){D.forEach((function(e){e.position(!1)})),j()}
function L(){return"object"===("undefined"==typeof performance?"undefined":a(performance))&&"function"==typeof performance.now?performance.now():+new Date}z=null,A=null,T=null,I=function e(){if(void 0!==A&&A>16)return A=Math.min(A-16,250),void(T=setTimeout(e,250))
void 0!==z&&L()-z<10||(null!=T&&(clearTimeout(T),T=null),z=L(),q(),A=L()-z)},"undefined"!=typeof window&&void 0!==window.addEventListener&&["resize","scroll","touchmove"].forEach((function(e){window.addEventListener(e,I)}))
var N={center:"center",left:"right",right:"left"},R={middle:"middle",top:"bottom",bottom:"top"},B={top:0,left:0,middle:"50%",center:"50%",bottom:"100%",right:"100%"},H=function(e){var t=e.left,r=e.top
return void 0!==B[e.left]&&(t=B[e.left]),void 0!==B[e.top]&&(r=B[e.top]),{left:t,top:r}}
function $(){for(var e={top:0,left:0},t=arguments.length,r=Array(t),n=0;n<t;n++)r[n]=arguments[n]
return r.forEach((function(t){var r=t.top,n=t.left
"string"==typeof r&&(r=parseFloat(r,10)),"string"==typeof n&&(n=parseFloat(n,10)),e.top+=r,e.left+=n})),e}function U(e,t){return"string"==typeof e.left&&-1!==e.left.indexOf("%")&&(e.left=parseFloat(e.left,10)/100*t.width),"string"==typeof e.top&&-1!==e.top.indexOf("%")&&(e.top=parseFloat(e.top,10)/100*t.height),e}var F=function(e){var t=e.split(" "),r=E(t,2)
return{top:r[0],left:r[1]}},W=F,V=function(n){function o(e){var n=this
t(this,o),C(Object.getPrototypeOf(o.prototype),"constructor",this).call(this),this.position=this.position.bind(this),D.push(this),this.history=[],this.setOptions(e,!1),r.modules.forEach((function(e){void 0!==e.initialize&&e.initialize.call(n)})),this.position()}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+a(t))
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(o,n),e(o,[{key:"getClass",value:function(){var e=arguments.length<=0||void 0===arguments[0]?"":arguments[0],t=this.options.classes
return void 0!==t&&t[e]?this.options.classes[e]:this.options.classPrefix?this.options.classPrefix+"-"+e:e}},{key:"setOptions",value:function(e){var t=this,r=arguments.length<=1||void 0===arguments[1]||arguments[1]
this.options=g({offset:"0 0",targetOffset:"0 0",targetAttachment:"auto auto",classPrefix:"tether"},e)
var n=this.options,a=n.element,o=n.target,s=n.targetModifier
if(this.element=a,this.target=o,this.targetModifier=s,"viewport"===this.target?(this.target=document.body,this.targetModifier="visible"):"scroll-handle"===this.target&&(this.target=document.body,this.targetModifier="scroll-handle"),["element","target"].forEach((function(e){if(void 0===t[e])throw new Error("Tether Error: Both element and target must be defined")
void 0!==t[e].jquery?t[e]=t[e][0]:"string"==typeof t[e]&&(t[e]=document.querySelector(t[e]))})),_(this.element,this.getClass("element")),!1!==this.options.addTargetClasses&&_(this.target,this.getClass("target")),!this.options.attachment)throw new Error("Tether Error: You must provide an attachment")
this.targetAttachment=W(this.options.targetAttachment),this.attachment=W(this.options.attachment),this.offset=F(this.options.offset),this.targetOffset=F(this.options.targetOffset),void 0!==this.scrollParents&&this.disable(),"scroll-handle"===this.targetModifier?this.scrollParents=[this.target]:this.scrollParents=i(this.target),!1!==this.options.enabled&&this.enable(r)}},{key:"getTargetBounds",value:function(){if(void 0===this.targetModifier)return h(this.target)
if("visible"===this.targetModifier)return this.target===document.body?{top:pageYOffset,left:pageXOffset,height:innerHeight,width:innerWidth}:((o={height:(e=h(this.target)).height,width:e.width,top:e.top,left:e.left}).height=Math.min(o.height,e.height-(pageYOffset-e.top)),o.height=Math.min(o.height,e.height-(e.top+e.height-(pageYOffset+innerHeight))),o.height=Math.min(innerHeight,o.height),o.height-=2,o.width=Math.min(o.width,e.width-(pageXOffset-e.left)),o.width=Math.min(o.width,e.width-(e.left+e.width-(pageXOffset+innerWidth))),o.width=Math.min(innerWidth,o.width),o.width-=2,o.top<pageYOffset&&(o.top=pageYOffset),o.left<pageXOffset&&(o.left=pageXOffset),o)
if("scroll-handle"===this.targetModifier){var e=void 0,t=this.target
t===document.body?(t=document.documentElement,e={left:pageXOffset,top:pageYOffset,height:innerHeight,width:innerWidth}):e=h(t)
var r=getComputedStyle(t),n=0;(t.scrollWidth>t.clientWidth||[r.overflow,r.overflowX].indexOf("scroll")>=0||this.target!==document.body)&&(n=15)
var a=e.height-parseFloat(r.borderTopWidth)-parseFloat(r.borderBottomWidth)-n,o={width:15,height:.975*a*(a/t.scrollHeight),left:e.left+e.width-parseFloat(r.borderLeftWidth)-15},i=0
a<408&&this.target===document.body&&(i=-11e-5*Math.pow(a,2)-.00727*a+22.58),this.target!==document.body&&(o.height=Math.max(o.height,24))
var s=this.target.scrollTop/(t.scrollHeight-a)
return o.top=s*(a-o.height-i)+e.top+parseFloat(r.borderTopWidth),this.target===document.body&&(o.height=Math.max(o.height,24)),o}}},{key:"clearCache",value:function(){this._cache={}}},{key:"cache",value:function(e,t){return void 0===this._cache&&(this._cache={}),void 0===this._cache[e]&&(this._cache[e]=t.call(this)),this._cache[e]}},{key:"enable",value:function(){var e=this,t=arguments.length<=0||void 0===arguments[0]||arguments[0]
!1!==this.options.addTargetClasses&&_(this.target,this.getClass("enabled")),_(this.element,this.getClass("enabled")),this.enabled=!0,this.scrollParents.forEach((function(t){t!==e.target.ownerDocument&&t.addEventListener("scroll",e.position)})),t&&this.position()}},{key:"disable",value:function(){var e=this
b(this.target,this.getClass("enabled")),b(this.element,this.getClass("enabled")),this.enabled=!1,void 0!==this.scrollParents&&this.scrollParents.forEach((function(t){t.removeEventListener("scroll",e.position)}))}},{key:"destroy",value:function(){var e=this
this.disable(),D.forEach((function(t,r){t===e&&D.splice(r,1)})),0===D.length&&d()}},{key:"updateAttachClasses",value:function(e,t){var r=this
e=e||this.attachment,t=t||this.targetAttachment,void 0!==this._addAttachClasses&&this._addAttachClasses.length&&this._addAttachClasses.splice(0,this._addAttachClasses.length),void 0===this._addAttachClasses&&(this._addAttachClasses=[])
var n=this._addAttachClasses
e.top&&n.push(this.getClass("element-attached")+"-"+e.top),e.left&&n.push(this.getClass("element-attached")+"-"+e.left),t.top&&n.push(this.getClass("target-attached")+"-"+t.top),t.left&&n.push(this.getClass("target-attached")+"-"+t.left)
var a=[];["left","top","bottom","right","middle","center"].forEach((function(e){a.push(r.getClass("element-attached")+"-"+e),a.push(r.getClass("target-attached")+"-"+e)})),P((function(){void 0!==r._addAttachClasses&&(k(r.element,r._addAttachClasses,a),!1!==r.options.addTargetClasses&&k(r.target,r._addAttachClasses,a),delete r._addAttachClasses)}))}},{key:"position",value:function(){var e=this,t=arguments.length<=0||void 0===arguments[0]||arguments[0]
if(this.enabled){this.clearCache()
var n=function(e,t){var r=e.left,n=e.top
return"auto"===r&&(r=N[t.left]),"auto"===n&&(n=R[t.top]),{left:r,top:n}}(this.targetAttachment,this.attachment)
this.updateAttachClasses(this.attachment,n)
var o=this.cache("element-bounds",(function(){return h(e.element)})),i=o.width,s=o.height
if(0===i&&0===s&&void 0!==this.lastSize){var c=this.lastSize
i=c.width,s=c.height}else this.lastSize={width:i,height:s}
var u=this.cache("target-bounds",(function(){return e.getTargetBounds()})),l=u,d=U(H(this.attachment),{width:i,height:s}),f=U(H(n),l),g=U(this.offset,{width:i,height:s}),b=U(this.targetOffset,l)
d=$(d,g),f=$(f,b)
for(var _=u.left+f.left-d.left,w=u.top+f.top-d.top,v=0;v<r.modules.length;++v){var y=r.modules[v].position.call(this,{left:_,top:w,targetAttachment:n,targetPos:u,elementPos:o,offset:d,targetOffset:f,manualOffset:g,manualTargetOffset:b,scrollbarSize:S,attachment:this.attachment})
if(!1===y)return!1
void 0!==y&&"object"===a(y)&&(w=y.top,_=y.left)}var k={page:{top:w,left:_},viewport:{top:w-pageYOffset,bottom:pageYOffset-w-s+innerHeight,left:_-pageXOffset,right:pageXOffset-_-i+innerWidth}},x=this.target.ownerDocument,P=x.defaultView,S=void 0
return P.innerHeight>x.documentElement.clientHeight&&(S=this.cache("scrollbar-size",m),k.viewport.bottom-=S.height),P.innerWidth>x.documentElement.clientWidth&&(S=this.cache("scrollbar-size",m),k.viewport.right-=S.width),-1!==["","static"].indexOf(x.body.style.position)&&-1!==["","static"].indexOf(x.body.parentElement.style.position)||(k.page.bottom=x.body.scrollHeight-w-s,k.page.right=x.body.scrollWidth-_-i),void 0!==this.options.optimizations&&!1!==this.options.optimizations.moveElement&&void 0===this.targetModifier&&function(){var t=e.cache("target-offsetparent",(function(){return p(e.target)})),r=e.cache("target-offsetparent-bounds",(function(){return h(t)})),n=getComputedStyle(t),a=r,o={}
if(["Top","Left","Bottom","Right"].forEach((function(e){o[e.toLowerCase()]=parseFloat(n["border"+e+"Width"])})),r.right=x.body.scrollWidth-r.left-a.width+o.right,r.bottom=x.body.scrollHeight-r.top-a.height+o.bottom,k.page.top>=r.top+o.top&&k.page.bottom>=r.bottom&&k.page.left>=r.left+o.left&&k.page.right>=r.right){var i=t.scrollTop,s=t.scrollLeft
k.offset={top:k.page.top-r.top+i-o.top,left:k.page.left-r.left+s-o.left}}}(),this.move(k),this.history.unshift(k),this.history.length>3&&this.history.pop(),t&&j(),!0}}},{key:"move",value:function(e){var t,r,n=this
if(void 0!==this.element.parentNode){var a={}
for(var o in e)for(var i in a[o]={},e[o]){for(var s=!1,c=0;c<this.history.length;++c){var u=this.history[c]
if(void 0!==u[o]&&!O(u[o][i],e[o][i])){s=!0
break}}s||(a[o][i]=!0)}var l={top:"",left:"",right:"",bottom:""},d=function(e,t){if(!1!==(void 0!==n.options.optimizations?n.options.optimizations.gpu:null)){var r=void 0,a=void 0
e.top?(l.top=0,r=t.top):(l.bottom=0,r=-t.bottom),e.left?(l.left=0,a=t.left):(l.right=0,a=-t.right),"number"==typeof window.devicePixelRatio&&devicePixelRatio%1==0&&(a=Math.round(a*devicePixelRatio)/devicePixelRatio,r=Math.round(r*devicePixelRatio)/devicePixelRatio),l[M]="translateX("+a+"px) translateY("+r+"px)","msTransform"!==M&&(l[M]+=" translateZ(0)")}else e.top?l.top=t.top+"px":l.bottom=t.bottom+"px",e.left?l.left=t.left+"px":l.right=t.right+"px"},h=!1
if((a.page.top||a.page.bottom)&&(a.page.left||a.page.right)?(l.position="absolute",d(a.page,e.page)):(a.viewport.top||a.viewport.bottom)&&(a.viewport.left||a.viewport.right)?(l.position="fixed",d(a.viewport,e.viewport)):void 0!==a.offset&&a.offset.top&&a.offset.left?function(){l.position="absolute"
var t=n.cache("target-offsetparent",(function(){return p(n.target)}))
p(n.element)!==t&&P((function(){n.element.parentNode.removeChild(n.element),t.appendChild(n.element)})),d(a.offset,e.offset),h=!0}():(l.position="absolute",d({top:!0,left:!0},e.page)),!h)if(this.options.bodyElement)this.element.parentNode!==this.options.bodyElement&&this.options.bodyElement.appendChild(this.element)
else{for(var f=!0,m=this.element.parentNode;m&&1===m.nodeType&&"BODY"!==m.tagName&&(void 0,((r=(t=m).ownerDocument).fullscreenElement||r.webkitFullscreenElement||r.mozFullScreenElement||r.msFullscreenElement)!==t);){if("static"!==getComputedStyle(m).position){f=!1
break}m=m.parentNode}f||(this.element.parentNode.removeChild(this.element),this.element.ownerDocument.body.appendChild(this.element))}var b={},_=!1
for(var i in l){var w=l[i]
this.element.style[i]!==w&&(_=!0,b[i]=w)}_&&P((function(){g(n.element.style,b),n.trigger("repositioned")}))}}}]),o}(S)
V.modules=[],r.position=q
var G=g(V,r)
E=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,a=!1,o=void 0
try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(a)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")},h=(X=r.Utils).getBounds
var g=X.extend,K=(k=X.updateClasses,P=X.defer,["left","top","right","bottom"])
r.modules.push({position:function(e){var t=this,r=e.top,n=e.left,a=e.targetAttachment
if(!this.options.constraints)return!0
var o=this.cache("element-bounds",(function(){return h(t.element)})),i=o.height,s=o.width
if(0===s&&0===i&&void 0!==this.lastSize){var c=this.lastSize
s=c.width,i=c.height}var u=this.cache("target-bounds",(function(){return t.getTargetBounds()})),l=u.height,d=u.width,p=[this.getClass("pinned"),this.getClass("out-of-bounds")]
this.options.constraints.forEach((function(e){var t=e.outOfBoundsClass,r=e.pinnedClass
t&&p.push(t),r&&p.push(r)})),p.forEach((function(e){["left","top","right","bottom"].forEach((function(t){p.push(e+"-"+t)}))}))
var f=[],m=g({},a),b=g({},this.attachment)
return this.options.constraints.forEach((function(e){var o=e.to,c=e.attachment,u=e.pin
void 0===c&&(c="")
var p=void 0,g=void 0
if(c.indexOf(" ")>=0){var _=c.split(" "),w=E(_,2)
g=w[0],p=w[1]}else p=g=c
var v=function(e,t){return"scrollParent"===t?t=e.scrollParents[0]:"window"===t&&(t=[pageXOffset,pageYOffset,innerWidth+pageXOffset,innerHeight+pageYOffset]),t===document&&(t=t.documentElement),void 0!==t.nodeType&&function(){var e=t,r=h(t),n=r,a=getComputedStyle(t)
if(t=[n.left,n.top,r.width+n.left,r.height+n.top],e.ownerDocument!==document){var o=e.ownerDocument.defaultView
t[0]+=o.pageXOffset,t[1]+=o.pageYOffset,t[2]+=o.pageXOffset,t[3]+=o.pageYOffset}K.forEach((function(e,r){"Top"===(e=e[0].toUpperCase()+e.substr(1))||"Left"===e?t[r]+=parseFloat(a["border"+e+"Width"]):t[r]-=parseFloat(a["border"+e+"Width"])}))}(),t}(t,o)
"target"!==g&&"both"!==g||(r<v[1]&&"top"===m.top&&(r+=l,m.top="bottom"),r+i>v[3]&&"bottom"===m.top&&(r-=l,m.top="top")),"together"===g&&("top"===m.top&&("bottom"===b.top&&r<v[1]?(r+=l,m.top="bottom",r+=i,b.top="top"):"top"===b.top&&r+i>v[3]&&r-(i-l)>=v[1]&&(r-=i-l,m.top="bottom",b.top="bottom")),"bottom"===m.top&&("top"===b.top&&r+i>v[3]?(r-=l,m.top="top",r-=i,b.top="bottom"):"bottom"===b.top&&r<v[1]&&r+(2*i-l)<=v[3]&&(r+=i-l,m.top="top",b.top="top")),"middle"===m.top&&(r+i>v[3]&&"top"===b.top?(r-=i,b.top="bottom"):r<v[1]&&"bottom"===b.top&&(r+=i,b.top="top"))),"target"!==p&&"both"!==p||(n<v[0]&&"left"===m.left&&(n+=d,m.left="right"),n+s>v[2]&&"right"===m.left&&(n-=d,m.left="left")),"together"===p&&(n<v[0]&&"left"===m.left?"right"===b.left?(n+=d,m.left="right",n+=s,b.left="left"):"left"===b.left&&(n+=d,m.left="right",n-=s,b.left="right"):n+s>v[2]&&"right"===m.left?"left"===b.left?(n-=d,m.left="left",n-=s,b.left="right"):"right"===b.left&&(n-=d,m.left="left",n+=s,b.left="left"):"center"===m.left&&(n+s>v[2]&&"left"===b.left?(n-=s,b.left="right"):n<v[0]&&"right"===b.left&&(n+=s,b.left="left"))),"element"!==g&&"both"!==g||(r<v[1]&&"bottom"===b.top&&(r+=i,b.top="top"),r+i>v[3]&&"top"===b.top&&(r-=i,b.top="bottom")),"element"!==p&&"both"!==p||(n<v[0]&&("right"===b.left?(n+=s,b.left="left"):"center"===b.left&&(n+=s/2,b.left="left")),n+s>v[2]&&("left"===b.left?(n-=s,b.left="right"):"center"===b.left&&(n-=s/2,b.left="right"))),"string"==typeof u?u=u.split(",").map((function(e){return e.trim()})):!0===u&&(u=["top","left","right","bottom"]),u=u||[]
var y,k,x=[],P=[]
r<v[1]&&(u.indexOf("top")>=0?(r=v[1],x.push("top")):P.push("top")),r+i>v[3]&&(u.indexOf("bottom")>=0?(r=v[3]-i,x.push("bottom")):P.push("bottom")),n<v[0]&&(u.indexOf("left")>=0?(n=v[0],x.push("left")):P.push("left")),n+s>v[2]&&(u.indexOf("right")>=0?(n=v[2]-s,x.push("right")):P.push("right")),x.length&&(y=void 0!==t.options.pinnedClass?t.options.pinnedClass:t.getClass("pinned"),f.push(y),x.forEach((function(e){f.push(y+"-"+e)}))),P.length&&(k=void 0!==t.options.outOfBoundsClass?t.options.outOfBoundsClass:t.getClass("out-of-bounds"),f.push(k),P.forEach((function(e){f.push(k+"-"+e)}))),(x.indexOf("left")>=0||x.indexOf("right")>=0)&&(b.left=m.left=!1),(x.indexOf("top")>=0||x.indexOf("bottom")>=0)&&(b.top=m.top=!1),m.top===a.top&&m.left===a.left&&b.top===t.attachment.top&&b.left===t.attachment.left||(t.updateAttachClasses(b,m),t.trigger("update",{attachment:b,targetAttachment:m}))})),P((function(){!1!==t.options.addTargetClasses&&k(t.target,f,p),k(t.element,f,p)})),{top:r,left:n}}})
var X,h=(X=r.Utils).getBounds,k=X.updateClasses
return P=X.defer,r.modules.push({position:function(e){var t=this,r=e.top,n=e.left,a=this.cache("element-bounds",(function(){return h(t.element)})),o=a.height,i=a.width,s=this.getTargetBounds(),c=r+o,u=n+i,l=[]
r<=s.bottom&&c>=s.top&&["left","right"].forEach((function(e){var t=s[e]
t!==n&&t!==u||l.push(e)})),n<=s.right&&u>=s.left&&["top","bottom"].forEach((function(e){var t=s[e]
t!==r&&t!==c||l.push(e)}))
var d=[],p=[]
return d.push(this.getClass("abutted")),["left","top","right","bottom"].forEach((function(e){d.push(t.getClass("abutted")+"-"+e)})),l.length&&p.push(this.getClass("abutted")),l.forEach((function(e){p.push(t.getClass("abutted")+"-"+e)})),P((function(){!1!==t.options.addTargetClasses&&k(t.target,p,d),k(t.element,p,d)})),!0}}),E=function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,a=!1,o=void 0
try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(a)throw o}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")},r.modules.push({position:function(e){var t=e.top,r=e.left
if(this.options.shift){var n=this.options.shift
"function"==typeof this.options.shift&&(n=this.options.shift.call(this,{top:t,left:r}))
var a=void 0,o=void 0
if("string"==typeof n){(n=n.split(" "))[1]=n[1]||n[0]
var i=E(n,2)
a=i[0],o=i[1],a=parseFloat(a,10),o=parseFloat(o,10)}else a=n.top,o=n.left
return{top:t+=a,left:r+=o}}}}),G},void 0===(n=r.apply(t,[]))||(e.exports=n)},,function(e,t,r){"use strict"
function n(e,t){(null==t||t>e.length)&&(t=e.length)
for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r]
return n}r.r(t),r.d(t,{setup:function(){return l}})
var a=Object.defineProperty,o=Object.prototype.hasOwnProperty,i=Object.getOwnPropertySymbols,s=Object.prototype.propertyIsEnumerable,c=function(e,t,r){return t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r},u=function(e,t){for(var r in t||(t={}))o.call(t,r)&&c(e,r,t[r])
if(i){var a,u=function(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]
if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return n(e,t)
var r=Object.prototype.toString.call(e).slice(8,-1)
return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e))){r&&(e=r)
var a=0,o=function(){}
return{s:o,n:function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,c=!1
return{s:function(){r=r.call(e)},n:function(){var e=r.next()
return s=e.done,e},e:function(e){c=!0,i=e},f:function(){try{s||null==r.return||r.return()}finally{if(c)throw i}}}}(i(t))
try{for(u.s();!(a=u.n()).done;)r=a.value,s.call(t,r)&&c(e,r,t[r])}catch(e){u.e(e)}finally{u.f()}}return e}
function l(e){function t(e){return new RegExp("\\b(?:".concat(e.split(" ").join("|"),")\\b"))}var r="[-+*/_~!@$%^=<>{}\\w]+",n=/[A-Za-z0-9]+/,a=p.either(n,/[a-zA-Z0-9]+\.[a-zA-Z0-9-]+/,p.concat(n,/::/,/-?/,n)),o=/\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,i=new RegExp(p.either(/"[^{"]+/,/"/,/'[^{']+/,/'/,/"[^"]+"/,/'[^']+'/)),s={"parameter argument property":{pattern:/@[\w\d-_]+/}},c={punctuation:[{pattern:/[!#%&:()*+,.\/;<=>\[\\\]^`{|}~]+/},{pattern:/^=/,alias:"attr-equals"},{pattern:/\/?>/}]},l={"function-name":[{pattern:new RegExp("(\\()"+r),lookbehind:!0},{pattern:new RegExp("(\\{\\{\\{?)"+r),lookbehind:!0}]},d={builtin:t(["action on","outlet yield","log debugger","let each each-in if else unless"].join(" ")),keyword:t(["has-block concat fn component helper modifier get hash query-params","true false undefined null"].join(" ")),operator:t(["eq neq","gt gte le lte","and or not","as"].join(" "))},h={function:{greedy:!0,pattern:/\([\S-_\d]+\b/,inside:u(u(u({},c),l),d)}},f={"this-expression":{pattern:/this\.[\S]+/,lookbehind:!0,greedy:!0,inside:u(u({},c),{namespace:/this/,property:/[\S]+/})}},m={"member-expression":{pattern:/[\S]+\.[\S]+/,lookbehind:!0,greedy:!0,inside:u(u({},c),{constant:/[\S]+/,property:/[\S]+/})}},g=u(u(u(u(u(u(u(u(u({},h),c),f),m),s),{number:o,boolean:/\b(?:true|false)\b/}),d),l),{"attr-name":/^[^=]+=/,string:i,variable:/\b[A-Za-z0-9_-]+\b/}),b={mustache:{pattern:/\{\{\{?\/?[^}]+?\}?\}\}/,lookbehind:!0,alias:"punctuation",greedy:!0,inside:u(u({},{"sub-expression":{alias:"punctuation",pattern:/\([^)]+\)/,lookbehind:!0,greedy:!0,inside:g}}),g)}},_={string:{pattern:i,inside:b}}
g.string=_.string
var w=e.languages.markup
if(!w)throw new Error("prism-markup is required")
e.languages.glimmer=u(u({comment:[{pattern:/\{\{!--[\s\S]*?--\}\}/},{pattern:/\{\{![\s\S]*?\}\}/}],number:o},b),{tag:u(u({},w.tag),{inside:u(u(u(u(u({number:o},s),b),{tag:u(u({},w.tag.inside.tag),{inside:u(u({},c),{"class-name":new RegExp(a)})}),"attr-name":{pattern:/\b[^=\b]+=/,inside:u(u(u(u({},_),c),s),b)}}),c),_)})})}function d(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r]
return t.map((function(e){return h(e)})).join("")}function h(e){return e?"string"==typeof e?e:e.source:null}var p={lookahead:function(e){return d("(?=",e,")")},either:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r]
return"("+t.map((function(e){return h(e)})).join("|")+")"},optional:function(e){return d("(",e,")?")},concat:d}}]])
