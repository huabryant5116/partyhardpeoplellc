/**
 * Party Hard People LLC — Core Application Logic
 * Interactive Party Builder, Cart/Deposit Estimation, Storage & UI
 */

// Default pricing catalogue (cents) for real-time quotation estimation
const CATALOG = {
  entertainment: {
    'dj-party': { name: 'Kids DJ & Music Host', basePriceCents: 35000 },
    'karaoke-jam': { name: 'Karaoke Jam Station & Host', basePriceCents: 25000 },
    'party-games': { name: 'Organized Singing & Dance Games', basePriceCents: 18000 },
    'character-host': { name: 'Themed Character Appearance', basePriceCents: 22000 },
    'party-mc': { name: 'High-Energy Party MC / Coordinator', basePriceCents: 20000 }
  },
  rentals: {
    'bounce-house': { name: 'Pastel Castle Bounce House', unitPriceCents: 22000 },
    'tables': { name: '6ft Folding Tables', unitPriceCents: 1200 },
    'chairs': { name: 'White Resin Kids/Adult Chairs', unitPriceCents: 300 },
    'sound-system': { name: 'Pro PA Sound System & Mic', unitPriceCents: 15000 },
    'party-lights': { name: 'Dynamic LED Stage & Laser Lighting', unitPriceCents: 9500 },
    'generator': { name: 'Quiet Inverter Power Generator', unitPriceCents: 8500 }
  }
};

const DEFAULT_DEPOSIT_PCT = 25; // PRD specified 25% deposit

// State container
let partyState = {
  step: 1,
  eventType: 'birthday',
  eventDate: '',
  startTime: '13:00',
  endTime: '16:00',
  address: '',
  venueType: 'outdoor',
  childrenCount: 15,
  ageRanges: ['4-7'],
  estimatedGuests: 25,
  entertainment: ['dj-party', 'party-games'],
  rentals: {
    'bounce-house': 1,
    'tables': 4,
    'chairs': 16,
    'sound-system': 0,
    'party-lights': 0,
    'generator': 0
  },
  theme: '',
  budget: 'standard',
  notes: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactMethod: 'email',
  referral: 'google'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  initFaqAccordion();
  initCookieConsent();
  initPartyBuilder();
  updateSummarySidebar();
});

// Load state from sessionStorage if available
function loadSavedState() {
  const saved = sessionStorage.getItem('php_party_state');
  if (saved) {
    try {
      partyState = { ...partyState, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not parse saved party state', e);
    }
  }
}

function saveState() {
  sessionStorage.setItem('php_party_state', JSON.stringify(partyState));
  updateSummarySidebar();
}

// Cookie consent
function initCookieConsent() {
  const consent = localStorage.getItem('cookie-consent');
  const bar = document.getElementById('cookie-bar');
  if (!bar) return;
  
  if (!consent) {
    setTimeout(() => {
      bar.classList.add('active');
    }, 600);
  }
  
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      bar.classList.remove('active');
    });
  }
  
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'declined');
      bar.classList.remove('active');
    });
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

