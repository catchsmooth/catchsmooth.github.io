import { test, expect } from '@playwright/test';
const routes = [
  '/',
  '/tools/',
  '/guides/',
  '/guides/ai-coding/',
  '/guides/agent-mcp/',
  '/guides/first-ai-app/',
  '/projects/',
  '/projects/saas-membership/',
  '/projects/smart-home-app/',
  '/projects/smart-health/',
  '/projects/o2o-service/',
  '/notes/',
  '/life/',
  '/about/',
  '/404.html',
];
test('页面、资源与各尺寸排版', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(async () => {
        for (const img of document.images) {
          img.loading = 'eager';
        }
        await Promise.all(
          [...document.images]
            .filter((img) => img.hasAttribute('src'))
            .map((img) => img.decode()),
        );
        await document.fonts.ready;
        await Promise.all(
          document.getAnimations().map((animation) => animation.finished),
        );
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `.local/screens/${width}-${route.replaceAll('/', '_') || 'home'}.png`,
        fullPage: true,
      });
    }
  }
  expect(errors).toEqual([]);
});
test('筛选、菜单、灯箱、音乐与剪贴板', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/projects/');
  await page.getByRole('button', { name: 'App', exact: true }).click();
  await expect(page.locator('.project-row:visible')).toHaveCount(2);
  await page.getByRole('button', { name: '可视化', exact: true }).click();
  await expect(page.locator('.project-row:visible')).toHaveCount(1);
  await page.getByRole('button', { name: '全部', exact: true }).click();
  await expect(page.locator('.project-row:visible')).toHaveCount(4);
  await page.getByRole('button', { name: '复制邮箱' }).click();
  await expect(page.getByRole('status').last()).toHaveText('邮箱已复制');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: '菜单' }).click();
  await expect(page.locator('#main-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#main-nav')).not.toBeVisible();
  await page.goto('/life/');
  const first = page.locator('.photo-open').first();
  await first.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(first).toBeFocused();
  expect(
    await page
      .locator('audio')
      .evaluate((audio: HTMLAudioElement) => audio.paused),
  ).toBe(true);
  await page.locator('audio').evaluate(async (audio: HTMLAudioElement) => {
    audio.muted = true;
    await audio.play();
  });
  await expect
    .poll(() =>
      page
        .locator('audio')
        .evaluate((audio: HTMLAudioElement) => audio.currentTime),
    )
    .toBeGreaterThan(0);
  await page
    .locator('audio')
    .evaluate((audio: HTMLAudioElement) => audio.pause());
});
test('无 JavaScript 正文与链接可用', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#main-nav')).toBeVisible();
  await page.goto('/tools/?q=MCP');
  await expect(page.locator('[data-resource]')).toHaveCount(24);
  await expect(page.locator('.catalog-controls')).not.toBeVisible();
  await page.getByRole('link', { name: 'Agent 与 MCP ↓' }).click();
  await expect(page).toHaveURL(/#agents$/);
  await expect(page.locator('#agents h2')).toBeVisible();
  await page.goto('/projects/');
  await expect(page.locator('.project-row')).toHaveCount(4);
  await page.locator('.project-copy h3 a').first().click();
  await page.reload();
  await expect(page.locator('.prose')).toContainText('项目背景');
  await context.close();
});
test('减少动态效果', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(
    await page
      .locator('.ai-hero')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
});

test('资源搜索、分类、刷新与历史恢复', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('mCp');
  await page.getByRole('button', { name: '查找资源' }).click();
  await expect(page).toHaveURL(/q=mCp/);
  await expect(page.locator('[data-resource]:visible')).toHaveCount(3);
  await page
    .getByRole('button', { name: 'Agent 与 MCP 4', exact: true })
    .click();
  await expect(page).toHaveURL(/category=agents/);
  await page.reload();
  await expect(page.getByRole('searchbox')).toHaveValue('mCp');
  await expect(page.locator('[data-resource]:visible')).toHaveCount(3);
  await page.getByRole('button', { name: 'AI 编程 4', exact: true }).click();
  await expect(page.locator('.catalog-empty')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-resource]:visible')).toHaveCount(3);
  await page.goForward();
  await expect(page.locator('.catalog-empty')).toBeVisible();
  await page.getByRole('button', { name: '查看全部资源', exact: true }).click();
  await expect(page.locator('[data-resource]:visible')).toHaveCount(24);
  await expect(page).toHaveURL(/\/tools\/$/);
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.getByRole('searchbox').fill('代码审查');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  await expect(page.locator('[data-resource]:visible')).toHaveCount(2);
  await page.reload();
  await expect(page.getByRole('searchbox')).toHaveValue('代码审查');
  await page.getByRole('button', { name: '清空筛选' }).click();
  await page.getByRole('searchbox').fill('  tYpEsCrIpT  ');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  await expect(page.locator('[data-resource]:visible')).toHaveCount(2);
  await page.goto('/tools/?category=unknown&q=Ollama');
  await expect(page.locator('[data-resource]:visible')).toHaveCount(1);
  await expect(page.locator('[data-category="all"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('目录与专题内部链接有效，旧资源可访问', async ({ page, request }) => {
  const links = new Set<string>();
  for (const route of [
    '/',
    '/tools/',
    '/guides/',
    '/about/',
    '/guides/agent-mcp/',
  ]) {
    await page.goto(route);
    (
      await page
        .locator('a[href^="/"]')
        .evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
    ).forEach((href) => links.add(href));
  }
  for (const link of links)
    expect((await request.get(link)).ok(), link).toBe(true);
  for (const path of [
    '/img/3.jpg',
    '/img/bg.jpg',
    '/img/love1.jpg',
    '/img/love2.jpg',
    '/img/love3.jpg',
    '/img/name.png',
    '/img/password.png',
    '/img/海贼王.jpg',
    '/media/林俊杰 - 醉赤壁.mp3',
    '/logo.ico',
    '/social.png',
  ])
    expect((await request.get(path)).ok(), path).toBe(true);
});
