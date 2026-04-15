const puppeteer = require('puppeteer');

const fetchTouchStayGuideResponse = async (
  touchStayGuidebookUrl,
) => {
  if (!touchStayGuidebookUrl) {
    throw new Error('touchStayGuidebookUrl is required');
  }

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await page.setViewport({ width: 1280, height: 800 });

    const timeoutMs = 2 * 60 * 1000; // 2 minutes timeout

    let resolveResponse;
    let rejectResponse;
    const capturedResponse = new Promise((resolve, reject) => {
      resolveResponse = resolve;
      rejectResponse = reject;
    });

    const timeoutHandle = setTimeout(() => {
      rejectResponse(new Error('Timed out waiting for TouchStay v2api response'));
    }, timeoutMs);

    const onResponse = async (response) => {
      try {
        const url = response.url();
        if (
          url.includes('/v2api/wb/guide/')
          && response.request().method() === 'GET'
          && response.status() === 200
        ) {
          const json = await response.json();
          resolveResponse(json);
        }
      } catch (err) {
        console.error(`fetchTouchStayGuideResponse: failed parsing response ${err?.message}`);
      }
    };

    page.on('response', (response) => {
      onResponse(response).catch(() => undefined);
    });

    try {
      await page.goto(touchStayGuidebookUrl, {
        waitUntil: 'networkidle2',
        timeout: timeoutMs,
      });
      const data = await capturedResponse;
      return data;
    } finally {
      clearTimeout(timeoutHandle);
    }
  } catch (error) {
    console.error(
      `fetchTouchStayGuideResponse failed for url=${touchStayGuidebookUrl}: ${(error)?.message}`,
    );
    return null;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error(`fetchTouchStayGuideResponse: failed closing browser ${(closeErr)?.message}, Error: ${JSON.stringify(closeErr)}`);
      }
    }
  }
}

module.exports={fetchTouchStayGuideResponse}
