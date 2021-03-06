import puppeteer, { Page } from "puppeteer";
import querystring from "querystring";
import { log } from "../utils/index.js";

import { Vendor } from "../types";
import { Request, Response } from "express";
const vendors = require("../vendors.json");

async function isItemNotAvailable(vendorName: string, page: Page) {
  switch (vendorName) {
    case "The Records Corner":
      const pageParagraphs = await page.$$("p");
      for (const p of pageParagraphs) {
        const pText = await p.getProperty("textContent");
        const pTextValue: string = await pText.jsonValue();
        if (pTextValue.includes("Съжаляваме")) {
          return true;
        }
      }
      return false;
  }
  return false;
}

async function getGenericVendorPricing(
  item: string,
  vendor: Vendor,
  page: Page
) {
  const escapedItemName = querystring.escape(item);
  const { mostExpensive, leastExpensive } = vendor.pricingPages;
  const mostExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${mostExpensive}`;
  const leastExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${leastExpensive}`;

  const getPriceAndLink = async (url: string) => {
    await page.goto(url);

    const isItemMissing = await isItemNotAvailable(vendor.name, page);

    if (isItemMissing) {
      return;
    }

    if (vendor.priceSelector && vendor.itemUrlSelector) {
      const itemContainer = await page.$(vendor.priceSelector);
      const itemPrice = await itemContainer?.getProperty("textContent");
      const itemLink = await page.$(vendor.itemUrlSelector);
      const itemUrl = await itemLink?.getProperty("href");

      return {
        price: await itemPrice?.jsonValue(),
        link: await itemUrl?.jsonValue(),
      };
    }
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

async function getValueYourMusicPricing(
  item: string,
  vendor: Vendor,
  page: Page
) {
  return getGenericVendorPricing(item, vendor, page);
}

async function getEbayPricing(item: string, vendor: Vendor, page: Page) {
  return getGenericVendorPricing(item, vendor, page);
}

async function getTheRecordsCornerPricing(
  item: string,
  vendor: Vendor,
  page: Page
) {
  return getGenericVendorPricing(item, vendor, page);
}

async function getAmazonPricing(item: string, vendor: Vendor, page: Page) {
  const escapedItemName = querystring.escape(item);
  const { mostExpensive, leastExpensive } = vendor.pricingPages;
  const mostExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${mostExpensive}`;
  const leastExpensiveQuery = `${vendor.baseSearchUrl}${escapedItemName}${leastExpensive}`;

  const getPriceAndLink = async (url: string) => {
    await page.goto(url);
    const itemBaseAmountContainer = await page.$("span.a-price-whole");
    const itemBaseAmount = await itemBaseAmountContainer?.getProperty(
      "textContent"
    );
    const priceBaseAmount = await itemBaseAmount?.jsonValue();
    const itemFractionalAmountContainer = await page.$("span.a-price-fraction");
    const itemFractionalAmount =
      await itemFractionalAmountContainer?.getProperty("textContent");
    const priceFractionalAmount: string | undefined =
      await itemFractionalAmount?.jsonValue();
    if (priceBaseAmount && priceFractionalAmount) {
      const price = priceBaseAmount + priceFractionalAmount + " USD";
      const itemLink = await page.$("a.a-link-normal.a-text-normal");
      const itemUrl = await itemLink?.getProperty("href");

      return {
        price,
        link: await itemUrl?.jsonValue(),
      };
    }
  };

  const highestPricedItemData = await getPriceAndLink(mostExpensiveQuery);
  const lowestPricedItemData = await getPriceAndLink(leastExpensiveQuery);

  return {
    vendor: vendor.name,
    highestPrice: highestPricedItemData?.price,
    mostExpensiveItemUrl: highestPricedItemData?.link,
    lowestPrice: lowestPricedItemData?.price,
    leastExpensiveItemUrl: lowestPricedItemData?.link,
  };
}

async function getVendorPrices(item: string, vendor: Vendor, page: Page) {
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

export default async (req: Request, res: Response) => {
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
        if (e instanceof Error) {
          log.error(e.message);
        }
      }
    }

    res.json(prices);
  } catch (e) {
    if (e instanceof Error) {
      log.error(e.message);
    }
  }
};
