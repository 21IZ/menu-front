// src/utils/storage.js
import { kv } from '@vercel/kv';

export async function getMenuItems() {
  return await kv.get('menuItems') || [];
}

export async function setMenuItems(items) {
  await kv.set('menuItems', items);
}

export async function addMenuItem(item) {
  const items = await getMenuItems();
  items.push(item);
  await setMenuItems(items);
}

export async function updateMenuItem(index, updatedItem) {
  const items = await getMenuItems();
  items[index] = updatedItem;
  await setMenuItems(items);
}

export async function deleteMenuItem(index) {
  const items = await getMenuItems();
  items.splice(index, 1);
  await setMenuItems(items);
}