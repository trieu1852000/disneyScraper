const puppeteer = require('puppeteer');
const fs = require('fs');

// Sleep function using Promise and setTimeout
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performScraping() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    let disneyTitles = [];

    // Read existing data if the file exists
    if (fs.existsSync('disneyTitles.json')) {
        disneyTitles = JSON.parse(fs.readFileSync('disneyTitles.json', 'utf8'));
    }

    const accessToken = 'eyJ6aXAiOiJERUYiLCJraWQiOiJ0Vy10M2ZQUTJEN2Q0YlBWTU1rSkd4dkJlZ0ZXQkdXek5KcFFtOGRJMWYwIiwiY3R5IjoiSldUIiwiZW5jIjoiQzIwUCIsImFsZyI6ImRpciJ9..SbimxtCm-_sXhA8h.jSjq0s0O2Ift6hj0ErN6sPz9KM5ubUfkZATKUkDJFkazExW0FOf20fwZP9unfakVtewmFtw3lUhZMCaCcsBkKgNWAY463s68v75BCG5Qcsk68R_az4CAawaUfFYXY7--gtUjvdtimvHdXBwkkfjhb4jJxdE61MqeWFBZcmXgyF6JN-e28oCKjqHidTm19BUvJLdB13U4ksSgMRgd7ev6QOb7CRnawurAU5Pe_2NdP8_oYZ7uCeVzysgYUaRKMszc_HYMLm-WR725Tei1Y5rwFhJb260LUUNKDQUhaWR_GEcwdgpNbwElOSiW4E6_ZF25uUmYO8p0T6j8XVdX5Ue-q39ANArWIT2XPvpAeix9o962kp61LkC6tmq3SJkIbO7RlO6jAYPGS8UxZOmWwo5pXbv6u4wHcN4rUg67bfADC9PXrENnB6TDvbXak74FJFgNM-yn1Nd7awvIKOk7koP3UxrpKMYzS_AIn_aN1Hi7M8pPIbaK06modUUz5zOVtp0-CL9rZC1JBuyWir43YhQJQhd9agZsjkX7jT5EtNkVQNEgFAfWcQ_rdswfAZSBN84srgbOeq0xmoKzVoBt3WtK2jFBzH-HLC9QVgve96oNVqV5DWhkuK79I0bs7lk8L3G-IGuuKA3CyhvbotKU0I8KeU2vooMXfJ32tPqiCC9YbrMsZ16lD1K37SXNtNi6vxrtgD_HU3_usjaescGcyOdeSBTHmJL9CgQlhDa1T6zyX7FUUifQeg14UfMOti6UNEjV2ihcEIOfXrFUWrse579z0_w_16v_Q-81FKjJrK6ltWuUZgxaguIckp2A8NrUvTm7Q9pwP5XhrIK4414yVqgOvJOo82hQ5zaPqDRX4pMMltYLdLXsmKNQ_BbfdefRb0ttTstebULsDez16FK63OAWyTxiXLFiKNnT9za3GIz095lRv_caPp7VRpxiDj4_32mUUuhYZeYUgf_QaSv9YgiUlmu67wkWUGRKzmg1aTUeax_09ySdq2HYl80TCIq4XT4Bs9hkVjg2UJGGVT_o26m-dJUlHICW-F_IJ7xG6TUmQoXnscSBg0v9WHAe5gJQWHtMgHOALuMia_GX6SitZkiavyQjbd4lkJpeKaU5bgvRTWNz0GA3b6BaKp2YG4pT1s1aCGB2bYLtFZ8JL9y--seakbqA4oPMmrGLE28jl8sM6E_Y7L3JHgL0t5vfQkMwc-JQ6bW2aOZv6dvgqZuQdMiQO-L8xwPb7n8q-ZlH-neRFxju8syTyOnosnbIv8_8tqonFFof9HgOhNwCVz2Ht9iERxu9BYZoXLM7xMXq13C6HcugNcODJRBmTws7D_y47OL32N0wWi4XQblmzN-Scz_YAvmZZz8s03_3WyPQRkPP4jvgOUcDfSqH9jbmckTC_ZPnLYPisvM4CTJbcjhL9zcZTA-F3_GLTmEoS8Vd56ZeprsEbDezKdsw3q9Fhj-A7CV5AYap5UJ6O414Mjet4JtuFS557tkCoy9P0dtU-FnKTOay94eiz6wmhQn2zexeq5ymUZRNqdL33bWwm9qkhcKtbyPVvjxmPBA0fwCIE0b6KAyaiNpRZTWO98oGuI0pXsj_KXvtI07HXTGPxABdLTfaUra9AmR22qD38QZvKiUR_vfJJHRTUaZniW78R1zF_xMuUAxCJwTQZUH4TPAXnkNapE427794Vgda8dINkIE0pfuw_AYQkyt0CWxwDr-ojAyYrR5w9S7GXAHxLigq-YD0x_cKQsH3kVdKJzNNZCJWaJg41OYRmuQVcxeXyHWqcJKTPEB-QjMNLh4EVJwSH0acbQxbdT8JIyE01H2q2uaxjDboH1mJFJjl6b7LcfsB5eB7YX5J1xoMphp0fCkuKwV97QixaJUKb2ypSPQ0LvlqSeU2GT1WBZn7xWvOfXH_055TdxpWK1Nuy2_RO4HkuVzpLasGrOC9VEzVHSARidvk8dWrbNB2ePijTLqMuTnLSEMnhxfYVPl5eOLYFtrG8PxvwdlnOoQKzX7l-FpIljApsZs8U62GOoxymB0G2yoIC6kRCu4_RlHqRhSfvDVHvmHBFuro5E1ot6KsB9jqWZjYGHVzRima7JxhOkTWaFHSbOMK0d29vTOKf5PJHaBMd-AepHw3Rj7NY1Vi2U8ntS40rCvrj_ogUPlmriy9MKgbPsjdS1aAladanuV6uyQN-eexUePcyUvkT6-w6vCbGzIuO2XfIBgOou4drSzOBw-npgfoYQ9PU4a2ohQ6qz3COy6W0R4Ze_mhQbA1YIkxs5l8mgezTskLDYj-O7odZLxSfTU2eUXpfFFZjxLGG7qUU7ADkGsUvdL1yJh1IBhfRMLQPrJ43eaJn_CEFam4Ok1_TG2OIwM1E5ILv3pwEZ-46NWjnyO2vLtRE7AwqwyEaY2wjPcqP6Vqo03DDGND2ZjyY7mfhgBKLzCOyk50FmQoYed-3tQoLlvOzDpC-12wFAqJbM2I30z259NbJo2R0N4PdFqhwfAJvW0YgU42-KmIkXrsMhgxJq6wv4pkjPoyYBguuCdhzgWbb3t7aBZi2GkD0rOi84OwLeE_O-13vwtmPGdehTNDrf-8MEVxfBYZek-nMTaIE9MBz9iSkcJam_eGebPtt0WHKrtguoHvXuPMfKBsiD0I0ZrEr34ltc3B7vHNQUYjn6PzE4p9epp_awZ0CvvI6DLdJYV9IcEUiQp-YGAB57oSI0IY4dZZuqQHmL9TsIB8YiJF1NNg0o8CmhGvbcW883MxiynHs-FpbuqyveDIeXOVV9lEHRR3VLY5AvcFYIY0lp3NVInwgG84ce5KcCb1lY3-xY8M4OqymQRn0V2z3rDPDq4HVxf_u39I-MwNBHcjRhqu82apTKesbqXrJjCSeHEiA2PNI47s435KYzXFiMzDB3Z_bbfyH2N-f_uIELYvR8Zw1RTYSN9-OJRNLB_l3jvzMVafwcY3wyVLXvbPXHOXhAYlY5XpozluiLPQUEyRGxtHzaN8DUlKZ7GCyuM5i4Vznv3tR_5gYTO5xFXK7hrHnGQRe0cYb7pqXfGjbEnVD6ax5x5VsQTWJP83eMMOVIY1VoIMTDHaAnGao_rcuHFQpUxJAzMzZT0ywat7jmQmg5iYYT5V1dAJdG9XrIDHO9mSyGhsWfiaDM8PIt8I83y5pykVq-uGbipT-08BxBJg0JfhZJWP5UwzoCHHq2giOI9v0ctazpCvD73fu43m6mAjsOL8IClJW69wMXrXBUFXbX7HULL0rMVmTAdcB2Ax5J0jKY-vBiDqctKAKkWnYmaRpGRPta-y2gwj7Tv5Rz1c0ZEKK-abjqIGOyHZedZ4HVpSIVsc9mIkSjba-P-2WsO9kHcy-Z3BsfXSYqGhDjWfY5XGaHwNT-HyiCZY2QCFByjzvUb5dRyxZJFafvFdfGt4X97e1pIoooqLKNIpNwi9alOHfj9urq0gWoIbSb1t06FOQ90B7sQEOD6kxF3EYLZca4aWZusIvCfLlw3ieqlZ5phjJmHfKmt6mjrPiNiXOG-I2JHKn2OjvZJU8Ey6FEiklHkqx-1S36qcPmtEBdtIiqpgAoz3vTIN0aiqe362vVQptiFCfEMOmLlRvS3kj40epvMhPaq-6eQe_qg52g6t-22z4QFcrsbWzILq4XOCxur9ZY_hDCF-Xv50D4iB32gpvuI7JxhN1LP1cmjWnfofL1SO4NcHH6YWy5_8bSBUUeeegG6z1PbGRrE8HeGrd7N1K1l4ff8rMWVcoG1gw-_8mnN5Nzl0_lE96LtjLHftZhBmpbs6COTIRMEVa9YSaVNJuYea7X8eQuUGXQ0vIh0q01U-LXpGS_gLl8UWPuDQTYAB6UvYwgCz1ITtaLMgOvenSaAVx1LHApYba1yDgRtt98nf8yXoNVuJ0TqT-j66EpKO9VmwrGRanmMX5bODundQM97CBQloF3PYkl8Pic0Z3KHeaV4xwUGYfZBVN7HGy-foyi0_SikZs1XntJWfh0hhVQ98a79T3aySDsYjSuWVLUfC5z1lfVpR10iQqf8zRmKy5t5RUwGDwiaQXX7LcbQSpzhmPk8vaClVziRTOb1YRs-Y4KlmC4PfFzP75drFHyHdW7zCpKRGhXlvG649pWJlK8A-At1QJlZmmd5zcSO1.3Id6vceQ-Ew9GXpkFtof0w'; // Ensure this is your actual token

    try {
        //write down how many page you want in here
        for (let pageNum = 1; pageNum <= 4; pageNum++) {
            const pageUrl = `https://disney.content.edge.bamgrid.com/svc/content/GenericSet/version/6.1/region/US/audience/k-false,l-true/maturity/1830/language/en/setId/9f7c38e5-41c3-47b4-b99e-b5b3d2eb95d4/pageSize/30/page/${pageNum}`;

            await page.setExtraHTTPHeaders({
                'Authorization': `Bearer ${accessToken}`
            });

            const response = await page.goto(pageUrl, { waitUntil: 'networkidle0' });
            const data = await response.json();

            if (data && data.data && data.data.GenericSet && data.data.GenericSet.items) {
                const items = data.data.GenericSet.items;
                items.forEach(item => {
                    disneyTitles.push({ "internalTitle": item.internalTitle });
                    console.log(item.internalTitle); // Print each title as it's found
                });
            } else {
                console.error("Unexpected data structure:", data);
            }

            await sleep(5000); // Delay for 5 seconds before the next iteration
        }

        fs.writeFileSync('disneyTitles.json', JSON.stringify(disneyTitles, null, 2)); // Write the combined data to the file
        console.log('Disney titles have been extracted and saved.');
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await browser.close();
    }
}

performScraping();
