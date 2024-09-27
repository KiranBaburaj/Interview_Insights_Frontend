import{r as g,y as Me,f as c,_ as Te,j as o,E as xe,A as U,F as bt,H as gt,I as Ut,u as Yt,a as Gt,b as $e,k as Kt,J as Xt,K as Qt,M as ht,N as qt,m as xt,L as Zt,O as ea,P as ta}from"./index-23KSCkf2.js";import{d as aa}from"./Search-dkWttm00.js";import{d as oa,a as ra}from"./BookmarkBorder-DYUNgNkC.js";import{N as sa}from"./Navbar-C_TXS6Af.js";import{T as na}from"./ThemeProvider-CFJv2GCe.js";import{C as la}from"./Container-gw4__q6g.js";import{e as yt,k as ct,g as He,a as Je,s as Q,u as We,c as ie,b as Ue,d as Ye,l as Be,m as Tt,B as X,T as le}from"./Box-XM2tYgUZ.js";import{h as zt,n as ia,c as ca,i as ut,o as Ve,j as ua,e as Nt,d as he,P as da,B as pa}from"./List-BX7Kqnf-.js";import{T as _e}from"./TextField-ChqtAR1b.js";import{M as ee}from"./MenuItem-DkIJAbyY.js";import{v as ma}from"./visuallyHidden-Dan1xhjv.js";import{F as kt,C as St}from"./FormControlLabel-DV34RCkP.js";import{C as va}from"./CircularProgress-BoXx89RB.js";import{G as Ct}from"./Grid-DwKISTRE.js";import{C as fa,a as ba}from"./CardContent-D8hgQBL1.js";import{D as ga}from"./Divider-J8XmDzXG.js";import{I as ha}from"./IconButton-B9EPIKEN.js";import"./ExitToApp-Cq2wJhaG.js";import"./NotificationList-CGg9UlMe.js";import"./notificationWebSocket-DO8tf4ns.js";import"./Snackbar-CAiDnlwr.js";import"./Avatar-BfffLGXU.js";import"./useSlot-mVqb9SJL.js";import"./useThemeProps-B1ZZYBGa.js";import"./dividerClasses-CWvG6tR0.js";import"./listItemTextClasses-C2fmnH8s.js";import"./Stack-BoTMgSfs.js";function xa(e,t,a=(s,p)=>s===p){return e.length===t.length&&e.every((s,p)=>a(s,t[p]))}const ya=2;function _t(e,t){return e-t}function Pt(e,t){var a;const{index:s}=(a=e.reduce((p,h,y)=>{const u=Math.abs(t-h);return p===null||u<p.distance||u===p.distance?{distance:u,index:y}:p},null))!=null?a:{};return s}function Ae(e,t){if(t.current!==void 0&&e.changedTouches){const a=e;for(let s=0;s<a.changedTouches.length;s+=1){const p=a.changedTouches[s];if(p.identifier===t.current)return{x:p.clientX,y:p.clientY}}return!1}return{x:e.clientX,y:e.clientY}}function De(e,t,a){return(e-t)*100/(a-t)}function ka(e,t,a){return(a-t)*e+t}function Sa(e){if(Math.abs(e)<1){const a=e.toExponential().split("e-"),s=a[0].split(".")[1];return(s?s.length:0)+parseInt(a[1],10)}const t=e.toString().split(".")[1];return t?t.length:0}function Ca(e,t,a){const s=Math.round((e-a)/t)*t+a;return Number(s.toFixed(Sa(t)))}function Lt({values:e,newValue:t,index:a}){const s=e.slice();return s[a]=t,s.sort(_t)}function Oe({sliderRef:e,activeIndex:t,setActive:a}){var s,p;const h=Ve(e.current);if(!((s=e.current)!=null&&s.contains(h.activeElement))||Number(h==null||(p=h.activeElement)==null?void 0:p.getAttribute("data-index"))!==t){var y;(y=e.current)==null||y.querySelector(`[type="range"][data-index="${t}"]`).focus()}a&&a(t)}function Ee(e,t){return typeof e=="number"&&typeof t=="number"?e===t:typeof e=="object"&&typeof t=="object"?xa(e,t):!1}const Pa={horizontal:{offset:e=>({left:`${e}%`}),leap:e=>({width:`${e}%`})},"horizontal-reverse":{offset:e=>({right:`${e}%`}),leap:e=>({width:`${e}%`})},vertical:{offset:e=>({bottom:`${e}%`}),leap:e=>({height:`${e}%`})}},La=e=>e;let Fe;function $t(){return Fe===void 0&&(typeof CSS<"u"&&typeof CSS.supports=="function"?Fe=CSS.supports("touch-action","none"):Fe=!0),Fe}function $a(e){const{"aria-labelledby":t,defaultValue:a,disabled:s=!1,disableSwap:p=!1,isRtl:h=!1,marks:y=!1,max:u=100,min:d=0,name:$,onChange:J,onChangeCommitted:_,orientation:A="horizontal",rootRef:C,scale:k=La,step:j=1,shiftStep:W=10,tabIndex:M,value:Y}=e,S=g.useRef(),[H,P]=g.useState(-1),[q,T]=g.useState(-1),[E,x]=g.useState(!1),z=g.useRef(0),[F,ce]=zt({controlled:Y,default:a??d,name:"Slider"}),B=J&&((r,n,i)=>{const v=r.nativeEvent||r,f=new v.constructor(v.type,v);Object.defineProperty(f,"target",{writable:!0,value:{value:n,name:$}}),J(f,n,i)}),ue=Array.isArray(F);let N=ue?F.slice().sort(_t):[F];N=N.map(r=>r==null?d:Me(r,d,u));const ye=y===!0&&j!==null?[...Array(Math.floor((u-d)/j)+1)].map((r,n)=>({value:d+j*n})):y||[],R=ye.map(r=>r.value),{isFocusVisibleRef:G,onBlur:we,onFocus:je,ref:Re}=ia(),[de,pe]=g.useState(-1),V=g.useRef(),ke=yt(Re,V),Se=yt(C,ke),fe=r=>n=>{var i;const v=Number(n.currentTarget.getAttribute("data-index"));je(n),G.current===!0&&pe(v),T(v),r==null||(i=r.onFocus)==null||i.call(r,n)},be=r=>n=>{var i;we(n),G.current===!1&&pe(-1),T(-1),r==null||(i=r.onBlur)==null||i.call(r,n)},Ce=(r,n)=>{const i=Number(r.currentTarget.getAttribute("data-index")),v=N[i],f=R.indexOf(v);let m=n;if(ye&&j==null){const se=R[R.length-1];m>se?m=se:m<R[0]?m=R[0]:m=m<v?R[f-1]:R[f+1]}if(m=Me(m,d,u),ue){p&&(m=Me(m,N[i-1]||-1/0,N[i+1]||1/0));const se=m;m=Lt({values:N,newValue:m,index:i});let ne=i;p||(ne=m.indexOf(se)),Oe({sliderRef:V,activeIndex:ne})}ce(m),pe(i),B&&!Ee(m,F)&&B(r,m,i),_&&_(r,m)},l=r=>n=>{var i;if(j!==null){const v=Number(n.currentTarget.getAttribute("data-index")),f=N[v];let m=null;(n.key==="ArrowLeft"||n.key==="ArrowDown")&&n.shiftKey||n.key==="PageDown"?m=Math.max(f-W,d):((n.key==="ArrowRight"||n.key==="ArrowUp")&&n.shiftKey||n.key==="PageUp")&&(m=Math.min(f+W,u)),m!==null&&(Ce(n,m),n.preventDefault())}r==null||(i=r.onKeyDown)==null||i.call(r,n)};ca(()=>{if(s&&V.current.contains(document.activeElement)){var r;(r=document.activeElement)==null||r.blur()}},[s]),s&&H!==-1&&P(-1),s&&de!==-1&&pe(-1);const K=r=>n=>{var i;(i=r.onChange)==null||i.call(r,n),Ce(n,n.target.valueAsNumber)},ze=g.useRef();let me=A;h&&A==="horizontal"&&(me+="-reverse");const w=({finger:r,move:n=!1})=>{const{current:i}=V,{width:v,height:f,bottom:m,left:se}=i.getBoundingClientRect();let ne;me.indexOf("vertical")===0?ne=(m-r.y)/f:ne=(r.x-se)/v,me.indexOf("-reverse")!==-1&&(ne=1-ne);let b;if(b=ka(ne,d,u),j)b=Ca(b,j,d);else{const Le=Pt(R,b);b=R[Le]}b=Me(b,d,u);let Z=0;if(ue){n?Z=ze.current:Z=Pt(N,b),p&&(b=Me(b,N[Z-1]||-1/0,N[Z+1]||1/0));const Le=b;b=Lt({values:N,newValue:b,index:Z}),p&&n||(Z=b.indexOf(Le),ze.current=Z)}return{newValue:b,activeIndex:Z}},L=ut(r=>{const n=Ae(r,S);if(!n)return;if(z.current+=1,r.type==="mousemove"&&r.buttons===0){oe(r);return}const{newValue:i,activeIndex:v}=w({finger:n,move:!0});Oe({sliderRef:V,activeIndex:v,setActive:P}),ce(i),!E&&z.current>ya&&x(!0),B&&!Ee(i,F)&&B(r,i,v)}),oe=ut(r=>{const n=Ae(r,S);if(x(!1),!n)return;const{newValue:i}=w({finger:n,move:!0});P(-1),r.type==="touchend"&&T(-1),_&&_(r,i),S.current=void 0,re()}),ge=ut(r=>{if(s)return;$t()||r.preventDefault();const n=r.changedTouches[0];n!=null&&(S.current=n.identifier);const i=Ae(r,S);if(i!==!1){const{newValue:f,activeIndex:m}=w({finger:i});Oe({sliderRef:V,activeIndex:m,setActive:P}),ce(f),B&&!Ee(f,F)&&B(r,f,m)}z.current=0;const v=Ve(V.current);v.addEventListener("touchmove",L,{passive:!0}),v.addEventListener("touchend",oe,{passive:!0})}),re=g.useCallback(()=>{const r=Ve(V.current);r.removeEventListener("mousemove",L),r.removeEventListener("mouseup",oe),r.removeEventListener("touchmove",L),r.removeEventListener("touchend",oe)},[oe,L]);g.useEffect(()=>{const{current:r}=V;return r.addEventListener("touchstart",ge,{passive:$t()}),()=>{r.removeEventListener("touchstart",ge),re()}},[re,ge]),g.useEffect(()=>{s&&re()},[s,re]);const Ge=r=>n=>{var i;if((i=r.onMouseDown)==null||i.call(r,n),s||n.defaultPrevented||n.button!==0)return;n.preventDefault();const v=Ae(n,S);if(v!==!1){const{newValue:m,activeIndex:se}=w({finger:v});Oe({sliderRef:V,activeIndex:se,setActive:P}),ce(m),B&&!Ee(m,F)&&B(n,m,se)}z.current=0;const f=Ve(V.current);f.addEventListener("mousemove",L,{passive:!0}),f.addEventListener("mouseup",oe)},D=De(ue?N[0]:d,d,u),Pe=De(N[N.length-1],d,u)-D,Ke=(r={})=>{const n=ct(r),i={onMouseDown:Ge(n||{})},v=c({},n,i);return c({},r,{ref:Se},v)},Xe=r=>n=>{var i;(i=r.onMouseOver)==null||i.call(r,n);const v=Number(n.currentTarget.getAttribute("data-index"));T(v)},Qe=r=>n=>{var i;(i=r.onMouseLeave)==null||i.call(r,n),T(-1)};return{active:H,axis:me,axisProps:Pa,dragging:E,focusedThumbIndex:de,getHiddenInputProps:(r={})=>{var n;const i=ct(r),v={onChange:K(i||{}),onFocus:fe(i||{}),onBlur:be(i||{}),onKeyDown:l(i||{})},f=c({},i,v);return c({tabIndex:M,"aria-labelledby":t,"aria-orientation":A,"aria-valuemax":k(u),"aria-valuemin":k(d),name:$,type:"range",min:e.min,max:e.max,step:e.step===null&&e.marks?"any":(n=e.step)!=null?n:void 0,disabled:s},r,f,{style:c({},ma,{direction:h?"rtl":"ltr",width:"100%",height:"100%"})})},getRootProps:Ke,getThumbProps:(r={})=>{const n=ct(r),i={onMouseOver:Xe(n||{}),onMouseLeave:Qe(n||{})};return c({},r,n,i)},marks:ye,open:q,range:ue,rootRef:Se,trackLeap:Pe,trackOffset:D,values:N,getThumbStyle:r=>({pointerEvents:H!==-1&&H!==r?"none":void 0})}}function wa(e){return He("MuiCardActions",e)}Je("MuiCardActions",["root","spacing"]);const ja=["disableSpacing","className"],Ra=e=>{const{classes:t,disableSpacing:a}=e;return Ue({root:["root",!a&&"spacing"]},wa,t)},Ia=Q("div",{name:"MuiCardActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,!a.disableSpacing&&t.spacing]}})(({ownerState:e})=>c({display:"flex",alignItems:"center",padding:8},!e.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}})),Ma=g.forwardRef(function(t,a){const s=We({props:t,name:"MuiCardActions"}),{disableSpacing:p=!1,className:h}=s,y=Te(s,ja),u=c({},s,{disableSpacing:p}),d=Ra(u);return o.jsx(Ia,c({className:ie(d.root,h),ownerState:u,ref:a},y))});function Ta(e){return He("MuiPagination",e)}Je("MuiPagination",["root","ul","outlined","text"]);const za=["boundaryCount","componentName","count","defaultPage","disabled","hideNextButton","hidePrevButton","onChange","page","showFirstButton","showLastButton","siblingCount"];function Na(e={}){const{boundaryCount:t=1,componentName:a="usePagination",count:s=1,defaultPage:p=1,disabled:h=!1,hideNextButton:y=!1,hidePrevButton:u=!1,onChange:d,page:$,showFirstButton:J=!1,showLastButton:_=!1,siblingCount:A=1}=e,C=Te(e,za),[k,j]=zt({controlled:$,default:p,name:a,state:"page"}),W=(x,z)=>{$||j(z),d&&d(x,z)},M=(x,z)=>{const F=z-x+1;return Array.from({length:F},(ce,B)=>x+B)},Y=M(1,Math.min(t,s)),S=M(Math.max(s-t+1,t+1),s),H=Math.max(Math.min(k-A,s-t-A*2-1),t+2),P=Math.min(Math.max(k+A,t+A*2+2),S.length>0?S[0]-2:s-1),q=[...J?["first"]:[],...u?[]:["previous"],...Y,...H>t+2?["start-ellipsis"]:t+1<s-t?[t+1]:[],...M(H,P),...P<s-t-1?["end-ellipsis"]:s-t>t?[s-t]:[],...S,...y?[]:["next"],..._?["last"]:[]],T=x=>{switch(x){case"first":return 1;case"previous":return k-1;case"next":return k+1;case"last":return s;default:return null}},E=q.map(x=>typeof x=="number"?{onClick:z=>{W(z,x)},type:"page",page:x,selected:x===k,disabled:h,"aria-current":x===k?"true":void 0}:{onClick:z=>{W(z,T(x))},type:x,page:T(x),selected:!1,disabled:h||x.indexOf("ellipsis")===-1&&(x==="next"||x==="last"?k>=s:k<=1)});return c({items:E},C)}function _a(e){return He("MuiPaginationItem",e)}const te=Je("MuiPaginationItem",["root","page","sizeSmall","sizeLarge","text","textPrimary","textSecondary","outlined","outlinedPrimary","outlinedSecondary","rounded","ellipsis","firstLast","previousNext","focusVisible","disabled","selected","icon","colorPrimary","colorSecondary"]),wt=Ye(o.jsx("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),"FirstPage"),jt=Ye(o.jsx("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),"LastPage"),Rt=Ye(o.jsx("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),"NavigateBefore"),It=Ye(o.jsx("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),"NavigateNext"),Aa=["className","color","component","components","disabled","page","selected","shape","size","slots","type","variant"],At=(e,t)=>{const{ownerState:a}=e;return[t.root,t[a.variant],t[`size${U(a.size)}`],a.variant==="text"&&t[`text${U(a.color)}`],a.variant==="outlined"&&t[`outlined${U(a.color)}`],a.shape==="rounded"&&t.rounded,a.type==="page"&&t.page,(a.type==="start-ellipsis"||a.type==="end-ellipsis")&&t.ellipsis,(a.type==="previous"||a.type==="next")&&t.previousNext,(a.type==="first"||a.type==="last")&&t.firstLast]},Oa=e=>{const{classes:t,color:a,disabled:s,selected:p,size:h,shape:y,type:u,variant:d}=e,$={root:["root",`size${U(h)}`,d,y,a!=="standard"&&`color${U(a)}`,a!=="standard"&&`${d}${U(a)}`,s&&"disabled",p&&"selected",{page:"page",first:"firstLast",last:"firstLast","start-ellipsis":"ellipsis","end-ellipsis":"ellipsis",previous:"previousNext",next:"previousNext"}[u]],icon:["icon"]};return Ue($,_a,t)},Ea=Q("div",{name:"MuiPaginationItem",slot:"Root",overridesResolver:At})(({theme:e,ownerState:t})=>c({},e.typography.body2,{borderRadius:32/2,textAlign:"center",boxSizing:"border-box",minWidth:32,padding:"0 6px",margin:"0 3px",color:(e.vars||e).palette.text.primary,height:"auto",[`&.${te.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity}},t.size==="small"&&{minWidth:26,borderRadius:26/2,margin:"0 1px",padding:"0 4px"},t.size==="large"&&{minWidth:40,borderRadius:40/2,padding:"0 10px",fontSize:e.typography.pxToRem(15)})),Fa=Q(ua,{name:"MuiPaginationItem",slot:"Root",overridesResolver:At})(({theme:e,ownerState:t})=>c({},e.typography.body2,{borderRadius:32/2,textAlign:"center",boxSizing:"border-box",minWidth:32,height:32,padding:"0 6px",margin:"0 3px",color:(e.vars||e).palette.text.primary,[`&.${te.focusVisible}`]:{backgroundColor:(e.vars||e).palette.action.focus},[`&.${te.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity},transition:e.transitions.create(["color","background-color"],{duration:e.transitions.duration.short}),"&:hover":{backgroundColor:(e.vars||e).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${te.selected}`]:{backgroundColor:(e.vars||e).palette.action.selected,"&:hover":{backgroundColor:e.vars?`rgba(${e.vars.palette.action.selectedChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.hoverOpacity}))`:xe(e.palette.action.selected,e.palette.action.selectedOpacity+e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:(e.vars||e).palette.action.selected}},[`&.${te.focusVisible}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette.action.selectedChannel} / calc(${e.vars.palette.action.selectedOpacity} + ${e.vars.palette.action.focusOpacity}))`:xe(e.palette.action.selected,e.palette.action.selectedOpacity+e.palette.action.focusOpacity)},[`&.${te.disabled}`]:{opacity:1,color:(e.vars||e).palette.action.disabled,backgroundColor:(e.vars||e).palette.action.selected}}},t.size==="small"&&{minWidth:26,height:26,borderRadius:26/2,margin:"0 1px",padding:"0 4px"},t.size==="large"&&{minWidth:40,height:40,borderRadius:40/2,padding:"0 10px",fontSize:e.typography.pxToRem(15)},t.shape==="rounded"&&{borderRadius:(e.vars||e).shape.borderRadius}),({theme:e,ownerState:t})=>c({},t.variant==="text"&&{[`&.${te.selected}`]:c({},t.color!=="standard"&&{color:(e.vars||e).palette[t.color].contrastText,backgroundColor:(e.vars||e).palette[t.color].main,"&:hover":{backgroundColor:(e.vars||e).palette[t.color].dark,"@media (hover: none)":{backgroundColor:(e.vars||e).palette[t.color].main}},[`&.${te.focusVisible}`]:{backgroundColor:(e.vars||e).palette[t.color].dark}},{[`&.${te.disabled}`]:{color:(e.vars||e).palette.action.disabled}})},t.variant==="outlined"&&{border:e.vars?`1px solid rgba(${e.vars.palette.common.onBackgroundChannel} / 0.23)`:`1px solid ${e.palette.mode==="light"?"rgba(0, 0, 0, 0.23)":"rgba(255, 255, 255, 0.23)"}`,[`&.${te.selected}`]:c({},t.color!=="standard"&&{color:(e.vars||e).palette[t.color].main,border:`1px solid ${e.vars?`rgba(${e.vars.palette[t.color].mainChannel} / 0.5)`:xe(e.palette[t.color].main,.5)}`,backgroundColor:e.vars?`rgba(${e.vars.palette[t.color].mainChannel} / ${e.vars.palette.action.activatedOpacity})`:xe(e.palette[t.color].main,e.palette.action.activatedOpacity),"&:hover":{backgroundColor:e.vars?`rgba(${e.vars.palette[t.color].mainChannel} / calc(${e.vars.palette.action.activatedOpacity} + ${e.vars.palette.action.focusOpacity}))`:xe(e.palette[t.color].main,e.palette.action.activatedOpacity+e.palette.action.focusOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${te.focusVisible}`]:{backgroundColor:e.vars?`rgba(${e.vars.palette[t.color].mainChannel} / calc(${e.vars.palette.action.activatedOpacity} + ${e.vars.palette.action.focusOpacity}))`:xe(e.palette[t.color].main,e.palette.action.activatedOpacity+e.palette.action.focusOpacity)}},{[`&.${te.disabled}`]:{borderColor:(e.vars||e).palette.action.disabledBackground,color:(e.vars||e).palette.action.disabled}})})),Ba=Q("div",{name:"MuiPaginationItem",slot:"Icon",overridesResolver:(e,t)=>t.icon})(({theme:e,ownerState:t})=>c({fontSize:e.typography.pxToRem(20),margin:"0 -8px"},t.size==="small"&&{fontSize:e.typography.pxToRem(18)},t.size==="large"&&{fontSize:e.typography.pxToRem(22)})),Va=g.forwardRef(function(t,a){const s=We({props:t,name:"MuiPaginationItem"}),{className:p,color:h="standard",component:y,components:u={},disabled:d=!1,page:$,selected:J=!1,shape:_="circular",size:A="medium",slots:C={},type:k="page",variant:j="text"}=s,W=Te(s,Aa),M=c({},s,{color:h,disabled:d,selected:J,shape:_,size:A,type:k,variant:j}),Y=Nt(),S=Oa(M),P=(Y?{previous:C.next||u.next||It,next:C.previous||u.previous||Rt,last:C.first||u.first||wt,first:C.last||u.last||jt}:{previous:C.previous||u.previous||Rt,next:C.next||u.next||It,first:C.first||u.first||wt,last:C.last||u.last||jt})[k];return k==="start-ellipsis"||k==="end-ellipsis"?o.jsx(Ea,{ref:a,ownerState:M,className:ie(S.root,p),children:"…"}):o.jsxs(Fa,c({ref:a,ownerState:M,component:y,disabled:d,className:ie(S.root,p)},W,{children:[k==="page"&&$,P?o.jsx(Ba,{as:P,ownerState:M,className:S.icon}):null]}))}),Da=["boundaryCount","className","color","count","defaultPage","disabled","getItemAriaLabel","hideNextButton","hidePrevButton","onChange","page","renderItem","shape","showFirstButton","showLastButton","siblingCount","size","variant"],Ha=e=>{const{classes:t,variant:a}=e;return Ue({root:["root",a],ul:["ul"]},Ta,t)},Ja=Q("nav",{name:"MuiPagination",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[a.variant]]}})({}),Wa=Q("ul",{name:"MuiPagination",slot:"Ul",overridesResolver:(e,t)=>t.ul})({display:"flex",flexWrap:"wrap",alignItems:"center",padding:0,margin:0,listStyle:"none"});function Ua(e,t,a){return e==="page"?`${a?"":"Go to "}page ${t}`:`Go to ${e} page`}const Ya=g.forwardRef(function(t,a){const s=We({props:t,name:"MuiPagination"}),{boundaryCount:p=1,className:h,color:y="standard",count:u=1,defaultPage:d=1,disabled:$=!1,getItemAriaLabel:J=Ua,hideNextButton:_=!1,hidePrevButton:A=!1,renderItem:C=E=>o.jsx(Va,c({},E)),shape:k="circular",showFirstButton:j=!1,showLastButton:W=!1,siblingCount:M=1,size:Y="medium",variant:S="text"}=s,H=Te(s,Da),{items:P}=Na(c({},s,{componentName:"Pagination"})),q=c({},s,{boundaryCount:p,color:y,count:u,defaultPage:d,disabled:$,getItemAriaLabel:J,hideNextButton:_,hidePrevButton:A,renderItem:C,shape:k,showFirstButton:j,showLastButton:W,siblingCount:M,size:Y,variant:S}),T=Ha(q);return o.jsx(Ja,c({"aria-label":"pagination navigation",className:ie(T.root,h),ownerState:q,ref:a},H,{children:o.jsx(Wa,{className:T.ul,ownerState:q,children:P.map((E,x)=>o.jsx("li",{children:C(c({},E,{color:y,"aria-label":J(E.type,E.page,E.selected),shape:k,size:Y,variant:S}))},x))})}))}),Ga=e=>!e||!Be(e);function Ka(e){return He("MuiSlider",e)}const ae=Je("MuiSlider",["root","active","colorPrimary","colorSecondary","colorError","colorInfo","colorSuccess","colorWarning","disabled","dragging","focusVisible","mark","markActive","marked","markLabel","markLabelActive","rail","sizeSmall","thumb","thumbColorPrimary","thumbColorSecondary","thumbColorError","thumbColorSuccess","thumbColorInfo","thumbColorWarning","track","trackInverted","trackFalse","thumbSizeSmall","valueLabel","valueLabelOpen","valueLabelCircle","valueLabelLabel","vertical"]),Xa=e=>{const{open:t}=e;return{offset:ie(t&&ae.valueLabelOpen),circle:ae.valueLabelCircle,label:ae.valueLabelLabel}};function Qa(e){const{children:t,className:a,value:s}=e,p=Xa(e);return t?g.cloneElement(t,{className:ie(t.props.className)},o.jsxs(g.Fragment,{children:[t.props.children,o.jsx("span",{className:ie(p.offset,a),"aria-hidden":!0,children:o.jsx("span",{className:p.circle,children:o.jsx("span",{className:p.label,children:s})})})]})):null}const qa=["aria-label","aria-valuetext","aria-labelledby","component","components","componentsProps","color","classes","className","disableSwap","disabled","getAriaLabel","getAriaValueText","marks","max","min","name","onChange","onChangeCommitted","orientation","shiftStep","size","step","scale","slotProps","slots","tabIndex","track","value","valueLabelDisplay","valueLabelFormat"];function Mt(e){return e}const Za=Q("span",{name:"MuiSlider",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,t[`color${U(a.color)}`],a.size!=="medium"&&t[`size${U(a.size)}`],a.marked&&t.marked,a.orientation==="vertical"&&t.vertical,a.track==="inverted"&&t.trackInverted,a.track===!1&&t.trackFalse]}})(({theme:e})=>{var t;return{borderRadius:12,boxSizing:"content-box",display:"inline-block",position:"relative",cursor:"pointer",touchAction:"none",WebkitTapHighlightColor:"transparent","@media print":{colorAdjust:"exact"},[`&.${ae.disabled}`]:{pointerEvents:"none",cursor:"default",color:(e.vars||e).palette.grey[400]},[`&.${ae.dragging}`]:{[`& .${ae.thumb}, & .${ae.track}`]:{transition:"none"}},variants:[...Object.keys(((t=e.vars)!=null?t:e).palette).filter(a=>{var s;return((s=e.vars)!=null?s:e).palette[a].main}).map(a=>({props:{color:a},style:{color:(e.vars||e).palette[a].main}})),{props:{orientation:"horizontal"},style:{height:4,width:"100%",padding:"13px 0","@media (pointer: coarse)":{padding:"20px 0"}}},{props:{orientation:"horizontal",size:"small"},style:{height:2}},{props:{orientation:"horizontal",marked:!0},style:{marginBottom:20}},{props:{orientation:"vertical"},style:{height:"100%",width:4,padding:"0 13px","@media (pointer: coarse)":{padding:"0 20px"}}},{props:{orientation:"vertical",size:"small"},style:{width:2}},{props:{orientation:"vertical",marked:!0},style:{marginRight:44}}]}}),eo=Q("span",{name:"MuiSlider",slot:"Rail",overridesResolver:(e,t)=>t.rail})({display:"block",position:"absolute",borderRadius:"inherit",backgroundColor:"currentColor",opacity:.38,variants:[{props:{orientation:"horizontal"},style:{width:"100%",height:"inherit",top:"50%",transform:"translateY(-50%)"}},{props:{orientation:"vertical"},style:{height:"100%",width:"inherit",left:"50%",transform:"translateX(-50%)"}},{props:{track:"inverted"},style:{opacity:1}}]}),to=Q("span",{name:"MuiSlider",slot:"Track",overridesResolver:(e,t)=>t.track})(({theme:e})=>{var t;return{display:"block",position:"absolute",borderRadius:"inherit",border:"1px solid currentColor",backgroundColor:"currentColor",transition:e.transitions.create(["left","width","bottom","height"],{duration:e.transitions.duration.shortest}),variants:[{props:{size:"small"},style:{border:"none"}},{props:{orientation:"horizontal"},style:{height:"inherit",top:"50%",transform:"translateY(-50%)"}},{props:{orientation:"vertical"},style:{width:"inherit",left:"50%",transform:"translateX(-50%)"}},{props:{track:!1},style:{display:"none"}},...Object.keys(((t=e.vars)!=null?t:e).palette).filter(a=>{var s;return((s=e.vars)!=null?s:e).palette[a].main}).map(a=>({props:{color:a,track:"inverted"},style:c({},e.vars?{backgroundColor:e.vars.palette.Slider[`${a}Track`],borderColor:e.vars.palette.Slider[`${a}Track`]}:c({backgroundColor:bt(e.palette[a].main,.62),borderColor:bt(e.palette[a].main,.62)},e.applyStyles("dark",{backgroundColor:gt(e.palette[a].main,.5)}),e.applyStyles("dark",{borderColor:gt(e.palette[a].main,.5)})))}))]}}),ao=Q("span",{name:"MuiSlider",slot:"Thumb",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.thumb,t[`thumbColor${U(a.color)}`],a.size!=="medium"&&t[`thumbSize${U(a.size)}`]]}})(({theme:e})=>{var t;return{position:"absolute",width:20,height:20,boxSizing:"border-box",borderRadius:"50%",outline:0,backgroundColor:"currentColor",display:"flex",alignItems:"center",justifyContent:"center",transition:e.transitions.create(["box-shadow","left","bottom"],{duration:e.transitions.duration.shortest}),"&::before":{position:"absolute",content:'""',borderRadius:"inherit",width:"100%",height:"100%",boxShadow:(e.vars||e).shadows[2]},"&::after":{position:"absolute",content:'""',borderRadius:"50%",width:42,height:42,top:"50%",left:"50%",transform:"translate(-50%, -50%)"},[`&.${ae.disabled}`]:{"&:hover":{boxShadow:"none"}},variants:[{props:{size:"small"},style:{width:12,height:12,"&::before":{boxShadow:"none"}}},{props:{orientation:"horizontal"},style:{top:"50%",transform:"translate(-50%, -50%)"}},{props:{orientation:"vertical"},style:{left:"50%",transform:"translate(-50%, 50%)"}},...Object.keys(((t=e.vars)!=null?t:e).palette).filter(a=>{var s;return((s=e.vars)!=null?s:e).palette[a].main}).map(a=>({props:{color:a},style:{[`&:hover, &.${ae.focusVisible}`]:c({},e.vars?{boxShadow:`0px 0px 0px 8px rgba(${e.vars.palette[a].mainChannel} / 0.16)`}:{boxShadow:`0px 0px 0px 8px ${xe(e.palette[a].main,.16)}`},{"@media (hover: none)":{boxShadow:"none"}}),[`&.${ae.active}`]:c({},e.vars?{boxShadow:`0px 0px 0px 14px rgba(${e.vars.palette[a].mainChannel} / 0.16)`}:{boxShadow:`0px 0px 0px 14px ${xe(e.palette[a].main,.16)}`})}}))]}}),oo=Q(Qa,{name:"MuiSlider",slot:"ValueLabel",overridesResolver:(e,t)=>t.valueLabel})(({theme:e})=>c({zIndex:1,whiteSpace:"nowrap"},e.typography.body2,{fontWeight:500,transition:e.transitions.create(["transform"],{duration:e.transitions.duration.shortest}),position:"absolute",backgroundColor:(e.vars||e).palette.grey[600],borderRadius:2,color:(e.vars||e).palette.common.white,display:"flex",alignItems:"center",justifyContent:"center",padding:"0.25rem 0.75rem",variants:[{props:{orientation:"horizontal"},style:{transform:"translateY(-100%) scale(0)",top:"-10px",transformOrigin:"bottom center","&::before":{position:"absolute",content:'""',width:8,height:8,transform:"translate(-50%, 50%) rotate(45deg)",backgroundColor:"inherit",bottom:0,left:"50%"},[`&.${ae.valueLabelOpen}`]:{transform:"translateY(-100%) scale(1)"}}},{props:{orientation:"vertical"},style:{transform:"translateY(-50%) scale(0)",right:"30px",top:"50%",transformOrigin:"right center","&::before":{position:"absolute",content:'""',width:8,height:8,transform:"translate(-50%, -50%) rotate(45deg)",backgroundColor:"inherit",right:-8,top:"50%"},[`&.${ae.valueLabelOpen}`]:{transform:"translateY(-50%) scale(1)"}}},{props:{size:"small"},style:{fontSize:e.typography.pxToRem(12),padding:"0.25rem 0.5rem"}},{props:{orientation:"vertical",size:"small"},style:{right:"20px"}}]})),ro=Q("span",{name:"MuiSlider",slot:"Mark",shouldForwardProp:e=>Tt(e)&&e!=="markActive",overridesResolver:(e,t)=>{const{markActive:a}=e;return[t.mark,a&&t.markActive]}})(({theme:e})=>({position:"absolute",width:2,height:2,borderRadius:1,backgroundColor:"currentColor",variants:[{props:{orientation:"horizontal"},style:{top:"50%",transform:"translate(-1px, -50%)"}},{props:{orientation:"vertical"},style:{left:"50%",transform:"translate(-50%, 1px)"}},{props:{markActive:!0},style:{backgroundColor:(e.vars||e).palette.background.paper,opacity:.8}}]})),so=Q("span",{name:"MuiSlider",slot:"MarkLabel",shouldForwardProp:e=>Tt(e)&&e!=="markLabelActive",overridesResolver:(e,t)=>t.markLabel})(({theme:e})=>c({},e.typography.body2,{color:(e.vars||e).palette.text.secondary,position:"absolute",whiteSpace:"nowrap",variants:[{props:{orientation:"horizontal"},style:{top:30,transform:"translateX(-50%)","@media (pointer: coarse)":{top:40}}},{props:{orientation:"vertical"},style:{left:36,transform:"translateY(50%)","@media (pointer: coarse)":{left:44}}},{props:{markLabelActive:!0},style:{color:(e.vars||e).palette.text.primary}}]})),no=e=>{const{disabled:t,dragging:a,marked:s,orientation:p,track:h,classes:y,color:u,size:d}=e,$={root:["root",t&&"disabled",a&&"dragging",s&&"marked",p==="vertical"&&"vertical",h==="inverted"&&"trackInverted",h===!1&&"trackFalse",u&&`color${U(u)}`,d&&`size${U(d)}`],rail:["rail"],track:["track"],mark:["mark"],markActive:["markActive"],markLabel:["markLabel"],markLabelActive:["markLabelActive"],valueLabel:["valueLabel"],thumb:["thumb",t&&"disabled",d&&`thumbSize${U(d)}`,u&&`thumbColor${U(u)}`],active:["active"],disabled:["disabled"],focusVisible:["focusVisible"]};return Ue($,Ka,y)},lo=({children:e})=>e,io=g.forwardRef(function(t,a){var s,p,h,y,u,d,$,J,_,A,C,k,j,W,M,Y,S,H,P,q,T,E,x,z;const F=We({props:t,name:"MuiSlider"}),ce=Nt(),{"aria-label":B,"aria-valuetext":ue,"aria-labelledby":N,component:ye="span",components:R={},componentsProps:G={},color:we="primary",classes:je,className:Re,disableSwap:de=!1,disabled:pe=!1,getAriaLabel:V,getAriaValueText:ke,marks:Se=!1,max:fe=100,min:be=0,orientation:Ce="horizontal",shiftStep:l=10,size:K="medium",step:ze=1,scale:me=Mt,slotProps:w,slots:L,track:oe="normal",valueLabelDisplay:ge="off",valueLabelFormat:re=Mt}=F,Ge=Te(F,qa),D=c({},F,{isRtl:ce,max:fe,min:be,classes:je,disabled:pe,disableSwap:de,orientation:Ce,marks:Se,color:we,size:K,step:ze,shiftStep:l,scale:me,track:oe,valueLabelDisplay:ge,valueLabelFormat:re}),{axisProps:Pe,getRootProps:Ke,getHiddenInputProps:Xe,getThumbProps:Qe,open:dt,active:qe,axis:Ie,focusedThumbIndex:r,range:n,dragging:i,marks:v,values:f,trackOffset:m,trackLeap:se,getThumbStyle:ne}=$a(c({},D,{rootRef:a}));D.marked=v.length>0&&v.some(I=>I.label),D.dragging=i,D.focusedThumbIndex=r;const b=no(D),Z=(s=(p=L==null?void 0:L.root)!=null?p:R.Root)!=null?s:Za,Le=(h=(y=L==null?void 0:L.rail)!=null?y:R.Rail)!=null?h:eo,pt=(u=(d=L==null?void 0:L.track)!=null?d:R.Track)!=null?u:to,mt=($=(J=L==null?void 0:L.thumb)!=null?J:R.Thumb)!=null?$:ao,vt=(_=(A=L==null?void 0:L.valueLabel)!=null?A:R.ValueLabel)!=null?_:oo,Ze=(C=(k=L==null?void 0:L.mark)!=null?k:R.Mark)!=null?C:ro,et=(j=(W=L==null?void 0:L.markLabel)!=null?W:R.MarkLabel)!=null?j:so,ft=(M=(Y=L==null?void 0:L.input)!=null?Y:R.Input)!=null?M:"input",tt=(S=w==null?void 0:w.root)!=null?S:G.root,Ot=(H=w==null?void 0:w.rail)!=null?H:G.rail,at=(P=w==null?void 0:w.track)!=null?P:G.track,ot=(q=w==null?void 0:w.thumb)!=null?q:G.thumb,rt=(T=w==null?void 0:w.valueLabel)!=null?T:G.valueLabel,Et=(E=w==null?void 0:w.mark)!=null?E:G.mark,Ft=(x=w==null?void 0:w.markLabel)!=null?x:G.markLabel,Bt=(z=w==null?void 0:w.input)!=null?z:G.input,Vt=he({elementType:Z,getSlotProps:Ke,externalSlotProps:tt,externalForwardedProps:Ge,additionalProps:c({},Ga(Z)&&{as:ye}),ownerState:c({},D,tt==null?void 0:tt.ownerState),className:[b.root,Re]}),Dt=he({elementType:Le,externalSlotProps:Ot,ownerState:D,className:b.rail}),Ht=he({elementType:pt,externalSlotProps:at,additionalProps:{style:c({},Pe[Ie].offset(m),Pe[Ie].leap(se))},ownerState:c({},D,at==null?void 0:at.ownerState),className:b.track}),st=he({elementType:mt,getSlotProps:Qe,externalSlotProps:ot,ownerState:c({},D,ot==null?void 0:ot.ownerState),className:b.thumb}),Jt=he({elementType:vt,externalSlotProps:rt,ownerState:c({},D,rt==null?void 0:rt.ownerState),className:b.valueLabel}),nt=he({elementType:Ze,externalSlotProps:Et,ownerState:D,className:b.mark}),lt=he({elementType:et,externalSlotProps:Ft,ownerState:D,className:b.markLabel}),Wt=he({elementType:ft,getSlotProps:Xe,externalSlotProps:Bt,ownerState:D});return o.jsxs(Z,c({},Vt,{children:[o.jsx(Le,c({},Dt)),o.jsx(pt,c({},Ht)),v.filter(I=>I.value>=be&&I.value<=fe).map((I,O)=>{const it=De(I.value,be,fe),Ne=Pe[Ie].offset(it);let ve;return oe===!1?ve=f.indexOf(I.value)!==-1:ve=oe==="normal"&&(n?I.value>=f[0]&&I.value<=f[f.length-1]:I.value<=f[0])||oe==="inverted"&&(n?I.value<=f[0]||I.value>=f[f.length-1]:I.value>=f[0]),o.jsxs(g.Fragment,{children:[o.jsx(Ze,c({"data-index":O},nt,!Be(Ze)&&{markActive:ve},{style:c({},Ne,nt.style),className:ie(nt.className,ve&&b.markActive)})),I.label!=null?o.jsx(et,c({"aria-hidden":!0,"data-index":O},lt,!Be(et)&&{markLabelActive:ve},{style:c({},Ne,lt.style),className:ie(b.markLabel,lt.className,ve&&b.markLabelActive),children:I.label})):null]},O)}),f.map((I,O)=>{const it=De(I,be,fe),Ne=Pe[Ie].offset(it),ve=ge==="off"?lo:vt;return o.jsx(ve,c({},!Be(ve)&&{valueLabelFormat:re,valueLabelDisplay:ge,value:typeof re=="function"?re(me(I),O):re,index:O,open:dt===O||qe===O||ge==="on",disabled:pe},Jt,{children:o.jsx(mt,c({"data-index":O},st,{className:ie(b.thumb,st.className,qe===O&&b.active,r===O&&b.focusVisible),style:c({},Ne,ne(O),st.style),children:o.jsx(ft,c({"data-index":O,"aria-label":V?V(O):B,"aria-valuenow":me(I),"aria-labelledby":N,"aria-valuetext":ke?ke(me(I),O):ue,value:f[O]},Wt))}))}),O)})]}))}),co=Ut({palette:{primary:{main:"#00796b"},secondary:{main:"#b2dfdb"},text:{primary:"#212121",secondary:"#757575"}},typography:{fontFamily:"Roboto, sans-serif",h4:{fontFamily:"Montserrat, sans-serif",fontWeight:"bold",fontSize:"1.5rem"},h6:{fontFamily:"Montserrat, sans-serif",fontWeight:"bold",fontSize:"1.25rem"}}}),Eo=()=>{const e=Yt(),t=Gt(),a=$e(Kt),s=$e(Xt),p=$e(Qt),h=$e(l=>l.jobs.status),y=$e(l=>l.jobs.error),{user:u,role:d}=$e(l=>l.auth),[$,J]=g.useState(""),[_,A]=g.useState(""),[C,k]=g.useState(""),[j,W]=g.useState(""),[M,Y]=g.useState([0,5e5]),[S,H]=g.useState(!1),[P,q]=g.useState(!1),[T,E]=g.useState(!1),[x,z]=g.useState({}),[F,ce]=g.useState(1),B=3;g.useEffect(()=>{if(P&&d!=="employer"){if(!u){t("/login");return}e(ht())}else if(T&&d!=="employer"){if(!u){t("/login");return}e(qt())}else e(xt($))},[P,T,$,e,d,u,t]);const ue=l=>{J(l.target.value)},N=l=>{A(l.target.value)},ye=l=>{k(l.target.value)},R=l=>{W(l.target.value)},G=(l,K)=>{Y(K)},we=l=>{H(l.target.checked)},je=()=>{e(xt($))},Re=l=>{q(l.target.checked),l.target.checked&&E(!1)},de=l=>s.some(K=>K.job===l),pe=async l=>{if(!u){t("/login");return}z(K=>({...K,[l.id]:"loading"})),de(l.id)?await e(ea(l.id)):await e(ta(l.id)),await e(ht()),z(K=>({...K,[l.id]:"idle"}))},V=new Date().toISOString().split("T")[0],ke=P&&d!=="employer"?a.filter(l=>de(l.id)):T&&d!=="employer"?p:a.filter(l=>l.status==="open"&&l.application_deadline>=V&&(l.location.toLowerCase().includes(_.toLowerCase())||_==="")&&(C===""||l.employment_type===C)&&(j===""||l.experience_level===j)&&parseFloat(l.salary_min)>=M[0]&&parseFloat(l.salary_max)<=M[1]&&(!S||l.is_remote)),Se=F*B,fe=Se-B,be=ke.slice(fe,Se),Ce=Math.ceil(ke.length/B);return o.jsxs(na,{theme:co,children:[o.jsx(sa,{}),o.jsx(la,{maxWidth:"lg",sx:{mt:4},children:o.jsxs(X,{sx:{display:"flex",flexDirection:{xs:"column",sm:"row"},mb:4},children:[o.jsx(X,{sx:{width:{xs:"100%",sm:"25%"},mb:{xs:2,sm:0},pr:{sm:2}},children:o.jsxs(da,{elevation:3,sx:{p:3},children:[o.jsx(le,{variant:"h6",gutterBottom:!0,children:"Filters"}),o.jsxs(X,{sx:{mb:2},children:[o.jsx(le,{variant:"subtitle1",children:"Employment Type"}),o.jsxs(_e,{select:!0,fullWidth:!0,value:C,onChange:ye,variant:"outlined",sx:{mb:1},children:[o.jsx(ee,{value:"",children:"All"}),o.jsx(ee,{value:"Full-time",children:"Full-Time"}),o.jsx(ee,{value:"Part-time",children:"Part-Time"}),o.jsx(ee,{value:"Contract",children:"Contract"}),o.jsx(ee,{value:"Temporary",children:"Temporary"}),o.jsx(ee,{value:"Internship",children:"Internship"}),o.jsx(ee,{value:"Freelance",children:"Freelance"})]})]}),o.jsxs(X,{sx:{mb:2},children:[o.jsx(le,{variant:"subtitle1",children:"Experience Level"}),o.jsxs(_e,{select:!0,fullWidth:!0,value:j,onChange:R,variant:"outlined",sx:{mb:1},children:[o.jsx(ee,{value:"",children:"All"}),o.jsx(ee,{value:"Entry level",children:"Entry Level"}),o.jsx(ee,{value:"Mid level",children:"Mid Level"}),o.jsx(ee,{value:"Senior level",children:"Senior Level"}),o.jsx(ee,{value:"Executive",children:"Executive"})]})]}),o.jsxs(X,{sx:{mb:2},children:[o.jsx(le,{variant:"subtitle1",children:"Salary Range"}),o.jsx(io,{value:M,onChange:G,valueLabelDisplay:"auto",min:0,max:5e5,step:1e4,marks:[{value:0,label:"0"},{value:5e4,label:"50k"},{value:1e5,label:"100k"},{value:2e5,label:"200k"},{value:3e5,label:"300k"},{value:4e5,label:"400k"},{value:5e5,label:"500k"}]})]}),o.jsx(X,{sx:{mb:2},children:o.jsx(kt,{control:o.jsx(St,{checked:S,onChange:we,color:"primary"}),label:"Remote Jobs"})}),d!=="employer"&&o.jsxs(X,{sx:{mb:4,display:"flex",flexDirection:"column"},children:[o.jsx(kt,{control:o.jsx(St,{checked:P,onChange:Re,color:"primary"}),label:"Saved Job"})," "]})]})}),o.jsxs(X,{sx:{flexGrow:1},children:[o.jsxs(X,{sx:{display:"flex",alignItems:"center",mb:4,px:3,py:2,backgroundColor:"#e0f7fa",borderRadius:2,boxShadow:1,flexDirection:{xs:"column",sm:"row"}},children:[o.jsx(_e,{fullWidth:!0,variant:"outlined",placeholder:"Search for jobs...",value:$,onChange:ue,sx:{mr:{sm:2},mb:{xs:2,sm:0}},size:"small"}),o.jsx(_e,{variant:"outlined",placeholder:"Location...",value:_,onChange:N,sx:{mr:{sm:2},mb:{xs:2,sm:0}},size:"small"}),o.jsx(pa,{variant:"contained",startIcon:o.jsx(aa,{}),onClick:je,sx:{borderRadius:"20px",px:3,"&:hover":{backgroundColor:"#004d40"},transition:"background-color 0.3s"},children:"Search"})]}),o.jsx(le,{variant:"h4",gutterBottom:!0,align:"center",sx:{mb:4},children:P?"Saved Jobs":T?"Matching Jobs":"Jobs"}),h==="loading"?o.jsx(X,{sx:{textAlign:"center",mt:4},children:o.jsx(va,{})}):h==="failed"?o.jsx(X,{sx:{textAlign:"center",mt:4},children:o.jsxs(le,{color:"error",children:["Error: ",y]})}):o.jsx(Ct,{container:!0,spacing:4,children:be.map(l=>o.jsx(Ct,{item:!0,xs:12,sm:6,md:4,children:o.jsxs(fa,{elevation:4,sx:{borderRadius:2,backgroundColor:de(l.id)?"#b2ebf2":"white",transition:"background-color 0.3s, transform 0.3s","&:hover":{transform:"scale(1.05)",boxShadow:12}},children:[o.jsx(Zt,{to:`/job/${l.id}`,style:{textDecoration:"none"},children:o.jsxs(ba,{children:[o.jsx(le,{variant:"h6",gutterBottom:!0,children:l.title}),o.jsxs(le,{color:"text.secondary",variant:"body2",gutterBottom:!0,children:[l.company.name," - ",l.location]}),o.jsx(ga,{sx:{my:1}}),o.jsxs(le,{variant:"body2",children:[l.description.substring(0,30),"..."]})]})}),o.jsx(Ma,{children:d!=="employer"&&o.jsx(ha,{onClick:()=>pe(l),sx:{ml:"auto"},disabled:x[l.id]==="loading",children:de(l.id)?o.jsx(oa,{color:"primary"}):o.jsx(ra,{})})})]})},l.id))}),Ce>1&&o.jsx(X,{sx:{mt:4,display:"flex",justifyContent:"center"},children:o.jsx(Ya,{count:Ce,page:F,onChange:(l,K)=>ce(K),color:"primary"})})]})]})}),o.jsx(X,{component:"footer",sx:{bgcolor:"background.paper",p:4,mt:6,textAlign:"center",borderTop:"1px solid #e0e0e0"},children:o.jsx(le,{variant:"body2",color:"text.secondary",children:"© 2024 Job Portal. All rights reserved."})})]})};export{Eo as default};
