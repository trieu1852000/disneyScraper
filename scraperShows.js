const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

// Function to generate a random sleep time between 1 second (1000ms) and 10 seconds (10000ms)
function randomSleep() {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
}

async function performScraping() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let allShowDetails = []; // This will hold details for all shows, seasons, and episodes

    // Replace with your actual access token
    const accessToken = process.env.Disney_key;

    try {
        for (let pageNum = 1; pageNum <= 1; pageNum++) {
            const showsUrl = `https://disney.content.edge.bamgrid.com/svc/content/GenericSet/version/6.1/region/US/audience/k-false,l-true/maturity/1830/language/en/setId/53adf843-491b-40ae-9b46-bccbceed863b/pageSize/30/page/${pageNum}`;
            await page.setExtraHTTPHeaders({ 'Authorization': `Bearer ${accessToken}` });
            const response = await page.goto(showsUrl, { waitUntil: 'networkidle0' });

            if (response.ok()) {
                const showsData = await response.json();
                for (const show of showsData.data.GenericSet.items) {
                    const seriesDetailUrl = `https://disney.content.edge.bamgrid.com/svc/content/DmcSeriesBundle/version/5.1/region/US/audience/k-false,l-true/maturity/1830/language/en/encodedSeriesId/${show.encodedSeriesId}`;
                    const seriesResponse = await page.goto(seriesDetailUrl, { waitUntil: 'networkidle0' });

                    if (seriesResponse.ok()) {
                        const seriesData = await seriesResponse.json();
                        const seasons = seriesData.data.DmcSeriesBundle.seasons.seasons;

                        let seasonDetails = [];
                        for (let i = 0; i < seasons.length; i++) {
                            const season = seasons[i];
                            const episodesUrl = `https://disney.content.edge.bamgrid.com/svc/content/DmcEpisodes/version/5.1/region/US/audience/k-false,l-true/maturity/1830/language/en/seasonId/${season.seasonId}/pageSize/15/page/1`;
                            const episodesResponse = await page.goto(episodesUrl, { waitUntil: 'networkidle0' });

                            if (episodesResponse.ok()) {
                                const episodesData = await episodesResponse.json();
                                let episodeDetails = episodesData.data.DmcEpisodes.videos.map(video => ({
                                    "Episode Number": video.episodeSequenceNumber,
                                    "Episode Title": video.text.title.full.program.default.content,
                                    "Episode ID": video.contentId 
                                }));

                                seasonDetails.push({
                                    "Season Number": i + 1, 
                                    "Season ID": season.seasonId,
                                    "Episodes": episodeDetails
                                });
                            }
                            await new Promise(resolve => setTimeout(resolve, randomSleep())); // Random sleep between 1s and 10s
                        }

                        allShowDetails.push({
                            "Series Full Title": show.text.title.full.series.default.content,
                            "Release Date": show.releases[0].releaseDate,
                            "Seasons": seasonDetails
                        });
                    }
                }
            }
        }

        // Save the combined data to a file
        fs.writeFileSync('disneyShowDetails.json', JSON.stringify(allShowDetails, null, 4));
        console.log('All data has been saved.');

    } catch (error) {
        console.error("Error during scraping:", error);
    } finally {
        await browser.close();
    }
}

performScraping();
