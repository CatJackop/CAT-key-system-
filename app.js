const $ = id => document.getElementById(id);
$('getKey').addEventListener('click', async () => {
  const btn = $('getKey'); btn.disabled = true; $('status').textContent = 'Generating your key…';
  try {
    const r = await fetch('/api/get-key', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({})});
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Could not issue a key.');
    $('keyText').textContent = d.key; $('result').classList.remove('hidden');
    $('status').textContent = 'Key created. It starts its expiration countdown on first successful verification.';
  } catch(e) { $('status').textContent = e.message; }
  finally { btn.disabled = false; }
});
$('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('keyText').textContent); $('status').textContent='Key copied.'; }
  catch { $('status').textContent='Select and copy the key manually.'; }
});
$('verifyForm').addEventListener('submit', async e => {
  e.preventDefault(); $('verifyStatus').textContent='Checking…';
  try {
    const r = await fetch('/api/verify-key',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key:$('verifyInput').value.trim()})});
    const d = await r.json();
    $('verifyStatus').textContent = d.valid ? `Valid · ${d.status}${d.expires_at ? ' · expires '+d.expires_at : ''}` : `Invalid: ${d.reason || 'key rejected'}`;
  } catch { $('verifyStatus').textContent='Verification failed. Please try again.'; }
});
