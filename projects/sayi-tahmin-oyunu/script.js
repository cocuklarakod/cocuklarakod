const secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const input = document.getElementById('guess-input');
const messageEl = document.getElementById('message');

document.getElementById('guess-btn').addEventListener('click', () => {
  const guess = Number(input.value);
  attempts++;
  if (!guess) {
    messageEl.textContent = 'Lütfen bir sayı girin.';
    return;
  }
  if (guess === secretNumber) {
    messageEl.textContent = `Tebrikler! ${attempts} denemede bildiniz.`;
    input.disabled = true;
  } else if (guess < secretNumber) {
    messageEl.textContent = 'Daha büyük bir sayı deneyin.';
  } else {
    messageEl.textContent = 'Daha küçük bir sayı deneyin.';
  }
  input.value = '';
  input.focus();
});
