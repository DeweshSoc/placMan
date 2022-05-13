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






