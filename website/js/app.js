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
