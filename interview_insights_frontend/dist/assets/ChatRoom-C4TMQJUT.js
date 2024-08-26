import{I as j,u as W,b as c,r as f,av as v,j as o,aw as D}from"./index-bGYT25wZ.js";import{c as R,s as C}from"./notificationWebSocket-9HsNs1-H.js";import{T as u,B as p}from"./Box-C7FEM3NL.js";import{T}from"./ThemeProvider-2O8Q8CKJ.js";import{P as _,B as M}from"./List-D74dhkXP.js";import{D as N}from"./Divider-DEgvekp5.js";import{T as B}from"./TextField-BYB5Qg8x.js";import"./dividerClasses-HgKa27Ig.js";let s=null,g=0;const P=5,S=(r,n,i)=>s?(console.warn("WebSocket already connected."),s):(s=new WebSocket(`wss://www.interview-insights.site/ws/chat/${r}/?token=${i}`),s.onopen=()=>{console.log("WebSocket connection established."),g=0},s.onmessage=a=>{try{const t=JSON.parse(a.data);if(console.log("Received data:",t),t.error)console.error("WebSocket error:",t.error);else if(t.message){const l=t.message.content||Object.values(t.message).join(""),d={...t.message,content:l,timestamp:t.message.timestamp||new Date().toISOString(),sender:t.message.sender||{id:t.user_id,name:t.full_name}};console.log("Processed message:",d),n(d)}}catch(t){console.error("Failed to parse WebSocket message:",t)}},s.onerror=a=>{console.error("WebSocket error:",a)},s.onclose=a=>{console.log("WebSocket connection closed:",a),g<P?setTimeout(()=>{g++,S(r,n,i)},5e3):console.error("Max reconnect attempts reached. Could not reconnect.")},s),E=r=>{s&&s.readyState===WebSocket.OPEN?(s.send(JSON.stringify(r)),console.log("Message sent:",r)):console.warn("WebSocket is not open. Message not sent.")},O=()=>{s&&(s.close(),s=null,console.log("WebSocket connection closed."))},$=j({palette:{primary:{main:"#00796b"},secondary:{main:"#b2dfdb"}},typography:{fontFamily:"Roboto, sans-serif"}}),Y=()=>{const r=W(),n=c(e=>e.chat.currentChatRoom),i=c(e=>e.chat.messages),a=c(e=>e.auth.accessToken),t=c(e=>e.auth.user),[l,d]=f.useState(""),x=f.useRef(null),m=c(e=>e.auth.userid),b=c(e=>e.auth.full_name);f.useEffect(()=>{if(n&&a)return r(v(n.id)),S(n.id,e=>{const h=e.id?e:{...e,id:`temp-${Date.now()}`};r(D(h))},a),R(a,m,r),()=>{O()}},[r,n,a]),f.useEffect(()=>{var e;(e=x.current)==null||e.scrollIntoView({behavior:"smooth"})},[i]);const k=e=>{if(e.preventDefault(),l.trim()){const h={type:"chat_message",message:l,user_id:m,full_name:b,timestamp:new Date().toISOString()};E(h);const y={type:"notification",message:`New message from ${b}`,user_id:m,room_id:n.id};C(y),d("")}};if(!n)return o.jsx(u,{children:"Select a chat room"});const w=n.jobseeker.id===t.id?n.employer:n.jobseeker;return o.jsx(T,{theme:$,children:o.jsxs(p,{sx:{display:"flex",flexDirection:"column",height:"80vh",maxWidth:"800px",width:"100%",margin:"0 auto",padding:2,backgroundColor:"#f5f5f5",borderRadius:2,boxShadow:2},children:[o.jsxs(u,{variant:"h5",gutterBottom:!0,children:["Chat with ",w.full_name]}),o.jsxs(p,{sx:{flexGrow:1,overflowY:"auto",mb:2,border:"1px solid #ddd",borderRadius:1,p:2,backgroundColor:"#fafafa",display:"flex",flexDirection:"column"},children:[i.map(e=>o.jsxs(_,{sx:{mb:1,p:1,borderRadius:1,backgroundColor:e.sender.id===m?"#e3f2fd":"#f1f8e9",alignSelf:e.sender.id===m?"flex-end":"flex-start",maxWidth:"75%",wordBreak:"break-word"},children:[o.jsxs(u,{variant:"body2",gutterBottom:!0,children:[o.jsxs("strong",{children:[e.sender.full_name||`${e.sender.name}`,":"]})," ",e.content||"No content"]}),o.jsx(u,{variant:"caption",color:"textSecondary",children:new Date(e.timestamp).toLocaleString()})]},e.id||`temp-${e.timestamp}`)),o.jsx("div",{ref:x})]}),o.jsx(N,{sx:{mb:2}}),o.jsxs(p,{component:"form",onSubmit:k,sx:{display:"flex"},children:[o.jsx(B,{fullWidth:!0,variant:"outlined",size:"small",value:l,onChange:e=>d(e.target.value),placeholder:"Type a message...",sx:{mr:1}}),o.jsx(M,{type:"submit",variant:"contained",color:"primary",size:"small",children:"Send"})]})]})})};export{Y as default};
