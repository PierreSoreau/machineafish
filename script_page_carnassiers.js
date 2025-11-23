
const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");
let index = 0;

function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
}

document.querySelector(".next").onclick = () => {
  index = (index + 1) % slide.length;
  showSlide(index);
};

document.querySelector(".prev").onclick = () => {
  index = (index - 1 + slide.length) % slide.length;
  showSlide(index);
};
