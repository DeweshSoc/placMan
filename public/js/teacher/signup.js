const content = document.getElementById("content");
const frm = document.getElementsByTagName("form")[0];
frm.addEventListener("submit", (e) => {
  e.preventDefault();
  content.innerHTML =
    "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div>;";
  const teacherInfo = new FormData(frm);
  fetch("/teacher/signup", {
    method: "POST",
    body: teacherInfo,
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
