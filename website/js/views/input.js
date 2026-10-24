/* Erfassen view: what the cooperative enters. Buildings with flats, households with their needs, external flats. */
import { esc, rooms as roomsLabel, month } from './format.js';
import { vacantApartments } from '../edit.js';

const sizeOptions = (sel) => [2.5, 3.5, 4.5].map((r) => `<option value="${r}" ${r === sel ? 'selected' : ''}>${roomsLabel(r)}</option>`).join('');
const monthOptions = (project, sel) => Array.from({ length: project.timeline.months }, (_, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${esc(month(project, i, 'short'))}</option>`).join('');

export function renderInput(project) {
  const occupied = new Map(project.households.map((h) => [h.apartment, h]));
  const vacant = vacantApartments(project);
  const floorLabel = (f) => (f === 0 ? 'Parterre' : `${f}. OG`);

  const buildingRows = project.buildings.map((b) => {
    const apts = project.apartments.filter((a) => a.building === b.id);
    const hh = apts.filter((a) => occupied.has(a.id)).length;
    const phase = project.phases.find((p) => p.building === b.id);
    return `<tr>
      <th scope="row"><b>${esc(b.name)}</b>${b.street ? `<small>${esc(b.street)}</small>` : ''}</th>
      <td>${apts.length} Wohnungen</td>
      <td>${hh} Haushalte · <b>${apts.length - hh} frei</b></td>
      <td><label class="check"><input type="checkbox" data-lift="${b.id}" ${b.lift ? 'checked' : ''}> Lift</label></td>
      <td>${phase ? `<span class="badge">${esc(phase.name)} · Sanierung</span>` : '<span class="badge badge-ok">Ausweichflächen</span>'}</td>
      <td class="inp-actions">${phase ? '' : `<button type="button" class="btn btn-sm" data-remove-building="${b.id}">Entfernen</button>`}</td>
    </tr>`;
  }).join('');

  const householdRows = project.households.map((h) => `<tr>
      <th scope="row"><b>${esc(h.name)}</b>${h.note ? `<small>${esc(h.note)}</small>` : ''}</th>
      <td class="data">${esc(h.apartment)}</td>
      <td>${h.persons} ${h.persons === 1 ? 'Person' : 'Personen'}</td>
      <td>${roomsLabel(h.roomsMin)}${h.stepFree ? ' · hindernisfrei' : ''}</td>
      <td class="inp-actions"><button type="button" class="btn btn-sm" data-remove-household="${h.id}" aria-label="${esc(h.name)} entfernen">Entfernen</button></td>
    </tr>`).join('');

  const externalRows = project.external.map((e) => `<tr>
      <th scope="row"><b>${esc(e.name)}</b></th>
      <td>${roomsLabel(e.rooms)}${e.stepFree ? ' · hindernisfrei' : ''}</td>
      <td class="data">${esc(month(project, e.availableFrom, 'short'))} bis ${esc(month(project, Math.min(e.availableTo, project.timeline.months) - 1, 'short'))}</td>
      <td class="inp-actions"><button type="button" class="btn btn-sm" data-remove-external="${e.id}" aria-label="${esc(e.name)} entfernen">Entfernen</button></td>
    </tr>`).join('');

  const apartmentOptions = vacant.map((a) => `<option value="${a.id}">${esc(a.id)} · ${roomsLabel(a.rooms)} · ${floorLabel(a.floor)}${a.stepFree ? ' · hindernisfrei' : ''}</option>`).join('');

  return `<div class="inp">
    <p class="inp-lead">Das ist alles, was ROCHADE braucht. Jede Änderung hier rechnet den Plan sofort neu; die Ansichten «Zeitplan», «Gebäude» und «Haushalte» zeigen das Ergebnis.</p>

    <section class="inp-block" aria-labelledby="inp-buildings">
      <div class="inp-head"><span class="k">01 · Liegenschaften und Wohnungen</span><h3 id="inp-buildings">${project.buildings.length} Häuser, ${project.apartments.length} Wohnungen, ${vacant.length} davon frei</h3></div>
      <div class="table-scroll"><table class="hh inp-table">
        <thead><tr><th scope="col">Liegenschaft</th><th scope="col">Wohnungen</th><th scope="col">Belegung</th><th scope="col">Lift</th><th scope="col">Rolle</th><th scope="col"><span class="sr-only">Aktion</span></th></tr></thead>
        <tbody>${buildingRows}</tbody></table></div>
      <form class="inp-form" data-form="building" aria-label="Liegenschaft hinzufügen">
        <label class="field"><span>Name</span><input name="name" type="text" placeholder="Haus D" required></label>
        <label class="field"><span>Strasse</span><input name="street" type="text" placeholder="Brunnenwiesstrasse 10"></label>
        <label class="field"><span>Stockwerke</span><select name="floors"><option>1</option><option>2</option><option selected>3</option><option>4</option></select></label>
        <label class="field"><span>Wohnungen pro Stockwerk</span><select name="perFloor"><option>1</option><option>2</option><option selected>3</option></select></label>
        <label class="field"><span>Zimmer</span><select name="rooms"><option value="mixed" selected>gemischt 2,5 / 3,5 / 4,5</option>${sizeOptions(null)}</select></label>
        <label class="check field-check"><input name="lift" type="checkbox"> mit Lift</label>
        <button type="submit" class="btn btn-primary">Liegenschaft hinzufügen</button>
        <p class="field-hint">Neue Liegenschaften kommen leer dazu und dienen als Ausweichflächen. Haushalte lassen sich unten in jede freie Wohnung setzen.</p>
      </form>
    </section>

    <section class="inp-block" aria-labelledby="inp-households">
      <div class="inp-head"><span class="k">02 · Haushalte und ihr Bedarf</span><h3 id="inp-households">${project.households.length} Haushalte</h3></div>
      <div class="table-scroll"><table class="hh inp-table">
        <thead><tr><th scope="col">Haushalt</th><th scope="col">Wohnung</th><th scope="col">Personen</th><th scope="col">Bedarf</th><th scope="col"><span class="sr-only">Aktion</span></th></tr></thead>
        <tbody>${householdRows}</tbody></table></div>
      <form class="inp-form" data-form="household" aria-label="Haushalt hinzufügen">
        <label class="field"><span>Name</span><input name="name" type="text" placeholder="Fam. Bernasconi" required></label>
        <label class="field"><span>Wohnt in</span><select name="apartment" required>${apartmentOptions || '<option value="">keine freie Wohnung</option>'}</select></label>
        <label class="field"><span>Personen</span><input name="persons" type="number" min="1" max="9" value="2"></label>
        <label class="field"><span>Braucht mindestens</span><select name="roomsMin">${sizeOptions(3.5)}</select></label>
        <label class="check field-check"><input name="stepFree" type="checkbox"> hindernisfrei</label>
        <label class="field"><span>Notiz</span><input name="note" type="text" placeholder="Schulkreis, Pflege, Haustier"></label>
        <button type="submit" class="btn btn-primary" ${apartmentOptions ? '' : 'disabled'}>Haushalt hinzufügen</button>
      </form>
    </section>

    <section class="inp-block" aria-labelledby="inp-external">
      <div class="inp-head"><span class="k">03 · Externe Rochade-Wohnungen</span><h3 id="inp-external">${project.external.length} ausserhalb der Siedlung</h3></div>
      <div class="table-scroll"><table class="hh inp-table">
        <thead><tr><th scope="col">Wohnung</th><th scope="col">Grösse</th><th scope="col">Verfügbar</th><th scope="col"><span class="sr-only">Aktion</span></th></tr></thead>
        <tbody>${externalRows || '<tr><td colspan="4" class="muted">Keine externen Wohnungen erfasst.</td></tr>'}</tbody></table></div>
      <form class="inp-form" data-form="external" aria-label="Externe Rochade-Wohnung hinzufügen">
        <label class="field"><span>Adresse</span><input name="name" type="text" placeholder="Limmattalstrasse 5, 3. OG" required></label>
        <label class="field"><span>Zimmer</span><select name="rooms">${sizeOptions(3.5)}</select></label>
        <label class="check field-check"><input name="stepFree" type="checkbox"> hindernisfrei</label>
        <label class="field"><span>Frei ab</span><select name="availableFrom">${monthOptions(project, 0)}</select></label>
        <label class="field"><span>Frei bis</span><select name="availableTo">${monthOptions(project, project.timeline.months - 1)}</select></label>
        <button type="submit" class="btn btn-primary" ${project.external.length >= 8 ? 'disabled' : ''}>Wohnung hinzufügen</button>
      </form>
    </section>
  </div>`;
}
