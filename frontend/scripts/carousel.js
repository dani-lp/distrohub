// const sliderImage = document.getElementById('rice-slider');
// const prevButton = document.getElementById('arrow-left');
// const nextButton = document.getElementById('arrow-right');

// const paths = ['images/rice1.png', 'images/rice2.png', 'images/rice3.png'];
// let counter = 0;

// prevButton.onclick = () => {
//     if (counter == 0) counter = 2;
//     else counter --;
//     sliderImage.src = paths[counter];
// }

// nextButton.onclick = () => {
//     if (counter == 2) counter = 0;
//     else counter ++;
//     sliderImage.src = paths[counter];
// }

const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');

const prevButton = document.querySelector('#arrow-left');
const nextButton = document.querySelector('#arrow-right');


window.onload = () => {
    let counter = 1;
    const size = carouselImages[0].clientWidth;
    console.log(size);

    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

    nextButton.addEventListener('click', () => {
        if (counter >= carouselImages.length - 1) return;
        carouselSlide.style.transition = "transform 500ms ease";
        counter++;
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    });

    prevButton.addEventListener('click', () => {
        if (counter <= 0) return;
        carouselSlide.style.transition = "transform 500ms ease";
        counter--;
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
    });

    carouselSlide.addEventListener('transitionend', () => {
        if (carouselImages[counter].id === 'last-clone') {
            carouselSlide.style.transition = "none";
            counter = carouselImages.length - 2;
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        }
        if (carouselImages[counter].id === 'first-clone') {
            carouselSlide.style.transition = "none";
            counter = carouselImages.length - counter;
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        }
    });
}