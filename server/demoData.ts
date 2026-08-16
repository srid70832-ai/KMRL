import {
  DocumentRecord,
  RiskItem,
  ConflictItem,
  ActionItem,
  DeadlineItem,
  ComplianceItem,
  ChangeImpactAnalysis,
  WorkflowItem,
  ApprovalRequest,
  AuditLogEntry,
  ExtractedEntity,
  ExtractedRelationship
} from '../src/types.js';

export const DEMO_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-kmrl-001',
    title: 'KMRL Signalling & Train Control System Maintenance Agreement (CBTC)',
    filename: 'KMRL_CBTC_Signalling_Maint_v3.2.pdf',
    fileSize: 3450000,
    mimeType: 'application/pdf',
    type: 'CONTRACT',
    department: 'Signalling & Telecom',
    version: '3.2',
    uploadedBy: 'usr-admin-01',
    uploadedByName: 'Chief Operations Officer (KMRL)',
    uploadedAt: '2026-06-12T09:30:00Z',
    status: 'INDEXED',
    processingProgress: 100,
    isArchived: false,
    isSyntheticDemo: true,
    pageCount: 42,
    rawText: `KOCHI METRO RAIL LIMITED (KMRL)
CONTRACT NO: KMRL/S&T/CBTC/2024-88
TITLE: Comprehensive Annual Maintenance Contract for Communications-Based Train Control (CBTC) System
PRIMARY VENDOR: Alstom Transport India Ltd.
TOTAL CONTRACT VALUE: INR 48,50,00,000 (Forty-Eight Crores Fifty Lakhs)

CLAUSE 4.2 - AVAILABILITY SLA: The Contractor guarantees system operational availability of 99.98% across all Phase 1 and Phase 2 metro lines during revenue hours (05:30 to 22:30 daily). Failure to meet 99.98% availability in any calendar month shall attract a liquidated damages penalty of INR 5,00,000 per 0.01% shortfall.

CLAUSE 7.1 - PREVENTIVE MAINTENANCE CYCLE: Mandatory bi-monthly trackside beacon (balise) calibration and wayside radio unit diagnostic sweeps must be executed between 00:30 and 04:00 hours during non-revenue maintenance windows.

CLAUSE 9.4 - CRITICAL SPARES BUFFER: Contractor must maintain minimum 6 units of redundant Automatic Train Operation (ATO) zone controllers in the Muttom Yard Central Warehouse at all times. Replenishment SLA after consumption is strictly 14 calendar days.

CLAUSE 12.3 - FORCE MAJEURE & ESCALATION: Any signal failure exceeding 45 minutes shall mandate direct joint inspection by KMRL Dy. General Manager (Signalling) and Alstom Lead Field Engineer within 2 hours.`,
    metadata: {
      vendor: 'Alstom Transport India Ltd.',
      contractValue: '₹48.50 Cr',
      effectiveDate: '2024-04-01',
      expiryDate: '2027-03-31',
      signatories: ['Managing Director, KMRL', 'VP Regional Operations, Alstom'],
      governingLaw: 'Indian Contract Act 1872 / Metro Railways Act 2002',
      confidentialityLevel: 'CONFIDENTIAL'
    },
    pipelineSteps: [
      { id: '1', label: 'Ingest & File Stream', status: 'COMPLETED', durationMs: 140 },
      { id: '2', label: 'OCR & High-Fidelity Extraction', status: 'COMPLETED', durationMs: 620 },
      { id: '3', label: 'Semantic Chunking & Parsing', status: 'COMPLETED', durationMs: 280 },
      { id: '4', label: 'Vector Embedding Generation', status: 'COMPLETED', durationMs: 410 },
      { id: '5', label: 'Taxonomy Classification', status: 'COMPLETED', durationMs: 190 },
      { id: '6', label: 'Entity Disambiguation', status: 'COMPLETED', durationMs: 340 },
      { id: '7', label: 'Knowledge Graph Relation Linking', status: 'COMPLETED', durationMs: 510 },
      { id: '8', label: 'Risk & Conflict Radar Scan', status: 'COMPLETED', durationMs: 450 },
      { id: '9', label: 'Operational Indexing Complete', status: 'COMPLETED', durationMs: 120 }
    ]
  },
  {
    id: 'doc-kmrl-002',
    title: 'Phase II Extension (JLN Stadium to Infopark) Civil Works Work Order',
    filename: 'KMRL_Phase2_Civil_Package_K4_WO.pdf',
    fileSize: 5120000,
    mimeType: 'application/pdf',
    type: 'WORK_ORDER',
    department: 'Civil Engineering & Projects',
    version: '1.0',
    uploadedBy: 'usr-admin-01',
    uploadedByName: 'Chief Operations Officer (KMRL)',
    uploadedAt: '2026-07-05T14:15:00Z',
    status: 'INDEXED',
    processingProgress: 100,
    isArchived: false,
    isSyntheticDemo: true,
    pageCount: 68,
    rawText: `KOCHI METRO RAIL LIMITED - PROJECT IMPLEMENTATION UNIT
WORK ORDER NO: KMRL/PRJ/PH2/CIVIL-K4/2025/104
PROJECT: Phase II Corridor Extension (Jawaharlal Nehru International Stadium to Infopark via Kakkanad)
EXECUTING CONTRACTOR: L&T Construction Heavy Infrastructure IC
CONTRACT VALUE: INR 1,141,00,00,000 (Eleven Hundred Forty-One Crores)

MILESTONE 3 - PIER ERECTION & VIADUCT SUPERSTRUCTURE: Completion of all 340 viaduct piers and U-girder spans between Station Pier KP-42 and KP-110 must be achieved by October 30, 2026.

SECTION 6.8 - ENVIRONMENTAL & MONSOON MITIGATION: Contractor must deploy continuous acoustic noise barriers (min 3.5m height) near residential zones along Seaport-Airport Road and ensure 100% surface desilting of drainage channels to prevent waterlogging during southwest monsoon.

SECTION 14.2 - TRAFFIC DIVERSION & POLICE PERMIT RENEWAL: Traffic diversion permits granted by Kochi City Traffic Police require mandatory tri-monthly safety audits and renewal every 90 days. Next renewal date is August 28, 2026. Failure to renew halts night-time girder transport.`,
    metadata: {
      vendor: 'L&T Construction Heavy Infrastructure IC',
      contractValue: '₹1,141 Cr',
      effectiveDate: '2025-01-15',
      expiryDate: '2027-12-31',
      signatories: ['Director Projects, KMRL', 'Project Director, L&T Infrastructure'],
      governingLaw: 'Metro Railways (Construction of Works) Act 1978',
      confidentialityLevel: 'RESTRICTED'
    },
    pipelineSteps: [
      { id: '1', label: 'Ingest & File Stream', status: 'COMPLETED', durationMs: 160 },
      { id: '2', label: 'OCR & High-Fidelity Extraction', status: 'COMPLETED', durationMs: 840 },
      { id: '3', label: 'Semantic Chunking & Parsing', status: 'COMPLETED', durationMs: 310 },
      { id: '4', label: 'Vector Embedding Generation', status: 'COMPLETED', durationMs: 510 },
      { id: '5', label: 'Taxonomy Classification', status: 'COMPLETED', durationMs: 210 },
      { id: '6', label: 'Entity Disambiguation', status: 'COMPLETED', durationMs: 410 },
      { id: '7', label: 'Knowledge Graph Relation Linking', status: 'COMPLETED', durationMs: 580 },
      { id: '8', label: 'Risk & Conflict Radar Scan', status: 'COMPLETED', durationMs: 490 },
      { id: '9', label: 'Operational Indexing Complete', status: 'COMPLETED', durationMs: 140 }
    ]
  },
  {
    id: 'doc-kmrl-003',
    title: 'Rolling Stock 25kV AC Traction Power & SCADA Safety Directive',
    filename: 'KMRL_Safety_Directive_Traction_SCADA_2026.pdf',
    fileSize: 2100000,
    mimeType: 'application/pdf',
    type: 'SAFETY_DIRECTIVE',
    department: 'Electrical & Safety Compliance',
    version: '2.1',
    uploadedBy: 'usr-analyst-01',
    uploadedByName: 'Senior Safety Inspector',
    uploadedAt: '2026-07-20T11:00:00Z',
    status: 'INDEXED',
    processingProgress: 100,
    isArchived: false,
    isSyntheticDemo: true,
    pageCount: 24,
    rawText: `OFFICE OF THE CHIEF SAFETY OFFICER - KOCHI METRO RAIL LIMITED
DIRECTIVE REF: KMRL/SAFETY/ELEC-DIR/2026/09
APPLICABILITY: Muttom Substation, Aluva to Petta Revenue Line, Kalamassery Traction Switching Post

DIRECTIVE 3.1 - OVERHEAD CATENARY WIRE WEAR MONITORING: Contact wire thickness must be scanned monthly via automated optical pantograph measuring car. Any segment with residual diameter under 9.8mm must be replaced within 48 hours to avert pantograph entanglement risk.

DIRECTIVE 5.4 - EMERGENCY TRACTION CUTOFF INTERLOCK: SCADA automatic trip circuit test must be certified jointly with KSEBL (Kerala State Electricity Board Ltd.) every 60 days. Last certified: 2026-06-15. Next mandatory test: 2026-08-14 (OVERDUE ALERT).

DIRECTIVE 8.2 - ROLLING STOCK WHEELSET ULTRASONIC TESTING: Non-Destructive Testing (NDT) of all 25 trainset axle sets must be documented in the digital maintenance logbook prior to release for revenue service.`,
    metadata: {
      vendor: 'Internal / KSEBL Joint Board',
      effectiveDate: '2026-01-01',
      signatories: ['Chief Commissioner of Railway Safety (CCRS)', 'Chief Electrical Engineer, KMRL'],
      governingLaw: 'Opening of Metro Railways for Public Carriage of Passengers Rules 2013',
      confidentialityLevel: 'INTERNAL'
    },
    pipelineSteps: [
      { id: '1', label: 'Ingest & File Stream', status: 'COMPLETED', durationMs: 120 },
      { id: '2', label: 'OCR & High-Fidelity Extraction', status: 'COMPLETED', durationMs: 480 },
      { id: '3', label: 'Semantic Chunking & Parsing', status: 'COMPLETED', durationMs: 230 },
      { id: '4', label: 'Vector Embedding Generation', status: 'COMPLETED', durationMs: 360 },
      { id: '5', label: 'Taxonomy Classification', status: 'COMPLETED', durationMs: 170 },
      { id: '6', label: 'Entity Disambiguation', status: 'COMPLETED', durationMs: 290 },
      { id: '7', label: 'Knowledge Graph Relation Linking', status: 'COMPLETED', durationMs: 440 },
      { id: '8', label: 'Risk & Conflict Radar Scan', status: 'COMPLETED', durationMs: 390 },
      { id: '9', label: 'Operational Indexing Complete', status: 'COMPLETED', durationMs: 110 }
    ]
  },
  {
    id: 'doc-kmrl-004',
    title: 'Automated Fare Collection (AFC) & Kochi1 Smart Card SLA Amendment',
    filename: 'KMRL_AFC_SmartCard_SLA_Amendment_v2.0.pdf',
    fileSize: 1890000,
    mimeType: 'application/pdf',
    type: 'SLA_AGREEMENT',
    department: 'Finance & Technology',
    version: '2.0',
    uploadedBy: 'usr-mgr-01',
    uploadedByName: 'General Manager (Procurement)',
    uploadedAt: '2026-08-01T16:45:00Z',
    status: 'INDEXED',
    processingProgress: 100,
    isArchived: false,
    isSyntheticDemo: true,
    pageCount: 31,
    rawText: `KOCHI METRO RAIL LIMITED & AXIS BANK CONSORTIUM
AMENDMENT AGREEMENT NO: KMRL/AFC-AXIS/AMD-02/2026
SYSTEM: Open-Loop EMV Contactless Smart Ticketing & QR Gate Validators

CLAUSE 3.3 (AMENDED) - GATE TRANSACTION LATENCY: Turnstile QR/NFC validation latency must remain strictly ≤ 300 milliseconds. If latency exceeds 500ms at any station during peak hours (08:30-10:30, 17:00-19:30), the AFC consortium is liable to credit KMRL ₹25,000 per station-incident.

CLAUSE 5.1 - DAILY SETTLEMENT RECONCILIATION: End-of-day revenue reconciliation files must be transmitted securely to KMRL Escrow Account before 02:00 AM IST. Discrepancies exceeding ₹10,000 must be investigated and resolved within 24 hours.

CLAUSE 8.4 - QR CODE VALIDATOR HARDWARE FIRMWARE UPGRADE: Mandatory security firmware patch to support National Common Mobility Card (NCMC) Phase 3 must be rolled out across 180 fare gates by September 15, 2026.`,
    metadata: {
      vendor: 'Axis Bank & Asis Elektronik Consortium',
      contractValue: '₹32.00 Cr',
      effectiveDate: '2026-04-01',
      expiryDate: '2029-03-31',
      signatories: ['Director Finance, KMRL', 'Head Government Business, Axis Bank'],
      governingLaw: 'Reserve Bank of India Payment and Settlement Systems Act 2007',
      confidentialityLevel: 'CONFIDENTIAL'
    },
    pipelineSteps: [
      { id: '1', label: 'Ingest & File Stream', status: 'COMPLETED', durationMs: 110 },
      { id: '2', label: 'OCR & High-Fidelity Extraction', status: 'COMPLETED', durationMs: 510 },
      { id: '3', label: 'Semantic Chunking & Parsing', status: 'COMPLETED', durationMs: 240 },
      { id: '4', label: 'Vector Embedding Generation', status: 'COMPLETED', durationMs: 380 },
      { id: '5', label: 'Taxonomy Classification', status: 'COMPLETED', durationMs: 180 },
      { id: '6', label: 'Entity Disambiguation', status: 'COMPLETED', durationMs: 310 },
      { id: '7', label: 'Knowledge Graph Relation Linking', status: 'COMPLETED', durationMs: 460 },
      { id: '8', label: 'Risk & Conflict Radar Scan', status: 'COMPLETED', durationMs: 410 },
      { id: '9', label: 'Operational Indexing Complete', status: 'COMPLETED', durationMs: 115 }
    ]
  }
];

