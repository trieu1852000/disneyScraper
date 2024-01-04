const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

// Sleep function using Promise and setTimeout
function randomSleep() {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
}

async function Init(media, payload, outputLocation = "test") {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let disneyMovies = [];

    if (fs.existsSync('disneyMovies.json')) {
        disneyMovies = payload; //JSON.parse(fs.readFileSync('disneyMovies.json', 'utf8'));
    }
    
    const accessToken = process.env.Disney_key;

    try {
        // Fetch the main URL to get the refId
        const mainUrl = `https://disney.content.edge.bamgrid.com/svc/content/Collection/StandardCollection/version/6.1/region/US/audience/k-false,l-true/maturity/1830/language/en/contentClass/contentType/slug/movies`;
        await page.setExtraHTTPHeaders({
            'Authorization': `Bearer ${accessToken}`
        });
        let response = await page.goto(mainUrl, { waitUntil: 'networkidle0' });
        if (response.ok()) {
            let data = await response.json();
            let containers = data.data.Collection.containers;
            let setId = containers.find(container => container.set && container.set.refIdType === "setId").set.refId;
            console.log(`Found Set ID: ${setId}`);

            for (let pageNum = 1; pageNum <= 2; pageNum++) {
                const pageUrl = `https://disney.content.edge.bamgrid.com/svc/content/GenericSet/version/6.1/region/US/audience/k-false,l-true/maturity/1830/language/en/setId/${setId}/pageSize/30/page/${pageNum}`;

                response = await page.goto(pageUrl, { waitUntil: 'networkidle0' });
                if (response.ok()) {
                    data = await response.json();
                    if (data && data.data && data.data.GenericSet && data.data.GenericSet.items) {
                        const items = data.data.GenericSet.items;
                        items.forEach(item => {
                            let releaseDate = item.releases && item.releases.length > 0 ? item.releases[0].releaseDate : null;
                            let fullTitle = item.text && item.text.title && item.text.title.full && item.text.title.full.program && item.text.title.full.program.default ? item.text.title.full.program.default.content : "No title";
                            disneyMovies.push({
                                "Content ID": item.contentId,
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
                await new Promise(resolve => setTimeout(resolve, randomSleep())); // Random sleep between 1s and 10s
            }
        } else {
            console.error(`Error loading main URL: ${response.status()} - ${response.statusText()}`);
        }

        fs.writeFileSync(`${outputLocation}/disneyMovies.json`, JSON.stringify(disneyMovies, null, 2));
        console.log('Disney titles have been extracted and saved.');
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
}

Init();
