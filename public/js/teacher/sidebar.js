const uid = document.getElementById("teacher-uid").value;
const content = document.getElementById("content");

// company btn
const cmpSidebarBtn = document.getElementById("companyLink");
cmpSidebarBtn.addEventListener("click", (e) => {
  content.innerHTML =
    "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
  fetch("/teacher/company")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.message) {
        console.log(data.message);
        alert(data.message);
        window.location.href = data.redirectRoute;
        return;
      }
      const companies = data;
      const companyTemplate = document.getElementById("companyAll-template");
      const companyClone = companyTemplate.content.cloneNode(true);
      content.innerHTML = "";
      content.appendChild(companyClone);
      for (let i = 0; i < companies.length; i++) {
        const tableRow = document.createElement("tr");
        const rowCell1 = document.createElement("td");
        const rowCell2 = document.createElement("td");
        const rowCell3 = document.createElement("td");
        const rowCell4 = document.createElement("td");
        const rowCell5 = document.createElement("td");
        rowCell1.innerHTML = companies[i].name;
        rowCell2.innerHTML = companies[i].students.length;
        rowCell3.innerHTML = companies[i].estimateOffer;
        rowCell4.innerHTML = companies[i].category;
        rowCell5.innerHTML =
          '<a href="#!" role="button" class="btn btn-sm btn-dark viewBtn">View</a>';
        tableRow.appendChild(rowCell1);
        tableRow.appendChild(rowCell2);
        tableRow.appendChild(rowCell3);
        tableRow.appendChild(rowCell4);
        tableRow.appendChild(rowCell5);
        const rows = document.getElementById("companyRows");
        rows.appendChild(tableRow);
        handleViewListenerComp(rowCell5, companies[i]);
      }
    });
});