export const DEMO_ENTITIES: ExtractedEntity[] = [
  {
    id: 'ent-1',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling & Train Control System Maintenance Agreement',
    name: 'Alstom Transport India Ltd.',
    type: 'VENDOR',
    pageNumber: 1,
    evidence: 'PRIMARY VENDOR: Alstom Transport India Ltd. Total Contract Value: INR 48,50,00,000',
    confidence: 0.99
  },
  {
    id: 'ent-2',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling & Train Control System Maintenance Agreement',
    name: 'Muttom Yard Central Warehouse',
    type: 'LOCATION',
    pageNumber: 3,
    evidence: 'Contractor must maintain minimum 6 units of redundant ATO zone controllers in the Muttom Yard Central Warehouse',
    confidence: 0.97
  },
  {
    id: 'ent-3',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works Work Order',
    name: 'L&T Construction Heavy Infrastructure IC',
    type: 'VENDOR',
    pageNumber: 1,
    evidence: 'EXECUTING CONTRACTOR: L&T Construction Heavy Infrastructure IC. CONTRACT VALUE: INR 1,141 Cr',
    confidence: 0.99
  },
  {
    id: 'ent-4',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works Work Order',
    name: 'Kochi City Traffic Police',
    type: 'ORGANIZATION',
    pageNumber: 14,
    evidence: 'Traffic diversion permits granted by Kochi City Traffic Police require mandatory tri-monthly safety audits',
    confidence: 0.95
  },
  {
    id: 'ent-5',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power Directive',
    name: 'KSEBL (Kerala State Electricity Board Ltd.)',
    type: 'ORGANIZATION',
    pageNumber: 2,
    evidence: 'SCADA automatic trip circuit test must be certified jointly with KSEBL every 60 days.',
    confidence: 0.98
  },
  {
    id: 'ent-6',
    documentId: 'doc-kmrl-004',
    documentTitle: 'AFC & Kochi1 Smart Card SLA Amendment',
    name: 'Axis Bank & Asis Elektronik Consortium',
    type: 'VENDOR',
    pageNumber: 1,
    evidence: 'KOCHI METRO RAIL LIMITED & AXIS BANK CONSORTIUM AMENDMENT AGREEMENT NO: KMRL/AFC-AXIS/AMD-02/2026',
    confidence: 0.99
  }
];

