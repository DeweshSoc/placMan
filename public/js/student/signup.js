let i=1;
const addSkillBtn = document.getElementById("add-skill-btn");
const container = document.getElementById("container");
const count = document.getElementById("count");
function addSkill(){
    i++;
    const nm = "studentSkill"+i;
    const inp = document.createElement("input");
    inp.type = "text";
    inp.name=nm;
    inp.placeholder="Skill"+i;
    console.log(inp);
    container.appendChild(inp);
    count.value = i;
}
addSkillBtn.addEventListener("click",addSkill);
const content = document.getElementById("content");
const frm = document.getElementsByTagName("form")[0];
frm.addEventListener("submit",(e)=>{
    e.preventDefault();
    content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";

    let skills = [];
    for(let i=0;i<container.children.length;i++){
        if (container.children[i].value != "") {
          skills.push(container.children[i].value);
        }
    }
    const studentInfo = new FormData(frm);
    studentInfo.append("json",JSON.stringify(skills));
    fetch("/student/signup", {
      method: "POST",
      body: studentInfo,
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        alert(data.message);
        window.location.href = data.redirectRoute;
    })
    .catch(err=>{
        console.log(err);
    })
});





