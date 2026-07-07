// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all items
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    
    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = 'var(--shadow)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// Modal functions
const modal = document.getElementById('authModal');

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  clearForms();
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  clearForms();
}

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  clearForms();
}

function clearForms() {
  document.querySelectorAll('.form-error, .form-success').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('input').forEach(input => {
    input.value = '';
  });
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Auth functions
const API_URL = window.location.origin + '/api';

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      closeModal();
      updateUIForLoggedInUser(data.user);
      alert('¡Sesión iniciada! Redirigiendo al panel...');
    } else {
      showError('loginForm', data.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    showError('loginForm', 'Error de conexión. Intenta de nuevo.');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const company = document.getElementById('registerCompany').value;
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, company_name: company })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      closeModal();
      updateUIForLoggedInUser(data.user);
      alert('¡Cuenta creada! Redirigiendo al panel...');
    } else {
      showError('registerForm', data.error || 'Error al registrar');
    }
  } catch (error) {
    showError('registerForm', 'Error de conexión. Intenta de nuevo.');
  }
}

function showError(formId, message) {
  const form = document.getElementById(formId);
  let errorDiv = form.querySelector('.form-error');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    form.insertBefore(errorDiv, form.firstChild);
  }
  
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function updateUIForLoggedInUser(user) {
  const headerCTA = document.querySelector('.header .btn-primary');
  if (headerCTA) {
    headerCTA.textContent = 'Mi panel';
    headerCTA.href = 'dashboard.html';
    headerCTA.onclick = null;
  }
}

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    updateUIForLoggedInUser(JSON.parse(user));
  }
});
