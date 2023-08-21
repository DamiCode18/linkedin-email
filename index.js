const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const cookie = require("cookie");

const {
  splitFullName,
  generateEmailCombinations,
  convertToEnglishAlphabet,
  sendMail,
  resendApi
} = require("./utils");

async function crawlProjects() {
  try {
    const browser = await puppeteer.launch({ headless: false }); // Set headless to true for invisible browsing
    const page = await browser.newPage();

    const cookieStr = `lang=v=2&lang=en-us; bcookie="v=2&bda8470a-f5e6-442d-858a-0dc5f5edc52e"; bscookie="v=1&20230727144634a06a7b36-f586-400f-8a27-483af0a4ec1dAQF4GG2Klpq3IB-pUkoun3sefsy0VySp"; g_state={"i_p":1690476400931,"i_l":1}; li_rm=AQGbqBulm6P3wQAAAYmX0UUXHzMdbfzQ0yadmISdLhRfg87kwXV7mZ0sIuCeomfS6WydAkmy1QqPuORyo7oEYQ00VhY9DanLqEfpZTMTANc096lAzPEZcQoY; li_at=AQEDASe3gZEC0P_0AAABiZfRiqQAAAGJu94OpE4AfUORBQThYDKTe1UCz7lLqAzrUYicV42jrPicu8T42rHLbVUHjBLrClrUr5RiyBzMhW6EPFgyIFIdX2dl8kKJTfjUYbwHLlX3NLVLaXw3UILvmr-k; liap=true; JSESSIONID="ajax:6785161954178470956"; lidc="b=TB81:s=T:r=T:a=T:p=T:g=3200:u=699:x=1:i=1690469239:t=1690542372:v=2:sig=AQEJc45yu2meAQR6Y8FGDMW9w0R3RRoz"; timezone=Africa/Lagos; li_theme=light; li_theme_set=app; UserMatchHistory=AQKvtjFPnlpOKQAAAYmX4LZwhBQmkjfAdWYE9bY5GWD7AeL-07vmxmBzmYz43kjlbySbhg9tDPOX2sAlop9SyOPQ62b3s14Qk3eDvIT8rmMhbxsA8mxzwvIPs1u2Wra3BU80T9SZcNxDiZFajy_JPIhDlguJk6XjrmrhktkByDkPw3gNMtKzNxD76lDrD_ecxAQ2qnX3-fKSKoAmBETLCXsYxnGOl1Hl_Dv_h5hCGipOQXih3RRxSxX2WpPUymHk5zck8W6Cm8zNeRUAdv1__nyLo2JZeB2dF-dN7Xk3s_sfx6Hgw4P_kKJxEUG00JOT2A`;
    const cookieArr = cookieStr.split(";").map((pair) => {
      const singleCookie = cookie.parse(pair);
      for (let key in singleCookie) {
        return {
          name: key,
          value: singleCookie[key],
          domain: ".linkedin.com",
        };
      }
    });

    // Add cookie to the page
    for (const cookie of cookieArr) {
      await page.setCookie(cookie);
    }
    await page.goto("https://www.linkedin.com/in/joy-utosu-b91b52102/");
    const name = await page.evaluate(() => {
      const el = document.querySelector(
        "#ember27 > div > div > div:nth-child(1) > div:nth-child(1) > h1"
      );
      return el.textContent;
    });

    const { first_name, last_name } = splitFullName(name);
    const emails = generateEmailCombinations(
      convertToEnglishAlphabet(first_name),
      convertToEnglishAlphabet(last_name)
    );

    fs.writeFile("emails.txt", emails.join("\r\n"));
    console.log(emails);
    resendApi(emails)


    // for(let i = 0; i < emails.length; i++){
    //   sendMail(emails[i])
    // }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

crawlProjects();