export const DEMO_RELATIONSHIPS: ExtractedRelationship[] = [
  {
    id: 'rel-1',
    sourceEntity: 'KMRL',
    targetEntity: 'Alstom Transport India Ltd.',
    relationType: 'CONTRACTED_TO',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling Agreement',
    pageNumber: 1,
    evidence: 'Comprehensive Annual Maintenance Contract for Communications-Based Train Control System',
    confidence: 0.98
  },
  {
    id: 'rel-2',
    sourceEntity: 'Alstom Transport India Ltd.',
    targetEntity: 'Muttom Yard Central Warehouse',
    relationType: 'OBLIGATED_TO',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling Agreement',
    pageNumber: 3,
    evidence: 'Maintain minimum 6 units of redundant Automatic Train Operation zone controllers at Muttom',
    confidence: 0.96
  },
  {
    id: 'rel-3',
    sourceEntity: 'KMRL',
    targetEntity: 'L&T Construction Heavy Infrastructure IC',
    relationType: 'CONTRACTED_TO',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works',
    pageNumber: 1,
    evidence: 'Work order for Phase II Corridor Extension (JLN Stadium to Infopark)',
    confidence: 0.99
  },
  {
    id: 'rel-4',
    sourceEntity: 'L&T Construction Heavy Infrastructure IC',
    targetEntity: 'Kochi City Traffic Police',
    relationType: 'OBLIGATED_TO',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works',
    pageNumber: 14,
    evidence: 'Mandatory tri-monthly safety audits and renewal of traffic diversion permits every 90 days',
    confidence: 0.94
  },
  {
    id: 'rel-5',
    sourceEntity: 'KMRL',
    targetEntity: 'KSEBL (Kerala State Electricity Board Ltd.)',
    relationType: 'OBLIGATED_TO',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Traction Power & SCADA Safety Directive',
    pageNumber: 2,
    evidence: 'SCADA automatic trip circuit test must be certified jointly with KSEBL every 60 days',
    confidence: 0.97
  }
];

