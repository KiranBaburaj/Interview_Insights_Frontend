import{a as T,r as t,j as e,C as g}from"./index-Cg9cMqMk.js";import{C as b}from"./Container-DeWCM5ih.js";import{B as d,T as s}from"./Box-Cv3-leFO.js";import{T as c}from"./TextField-BVlBefcF.js";import{B as m}from"./Button-CukJ335c.js";import{C as w}from"./CircularProgress-DAdikJ6I.js";import{L as O}from"./Link-B48leuGt.js";import{A as B}from"./Alert-Br1s51qm.js";import"./useThemeProps-Dmg0lwlt.js";import"./List-ALHBZHNp.js";import"./useSlot-DpWDRlEk.js";import"./IconButton-5GmWfccc.js";const I=()=>{const f=T(),[i,j]=t.useState(""),[u,y]=t.useState(""),[p,P]=t.useState(""),[l,h]=t.useState(1),[a,o]=t.useState(!1),[x,n]=t.useState(null),v=()=>{f("/login")},C=async()=>{o(!0),n(null);try{await g.post("/api/request-password-reset/",{email:i}),h(2)}catch(r){console.error("Error requesting OTP:",r),n("Failed to request OTP. Please try again.")}finally{o(!1)}},E=async()=>{o(!0),n(null);try{await g.post("/api/password-reset-confirm/",{email:i,otp:u,new_password:p}),h(3)}catch(r){console.error("Error resetting password:",r),n("Failed to reset password. Please try again.")}finally{o(!1)}};return e.jsx(b,{maxWidth:"sm",children:e.jsxs(d,{sx:{mt:4},children:[l===1&&e.jsxs(d,{component:"div",children:[e.jsx(s,{variant:"h4",align:"center",gutterBottom:!0,children:"Forgot Password"}),e.jsx(c,{margin:"normal",fullWidth:!0,id:"email",label:"Email Address",type:"email",value:i,onChange:r=>j(r.target.value),placeholder:"Enter your email"}),e.jsx(m,{variant:"contained",fullWidth:!0,sx:{mt:2},disabled:a,onClick:C,children:a?e.jsx(w,{size:24}):"Request OTP"}),e.jsxs(s,{variant:"body2",align:"center",sx:{mt:2},children:["Remembered your password?   ",e.jsx(m,{onClick:v,color:"primary",children:"Log in here"})]})]}),l===2&&e.jsxs(d,{component:"div",children:[e.jsx(s,{variant:"h4",align:"center",gutterBottom:!0,children:"Enter OTP and New Password"}),e.jsx(c,{margin:"normal",fullWidth:!0,id:"otp",label:"OTP",type:"text",value:u,onChange:r=>y(r.target.value),placeholder:"Enter OTP"}),e.jsx(c,{margin:"normal",fullWidth:!0,id:"newPassword",label:"New Password",type:"password",value:p,onChange:r=>P(r.target.value),placeholder:"Enter new password"}),e.jsx(m,{variant:"contained",fullWidth:!0,sx:{mt:2},disabled:a,onClick:E,children:a?e.jsx(w,{size:24}):"Reset Password"}),e.jsxs(s,{variant:"body2",align:"center",sx:{mt:2},children:["Go back to ",e.jsx(O,{href:"/",children:"Home"})]})]}),l===3&&e.jsx(s,{variant:"h4",align:"center",gutterBottom:!0,children:"Password reset successful!"}),x&&e.jsx(B,{severity:"error",sx:{mt:2},children:x})]})})};export{I as default};