function handleViewListenerComp(rowCell, company) {
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
  for (let i = 0; i < company.eligibility.length; i++) {
    company["required " + company.eligibility[i].field] =
      company.eligibility[i].threshold;
  }
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
for (let i = 0; i < recordBtns.length; i++) {
  recordBtns[i].addEventListener("click", (e) => {
    const year = e.target.innerHTML;
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";

    fetch("/teacher/records/" + year)
      .then((res) => res.json())
      .then((record) => {
        const recordClone = recordTemplate.content.cloneNode(true);
        content.innerHTML = "";
        content.append(recordClone);
        const recYr = document.getElementById("recordYear");
        recYr.innerHTML += record.year;
        for (let i = 0; i < record.data.length; i++) {
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
      .catch((err) => {
        console.log(err);
      });
  });
}

// edit profile btn

const editProfBtn = document.getElementById("editProfBtn");
const editFormTemplate = document.getElementById("edit-form-template");

editProfBtn.addEventListener("click", (e) => {
  content.innerHTML =
    "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";

  fetch("/teacher/edit/" + uid)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const formClone = editFormTemplate.content.cloneNode(true);
      content.innerHTML = "";
      content.appendChild(formClone);
      document.getElementById("teacherName").value = data.name;
      document.getElementById("teacherEmail").value = data.email;
      document.getElementById("teacherPhone").value = data.phone;
      document.getElementById("teacherDept").value = data.branch;
    })
    .then(() => {
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
            window.location.href = data.redirectRoute;
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// student btn
const studentBtn = document.getElementById("studentBtn");
studentBtn.addEventListener("click", (e) => {
  content.innerHTML =
    "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
  const linkBox = document.createElement("div");
  const linksName = document.createElement("h4");
  linksName.classList.add("subtitle");
  linksName.innerHTML = "View students as per your choice";
  linkBox.appendChild(linksName);
  linkBox.classList.add("w-75", "text-center");
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
  linkBox.appendChild(link1);
  linkBox.appendChild(link2);
  linkBox.appendChild(link3);
  content.appendChild(linkBox);
  handleFetchStudentAll(link1);
  handleFindStudentPage(link2, 0);
  handleFilterPage(link3);
});

// Action btn

const actionBtn = document.getElementById("actionBtn");

actionBtn.addEventListener("click", (e) => {
  content.innerHTML =
    "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
  const linkBox = document.createElement("div");
  const linksName = document.createElement("h4");
  linksName.classList.add("subtitle");
  linksName.innerHTML = "Choose your action";
  linkBox.appendChild(linksName);
  linkBox.classList.add("w-75", "text-center");
  const link1 = document.createElement("button");
  link1.innerHTML = "Add notice";
  link1.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
  const link2 = document.createElement("button");
  link2.innerHTML = "Block/Unblock";
  link2.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
  const link3 = document.createElement("button");
  link3.innerHTML = " View report";
  link3.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
  const link4 = document.createElement("button");
  link4.innerHTML = "Mark student Placed";
  link4.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
  const link5 = document.createElement("button");
  link5.innerHTML = "Remove student";
  link5.classList.add("btn", "btn-lg", "btn-danger", "m-4");
  content.innerHTML = "";
  const link6 = document.createElement("button");
  link6.innerHTML = "Add past record";
  link6.classList.add("btn", "btn-lg", "btn-secondary", "m-4");
  content.innerHTML = "";
  linkBox.appendChild(link1);
  linkBox.appendChild(link2);
  linkBox.appendChild(link3);
  linkBox.appendChild(link4);
  linkBox.appendChild(link5);
  // linkBox.appendChild(link6);
  content.appendChild(linkBox);
  // add notice
  handleRenderAddNotice(link1);
  // block/unblock
  handleFindStudentPage(link2, 1);
  //view report
  handleViewReport(link3);
  // mark student placed
  handleFindStudentPage(link4, 2);
  // remove student
  handleFindStudentPage(link5, 3);
});
function handleViewReport(link) {
  link.addEventListener("click", (e) => {
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    fetch("/teacher/report")
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          window.location.href = data.redirectRoute;
          return;
        }
        const report = data;
        console.log(report);
        const reportTemplate = document.getElementById("report-template");
        const reportClone = reportTemplate.content.cloneNode(true);
        content.innerHTML = "";
        content.appendChild(reportClone);
        for (let i = 0; i < report.students.length; i++) {
          const tableRow = document.createElement("tr");
          const rowCell1 = document.createElement("td");
          const rowCell2 = document.createElement("td");
          const rowCell3 = document.createElement("td");
          const rowCell4 = document.createElement("td");
          const rowCell5 = document.createElement("td");
          const status = report.students[i].placed ? "Placed" : "Unplaced";
          rowCell1.innerHTML = report.students[i].roll;
          rowCell2.innerHTML = report.students[i].name;
          rowCell3.innerHTML =
            '<span class="badge rounded-pill d-inline">' + status + "</span>";
          if (status == "Placed") {
            rowCell3.children[0].classList.add("badge-success");
          } else {
            rowCell3.children[0].classList.add("badge-warning");
          }
          rowCell4.innerHTML = report.students[i].branch;
          rowCell5.innerHTML = report.students[i].company.name;
          tableRow.appendChild(rowCell1);
          tableRow.appendChild(rowCell2);
          tableRow.appendChild(rowCell3);
          tableRow.appendChild(rowCell4);
          tableRow.appendChild(rowCell5);
          const studentRows = document.getElementById("reportStudentRows");
          studentRows.appendChild(tableRow);
        }
        for (let i = 0; i < report.companies.length; i++) {
          const tableRow = document.createElement("tr");
          const rowCell1 = document.createElement("td");
          const rowCell2 = document.createElement("td");
          const rowCell3 = document.createElement("td");
          const rowCell4 = document.createElement("td");
          const rowCell5 = document.createElement("td");
          rowCell1.innerHTML = report.companies[i].name;
          rowCell2.innerHTML = report.companies[i].students.length;
          rowCell3.innerHTML = report.companies[i].estimateOffer;
          rowCell5.innerHTML = report.companies[i].category;
          tableRow.appendChild(rowCell1);
          tableRow.appendChild(rowCell2);
          tableRow.appendChild(rowCell3);
          tableRow.appendChild(rowCell5);
          const rows = document.getElementById("reportCompanyRows");
          rows.appendChild(tableRow);
        }
        document.getElementById("reportTitle").innerHTML =
          "Companies participated :" +
          report.companies.length +
          " <br>Students placed :" +
          report.students.length +
          "<br>Placement percentage : 98%<br>Departments participated : 14<br>Average package : 7 LPA";
      })
      .catch((err) => console.log(err));
  });
}

function handleRenderAddNotice(link) {
  link.addEventListener("click", (e) => {
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    const noticeBody = document.createElement("form");
    noticeBody.classList.add("w-75", "text-center");
    const noticeBodyInp = document.createElement("textarea");
    noticeBodyInp.name = "notice";
    noticeBodyInp.rows = 10;
    noticeBodyInp.classList.add("form-control", "mb-2");
    noticeBodyInp.placeholder = "Compose a notice here";
    const noticeBodySubmit = document.createElement("input");
    noticeBodySubmit.type = "submit";
    noticeBodySubmit.classList.add("btn", "btn-secondary");
    noticeBodySubmit.value = "Submit";
    noticeBody.appendChild(noticeBodyInp);
    noticeBody.appendChild(noticeBodySubmit);
    content.innerHTML = "";
    content.appendChild(noticeBody);
    handleAddNotice(noticeBody);
  });
}

function handleAddNotice(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    const fd = new FormData(form);
    fd.append("admin", "true");
    fetch("/teacher/notices", {
      method: "POST",
      body: fd,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.message);
        window.location.href = data.redirectRoute;
      })
      .catch((err) => console.log(err));
  });
}

function handleFilterPage(link3) {
  link3.addEventListener("click", (e) => {
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    const filterTemplate = document.getElementById("filter-form-template");
    const filterClone = filterTemplate.content.cloneNode(true);
    content.innerHTML = "";
    content.appendChild(filterClone);
    const filterFrm = document.getElementById("filter-form");
    filterFrm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(filterFrm);
      console.log(fd);
      fetch("/teacher/filter", {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            window.location.href = data.redirectRoute;
            return;
          }
          console.log(data);
          const students = data;
          handleRenderStudentsAll(students);
        })
        .catch((err) => console.log(err));
    });
  });
}

