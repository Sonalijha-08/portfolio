
document.getElementById('year').textContent = new Date().getFullYear();

function submitContact(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if(!name || !email || !message){ alert('Please fill all fields'); return; }

  alert('Thanks, ' + name + '! Your message was received (demo).');
  e.target.reset?.();
}


document.querySelectorAll('.nav a').forEach(a=>{
  a.addEventListener('click', (ev)=>{
    ev.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
