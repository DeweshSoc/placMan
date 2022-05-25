const roll = document.getElementById("student-roll").value;
const content = document.getElementById("content");

// company btn
const cmpSidebarBtn = document.getElementById("companyLink");
cmpSidebarBtn.addEventListener("click",e=>{
    content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;"
    fetch("/student/company")
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        if (data.message) {
          console.log(data.message);
          alert(data.message);
          window.location.href = data.redirectRoute;
          return;
        }
        const companies = data;
        const reportTemplate = document.getElementById("report-template");
        const reportClone = reportTemplate.content.cloneNode(true);
        content.innerHTML = "";
        content.appendChild(reportClone);
        for (let i = 0; i < companies.length; i++) {
          const tableRow = document.createElement("tr");
          const rowCell1 = document.createElement("td");
          const rowCell2 = document.createElement("td");
          const rowCell3 = document.createElement("td");
          const rowCell4 = document.createElement("td");
          const rowCell5 = document.createElement("td");
          rowCell1.innerHTML = companies[i].name;
          rowCell2.innerHTML = companies[i].category;
          rowCell3.innerHTML = companies[i].description;
          let status = "Not Applied"; 
          for(let j=0;j<companies[i].students.length;j++){
              if(companies[i].students[j] == roll){
                  status = "Applied";
              }
          }
          rowCell4.innerHTML =
            '<span class="badge rounded-pill d-inline">' + status + "</span>";
          if (status == "Applied") {
            rowCell4.children[0].classList.add("badge-success");
          } else {
            rowCell4.children[0].classList.add("badge-warning");
          }
          rowCell5.innerHTML =
            '<a href="#!" role="button" class="btn btn-sm btn-dark viewBtn">View</a>';
          tableRow.appendChild(rowCell1);
          tableRow.appendChild(rowCell2);
          tableRow.appendChild(rowCell3);
          tableRow.appendChild(rowCell4);
          tableRow.appendChild(rowCell5);
          const rows = document.getElementById("reportCompanyRows");
          rows.appendChild(tableRow);
          handleViewListener(rowCell5, companies[i]);
        }
    })
});

function handleViewListener(rowCell, company) {
  const viewLink = rowCell.children[0];
  viewLink.addEventListener("click", (e) => {
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    handleRenderOneCompany(company);
  });
}

function handleRenderOneCompany(company) {
  
  const companyTemplate = document.getElementById("company-template");
  const companyClone = companyTemplate.content.cloneNode(true);
  content.innerHTML = "";
  content.append(companyClone);
  document.getElementById("companyName").innerHTML = company.name;
  const dataBlock = document.getElementById("companyDataRows");
  for(let i=0;i<company.eligibility.length;i++){
      company["required "+company.eligibility[i].field] = company.eligibility[i].threshold;
  }
  company["Estimate Offer"]=company.estimateOffer;
  for (key in company) {
    if (typeof company[key] != "object") {
      const tableRow1 = document.createElement("tr");
      const rowCell1 = document.createElement("td");
      const rowCell2 = document.createElement("td");
      rowCell1.innerHTML = key.toString().toUpperCase();
      rowCell2.innerHTML = company[key];
      tableRow1.appendChild(rowCell1);
      tableRow1.appendChild(rowCell2);
      dataBlock.appendChild(tableRow1);
    }
  }
}

// records btn

const recordBtns = document.getElementsByClassName("records");
const recordTemplate = document.getElementById("record-template");
for(let i=0;i<recordBtns.length;i++){
    recordBtns[i].addEventListener("click",e=>{
        const year = e.target.innerHTML;
        content.innerHTML =
        "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
        
        fetch("/student/records/"+year)
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.message){
                console.log(data.message);
                alert(data.message);
                window.location.href = data.redirectRoute;
                return;
            }
            const record = data;
            const recordClone = recordTemplate.content.cloneNode(true);
            content.innerHTML = "";
            content.append(recordClone);
            const recYr = document.getElementById("recordYear");
            recYr.innerHTML+=record.year;
            for(let i=0;i<record.data.length;i++){
                const tableRow = document.createElement("tr");
                const rowCell1 = document.createElement("td");
                const rowCell2 = document.createElement("td");
                const rowCell3 = document.createElement("td");
                rowCell1.innerHTML = record.data[i].roll;
                rowCell2.innerHTML = record.data[i].name;
                rowCell3.innerHTML = record.data[i].company;
                tableRow.appendChild(rowCell1);
                tableRow.appendChild(rowCell2);
                tableRow.appendChild(rowCell3);
                const recordRows = document.getElementById("recordRows");
                recordRows.appendChild(tableRow);
            }
        })
        .catch(err=>{
            console.log(err);
        })
    });
}

// edit profile btn


const editProfBtn = document.getElementById("editProfBtn");
const editFormTemplate = document.getElementById("edit-form-template");

