const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

function randomSleep() {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
}

async function Init(outputLocation = "test", totalPages = 2) { 
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let disneyShows = []; // This will hold details for all shows in the desired format

    const accessToken = process.env.Disney_key; // Ensure your Disney access token is correctly set in .env file

    try {
        // Fetch main URL and extract setIdn
        const mainUrl = 'https://disney.content.edge.bamgrid.com/svc/content/Collection/StadardCollection/version/6.1/region/US/audience/k-false,l-true/maturity/1830/language/en/contentClass/contentType/slug/series';
        await page.setExtraHTTPHeaders({ 'Authorization': `Bearer ${accessToken}` });
        let response = await page.goto(mainUrl, { waitUntil: 'networkidle0' });

        if (!response.ok()) {
            throw new Error(`Error fetching the main URL: ${response.statusText()}`);
        }

        let data = await response.json();
        let setId = data.data.Collection.containers.find(container => container.set && container.set.text && container.set.text.title.full.set.default.content === "All Series A-Z").set.refId;

        for (let numPage = 1; numPage <= totalPages; numPage++) { // Loop through the specified number of pages
            const showsUrl = `https://disney.content.edge.bamgrid.com/svc/content/GenericSet/version/6.1/region/US/audience/k-false,l-true/maturity/1830/language/en/setId/${setId}/pageSize/30/page/${numPage}`;
            response = await page.goto(showsUrl, { waitUntil: 'networkidle0' });

            if (response.ok()) {
                const showsData = await response.json();
                for (const show of showsData.data.GenericSet.items) {
                    const seriesDetailUrl = `https://disney.content.edge.bamgrid.com/svc/content/DmcSeriesBundle/version/5.1/region/US/audience/k-false,l-true/maturity/1830/language/en/encodedSeriesId/${show.encodedSeriesId}`;
                    const seriesResponse = await page.goto(seriesDetailUrl, { waitUntil: 'networkidle0' });

                    if (seriesResponse.ok()) {
                        const seriesData = await seriesResponse.json();
                        const seasons = seriesData.data.DmcSeriesBundle.seasons.seasons;

                        for (let i = 0; i < seasons.length; i++) {
                            const season = seasons[i];
                            for (let pageNum = 1; pageNum <= totalPages; pageNum++) { // Add inner loop for episodes
                                const episodesUrl = `https://disney.content.edge.bamgrid.com/svc/content/DmcEpisodes/version/5.1/region/US/audience/k-false,l-true/maturity/1830/language/en/seasonId/${season.seasonId}/pageSize/15/page/${pageNum}`;
                                const episodesResponse = await page.goto(episodesUrl, { waitUntil: 'networkidle0' });

                                if (episodesResponse.ok()) {
                                    const episodesData = await episodesResponse.json();
                                    episodesData.data.DmcEpisodes.videos.forEach(video => {
                                        // Add formatted show details
                                        disneyShows.push(
                                            JSON.stringify({
                                                "tv_show_tmdb_id": "",
                                                "imdb_id": "",
                                                "season_episode_tmdb_id": "",
                                                "season": i + 1,
                                                "episode": video.episodeSequenceNumber,
                                                "tv_show_name": show.text.title.full.series.default.content,
                                                "tv_show_episode_name": video.text.title.full.program.default.content,
                                                "release_date": show.releases[0].releaseDate,
                                                "source_id": "673",
                                                "source_type": "disney_plus-disney_plus-subscription",
                                                "origin_source": "freecast",
                                                "region_id": "us",
                                                "A": `disneyplus://disneyplus.com/video/${video.contentId}`,
                                                "F": "",
                                                "I": "disneyplus://disneyplus.com/video/<contentId>",
                                                "L": `{\"id\":\"com.disney.disneyplus-prod\",\"params\":{\"contentTarget\":\"page=media_player&contentId=${video.contentId}&contentType=Full&programType=movie&id=&type=movie&pid=UniversalSearch\"}}`,
                                                "N": "",
                                                "R": "",
                                                "S": "",
                                                "T": "",
                                                "W": `https://www.disneyplus.com/video/${video.contentId}`,
                                                "rental_cost_sd": null,
                                                "rental_cost_hd": null,
                                                "purchase_cost_sd": null,
                                                "purchase_cost_hd": null
                                            })
                                        );
                                    });
                                }
                                await new Promise(resolve => setTimeout(resolve, randomSleep())); // Random sleep
                            }
                        }
                    }
                }
            }
        }

        // Save the combined data to a file
        fs.writeFileSync(`${outputLocation}/disneyShows.json`, JSON.stringify(disneyShows, null, 4));
        console.log('Formatted show details have been saved.');

    } catch (error) {
        console.error("Error during scraping:", error);
    } finally {
        await browser.close();
    }
}

Init(); // Call the function
