import { test, expect } from '@playwright/test'

test.describe('RBAC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/username|用户名/i).fill('admin@example.com')
    await page.getByLabel(/password|密码/i).fill('admin123')
    await page.getByRole('button', { name: /sign in|登录/i }).click()
    await expect(page).toHaveURL(/\//)
    await expect(page.getByText(/welcome to rbac|欢迎使用 rbac/i)).toBeVisible({
      timeout: 10000,
    })
  })

  test('sidebar shows users and roles menu items', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /users|用户/i }).first()
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /roles|角色/i }).first()
    ).toBeVisible()
  })

  test('can navigate to users list', async ({ page }) => {
    await page
      .getByRole('link', { name: /users|用户/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/users/)
    await expect(
      page.getByRole('heading', { name: /users|用户/i })
    ).toBeVisible({ timeout: 5000 })
  })
})
