
let position = 0;

function slide(direction) {
  const containerWidth = document.querySelector('.category-container').offsetWidth;
  const visibleItems = Math.floor(containerWidth / 220); // Width of each category item + margin

  if (direction === 'left') {
    position = Math.max(position - visibleItems, 0);
  } else {
    position = Math.min(position + visibleItems, categoryItems.children.length - visibleItems);
  }

  categoryItems.style.transform = `translateX(-${position * 220}px)`;
} 

const categoryContainer = document.querySelector('.category');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const categoryItems = document.querySelectorAll('.category-item');
const itemWidth = categoryItems[0].clientWidth;
let currentIndex = 0;

leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCategoryPosition();
    }
});

rightArrow.addEventListener('click', () => {
    if (currentIndex < categoryItems.length - 5) {
        currentIndex++;
        updateCategoryPosition();
    }
});

function updateCategoryPosition() {
    const translateX = -currentIndex * itemWidth;
    categoryContainer.style.transform = `translateX(${translateX}px)`;
}