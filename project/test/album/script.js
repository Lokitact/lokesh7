var photos = ["./1.jpg", "./2.jpg", "./3.jpg", "./4.jpg", "./5.jpg", "./6.jpg"];

var currentPage = 0;
var pages = [];

function createBook() {
  var book = document.getElementById("book");

  photos.forEach((photo, index) => {
    var page = document.createElement("div");
    page.className = "page";
    page.style.zIndex = photos.length - index; // Higher z-index for front pages

    var img = document.createElement("img");
    img.src = photo;

    page.appendChild(img);
    book.appendChild(page);
    pages.push(page);
  });
}

// Flip forward
document.getElementById("nextPage").addEventListener("click", function () {
  if (currentPage < pages.length) {
    pages[currentPage].classList.add("flipped");
    currentPage++;
  }
});

// Flip backward
document.getElementById("prevPage").addEventListener("click", function () {
  if (currentPage > 0) {
    currentPage--;
    pages[currentPage].classList.remove("flipped");
  }
});

createBook();
