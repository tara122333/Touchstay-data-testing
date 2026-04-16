import puppeteer, { Browser, HTTPResponse } from 'puppeteer';

export const fetchTouchStayGuideResponse = async (
  touchStayGuidebookUrl: string,
): Promise<unknown | null> => {
  if (!touchStayGuidebookUrl) {
    throw new Error('touchStayGuidebookUrl is required');
  }

  let browser: Browser | null = null;
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

    const timeoutMs = 3 * 60 * 1000;

    let resolveResponse!: (value: unknown) => void;
    let rejectResponse!: (reason?: unknown) => void;
    const capturedResponse = new Promise<unknown>((resolve, reject) => {
      resolveResponse = resolve;
      rejectResponse = reject;
    });

    const timeoutHandle = setTimeout(() => {
      rejectResponse(new Error('Timed out waiting for TouchStay v2api response'));
    }, timeoutMs);

    const onResponse = async (response: HTTPResponse): Promise<void> => {
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
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`fetchTouchStayGuideResponse: failed parsing response ${message}`);
      }
    };

    page.on('response', (response: HTTPResponse) => {
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
    return null;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        const message = closeErr instanceof Error ? closeErr.message : String(closeErr);
        throw new Error(`fetchTouchStayGuideResponse: failed closing browser ${message}, Error: ${JSON.stringify(closeErr)}`);
      }
    }
  }
};
