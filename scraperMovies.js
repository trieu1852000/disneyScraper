const puppeteer = require('puppeteer');
const fs = require('fs');

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

    const accessToken = 'eyJ6aXAiOiJERUYiLCJraWQiOiJ0Vy10M2ZQUTJEN2Q0YlBWTU1rSkd4dkJlZ0ZXQkdXek5KcFFtOGRJMWYwIiwiY3R5IjoiSldUIiwiZW5jIjoiQzIwUCIsImFsZyI6ImRpciJ9..16Z9VjpKHNpwKh3n.VLtqwkLcTjyVWNcQB6dpQx3mDB1dPLjmK69NUZpR_0LbTpU0HNCpNeA7OzlyR5B7iisfoJRWmTkpuBRV1OlOC0MRsp7nFd-m9ZbVOv5I_SpocrVnb30_iTURB4_Op9rIlLVxAxpBuzGUNkjB37pr5sXTSyUAt-xOPBx2xOZw9nPaOXuME64zeeBtqRvaprbX5dfmuzRP9g7Y64YJKpq5uz_YIXQeWd7JvlcbKeadUm9XUY7YsgbHSY9vJiYhfllpgpAz-IrSNjbYkbClYpXOMdbHf-PGG2KqgFnx4twpeH6QSKuUe3Lqug0JLNMxHZA6RnNi5IuIZ6RAF2ytPwbBv4ByOeNgRA6kY_l9MTscRp57dUAli9hM6698MPXq1739I7d-nHQPPiTC95Ln2h0zsWFgt_su-WeGsp8lJ9uluB6I5rtKXlyuRE767VC0pttSPnLmtJ_RHNeAN8oLWOX6xxAt-ap18CshVHBqUwG16nx6kbmwtUCMk4HYnx8YwGVaTi0ipRuhOwmpghj88uUk2UwMscugTxrfpvfCtUwKHR4aPWKtvTMP-sf9k92A6vqgiLRGSdapfnHSjF-eO6uclLGQM_Nk8ENztDdM_Q7jjkfEwib9NS2LBf3Nbu8vCaGyVrd12o_dxEWR3nQSJ5x4ScWlIaoYuCDkzGnLr2SKHIWq0pCwEkD54ykU771ywZ-ggaJL_Z0zEAcpNDTtvXWhxeH-6lpLglPeJoYGyHIeLmhaf9p9BCqWUeowWZDRYmTqq6jKriHOs08nn8zZcNP6aTouD6dZiq0Z4R8pK8gjemdkyeD2J773RppG1xHEwyYo-6wNkjaSZs8w8Fr64Nf1tlUsrK1U7inLpvPSTNdnrhpPbekiYjOXOATqIHgTDzpZXqRTkgnOP6N__a1R6iCKdCQrGk5FOfUkiHZgT8FgPi04sz9-vHufAe3BCnqdghIScyhhyqEiBDU3grBz9otFcU4YuULF0UxY4wO1L1RsvYH7HAsiEEt8faAUpZsT947V8aX8cP4iRUmRoEQEf-frGZ9v9B6lSViFya82AYCJZc3CbKvbtL0qBWRmWKWom0DMiNPncV2TnvvwDvfWk2cutJpMntCDvV3ihn0Shjgii08dnpJoHt1QATYjxfYj403ypwyu1ZryUQOz4vhYOmG8MbPC6jkCP558C0vTXwkP5suaXHM64-DfTI934kVo4cvID9ihtkET61M_jhBnK3aL3S7i1Xrj7hiuEYiqKmSPGHqiHCo5QaQw1W-IlDr9hhrQKrY-ECQ_YgFN-17QrZqK6qGNeE6M0_HUkgzmwf1gOu-0b5FI4Xdl0ZDCYtNS_KRnhZDJAU8XSRJhXj_58uiH5XRBYK1FqGy5FsgIf8pcZB5mnipM5NuxlsqUv4KLo71SDGI2vBwaqAM84Kioo416VzOS_zZTw2vx6T8JAOK2bRjnMv4IXXQDJ6sf5mlfbawGfGBI8vE8O0jyx7LMvbXkhCs9SWw4sYkKycozzR-KQkTKJd4a_kClR0PK-eft64a6Vzc88TKtGFze0PX0RXsykujSQ_JQwB5sWwwulSfV5ub5901EqH63_50bFNWS1YD3kDKqFk9QQlOABwybSi6BlhcPHMmcpEtF3QoL24joOi56DHJK0dEbsEdT-VlYZI8VLh2bI2TNaLMiZ0aEOrx5HEOYVxQK3KV3GuQuPM3cTh7q85SsMIzlqWdaJ3ckB2uz598UMq6SCycwjuG4dpbYJNlDgYBkNBWad02n3FDV03KcQuGMcQ9n9kBykB_5WjYyEYlfTETw00PDdZkXcmLSP-fKMsdGdPRYXUu0RJf5gkNnWOX8fXP9rIfO_OVsizUiroEpyK01apZO4d-ePVFQfjDT30sYiEmEipMX-DjVkQxhzspb18IYz9zHx4Ww-5SO1HCeuCiNw6Ck5AMSFQ_mH4foADpfkODq_kC6RKzT4XQEQAOgvkowGnuOoeu7Wj-mKcCqDIEwlFpDdethU-Aj2Ls80KK1LCQpdZpP31osRCnQNDAHNJMy1AqnFu7AObDHmdEecPWnjQY1YDjHvaUgif8Gvczi7hucz02h92YTuo29heS2gg_CGGmoLrY5GvxilPKAUKW3km96GgI2KGl9D90GRERQc7AZ4Fup5kp3i2U2avWGMVwHpxmLPWkEPVbLIuGZjRkHC-ynDxYOMIamqKrGbJylV_dkIgfEIKu6EuVn9xsU8iFXIrre5wectnZVOGVTKIG8UNigxY-o8x9RqUXyS_nyf0cTktO9kalsbZ_JbsyGvI0Rq6X_ju_UHFjS9jqhSBDyjpoX1h4hYR60mMt2OiLl4ZsYca9ZObWEd5ljGGf983Jd0OdHmXX_VkFSylckkq3nHRLCfIvGn-g66mxbHOz6Kh4EijZn6qwEeFbMZfHVU7C9vVXkLDyUO-9cpAf93dEr5BvTG-zwyR1F7CQ1RwpRn8evoAtBVZWowBF43jrAvXbjzRXMgE6bAf4iuBO8vdHrTGF1PGCzYglJWQUxGymHDqWKjFkh8Cg3TYD9dooC7CnOj_MqzRlSyVlj-A7FIITxHOWVT5pl4l13n42Ox6oSrAwC37X94T3ZBSPokXCBSWpzQrb3awHw3XR9uhBPcJl1t5v1TpTEv_R0NdvPWEZyw7xZh7VIcPn7ukUA11TstxuUpApagQqo_E-10T_U1wJm40V2LEFEiU11eIWCvpauNmTR-eQUb2w2SE9T3-POzoO42FQjsGnXCT8N-Ksc6M7Ix4x61ALppN3hL2SyMwx40B9yfzJDJpp82v7Dgej9qmgvZUy2QhSHp0ispXPQZcb75RiA0tc_PPHbE7xsousPZeka-P8i-n2JmPByqRKjeJEZMI548a-3AsGMTFQWM23F8l_h8Cv4Or2wgOkEdzd8gJTP9YWQl0MMX0-rQAmmD5oCmahZ7N5aUjhrppFK-7f1HC1sBxEJuKsF9CtkPs-i83r7ltQZ7ZozhtkIOA_I6B3PrPa1O7KQIhMZu5xbf0phFOzBe_mij0iAPmdaSCaPIfbFqyokZtzKlgTdgTmMIa72wKI51ygnpa2_wUOhpFlnAq2-USeq2v6gLZeoPlUJFHrY2BNA2JVlge9YjknhCgNYQJmhAQE90d8QlLcPeGkmVdlLeWPO9_bV8M68EXnlSPDgEqBECAqBEsB-6yaqEVTjcDWaReAzQSvTOapI6cmBg4ZQiVySxhbOV1NVXqyh6Wt4X5sYGehlb-do6CIXMkyWTjfuDL0AaEYCNTPR1xcVt5P-yxZNtABXApDudZjlVNdOuWhTIPzg7ZY6RkacWVSU2q_JDOyqmPyOrPugPxUj8y1euWHUzezZJwuu9MU7Mq2vfS20YffkCxPTVibu4oRkuXvQsS9sbgKofqJMaaFY61uW_SVbNFkWeAXshXzHFEVCkV76dvFY_F9mAnmVWjKAMKF-bp058ZcOw5oTWcmkett107_uH-jXVIcM2BODd7MbhPzm-KdutdrUAu0PQvcwvcIZF1uPLvT4Y5drv8tpbr35Pi-zmfJjHmoDZA4cxMOWUThPf9DDVbbwEb1hj9d8pf_9qt20fvD-MNGD09T8ekiNWAUUOV0l3ynW9pUqjcaw3AU4rZDDVBXuN5wb3YGO0JbzxnuB6cI6agsMCY4YU0WcOX0F-WXKW0x0Xxzu7C5S7HlIDIrqx9hcO0quQXYVqnaK4zjyrUfxSonb67R0lOcZt8crQelS-MPHkmFr75WI-i7dXkIGfeOv8pgTbcJ_UmAw_d4rHVfmPBdxeBdlRoyiBr-Adti1RZNWcwdhEtdqeypB3BdL4bf62ZKqdCoINI_eOMBnXT8dS8-srrdaccLuGgknoHSj2vL962Yb9k5KjXXM6iifdBPXcjl3ccBgIAKH2abYVtDaKVNl0j5vnN7YSpYSWRtytpYWRXwP0qSZ4pD4MVglww4cEwyrKU3liYpbgbJ-mpHj8BA8fuwgEKq-7RPuLFkpfGWJH0zCKcF-2Cm-LkyQA3ehvN1FZI72NQSdwUAfK9ZNt1ILpkx5Gyjo_xIReE5vtgcBHXSsMyAADlfVu9JvDqFvOAo2VvHPbPkgNtyh8nrhC0MqyZyy_Eqt-3uDPl0jdbIAjwrSbcX0aEoj.QlNziCzag45DmuQvWmcKdQ';

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
