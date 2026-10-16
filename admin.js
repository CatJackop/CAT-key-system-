const $ = id => document.getElementById(id);
let secret = '';
async function api(path, options={}) {
  const headers = {'content-type':'application/json','x-admin-secret':secret,...(options.headers||{})};
  const r = await fetch(path,{...options,headers});
  const d = await r.json().catch(()=>({error:'Unexpected server response'}));
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}
$('loginForm').addEventListener('submit', async e=>{
  e.preventDefault(); secret=$('adminSecret').value;
  try { await loadKeys(); $('panel').classList.remove('hidden'); $('loginStatus').textContent='Admin access granted.'; $('adminSecret').value=''; }
  catch(err){ secret=''; $('loginStatus').textContent=err.message; }
});
async function loadKeys(){
  const d=await api('/api/admin/keys');
  $('keys').innerHTML='';
  if(!d.keys.length){$('keys').textContent='No keys yet.';return;}
  for(const k of d.keys){
    const el=document.createElement('div');el.className='keyrow';
    const code=document.createElement('code');code.textContent=k.key;
    const meta=document.createElement('div');meta.className='meta';meta.textContent=`${k.status} · duration ${k.duration_hours}h · created ${new Date(k.created_at).toLocaleString()}${k.expires_at?' · expires '+new Date(k.expires_at).toLocaleString():''}${k.label?' · '+k.label:''}`;
    const btn=document.createElement('button');btn.className='secondary';btn.textContent=k.status==='revoked'?'REVOKED':'REVOKE KEY';btn.disabled=k.status==='revoked';
    btn.addEventListener('click',async()=>{if(!confirm('Revoke this key?'))return;try{await api('/api/admin/revoke-key',{method:'POST',body:JSON.stringify({id:k.id})});await loadKeys();}catch(e){alert(e.message)}});
    el.append(code,meta,btn);$('keys').append(el);
  }
}
$('createForm').addEventListener('submit',async e=>{
  e.preventDefault();$('adminStatus').textContent='Creating…';
  try{const d=await api('/api/admin/create-key',{method:'POST',body:JSON.stringify({durationHours:Number($('duration').value),label:$('label').value.trim()})});$('adminStatus').textContent='Created key: '+d.key;$('label').value='';await loadKeys();}
  catch(err){$('adminStatus').textContent=err.message}
});
$('refresh').addEventListener('click',async()=>{try{await loadKeys()}catch(e){$('adminStatus').textContent=e.message}});
