const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ devtools: true, headless: false, dumpio: true});


  // Assuming your local server is running on port 3000
  const page = await browser.newPage();
  arr = [...Array(188).keys()];
  stringArr = arr.map(String)
  console.log(stringArr)
  await page.goto('http://localhost:5173/query?mode=node&species=txid7227&protein=Egfr&goTerm=signal+transduction');

  for(let i = 0; i < 151; i++){
    // Manipulate input field
    await page.evaluate( () => document.getElementById("k-input-test").value = "")

    await page.type('#k-input-test', stringArr[i]);

    // Click the submit button and wait for navigation to complete
    await Promise.all([
      page.click('#search-button-test'),
    ]);

  // Wait for the console.log to be executed (adjust as needed)
  await new Promise(resolve => setTimeout(resolve, 10000));
  }

  await new Promise(resolve => setTimeout(resolve, 1000000));


  // Save the console logs to a file or perform other actions as needed

})();