editProfBtn.addEventListener("click",e=>{
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
      const roll = document.getElementById("student-roll").value;
    fetch("/student/edit/"+roll)
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        if (data.message) {
          console.log(data.message);
          alert(data.message);
          window.location.href = data.redirectRoute;
          return;
        }
        const formClone = editFormTemplate.content.cloneNode(true);
        content.innerHTML='';
        content.appendChild(formClone);
        const dt = new Date(data.dob);
        dobString = dt.toLocaleDateString().split("/").reverse().join("-");
        console.log(dobString);
        document.getElementById("studentName").value = data.name;
        document.getElementById("studentEmail").value = data.email;
        document.getElementById("studentPhone").value = data.phone;
        document.getElementById("studentDob").value = dobString;
        document.getElementById("studentAddress").value = data.address;
        document.getElementById("studentBranch").value = data.branch;
        document.getElementById("studentMetric").value = data.metricMarks;
        document.getElementById("studentHsc").value = data.hscMarks;
        document.getElementById("studentCgpa").value = data.cgpa;
        for(let i=0;i<8;i++){
            const ele = "studentCgpaSem"+(i+1).toString();
            document.getElementById(ele).value = data.semCgpa[i];
        }
        document.getElementById("studentPassoutYr").value = data.passoutYr;
        document.getElementById("studentParent1").value = data.homeInfo.parentName1;
        document.getElementById("studentParentOcp1").value = data.homeInfo.occupation1;
        document.getElementById("studentParent2").value = data.homeInfo.parentName2;
        document.getElementById("studentParentOcp2").value = data.homeInfo.occupation2;
    })
    .then(()=>{
        const editFrm = document.getElementById("edit-form");
        editFrm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fd = new FormData(editFrm);
            console.log(fd);
            fetch("/student/edit/" + roll, {
                method: "POST",
                body: fd,
            })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                window.location.href=data.redirectRoute;
            })
            .catch((err) => {
                console.log(err);
            });
        });
    })
    .catch(err=>{
        console.log(err);
    })
});

// edit skills btn

const editSkillsBtn = document.getElementById("editSkillsBtn");
const skillDelTemplate = document.getElementById("skill-del-template"); 

editSkillsBtn.addEventListener("click",e=>{
    content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    const link1 = document.createElement("button");
    link1.innerHTML = "Add new skill";
    link1.classList.add("btn");
    link1.classList.add("btn-lg");
    link1.classList.add("btn-secondary");
    link1.classList.add("m-4");
    const link2 = document.createElement("button");
    link2.innerHTML = "Delete existing skill";
    link2.classList.add("btn");
    link2.classList.add("btn-lg");
    link2.classList.add("btn-danger");
    link2.classList.add("m-4");
    content.innerHTML = '';
    content.appendChild(link1);
    content.appendChild(link2);
    handleSkillAddListener(link1);
    handleSkillDelListner(link2);
})




function handleSkillAddListener(link1){
    link1.addEventListener("click", (e) => {
      const toShow =
        '<form id="addSkillForm"><div class="container" id="container"><input type="text" name="studentSkill1" placeholder="Skill 1" required></div><a class="btn btn-sm btn-primary" href="#" id="add-skill-btn">Add more skill</a><input type="submit" value="Submit"></input></form>';

      content.innerHTML = toShow;

      const addSkillBtn = document.getElementById("add-skill-btn");
      const addSkillForm = document.getElementById("addSkillForm");
      const container = document.getElementById("container");
      let i = 1;
      addSkillBtn.addEventListener("click",e=>{
          i++;
          const nm = "studentSkill" + i;
          const inp = document.createElement("input");
          inp.type = "text";
          inp.name = nm;
          inp.placeholder = "Skill" + i;
          console.log(inp);
          container.appendChild(inp);
      });
      handleSkillAdd(addSkillForm,container);
    });
}

function handleSkillAdd(addSkillForm,container){
    addSkillForm.addEventListener("submit", (e) => {
      e.preventDefault();
      content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
      let skills = [];
      for (let i = 0; i < container.children.length; i++) {
          if(container.children[i].value!=""){
              skills.push(container.children[i].value);
          }
      }
      const studentInfo = new FormData(addSkillForm);
      studentInfo.append("json", JSON.stringify(skills));
      fetch("/student/skills/add/"+roll, {
        method: "POST",
        body: studentInfo,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert(data.message);
          window.location.href=data.redirectRoute;
        })
        .catch((err) => {
          console.log(err);
        });
    });
}


function handleSkillDelListner(link2){
    link2.addEventListener("click", (e) => {
      const fetchLink = `/student/skills/del/${roll}`;
      fetch(fetchLink)
        .then((res) => res.json())
        .then(skills => {
            console.log(skills);
            const skillDel = skillDelTemplate.content.cloneNode(true);
            content.innerHTML='';
            content.append(skillDel);
            const skillDelForm = document.getElementById("skill-del-form");

            for(let i=0;i<skills.length;i++){
                const checkInput = document.createElement("input");
                const checkLabel = document.createElement("label");
                const skillInput = document.createElement("div");
                
                checkLabel.innerHTML = skills[i];
                checkInput.type = "checkbox";
                checkInput.name = i;
                checkInput.classList.add("m-2");
                skillInput.appendChild(checkLabel);
                skillInput.appendChild(checkInput);
                
                skillDelForm.children[0].appendChild(skillInput);
            }
            handleSkillDel(skillDelForm);
        })
        .catch((err) => {
          console.log(err);
        });
    });
}

function handleSkillDel(skillDelForm){
    skillDelForm.addEventListener("submit",e=>{
        e.preventDefault();
        content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
        const skillIndices = [];
        for(let i=0;i<skillDelForm.children[0].children.length;i++){
            const checkbox = skillDelForm.children[0].children[i].children[1];
            if(checkbox.checked){
                skillIndices.push(parseInt(checkbox.name));
            }
        }
        const fd = new FormData();
        fd.append("skillIndices", JSON.stringify(skillIndices));
        fetch("/student/skills/del/"+roll,{
            method:"POST",
            body:fd
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
    })
}