document.getElementById('check-btn').addEventListener('click', function() {
    let inputText = document.getElementById('text-input').value.trim();
    let resultElement = document.getElementById('result');

    if (!inputText) {
        alert("Please input a value");
        return;
    }

    let cleanedText = inputText.replace(/[^A-Za-z0-9]/g, '').toLowerCase();

    if (cleanedText === cleanedText.split('').reverse().join('')) {
        resultElement.textContent = `${inputText} is a palindrome`;
    } else {
        resultElement.textContent = `${inputText} is not a palindrome`;
    }
});
