/* Shared formatting helpers for the ROCHADE views. */
import { monthLabel } from '../planner.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const icon = (id, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;

export const rooms = (n) => `${String(n).replace('.', ',')} Zi.`;

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const month = (project, i, style) => monthLabel(project, i, style);

export const percent = (i, total) => `${(i / total) * 100}%`;

export const byId = (list) => new Map(list.map((x) => [x.id, x]));

export function householdNeed(h) {
  return `${rooms(h.roomsMin)}${h.stepFree ? ' · hindernisfrei' : ''}`;
}

export function flatLabelOf(project, flatId) {
  if (!flatId) return null;
  const ext = project.external.find((e) => e.id === flatId);
  return ext ? ext.name : `Whg. ${flatId}`;
}
