import{R as h,r as o,j as e}from"./index-Ck0-k46Y.js";const u=({selectedLang:c,newCategory:a,onInputChange:l,onFileChange:i,onSubmit:n,setSelectedFile:m})=>{const[d,r]=o.useState(null),x=o.useCallback(s=>{const t=s.target.files[0];if(t){m(t);const p=URL.createObjectURL(t);r(p)}else r(null),i("")},[i]);return e.jsx("div",{className:"card p-6",children:e.jsx("form",{onSubmit:n,children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-lg-6",children:[["en","sa","bd","in"].map(s=>e.jsxs("div",{className:`form-group ${c===s?"":"d-none"} form-system-language-form`,id:`${s}-form`,children:[e.jsxs("label",{className:"title-color",children:["Category Name",e.jsx("span",{className:"text-danger",children:"*"})," (",s.toUpperCase(),")"]}),e.jsx("input",{type:"text",name:"name",className:"form-control outline-none hover:border-primary",placeholder:"New Category",required:s==="en",value:a.name,onChange:l})]},s)),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"title-color",htmlFor:"priority",children:"Priority"}),e.jsxs("select",{className:"form-control outline-none hover:border-primary",name:"priority",required:!0,value:a.priority,onChange:l,children:[e.jsx("option",{disabled:!0,children:"Set Priority"}),[...Array(11).keys()].map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"title-color",children:"Category Logo"}),e.jsxs("span",{className:"text-info",children:[e.jsx("span",{className:"text-danger",children:"*"})," Ratio 1:1 (500 x 500 px)"]}),e.jsxs("div",{className:"custom-file text-left",children:[e.jsx("input",{type:"file",name:"logo",id:"category-image",className:"custom-file-input",accept:"image/*",required:!0,onChange:x}),e.jsx("label",{className:"custom-file-label",htmlFor:"category-image",children:"Choose File"})]})]})]}),e.jsx("div",{className:"col-lg-6 mt-4 mt-lg-0 from_part_2",children:e.jsx("div",{className:"form-group flex justify-center items-center",children:e.jsx("div",{className:"text-center flex justify-center items-center ",children:e.jsx("img",{className:"upload-img-view",id:"viewer",alt:"",src:d||"https://6valley.6amtech.com/public/assets/back-end/img/image-place-holder.png"})})})}),e.jsxs("div",{className:"d-flex flex-wrap gap-2 justify-content-end w-full p-3",children:[e.jsx("button",{type:"reset",id:"reset",className:"btn bg-secondary text-white border border-secondary rounded-md",onClick:()=>r(null),children:"Reset"}),e.jsx("button",{type:"submit",className:"btn bg-primary hover:bg-primary-dark text-white",style:{color:"white"},children:"Submit"})]})]})})})},f=h.memo(u);export{f as default};