// Party Builder Logic
function initPartyBuilder() {
  const builder = document.getElementById('party-builder-form');
  if (!builder) return;

  // Bind step navigation
  document.querySelectorAll('[data-goto-step]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetStep = parseInt(e.currentTarget.getAttribute('data-goto-step'), 10);
      if (validateCurrentStep(partyState.step, targetStep)) {
        goToStep(targetStep);
      }
    });
  });

  // Bind step header nodes
  document.querySelectorAll('.step-node').forEach(node => {
    node.addEventListener('click', (e) => {
      const targetStep = parseInt(e.currentTarget.getAttribute('data-step-index'), 10);
      if (targetStep < partyState.step || validateCurrentStep(partyState.step, targetStep)) {
        goToStep(targetStep);
      }
    });
  });

  // Bind input listeners
  const bindInput = (id, key) => {
    const el = document.getElementById(id);
    if (el) {
      if (partyState[key]) el.value = partyState[key];
      el.addEventListener('input', (e) => {
        partyState[key] = e.target.value;
        const group = el.closest('.form-group');
        if (group) group.classList.remove('has-error');
        saveState();
      });
    }
  };

  bindInput('pb-event-type', 'eventType');
  bindInput('pb-event-date', 'eventDate');
  bindInput('pb-start-time', 'startTime');
  bindInput('pb-end-time', 'endTime');
  bindInput('pb-address', 'address');
  bindInput('pb-venue-type', 'venueType');
  bindInput('pb-children-count', 'childrenCount');
  bindInput('pb-guests-count', 'estimatedGuests');
  bindInput('pb-theme', 'theme');
  bindInput('pb-budget', 'budget');
  bindInput('pb-notes', 'notes');
  bindInput('pb-contact-name', 'contactName');
  bindInput('pb-contact-email', 'contactEmail');
  bindInput('pb-contact-phone', 'contactPhone');
  bindInput('pb-contact-method', 'contactMethod');
  bindInput('pb-referral', 'referral');

  // Option toggles for age groups
  document.querySelectorAll('.age-group-toggle').forEach(card => {
    const age = card.getAttribute('data-age-group');
    if (partyState.ageRanges.includes(age)) card.classList.add('selected');
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      if (card.classList.contains('selected')) {
        if (!partyState.ageRanges.includes(age)) partyState.ageRanges.push(age);
      } else {
        partyState.ageRanges = partyState.ageRanges.filter(a => a !== age);
      }
      saveState();
    });
  });

  // Option toggles for entertainment shows
  document.querySelectorAll('.show-toggle').forEach(card => {
    const key = card.getAttribute('data-show-key');
    if (partyState.entertainment.includes(key)) card.classList.add('selected');
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      if (card.classList.contains('selected')) {
        if (!partyState.entertainment.includes(key)) partyState.entertainment.push(key);
      } else {
        partyState.entertainment = partyState.entertainment.filter(s => s !== key);
      }
      saveState();
    });
  });

  // Quantity steppers for rentals
  document.querySelectorAll('.rental-stepper').forEach(stepper => {
    const rentalKey = stepper.getAttribute('data-rental-key');
    const valDisplay = stepper.querySelector('.qty-value');
    const btnDec = stepper.querySelector('.qty-dec');
    const btnInc = stepper.querySelector('.qty-inc');

    if (partyState.rentals[rentalKey] !== undefined) {
      valDisplay.textContent = partyState.rentals[rentalKey];
    }

    btnDec.addEventListener('click', () => {
      let cur = parseInt(valDisplay.textContent, 10) || 0;
      if (cur > 0) {
        cur -= 1;
        valDisplay.textContent = cur;
        partyState.rentals[rentalKey] = cur;
        saveState();
      }
    });

    btnInc.addEventListener('click', () => {
      let cur = parseInt(valDisplay.textContent, 10) || 0;
      cur += 1;
      valDisplay.textContent = cur;
      partyState.rentals[rentalKey] = cur;
      saveState();
    });
  });

  // Submission button
  const submitBtn = document.getElementById('pb-submit-quote');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleQuoteSubmission);
  }
}

// Step navigation
function goToStep(step) {
  partyState.step = step;
  
  // Hide all step contents
  document.querySelectorAll('.builder-step-content').forEach(s => s.style.display = 'none');
  
  // Show target step
  const target = document.getElementById(`step-content-${step}`);
  if (target) target.style.display = 'block';

  // Update header step nodes
  document.querySelectorAll('.step-node').forEach(node => {
    const idx = parseInt(node.getAttribute('data-step-index'), 10);
    node.classList.remove('active', 'completed');
    if (idx === step) {
      node.classList.add('active');
    } else if (idx < step) {
      node.classList.add('completed');
    }
  });

  saveState();
}

// Form validation
function validateCurrentStep(currentStep, targetStep) {
  if (targetStep < currentStep) return true; // Always allow going back

  if (currentStep === 1) {
    const dateInput = document.getElementById('pb-event-date');
    const addressInput = document.getElementById('pb-address');

    let valid = true;
    if (!dateInput.value) {
      showFieldError(dateInput, 'Please choose an event date');
      valid = false;
    }
    if (!addressInput.value.trim()) {
      showFieldError(addressInput, 'Please enter your event city or address in SoCal');
      valid = false;
    }
    return valid;
  }

  if (currentStep === 2) {
    if (partyState.ageRanges.length === 0) {
      alert('Please select at least one age group attending.');
      return false;
    }
  }

  return true;
}

