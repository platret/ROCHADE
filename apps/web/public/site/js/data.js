/* Fictional demo data for the ROCHADE prototype.
   Siedlung Brunnenwiese: three buildings from the 1960s/70s, 33 apartments, 24 households,
   9 apartments deliberately kept vacant before the renovation, 2 external replacement flats.
   Names and addresses are invented. */

import { scheduleProject } from './schedule.js';

/* All three buildings are renovated; the order of this list is the order of the Etappen. */
const buildings = [
  { id: 'A', name: 'Haus A', street: 'Brunnenwiesstrasse 4', built: 1962, lift: false, renovate: true },
  { id: 'B', name: 'Haus B', street: 'Brunnenwiesstrasse 6', built: 1964, lift: false, renovate: true },
  { id: 'C', name: 'Haus C', street: 'Brunnenwiesstrasse 8', built: 1975, lift: true, renovate: true },
];

/* floor 0 = Parterre. Without a lift only the Parterre is step-free. */
const layout = [
  { no: '01', floor: 0, rooms: 2.5 }, { no: '02', floor: 0, rooms: 3.5 }, { no: '03', floor: 0, rooms: 4.5 },
  { no: '11', floor: 1, rooms: 2.5 }, { no: '12', floor: 1, rooms: 3.5 }, { no: '13', floor: 1, rooms: 4.5 },
  { no: '21', floor: 2, rooms: 2.5 }, { no: '22', floor: 2, rooms: 3.5 }, { no: '23', floor: 2, rooms: 4.5 },
  { no: '31', floor: 3, rooms: 3.5 }, { no: '32', floor: 3, rooms: 4.5 },
];

const apartments = buildings.flatMap((b) =>
  layout.map((l) => ({
    id: `${b.id}-${l.no}`,
    building: b.id,
    floor: l.floor,
    rooms: l.rooms,
    stepFree: b.lift || l.floor === 0,
  }))
);

/* Replacement flats outside the Siedlung, owned by the cooperative, available for the whole project.
   availableTo is exclusive; Infinity means open-ended. */
const external = [
  { id: 'E-1', name: 'Rotbuchstrasse 12, 2. OG', rooms: 3.5, stepFree: true, availableFrom: 0, availableTo: Number.POSITIVE_INFINITY },
  { id: 'E-2', name: 'Hönggerstrasse 41, 1. OG', rooms: 4.5, stepFree: false, availableFrom: 0, availableTo: Number.POSITIVE_INFINITY },
];

