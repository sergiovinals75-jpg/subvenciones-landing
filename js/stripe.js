// Configuración de Stripe
const STRIPE_PUBLIC_KEY = 'pk_test_TUYOO_PUBLIC_KEY_AQUI';

// Función de suscripción
function subscribe(plan) {
  if (plan === 'free') {
    // Abrir modal de registro
    if (typeof openModal === 'function') {
      openModal();
      showRegister();
    } else {
      // Fallback: redirigir a registro
      window.location.href = '#registro';
    }
    return;
  }

  if (plan === 'empresa') {
    window.location.href = 'mailto:hola@subvencionesai.com?subject=Interesado%20en%20plan%20Empresa';
    return;
  }

  // Para planes de pago
  alert('Stripe no está configurado aún. Pronto podrás contratar el plan.');
}

// Verificar sesión existente
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  
  if (user) {
    const userData = JSON.parse(user);
    updateUIForLoggedInUser(userData);
  }
});

function updateUIForLoggedInUser(user) {
  const headerCTA = document.querySelector('.header .btn-primary');
  if (headerCTA) {
    headerCTA.textContent = 'Mi panel';
    headerCTA.href = 'dashboard.html';
  }
}
