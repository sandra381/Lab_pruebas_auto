// ══════════════════════════════════════════════════════════════
// SPVR — Pruebas Automáticas de Interfaz Gráfica
// URL base: http://localhost:3000
//
// Credenciales demo:
//   Analista:       ana@spvr.com     / spvr2026
//   Administrador:  admin@spvr.com   / spvr2026
//   Vendedor:       juan@spvr.com    / spvr2026
//   Contraseña mala para probar error: "clave_incorrecta"
// ══════════════════════════════════════════════════════════════

import { test, expect } from '@playwright/test';
import fs from 'fs';

if (!fs.existsSync('evidencias')) {
  fs.mkdirSync('evidencias');
}

// ──────────────────────────────────────────────────────────────
// EP-01: Login exitoso como Analista
// ──────────────────────────────────────────────────────────────
test('EP-01 | Login exitoso como Analista', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Iniciar Sesión')).toBeVisible();

  await page.getByPlaceholder('ejemplo@empresa.com').fill('ana@spvr.com');
  await page.getByPlaceholder('••••••••').fill('spvr2026');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await expect(page.getByText('SPVR')).toBeVisible();
  await expect(page.getByText('Dashboard')).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-01-login-exitoso.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-02: Login fallido — contraseña incorrecta
// ──────────────────────────────────────────────────────────────
test('EP-02 | Login fallido — contraseña incorrecta', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('ejemplo@empresa.com').fill('ana@spvr.com');
  await page.getByPlaceholder('••••••••').fill('clave_incorrecta');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await expect(page.getByText('Correo o contraseña incorrectos.')).toBeVisible();
  await expect(page.getByText('Iniciar Sesión')).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-02-login-fallido-password.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-03: Login fallido — campos vacíos
// ──────────────────────────────────────────────────────────────
test('EP-03 | Login fallido — campos vacíos', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Ingresar' }).click();

  await expect(page.getByText('Ingresa tu correo y contraseña.')).toBeVisible();
  await expect(page.getByText('Iniciar Sesión')).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-03-login-fallido-campos-vacios.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-04: Logout — cierra sesión y regresa al login
// ──────────────────────────────────────────────────────────────
test('EP-04 | Logout — cierra sesión y regresa al login', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('ejemplo@empresa.com').fill('ana@spvr.com');
  await page.getByPlaceholder('••••••••').fill('spvr2026');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await expect(page.getByText('SPVR')).toBeVisible();

  await page.getByRole('button', { name: /cerrar sesión|salir|logout/i }).click();

  await expect(page.getByText('Iniciar Sesión')).toBeVisible();

  const token = await page.evaluate(() => localStorage.getItem('spvr_token'));
  const user  = await page.evaluate(() => localStorage.getItem('spvr_user'));
  expect(token).toBeNull();
  expect(user).toBeNull();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-04-logout.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-05: Ruta protegida — sin sesión muestra login
// ──────────────────────────────────────────────────────────────
test('EP-05 | Ruta protegida — sin sesión muestra login', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Iniciar Sesión')).toBeVisible();
  await expect(page.getByText('Cargar CSV')).not.toBeVisible();
  await expect(page.getByText('Historial')).not.toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-05-ruta-protegida.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-06: Dashboard Analista — muestra lista de jobs
// ──────────────────────────────────────────────────────────────
test('EP-06 | Dashboard Analista — muestra lista de jobs', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('ejemplo@empresa.com').fill('ana@spvr.com');
  await page.getByPlaceholder('••••••••').fill('spvr2026');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await expect(page.getByText('Mis trabajos recientes')).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-06-dashboard-jobs.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-07: Navegación — ir a Cargar CSV desde el sidebar
// ──────────────────────────────────────────────────────────────
test('EP-07 | Navegación — ir a Cargar CSV desde el sidebar', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('ejemplo@empresa.com').fill('ana@spvr.com');
  await page.getByPlaceholder('••••••••').fill('spvr2026');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: /cargar csv/i }).click();

  await expect(page.getByText('Cargar archivo CSV de ventas')).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-07-cargar-csv.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-08: Upload — rechaza CSV con columnas incorrectas
// ──────────────────────────────────────────────────────────────
test('EP-08 | Upload — rechaza CSV con columnas incorrectas', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('ejemplo@empresa.com').fill('ana@spvr.com');
  await page.getByPlaceholder('••••••••').fill('spvr2026');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: /cargar csv/i }).click();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'datos_malos.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('nombre,apellido,edad\nJuan,Pérez,30'),
  });

  await page.getByRole('button', { name: /procesar/i }).click();

  await expect(page.getByText(/columnas faltantes/i)).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-08-upload-columnas-incorrectas.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-09: Historial — muestra reportes anteriores
// ──────────────────────────────────────────────────────────────
test('EP-09 | Historial — muestra reportes anteriores', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('ejemplo@empresa.com').fill('ana@spvr.com');
  await page.getByPlaceholder('••••••••').fill('spvr2026');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: '🕐 Historial' }).click();

  await expect(page.getByText('Historial de Reportes')).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-09-historial.png', fullPage: true });
});

// ──────────────────────────────────────────────────────────────
// EP-10: Control de roles — Admin ve Registro de Errores
// ──────────────────────────────────────────────────────────────
test('EP-10 | Control de roles — Admin ve Registro de Errores', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('ejemplo@empresa.com').fill('admin@spvr.com');
  await page.getByPlaceholder('••••••••').fill('spvr2026');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1000);

  await expect(page.getByRole('button', { name: /registro errores/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /cargar csv/i })).not.toBeVisible();

  await page.getByRole('button', { name: /registro errores/i }).click();

  await expect(page.getByText(/ERR-|error de validación|fallo/i)).toBeVisible();

  await page.waitForTimeout(800);
  await page.screenshot({ path: 'evidencias/EP-10-admin-registro-errores.png', fullPage: true });
});