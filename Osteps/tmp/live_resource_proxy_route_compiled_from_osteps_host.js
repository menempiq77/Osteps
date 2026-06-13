(()=>{var a={};a.id=7033,a.ids=[7033],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},50107:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>M,patchFetch:()=>L,routeModule:()=>H,serverHooks:()=>K,workAsyncStorage:()=>I,workUnitAsyncStorage:()=>J});var d={};c.r(d),c.d(d,{GET:()=>G,runtime:()=>v});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641);let v="nodejs",w=/text\/html|application\/xhtml\+xml/i,x=/text\/css/i,y=/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.|169\.254\.|::1$)/i,z=/^(?:#|data:|blob:|javascript:|mailto:|tel:)/i,A="/api/resource-proxy",B=a=>!!["http:","https:"].includes(a.protocol)&&!y.test(a.hostname),C=(a,b="https")=>{if(!a)return null;try{let c=a.includes("://")?a:`${b}://${a}`,d=new URL(c);if(!["http:","https:"].includes(d.protocol)||y.test(d.hostname))return null;return d.origin}catch{return null}},D=(a,b)=>{let c=a.trim();if(!c||z.test(c))return null;try{let a=new URL(c,b);if(!B(a))return null;return a}catch{return null}},E=(a,b,c)=>{let d,e=D(a,b);if(!e)return a;let f=new URL(b).origin;return e.origin!==f?e.toString():(d=e.toString(),`${c}${A}?url=${encodeURIComponent(d)}`)},F=(a,b,c)=>a.replace(/url\((["']?)([^)"']+)\1\)/gi,(a,d,e)=>`url(${d}${E(e,b,c)}${d})`).replace(/@import\s+(?:url\()?(["'])([^"']+)\1\)?/gi,(a,d,e)=>`@import ${d}${E(e,b,c)}${d}`);async function G(a){let b,c=a.nextUrl.searchParams.get("url")||"",d=(a=>{let b=a.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),c=a.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()||a.nextUrl.protocol.replace(/:$/,""),d=a.headers.get("host")?.split(",")[0]?.trim();return C(b,c)||C(a.headers.get("origin"),c)||C(a.headers.get("referer"),c)||C(d,c)||C(a.nextUrl.origin,c)||C(process.env.NEXT_PUBLIC_APP_ORIGIN,c)||C(process.env.NEXT_PUBLIC_SITE_ORIGIN,c)||"https://www.osteps.com"})(a);try{b=new URL(c)}catch{return u.NextResponse.json({error:"Invalid URL"},{status:400})}if(!B(b))return u.NextResponse.json({error:"URL cannot be previewed"},{status:400});try{let a=await fetch(b.toString(),{cache:"no-store",redirect:"follow",signal:AbortSignal.timeout(15e3),headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Language":"en-US,en;q=0.9"}}),c=a.headers.get("content-type")||"text/html; charset=utf-8",e=a.url||b.toString();if(w.test(c)){let b,f,g,h,i,j=await a.text();return new u.NextResponse(((a,b,c)=>{let d=a.replace(/<meta\s+[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,""),e=`${((a,b)=>{let c=new URL(a).origin;return`<script>
(() => {
  const TARGET_URL = ${JSON.stringify(a)};
  const TARGET_ORIGIN = ${JSON.stringify(c)};
  const PROXY_ORIGIN = ${JSON.stringify(b)};
  const PROXY_PATH = ${JSON.stringify(A)};
  const CURRENT_ORIGIN = window.location.origin;
  const NON_PROXYABLE_RE = /^(?:#|data:|blob:|javascript:|mailto:|tel:)/i;

  const rewriteAbsoluteTarget = (input) => {
    if (input == null) return null;
    const raw = String(input);
    if (!raw || NON_PROXYABLE_RE.test(raw)) return null;
    if (raw.startsWith(PROXY_PATH) || raw.startsWith(CURRENT_ORIGIN + PROXY_PATH)) return null;

    let resolved;
    try {
      resolved = new URL(raw, TARGET_URL);
    } catch {
      return null;
    }

    if (!/^https?:$/.test(resolved.protocol)) return null;
    if (resolved.origin === TARGET_ORIGIN) return resolved;

    if (resolved.origin === CURRENT_ORIGIN && !resolved.pathname.startsWith(PROXY_PATH)) {
      return new URL(resolved.pathname + resolved.search + resolved.hash, TARGET_ORIGIN);
    }

    return null;
  };

  const toProxyUrl = (input) => {
    const rewritten = rewriteAbsoluteTarget(input);
    return rewritten ? \`\${PROXY_ORIGIN}\${PROXY_PATH}?url=\${encodeURIComponent(rewritten.toString())}\` : input;
  };

  const toDisplayUrl = (input) => {
    if (input == null) return input;

    let resolved;
    try {
      resolved = new URL(String(input), TARGET_URL);
    } catch {
      return input;
    }

    if (!/^https?:$/.test(resolved.protocol)) return input;

    if (resolved.origin === TARGET_ORIGIN) {
      return \`\${resolved.pathname}\${resolved.search}\${resolved.hash}\` || '/';
    }

    if (resolved.origin === CURRENT_ORIGIN && !resolved.pathname.startsWith(PROXY_PATH)) {
      return \`\${resolved.pathname}\${resolved.search}\${resolved.hash}\` || '/';
    }

    return input;
  };

  const rewriteSrcSetValue = (value) =>
    String(value)
      .split(',')
      .map((part) => {
        const trimmed = part.trim();
        if (!trimmed) return part;
        const [urlPart, ...descriptors] = trimmed.split(/\\s+/);
        return [toProxyUrl(urlPart), ...descriptors].join(' ');
      })
      .join(', ');

  const rewriteAttributeValue = (attribute, value) => {
    if (value == null) return value;

    switch (String(attribute).toLowerCase()) {
      case 'srcset':
      case 'imagesrcset':
        return rewriteSrcSetValue(value);
      case 'src':
      case 'href':
      case 'action':
      case 'poster':
        return toProxyUrl(value);
      default:
        return value;
    }
  };

  Element.prototype.setAttribute = ((original) => function setAttribute(name, value) {
    return original.call(this, name, rewriteAttributeValue(name, value));
  })(Element.prototype.setAttribute);

  const patchProperty = (prototype, property, attribute = property) => {
    if (!prototype) return;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
    if (!descriptor || typeof descriptor.set !== 'function') return;

    Object.defineProperty(prototype, property, {
      configurable: true,
      enumerable: descriptor.enumerable ?? true,
      get: descriptor.get ? function get() {
        return descriptor.get.call(this);
      } : undefined,
      set: function set(value) {
        return descriptor.set.call(this, rewriteAttributeValue(attribute, value));
      },
    });
  };

  patchProperty(HTMLAnchorElement?.prototype, 'href');
  patchProperty(HTMLFormElement?.prototype, 'action');
  patchProperty(HTMLIFrameElement?.prototype, 'src');
  patchProperty(HTMLImageElement?.prototype, 'src');
  patchProperty(HTMLImageElement?.prototype, 'srcset');
  patchProperty(HTMLLinkElement?.prototype, 'href');
  patchProperty(HTMLScriptElement?.prototype, 'src');
  patchProperty(HTMLSourceElement?.prototype, 'src');
  patchProperty(HTMLSourceElement?.prototype, 'srcset');
  patchProperty(HTMLVideoElement?.prototype, 'poster');

  const patchInsertion = (prototype, methodName) => {
    if (!prototype || typeof prototype[methodName] !== 'function') return;

    const original = prototype[methodName];
    prototype[methodName] = function patchedNodeInsertion(node, ...rest) {
      if (node instanceof Element) {
        rewriteTree(node);
      }

      return original.call(this, node, ...rest);
    };
  };

  patchInsertion(Node.prototype, 'appendChild');
  patchInsertion(Node.prototype, 'insertBefore');
  patchInsertion(Node.prototype, 'replaceChild');

  const rewriteElement = (element) => {
    if (!(element instanceof Element)) return;

    ['src', 'href', 'action', 'poster'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      const rewritten = rewriteAttributeValue(attribute, value);
      if (typeof rewritten === 'string' && rewritten !== value) {
        element.setAttribute(attribute, rewritten);
      }
    });

    ['srcset', 'imagesrcset'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      const rewritten = rewriteAttributeValue(attribute, value);
      if (rewritten !== value) {
        element.setAttribute(attribute, rewritten);
      }
    });
  };

  const rewriteTree = (root) => {
    if (!(root instanceof Element)) return;
    rewriteElement(root);
    root.querySelectorAll('[src], [href], [action], [poster], [srcset], [imagesrcset]').forEach(rewriteElement);
  };

  try {
    const initialDisplayUrl = toDisplayUrl(TARGET_URL);
    if (typeof initialDisplayUrl === 'string' && initialDisplayUrl) {
      history.replaceState(history.state, document.title, initialDisplayUrl);
    }
  } catch {}

  history.pushState = ((original) => function pushState(state, title, url) {
    if (typeof url === 'string' && url) {
      return original.call(this, state, title, toDisplayUrl(url));
    }
    return original.call(this, state, title, url);
  })(history.pushState.bind(history));

  history.replaceState = ((original) => function replaceState(state, title, url) {
    if (typeof url === 'string' && url) {
      return original.call(this, state, title, toDisplayUrl(url));
    }
    return original.call(this, state, title, url);
  })(history.replaceState.bind(history));

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === 'string') {
      return originalFetch(toProxyUrl(input), init);
    }

    if (input instanceof Request) {
      const rewrittenUrl = toProxyUrl(input.url);
      if (typeof rewrittenUrl === 'string' && rewrittenUrl !== input.url) {
        return originalFetch(new Request(rewrittenUrl, input), init);
      }
    }

    return originalFetch(input, init);
  };

  XMLHttpRequest.prototype.open = ((original) => function open(method, url, ...rest) {
    return original.call(this, method, typeof url === 'string' ? toProxyUrl(url) : url, ...rest);
  })(XMLHttpRequest.prototype.open);

  window.open = ((original) => function open(url, target, features) {
    return original.call(window, typeof url === 'string' ? toProxyUrl(url) : url, target, features);
  })(window.open.bind(window));

  if (document.documentElement) {
    rewriteTree(document.documentElement);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          rewriteElement(mutation.target);
        }

        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            rewriteTree(node);
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'action', 'poster', 'srcset', 'imagesrcset'],
    });
  }
})();
</script>`})(b,c)}<base href="${b}"><meta name="referrer" content="no-referrer-when-downgrade">`;return/<head[^>]*>/i.test(d)?d.replace(/<head([^>]*)>/i,`<head$1>${e}`):`${e}${d}`})((g=((a,b)=>{let c=new URL(b).hostname.toLowerCase(),d="quranflash.com"===c||c.endsWith(".quranflash.com"),e=/\/bundles\/vijuaquranflash\/templates\/reader\/public\/qf\//i.test(a);return d&&e?a.replace(/<script\b[^>]*\bsrc=("|')[^"']*\/bundles\/vijualib\/templates\/readers\/v2\.0\/public\/qf\/js\/(?:kservice|ktemplates)\.js[^"']*\1[^>]*>\s*<\/script>\s*/gi,"").replace(/<link\b[^>]*\bhref=("|')[^"']*\/bundles\/vijualib\/templates\/readers\/v2\.0\/public\/qf\/css\/kservice\.css[^"']*\1[^>]*\/?\s*>\s*/gi,""):a})(j,e),h=e,i=d,b=g.replace(/\b(href|src|action|poster)=("|')([^"']*)\2/gi,(a,b,c,d)=>`${b}=${c}${E(d,h,i)}${c}`).replace(/\b(srcset|imagesrcset)=("|')([^"']*)\2/gi,(a,b,c,d)=>`${b}=${c}${d.split(",").map(a=>{let b=a.trim();if(!b)return a;let[c,...d]=b.split(/\s+/);return[E(c,h,i),...d].join(" ")}).join(", ")}${c}`).replace(/\bstyle=("|')([^"']*)\1/gi,(a,b,c)=>`style=${b}${F(c,h,i)}${b}`),f=b.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi,(a,b,c)=>`<style${b}>${F(c,e,d)}</style>`),f.replace(/<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi,(a,b,c)=>{let d=c.replace(/((?:var|let|const)?\s*(?:rootDir|publicRoot|hostingDomain)\s*=\s*)(["'])([^"']+)\2/g,(a,b,c,d)=>{let f=D(d,e),g=f?f.toString():d;return`${b}${c}${g}${c}`});return`<script${b}>${d}</script>`})),e,d),{status:a.status,headers:{"content-type":c,"cache-control":"no-store"}})}if(x.test(c)){let b=await a.text();return new u.NextResponse(F(b,e,d),{status:a.status,headers:{"content-type":c,"cache-control":"no-store"}})}let f=await a.arrayBuffer();return new u.NextResponse(f,{status:a.status,headers:{"content-type":c,"cache-control":"no-store"}})}catch(a){return console.error("Resource proxy failed:",a),u.NextResponse.json({error:"Website preview failed"},{status:502})}}let H=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/resource-proxy/route",pathname:"/api/resource-proxy",filename:"route",bundlePath:"app/api/resource-proxy/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/var/www/osteps/Osteps/src/app/api/resource-proxy/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:I,workUnitAsyncStorage:J,serverHooks:K}=H;function L(){return(0,g.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:J})}async function M(a,b,c){var d;let e="/api/resource-proxy/route";"/index"===e&&(e="/");let g=await H.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),E=!!(y.dynamicRoutes[D]||y.routes[C]);if(E&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let F=null;!E||H.isDev||x||(F="/index"===(F=C)?"/":F);let G=!0===H.isDev||!E,I=E&&!G,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:G,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>H.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>H.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!E)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await H.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await H.handleResponse({req:a,nextConfig:w,cacheKey:F,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!E)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&E||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await H.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),E)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[1331,1692],()=>b(b.s=50107));module.exports=c})();