const puppeteer = require('puppeteer');
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performScraping() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let allShowDetails = []; // This will hold details for all shows, seasons, and episodes

    // Replace with your actual access token
    const accessToken = 'eyJ6aXAiOiJERUYiLCJraWQiOiJ0Vy10M2ZQUTJEN2Q0YlBWTU1rSkd4dkJlZ0ZXQkdXek5KcFFtOGRJMWYwIiwiY3R5IjoiSldUIiwiZW5jIjoiQzIwUCIsImFsZyI6ImRpciJ9..k2XGPKngQt_kCFhb.pDzSgJcXgL3yhKNz3-gzelUKCw2ghf-rrkCUCtInc7D9b96hyZ3exwqQGnMOwc_Q072G-j6bV2SQBsv0hbNe9ZAUcLqNoNv6ant3DCMhgJXzFeXbEDJwcQBnj_UIWecge2NdpWSA9WJxo_k7ueBbLnt7e6MISVVAM8-7gpFfTAvHqvldPpxEQrb46kbcHO6LLLyTFBxBK4WbOraT2Yuo-S0SCXjG65uYT6rE81sSzTJmA25yttq9lZHY97TKAr4G01Nsp4tHw8ZgyYb8b65mVToraJEOKX-hrxCziMHF3JSpVBvFWv5BI0gMZ8ol2AFxaeF9KeQScreeC1RAi-1JB4sDRg7C0Ew0riNeXEUaLUlxDHPJ_4XpzXy8mQBYl_5VrRHq6oXgi9IAak-G7ASWqf1CcXmfjzviFOo31GapCMPbIwmFHeD_8wMyYEiBEqAB7GR8eTKMNM3Nz89Z_jWhPy0MVULC3cJdcGNAfbKPhPtNmnN6mgNi6TFQqPYfQdKDTWxsQOhRVr0uUOt4MQZKCOcdPoCyh0z5n8keYwQy0U1rsKaNtMBC9_C01QolozzV3IBO1-SJeVfMFOmKI-E2Mm8L5HnVrvO8TAUSRaWAs9o5pzW1BcA-Z8WQyl_DZ9oyztuoisjwPMc8UkfA2eSy-1hkKePy_WQVjk5rhzPaOG2Zd5swN8e-dy01xPljdii6aj7ale0bAo19DTpQXk6pRSPEcUxJZae1YOXdfqteyDe2jDiwLsPgh9h6OxvKu41JMQOBohd2GtimoXE4QieS4Sw9VxNN0LEy93nNClJE4oUoPh5H_6fUFGneGkQ_U2D3YIH-RhHwhv6A24m35Ztd8gNMoOFuGcOfUP2HfSnORqAHfNKU226I4T2P1y4kDwH0bUpthdmCbkMmTYcv0lzn5RNzrFZ-OD1kVMl_aVWL3cGvR3aQ7uJO393Mxx6qZE7EcLp8FLI0hzBxJm7o_I6aZTut_I3RTbO0TEM5DqZ8Onpaq6qcu-YRpKjLwn7TQJBK3st2wFLYUYJEkflFvqeNlYcJXR0V1fxcvJpW4HZmH3ATL4lbVZNmNT6z2Rfj1uJuHoXjyA7YqvsI3DT42EYy0AYNsTY4afOsCYpcbXgg5FiXeOYr9blr0UzVAAG3DXoDGvpZf4d5DT-sN0CS6UCxJ99rKwNgs1E-5eBz0tkerYbzg-VjrjyUYYXLDEE5noQhvRJfPTb6q2FlB17bGmbSeo1yPm5AWhwtAp051yxHH2Reo-PnZQBAT8PRt0Un4F6qV5yZXpoy3AJcXUfsm1D-nrT7i_9xVNDiIlNtMQOeh6JPsKwofkd6QMkPJEpAbFwvtxXQI4dLdqdAIeNKQgllXDZs96gnm3fgXlKELHp-HM2UiPYw1kuGgcKgljlcwaiueoHkviyzgZENrwGhU1sf0v9aY3Ka22JnaISW4YLM9COX3mrlxAQghZQMwuwZmIRwZBqHbLFeJN4sFv8j7CwLckyJYk-zukyQiNarsJSp92L8Tf9kalawkALbfhGW3Rj5s404xT8Xr3h1h41teNjMTeLCwkribmhT1tK_mVZdb9E4MN18LCxkOMg51rGcTj80zoCB0tpWlqZH884G7xC4LjKyj596lfaS6ZrBRiQFHHUWRnQjyO6U0dGTCZwMsjBl4kcdSilO-1bWdKz7CSjdFBg78g67agkYxyZxPdIismTv5WC-ldvucoKcb4O43Nt2yd-kfX4QrLn32R0a4ciLLthNkSZyQcDf3ORHFgPpFat-hn-n2mSW5sCM2Ch1H1170RrMeCU_CXWBSvvZJWMxIo5mNEKCXgvaaLvnE0R1Gmf4kotW0loB589rNN_NwQQu54VWFVYfFIETOsxqZBaghEL7VCm8xMpUBPVH6pZug7B4_vXA_CIekj2D1ORFIe_8P7AZkGlm4U-zOnYuDvmGQJvrXxZrvCutnsNRYUO05HIoFJKOqnncgR08rAnMX2IfhpDw7goPP9LwsN1cakCFHtbSO0ChhBmLpOfJrI4Fzs4u4X0LbgY48xJ3pfA0yoZXXhFuR8EbYDQR9Jw1yDwq5Fy2VwJmvk-78Bl1f2fnTzmY5XrF5-g_UPmEA_cL3tXz1ea2cabvWX1mvcQdbdySDO4HIOY6qp3IZd9Rbyz49sCrekrin9YcQ-XoCJncIbx-02tJmmR4fx3tsae0wk3ZE6vmVc6His5gS7WGQDoJSGSCeuBe1-Z1V7wLfuVQWZsVwAkyXIlkM3vVGWQDMulFhv1tCxS42AyD2Yw8wt1HN-1wwZYZ3cpz60NlCh1eHUHIkJ5pOqr3Iaz3ER7DNq3EfK3VM3lAyU0x2mxIxzxhW4tKhX8zku33d1G_-virkU9H4_SXdbTSzw--NN2dT0rV7NvmuZ4VK_SwG0DFTI3RmYA-NcN9FQ4-sHngEstnXfajxePOEUksckoYXX-LdAx8ZCKPwShn57AwCBSWkjJgOAP0_MBhHAfsgvuDF2Oq1ibDPwK9ROMbeubvWM5L-BAMTFcIE7NfQ9kiOlcLoDRPzDLL2nMbLMDy7Tyg43rg9CdweweFOR-nVo-lFiZ07YQNQS2WxE1Yv3bn--6OYE3twuObQr6vr_RUceVnbfitSjPjCpMJjhz8Y9cDbM1OprdkJI2dQa9FYmS5Pcx2se82-OV4vQBgEr3UKljYXfdVHjD-uu2rwKAN8eEX8EnUhkO7CikUdlpbMf-12JCAzGWv2oRKRB1AfkoAJVToDnRcbvmz0rQehlw4bO0AmcmHdkjpHYMcAxOR0XpbZ2aMEXMtZ0hppBkZocm9PCjcyMyJ5yQfjlVSjF8_hydYRM_daCCszQtjRnTm7THKBWJKYm1M0zclM_zyjPjjTW6pBQo7rxsz1KYivbBSOe2SUMdYoi_huwNOaNUxMLvdkc3OJjwgdk1GGPQq5PGsbbe5fK70OhSufU52Sqtbw8kxh0tyqJdkuSfq5zPbPADn7IfxwCjOw2UHAum_g1OcJMJhe0Gh42MwxJ33wc7QKFhERLtZ3EKb2y1bVmVIm_KQT1ha5pHurGzsqAY6n3i9akvVWPYllAE4vdLVKtqgGibOq6Q95EkKM4wuUnBeFnF-hEv4c9ceDek6HM8oz8gvjE4korkJ5PPG2nlkX3HwNReLjl6SqZoJ0o0cItueRDJOIXUBALddFWFnOeBh1jSSh_a8YT5Xs-T2sKGC8iH-mOx9RGUdszGDL2sfp2ZwhtGLzM1K14p0jcOdqqUwg4aDMogxG51DnxBc6aBWWsUE0uVM9tuw20_O8eO-PsSnO5_F9HwagyMC_LET8frs4WM6UG50QiQGzgsVFPMdoiUbV86cspqysi5ddc8HI1OcLxxJodcHj3h-7yNqOH84J0TPG2Hi4N2p1QRLmu2plA3oCHjLvVAtUKFU6ahadiF6pw_Cu9-az1Vc0sx8G9kifKQ-j6ZfQNTuY00I0-HrGYPkN1JOIXtEELeu1AcJO5ybNBgAtpsspDnNien3Bm3aGlOHjATjPd_swiFgbL44jdrJe3DHDb1iwnIW_TeNl-UepS6pY_YTIzs_r1_EWzAUDZgVtZXaFllYZ5CcxqAng_tbXHCMo9pzcLbzyjPKFcMDuIermZ-ILx_c1f1p0rrtfxqJB4AcsI9KSfzWV0kbPM8bUOtVsu6VPd1Xhu8bgjcf5GoXHMXLu-3WcGCsmAHU83WOk5LftmPYdQPA-2bMS2ZOfY5DL9NMxdzRloJ0gjF7Z9iuJWH0DC7XWuFAv5Nn2kyaccQ_C10XJuw6q3FsDPf6tEHGf-4rTCf4xfP2yRL-cqJCsJSbPz14F19guErjWRUBbwcG4cBQB6mQAxJRqYFVMpM3cpZJzF8sPh7Qiz54BiMUkRwtPsvcOd_XIow20rfwvg608Sny9plYAOqAhn3jLpD96SMoyUwgsLmlO52ms-_wRdcQZGneqsTxI5DS6-yu9u0EVzMtemnMiVclysar0OumarpLJRFx-Am2EaszVlcZhYhgnYv_0TCQr1iM5d1kf-2o15f_wFiNKme4JC3rYg9ZkKwHsTgEpq6s2oX-xKZiiFtfAlwnGsCHUTOha0Dhhq862kUnUXBpBFKpPB5bpy2IzI_xz1OMZS0LvN0oBp-4KQ.QxMtbLSTcj1zJoeE20e0PQ';

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
                        for (const season of seasons) {
                            const episodesUrl = `https://disney.content.edge.bamgrid.com/svc/content/DmcEpisodes/version/5.1/region/US/audience/k-false,l-true/maturity/1830/language/en/seasonId/${season.seasonId}/pageSize/15/page/1`;
                            const episodesResponse = await page.goto(episodesUrl, { waitUntil: 'networkidle0' });

                            if (episodesResponse.ok()) {
                                const episodesData = await episodesResponse.json();
                                let episodeDetails = episodesData.data.DmcEpisodes.videos.map(video => ({
                                    "Episode Number": video.episodeSequenceNumber,
                                    "Episode Title": video.text.title.full.program.default.content
                                }));

                                seasonDetails.push({
                                    "Season ID": season.seasonId,
                                    "Episodes": episodeDetails
                                });
                            }
                            await sleep(1000); // Sleep to avoid rate limiting
                        }

                        allShowDetails.push({
                            "Series Id": show.encodedSeriesId,
                            "Content ID": show.contentId,
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