/* Households: 8 per building, in 02, 03, 11, 12, 13, 21, 23, 31. 01, 22 and 32 are vacant. */
const households = [
  { id: 'H01', name: 'Frau Meier', short: 'Meier', apartment: 'A-02', persons: 1, roomsMin: 2.5, stepFree: true, note: 'Rollator, seit 1994 im Haus' },
  { id: 'H02', name: 'Fam. Keller', short: 'Keller', apartment: 'A-03', persons: 4, roomsMin: 4.5, stepFree: false, note: 'Zwei Kinder, Schulkreis Waidberg' },
  { id: 'H03', name: 'Hr. Aydin', short: 'Aydin', apartment: 'A-11', persons: 1, roomsMin: 2.5, stepFree: false, note: 'Schichtarbeit' },
  { id: 'H04', name: 'Fam. Nguyen', short: 'Nguyen', apartment: 'A-12', persons: 2, roomsMin: 3.5, stepFree: false, note: 'Homeoffice' },
  { id: 'H05', name: 'Fam. Rossi', short: 'Rossi', apartment: 'A-13', persons: 5, roomsMin: 4.5, stepFree: false, note: 'Drei Kinder' },
  { id: 'H06', name: 'Frau Novak', short: 'Novak', apartment: 'A-21', persons: 1, roomsMin: 2.5, stepFree: false, note: 'Studentin' },
  { id: 'H07', name: 'Fam. Oliveira', short: 'Oliveira', apartment: 'A-23', persons: 3, roomsMin: 3.5, stepFree: false, note: 'Kind im Kindergarten' },
  { id: 'H08', name: 'Hr. und Frau Steiner', short: 'Steiner', apartment: 'A-31', persons: 2, roomsMin: 3.5, stepFree: false, note: 'Pensioniert' },

  { id: 'H09', name: 'Hr. Brunner', short: 'Brunner', apartment: 'B-02', persons: 1, roomsMin: 2.5, stepFree: true, note: 'Spitex dreimal pro Woche' },
  { id: 'H10', name: 'Fam. Demir', short: 'Demir', apartment: 'B-03', persons: 4, roomsMin: 4.5, stepFree: false, note: 'Zwei Kinder' },
  { id: 'H11', name: 'Frau Huber', short: 'Huber', apartment: 'B-11', persons: 1, roomsMin: 2.5, stepFree: false, note: '' },
  { id: 'H12', name: 'Hr. Caduff', short: 'Caduff', apartment: 'B-12', persons: 2, roomsMin: 3.5, stepFree: false, note: 'Musiker, Proberaum im Keller' },
  { id: 'H13', name: 'Fam. Schmid', short: 'Schmid', apartment: 'B-13', persons: 4, roomsMin: 4.5, stepFree: false, note: 'Zwei Kinder, Schulkreis Waidberg' },
  { id: 'H14', name: 'Hr. Fischer', short: 'Fischer', apartment: 'B-21', persons: 1, roomsMin: 2.5, stepFree: false, note: '' },
  { id: 'H15', name: 'Fam. Haddad', short: 'Haddad', apartment: 'B-23', persons: 3, roomsMin: 3.5, stepFree: false, note: 'Ein Kind' },
  { id: 'H16', name: 'Frau Zimmermann', short: 'Zimmermann', apartment: 'B-31', persons: 2, roomsMin: 3.5, stepFree: true, note: 'Rollstuhl, braucht Lift oder Parterre' },

  { id: 'H17', name: 'Frau Gasser', short: 'Gasser', apartment: 'C-02', persons: 1, roomsMin: 2.5, stepFree: true, note: 'Hüftoperation 2026' },
  { id: 'H18', name: 'Fam. Petrov', short: 'Petrov', apartment: 'C-03', persons: 4, roomsMin: 4.5, stepFree: false, note: 'Zwei Kinder' },
  { id: 'H19', name: 'Hr. Rahimi', short: 'Rahimi', apartment: 'C-11', persons: 1, roomsMin: 2.5, stepFree: false, note: '' },
  { id: 'H20', name: 'Fam. Kunz', short: 'Kunz', apartment: 'C-12', persons: 2, roomsMin: 3.5, stepFree: false, note: 'Erwarten ein Kind' },
  { id: 'H21', name: 'Fam. Weber', short: 'Weber', apartment: 'C-13', persons: 5, roomsMin: 4.5, stepFree: false, note: 'Drei Kinder' },
  { id: 'H22', name: 'WG Lutz und Brändli', short: 'WG Lutz', apartment: 'C-21', persons: 2, roomsMin: 2.5, stepFree: false, note: 'Wohngemeinschaft' },
  { id: 'H23', name: 'Fam. Ammann', short: 'Ammann', apartment: 'C-23', persons: 3, roomsMin: 3.5, stepFree: false, note: 'Ein Kind' },
  { id: 'H24', name: 'Frau Bosshard', short: 'Bosshard', apartment: 'C-31', persons: 1, roomsMin: 3.5, stepFree: false, note: 'Pflegt die Mutter im Quartier' },
];

/* The Etappen are not entered by hand: scheduleProject derives them from the buildings
   (Etappe 1 Haus A months 0–5, Etappe 2 Haus B 6–11, Etappe 3 Haus C 12–17, 20 months in total). */
export const PROJECT = Object.freeze(scheduleProject({
  name: 'Siedlung Brunnenwiese',
  owner: 'Baugenossenschaft Brunnenwiese (fiktiv)',
  timeline: { startYear: 2027, startMonth: 4 },
  buildings,
  apartments,
  external,
  households,
}));
