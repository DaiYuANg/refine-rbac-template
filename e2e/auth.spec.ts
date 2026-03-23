import { test, expect } from '@playwright/test'

test.describe('Auth', () => {
  test('login and reach dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/username|用户名/i).fill('admin@example.com')
    await page.getByLabel(/password|密码/i).fill('admin123')
    await page.getByRole('button', { name: /sign in|登录/i }).click()
    await expect(page).toHaveURL(/\//)
    await expect(page.getByText(/welcome to rbac|欢迎使用 rbac/i)).toBeVisible({
      timeout: 10000,
    })
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/users')
    await expect(page).toHaveURL(/\/login/)
  })
})