export const DEMO_RISKS: RiskItem[] = [
  {
    id: 'risk-001',
    title: 'SCADA Emergency Traction Cutoff Test Overdue',
    reason: 'Safety directive mandates 60-day joint trip circuit testing with KSEBL. Last test was June 15, 2026. Mandated cutoff date was August 14, 2026.',
    category: 'COMPLIANCE',
    severity: 'CRITICAL',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power & SCADA Safety Directive',
    pageNumber: 2,
    evidence: 'DIRECTIVE 5.4: SCADA automatic trip circuit test must be certified jointly with KSEBL every 60 days. Last certified: 2026-06-15.',
    recommendedAction: 'Issue immediate emergency work permit to Chief Electrical Engineer for night-window joint testing with KSEBL Substation Division.',
    isVerified: true,
    verifiedBy: 'Chief Safety Officer (KMRL)',
    verifiedAt: '2026-08-15T08:00:00Z',
    createdAt: '2026-08-14T23:59:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'risk-002',
    title: 'Traffic Diversion Permit Expiry for Phase 2 Kakkanad Corridor',
    reason: 'Kochi City Traffic Police permit expires on August 28, 2026 (in 12 days). If not renewed, heavy night crane transport of U-girders will be halted.',
    category: 'DEADLINE',
    severity: 'HIGH',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension (JLN Stadium to Infopark) Civil Works Work Order',
    pageNumber: 14,
    evidence: 'SECTION 14.2: Traffic diversion permits granted by Kochi City Traffic Police require mandatory tri-monthly safety audits and renewal every 90 days. Next renewal date is August 28, 2026.',
    recommendedAction: 'Submit Joint Traffic Safety Audit Report to Assistant Commissioner of Police (Traffic, Edappally) before August 22, 2026.',
    isVerified: true,
    verifiedBy: 'Project Director (Phase II)',
    verifiedAt: '2026-08-10T14:30:00Z',
    createdAt: '2026-08-09T10:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'risk-003',
    title: 'Spare ATO Zone Controller Inventory Depletion Risk',
    reason: 'Contract mandates 6 standby units at Muttom Yard. Current log reports 4 available after replacement on Trainset TS-08 and TS-11.',
    category: 'SLA',
    severity: 'MEDIUM',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling & Train Control System Maintenance Agreement (CBTC)',
    pageNumber: 3,
    evidence: 'CLAUSE 9.4: Contractor must maintain minimum 6 units of redundant Automatic Train Operation (ATO) zone controllers in Muttom Yard at all times. Replenishment SLA strictly 14 calendar days.',
    recommendedAction: 'Issue formal expediting notice to Alstom Bangalore logistics depot to ship 2 replenished units within 5 working days.',
    isVerified: false,
    createdAt: '2026-08-12T16:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'risk-004',
    title: 'Fare Gate Latency Penalty Liability Trigger',
    reason: 'Amendment introduces ₹25,000 penalty per station-incident if peak turnstile QR/NFC validation exceeds 500ms during morning rush hours.',
    category: 'FINANCIAL',
    severity: 'MEDIUM',
    documentId: 'doc-kmrl-004',
    documentTitle: 'Automated Fare Collection (AFC) & Smart Card SLA Amendment',
    pageNumber: 2,
    evidence: 'CLAUSE 3.3 (AMENDED): If latency exceeds 500ms at any station during peak hours (08:30-10:30, 17:00-19:30), the AFC consortium is liable to credit KMRL ₹25,000 per station-incident.',
    recommendedAction: 'Deploy edge-cache firmware patch before September 15, 2026 deadline to ensure sub-250ms validation across all 180 gates.',
    isVerified: true,
    verifiedBy: 'General Manager (Procurement)',
    verifiedAt: '2026-08-05T11:20:00Z',
    createdAt: '2026-08-04T09:15:00Z',
    isSyntheticDemo: true
  }
];

