const content = document.getElementById("content");
const frm = document.getElementsByTagName("form")[0];
const elegDiv = document.getElementById("eligibility");
frm.addEventListener("submit", (e) => {
  e.preventDefault();
  content.innerHTML =
    "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
  
    const elegFields = [];
    const elegThresholds = [];
    console.log(elegDiv);
    for (let i = 0; i < elegDiv.children.length; i=i+2) {
      if (elegDiv.children[i].value != "") {
        elegFields.push(elegDiv.children[i].value);
        elegThresholds.push(elegDiv.children[i+1].value);
      }
    }
    const companyInfo = new FormData(frm);
    companyInfo.append("elegFields",JSON.stringify(elegFields));
    companyInfo.append("elegThresholds",JSON.stringify(elegThresholds));
  fetch("/company/signup", {
    method: "POST",
    body: companyInfo,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert(data.message);
      window.location.href = data.redirectRoute;
    })
    .catch((err) => {
      console.log(err);
    });
});
let c = 2;
const elegBtn = document.getElementById("add-field");
elegBtn.addEventListener("click",e=>{
  const inp1 = document.createElement("input");
  inp1.type = "text";
  inp1.placeholder = "Enter field";
  inp1.classList.add("form-control");
  inp1.name = "elegField"+c;
  const inp2 = document.createElement("input");
  inp2.type = "text";
  inp2.placeholder = "Enter elegibility threshold";
  inp2.classList.add("form-control");
  inp2.name = "elegThreshold"+c;
  elegDiv.appendChild(inp1);
  elegDiv.appendChild(inp2);
  c++;
})