const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config()

// Sleep function using Promise and setTimeout
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performScraping() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let disneyMovies = [];

    // Read existing data if the file exists
    if (fs.existsSync('disneyMovies.json')) {
        disneyMovies = JSON.parse(fs.readFileSync('disneyMovies.json', 'utf8'));
    }

    const accessToken = process.env.Disney_key;

    try {
        for (let pageNum = 1; pageNum <= 2; pageNum++) {
            const pageUrl = `https://disney.content.edge.bamgrid.com/svc/content/GenericSet/version/6.1/region/US/audience/k-false,l-true/maturity/1830/language/en/setId/53adf843-491b-40ae-9b46-bccbceed863b/pageSize/30/page/${pageNum}`;

            await page.setExtraHTTPHeaders({
                'Authorization': `Bearer ${accessToken}`
            });

            const response = await page.goto(pageUrl, { waitUntil: 'networkidle0' });
            if (response.ok()) {
                const data = await response.json();
                if (data && data.data && data.data.GenericSet && data.data.GenericSet.items) {
                    const items = data.data.GenericSet.items;
                    items.forEach(item => {
                        // Assuming releaseDate is in the item object and directly accessible
                        let releaseDate = item.releases && item.releases.length > 0 ? item.releases[0].releaseDate : null;
                        let fullTitle = item.text && item.text.title && item.text.title.full && item.text.title.full.program && item.text.title.full.program.default ? item.text.title.full.program.default.content : "No title";
                        disneyMovies.push({
                            "Content ID": item.contentId,
                            //"internalTitle": item.internalTitle,
                            "Content Name": fullTitle,
                            "Release Date": releaseDate
                        });
                    });
                } else {
                    console.error("Unexpected data structure:", data);
                }
            } else {
                console.error(`Error loading page: ${response.status()} - ${response.statusText()}`);
            }
            await sleep(5000); // Delay for 5 seconds before the next iteration
        }
        fs.writeFileSync('disneyMovies.json', JSON.stringify(disneyMovies, null, 2));
        console.log('Disney titles have been extracted and saved.');
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
}

performScraping();
