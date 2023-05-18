const scrapes = require("./scraper");
const scrapeController = async (browserInstance) => {
  const url =
    "https://thuedientu.gdt.gov.vn/etaxnnt/Request?&dse_sessionId=b9jRCiuBvWI_9vlPlKqyFKg&dse_applicationId=-1&dse_pageId=2&dse_operationName=corpIndexProc&dse_errorPage=error_page.jsp&dse_processorState=initial&dse_nextEventName=start";
  try {
    let browser = await browserInstance;
    let categories = scrapes.scrapeCategory(browser, url);
  } catch (error) {
    console.log("Lỗi ở scrape controller: " + error);
  }
};

module.exports = scrapeController;
