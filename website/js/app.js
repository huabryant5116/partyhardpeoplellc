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
  eventVibe: 'kids',
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
  checkUrlVibeParams();
  updateSummarySidebar();
});

// Vibe & Event Experience Master Catalog
const PARTY_EXPERIENCES = {
  // Kids & Youth
  'birthday': { vibe: 'kids', label: '🎈 Kids Birthday Party (Ages 1–12)', page: 'experience-kids.html', desc: 'DJ dance games, musical statues, bubble blasts, and sanitized pastel bounce castles.' },
  'school': { vibe: 'kids', label: '🎈 School Carnival or Daycare Field Day', page: 'experience-kids.html', desc: 'High-throughput obstacle fun, child-safe inflatables, and interactive youth music hosts.' },
  'toddler': { vibe: 'kids', label: '🎈 Toddler & Soft Play Castle Celebration', page: 'experience-kids.html', desc: 'Gentle sensory songs, safe low-height bounce castles, and padded seating.' },
  'preteen': { vibe: 'kids', label: '🎈 Pre-Teen Dance Party & Glow Disco', page: 'experience-kids.html', desc: 'Karaoke jams, dance battles, dynamic laser lighting, and radio-clean hits.' },
  
  // Adult Social & Milestones
  'milestone': { vibe: 'adult', label: '🍸 Milestone Birthday (21st, 30th, 40th, 50th)', page: 'experience-adults.html', desc: 'Pro club audio tops, subwoofers, moving head lighting, and curated multi-decade playlists.' },
  'karaoke-lounge': { vibe: 'adult', label: '🍸 Private VIP Karaoke Lounge Experience', page: 'experience-adults.html', desc: '32" HD lyric monitor, twin studio wireless microphones, sound-reactive lighting, and 50k songs.' },
  'cocktail': { vibe: 'adult', label: '🍸 Backyard Cocktail Mixer & Patio Sound', page: 'experience-adults.html', desc: 'Crystal-clear acoustic sound tuned specifically for open-air patio conversation and evening toasts.' },
  'nightclub': { vibe: 'adult', label: '🍸 Milestone Dance Floor & Nightclub Audio', page: 'experience-adults.html', desc: 'High-energy open-format club DJ, laser truss array, and deep bass sound system.' },

  // Corporate & Brand Events
  'corporate-picnic': { vibe: 'corporate', label: '🏢 Annual Company Picnic (Family Day)', page: 'experience-corporate.html', desc: 'Dual inflatables, field games MC, quiet generator, tables/chairs, and full $2M COI insurance.' },
  'corporate-keynote': { vibe: 'corporate', label: '🏢 Corporate Keynote & Outdoor PA Audio', page: 'experience-corporate.html', desc: 'Multi-speaker wide distribution PA array, wireless lapel mics, and sound engineer setup.' },
  'holiday-gala': { vibe: 'corporate', label: '🏢 Corporate Holiday Gala & Staging', page: 'experience-corporate.html', desc: 'Ambient wireless uplighting, pro sound array, live DJ coordinator, and dance lighting.' },
  'team-building': { vibe: 'corporate', label: '🏢 Team Appreciation & Field Games', page: 'experience-corporate.html', desc: 'Organized corporate competitions, sound stage, and turnkey equipment setup.' },

  // Community & Festivals
  'community': { vibe: 'community', label: '🎪 Community / HOA Block Party', page: 'experience-community.html', desc: 'Commercial bounce castle, Bluetooth PA sound system, tables & chairs with asphalt anchoring.' },
  'school-festival': { vibe: 'community', label: '🎪 School PTA Carnival & Fundraiser', page: 'experience-community.html', desc: 'Multi-station obstacle inflatables, live games host, and volunteer-friendly coordination.' },
  'church-festival': { vibe: 'community', label: '🎪 Church & Religious Family Festival', page: 'experience-community.html', desc: 'Family-friendly crowd DJ, lawn games, sound distribution, and heavy-duty seating.' },
  'family-reunion': { vibe: 'community', label: '🎪 Large Family Reunion & Gathering', page: 'experience-community.html', desc: 'Wholesome multi-generational music host, shaded tables/chairs, and inflatable fun.' }
};

