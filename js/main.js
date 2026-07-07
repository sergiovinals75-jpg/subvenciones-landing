// Todo en un solo archivo, sin dependencias

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function(button) {
    button.addEventListener('click', function() {
      const item = this.parentElement;
      document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('active');
      });
      item.classList.add('active');
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Check if logged in
  const user = localStorage.getItem('user');
  if (user) {
    const headerBtn = document.querySelector('.header .btn-primary');
    if (headerBtn) {
      headerBtn.textContent = 'Mi panel';
      headerBtn.href = 'dashboard.html';
    }
  }
});

// Modal functions
function openModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
}

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

// Subscribe function
function subscribe(plan) {
  if (plan === 'free') {
    openModal();
    showRegister();
  } else if (plan === 'empresa') {
    window.location.href = 'mailto:hola@subvencionesai.com?subject=Interesado%20en%20plan%20Empresa';
  } else {
    alert('Stripe no está configurado aún. Pronto podrás contratar el plan.');
  }
}

// Auth functions
function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value;
  localStorage.setItem('user', JSON.stringify({ email: email, plan: 'free' }));
  alert('¡Sesión iniciada!');
  window.location.href = 'dashboard.html';
}

function handleRegister(e) {
  e.preventDefault();
  var email = document.getElementById('registerEmail').value;
  var company = document.getElementById('registerCompany').value;
  localStorage.setItem('user', JSON.stringify({ email: email, company_name: company, plan: 'free' }));
  alert('¡Cuenta creada!');
  window.location.href = 'dashboard.html';
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}
