document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  const flash = document.getElementById('flash');
  const successMsg = document.getElementById('login-success');
  const submitButton = form.querySelector('button[type="submit"]');

  let liveValidationEnabled = false;

  const isValidEmail = (email) => {
    // Must include @, a domain, and end with a TLD of at least 2 characters
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email);
  };

  const showEmailError = (msg) => emailError.textContent = msg;
  const clearEmailError = () => emailError.textContent = '';
  const validate = () => {
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      showEmailError('Please enter a valid email address with a valid domain.');
      return false;
    }
    clearEmailError();
    return true;
  };

  emailInput.addEventListener('input', () => {
    if (liveValidationEnabled) validate();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) {
      liveValidationEnabled = true;
      return;
    }

    flash.textContent = '';

    const email = emailInput.value.trim();
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const data = await res.json();
        flash.textContent = data.message || 'Unknown error';
      } else {
        submitButton.classList.add('hidden');
        emailInput.setAttribute('disabled', 'true');
        emailInput.classList.add('opacity-50', 'cursor-not-allowed', 'text-gray-400');
        successMsg.classList.remove('hidden');
      }
    } catch (err) {
      flash.textContent = 'Network error.';
      console.error(err);
    }
  });
});
