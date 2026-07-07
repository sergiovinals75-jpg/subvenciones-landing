// Configuración de Stripe
// IMPORTANTE: Reemplazar con tu public key de Stripe
const STRIPE_PUBLIC_KEY = 'pk_test_TUYOO_PUBLIC_KEY_AQUI';
const API_URL = 'http://localhost:3000/api';

// Inicializar Stripe (solo si está disponible)
let stripe = null;
if (typeof Stripe !== 'undefined') {
  stripe = Stripe(STRIPE_PUBLIC_KEY);
}

// Función de suscripción
async function subscribe(plan) {
  if (plan === 'free') {
    // Redirigir a registro
    window.location.href = '#registro';
    return;
  }

  if (plan === 'empresa') {
    // Contactar ventas
    window.location.href = 'mailto:hola@subvencionesai.com?subject=Interesado%20en%20plan%20Empresa';
    return;
  }

  // Verificar si hay token (usuario logueado)
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Guardar plan seleccionado y redirigir a registro
    localStorage.setItem('selectedPlan', plan);
    alert('Primero crea una cuenta gratuita. El plan se aplicará al registrarte.');
    window.location.href = '#registro';
    return;
  }

  try {
    // Crear sesión de checkout
    const response = await fetch(`${API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan })
    });

    const data = await response.json();

    if (data.url) {
      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } else if (data.error) {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar el pago. Inténtalo de nuevo.');
  }
}

// Verificar sesión existente
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    // Usuario logueado - actualizar UI
    const userData = JSON.parse(user);
    updateUIForLoggedInUser(userData);
  }
  
  // Verificar si hay plan pendiente de registro
  const selectedPlan = localStorage.getItem('selectedPlan');
  if (selectedPlan && token) {
    subscribe(selectedPlan);
    localStorage.removeItem('selectedPlan');
  }
});

function updateUIForLoggedInUser(user) {
  // Actualizar botones de header
  const headerCTA = document.querySelector('.header .btn-primary');
  if (headerCTA) {
    headerCTA.textContent = 'Mi panel';
    headerCTA.href = '/dashboard';
  }
}
