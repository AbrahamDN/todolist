
function newList_toggle() {
  let x = document.getElementById("newList_form");
  let b = document.querySelector(".newList_toggle button");
  if (x.style.display === "none") {
    b.classList.add("btn2");
    x.style.display = "block";
    b.innerHTML = "-";
  } else {
    x.style.display = "none";
    b.classList.remove("btn2");
    b.innerHTML = "+";
  }

}

function extras_toggle(){
  let e = document.getElementById("extras");
  if (e.style.display === "none") {
    e.style.display = "block";
  } else {
    e.style.display = "none";
  }
}