function showFieldError(input, msg) {
  const group = input.closest('.form-group');
  if (group) {
    group.classList.add('has-error');
    let errEl = group.querySelector('.form-error-msg');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'form-error-msg';
      group.appendChild(errEl);
    }
    errEl.textContent = msg;
  }
  input.focus();
}

// Calculate financial figures accurately in integer minor units (cents)
function calculateEstimate() {
  let subtotalCents = 0;

  // Entertainment total
  partyState.entertainment.forEach(k => {
    if (CATALOG.entertainment[k]) {
      subtotalCents += CATALOG.entertainment[k].basePriceCents;
    }
  });

  // Rental total
  Object.keys(partyState.rentals).forEach(k => {
    const count = partyState.rentals[k] || 0;
    if (count > 0 && CATALOG.rentals[k]) {
      subtotalCents += count * CATALOG.rentals[k].unitPriceCents;
    }
  });

  // Default deposit: 25% of subtotal using integer math
  const depositCents = Math.round(subtotalCents * (DEFAULT_DEPOSIT_PCT / 100));
  const balanceCents = subtotalCents - depositCents;

  return {
    subtotalCents,
    depositCents,
    balanceCents,
    subtotalFormatted: (subtotalCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    depositFormatted: (depositCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    balanceFormatted: (balanceCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  };
}

function updateSummarySidebar() {
  const est = calculateEstimate();
  
  const subtotalEl = document.getElementById('summary-subtotal');
  const depositEl = document.getElementById('summary-deposit');
  const balanceEl = document.getElementById('summary-balance');
  const dateEl = document.getElementById('summary-date');
  const guestsEl = document.getElementById('summary-guests');
  
  if (subtotalEl) subtotalEl.textContent = est.subtotalFormatted;
  if (depositEl) depositEl.textContent = est.depositFormatted;
  if (balanceEl) balanceEl.textContent = est.balanceFormatted;
  if (dateEl) dateEl.textContent = partyState.eventDate || 'Pending';
  if (guestsEl) guestsEl.textContent = `${partyState.childrenCount} kids / ${partyState.estimatedGuests} guests`;
}

// Submission handler
function handleQuoteSubmission(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('pb-contact-name');
  const email = document.getElementById('pb-contact-email');
  const phone = document.getElementById('pb-contact-phone');

  let valid = true;
  if (!name || !name.value.trim()) {
    showFieldError(name, 'Please enter your full name');
    valid = false;
  }
  if (!email || !email.value.trim() || !email.value.includes('@')) {
    showFieldError(email, 'Please enter a valid email address');
    valid = false;
  }
  if (!phone || !phone.value.trim()) {
    showFieldError(phone, 'Please enter your phone number');
    valid = false;
  }

  if (!valid) return;

  // Generate Reference ID: PHP-2026-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const refCode = `PHP-2026-${randomSuffix}`;
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7-day expiration per PRD

  const estimate = calculateEstimate();

  const inquiryRecord = {
    id: 'inq_' + Date.now(),
    refCode,
    submittedAt: now.toISOString(),
    expiresAt: expiryDate.toISOString(),
    status: 'pending_review',
    estimate,
    details: { ...partyState }
  };

  // Store into localStorage
  const existingInquiries = JSON.parse(localStorage.getItem('php_inquiries') || '[]');
  existingInquiries.unshift(inquiryRecord);
  localStorage.setItem('php_inquiries', JSON.stringify(existingInquiries));

  // Clear session draft state
  sessionStorage.removeItem('php_party_state');

  // Seamless redirect to thank-you.html
  window.location.href = `thank-you.html?ref=${refCode}&name=${encodeURIComponent(partyState.contactName)}&total=${encodeURIComponent(estimate.subtotalFormatted)}&deposit=${encodeURIComponent(estimate.depositFormatted)}`;
}
