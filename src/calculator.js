export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
export const halls = {
  marriage: { label: 'Hall 1 · Marriage', hours: 6, price: 22000, extra: 3500 },
  other: { label: 'Hall 1 · Other event', hours: 3, price: 15000, extra: 3500 },
  birthday: { label: 'Hall 2 · Birthday', hours: 3, price: 8000, extra: 1000 }
};
export const waiters = {
  300: { count: 45, price: 33250, a: 30, b: 10, housekeeping: 4 },
  350: { count: 50, price: 38000, a: 35, b: 12, housekeeping: 4 },
  400: { count: 55, price: 42750, a: 40, b: 13, housekeeping: 5 },
  450: { count: 65, price: 52250, a: 45, b: 15, housekeeping: 5 },
  500: { count: 70, price: 57000, a: 50, b: 17, housekeeping: 5 }
};
export const catering = {
  veg: { 300: 1100, 350: 1000, 400: 950, 450: 900, 500: 850 },
  nonveg: { 300: 1200, 350: 1150, 400: 1100, 450: 1050, 500: 1000 }
};
export const initial = { basic: false, hall: '', extraHours: '0', waiters: '', decoration: '', dj: '', generator: false, generatorHours: '1', catering: '', cateringGuests: '300', override: '' };
export function amount(value) { const n = Number(value); return Number.isFinite(n) && n >= 0 ? n : 0; }
export function calculate(s) {
  const lines = [];
  const add = (id, label, value, detail = '') => lines.push({ id, label, amount: value, detail });
  if (s.basic) add('basic', 'Basic venue rate', 70000, 'Day / night');
  const hall = halls[s.hall];
  if (hall) {
    add('hall', hall.label, hall.price, `${hall.hours} hours included`);
    if (amount(s.extraHours)) add('extraHours', 'Additional hall hours', amount(s.extraHours) * hall.extra, `${amount(s.extraHours)} hr × ${money(hall.extra)}`);
  }
  const waiter = waiters[s.waiters];
  if (waiter) add('waiters', 'Waiter service', waiter.price, `${s.waiters} guests · ${waiter.count} staff listed`);
  if (s.decoration === 'day' || s.decoration === 'night') add('decoration', `Decoration · ${s.decoration}`, s.decoration === 'day' ? 20000 : 30000);
  if (s.dj === 'without') add('dj', 'DJ without screen', 13000, 'Generator included');
  if (s.dj === 'with') add('dj', 'DJ with screen', 17000, 'Generator charged separately if selected');
  if (s.dj === 'outside') {
    add('dj', 'Outside DJ', 8000);
    add('outsideFee', 'Outside DJ additional charge', 3000);
  }
  if ((s.generator || s.dj === 'outside') && s.dj !== 'without') add('generator', 'Generator (DG)', amount(s.generatorHours) * 3000, `${amount(s.generatorHours)} hr × ${money(3000)}`);
  if (s.catering === 'outside') add('catering', 'Outside catering', 30000);
  const perGuest = catering[s.catering]?.[s.cateringGuests];
  if (perGuest) add('catering', `${s.catering === 'veg' ? 'Vegetarian' : 'Non-vegetarian'} catering`, perGuest * Number(s.cateringGuests), `${s.cateringGuests} guests × ${money(perGuest)}`);
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const overridden = s.override !== '' && Number.isFinite(Number(s.override)) && Number(s.override) >= 0;
  return { lines, subtotal, overridden, total: overridden ? Number(s.override) : subtotal };
}