// Dropdown handler for Party Builder
function handlePartyExperienceDropdown(eventType) {
  partyState.eventType = eventType;
  const exp = PARTY_EXPERIENCES[eventType] || { vibe: 'kids', label: 'Custom Celebration', page: 'experience-kids.html', desc: '' };
  partyState.eventVibe = exp.vibe;
  
  const badgeLabel = document.getElementById('vibe-badge-label');
  if (badgeLabel) {
    badgeLabel.textContent = exp.label;
    if (exp.vibe === 'adult') {
      badgeLabel.className = 'badge';
      badgeLabel.style.background = '#EDE9FE';
      badgeLabel.style.color = '#7C3AED';
    } else if (exp.vibe === 'corporate') {
      badgeLabel.className = 'badge';
      badgeLabel.style.background = '#E0F2FE';
      badgeLabel.style.color = '#0284C7';
    } else if (exp.vibe === 'community') {
      badgeLabel.className = 'badge';
      badgeLabel.style.background = '#D1FAE5';
      badgeLabel.style.color = '#10B981';
    } else {
      badgeLabel.className = 'badge badge-coral';
      badgeLabel.style.background = '';
      badgeLabel.style.color = '';
    }
  }
  saveState();
}

// Dropdown handler for Landing Page
function handleLandingDropdownChange(val) {
  const exp = PARTY_EXPERIENCES[val];
  if (!exp) return;

  const descElem = document.getElementById('landing-dropdown-desc');
  if (descElem) descElem.textContent = exp.desc;

  const btnDetails = document.getElementById('landing-dropdown-btn-details');
  if (btnDetails) btnDetails.href = exp.page;

  const btnQuote = document.getElementById('landing-dropdown-btn-quote');
  if (btnQuote) {
    btnQuote.onclick = () => {
      const typeSelect = document.getElementById('pb-event-type');
      if (typeSelect) {
        typeSelect.value = val;
        handlePartyExperienceDropdown(val);
      }
      const builderSection = document.getElementById('party-builder');
      if (builderSection) builderSection.scrollIntoView({ behavior: 'smooth' });
    };
  }
}

// Hero Quick Selector Data & Switcher
const HERO_VIBE_PREVIEWS = {
  kids: {
    title: '🎈 Kids & Youth Birthday Packages (Ages 1–12)',
    desc: 'Commercial sanitized pastel bounce castles, high-energy kids DJ, musical freeze games, bubble blast stations, and balloon fun. 100% on-time early setup guarantee.',
    quoteType: 'birthday',
    quoteBtnText: 'Build Kids Quote →',
    quoteColor: '#FF476F',
    pageUrl: 'experience-kids.html'
  },
  adult: {
    title: '🍸 Adult Milestones & VIP Karaoke Lounges',
    desc: 'Private VIP karaoke lounges with 50,000+ licensed tracks, studio wireless mics, pro club sound, laser light shows, and patio cocktail audio. Strict decibel & sound-ordinance compliance.',
    quoteType: 'milestone',
    quoteBtnText: 'Build Adult Social Quote →',
    quoteColor: '#7C3AED',
    pageUrl: 'experience-adults.html'
  },
  corporate: {
    title: '🏢 Corporate Galas & Company Picnics',
    desc: 'Turnkey company picnics, employee appreciation celebrations, and outdoor keynote PA systems. $2M COI insurance certificates, W-9 vendor onboarding, and Net-30 invoicing.',
    quoteType: 'corporate-picnic',
    quoteBtnText: 'Build Corporate Quote →',
    quoteColor: '#0284C7',
    pageUrl: 'experience-corporate.html'
  },
  community: {
    title: '🎪 Community Festivals & School Carnivals',
    desc: 'School PTA carnivals, church family days, and neighborhood HOA block parties. High-capacity bounce houses, crowd sound distribution, and volunteer-friendly coordination.',
    quoteType: 'community',
    quoteBtnText: 'Build Festival Quote →',
    quoteColor: '#059669',
    pageUrl: 'experience-community.html'
  }
};

function switchLandingHeroVibe(vibeKey) {
  const data = HERO_VIBE_PREVIEWS[vibeKey] || HERO_VIBE_PREVIEWS.kids;
  ['kids', 'adult', 'corporate', 'community'].forEach(v => {
    const tab = document.getElementById(`vibe-tab-${v}`);
    if (tab) {
      if (v === vibeKey) {
        tab.style.border = `2px solid ${data.quoteColor}`;
        tab.style.background = v === 'kids' ? '#FFF1F2' : v === 'adult' ? '#EDE9FE' : v === 'corporate' ? '#E0F2FE' : '#D1FAE5';
      } else {
        tab.style.border = '1px solid var(--border-subtle)';
        tab.style.background = '#FFFFFF';
      }
    }
  });

  const titleEl = document.getElementById('vibe-preview-title');
  const descEl = document.getElementById('vibe-preview-desc');
  const quoteBtn = document.getElementById('vibe-preview-btn-quote');
  const pageBtn = document.getElementById('vibe-preview-btn-page');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (pageBtn) pageBtn.href = data.pageUrl;
  if (quoteBtn) {
    quoteBtn.textContent = data.quoteBtnText;
    quoteBtn.style.background = data.quoteColor;
    quoteBtn.style.borderColor = data.quoteColor;
    quoteBtn.onclick = (e) => {
      e.preventDefault();
      const typeSelect = document.getElementById('pb-event-type');
      if (typeSelect) {
        typeSelect.value = data.quoteType;
        handlePartyExperienceDropdown(data.quoteType);
      }
      const builderSection = document.getElementById('party-builder');
      if (builderSection) builderSection.scrollIntoView({ behavior: 'smooth' });
    };
  }
}