export const DEMO_CONFLICTS: ConflictItem[] = [
  {
    id: 'cnf-001',
    title: 'Maintenance Window Timing Mismatch between Signalling & Civil Works',
    type: 'CLAUSE_INCONSISTENCY',
    severity: 'HIGH',
    status: 'ACTIVE',
    documentA: {
      id: 'doc-kmrl-001',
      title: 'Signalling Maintenance Agreement (CBTC)',
      page: 2,
      clause: 'Clause 7.1',
      evidence: 'Mandatory bi-monthly trackside beacon calibration must be executed between 00:30 and 04:00 hours during non-revenue windows.'
    },
    documentB: {
      id: 'doc-kmrl-002',
      title: 'Phase II Extension Civil Works Work Order',
      page: 18,
      clause: 'Clause 11.4',
      evidence: 'Heavy crane girder hoisting and power feeder relocation at JLN Junction track interface is scheduled from 01:00 to 04:30 hours on alternate Tuesdays.'
    },
    impactSummary: 'Simultaneous scheduling on track interface between JLN Stadium and Palarivattom risks track occupation conflict and electrical isolation hazards.',
    createdAt: '2026-08-11T12:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'cnf-002',
    title: 'Turnstile Validation Latency Threshold Discrepancy',
    type: 'SLA_MISMATCH',
    severity: 'MEDIUM',
    status: 'UNDER_REVIEW',
    documentA: {
      id: 'doc-kmrl-004',
      title: 'AFC Smart Card SLA Amendment v2.0',
      page: 2,
      clause: 'Clause 3.3 (Amended)',
      evidence: 'Turnstile QR/NFC validation latency must remain strictly ≤ 300 milliseconds.'
    },
    documentB: {
      id: 'doc-kmrl-004-old',
      title: 'Master AFC System Technical Specifications v1.0',
      page: 45,
      clause: 'Section 4.12',
      evidence: 'Allowed maximum peak processing time for contactless smart media is 600 milliseconds.'
    },
    impactSummary: 'The legacy ticketing backend server timeouts are configured at 500ms, which could trigger false SLA penalty claims against the vendor.',
    createdAt: '2026-08-08T15:30:00Z',
    isSyntheticDemo: true
  }
];

export const DEMO_ACTIONS: ActionItem[] = [
  {
    id: 'act-001',
    action: 'Execute Joint SCADA Automatic Trip Circuit Safety Test with KSEBL Engineers',
    responsibleRole: 'Chief Electrical Engineer',
    assignedTo: 'Er. Rajesh Varma (Dy. CE Power)',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power & SCADA Safety Directive',
    pageNumber: 2,
    deadline: '2026-08-18',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    evidence: 'DIRECTIVE 5.4: SCADA automatic trip circuit test must be certified jointly with KSEBL every 60 days.',
    createdAt: '2026-08-15T09:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'act-002',
    action: 'Submit Tri-Monthly Traffic Diversion Safety Audit to Kochi City Police',
    responsibleRole: 'Project Manager (Civil Package 2)',
    assignedTo: 'Er. Ananya Menon',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works Work Order',
    pageNumber: 14,
    deadline: '2026-08-22',
    priority: 'HIGH',
    status: 'PENDING',
    evidence: 'SECTION 14.2: Traffic diversion permits granted by Kochi City Traffic Police require mandatory tri-monthly safety audits and renewal every 90 days.',
    createdAt: '2026-08-10T14:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'act-003',
    action: 'Deploy NCMC Phase 3 Firmware Patch to 180 Turnstiles',
    responsibleRole: 'AFC Systems Lead',
    assignedTo: 'S. Chandran (IT & Ticketing)',
    documentId: 'doc-kmrl-004',
    documentTitle: 'AFC & Smart Card SLA Amendment',
    pageNumber: 3,
    deadline: '2026-09-15',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    evidence: 'CLAUSE 8.4: Mandatory security firmware patch to support National Common Mobility Card Phase 3 across 180 fare gates.',
    createdAt: '2026-08-02T10:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'act-004',
    action: 'Restock 2 Units of ATO Zone Controllers at Muttom Central Depot',
    responsibleRole: 'Senior S&T Maintenance Engineer',
    assignedTo: 'Alstom Field Logistics Lead',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling & Train Control System Maintenance Agreement',
    pageNumber: 3,
    deadline: '2026-08-25',
    priority: 'HIGH',
    status: 'PENDING',
    evidence: 'CLAUSE 9.4: Contractor must maintain minimum 6 units of redundant ATO zone controllers at Muttom Yard.',
    createdAt: '2026-08-12T16:30:00Z',
    isSyntheticDemo: true
  }
];

