import puppeteer from "puppeteer";
import querystring from "querystring";
import { log } from "../utils/index.js";

const vendors = [
  {
    name: "Value Your Music",
    priceSelector: "div.item-basic-info > div > strong",
    itemUrlSelector: "a.wordwrap",
    baseSearchUrl: "https://www.valueyourmusic.com/items?q=",
    pricingPages: {
      mostExpensive: "&sort=price_desc&utf8=✓",
      leastExpensive: "&sort=price_asc&utf8=✓",
    },
  },
  {
    name: "Ebay",
    priceSelector: "span.s-item__price",
    itemUrlSelector: "a.s-item__link",
    baseSearchUrl: "https://www.ebay.co.uk/sch/11233/i.html?_from=R40&_nkw=",
    pricingPages: {
      mostExpensive: "&LH_TitleDesc=0&_sop=3",
      leastExpensive: "&LH_TitleDesc=0&_sop=2",
    },
  },
  {
    name: "The Records Corner",
    priceSelector: "span.prod-price.text-xl",
    itemUrlSelector: "a.prod-title.text-lg",
    baseSearchUrl: "https://www.therecordscorner.com/catalog?q=",
    pricingPages: {
      mostExpensive: "&s=pd",
      leastExpensive: "&s=pa",
    },
  },
  {
    name: "Amazon",
    baseSearchUrl: "https://www.amazon.com/s?k=",
    pricingPages: {
      mostExpensive: "&s=price-desc-rank",
      leastExpensive: "&s=price-asc-rank",
    },
  },
];

async function isItemNotAvailable(vendorName, page) {
  switch (vendorName) {
    case "The Records Corner":
      const pageParagraphs = await page.$$("p");
      for (const p of pageParagraphs) {
        const pText = await p.getProperty("textContent");
        const pTextValue = await pText.jsonValue();
        if (pTextValue.includes("Съжаляваме")) {
          return true;
        }
      }
      return false;
  }
  return false;
}

async function getGenericVendorPricing(item, vendor, page) {
  const escapedItemName = querystring.escape(item);
  const { mostExpensive, leastExpensive } = vendor.pricingPages;
  const mostExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${mostExpensive}`;
  const leastExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${leastExpensive}`;

  const getPriceAndLink = async (url) => {
    await page.goto(url);

    const isItemMissing = await isItemNotAvailable(vendor.name, page);

    if (isItemMissing) {
      return;
    }

    const itemContainer = await page.$(vendor.priceSelector);
    const itemPrice = await itemContainer.getProperty("textContent");
    const itemLink = await page.$(vendor.itemUrlSelector);
    const itemUrl = await itemLink.getProperty("href");

    return {
      price: await itemPrice.jsonValue(),
      link: await itemUrl.jsonValue(),
    };
  };

  const highestPricedItemData = await getPriceAndLink(mostExpensiveQuery);
  const lowestPricedItemData = await getPriceAndLink(leastExpensiveQuery);

  if (!highestPricedItemData || !lowestPricedItemData) {
    return;
  }

  return {
    vendor: vendor.name,
    highestPrice: highestPricedItemData.price,
    mostExpensiveItemUrl: highestPricedItemData.link,
    lowestPrice: lowestPricedItemData.price,
    leastExpensiveItemUrl: lowestPricedItemData.link,
  };
}

async function getValueYourMusicPricing(item, vendor, page) {
  return getGenericVendorPricing(item, vendor, page);
}

async function getEbayPricing(item, vendor, page) {
  return getGenericVendorPricing(item, vendor, page);
}

async function getTheRecordsCornerPricing(item, vendor, page) {
  return getGenericVendorPricing(item, vendor, page);
}

async function getAmazonPricing(item, vendor, page) {
  const escapedItemName = querystring.escape(item);
  const { mostExpensive, leastExpensive } = vendor.pricingPages;
  const mostExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${mostExpensive}`;
  const leastExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${leastExpensive}`;

  const getPriceAndLink = async (url) => {
    await page.goto(url);
    const itemBaseAmountContainer = await page.$("span.a-price-whole");
    const itemBaseAmount = await itemBaseAmountContainer.getProperty(
      "textContent"
    );
    const priceBaseAmount = await itemBaseAmount.jsonValue();
    const itemFractionalAmountContainer = await page.$("span.a-price-fraction");
    const itemFractionalAmount =
      await itemFractionalAmountContainer.getProperty("textContent");
    const priceFractionalAmount = await itemFractionalAmount.jsonValue();
    const price = priceBaseAmount + priceFractionalAmount + " USD";
    const itemLink = await page.$("a.a-link-normal.a-text-normal");
    const itemUrl = await itemLink.getProperty("href");

    return {
      price,
      link: await itemUrl.jsonValue(),
    };
  };

  const highestPricedItemData = await getPriceAndLink(mostExpensiveQuery);
  const lowestPricedItemData = await getPriceAndLink(leastExpensiveQuery);

  return {
    vendor: vendor.name,
    highestPrice: highestPricedItemData.price,
    mostExpensiveItemUrl: highestPricedItemData.link,
    lowestPrice: lowestPricedItemData.price,
    leastExpensiveItemUrl: lowestPricedItemData.link,
  };
}

async function getVendorPrices(item, vendor, page) {
  switch (vendor.name) {
    case "Value Your Music":
      return await getValueYourMusicPricing(item, vendor, page);
    case "Ebay":
      return await getEbayPricing(item, vendor, page);
    case "The Records Corner":
      return await getTheRecordsCornerPricing(item, vendor, page);
    case "Amazon":
      return await getAmazonPricing(item, vendor, page);
  }
}

async function getPage() {
  const args = {
    headless: true,
    args: [
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
    ],
    executablePath: process.env.CHROMIUM_BIN,
  };
  const browser = await puppeteer.launch(args);
  const page = await browser.newPage();
  return page;
}

export default async (req, res) => {
  try {
    const { item } = req.body;
    const page = await getPage();
    const prices = [];

    for (const vendor of vendors) {
      try {
        const vendorPrices = await getVendorPrices(item, vendor, page);
        if (vendorPrices) {
          prices.push(vendorPrices);
        }
      } catch (e) {
        log.error(e);
      }
    }

    res.json(prices);
  } catch (e) {
    log.error(e);
  }
};