// URL query parameter loader
function checkUrlVibeParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const vibe = urlParams.get('vibe');
  const typeSelect = document.getElementById('pb-event-type');

  if (vibe) {
    // Map vibe to default type
    const vibeDefaults = {
      'kids': 'birthday',
      'adult': 'milestone',
      'corporate': 'corporate-picnic',
      'community': 'community'
    };
    const defaultType = vibeDefaults[vibe] || 'birthday';
    if (typeSelect) {
      typeSelect.value = defaultType;
      handlePartyExperienceDropdown(defaultType);
    }
    const landingSelect = document.getElementById('landing-party-experience-dropdown');
    if (landingSelect) {
      landingSelect.value = defaultType;
      handleLandingDropdownChange(defaultType);
    }
    switchLandingHeroVibe(vibe);
  }
}

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

// ========================================================
// OPTION A: "LOCK IT IN NOW" INSTANT BOOKING & DEPOSIT FLOW
// ========================================================
let checkoutState = {
  currentStep: 1,
  signatureDrawn: false,
  signatureDataUrl: null,
  confirmedBooking: null
};

let signaturePadContext = null;
let isDrawingSignature = false;

function validateContactStep() {
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

  return valid;
}

function openInstantBookingModal() {
  if (!validateContactStep()) return;

  const modal = document.getElementById('option-a-checkout-modal');
  if (!modal) return;

  const est = calculateEstimate();
  
  // Populate Step 1 Breakdown
  const exp = PARTY_EXPERIENCES[partyState.eventType] || { label: 'Custom Party Experience' };
  const eventTitleEl = document.getElementById('checkout-event-title');
  const eventDateEl = document.getElementById('checkout-event-date');
  const eventVenueEl = document.getElementById('checkout-event-venue');
  const contactEl = document.getElementById('checkout-client-name');
  
  if (eventTitleEl) eventTitleEl.textContent = exp.label;
  if (eventDateEl) eventDateEl.textContent = `${partyState.eventDate || 'Date Selected'} (${partyState.startTime} – ${partyState.endTime})`;
  if (eventVenueEl) eventVenueEl.textContent = `${partyState.address || 'Southern California Venue'} (${partyState.venueType})`;
  if (contactEl) contactEl.textContent = `${partyState.contactName} • ${partyState.contactPhone}`;

  // Line items
  const itemsListEl = document.getElementById('checkout-items-list');
  if (itemsListEl) {
    let itemsHtml = '';
    partyState.entertainment.forEach(k => {
      const item = CATALOG.entertainment[k];
      if (item) {
        itemsHtml += `<li style="display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px dashed rgba(255,255,255,0.08); font-size: 0.9rem;">
          <span>🎭 ${item.name}</span>
          <span style="font-weight: 600;">$${(item.basePriceCents / 100).toFixed(2)}</span>
        </li>`;
      }
    });

    Object.keys(partyState.rentals).forEach(k => {
      const count = partyState.rentals[k] || 0;
      const rental = CATALOG.rentals[k];
      if (count > 0 && rental) {
        itemsHtml += `<li style="display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px dashed rgba(255,255,255,0.08); font-size: 0.9rem;">
          <span>📦 ${rental.name} (x${count})</span>
          <span style="font-weight: 600;">$${((count * rental.unitPriceCents) / 100).toFixed(2)}</span>
        </li>`;
      }
    });

    itemsListEl.innerHTML = itemsHtml || '<li style="color: #94A3B8; font-size: 0.9rem;">Standard Package Inclusions</li>';
  }

  // Populate Financials
  const subtotalEl = document.getElementById('checkout-subtotal');
  const depositEl = document.getElementById('checkout-deposit');
  const balanceEl = document.getElementById('checkout-balance');
  const depositBtnEl = document.getElementById('checkout-pay-btn-text');

  if (subtotalEl) subtotalEl.textContent = est.subtotalFormatted;
  if (depositEl) depositEl.textContent = est.depositFormatted;
  if (balanceEl) balanceEl.textContent = est.balanceFormatted;
  if (depositBtnEl) depositBtnEl.textContent = `Authorize 25% Deposit (${est.depositFormatted})`;

  goToCheckoutStep(1);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Initialize canvas on step 2 transition or timeout
  setTimeout(initSignaturePad, 100);
}

