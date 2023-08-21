let isOn = true;

function toggleButton() {
  const button = document.querySelector('.toggle-button');
  isOn = !isOn;

  if (isOn) {
    button.classList.remove('off');
    button.classList.add('on');
    button.textContent = 'ON';
  } else {
    button.classList.remove('on');
    button.classList.add('off');
    button.textContent = 'OFF';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.toggle-button');
  button.addEventListener('click', toggleButton);
});