export const DEMO_DEADLINES: DeadlineItem[] = [
  {
    id: 'dl-001',
    title: 'KSEBL Joint SCADA Trip Test Certification (Overdue)',
    dueDate: '2026-08-14',
    daysRemaining: -2,
    status: 'OVERDUE',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power Safety Directive',
    pageNumber: 2,
    responsibleRole: 'Chief Electrical Engineer',
    category: 'Safety Compliance',
    evidence: 'Directive 5.4 - Joint 60-day verification with KSEBL',
    isSyntheticDemo: true
  },
  {
    id: 'dl-002',
    title: 'Kochi Traffic Police Diversion Permit Renewal',
    dueDate: '2026-08-28',
    daysRemaining: 12,
    status: 'DUE_SOON',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works Work Order',
    pageNumber: 14,
    responsibleRole: 'Project Manager (Civil Package 2)',
    category: 'Regulatory Permitting',
    evidence: 'Section 14.2 - 90-day renewal cycle',
    isSyntheticDemo: true
  },
  {
    id: 'dl-003',
    title: 'Alstom ATO Spares Replenishment Buffer SLA',
    dueDate: '2026-08-25',
    daysRemaining: 9,
    status: 'DUE_SOON',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling Maintenance Agreement',
    pageNumber: 3,
    responsibleRole: 'Senior S&T Maintenance Engineer',
    category: 'Supply Chain & Spares',
    evidence: 'Clause 9.4 - 14-day replenishment SLA',
    isSyntheticDemo: true
  },
  {
    id: 'dl-004',
    title: 'NCMC Phase 3 Turnstile Firmware Upgrade Complete',
    dueDate: '2026-09-15',
    daysRemaining: 30,
    status: 'UPCOMING',
    documentId: 'doc-kmrl-004',
    documentTitle: 'AFC & Smart Card SLA Amendment',
    pageNumber: 3,
    responsibleRole: 'AFC Systems Lead',
    category: 'Technology Upgrade',
    evidence: 'Clause 8.4 - 180 fare gates upgrade',
    isSyntheticDemo: true
  },
  {
    id: 'dl-005',
    title: 'Phase II Milestone 3: Viaduct Pier KP-42 to KP-110 Erection',
    dueDate: '2026-10-30',
    daysRemaining: 75,
    status: 'UPCOMING',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works Work Order',
    pageNumber: 5,
    responsibleRole: 'Project Director (Phase II)',
    category: 'Civil Infrastructure Milestone',
    evidence: 'Milestone 3 - Viaduct Superstructure Completion',
    isSyntheticDemo: true
  }
];

export const DEMO_COMPLIANCE: ComplianceItem[] = [
  {
    id: 'cmp-001',
    standard: 'Metro Railways (Operation and Maintenance) Act, Section 17',
    clauseReference: 'Safety Rules 2013, Rule 4.2',
    requirement: 'Mandatory Non-Destructive Testing (NDT) and ultrasonic wheel axle verification before releasing trainsets for revenue service.',
    status: 'COMPLIANT',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power & SCADA Safety Directive',
    pageNumber: 3,
    evidence: 'DIRECTIVE 8.2: NDT of all 25 trainset axle sets must be documented in the digital maintenance logbook prior to release for revenue service.',
    riskAssessment: 'Full compliance verified against Muttom Rolling Stock Workshop depot log records.',
    verifiedBy: 'Chief Safety Inspector',
    lastChecked: '2026-08-14T18:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'cmp-002',
    standard: 'Central Electricity Authority (Safety Requirements for Metro) Regulations',
    clauseReference: 'CEA Reg 32(b)',
    requirement: 'Bimonthly calibration and emergency trip synchronization of 25kV traction substation with state grid dispatch center.',
    status: 'NON_COMPLIANT',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power & SCADA Safety Directive',
    pageNumber: 2,
    evidence: 'DIRECTIVE 5.4: Last test certified on 2026-06-15. Exceeded 60-day statutory cycle on 2026-08-14 without logged test submission.',
    riskAssessment: 'Statutory compliance violation under Section 161 of the Electricity Act 2003.',
    verifiedBy: 'Electrical Compliance Officer',
    lastChecked: '2026-08-16T07:30:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'cmp-003',
    standard: 'Reserve Bank of India Guidelines on Prepaid Payment Instruments (PPIs)',
    clauseReference: 'RBI/2021-22/88 Sec 6.4',
    requirement: 'Daily settlement file reconciliation and escrow fund deposit within T+1 banking window.',
    status: 'COMPLIANT',
    documentId: 'doc-kmrl-004',
    documentTitle: 'AFC & Smart Card SLA Amendment',
    pageNumber: 2,
    evidence: 'CLAUSE 5.1: End-of-day revenue reconciliation files must be transmitted securely to KMRL Escrow Account before 02:00 AM IST.',
    riskAssessment: 'Zero settlement default logged in preceding 180 banking cycles.',
    verifiedBy: 'Senior Finance Officer',
    lastChecked: '2026-08-15T22:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'cmp-004',
    standard: 'KSPCB Environmental Clearance & Noise Pollution (Regulation and Control) Rules 2000',
    clauseReference: 'Rule 5, Schedule II',
    requirement: 'Installation of certified acoustic barriers during night construction within 100m of residential hospital zones.',
    status: 'PARTIALLY_COMPLIANT',
    documentId: 'doc-kmrl-002',
    documentTitle: 'Phase II Extension Civil Works Work Order',
    pageNumber: 8,
    evidence: 'SECTION 6.8: Deploy continuous acoustic noise barriers (min 3.5m height) near residential zones along Seaport-Airport Road.',
    riskAssessment: 'Barriers erected along Reach 1; pending installation near Kakkanad Civil Station stretch.',
    verifiedBy: 'Environmental Engineer',
    lastChecked: '2026-08-13T16:00:00Z',
    isSyntheticDemo: true
  }
];

