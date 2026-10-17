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

  // Bind input listeners
  const bindInput = (id, key) => {
    const el = document.getElementById(id);
    if (el) {
      if (partyState[key]) el.value = partyState[key];
      el.addEventListener('input', (e) => {
        partyState[key] = e.target.value;
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

  // Entertainment checkboxes
  document.querySelectorAll('.entertainment-toggle').forEach(card => {
    const key = card.getAttribute('data-service-key');
    if (partyState.entertainment.includes(key)) {
      card.classList.add('selected');
    }
    card.addEventListener('click', () => {
      if (partyState.entertainment.includes(key)) {
        partyState.entertainment = partyState.entertainment.filter(k => k !== key);
        card.classList.remove('selected');
      } else {
        partyState.entertainment.push(key);
        card.classList.add('selected');
      }
      saveState();
    });
  });

  // Age group checkboxes
  document.querySelectorAll('.age-group-toggle').forEach(card => {
    const age = card.getAttribute('data-age-group');
    if (partyState.ageRanges.includes(age)) {
      card.classList.add('selected');
    }
    card.addEventListener('click', () => {
      if (partyState.ageRanges.includes(age)) {
        partyState.ageRanges = partyState.ageRanges.filter(a => a !== age);
        card.classList.remove('selected');
      } else {
        partyState.ageRanges.push(age);
        card.classList.add('selected');
      }
      saveState();
    });
  });

  // Rental Quantity steppers
  document.querySelectorAll('.rental-stepper').forEach(stepper => {
    const key = stepper.getAttribute('data-rental-key');
    const valEl = stepper.querySelector('.qty-value');
    const btnDec = stepper.querySelector('.qty-dec');
    const btnInc = stepper.querySelector('.qty-inc');
    
    if (valEl) {
      valEl.textContent = partyState.rentals[key] || 0;
    }

    if (btnDec) {
      btnDec.addEventListener('click', () => {
        const current = partyState.rentals[key] || 0;
        if (current > 0) {
          partyState.rentals[key] = current - 1;
          valEl.textContent = partyState.rentals[key];
          saveState();
        }
      });
    }

    if (btnInc) {
      btnInc.addEventListener('click', () => {
        const current = partyState.rentals[key] || 0;
        partyState.rentals[key] = current + 1;
        valEl.textContent = partyState.rentals[key];
        saveState();
      });
    }
  });

  // Submit quote handler
  const submitBtn = document.getElementById('pb-submit-quote');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleQuoteSubmission);
  }
}

function goToStep(stepNumber) {
  partyState.step = stepNumber;
  document.querySelectorAll('.builder-step-content').forEach(el => {
    el.style.display = 'none';
  });
  
  const targetContent = document.getElementById(`step-content-${stepNumber}`);
  if (targetContent) {
    targetContent.style.display = 'block';
  }

  // Update indicators
  document.querySelectorAll('.step-node').forEach(node => {
    const n = parseInt(node.getAttribute('data-step-index'), 10);
    node.classList.remove('active', 'completed');
    if (n === stepNumber) {
      node.classList.add('active');
    } else if (n < stepNumber) {
      node.classList.add('completed');
    }
  });

  saveState();
  window.scrollTo({ top: document.getElementById('party-builder').offsetTop - 90, behavior: 'smooth' });
}

function validateCurrentStep(currentStep, targetStep) {
  // If navigating backwards, allow freely
  if (targetStep < currentStep) return true;

  if (currentStep === 1) {
    const date = document.getElementById('pb-event-date');
    const addr = document.getElementById('pb-address');
    if (date && !date.value) {
      alert('Please select an event date before proceeding.');
      date.focus();
      return false;
    }
    if (addr && !addr.value.trim()) {
      alert('Please enter your event city or location in Southern California.');
      addr.focus();
      return false;
    }
  }

  if (currentStep === 2) {
    if (partyState.ageRanges.length === 0) {
      alert('Please select at least one age range for the children.');
      return false;
    }
  }

  return true;
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
  if (dateEl) dateEl.textContent = partyState.eventDate || 'Not selected';
  if (guestsEl) guestsEl.textContent = `${partyState.childrenCount} kids / ${partyState.estimatedGuests} guests`;
}

// Submission handler
function handleQuoteSubmission(e) {
  e.preventDefault();

  const name = document.getElementById('pb-contact-name');
  const email = document.getElementById('pb-contact-email');
  const phone = document.getElementById('pb-contact-phone');

  if (!name || !name.value.trim()) {
    alert('Please enter your full name.');
    name?.focus();
    return;
  }
  if (!email || !email.value.trim() || !email.value.includes('@')) {
    alert('Please enter a valid email address so we can send your quote.');
    email?.focus();
    return;
  }
  if (!phone || !phone.value.trim()) {
    alert('Please enter a valid phone number for quote follow-up.');
    phone?.focus();
    return;
  }

  // Generate Reference ID: PHP-2026-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const refCode = `PHP-2026-${randomSuffix}`;
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7-day expiration per PRD

  const inquiryRecord = {
    id: 'inq_' + Date.now(),
    refCode,
    submittedAt: now.toISOString(),
    expiresAt: expiryDate.toISOString(),
    status: 'pending_review',
    estimate: calculateEstimate(),
    details: { ...partyState }
  };

  // Store into localStorage to simulate backend DB storage
  const existingInquiries = JSON.parse(localStorage.getItem('php_inquiries') || '[]');
  existingInquiries.unshift(inquiryRecord);
  localStorage.setItem('php_inquiries', JSON.stringify(existingInquiries));

  // Show confirmation modal
  showConfirmationModal(inquiryRecord);
}

function showConfirmationModal(record) {
  const modal = document.getElementById('confirmation-modal');
  if (!modal) return;

  const refEl = document.getElementById('modal-ref-code');
  const customerNameEl = document.getElementById('modal-customer-name');
  const customerEmailEl = document.getElementById('modal-customer-email');
  const totalEl = document.getElementById('modal-estimate-total');
  const depositEl = document.getElementById('modal-estimate-deposit');

  if (refEl) refEl.textContent = record.refCode;
  if (customerNameEl) customerNameEl.textContent = record.details.contactName;
  if (customerEmailEl) customerEmailEl.textContent = record.details.contactEmail;
  if (totalEl) totalEl.textContent = record.estimate.subtotalFormatted;
  if (depositEl) depositEl.textContent = record.estimate.depositFormatted;

  modal.style.display = 'flex';
}
