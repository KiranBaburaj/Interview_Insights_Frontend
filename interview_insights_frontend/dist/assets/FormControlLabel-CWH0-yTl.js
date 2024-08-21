import{f as l,r as I,_ as E,j as n,A as x,E as ee}from"./index-DSnL7-iu.js";import{g as U,a as H,s as j,n as W,c as N,b as O,d as T,u as G,T as V}from"./Box-C-1FhN2f.js";import{u as J,f as oe}from"./TextField-B9bqOITb.js";import{B as te,h as se}from"./List-BwbNNtoy.js";import{S as ae}from"./Stack-C_YQ1E1r.js";function re(e){return U("PrivateSwitchBase",e)}H("PrivateSwitchBase",["root","checked","disabled","input","edgeStart","edgeEnd"]);const ne=["autoFocus","checked","checkedIcon","className","defaultChecked","disabled","disableFocusRipple","edge","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"],le=e=>{const{classes:o,checked:t,disabled:r,edge:a}=e,s={root:["root",t&&"checked",r&&"disabled",a&&`edge${x(a)}`],input:["input"]};return O(s,re,o)},ce=j(te)(({ownerState:e})=>l({padding:9,borderRadius:"50%"},e.edge==="start"&&{marginLeft:e.size==="small"?-3:-12},e.edge==="end"&&{marginRight:e.size==="small"?-3:-12})),ie=j("input",{shouldForwardProp:W})({cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}),de=I.forwardRef(function(o,t){const{autoFocus:r,checked:a,checkedIcon:s,className:i,defaultChecked:v,disabled:m,disableFocusRipple:c=!1,edge:P=!1,icon:R,id:k,inputProps:y,inputRef:$,name:B,onBlur:d,onChange:h,onFocus:p,readOnly:M,required:w=!1,tabIndex:z,type:b,value:F}=o,f=E(o,ne),[g,K]=se({controlled:a,default:!!v,name:"SwitchBase",state:"checked"}),C=J(),Q=u=>{p&&p(u),C&&C.onFocus&&C.onFocus(u)},X=u=>{d&&d(u),C&&C.onBlur&&C.onBlur(u)},Y=u=>{if(u.nativeEvent.defaultPrevented)return;const D=u.target.checked;K(D),h&&h(u,D)};let L=m;C&&typeof L>"u"&&(L=C.disabled);const Z=b==="checkbox"||b==="radio",_=l({},o,{checked:g,disabled:L,disableFocusRipple:c,edge:P}),A=le(_);return n.jsxs(ce,l({component:"span",className:N(A.root,i),centerRipple:!0,focusRipple:!c,disabled:L,tabIndex:null,role:void 0,onFocus:Q,onBlur:X,ownerState:_,ref:t},f,{children:[n.jsx(ie,l({autoFocus:r,checked:a,defaultChecked:v,className:A.input,disabled:L,id:Z?k:void 0,name:B,onChange:Y,readOnly:M,ref:$,required:w,ownerState:_,tabIndex:z,type:b},b==="checkbox"&&F===void 0?{}:{value:F},y)),g?s:R]}))}),pe=T(n.jsx("path",{d:"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"}),"CheckBoxOutlineBlank"),ue=T(n.jsx("path",{d:"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"}),"CheckBox"),me=T(n.jsx("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"}),"IndeterminateCheckBox");function he(e){return U("MuiCheckbox",e)}const q=H("MuiCheckbox",["root","checked","disabled","indeterminate","colorPrimary","colorSecondary","sizeSmall","sizeMedium"]),be=["checkedIcon","color","icon","indeterminate","indeterminateIcon","inputProps","size","className"],fe=e=>{const{classes:o,indeterminate:t,color:r,size:a}=e,s={root:["root",t&&"indeterminate",`color${x(r)}`,`size${x(a)}`]},i=O(s,he,o);return l({},o,i)},Ce=j(de,{shouldForwardProp:e=>W(e)||e==="classes",name:"MuiCheckbox",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:t}=e;return[o.root,t.indeterminate&&o.indeterminate,o[`size${x(t.size)}`],t.color!=="default"&&o[`color${x(t.color)}`]]}})(({theme:e,ownerState:o})=>l({color:(e.vars||e).palette.text.secondary},!o.disableRipple&&{"&:hover":{backgroundColor:e.vars?`rgba(${o.color==="default"?e.vars.palette.action.activeChannel:e.vars.palette[o.color].mainChannel} / ${e.vars.palette.action.hoverOpacity})`:ee(o.color==="default"?e.palette.action.active:e.palette[o.color].main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},o.color!=="default"&&{[`&.${q.checked}, &.${q.indeterminate}`]:{color:(e.vars||e).palette[o.color].main},[`&.${q.disabled}`]:{color:(e.vars||e).palette.action.disabled}})),ke=n.jsx(ue,{}),ge=n.jsx(pe,{}),xe=n.jsx(me,{}),Se=I.forwardRef(function(o,t){var r,a;const s=G({props:o,name:"MuiCheckbox"}),{checkedIcon:i=ke,color:v="primary",icon:m=ge,indeterminate:c=!1,indeterminateIcon:P=xe,inputProps:R,size:k="medium",className:y}=s,$=E(s,be),B=c?P:m,d=c?P:i,h=l({},s,{color:v,indeterminate:c,size:k}),p=fe(h);return n.jsx(Ce,l({type:"checkbox",inputProps:l({"data-indeterminate":c},R),icon:I.cloneElement(B,{fontSize:(r=B.props.fontSize)!=null?r:k}),checkedIcon:I.cloneElement(d,{fontSize:(a=d.props.fontSize)!=null?a:k}),ownerState:h,ref:t,className:N(p.root,y)},$,{classes:p}))});function ve(e){return U("MuiFormControlLabel",e)}const S=H("MuiFormControlLabel",["root","labelPlacementStart","labelPlacementTop","labelPlacementBottom","disabled","label","error","required","asterisk"]),Pe=["checked","className","componentsProps","control","disabled","disableTypography","inputRef","label","labelPlacement","name","onChange","required","slotProps","value"],ye=e=>{const{classes:o,disabled:t,labelPlacement:r,error:a,required:s}=e,i={root:["root",t&&"disabled",`labelPlacement${x(r)}`,a&&"error",s&&"required"],label:["label",t&&"disabled"],asterisk:["asterisk",a&&"error"]};return O(i,ve,o)},Be=j("label",{name:"MuiFormControlLabel",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:t}=e;return[{[`& .${S.label}`]:o.label},o.root,o[`labelPlacement${x(t.labelPlacement)}`]]}})(({theme:e,ownerState:o})=>l({display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,[`&.${S.disabled}`]:{cursor:"default"}},o.labelPlacement==="start"&&{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},o.labelPlacement==="top"&&{flexDirection:"column-reverse",marginLeft:16},o.labelPlacement==="bottom"&&{flexDirection:"column",marginLeft:16},{[`& .${S.label}`]:{[`&.${S.disabled}`]:{color:(e.vars||e).palette.text.disabled}}})),Fe=j("span",{name:"MuiFormControlLabel",slot:"Asterisk",overridesResolver:(e,o)=>o.asterisk})(({theme:e})=>({[`&.${S.error}`]:{color:(e.vars||e).palette.error.main}})),je=I.forwardRef(function(o,t){var r,a;const s=G({props:o,name:"MuiFormControlLabel"}),{className:i,componentsProps:v={},control:m,disabled:c,disableTypography:P,label:R,labelPlacement:k="end",required:y,slotProps:$={}}=s,B=E(s,Pe),d=J(),h=(r=c??m.props.disabled)!=null?r:d==null?void 0:d.disabled,p=y??m.props.required,M={disabled:h,required:p};["checked","name","onChange","value","inputRef"].forEach(g=>{typeof m.props[g]>"u"&&typeof s[g]<"u"&&(M[g]=s[g])});const w=oe({props:s,muiFormControl:d,states:["error"]}),z=l({},s,{disabled:h,labelPlacement:k,required:p,error:w.error}),b=ye(z),F=(a=$.typography)!=null?a:v.typography;let f=R;return f!=null&&f.type!==V&&!P&&(f=n.jsx(V,l({component:"span"},F,{className:N(b.label,F==null?void 0:F.className),children:f}))),n.jsxs(Be,l({className:N(b.root,i),ownerState:z,ref:t},B,{children:[I.cloneElement(m,M),p?n.jsxs(ae,{display:"block",children:[f,n.jsxs(Fe,{ownerState:z,"aria-hidden":!0,className:b.asterisk,children:[" ","*"]})]}):f]}))});export{Se as C,je as F};
