import React, { createContext, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculate, catering, halls, initial, money, waiters } from './calculator';
import './styles.css';
const SelectionContext = createContext(null);
function Choice({ field, value, title, price, detail }) {
  const { state, update } = useContext(SelectionContext);
  const selected = state[field] === value;
  return <button type="button" className={`choice ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={() => update(field, selected ? '' : value)}><span className="choice-dot" aria-hidden="true"/><span className="choice-text"><strong>{title}</strong>{detail && <small>{detail}</small>}</span><b>{money(price)}</b></button>;
}
function Section({ number, title, note, children }) {
  return <section className="section"><div className="section-heading"><span className="number">{number}</span><div><h2>{title}</h2><p>{note}</p></div></div>{children}</section>;
}

function App() {
  const [state, setState] = useState({ ...initial });
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const update = (key, value) => { setState(s => ({ ...s, [key]: value })); setCopied(false); setMessage(''); };
  const result = calculate(state);
  const generatorIncluded = state.dj === 'without';
  const generatorRequired = state.dj === 'outside';
  const quoteText = () => ['VRINDA RESORT — EVENT ESTIMATE', ...result.lines.map(line => `${line.label}: ${money(line.amount)}${line.detail ? ` (${line.detail})` : ''}`), `Calculated total: ${money(result.subtotal)}`, ...(result.overridden ? [`Manual adjustment: ${money(result.total - result.subtotal)}`] : []), `Final total: ${money(result.total)}`, 'No taxes or discounts added. Estimate based on selected services.'].join('\n');
  async function copy() { try { await navigator.clipboard.writeText(quoteText()); setCopied(true); } catch { setMessage('Copy unavailable in this browser. Use Download estimate instead.'); } }
  function download() { const url = URL.createObjectURL(new Blob([quoteText()], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'vrinda-resort-estimate.txt'; a.click(); URL.revokeObjectURL(url); }
  return <SelectionContext.Provider value={{ state, update }}><header><div className="brand-mark" aria-hidden="true">V<span>R</span></div><div><div className="brand">VRINDA RESORT</div><div className="tagline">Weddings · Celebrations · Social gatherings</div></div><span className="header-label">EVENT PLANNER</span></header>
    <main><div className="intro"><span className="eyebrow">YOUR CELEBRATION, YOUR WAY</span><h1>A memorable event.<br/><em>A clear estimate.</em></h1><p>Choose the services you need. Your estimate comes together as you go.</p><div className="intro-tags"><span>All services optional</span><span>Prices in INR</span></div></div>
    <div className="layout"><div className="services">
      <Section number="01" title="Venue & air conditioning" note="Select the basic rate and add a hall package if needed.">
        <button className={`choice basic ${state.basic ? 'selected' : ''}`} aria-pressed={state.basic} onClick={() => update('basic', !state.basic)}><span className="choice-dot" aria-hidden="true"/><span className="choice-text"><strong>Basic venue rate</strong><small>Same rate for day and night</small></span><b>{money(70000)}</b></button>
        <div className="field-label">HALL & AIR CONDITIONING</div>
        {Object.entries(halls).map(([key, hall]) => <Choice key={key} field="hall" value={key} title={hall.label} price={hall.price} detail={`${hall.hours} hours included · ${money(hall.extra)}/additional hr`}/>)}
        {state.hall && <div className="inline-field"><label htmlFor="extraHours">Additional hall hours<small>Beyond the included {halls[state.hall].hours} hours</small></label><input id="extraHours" type="number" min="0" step="0.5" value={state.extraHours} onChange={e => update('extraHours', e.target.value)} onBlur={() => update('extraHours', String(Math.max(0, Number(state.extraHours) || 0)))}/></div>}
      </Section>
      <Section number="02" title="Waiter service" note="Choose a gathering size. Prices use the Charges column.">
        <label className="field-label" htmlFor="waiters">GATHERING SIZE</label><select id="waiters" value={state.waiters} onChange={e => update('waiters', e.target.value)}><option value="">No waiter service</option>{Object.entries(waiters).map(([guests, row]) => <option key={guests} value={guests}>{guests} guests — {money(row.price)}</option>)}</select>
        {state.waiters && <div className="staff-details"><span><b>{waiters[state.waiters].count}</b> Staff count</span><span><b>{waiters[state.waiters].a}</b> A</span><span><b>{waiters[state.waiters].b}</b> B</span><span><b>{waiters[state.waiters].housekeeping}</b> Housekeeping</span></div>}
      </Section>
      <Section number="03" title="Decoration" note="Set the scene for your celebration."><div className="two-col"><Choice field="decoration" value="day" title="Day" price={20000}/><Choice field="decoration" value="night" title="Night" price={30000}/></div></Section>
      <Section number="04" title="DJ & generator" note="Pick the entertainment and power you need.">
        <Choice field="dj" value="without" title="DJ without screen" price={13000} detail="Includes generator (DG)"/>
        <Choice field="dj" value="with" title="DJ with screen" price={17000} detail="Generator is extra"/>
        <Choice field="dj" value="outside" title="Outside DJ" price={8000} detail="Plus ₹3,000 additional charge + generator usage"/>
        <label className={`check-row ${generatorIncluded ? 'muted' : ''}`}><input type="checkbox" checked={generatorIncluded || generatorRequired || state.generator} disabled={generatorIncluded || generatorRequired} onChange={e => update('generator', e.target.checked)}/><span><strong>Generator (DG)</strong><small>{generatorIncluded ? 'Included with your DJ package' : generatorRequired ? 'Required with outside DJ · ₹3,000/hour' : '₹3,000/hour · optional'}</small></span></label>
        {!generatorIncluded && (state.generator || generatorRequired) && <div className="inline-field"><label htmlFor="generatorHours">Generator hours<small>Charged separately at ₹3,000/hour</small></label><input id="generatorHours" type="number" min="0.5" step="0.5" value={state.generatorHours} onChange={e => update('generatorHours', e.target.value)} onBlur={() => update('generatorHours', String(Math.max(0.5, Number(state.generatorHours) || 0.5)))}/></div>}
      </Section>
      <Section number="05" title="Catering" note="Choose a package and the gathering size for catering.">
        <div className="segmented" role="group" aria-label="Catering package">{[['','None'],['veg','Vegetarian'],['nonveg','Non-veg'],['outside','Outside']].map(([value,label]) => <button key={value} aria-pressed={state.catering === value} className={state.catering === value ? 'active' : ''} onClick={() => update('catering',value)}>{label}</button>)}</div>
        {catering[state.catering] && <><label className="field-label" htmlFor="cateringGuests">CATERING GATHERING SIZE</label><select id="cateringGuests" value={state.cateringGuests} onChange={e => update('cateringGuests', e.target.value)}>{Object.entries(catering[state.catering]).map(([guests,rate]) => <option key={guests} value={guests}>{guests} guests · {money(rate)} per guest — {money(Number(guests)*rate)}</option>)}</select><p className="package-note">{state.cateringGuests} guests × {money(catering[state.catering][state.cateringGuests])} per guest</p></>}
        {state.catering === 'outside' && <div className="package-note">Outside catering charge <strong>{money(30000)}</strong></div>}
      </Section>
    </div><aside className="summary" aria-label="Event estimate"><div className="summary-top"><span className="eyebrow">MADE FOR YOUR EVENT</span><h2>Your estimate</h2><p>{result.lines.length ? 'A little closer to your perfect celebration.' : 'Select a service to begin your estimate.'}</p></div><div className="summary-body"><div className="line-items">{result.lines.length ? result.lines.map(line => <div className="line-item" key={line.id}><div><strong>{line.label}</strong>{line.detail && <small>{line.detail}</small>}</div><span>{money(line.amount)}</span></div>) : <div className="empty"><span aria-hidden="true">✧</span><p>Your plans start here.</p><small>Selected services will appear in this space.</small></div>}</div><div className="subtotal"><span>Calculated total</span><b>{money(result.subtotal)}</b></div><label className="override-label" htmlFor="override">Edit final total <span>Optional</span></label><div className="currency-input"><span aria-hidden="true">₹</span><input id="override" aria-describedby="override-help" type="number" min="0" step="0.01" placeholder="Use calculated total" value={state.override} onChange={e => update('override', e.target.value)} onBlur={() => { if (state.override !== '' && (!Number.isFinite(Number(state.override)) || Number(state.override) < 0)) update('override',''); }}/></div><small id="override-help" className="override-help">A custom total stays fixed when you change selections.</small>{result.overridden && <div className="adjustment"><span>Manual adjustment</span><b>{money(result.total-result.subtotal)}</b><button onClick={() => update('override','')}>Use calculated total</button></div>}<div className="total" aria-live="polite" aria-atomic="true"><span>FINAL TOTAL</span><strong>{money(result.total)}</strong><small>{result.overridden ? 'Custom amount applied' : 'Based on your selected services'}</small></div><button className="primary" onClick={() => window.print()}>Print estimate <span aria-hidden="true">↗</span></button><div className="summary-actions"><button onClick={copy}>{copied ? 'Copied!' : 'Copy estimate'}</button><button onClick={download}>Download</button></div><p role="status" className="status">{message}</p><button className="reset" onClick={() => { setState({...initial}); setCopied(false); setMessage(''); }}>Reset selections & total</button><p className="fine-print">No taxes or discounts added. This is an estimate based on the selected packages.</p></div></aside></div><footer>VRINDA RESORT <span>Thoughtfully planned. Beautifully celebrated.</span></footer></main></SelectionContext.Provider>;
}
createRoot(document.getElementById('root')).render(<App/>);

