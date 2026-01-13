module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},79822,e=>{"use strict";var t=e.i(47909),a=e.i(74017),r=e.i(96250),o=e.i(59756),n=e.i(61916),i=e.i(74677),s=e.i(69741),l=e.i(16795),c=e.i(87718),d=e.i(95169),p=e.i(47587),u=e.i(66012),x=e.i(70101),m=e.i(26937),E=e.i(10372),g=e.i(93695);e.i(52474);var R=e.i(5232);let T=process.env.GEMINI_API_KEY,O=e=>`
Voc\xea \xe9 um diretor de arte especializado em briefings visuais para designers.

CONTEXTO:
- Cliente: ${e.client}
- Objetivo: ${e.objective}
- Plataforma: ${e.platform}
- Tom: ${e.tone}
- P\xfablico: ${e.targetAudience}

INSTRU\xc7\xd5ES:
Crie 3 BRIEFINGS VISUAIS detalhados para designers.

Para cada briefing, inclua:

**1. CONCEITO VISUAL**
**2. PALETA DE CORES** (RGB/HEX)
**3. TIPOGRAFIA**
**4. ELEMENTOS OBRIGAT\xd3RIOS**
**5. ESTILO & T\xc9CNICA**
**6. ESPECIFICA\xc7\xd5ES T\xc9CNICAS**

FORMAT DE SA\xcdDA:
Retorne 3 briefings separados por "---OPTION---"
`;async function A(e){try{let t=await e.json();if(!t.objective&&!t.imageBase64)return Response.json({error:"Objetivo ou imagem é obrigatório"},{status:400});let a=!!t.imageBase64,r=[{text:function(e,t,a){switch(e){case"copy":default:return`
Voc\xea \xe9 um copywriter profissional especializado em marketing digital e convers\xe3o.

CONTEXTO DO CLIENTE:
- Cliente: ${t.client||"Não especificado"}
- Plataforma: ${t.platform}
- Tom de voz: ${t.tone}
- P\xfablico-alvo: ${t.targetAudience||"Geral"}

OBJETIVO:
${t.objective}

PALAVRAS-CHAVE:
${t.keywords||"Não especificado"}

INSTRU\xc7\xd5ES:
1. Crie 3 op\xe7\xf5es DIFERENTES de copy persuasivo
2. Use gatilhos mentais (escassez, urg\xeancia, prova social)
3. Inclua CTA (Call-to-Action) forte e claro
4. Adapte para ${t.platform}:
   - Instagram: M\xe1ximo 2200 caracteres, use emojis estrat\xe9gicos
   - LinkedIn: Tom profissional, entre 1000-1300 caracteres
   - Twitter: M\xe1ximo 280 caracteres, conciso e impactante
   - Facebook: Entre 40-80 caracteres para melhor engajamento
   - Email: Assunto + Preview + Corpo estruturado

FORMAT DE SA\xcdDA:
Retorne EXATAMENTE 3 op\xe7\xf5es separadas por "---OPTION---"
`;case"briefing":return O(t);case"prompt":return a?`
Voc\xea \xe9 um especialista em cria\xe7\xe3o de prompts para designers (Nano Banana).

INSTRU\xc7\xd5ES:
Analise a IMAGEM ENVIADA e identifique:
1. \xc9 uma foto de pessoa/cliente ou produto?
2. \xc9 uma refer\xeancia visual/estilo?
3. \xc9 um logo ou elemento de marca?

Baseado na imagem, crie 3 PROMPTS DIFERENTES para a designer Nano Banana:

**PROMPT 1 - Post Informativo/Educacional**
Descri\xe7\xe3o detalhada (100-200 palavras) do que a Nano Banana deve criar.
Baseado na imagem anexada, adapte para post informativo mantendo a ess\xeancia da foto.
Ilumina\xe7\xe3o: [especificar]
Cen\xe1rio: [descrever]
Elementos: [listar]
Texto sugerido na imagem: "[copy]"

**PROMPT 2 - Post Promocional/Vendas**
Descri\xe7\xe3o detalhada (100-200 palavras).
Use a imagem como base, mas adapte para venda/promo\xe7\xe3o.
CTA visual: [destaque]
Cores: [especificar]
Texto sugerido: "[copy com CTA]"

**PROMPT 3 - Post de Engajamento/Intera\xe7\xe3o**
Descri\xe7\xe3o detalhada (100-200 palavras).
Crie algo que gere intera\xe7\xe3o, baseado na imagem.
Elemento interativo: [o que chama aten\xe7\xe3o]
Pergunta/Enquete: "[copy]"

REGRAS:
- Seja MUITO descritivo e claro
- Especifique EXATAMENTE o que deve aparecer
- Mencione cores, ilumina\xe7\xe3o, \xe2ngulos
- Inclua sugest\xf5es de texto NA IMAGEM
- Pense: "O que a Nano Banana precisa saber para criar isso?"

FORMAT DE SA\xcdDA:
3 prompts separados por "---OPTION---"
`:O(t);case"calendar":return`
Voc\xea \xe9 um estrategista de conte\xfado especializado em planejamento editorial.

CONTEXTO:
- Cliente: ${t.client}
- Objetivo: ${t.objective}
- Plataforma: ${t.platform}

INSTRU\xc7\xd5ES:
Crie um CALEND\xc1RIO DE CONTE\xdaDO para 30 DIAS em formato de tabela Markdown.

| Data | Hora | Tipo | Tema | CTA | Hashtags |
|------|------|------|------|-----|----------|
| 14/01 | 18h | Educacional | [tema] | [cta] | #hash1 #hash2 |

Gere 30 linhas (um m\xeas completo).
REGRA 80/20: 80% valor, 20% promocional

FORMAT DE SA\xcdDA:
Retorne a tabela completa
`;case"script":return`
Voc\xea \xe9 um roteirista especializado em conte\xfado para redes sociais.

CONTEXTO:
- Cliente: ${t.client}
- Objetivo: ${t.objective}
- Dura\xe7\xe3o: ${t.duration||"30s"}

INSTRU\xc7\xd5ES:
Crie 3 ROTEIROS COMPLETOS para v\xeddeo de ${t.duration}.

Para cada roteiro, inclua:
- GANCHO (0-3s)
- ESTRUTURA POR SEGUNDO
- ELEMENTOS VISUAIS
- \xc1UDIO/NARRA\xc7\xc3O
- TRILHA SONORA

FORMAT DE SA\xcdDA:
3 roteiros separados por "---OPTION---"
`;case"email":return`
Voc\xea \xe9 um especialista em email marketing.

CONTEXTO:
- Cliente: ${t.client}
- Objetivo: ${t.objective}

INSTRU\xc7\xd5ES:
Crie 3 EMAILS COMPLETOS otimizados.

Para cada email:
- ASSUNTO (45-65 chars)
- PREVIEW TEXT
- CORPO ESTRUTURADO
- CTA PRINCIPAL
- P.S.

FORMAT DE SA\xcdDA:
3 emails separados por "---OPTION---"
`}}(t.type,t,a)}];a&&t.imageBase64&&r.push({inline_data:{mime_type:"image/jpeg",data:t.imageBase64}});let o=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${T}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:r}],generationConfig:{temperature:.9,topK:40,topP:.95,maxOutputTokens:2048}})});if(!o.ok)throw Error("Gemini API error");let n=await o.json(),i=n.candidates?.[0]?.content?.parts?.[0]?.text||"",s=function(e){let t=e.split("---OPTION---").map(e=>e.trim()).filter(e=>e.length>0);if(1===t.length){let t=e.split(/(?=Opção \d+:|Option \d+:|PROMPT \d+)/gi);if(t.length>1)return t.map(e=>e.trim()).filter(e=>e.length>0)}for(;t.length<3&&t.length>0;)t.push(t[0]);return t.slice(0,3)}(i);return Response.json({options:s,raw:i})}catch(e){return console.error("Content generation error:",e),Response.json({error:"Erro ao gerar conteúdo",details:e},{status:500})}}e.s(["POST",()=>A],62671);var h=e.i(62671);let f=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/generate-content/route",pathname:"/api/generate-content",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/generate-content/route.ts",nextConfigOutput:"",userland:h}),{workAsyncStorage:v,workUnitAsyncStorage:C,serverHooks:I}=f;function S(){return(0,r.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:C})}async function P(e,t,r){f.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let T="/api/generate-content/route";T=T.replace(/\/index$/,"")||"/";let O=await f.prepare(e,t,{srcPage:T,multiZoneDraftMode:!1});if(!O)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:A,params:h,nextConfig:v,parsedUrl:C,isDraftMode:I,prerenderManifest:S,routerServerContext:P,isOnDemandRevalidate:N,revalidateOnlyGenerated:b,resolvedPathname:w,clientReferenceManifest:y,serverActionsManifest:D}=O,M=(0,s.normalizeAppPath)(T),j=!!(S.dynamicRoutes[M]||S.routes[w]),U=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,C,!1):t.end("This page could not be found"),null);if(j&&!I){let e=!!S.routes[w],t=S.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await U();throw new g.NoFallbackError}}let $=null;!j||f.isDev||I||($="/index"===($=w)?"/":$);let k=!0===f.isDev||!j,q=j&&!k;D&&y&&(0,i.setManifestsSingleton)({page:T,clientReferenceManifest:y,serverActionsManifest:D});let _=e.method||"GET",H=(0,n.getTracer)(),F=H.getActiveScopeSpan(),B={params:h,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,o)=>f.onRequestError(e,t,r,o,P)},sharedContext:{buildId:A}},L=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),G=c.NextRequestAdapter.fromNodeNextRequest(L,(0,c.signalFromNodeResponse)(t));try{let i=async e=>f.handle(G,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${_} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${_} ${T}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var n,l;let c=async({previousCacheEntry:a})=>{try{if(!s&&N&&b&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&r.waitUntil&&(r.waitUntil(l),l=void 0);let c=B.renderOpts.collectedTags;if(!j)return await (0,u.sendResponse)(L,V,n,B.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[E.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,r=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:T,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:N})},!1,P),t}},d=await f.handleResponse({req:e,nextConfig:v,cacheKey:$,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:b,responseGenerator:c,waitUntil:r.waitUntil,isMinimalMode:s});if(!j)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",N?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let g=(0,x.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&j||g.delete(E.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||g.get("Cache-Control")||g.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(L,V,new Response(d.value.body,{headers:g,status:d.value.status||200})),null};F?await l(F):await H.withPropagatedContext(e.headers,()=>H.trace(d.BaseServerSpan.handleRequest,{spanName:`${_} ${T}`,kind:n.SpanKind.SERVER,attributes:{"http.method":_,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:q,isOnDemandRevalidate:N})},!1,P),j)throw t;return await (0,u.sendResponse)(L,V,new Response(null,{status:500})),null}}e.s(["handler",()=>P,"patchFetch",()=>S,"routeModule",()=>f,"serverHooks",()=>I,"workAsyncStorage",()=>v,"workUnitAsyncStorage",()=>C],79822)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__e11b5c10._.js.map