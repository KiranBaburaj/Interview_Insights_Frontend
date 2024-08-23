import{I as w,u as W,b as c,r as f,at as v,j as t,au as D}from"./index-ByHWvs_7.js";import{c as R,s as C}from"./notificationWebSocket-BTWUOPo5.js";import{T as u,B as p}from"./Box-C-Fy6sNV.js";import{T}from"./ThemeProvider-DsRoQZlX.js";import{P as _}from"./List-BQw4DwJY.js";import{D as M}from"./Divider-BC8QZEnC.js";import{T as N}from"./TextField-DSZbuARI.js";import{B}from"./Button-CY8D8cZw.js";import"./dividerClasses-BeSUqKOT.js";let s=null,g=0;const P=5,S=(r,n,i)=>s?(console.warn("WebSocket already connected."),s):(s=new WebSocket(`ws://localhost:8000/ws/chat/${r}/?token=${i}`),s.onopen=()=>{console.log("WebSocket connection established."),g=0},s.onmessage=a=>{try{const o=JSON.parse(a.data);if(console.log("Received data:",o),o.error)console.error("WebSocket error:",o.error);else if(o.message){const l=o.message.content||Object.values(o.message).join(""),d={...o.message,content:l,timestamp:o.message.timestamp||new Date().toISOString(),sender:o.message.sender||{id:o.user_id,name:o.full_name}};console.log("Processed message:",d),n(d)}}catch(o){console.error("Failed to parse WebSocket message:",o)}},s.onerror=a=>{console.error("WebSocket error:",a)},s.onclose=a=>{console.log("WebSocket connection closed:",a),g<P?setTimeout(()=>{g++,S(r,n,i)},5e3):console.error("Max reconnect attempts reached. Could not reconnect.")},s),E=r=>{s&&s.readyState===WebSocket.OPEN?(s.send(JSON.stringify(r)),console.log("Message sent:",r)):console.warn("WebSocket is not open. Message not sent.")},O=()=>{s&&(s.close(),s=null,console.log("WebSocket connection closed."))},$=w({palette:{primary:{main:"#00796b"},secondary:{main:"#b2dfdb"}},typography:{fontFamily:"Roboto, sans-serif"}}),q=()=>{const r=W(),n=c(e=>e.chat.currentChatRoom),i=c(e=>e.chat.messages),a=c(e=>e.auth.accessToken),o=c(e=>e.auth.user),[l,d]=f.useState(""),x=f.useRef(null),m=c(e=>e.auth.userid),b=c(e=>e.auth.full_name);f.useEffect(()=>{if(n&&a)return r(v(n.id)),S(n.id,e=>{const h=e.id?e:{...e,id:`temp-${Date.now()}`};r(D(h))},a),R(a,m,r),()=>{O()}},[r,n,a]),f.useEffect(()=>{var e;(e=x.current)==null||e.scrollIntoView({behavior:"smooth"})},[i]);const k=e=>{if(e.preventDefault(),l.trim()){const h={type:"chat_message",message:l,user_id:m,full_name:b,timestamp:new Date().toISOString()};E(h);const j={type:"notification",message:`New message from ${b}`,user_id:m,room_id:n.id};C(j),d("")}};if(!n)return t.jsx(u,{children:"Select a chat room"});const y=n.jobseeker.id===o.id?n.employer:n.jobseeker;return t.jsx(T,{theme:$,children:t.jsxs(p,{sx:{display:"flex",flexDirection:"column",height:"80vh",maxWidth:"800px",width:"100%",margin:"0 auto",padding:2,backgroundColor:"#f5f5f5",borderRadius:2,boxShadow:2},children:[t.jsxs(u,{variant:"h5",gutterBottom:!0,children:["Chat with ",y.full_name]}),t.jsxs(p,{sx:{flexGrow:1,overflowY:"auto",mb:2,border:"1px solid #ddd",borderRadius:1,p:2,backgroundColor:"#fafafa",display:"flex",flexDirection:"column"},children:[i.map(e=>t.jsxs(_,{sx:{mb:1,p:1,borderRadius:1,backgroundColor:e.sender.id===m?"#e3f2fd":"#f1f8e9",alignSelf:e.sender.id===m?"flex-end":"flex-start",maxWidth:"75%",wordBreak:"break-word"},children:[t.jsxs(u,{variant:"body2",gutterBottom:!0,children:[t.jsxs("strong",{children:[e.sender.full_name||`${e.sender.name}`,":"]})," ",e.content||"No content"]}),t.jsx(u,{variant:"caption",color:"textSecondary",children:new Date(e.timestamp).toLocaleString()})]},e.id||`temp-${e.timestamp}`)),t.jsx("div",{ref:x})]}),t.jsx(M,{sx:{mb:2}}),t.jsxs(p,{component:"form",onSubmit:k,sx:{display:"flex"},children:[t.jsx(N,{fullWidth:!0,variant:"outlined",size:"small",value:l,onChange:e=>d(e.target.value),placeholder:"Type a message...",sx:{mr:1}}),t.jsx(B,{type:"submit",variant:"contained",color:"primary",size:"small",children:"Send"})]})]})})};export{q as default};