export const DEMO_IMPACT_ANALYSIS: ChangeImpactAnalysis = {
  id: 'imp-001',
  documentId: 'doc-kmrl-001',
  documentTitle: 'KMRL Signalling & Train Control System Maintenance Agreement',
  baseVersion: 'v3.1 (2024)',
  targetVersion: 'v3.2 Proposed Amendment (2026)',
  summaryOfChange: 'Amendment increases operational availability SLA from 99.95% to 99.98% and tightens critical spare replenishment window from 21 days down to 14 days.',
  changedClauses: [
    {
      id: 'diff-1',
      section: 'Clause 4.2 - Availability SLA Target',
      oldText: 'Contractor guarantees system operational availability of 99.95% during revenue hours.',
      newText: 'Contractor guarantees system operational availability of 99.98% across all Phase 1 and Phase 2 metro lines during revenue hours.',
      changeType: 'MODIFIED',
      riskLevel: 'HIGH',
      impactDescription: 'Increases vendor penalty threshold. Requires immediate diagnostic upgrade on wayside radio units to eliminate intermittent packet drops.'
    },
    {
      id: 'diff-2',
      section: 'Clause 9.4 - Critical Spares Buffer',
      oldText: 'Maintain minimum 4 units of redundant ATO zone controllers; replenishment SLA is 21 calendar days.',
      newText: 'Maintain minimum 6 units of redundant ATO zone controllers in Muttom Yard; replenishment SLA is strictly 14 calendar days.',
      changeType: 'MODIFIED',
      riskLevel: 'MEDIUM',
      impactDescription: 'Muttom depot storage allocation must expand. Logistics lead times from Alstom European fab require buffer stocking.'
    },
    {
      id: 'diff-3',
      section: 'Clause 12.3 - Joint Incident Inspection SLA',
      oldText: 'Unscheduled delays over 60 minutes require report submission within 24 hours.',
      newText: 'Any signal failure exceeding 45 minutes mandates direct joint inspection by KMRL DGM (Signalling) and Alstom Lead Field Engineer within 2 hours.',
      changeType: 'ADDED',
      riskLevel: 'HIGH',
      impactDescription: 'Affects on-call roster for KMRL Operations Control Centre (OCC) dispatchers and Alstom engineers.'
    }
  ],
  affectedDocuments: [
    {
      id: 'doc-kmrl-002',
      title: 'Phase II Extension Civil Works Work Order',
      relationshipType: 'INTERFACE_INTEGRATION',
      impactSeverity: 'HIGH',
      impactReason: 'Tightened availability SLA requires Phase 2 testing trains to run under strict CBTC shadow mode before commercial handover.',
      evidence: 'Phase 2 viaduct track integration must match 99.98% CBTC wayside signal criteria.'
    },
    {
      id: 'doc-kmrl-003',
      title: 'Rolling Stock 25kV AC Traction Power Safety Directive',
      relationshipType: 'SAFETY_DEPENDENCY',
      impactSeverity: 'MEDIUM',
      impactReason: 'SCADA emergency trip circuit tests must not disrupt CBTC wayside transponder power lines during non-revenue maintenance windows.',
      evidence: 'Directive 5.4 trip testing overlaps with Clause 7.1 trackside beacon calibration.'
    }
  ],
  affectedRelationships: [
    {
      source: 'Alstom Transport India Ltd.',
      relation: 'OBLIGATED_TO_MAINTAIN_SPARES',
      target: 'Muttom Yard Central Warehouse',
      impact: 'Buffer inventory increased from 4 to 6 ATO controllers.'
    },
    {
      source: 'KMRL Operations Control Centre',
      relation: 'ESCALATES_TO',
      target: 'Alstom Lead Field Engineer',
      impact: 'Mandatory joint response time compressed from 24 hours to 2 hours for >45 min faults.'
    }
  ],
  potentialRisks: [
    {
      category: 'SLA',
      severity: 'HIGH',
      risk: 'Vendor dispute over shortfall penalties during Phase 2 testing corridor commissioning.',
      evidence: 'Clause 4.2 imposes ₹5,00,000 per 0.01% shortfall without grandfathering testing phases.'
    },
    {
      category: 'DEPENDENCY',
      severity: 'MEDIUM',
      risk: 'Logistics bottlenecks if global semiconductor lead times exceed 14-day replenishment window.',
      evidence: 'Clause 9.4 14-day international air-freight dependency.'
    }
  ],
  recommendedActions: [
    {
      action: 'Issue formal addendum clarifying SLA exclusion during scheduled Phase 2 corridor integration trials.',
      role: 'Chief Operations Officer',
      priority: 'HIGH',
      deadlineDays: 7
    },
    {
      action: 'Audit Muttom Yard secure warehouse space for 6 dedicated ATO controller climate-controlled racks.',
      role: 'Senior S&T Maintenance Engineer',
      priority: 'MEDIUM',
      deadlineDays: 10
    }
  ],
  humanVerificationStatus: 'PENDING_REVIEW',
  createdAt: '2026-08-16T09:00:00Z',
  isSyntheticDemo: true
};

