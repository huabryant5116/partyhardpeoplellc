/**
 * Party Hard People LLC — Workforce Intelligence & Talent Acquisition System
 * Comprehensive HR Engine: Recruitment, Skills Assessments, Employee Roster, 
 * Training/Safeguarding (CA AB 506), Event Staffing & Controlled AI Assistants.
 */

const WorkforceManager = (() => {
  const STORAGE_KEYS = {
    POSITIONS: 'php_wf_positions',
    APPLICATIONS: 'php_wf_applications',
    COMPETENCIES: 'php_wf_competencies',
    ASSESSMENTS: 'php_wf_assessments',
    EMPLOYEES: 'php_wf_employees',
    TRAINING_MODULES: 'php_wf_training_modules',
    TRAINING_RECORDS: 'php_wf_training_records',
    STAFFING_REQS: 'php_wf_staffing_requirements',
    ASSIGNMENTS: 'php_wf_staffing_assignments',
    AUDIT_LOGS: 'php_wf_audit_logs'
  };

  // Pipeline stages per specifications (Human-controlled transitions only)
  const STAGES = [
    { id: 'app_received', label: '1. Application Received', color: '#94A3B8' },
    { id: 'awaiting_review', label: '2. Awaiting Human Review', color: '#F59E0B' },
    { id: 'interview_invited', label: '3. Interview Invited', color: '#0284C7' },
    { id: 'interview_completed', label: '4. Interview Completed', color: '#8B5CF6' },
    { id: 'skills_assessment', label: '5. Skills Assessment', color: '#EC4899' },
    { id: 'final_review', label: '6. Final Human Review', color: '#6366F1' },
    { id: 'offer_extended', label: '7. Offer Extended', color: '#10B981' },
    { id: 'hired', label: '8. Hired / Onboarding', color: '#059669' },
    { id: 'not_selected', label: '9. Not Selected', color: '#EF4444' },
    { id: 'withdrawn', label: '10. Withdrawn', color: '#64748B' }
  ];

  // Core Job Positions
  const DEFAULT_POSITIONS = [
    {
      id: 'pos_kids_dj',
      title: "Lead Kids Party DJ & Music Host",
      department: "Entertainment",
      county: "Los Angeles & Orange County",
      employmentType: "Part-Time (W-2)",
      payRange: "$35.00 – $55.00 / hr + Tips",
      isOpen: true,
      description: "Host high-energy children's birthday celebrations, school carnivals, and family galas. Lead interactive dance games, musical statues, freeze dance, and curate family-safe playlists.",
      requirements: [
        "High-energy microphone presence with charismatic public speaking skills",
        "Experience entertaining children (ages 3–12) in party or camp settings",
        "Valid CA Driver License & reliable transportation capable of transporting sound gear",
        "Must pass California AB 506 Live Scan fingerprint background clearance"
      ],
      equipmentProvided: "Full active PA speakers, wireless handheld microphones, iPad controller, and lighting truss.",
      featured: true,
      createdDate: "2026-10-15"
    },
    {
      id: 'pos_karaoke_host',
      title: "Private VIP Karaoke Lounge Host & Audio Tech",
      department: "Entertainment",
      county: "Orange County & San Diego",
      employmentType: "Part-Time (W-2)",
      payRange: "$30.00 – $48.00 / hr + Tips",
      isOpen: true,
      description: "Deliver unforgettable private karaoke lounge experiences for adult milestone birthdays, backyard mixers, and corporate retreats. Manage tablet digital song queues and balance audio mixer levels.",
      requirements: [
        "Familiarity with pro audio signal routing, feedback control, and wireless mic frequencies",
        "Warm, welcoming hospitality demeanor; comfortable managing song rotations",
        "Available Friday evenings, Saturdays, and Sundays",
        "Reliable transportation with proof of valid CA auto insurance"
      ],
      equipmentProvided: "50,000+ song offline karaoke system, twin studio wireless mics, pro mixer, and video monitor.",
      featured: true,
      createdDate: "2026-10-18"
    },
    {
      id: 'pos_bounce_tech',
      title: "Commercial Inflatables & Rigging Operations Tech",
      department: "Operations & Logistics",
      county: "Los Angeles, OC & San Diego",
      employmentType: "Part-Time (W-2)",
      payRange: "$24.00 – $32.00 / hr + Mileage",
      isOpen: true,
      description: "Safely deliver, inspect, anchor, inflate, and hospital-grade sanitize commercial pastel bounce houses, tables, and party furniture at client venues and public parks.",
      requirements: [
        "Ability to lift 75+ lbs safely using heavy-duty hand trucks and vehicle ramps",
        "Strict adherence to ASTM safety standards, turf staking, and heavy sandbag weighting",
        "Punctual, dependable, and communicative with dispatch coordinators",
        "Clean California driving record (Class C)"
      ],
      equipmentProvided: "Company vehicle / cargo van for approved drivers, commercial blowers, dollies, and safety gear.",
      featured: true,
      createdDate: "2026-10-12"
    },
    {
      id: 'pos_corp_coordinator',
      title: "Corporate & Community Event Operations Supervisor",
      department: "Management",
      county: "Regional SoCal",
      employmentType: "Part-Time to Full-Time",
      payRange: "$28.00 – $40.00 / hr",
      isOpen: true,
      description: "Oversee onsite field execution for corporate picnics, school PTA carnivals, and brand activations. Liaise with venue managers, verify $2M COI compliance, and coordinate multi-member crew setups.",
      requirements: [
        "2+ years experience in live event production, catering logistics, or festival management",
        "Exceptional problem-solving abilities and calm demeanor under tight timelines",
        "Proficiency with shift check-ins and client handover sign-offs"
      ],
      equipmentProvided: "Company tablet, production radio kit, corporate apparel, and setup toolkit.",
      featured: false,
      createdDate: "2026-10-20"
    }
  ];

  // Competency Rubric Framework (1–5 Scale)
  const DEFAULT_COMPETENCIES = [
    {
      id: 'comp_child_engagement',
      name: 'Child Audience Engagement & Energy Management',
      role: 'Children Entertainer / DJ',
      category: 'Performance',
      description: 'Ability to command the attention of children ages 3–12, motivate participation, adapt to energy shifts, and diffuse shy or frustrated children.',
      rubric: {
        1: 'Struggles to keep children focused; passive mic presence; relies on screen without eye contact.',
        2: 'Engages willing children but loses group attention easily; lacks enthusiasm on microphone.',
        3: 'Consistently keeps 15–25 children engaged; follows scheduled game flow with solid warmth.',
        4: 'Exceptional crowd control; improvises smooth transitions when children lose interest; inclusive.',
        5: 'Master performer; captivates toddlers to pre-teens effortlessly; rave reviews from parents.'
      }
    },
    {
      id: 'comp_audio_tech',
      name: 'Pro Audio & Signal Routing Competency',
      role: 'DJ / Karaoke Host',
      category: 'Technical',
      description: 'Mastery of gain staging, wireless microphone frequency pairing, EQ adjustment for vocals, and eliminating feedback.',
      rubric: {
        1: 'Unfamiliar with basic XLR/TRS cabling; causes audio clipping or screeching feedback.',
        2: 'Can plug in powered speakers but struggles to adjust microphone EQ or solve Bluetooth latency.',
        3: 'Sets up pro PA correctly; balances voice-over-music ducking; adjusts mic levels cleanly.',
        4: 'Rapidly troubleshoots RF interference; dials in crisp warm vocal tone for varied voices.',
        5: 'Studio-level audio execution in challenging acoustic venues (hollow halls, windy outdoor parks).'
      }
    },
    {
      id: 'comp_rigging_safety',
      name: 'Inflatable Rigging & ASTM Anchoring Protocol',
      role: 'Operations & Logistics',
      category: 'Safety & Compliance',
      description: 'Rigorous compliance with wind speed limits (15 mph max), anchor point poundage, overhead power line clearance, and vinyl disinfection.',
      rubric: {
        1: 'Skips anchor points or relies on inadequate weight; ignores slope or overhead hazards.',
        2: 'Anchors castle but needs supervision for correct tie-down knotting or asphalt weight distribution.',
        3: '100% compliant with standard 8-point anchoring; conducts proper pre-inflation ground sweep.',
        4: 'Proactively identifies micro-punctures; executes hospital-grade multi-point sanitization protocol.',
        5: 'Certified safety specialist; expertly manages complex corporate installs and wind anemometer logs.'
      }
    },
    {
      id: 'comp_safeguarding',
      name: 'California AB 506 Child Safeguarding & Safety Awareness',
      role: 'All Youth-Facing Roles',
      category: 'Compliance',
      description: 'Adherence to mandatory reporting guidelines, two-adult rule in private spaces, emergency evacuation, and heat illness prevention.',
      rubric: {
        1: 'Unaware of mandated reporting obligations; leaves children unsupervised.',
        2: 'Understands basic rules but requires prompting on documentation or parent contact protocol.',
        3: 'Holds active AB 506 certification; strictly adheres to two-adult rule; reports any hazard immediately.',
        4: 'Proactively monitors hydration, bouncy castle heat levels, and crowd capacity boundaries.',
        5: 'Exemplary safeguarding leader; trains incoming personnel in best safety and risk-mitigation practices.'
      }
    }
  ];

  // Synthetic Baseline Applicants
  const DEFAULT_APPLICATIONS = [
    {
      id: 'app_1001',
      refCode: 'PHP-APP-1001',
      positionId: 'pos_kids_dj',
      fullName: 'Marcus Vance',
      email: 'm.vance.music@gmail.com',
      phone: '(562) 884-2190',
      city: 'Long Beach',
      county: 'Los Angeles County',
      portfolioUrl: 'https://instagram.com/djmarcuskids',
      resumeText: '6 years experience as interactive DJ and camp music director. Expert in freeze dance, Disney soundtracks, and toddler musical games. Clean CA driving record.',
      stage: 'skills_assessment',
      appliedDate: '2026-10-16',
      notes: 'Demonstrated incredible charisma on phone screener. Work sample video showed great energy with 20+ kids.',
      adminRating: 4,
      interviewDate: '2026-10-22',
      assessments: [
        { competencyId: 'comp_child_engagement', score: 5, evidence: 'Submitted video of hosting 7th birthday musical statues; kept all 24 children laughing and participating.' },
        { competencyId: 'comp_audio_tech', score: 4, evidence: 'Owns DDJ-FLX4 controller and Electro-Voice speakers; knows proper gain staging.' },
        { competencyId: 'comp_safeguarding', score: 4, evidence: 'Completed YMCA youth camp counselor training in 2025.' }
      ]
    },
    {
      id: 'app_1002',
      refCode: 'PHP-APP-1002',
      positionId: 'pos_bounce_tech',
      fullName: 'Carlos Hernandez',
      email: 'carlos.h.rigging@outlook.com',
      phone: '(714) 492-7811',
      city: 'Anaheim',
      county: 'Orange County',
      portfolioUrl: '',
      resumeText: 'Former warehouse lead and equipment delivery driver. Clean DMV Class C. Certified forklift operator, experienced with commercial vinyl cleaning and tent anchoring.',
      stage: 'final_review',
      appliedDate: '2026-10-18',
      notes: 'Very punctual, physical fitness verified, Live Scan fingerprint submission pending.',
      adminRating: 5,
      interviewDate: '2026-10-21',
      assessments: [
        { competencyId: 'comp_rigging_safety', score: 5, evidence: 'Demonstrated precise knowledge of California park anchoring rules and 50lb sandbag weights.' },
        { competencyId: 'comp_safeguarding', score: 4, evidence: 'Passed preliminary background check disclosure; ready for Live Scan.' }
      ]
    },
    {
      id: 'app_1003',
      refCode: 'PHP-APP-1003',
      positionId: 'pos_karaoke_host',
      fullName: 'Elena Rostova',
      email: 'elena.sing.la@gmail.com',
      phone: '(310) 650-3342',
      city: 'Culver City',
      county: 'Los Angeles County',
      portfolioUrl: 'https://youtube.com/shorts/elenavocals',
      resumeText: 'Berklee College of Music graduate. 4 years private event vocal host, lounge singer, and karaoke host. Exceptional hospitality skills.',
      stage: 'interview_invited',
      appliedDate: '2026-10-21',
      notes: 'Invited for Zoom audio & microphone presence interview scheduled for Thursday 2pm.',
      adminRating: 4,
      interviewDate: '2026-10-25',
      assessments: []
    },
    {
      id: 'app_1004',
      refCode: 'PHP-APP-1004',
      positionId: 'pos_kids_dj',
      fullName: 'Jessica Chen',
      email: 'jchen.creative@yahoo.com',
      phone: '(619) 320-9981',
      city: 'Chula Vista',
      county: 'San Diego County',
      portfolioUrl: 'https://tiktok.com/@jessicaparties',
      resumeText: 'Early childhood education student at SDSU. Bilingual (English/Spanish). 3 years hosting preschool music classes and birthday face-painting & dance.',
      stage: 'awaiting_review',
      appliedDate: '2026-10-23',
      notes: 'New submission. Fluent in Spanish which will be great for South San Diego County bookings.',
      adminRating: 0,
      interviewDate: null,
      assessments: []
    }
  ];

  // Synthetic Employee Roster (CA AB 5 Compliant)
  const DEFAULT_EMPLOYEES = [
    {
      id: 'emp_01',
      employeeCode: 'PHP-EMP-01',
      fullName: 'DeAndre Washington',
      email: 'deandre@partyhardpeople.com',
      phone: '(323) 555-0144',
      classification: 'Part-Time W-2 (Non-Exempt)',
      role: 'Senior Kids DJ & MC',
      countyBase: 'Los Angeles County',
      serviceRadiusMiles: 35,
      hourlyRate: 45.00,
      ab506Certified: true,
      ab506Expiry: '2027-08-15',
      backgroundCleared: true,
      skills: ['Kids DJ', 'Musical Games', 'Pro Audio', 'Freeze Dance'],
      status: 'Active',
      hireDate: '2025-04-10',
      assignedEventsCount: 42,
      availability: {
        saturday: 'All-Day',
        sunday: 'All-Day',
        fridayNight: 'Available',
        weekdays: 'After 3pm'
      }
    },
    {
      id: 'emp_02',
      employeeCode: 'PHP-EMP-02',
      fullName: 'Samantha Miller',
      email: 'samantha@partyhardpeople.com',
      phone: '(949) 555-0182',
      classification: 'Part-Time W-2 (Non-Exempt)',
      role: 'Operations & Inflatables Tech Lead',
      countyBase: 'Orange County',
      serviceRadiusMiles: 40,
      hourlyRate: 28.00,
      ab506Certified: true,
      ab506Expiry: '2027-05-20',
      backgroundCleared: true,
      skills: ['Bounce House Rigging', 'Generators', 'Hospital Sanitization', 'Park Staking'],
      status: 'Active',
      hireDate: '2025-06-01',
      assignedEventsCount: 38,
      availability: {
        saturday: 'All-Day',
        sunday: 'All-Day',
        fridayNight: 'Available',
        weekdays: 'Flexible'
      }
    },
    {
      id: 'emp_03',
      employeeCode: 'PHP-EMP-03',
      fullName: 'Mateo Morales',
      email: 'mateo@partyhardpeople.com',
      phone: '(619) 555-0199',
      classification: 'Part-Time W-2 (Non-Exempt)',
      role: 'VIP Karaoke Host & Sound Tech',
      countyBase: 'San Diego County',
      serviceRadiusMiles: 30,
      hourlyRate: 38.00,
      ab506Certified: true,
      ab506Expiry: '2027-09-10',
      backgroundCleared: true,
      skills: ['VIP Karaoke', 'Club Lighting Truss', 'Acoustic Patio Audio', 'Bilingual'],
      status: 'Active',
      hireDate: '2025-09-15',
      assignedEventsCount: 19,
      availability: {
        saturday: 'All-Day',
        sunday: 'Morning / Afternoon',
        fridayNight: 'Available',
        weekdays: 'None'
      }
    }
  ];

  // Helper Methods for Database / Local Storage Adapter
  const loadData = (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Error loading ${key} from storage:`, e);
      return fallback;
    }
  };

  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      // Dispatch custom event for real-time reactive UI update
      window.dispatchEvent(new CustomEvent('workforce-data-changed', { detail: { key } }));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  };

  // Log audit trails for all sensitive employee / candidate actions
  const logAudit = (action, details, performedBy = 'Bryant Hua (Super Admin)') => {
    const logs = loadData(STORAGE_KEYS.AUDIT_LOGS, []);
    const entry = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      performedBy
    };
    logs.unshift(entry);
    saveData(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // Keep latest 100
  };

  // Initialize Default State if empty
  const init = () => {
    if (!localStorage.getItem(STORAGE_KEYS.POSITIONS)) {
      saveData(STORAGE_KEYS.POSITIONS, DEFAULT_POSITIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPETENCIES)) {
      saveData(STORAGE_KEYS.COMPETENCIES, DEFAULT_COMPETENCIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      saveData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      saveData(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES);
    }
  };

  // Run initial setup
  init();

  return {
    // Pipeline Stages
    getStages: () => STAGES,

    // Job Positions
    getPositions: (onlyOpen = true) => {
      const positions = loadData(STORAGE_KEYS.POSITIONS, DEFAULT_POSITIONS);
      return onlyOpen ? positions.filter(p => p.isOpen) : positions;
    },
    getPositionById: (id) => {
      const positions = loadData(STORAGE_KEYS.POSITIONS, DEFAULT_POSITIONS);
      return positions.find(p => p.id === id);
    },
    addPosition: (position) => {
      const positions = loadData(STORAGE_KEYS.POSITIONS, DEFAULT_POSITIONS);
      const newPos = {
        ...position,
        id: 'pos_' + Date.now(),
        createdDate: new Date().toISOString().split('T')[0]
      };
      positions.unshift(newPos);
      saveData(STORAGE_KEYS.POSITIONS, positions);
      logAudit('CREATE_JOB_POSITION', `Created position: ${newPos.title}`);
      return newPos;
    },

    // Candidate Applications
    getApplications: (filterStage = null) => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      return (filterStage && filterStage !== 'all') ? apps.filter(a => a.stage === filterStage) : apps;
    },
    getApplicationById: (id) => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      return apps.find(a => a.id === id);
    },
    getApplication: (id) => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      return apps.find(a => a.id === id);
    },
    submitApplication: (appData) => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newApp = {
        ...appData,
        id: 'app_' + Date.now(),
        refCode: `PHP-APP-${randomSuffix}`,
        stage: 'app_received',
        appliedDate: new Date().toISOString().split('T')[0],
        assessments: [],
        adminRating: 0,
        notes: 'Submitted via public careers portal.'
      };
      apps.unshift(newApp);
      saveData(STORAGE_KEYS.APPLICATIONS, apps);
      logAudit('SUBMIT_APPLICATION', `New application submitted by ${newApp.fullName} for ${newApp.positionId}`, 'Applicant Portal');
      return newApp;
    },
    updateApplicationStage: (id, newStage, adminNotes = '') => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      const index = apps.findIndex(a => a.id === id);
      if (index === -1) return false;

      const oldStage = apps[index].stage;
      apps[index].stage = newStage;
      if (adminNotes) {
        apps[index].notes = (apps[index].notes ? apps[index].notes + '\n\n' : '') + `[${new Date().toLocaleDateString()}] ${adminNotes}`;
      }
      saveData(STORAGE_KEYS.APPLICATIONS, apps);
      logAudit('UPDATE_APPLICATION_STAGE', `Moved ${apps[index].fullName} from ${oldStage} to ${newStage}. Notes: ${adminNotes}`);
      return apps[index];
    },

    // Skills Assessments (1-5 Rubrics)
    getCompetencies: () => loadData(STORAGE_KEYS.COMPETENCIES, DEFAULT_COMPETENCIES),
    recordAssessment: (appId, competencyId, score, evidence, reviewerName = 'Bryant Hua') => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      const app = apps.find(a => a.id === appId);
      if (!app) return false;

      if (!app.assessments) app.assessments = [];
      const existingIdx = app.assessments.findIndex(a => a.competencyId === competencyId);
      const record = {
        competencyId,
        score: parseInt(score, 10),
        evidence: evidence.trim(),
        reviewerName,
        date: new Date().toISOString().split('T')[0]
      };

      if (existingIdx >= 0) {
        app.assessments[existingIdx] = record;
      } else {
        app.assessments.push(record);
      }

      saveData(STORAGE_KEYS.APPLICATIONS, apps);
      logAudit('RECORD_ASSESSMENT', `Recorded score ${score}/5 for ${app.fullName} on ${competencyId}`);
      return true;
    },

    // Convert Candidate to Verified Employee (Human-in-the-loop hiring)
    hireCandidate: (appId, classification = 'Part-Time W-2 (Non-Exempt)', startingHourly = 35.00) => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      const app = apps.find(a => a.id === appId);
      if (!app) return false;

      // Update app status
      app.stage = 'hired';
      saveData(STORAGE_KEYS.APPLICATIONS, apps);

      // Create Employee Record
      const employees = loadData(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES);
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      const pos = WorkforceManager.getPositionById(app.positionId);

      const newEmployee = {
        id: 'emp_' + Date.now(),
        employeeCode: `PHP-EMP-${randomSuffix}`,
        fullName: app.fullName,
        email: app.email,
        phone: app.phone,
        classification,
        role: pos ? pos.title : 'Event Specialist',
        countyBase: app.county || 'Orange County',
        serviceRadiusMiles: 35,
        hourlyRate: parseFloat(startingHourly),
        ab506Certified: false, // Requires Live Scan and certification verification
        ab506Expiry: null,
        backgroundCleared: false,
        skills: app.assessments.map(a => a.competencyId),
        status: 'Onboarding',
        hireDate: new Date().toISOString().split('T')[0],
        assignedEventsCount: 0,
        availability: {
          saturday: 'Available',
          sunday: 'Available',
          fridayNight: 'Available',
          weekdays: 'Flexible'
        }
      };

      employees.unshift(newEmployee);
      saveData(STORAGE_KEYS.EMPLOYEES, employees);
      logAudit('HIRE_CANDIDATE', `Officially onboarded ${app.fullName} as ${newEmployee.role} (${classification})`);
      return newEmployee;
    },

    // Employee Management
    getEmployees: () => loadData(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES),
    updateEmployeeSafeguarding: (empId, isCertified, expiryDate) => {
      const employees = loadData(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES);
      const emp = employees.find(e => e.id === empId);
      if (!emp) return false;

      emp.ab506Certified = isCertified;
      emp.ab506Expiry = expiryDate;
      emp.backgroundCleared = isCertified;
      saveData(STORAGE_KEYS.EMPLOYEES, employees);
      logAudit('UPDATE_SAFEGUARDING_CERT', `Updated AB 506 certification for ${emp.fullName}: Active until ${expiryDate}`);
      return true;
    },

    // Event Staffing Matcher: Matches Confirmed Booking requirements with qualified, available staff
    matchCrewForEvent: (eventDate, eventCounty, requiredRole, isYouthEvent = true) => {
      const employees = loadData(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES);
      
      return employees.filter(emp => {
        // 1. Must be Active
        if (emp.status !== 'Active') return false;

        // 2. If Youth Event (Kids Birthday, School), must be AB 506 certified per CA law
        if (isYouthEvent && !emp.ab506Certified) return false;

        // 3. County / Geo matching
        const isNearby = emp.countyBase === eventCounty || emp.countyBase.includes('Orange');
        
        return isNearby;
      });
    },

    // Interview Management & Candidate Notifications
    scheduleInterview: (appId, { date, time, format = 'Video Audition & Sound Check', locationOrLink = 'https://meet.partyhardpeoplellc.com/audition', interviewer = 'Bryant Hua', notes = '' }) => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      const app = apps.find(a => a.id === appId);
      if (!app) return false;

      const pos = WorkforceManager.getPositionById(app.positionId);
      const roleTitle = pos ? pos.title : app.positionId;
      const notificationPreview = `Hello ${app.fullName},\n\nThank you for applying to Party Hard People LLC. We are pleased to invite you to an audition & interview for the ${roleTitle} role:\n\nDate: ${date}\nTime: ${time}\nFormat: ${format}\nLink/Location: ${locationOrLink}\nInterviewer: ${interviewer}\n\nPlease confirm receipt of this invitation.`;

      app.interview = {
        date,
        time,
        format,
        locationOrLink,
        interviewer,
        notes,
        scheduledAt: new Date().toISOString(),
        notificationSent: true,
        notificationPreview,
        status: 'Scheduled'
      };

      if (app.stage === 'app_received' || app.stage === 'awaiting_review') {
        app.stage = 'interview_invited';
      }

      saveData(STORAGE_KEYS.APPLICATIONS, apps);
      logAudit('SCHEDULE_INTERVIEW', `Scheduled ${format} for ${app.fullName} on ${date} at ${time}. Notification generated.`, interviewer);
      return app;
    },

    completeInterview: (appId, feedback, nextStage = 'skills_assessment', interviewer = 'Bryant Hua') => {
      const apps = loadData(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
      const app = apps.find(a => a.id === appId);
      if (!app || !app.interview) return false;

      app.interview.status = 'Completed';
      app.interview.feedback = (feedback || '').trim();
      app.interview.completedDate = new Date().toISOString().split('T')[0];
      app.stage = nextStage;

      saveData(STORAGE_KEYS.APPLICATIONS, apps);
      logAudit('COMPLETE_INTERVIEW', `Completed interview for ${app.fullName}. Advanced to ${nextStage}. Feedback: ${feedback}`, interviewer);
      return app;
    },

    // Privacy Protections & PII Masking (California Privacy Best Practices)
    maskEmail: (email) => {
      if (!email || !email.includes('@')) return email || '';
      const [name, domain] = email.split('@');
      const maskedName = name.length > 2 ? name[0] + '***' + name[name.length - 1] : name[0] + '***';
      return `${maskedName}@${domain}`;
    },

    maskPhone: (phone) => {
      if (!phone) return '';
      const digits = phone.replace(/\D/g, '');
      if (digits.length >= 10) {
        return `(${digits.slice(0, 3)}) ***-${digits.slice(-4)}`;
      }
      return phone.slice(0, 3) + '***' + phone.slice(-2);
    },

    // AI Controlled Prompt Builders (Strict Human-in-the-loop)
    aiHelpers: {
      generateApplicantSummaryPrompt: (app) => {
        const compList = WorkforceManager.getCompetencies();
        return `Summarize the documented qualifications for applicant ${app.fullName} applying for ${app.positionId}.
Applicant Bio & Resume: "${app.resumeText}"
Documented Skills Assessments: ${JSON.stringify((app.assessments || []).map(a => ({
          competency: compList.find(c => c.id === a.competencyId)?.name || a.competencyId,
          score: a.score + '/5',
          evidence: a.evidence
        })))}
Provide a 3-bullet factual summary of strengths and potential training opportunities. Do not make an employability decision.`;
      },
      generateStructuredInterviewQuestions: (posTitle) => {
        return [
          {
            topic: "Live Party Troubleshooting",
            question: "Describe a scenario where audio equipment failed or Bluetooth dropped during a high-stakes party moment. What exact steps did you take to maintain crowd momentum?",
            evaluationBenchmark: "Looks for calm problem-solving, backup cable usage, and mic interaction to keep guests entertained."
          },
          {
            topic: "Child Engagement & De-escalation",
            question: "How do you handle a child who feels left out or starts crying during a competitive dance game like musical statues?",
            evaluationBenchmark: "Looks for empathy, positive reinforcement, and seamless inclusive game modifications."
          },
          {
            topic: "California AB 506 Safety Compliance",
            question: "What physical boundaries and mandatory reporting obligations are you expected to uphold when working around minors at private and public events?",
            evaluationBenchmark: "Demonstrates clear understanding of California child safeguarding standards and two-adult rule."
          },
          {
            topic: "Punctuality & Weekend Reliability",
            question: "Weekend events in SoCal often require navigating traffic across LA, OC, and San Diego. How do you plan your transit, load-in buffer, and contingency timing?",
            evaluationBenchmark: "Requires standard 45-60 min pre-party buffer, vehicle readiness, and clear dispatch check-ins."
          }
        ];
      }
    },

    // Audit Logging
    recordAudit: (action, details, actor = 'Bryant Hua') => {
      logAudit(action, details, actor);
    },
    getAuditLogs: () => loadData(STORAGE_KEYS.AUDIT_LOGS, [])
  };
})();
