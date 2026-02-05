const ibutton = document.querySelectorAll(".infos");
const closebuttons = document.querySelectorAll(".fa-xmark");
const blur_display = document.querySelector(".blur-overlay");
const allcontenuinfos = document.querySelectorAll(".infos-box");

ibutton.forEach((ibutton) => {
  const number = ibutton.getAttribute("data-target");
  const contenuinfos = document.getElementById(number);

  ibutton.addEventListener("click", () => {
    if (contenuinfos) {
      contenuinfos.style.display = "block";
      blur_display.style.display = "block";
    }
  });
});

blur_display.addEventListener("click", () => {
  allcontenuinfos.forEach((contenuinfo) => {
    contenuinfo.style.display = "none";
    blur_display.style.display = "none";
  });
});

closebuttons.forEach((closebutton) => {
  closebutton.addEventListener("click", () => {
    document.querySelectorAll(".infos-box").forEach((e) => {
      e.style.display = "none";
      blur_display.style.display = "none";
    });
  });
});
