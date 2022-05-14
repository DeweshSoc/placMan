const uid = document.getElementById("teacher-uid").value;
const content = document.getElementById("content");

// company btn
const cmpSidebarBtn = document.getElementById("companyLink");
cmpSidebarBtn.addEventListener("click",e=>{
    content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;"
    
});

// records btn

const recordBtns = document.getElementsByClassName("records");
const recordTemplate = document.getElementById("record-template");
for(let i=0;i<recordBtns.length;i++){
    recordBtns[i].addEventListener("click",e=>{
        const year = e.target.innerHTML;
        content.innerHTML =
        "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
        
        fetch("/teacher/records/"+year)
        .then(res=>res.json())
        .then(record=>{
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
    
    fetch("/teacher/edit/"+uid)
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        const formClone = editFormTemplate.content.cloneNode(true);
        content.innerHTML='';
        content.appendChild(formClone);
        document.getElementById("teacherName").value = data.name;
        document.getElementById("teacherEmail").value = data.email;
        document.getElementById("teacherPhone").value = data.phone;
        document.getElementById("teacherDept").value = data.branch;
    })
    .then(()=>{
        const editFrm = document.getElementById("edit-form");
        editFrm.addEventListener("submit", (e) => {
            e.preventDefault();
            const fd = new FormData(editFrm);
            console.log(fd);
            fetch("/teacher/edit/" + uid, {
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

// student btn
const studentBtn = document.getElementById("studentBtn");
studentBtn.addEventListener("click",e=>{
    content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    const link1 = document.createElement("button");
    link1.innerHTML = "All students";
    link1.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
    const link2 = document.createElement("button");
    link2.innerHTML = "Find student";
    link2.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
    const link3 = document.createElement("button");
    link3.innerHTML = "Filter students";
    link3.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
    content.innerHTML = "";
    content.appendChild(link1);
    content.appendChild(link2);
    content.appendChild(link3);
    handleFetchStudentAll(link1);
    handlefindStudentPage(link2);
    handleFilterPage(link3);
    // handleSkillDelListner(link3);
})

function handleFilterPage(link3){
    link3.addEventListener("click",e=>{
        content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
        const filterTemplate = document.getElementById("filter-form-template");
        const filterClone = filterTemplate.content.cloneNode(true);
        content.innerHTML = "";
        content.appendChild(filterClone);
        const filterFrm = document.getElementById("filter-form");
        filterFrm.addEventListener("submit",e=>{
            e.preventDefault();
            const fd = new FormData(filterFrm);
            console.log(fd);
            fetch("/teacher/filter",{
                method:"POST",
                body:fd
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.message){
                    alert(data.message);
                    window.location.href = data.redirectRoute;
                    return;
                }
                console.log(data);
                const students = data;
            console.log(students);
             const studentAllTemplate = document.getElementById("students-all-template");
            const studentAllClone = studentAllTemplate.content.cloneNode(true);
            content.innerHTML = "";
            content.append(studentAllClone);
            for (let i = 0; i < students.length; i++) {
              const tableRow = document.createElement("tr");
              const rowCell1 = document.createElement("td");
              const rowCell2 = document.createElement("td");
              const rowCell3 = document.createElement("td");
              const rowCell4 = document.createElement("td");
              const rowCell5 = document.createElement("td");
              const status = students[i].placed ? "Placed" : "Unplaced";
              rowCell1.innerHTML = students[i].roll;
              rowCell2.innerHTML = students[i].name;
              rowCell3.innerHTML =
                '<span class="badge rounded-pill d-inline">' +
                status +
                "</span>";
              if (status == "Placed") {
                rowCell3.children[0].classList.add("badge-success");
              } else {
                rowCell3.children[0].classList.add("badge-warning");
              }
              rowCell4.innerHTML = students[i].branch;
              rowCell5.innerHTML =
                '<a href="#!" role="button" class="btn btn-sm btn-dark viewBtn">View</a>';
              tableRow.appendChild(rowCell1);
              tableRow.appendChild(rowCell2);
              tableRow.appendChild(rowCell3);
              tableRow.appendChild(rowCell4);
              tableRow.appendChild(rowCell5);
              const studentRows = document.getElementById("studentRows");
              studentRows.appendChild(tableRow);
              handleViewListener(rowCell5, students[i]);
            }
            })
            .catch(err=>console.log(err));
        })
    })
}

function handlefindStudentPage(link2){
    link2.addEventListener("click",e=>{
        content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
        const frm = document.createElement("form");
        const inp = document.createElement("input");
        inp.type = "text";
        inp.placeholder="Enter roll to search"
        inp.classList.add("form-control","mb-2");
        const inp2 = document.createElement("input");
        inp2.type="submit";
        inp2.value = "Submit";
        inp2.classList.add("btn","btn-secondary");
        frm.appendChild(inp);
        frm.appendChild(inp2);
        content.innerHTML = "";
        content.appendChild(frm);
        handleFindFormListener(frm);
    })
}

function handleFindFormListener(frm){
    frm.addEventListener("submit",e=>{
        e.preventDefault();
        content.innerHTML ="<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
        const roll = frm.children[0].value;
        fetch("/teacher/student/"+roll)
        .then(res=>res.json())
        .then(data=>{
            if(data.message) {
              alert(data.message);
              window.location.href = data.redirectRoute;
              return;
            }
            const student = data;
            const dt = new Date(student.dob);
            student.dob = dt.toDateString();
            student.placed = student.placed ? "Placed" : "Unplaced";
            student.parent1 = student.homeInfo.parentName1;
            student.parent2 = student.homeInfo.parentName2;
            student.occupation1 = student.homeInfo.occupation1;
            student.occupation2 = student.homeInfo.occupation2;
            student.sem1 = student.semCgpa[0];
            student.sem2 = student.semCgpa[1];
            student.sem3 = student.semCgpa[2];
            student.sem4 = student.semCgpa[3];
            student.sem5 = student.semCgpa[4];
            student.sem6 = student.semCgpa[5];
            student.sem7 = student.semCgpa[6];
            student.sem8 = student.semCgpa[7];
            const studentTemplate = document.getElementById("student-template");
            const studentClone = studentTemplate.content.cloneNode(true);
            content.innerHTML = "";
            content.append(studentClone);
            document.getElementById("studentName").innerHTML = student.name;
            const dataBlock = document.getElementById("studentDataRows");

            for (key in student) {
              if (typeof student[key] != "object") {
                let toPut = key;
                if (key == "passoutYr") toPut = "Passout year";
                if (key == "passoutYr") toPut = "Passout year";
                if (key == "metricMarks") toPut = "Metric Percentage";
                if (key == "hscMarks") toPut = "HSC Percentage";
                if (key == "parent1") toPut = "First Parent";
                if (key == "parent2") toPut = "Second Parent";
                if (key == "occupation1") toPut = "First Parent Occupation";
                if (key == "occupation2") toPut = "Second Parent Occupation";
                const tableRow1 = document.createElement("tr");
                const rowCell1 = document.createElement("td");
                const rowCell2 = document.createElement("td");
                rowCell1.innerHTML = toPut.toString().toUpperCase();
                rowCell2.innerHTML = student[key];
                tableRow1.appendChild(rowCell1);
                tableRow1.appendChild(rowCell2);
                dataBlock.appendChild(tableRow1);
              }
            }

        })
        .catch(err=>console.log(err));
    });
}

function handleFetchStudentAll(link1) {
    link1.addEventListener("click",e=>{
        content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";

        const studentAllTemplate = document.getElementById(
          "students-all-template"
        );
        fetch("/teacher/student/0")
          .then((res) => res.json())
          .then((data) => {
            if(data.message){
                alert(data.message);
                window.location.href=data.redirectRoute;
                return;
            }
            const students = data;
            console.log(students);
            const studentAllClone = studentAllTemplate.content.cloneNode(true);
            content.innerHTML = "";
            content.append(studentAllClone);
            for (let i = 0; i < students.length; i++) {
              const tableRow = document.createElement("tr");
              const rowCell1 = document.createElement("td");
              const rowCell2 = document.createElement("td");
              const rowCell3 = document.createElement("td");
              const rowCell4 = document.createElement("td");
              const rowCell5 = document.createElement("td");
              const status = students[i].placed ? "Placed" : "Unplaced";
              rowCell1.innerHTML = students[i].roll;
              rowCell2.innerHTML = students[i].name;
              rowCell3.innerHTML =
                '<span class="badge rounded-pill d-inline">' +
                status +
                "</span>";
              if (status == "Placed") {
                rowCell3.children[0].classList.add("badge-success");
              } else {
                rowCell3.children[0].classList.add("badge-warning");
              }
              rowCell4.innerHTML = students[i].branch;
              rowCell5.innerHTML =
                '<a href="#!" role="button" class="btn btn-sm btn-dark viewBtn">View</a>';
              tableRow.appendChild(rowCell1);
              tableRow.appendChild(rowCell2);
              tableRow.appendChild(rowCell3);
              tableRow.appendChild(rowCell4);
              tableRow.appendChild(rowCell5);
              const studentRows = document.getElementById("studentRows");
              studentRows.appendChild(tableRow);
              handleViewListener(rowCell5, students[i]);
            }
          })
          .catch((err) => console.log(err));
    })
}


function handleViewListener(rowCell,student){

    console.log(student);
    const dt = new Date(student.dob);
    student.dob = dt.toDateString();
    student.placed = (student.placed)?"Placed":"Unplaced";
    student.parent1 = student.homeInfo.parentName1;
    student.parent2 = student.homeInfo.parentName2;
    student.occupation1 = student.homeInfo.occupation1;
    student.occupation2 = student.homeInfo.occupation2;
    student.sem1 = student.semCgpa[0];
    student.sem2 = student.semCgpa[1];
    student.sem3 = student.semCgpa[2];
    student.sem4 = student.semCgpa[3];
    student.sem5 = student.semCgpa[4];
    student.sem6 = student.semCgpa[5];
    student.sem7 = student.semCgpa[6];
    student.sem8 = student.semCgpa[7];
    const viewLink = rowCell.children[0];
    viewLink.addEventListener("click",e=>{
        content.innerHTML = "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
        const studentTemplate = document.getElementById("student-template");
        const studentClone = studentTemplate.content.cloneNode(true);
        content.innerHTML = "";
        content.append(studentClone);
        document.getElementById("studentName").innerHTML = student.name;
        const dataBlock = document.getElementById("studentDataRows");

        for(key in student){
            if(typeof(student[key])!="object"){
                let toPut = key;
                if(key=="passoutYr") toPut = "Passout year";
                if(key=="passoutYr") toPut = "Passout year";
                if(key=="metricMarks") toPut = "Metric Percentage";
                if(key=="hscMarks") toPut = "HSC Percentage";
                if(key=="parent1") toPut = "First Parent";
                if(key=="parent2") toPut = "Second Parent";
                if(key=="occupation1") toPut = "First Parent Occupation";
                if(key=="occupation2") toPut = "Second Parent Occupation";
                const tableRow1 = document.createElement("tr");
                const rowCell1 = document.createElement("td");
                const rowCell2 = document.createElement("td");
                rowCell1.innerHTML = toPut.toString().toUpperCase();
                rowCell2.innerHTML = student[key];
                tableRow1.appendChild(rowCell1);
                tableRow1.appendChild(rowCell2);
                dataBlock.appendChild(tableRow1);
            }
        }

    })
}


