const quotes = [
    { text: "The man who speaks alone seeks to speak to God someday.", author: "Antonio Machado" },
    { text: "An intelligent man only reads for two reasons: pleasure or instruction.", author: "Olavo de Carvalho" },
    { text: "To be deep in history is to cease to be Protestant.", author: "John Henry Newman" },
    { text: "God does not require that we be successful, only that we be faithful.", author: "Saint Teresa of Calcutta" },
    { text: "Pray, hope, and don't worry. Worry is useless. God is merciful and will hear your prayer.", author: "Saint Padre Pio" },
    { text: "If you are what you should be, you will set the whole world on fire.", author: "Saint Catherine of Siena" },
    { text: "Nothing is more practical than finding God, than falling in Love in a quite absolute, final way.", author: "Pedro Arrupe" },
    { text: "You cannot be half a saint; you must be a whole saint or no saint at all.", author: "Saint Therese of Lisieux" }
  ];
  
  const textElement = document.getElementById("text");
  const authorElement = document.getElementById("author");
  const newQuoteButton = document.getElementById("new-quote");
  const tweetQuoteButton = document.getElementById("tweet-quote");
  
  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
  
  function updateQuote() {
    const quote = getRandomQuote();
    textElement.textContent = `"${quote.text}"`;
    authorElement.textContent = `- ${quote.author}`;
    tweetQuoteButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${quote.text}" - ${quote.author}`)}`;
  }
  
  newQuoteButton.addEventListener("click", updateQuote);
  
  updateQuote();
  