function closeInstantBookingModal() {
  const modal = document.getElementById('option-a-checkout-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function goToCheckoutStep(step) {
  // Step validation
  if (step === 2) {
    // Advancing to contract: ensure signature pad is sized properly
    setTimeout(initSignaturePad, 80);
  } else if (step === 3) {
    // Advancing to payment: require signature and agreement checkbox
    const agreeCheck = document.getElementById('agreement-terms-check');
    if (agreeCheck && !agreeCheck.checked) {
      alert('Please check the box confirming you accept the Party Hard People LLC Event Service Agreement.');
      agreeCheck.focus();
      return;
    }
    if (!checkoutState.signatureDrawn) {
      alert('Please provide your digital e-signature in the box below to authorize the reservation.');
      return;
    }
    // Save signature data
    const canvas = document.getElementById('checkout-signature-canvas');
    if (canvas) checkoutState.signatureDataUrl = canvas.toDataURL('image/png');
  }

  checkoutState.currentStep = step;

  // Toggle step panes
  for (let i = 1; i <= 4; i++) {
    const pane = document.getElementById(`checkout-step-${i}`);
    const indicator = document.getElementById(`checkout-indicator-${i}`);
    if (pane) pane.style.display = (i === step) ? 'block' : 'none';
    if (indicator) {
      indicator.classList.remove('active', 'completed');
      if (i === step) indicator.classList.add('active');
      else if (i < step) indicator.classList.add('completed');
    }
  }
}

// HTML5 Smooth Signature Pad Controller
function initSignaturePad() {
  const canvas = document.getElementById('checkout-signature-canvas');
  if (!canvas) return;

  // Set physical display resolution for sharp rendering
  const rect = canvas.getBoundingClientRect();
  if (rect.width > 0 && canvas.width !== rect.width) {
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  const ctx = canvas.getContext('2d');
  signaturePadContext = ctx;
  ctx.strokeStyle = '#8B5CF6';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - r.left,
      y: clientY - r.top
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawingSignature = true;
    checkoutState.signatureDrawn = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawingSignature) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw() {
    isDrawingSignature = false;
  }

  canvas.onmousedown = startDraw;
  canvas.onmousemove = draw;
  window.onmouseup = endDraw;

  canvas.ontouchstart = startDraw;
  canvas.ontouchmove = draw;
  canvas.ontouchend = endDraw;
}

function clearSignaturePad() {
  const canvas = document.getElementById('checkout-signature-canvas');
  if (!canvas || !signaturePadContext) return;
  signaturePadContext.clearRect(0, 0, canvas.width, canvas.height);
  checkoutState.signatureDrawn = false;
  checkoutState.signatureDataUrl = null;
}

// Payment Card Formatting and Brand Detection
function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 16) val = val.substring(0, 16);
  let formatted = val.replace(/(\d{4})/g, '$1 ').trim();
  input.value = formatted;

  // Brand detection
  const brandIcon = document.getElementById('card-brand-icon');
  if (brandIcon) {
    if (val.startsWith('4')) {
      brandIcon.textContent = '💳 Visa';
      brandIcon.style.color = '#38BDF8';
    } else if (/^5[1-5]/.test(val) || /^2[2-7]/.test(val)) {
      brandIcon.textContent = '💳 Mastercard';
      brandIcon.style.color = '#F97316';
    } else if (/^3[47]/.test(val)) {
      brandIcon.textContent = '💳 Amex';
      brandIcon.style.color = '#34D399';
    } else if (/^6(?:011|5)/.test(val)) {
      brandIcon.textContent = '💳 Discover';
      brandIcon.style.color = '#F59E0B';
    } else {
      brandIcon.textContent = '💳 Card';
      brandIcon.style.color = '#94A3B8';
    }
  }
}

function formatCardExpiry(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 4) val = val.substring(0, 4);
  if (val.length >= 2) {
    input.value = val.substring(0, 2) + '/' + val.substring(2);
  } else {
    input.value = val;
  }
}