function handleFindStudentPage(link2, marker) {
  link2.addEventListener("click", (e) => {
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    const frm = document.createElement("form");
    const inp = document.createElement("input");
    const inp2 = document.createElement("input");
    inp.type = "text";
    inp.placeholder = "Enter roll to search";
    inp.classList.add("form-control", "mb-2");
    inp2.type = "submit";
    inp2.value = "Submit";
    inp2.classList.add("btn", "btn-secondary");
    frm.appendChild(inp);
    frm.appendChild(inp2);
    content.innerHTML = "";
    content.appendChild(frm);
    handleFindFormListener(frm, marker);
  });
}

function handleFindFormListener(frm, marker) {
  frm.addEventListener("submit", (e) => {
    e.preventDefault();
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    const roll = frm.children[0].value;
    fetch("/teacher/student/" + roll)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          window.location.href = data.redirectRoute;
          return;
        }
        const student = data;
        handleRenderOneStudent(student, marker);
      })
      .catch((err) => console.log(err));
  });
}

function handleRenderOneStudent(student, marker) {
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
  student.cmp = student.company.name;
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
      if (key == "cmp") toPut = "Company";
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
  if (marker == 1) {
    const blockBtn = document.createElement("button");
    if (student.blocked) {
      blockBtn.innerHTML = "Unblock student";
    } else {
      blockBtn.innerHTML = "Block Student";
    }
    dataBlock.appendChild(blockBtn);
    blockBtn.classList.add("btn", "btn-secondary");
    blockBtn.addEventListener("click", (e) => {
      content.innerHTML =
        "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";

      fetch("/teacher/block/" + student.roll)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert(data.message);
          window.location.href = data.redirectRoute;
        })
        .catch((err) => console.log(err));
    });
  }
  if (marker == 2) {
    const placeBtn = document.createElement("button");
    if (student.placed == "Placed") {
      console.log("here", student);

      placeBtn.innerHTML = "Mark unplaced";
    } else {
      placeBtn.innerHTML = "Mark placed";
    }
    dataBlock.appendChild(placeBtn);
    placeBtn.classList.add("btn", "btn-secondary");
    placeBtn.addEventListener("click", (e) => {
      content.innerHTML =
        "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
      if(student.placed=="Placed"){
        handlePlaceForm(null,student,1);
      }else{
        renderGetCompany(student);
      }
    });
  }
  if (marker == 3) {
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "Delete student";
    dataBlock.appendChild(delBtn);
    delBtn.classList.add("btn", "btn-danger");
    delBtn.addEventListener("click", (e) => {
      content.innerHTML =
        "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
      fetch("/teacher/delete/" + student.roll)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert(data.message);
          window.location.href = data.redirectRoute;
        })
        .catch((err) => console.log(err));
    });
  }
}

function renderGetCompany(student) {
  const inp = document.createElement("select");
  inp.id = "company-select";
  inp.classList.add("form-control", "form-select", "mb-2");
  fetch("/teacher/company")
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
        window.location.href = data.redirectRoute;
        return;
      }
      const companies = data;
      const op = document.createElement("option");
      const frm = document.createElement("form");
      op.value = "Select Company";
      op.innerHTML = "Select Company";
      op.selected = true;
      for (let i = 0; i < companies.length; i++) {
        const opt = document.createElement("option");
        opt.value = companies[i].name;
        opt.innerHTML = companies[i].name;
        inp.appendChild(opt);
      }
      frm.appendChild(inp);
      const sbmtBtn = document.createElement("input");
      sbmtBtn.type = "Submit";
      sbmtBtn.classList.add("btn", "btn-secondary");
      frm.appendChild(sbmtBtn);
      content.innerHTML="";
      content.appendChild(frm);
      handlePlaceForm(frm,student);
      console.log(frm);
    });
}

function handlePlaceForm(form,student) {
  if(form==null){
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    fetch("/teacher/place/" + student.roll + "/null")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.message);
        window.location.href = data.redirectRoute;
      })
      .catch((err) => console.log(err));
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const companyName = document.getElementById("company-select").value;
    
    console.log(form, companyName);
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    fetch("/teacher/place/" + student.roll + "/" + companyName)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.message);
        window.location.href = data.redirectRoute;
      })
      .catch((err) => console.log(err));
  });
}

function handleFetchStudentAll(link1) {
  link1.addEventListener("click", (e) => {
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    fetch("/teacher/student/0")
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          window.location.href = data.redirectRoute;
          return;
        }
        const students = data;
        handleRenderStudentsAll(students);
      })
      .catch((err) => console.log(err));
  });
}

function handleRenderStudentsAll(students) {
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
      '<span class="badge rounded-pill d-inline">' + status + "</span>";
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
}

function handleViewListener(rowCell, student) {
  const viewLink = rowCell.children[0];
  viewLink.addEventListener("click", (e) => {
    content.innerHTML =
      "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
    handleRenderOneStudent(student);
  });
}