export const DEMO_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-001',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling & Train Control System Maintenance Agreement',
    title: 'CBTC Signalling SLA & Spare Buffer Amendment Approval',
    department: 'Signalling & Telecom',
    currentStage: 'APPROVAL',
    priority: 'HIGH',
    status: 'PENDING_APPROVAL',
    aiRecommendation: 'AI recommendation: APPROVE WITH CONDITION to add a 6-month trial grace period for Phase 2 integration corridor before enforcing 99.98% liquidated damages.',
    humanAssignee: 'Director of Systems & Operations',
    history: [
      { stage: 'INGEST', timestamp: '2026-08-16T08:00:00Z', actor: 'Automated Ingestion', note: 'Document parsed and indexed.' },
      { stage: 'CLASSIFY', timestamp: '2026-08-16T08:01:00Z', actor: 'AI Engine', note: 'Classified as CONTRACT / SLA_AMENDMENT' },
      { stage: 'ACTION', timestamp: '2026-08-16T08:02:00Z', actor: 'AI Engine', note: 'Extracted 3 critical actions and 2 SLA risks.' },
      { stage: 'APPROVAL', timestamp: '2026-08-16T08:05:00Z', actor: 'System Routing', note: 'Routed to Director Systems for human verification.' }
    ],
    createdAt: '2026-08-16T08:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'wf-002',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power Directive',
    title: 'Emergency SCADA Joint Trip Test Protocol Escalation',
    department: 'Electrical & Safety Compliance',
    currentStage: 'ACTION',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    aiRecommendation: 'AI recommendation: ESCALATE IMMEDIATELY to KSEBL Grid Operations to secure midnight power shutdown block for statutory compliance.',
    humanAssignee: 'Chief Electrical Engineer',
    history: [
      { stage: 'INGEST', timestamp: '2026-08-15T09:00:00Z', actor: 'Automated Ingestion', note: 'Safety directive scanned.' },
      { stage: 'ACTION', timestamp: '2026-08-15T09:02:00Z', actor: 'AI Engine', note: 'Critical overdue item logged.' }
    ],
    createdAt: '2026-08-15T09:00:00Z',
    isSyntheticDemo: true
  }
];

export const DEMO_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr-001',
    workflowId: 'wf-001',
    title: 'Sign-off on Proposed Signalling SLA Amendment (Clause 4.2 Liquidated Damages)',
    description: 'Verify and authorize the amendment increasing availability to 99.98% and spare replenishment to 14 days.',
    type: 'CRITICAL_ACTION',
    documentId: 'doc-kmrl-001',
    documentTitle: 'KMRL Signalling & Train Control System Maintenance Agreement',
    requestedBy: 'AI Copilot Automated Rule',
    roleRequired: 'MANAGER',
    status: 'PENDING',
    aiRecommendationSummary: 'Approve with caveat for Phase 2 testing. Risk score is MEDIUM-HIGH due to potential vendor supply chain dispute.',
    evidence: 'Clause 4.2 penalty rate: INR 5,00,000 per 0.01% shortfall. Verified against current Alstom performance logs.',
    createdAt: '2026-08-16T08:05:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'appr-002',
    workflowId: 'wf-002',
    title: 'Authorize Night Power Shutdown Window with KSEBL',
    description: 'Statutory SCADA emergency trip circuit verification requires 2.5-hour 25kV traction shutdown between Kalamassery and Aluva.',
    type: 'RISK_ACCEPTANCE',
    documentId: 'doc-kmrl-003',
    documentTitle: 'Rolling Stock 25kV AC Traction Power Safety Directive',
    requestedBy: 'Er. Rajesh Varma (Dy. CE Power)',
    roleRequired: 'ADMIN',
    status: 'PENDING',
    aiRecommendationSummary: 'Accept operational risk for scheduled non-revenue window 01:30 - 04:00 AM on August 18, 2026 to resolve statutory non-compliance.',
    evidence: 'Directive 5.4 overdue since August 14, 2026.',
    createdAt: '2026-08-16T07:45:00Z',
    isSyntheticDemo: true
  }
];

export const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    userId: 'usr-admin-01',
    userName: 'Chief Operations Officer (KMRL)',
    userRole: 'ADMIN',
    action: 'DOCUMENT_UPLOAD',
    resourceType: 'DOCUMENT',
    resourceId: 'doc-kmrl-001',
    resourceName: 'KMRL_CBTC_Signalling_Maint_v3.2.pdf',
    newValue: 'Uploaded & Indexed (42 Pages)',
    evidenceSource: 'Ingestion Engine',
    ipAddress: '192.168.10.45',
    timestamp: '2026-06-12T09:30:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'aud-002',
    userId: 'usr-ai-system',
    userName: 'Gemini IntelliDocs Engine',
    userRole: 'ADMIN',
    action: 'EXTRACTION_COMPLETED',
    resourceType: 'EXTRACTION',
    resourceId: 'doc-kmrl-001',
    resourceName: 'KMRL Signalling Agreement',
    newValue: 'Extracted 14 Entities, 8 Relations, 2 SLA Risks',
    evidenceSource: 'Gemini 3.7 Flash JSON Pipeline',
    ipAddress: '127.0.0.1',
    timestamp: '2026-06-12T09:32:15Z',
    isSyntheticDemo: true
  },
  {
    id: 'aud-003',
    userId: 'usr-analyst-01',
    userName: 'Senior Safety Inspector',
    userRole: 'ANALYST',
    action: 'RISK_VERIFIED',
    resourceType: 'RISK',
    resourceId: 'risk-001',
    resourceName: 'SCADA Emergency Traction Cutoff Test Overdue',
    previousValue: 'Status: PENDING_VERIFICATION',
    newValue: 'Status: VERIFIED_CRITICAL',
    decision: 'Verified statutory violation under CEA regulations.',
    evidenceSource: 'Directive 5.4 Page 2',
    ipAddress: '192.168.10.78',
    timestamp: '2026-08-15T08:00:00Z',
    isSyntheticDemo: true
  },
  {
    id: 'aud-004',
    userId: 'usr-mgr-01',
    userName: 'General Manager (Procurement)',
    userRole: 'MANAGER',
    action: 'CONFLICT_FLAGGED',
    resourceType: 'CONFLICT',
    resourceId: 'cnf-001',
    resourceName: 'Maintenance Window Timing Mismatch',
    newValue: 'Cross-document conflict logged between Signalling and Civil Works',
    evidenceSource: 'Clause 7.1 vs Clause 11.4',
    ipAddress: '192.168.10.52',
    timestamp: '2026-08-11T12:05:00Z',
    isSyntheticDemo: true
  }
];
