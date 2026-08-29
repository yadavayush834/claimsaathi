import type { SupportedLocale } from "./locale-store";

export interface TranslationDictionary {
  common: {
    brandName: string;
    brandTagline: string;
    howItWorks: string;
    safety: string;
    openDemo: string;
    skipToMain: string;
    switchCitizen: string;
    prototypeNotice: string;
    buildathonNote: string;
    copyright: string;
    back: string;
    next: string;
    submit: string;
    copy: string;
    copied: string;
    download: string;
    close: string;
    cancel: string;
    retry: string;
    loading: string;
    error: string;
    success: string;
    actionNeeded: string;
    synthetic: string;
    language: string;
    english: string;
    hindi: string;
    switchToHindi: string;
    switchToEnglish: string;
    lowBandwidth: string;
    lowBandwidthOn: string;
    lowBandwidthOff: string;
  };
  landing: {
    heroPill: string;
    heroHeading: string;
    heroLead: string;
    exploreDemoCta: string;
    seeHowItWorksCta: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    howItWorksHeading: string;
    howItWorksSub: string;
    safetyHeading: string;
    safetySub: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    faqHeading: string;
  };
  demo: {
    title: string;
    subtitle: string;
    selectCitizen: string;
    currentCitizen: string;
    balance: string;
    activeClaim: string;
    issueState: string;
    recentActivity: string;
    nextAction: string;
    timeline: string;
    explainIssue: string;
    startRecovery: string;
    reconcileSettlement: string;
    prepareGrievance: string;
    planWithdrawal: string;
    checkPreflight: string;
    startMockClaim: string;
  };
  preflight: {
    title: string;
    subtitle: string;
    identityCheck: string;
    bankCheck: string;
    evidenceCheck: string;
    allClear: string;
    fixAction: string;
    recheckAction: string;
  };
  planner: {
    title: string;
    subtitle: string;
    selectGoal: string;
    eligibleAmount: string;
    serviceDuration: string;
    advanceRule: string;
    continueToForm: string;
  };
  form: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    aadhaarOtp: string;
    verifyOtp: string;
    submitMockClaim: string;
    acknowledgement: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    submitted: string;
    underProcess: string;
    settled: string;
    returned: string;
    rejected: string;
    advanceSimulation: string;
  };
  interpreter: {
    title: string;
    subtitle: string;
    diagnose: string;
    plainMeaning: string;
    citedRules: string;
    nextSteps: string;
  };
  recovery: {
    title: string;
    subtitle: string;
    checklistHeading: string;
    allStepsDone: string;
    resubmitMockClaim: string;
  };
  reconciliation: {
    title: string;
    subtitle: string;
    requestedAmount: string;
    eligibleAmount: string;
    settledAmount: string;
    deductionExplanation: string;
    confirmedFacts: string;
    acceptSettlement: string;
    disputeGrievance: string;
  };
  grievance: {
    title: string;
    subtitle: string;
    petitionSubject: string;
    statutorySummary: string;
    petitionBody: string;
    evidenceList: string;
    copyPetition: string;
    downloadPetition: string;
    registerEpfigms: string;
    docketNumber: string;
    slaTracker: string;
    daysRemaining: string;
    setReminder: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    common: {
      brandName: "ClaimSaathi",
      brandTagline: "PF guidance, made human",
      howItWorks: "How it works",
      safety: "Safety",
      openDemo: "Open demo",
      skipToMain: "Skip to main content",
      switchCitizen: "Switch citizen",
      prototypeNotice: "Independent prototype · No live government connection",
      buildathonNote: "Built for the OpenAI Buildathon",
      copyright: "© 2026 ClaimSaathi",
      back: "Back",
      next: "Next",
      submit: "Submit",
      copy: "Copy",
      copied: "Copied!",
      download: "Download",
      close: "Close",
      cancel: "Cancel",
      retry: "Retry",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      actionNeeded: "Action needed",
      synthetic: "Synthetic",
      language: "Language",
      english: "English",
      hindi: "हिन्दी",
      switchToHindi: "Switch language to Hindi",
      switchToEnglish: "अंग्रेज़ी में बदलें (Switch to English)",
      lowBandwidth: "Low Bandwidth",
      lowBandwidthOn: "Low-Bandwidth Mode: On",
      lowBandwidthOff: "Low-Bandwidth Mode: Off",
    },
    landing: {
      heroPill: "Independent Citizen Prototype",
      heroHeading: "PF withdrawal guidance, made clear and human.",
      heroLead:
        "ClaimSaathi redesigns the fragmented EPF withdrawal experience into one transparent, stress-free path with explainable eligibility, preflight readiness checks, and guided problem recovery.",
      exploreDemoCta: "Explore Interactive Demo →",
      seeHowItWorksCta: "See How It Works",
      stat1Value: "100%",
      stat1Label: "Synthetic & Safe Simulation",
      stat2Value: "0 Login",
      stat2Label: "Instant No-Credential Entry",
      stat3Value: "15 Days",
      stat3Label: "Citizen's Charter SLA Tracking",
      howItWorksHeading: "How ClaimSaathi Works",
      howItWorksSub:
        "Step through the five core stages of a smooth PF withdrawal.",
      safetyHeading: "Safety & Non-Affiliation Guarantees",
      safetySub:
        "ClaimSaathi is completely independent and never requests live credentials or government documents.",
      step1Title: "1. Goal & Amount Planning",
      step1Desc:
        "Understand your withdrawal eligibility deterministically based on purpose and service tenure.",
      step2Title: "2. KYC & Document Preflight",
      step2Desc:
        "Detect name mismatches, bank passbook issues, and missing signatures before filing.",
      step3Title: "3. Simplified Mock Application",
      step3Desc:
        "Complete a streamlined form with inline guidance and simulated OTP verification.",
      step4Title: "4. Status Timeline & AI Interpreter",
      step4Desc:
        "Track milestone progress and translate cryptic rejection remarks into plain-language next steps.",
      step5Title: "5. Reconciliation & Grievance",
      step5Desc:
        "Reconcile short settlement amounts or prepare statutory petitions for EPFiGMS.",
      faqHeading: "Frequently Asked Questions",
    },
    demo: {
      title: "Interactive Citizen Demo",
      subtitle:
        "Experience ClaimSaathi's complete guidance journey through realistic synthetic citizen scenarios.",
      selectCitizen: "Select a synthetic citizen scenario",
      currentCitizen: "Current citizen case",
      balance: "Synthetic PF Balance",
      activeClaim: "Active Claim",
      issueState: "Issue State",
      recentActivity: "Recent Activity",
      nextAction: "Recommended Next Action",
      timeline: "Track Claim Timeline",
      explainIssue: "Explain with AI Interpreter",
      startRecovery: "Start Rejection Recovery",
      reconcileSettlement: "Compare Settlement Amounts",
      prepareGrievance: "Prepare Grievance Petition",
      planWithdrawal: "Plan Withdrawal Goal",
      checkPreflight: "Run Readiness Preflight",
      startMockClaim: "Start Simplified Form",
    },
    preflight: {
      title: "Readiness Preflight Check",
      subtitle:
        "Verify identity, bank account details, and documents before filing to avoid avoidable rejections.",
      identityCheck: "Identity & Name Match",
      bankCheck: "Bank Account & IFSC Validation",
      evidenceCheck: "Document & Passbook Legibility",
      allClear: "All Preflight Checks Passed",
      fixAction: "Fix Issue",
      recheckAction: "Re-run Preflight Check",
    },
    planner: {
      title: "Withdrawal Goal & Amount Planner",
      subtitle:
        "Determine your eligible advance amount deterministically based on statutory EPFO scheme rules.",
      selectGoal: "Select your withdrawal purpose",
      eligibleAmount: "Calculated Eligible Amount",
      serviceDuration: "Continuous Service Duration",
      advanceRule: "Applicable Scheme Rule",
      continueToForm: "Proceed to Application Form →",
    },
    form: {
      title: "Simplified Mock Claim Form",
      subtitle:
        "A guided, step-by-step application with auto-saved progress and simulated OTP verification.",
      step1: "1. Purpose & Reason",
      step2: "2. Amount & Bank Details",
      step3: "3. Document Upload",
      step4: "4. Review & OTP Verification",
      aadhaarOtp: "Simulated Aadhaar OTP",
      verifyOtp: "Verify OTP & Submit",
      submitMockClaim: "Submit Mock Claim",
      acknowledgement: "Synthetic Acknowledgement Receipt",
    },
    timeline: {
      title: "Claim Status Timeline",
      subtitle:
        "Track lifecycle milestones from submission through field office processing and final settlement.",
      submitted: "Submitted",
      underProcess: "Under Process",
      settled: "Settled",
      returned: "Returned for Correction",
      rejected: "Rejected",
      advanceSimulation: "Advance Simulation Step",
    },
    interpreter: {
      title: "AI Claim-Issue Interpreter",
      subtitle:
        "Translate official rejection remarks and technical error codes into plain language and actionable next steps.",
      diagnose: "Diagnose Remark",
      plainMeaning: "Plain Language Meaning",
      citedRules: "Cited Scheme Rules",
      nextSteps: "Recommended Actions",
    },
    recovery: {
      title: "Rejection Recovery Journey",
      subtitle:
        "Step-by-step guidance to fix bank mismatches, upload valid evidence, and resubmit cleanly.",
      checklistHeading: "Recovery Action Checklist",
      allStepsDone: "All Issues Resolved",
      resubmitMockClaim: "Resubmit Clean Mock Claim →",
    },
    reconciliation: {
      title: "Settlement Reconciliation",
      subtitle:
        "Compare requested, eligible, and actual settled amounts with transparent statutory deduction breakdowns.",
      requestedAmount: "Requested Amount",
      eligibleAmount: "Eligible Amount",
      settledAmount: "Settled Amount",
      deductionExplanation: "Statutory Deductions & Scheme Caps",
      confirmedFacts: "Verified Facts Ledger",
      acceptSettlement: "Accept Reconciled Amount",
      disputeGrievance: "Dispute via Grievance →",
    },
    grievance: {
      title: "Grievance Preparation & Follow-Up",
      subtitle:
        "Draft a statutory petition for EPFiGMS with cited clauses, evidence checklist, and 15-day SLA tracker.",
      petitionSubject: "Grievance Subject",
      statutorySummary: "Statutory Summary",
      petitionBody: "Formal Petition Text",
      evidenceList: "Supporting Evidence Checklist",
      copyPetition: "Copy Petition",
      downloadPetition: "Download (.txt)",
      registerEpfigms: "Simulate EPFiGMS Registration",
      docketNumber: "Simulated Docket Reference",
      slaTracker: "15-Day Citizen's Charter SLA",
      daysRemaining: "Days Remaining in SLA",
      setReminder: "Set Calendar Reminder",
    },
  },
  hi: {
    common: {
      brandName: "क्लेमसाथी (ClaimSaathi)",
      brandTagline: "पीएफ निकासी मार्गदर्शन, अब सरल और मानवीय",
      howItWorks: "यह कैसे काम करता है",
      safety: "सुरक्षा व गोपनीयता",
      openDemo: "डेमो खोलें",
      skipToMain: "मुख्य सामग्री पर जाएं",
      switchCitizen: "नागरिक बदलें",
      prototypeNotice: "स्वतंत्र प्रोटोटाइप · कोई सरकारी संबंध नहीं",
      buildathonNote: "OpenAI बिल्डाथॉन हेतु निर्मित",
      copyright: "© 2026 क्लेमसाथी",
      back: "पीछे जाएं",
      next: "आगे बढ़ें",
      submit: "सबमिट करें",
      copy: "कॉपी करें",
      copied: "कॉपी हो गया!",
      download: "डाउनलोड करें",
      close: "बंद करें",
      cancel: "रद्द करें",
      retry: "पुनः प्रयास करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफल",
      actionNeeded: "कार्रवाई आवश्यक",
      synthetic: "सिम्युलेटेड (काल्पनिक)",
      language: "भाषा",
      english: "English",
      hindi: "हिन्दी",
      switchToHindi: "हिन्दी में बदलें",
      switchToEnglish: "अंग्रेज़ी में बदलें (Switch to English)",
      lowBandwidth: "कम बैंडविड्थ (धीमा नेटवर्क)",
      lowBandwidthOn: "कम बैंडविड्थ मोड: सक्रिय",
      lowBandwidthOff: "कम बैंडविड्थ मोड: बंद",
    },
    landing: {
      heroPill: "स्वतंत्र नागरिक प्रोटोटाइप",
      heroHeading: "पीएफ निकासी की पूरी प्रक्रिया, अब सरल और पारदर्शी।",
      heroLead:
        "क्लेमसाथी ईपीएफ निकासी की जटिल प्रक्रिया को एक सहज, तनाव-मुक्त अनुभव में बदलता है—जिसमें स्पष्ट पात्रता गणना, प्री-फ्लाइट तैयारी जांच और रिजेक्शन सुधार शामिल है।",
      exploreDemoCta: "इंटरैक्टिव डेमो देखें →",
      seeHowItWorksCta: "प्रक्रिया समझें",
      stat1Value: "100%",
      stat1Label: "सुरक्षित व काल्पनिक डेटा",
      stat2Value: "0 लॉगिन",
      stat2Label: "बिना पासवर्ड सीधा डेमो प्रवेश",
      stat3Value: "15 दिन",
      stat3Label: "नागरिक चार्टर समयसीमा ट्रैकिंग",
      howItWorksHeading: "क्लेमसाथी कैसे सहायता करता है",
      howItWorksSub: "सफल पीएफ निकासी के पांच प्रमुख चरण।",
      safetyHeading: "सुरक्षा व निष्पक्षता की गारंटी",
      safetySub:
        "क्लेमसाथी पूरी तरह स्वतंत्र है और कभी भी आपका असली आधार, पैन या बैंक पासवर्ड नहीं मांगता।",
      step1Title: "1. उद्देश्य व पात्रता योजना",
      step1Desc:
        "निकासी के उद्देश्य और सेवा अवधि के आधार पर सटीक और प्रामाणिक पात्रता राशि जानें।",
      step2Title: "2. केवाईसी व दस्तावेज प्री-फ्लाइट जांच",
      step2Desc:
        "दावा प्रस्तुत करने से पहले नाम में अंतर, बैंक पासबुक अस्पष्टता और दस्तावेज कमियों की पहचान करें।",
      step3Title: "3. सरल मॉक आवेदन फॉर्म",
      step3Desc:
        "स्पष्ट दिशानिर्देशों और सिम्युलेटेड ओटीपी सत्यापन के साथ आसान फॉर्म भरें।",
      step4Title: "4. स्थिति समयरेखा और एआई इंटरप्रेटर",
      step4Desc:
        "आवेदन की स्थिति ट्रैक करें और तकनीकी रिजेक्शन कारणों को सरल हिन्दी में समझें।",
      step5Title: "5. निपटान मिलान और शिकायत (Grievance)",
      step5Desc:
        "कम प्राप्त राशि का नियमवार मिलान करें या EPFiGMS पोर्टल हेतु औपचारिक याचिका तैयार करें।",
      faqHeading: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
    },
    demo: {
      title: "इंटरैक्टिव नागरिक डेमो",
      subtitle:
        "वास्तविक जैसे काल्पनिक परिदृश्यों के माध्यम से क्लेमसाथी की संपूर्ण सुविधाओं का अनुभव करें।",
      selectCitizen: "एक काल्पनिक नागरिक केस चुनें",
      currentCitizen: "वर्तमान नागरिक केस",
      balance: "काल्पनिक पीएफ शेष (Balance)",
      activeClaim: "सक्रिय दावा",
      issueState: "समस्या की स्थिति",
      recentActivity: "हाल की गतिविधि",
      nextAction: "सुझाया गया अगला कदम",
      timeline: "दावा समयरेखा देखें",
      explainIssue: "एआई इंटरप्रेटर से समझें",
      startRecovery: "रिजेक्शन सुधार शुरू करें",
      reconcileSettlement: "निपटान राशि का मिलान करें",
      prepareGrievance: "शिकायत याचिका तैयार करें",
      planWithdrawal: "निकासी राशि प्लान करें",
      checkPreflight: "प्री-फ्लाइट जांच चलाएं",
      startMockClaim: "मॉक दावा फॉर्म शुरू करें",
    },
    preflight: {
      title: "तैयारी प्री-फ्लाइट जांच",
      subtitle:
        "अनावश्यक रिजेक्शन से बचने के लिए आवेदन से पूर्व पहचान, बैंक खाता और दस्तावेजों की पुष्टि करें।",
      identityCheck: "पहचान व नाम का मिलान",
      bankCheck: "बैंक खाता व IFSC सत्यापन",
      evidenceCheck: "दस्तावेज व पासबुक स्पष्टता",
      allClear: "सभी प्री-फ्लाइट जांच सफल रहीं",
      fixAction: "त्रुटि सुधारें",
      recheckAction: "पुनः जांच करें",
    },
    planner: {
      title: "निकासी उद्देश्य व राशि योजनाकार",
      subtitle:
        "ईपीएफओ नियमों के अनुसार अपनी पात्र अग्रिम राशि की पारदर्शी गणना करें।",
      selectGoal: "निकासी का उद्देश्य चुनें",
      eligibleAmount: "गणना की गई पात्र राशि",
      serviceDuration: "कुल निरंतर सेवा अवधि",
      advanceRule: "लागू योजना नियम (EPF Scheme Rule)",
      continueToForm: "आवेदन फॉर्म पर आगे बढ़ें →",
    },
    form: {
      title: "सरल मॉक दावा फॉर्म",
      subtitle:
        "चरण-दर-चरण मार्गदर्शन, स्वतः सहेजी गई प्रगति और सिम्युलेटेड ओटीपी सत्यापन।",
      step1: "1. उद्देश्य व कारण",
      step2: "2. राशि व बैंक विवरण",
      step3: "3. दस्तावेज अपलोड",
      step4: "4. समीक्षा व ओटीपी सत्यापन",
      aadhaarOtp: "सिम्युलेटेड आधार ओटीपी",
      verifyOtp: "ओटीपी सत्यापित कर सबमिट करें",
      submitMockClaim: "दावा सबमिट करें",
      acknowledgement: "काल्पनिक पावती रसीद (Acknowledgement)",
    },
    timeline: {
      title: "दावा स्थिति समयरेखा (Timeline)",
      subtitle:
        "दावा सबमिशन से लेकर क्षेत्रीय कार्यालय प्रसंस्करण और अंतिम निपटान तक की प्रगति देखें।",
      submitted: "सबमिट किया गया",
      underProcess: "प्रक्रियाधीन (Under Process)",
      settled: "निपटारा पूर्ण (Settled)",
      returned: "सुधार हेतु वापस (Returned)",
      rejected: "अस्वीकृत (Rejected)",
      advanceSimulation: "सिम्युलेशन अगला चरण बढ़ाएं",
    },
    interpreter: {
      title: "एआई दावा-समस्या इंटरप्रेटर",
      subtitle:
        "कठिन तकनीकी टिप्पणियों और रिजेक्शन कारणों को सरल हिन्दी में समझें और सही समाधान जानें।",
      diagnose: "टिप्पणी का विश्लेषण करें",
      plainMeaning: "सरल भाषा में अर्थ",
      citedRules: "उल्लिखित सरकारी नियम",
      nextSteps: "सुझाए गए सुधारात्मक कदम",
    },
    recovery: {
      title: "रिजेक्शन सुधार यात्रा (Recovery Journey)",
      subtitle:
        "बैंक विवरण बेमेल ठीक करें, सही दस्तावेज अपलोड करें और पुनः त्रुटिरहित दावा प्रस्तुत करें।",
      checklistHeading: "सुधार कार्य चेकलिस्ट",
      allStepsDone: "सभी समस्याएं हल हो गईं",
      resubmitMockClaim: "नया मॉक दावा सबमिट करें →",
    },
    reconciliation: {
      title: "निपटान राशि मिलान (Reconciliation)",
      subtitle:
        "मांगी गई, पात्र और वास्तव में प्राप्त राशि का कानूनी कटौतियों सहित स्पष्ट विश्लेषण।",
      requestedAmount: "मांगी गई राशि",
      eligibleAmount: "पात्र राशि",
      settledAmount: "प्राप्त/निपटाई गई राशि",
      deductionExplanation: "कानूनी कटौती व योजना सीमा विवरण",
      confirmedFacts: "सत्यापित तथ्य खाता",
      acceptSettlement: "प्राप्त राशि स्वीकार करें",
      disputeGrievance: "शिकायत दर्ज करें →",
    },
    grievance: {
      title: "शिकायत तैयारी व ट्रैकिंग (EPFiGMS)",
      subtitle:
        "ईपीएफ नियमों के संदर्भ के साथ औपचारिक याचिका, दस्तावेज सूची और 15-दिवसीय समयसीमा ट्रैकर।",
      petitionSubject: "शिकायत का विषय",
      statutorySummary: "कानूनी सारांश",
      petitionBody: "औपचारिक याचिका पत्र",
      evidenceList: "संलग्न साक्ष्य दस्तावेज चेकलिस्ट",
      copyPetition: "याचिका कॉपी करें",
      downloadPetition: "डाउनलोड करें (.txt)",
      registerEpfigms: "सिम्युलेटेड EPFiGMS पंजीकरण",
      docketNumber: "सिम्युलेटेड डॉकेट नंबर",
      slaTracker: "15-दिवसीय नागरिक चार्टर समयसीमा",
      daysRemaining: "समयसीमा में शेष दिन",
      setReminder: "कैलेंडर रिमाइंडर सेट करें",
    },
  },
};