// Process Instant 25% Deposit Authorization
function processDepositPayment(e) {
  if (e) e.preventDefault();

  const cardName = document.getElementById('card-holder-name');
  const cardNumber = document.getElementById('card-number');
  const cardExpiry = document.getElementById('card-expiry');
  const cardCvc = document.getElementById('card-cvc');
  const cardZip = document.getElementById('card-zip');

  if (!cardName || !cardName.value.trim()) {
    alert('Please enter the name on the credit card.');
    cardName.focus();
    return;
  }

  const rawNum = cardNumber ? cardNumber.value.replace(/\s/g, '') : '';
  if (rawNum.length < 15) {
    alert('Please enter a valid 15 or 16-digit credit card number.');
    cardNumber.focus();
    return;
  }

  if (!cardExpiry || cardExpiry.value.length < 5) {
    alert('Please enter a valid card expiration date (MM/YY).');
    cardExpiry.focus();
    return;
  }

  if (!cardCvc || cardCvc.value.length < 3) {
    alert('Please enter the 3 or 4-digit CVC code on the back of your card.');
    cardCvc.focus();
    return;
  }

  if (!cardZip || cardZip.value.length < 5) {
    alert('Please enter a valid 5-digit billing ZIP code.');
    cardZip.focus();
    return;
  }

  const payBtn = document.getElementById('checkout-submit-pay-btn');
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = '⚡ Authorizing 25% Deposit with Gateway...';
  }

  const est = calculateEstimate();
  const bookingSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `PHP-BOOK-${bookingSuffix}`;
  const now = new Date();

  // Simulating 1.2s gateway authorization turnaround
  setTimeout(() => {
    const bookingRecord = {
      id: 'book_' + Date.now(),
      refCode: bookingRef,
      bookingType: 'Option A: Lock It In Now (Instant Deposit)',
      status: 'confirmed_paid',
      submittedAt: now.toISOString(),
      depositPaidCents: est.depositCents,
      depositPaidFormatted: est.depositFormatted,
      balanceDueCents: est.balanceCents,
      balanceDueFormatted: est.balanceFormatted,
      totalAmountFormatted: est.subtotalFormatted,
      paymentMethod: {
        brand: document.getElementById('card-brand-icon') ? document.getElementById('card-brand-icon').textContent.replace('💳 ', '') : 'Visa',
        last4: rawNum.slice(-4),
        cardholder: cardName.value.trim(),
        zip: cardZip.value.trim(),
        authorizedAt: now.toISOString(),
        authTransactionId: 'tx_' + Math.random().toString(36).substring(2, 11).toUpperCase()
      },
      eSignature: {
        signerName: cardName.value.trim(),
        signedAt: now.toISOString(),
        signatureImage: checkoutState.signatureDataUrl || 'digital_esign_captured'
      },
      details: { ...partyState }
    };

    checkoutState.confirmedBooking = bookingRecord;

    // Persist into database
    const inquiries = JSON.parse(localStorage.getItem('php_inquiries') || '[]');
    inquiries.unshift(bookingRecord);
    localStorage.setItem('php_inquiries', JSON.stringify(inquiries));

    // Audit log integration
    if (typeof WorkforceManager !== 'undefined' && WorkforceManager.recordAudit) {
      WorkforceManager.recordAudit(
        'INSTANT_BOOKING_DEPOSIT_PAID',
        `Client ${partyState.contactName} locked in booking ${bookingRef} with 25% deposit (${est.depositFormatted}). Date: ${partyState.eventDate}.`,
        'Payment Gateway (Client Self-Service)'
      );
    }

    // Populate Receipt View
    const recRefEl = document.getElementById('receipt-booking-ref');
    const recPaidEl = document.getElementById('receipt-paid-amount');
    const recBalanceEl = document.getElementById('receipt-balance-amount');
    const recEventEl = document.getElementById('receipt-event-summary');
    const recCardEl = document.getElementById('receipt-card-summary');

    if (recRefEl) recRefEl.textContent = bookingRef;
    if (recPaidEl) recPaidEl.textContent = est.depositFormatted;
    if (recBalanceEl) recBalanceEl.textContent = est.balanceFormatted;
    if (recEventEl) recEventEl.textContent = `${partyState.eventDate} (${partyState.startTime} – ${partyState.endTime}) at ${partyState.address}`;
    if (recCardEl) recCardEl.textContent = `${bookingRecord.paymentMethod.brand} ending in ${bookingRecord.paymentMethod.last4}`;

    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = 'Deposit Confirmed! ✓';
    }

    goToCheckoutStep(4);
  }, 1200);
}

function printBookingReceipt() {
  window.print();
}

