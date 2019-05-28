
let menu = document.getElementById("menu");
let crtList = document.getElementById("crt_list");
let deleteFrm = document.getElementById("delete_frm");

function menuToggle() {
  let menuToggle = document.getElementById("menu-toggle");

  if (menu.style.display === "none") {
    menu.style.display="block";
    menuToggle.innerHTML='<i class="fal fa-minus"></i>';
  } else {
    menu.style.display="none";
    menuToggle.innerHTML='<i class="fal fa-bars"></i>';
  }
};

function listToggle() {
  let crtListToggle = document.getElementById("crt_list-toggle");

  if (crtList.style.display === "none") {
    crtList.style.display="block";
    crtListToggle.innerHTML='<i class="fal fa-times"></i>';
  } else {
    crtList.style.display="none";
    crtListToggle.innerHTML='<i class="fal fa-plus"></i>';
  }
};
