const sliderImage = document.getElementById('rice-slider');
const prevButton = document.getElementById('arrow-left');
const nextButton = document.getElementById('arrow-right');

const paths = ['images/rice1.png', 'images/rice2.png', 'images/rice3.png'];
let counter = 0;

prevButton.onclick = () => {
    if (counter == 0) counter = 2;
    else counter --;
    sliderImage.src = paths[counter];
}

nextButton.onclick = () => {
    if (counter == 2) counter = 0;
    else counter ++;
    sliderImage.src = paths[counter];
}