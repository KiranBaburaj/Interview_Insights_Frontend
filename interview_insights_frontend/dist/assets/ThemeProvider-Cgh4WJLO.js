import{r as m,j as u,f as i,_ as T}from"./index-DSnL7-iu.js";import{p,q as E,D as P,h as l}from"./Box-C-1FhN2f.js";import{R as _}from"./List-BwbNNtoy.js";const d=m.createContext(null);function a(){return m.useContext(d)}const j=typeof Symbol=="function"&&Symbol.for,y=j?Symbol.for("mui.nested"):"__THEME_NESTED__";function g(e,t){return typeof t=="function"?t(e):i({},e,t)}function M(e){const{children:t,theme:n}=e,o=a(),c=m.useMemo(()=>{const r=o===null?n:g(o,n);return r!=null&&(r[y]=o!==null),r},[n,o]);return u.jsx(d.Provider,{value:c,children:t})}const f={};function h(e,t,n,o=!1){return m.useMemo(()=>{const c=e&&t[e]||t;if(typeof n=="function"){const r=n(c),s=e?i({},t,{[e]:r}):r;return o?()=>s:s}return e?i({},t,{[e]:n}):i({},t,n)},[e,t,n,o])}function S(e){const{children:t,theme:n,themeId:o}=e,c=p(f),r=a()||f,s=h(o,c,n),x=h(o,r,n,!0),v=s.direction==="rtl";return u.jsx(M,{theme:x,children:u.jsx(E.Provider,{value:s,children:u.jsx(_,{value:v,children:u.jsx(P,{value:s==null?void 0:s.components,children:t})})})})}const b=["theme"];function H(e){let{theme:t}=e,n=T(e,b);const o=t[l];return u.jsx(S,i({},n,{themeId:o?l:void 0,theme:o||t}))}export{H as T};
