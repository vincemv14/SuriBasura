/**
 * SuriBasura - Filipino/Tagalog UI Strings
 * All user-facing text in conversational Filipino.
 * Admin-facing text in English/Taglish.
 */

export const strings = {
  // ===== APP-WIDE =====
  app: {
    name: "SuriBasura",
    tagline: "Environment Meets Technology",
    subtitle: "iKNOWbasyon",
    description: "I-scan ang basura, alamin ang 5R!",
  },

  // ===== NAVIGATION =====
  nav: {
    home: "Home",
    scan: "I-Scan",
    proof: "Proof",
    badges: "Mga Badge",
    profile: "Profile",
    admin: "Admin",
    review: "Review",
  },

  // ===== AUTH - USER (PIN-based) =====
  auth: {
    loginTitle: "Mag-login ka!",
    loginSubtitle: "Ilagay ang pangalan at PIN mo para makapagsimula.",
    nameLabel: "Pangalan mo",
    namePlaceholder: "Juan Dela Cruz",
    barangayLabel: "Barangay o School",
    barangayPlaceholder: "Brgy. Masagana / Liliw NHS",
    pinLabel: "PIN (4 digits)",
    pinPlaceholder: "••••",
    loginButton: "Mag-login",
    registerTitle: "Mag-register ka!",
    registerSubtitle: "Gumawa ng account para makapagsimula ng 5R Challenge.",
    registerButton: "Mag-register",
    switchToRegister: "Wala ka pang account? Mag-register!",
    switchToLogin: "May account ka na? Mag-login!",
    errorInvalidPin: "Mali ang PIN mo. Subukan ulit!",
    errorNameRequired: "Kailangan ang pangalan mo.",
    errorPinLength: "Ang PIN ay dapat 4 na numero.",
    errorUserNotFound: "Hindi ka pa naka-register. Mag-register ka muna!",
    errorNameTaken: "May gumagamit na ng pangalan na ito sa barangay/school mo.",
    logoutButton: "Mag-logout",
  },

  // ===== AUTH - ADMIN =====
  adminAuth: {
    loginTitle: "Admin Login",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    errorInvalid: "Invalid email or password.",
  },

  // ===== SCAN FLOW =====
  scan: {
    title: "I-scan ang Basura Mo!",
    subtitle: "Kunan ng litrato o mag-upload ng photo ng basura.",
    cameraButton: "📷 Gamitin ang Camera",
    uploadButton: "📁 Mag-upload ng Photo",
    captureButton: "📸 Kunin ang Litrato",
    retakeButton: "Ulitin",
    classifyButton: "✓ I-classify",
    loadingModel: "Naglo-load ang AI...",
    identifyingItem: "Kinikilala ang basura...",
    resultTitle: "Resulta ng Scan",
    detectedItem: "Na-detect na item",
    recommendedR: "Inirerekomendang aksyon",
    scanAnother: "📸 Mag-scan Ulit",
    submitProof: "📝 Mag-submit ng Proof",
    errorCamera: "Hindi ma-access ang camera. Payagan ang camera permission o mag-upload na lang.",
    errorClassify: "Hindi ma-classify. Subukan ulit!",
    privacyNote: "🔒 Ang AI ay tumatakbo sa browser mo — walang naa-upload na litrato sa ibang server.",
  },

  // ===== 5R CATEGORIES =====
  fiveR: {
    reduce: "Reduce",
    reuse: "Reuse",
    recover: "Recover",
    recycle: "Recycle",
    repair: "Repair",
    reduceDesc: "Bawasan ang paggamit ng ganitong basura",
    reuseDesc: "Gamitin ulit sa ibang paraan",
    recoverDesc: "Kunin ang materyales o energy value nito",
    recycleDesc: "Dalhin sa recycling center o junk shop",
    repairDesc: "Ayusin para magamit pa ulit",
  },

  // ===== PROOF SUBMISSION =====
  proof: {
    title: "Mag-submit ng Proof of Action",
    subtitle: "Ipakita kung ano ang ginawa mo sa basura!",
    selectR: "Anong R ang ginawa mo?",
    beforePhoto: "📸 BEFORE: Litrato bago mo gawin",
    afterPhoto: "📸 AFTER: Litrato pagkatapos",
    captionLabel: "Ano ang ginawa mo?",
    captionPlaceholder: "Halimbawa: Ginawa kong paso ang plastic bottle para sa halaman",
    submitButton: "I-submit ang Proof",
    submitting: "Nagsusumite...",
    successTitle: "Na-submit na!",
    successMessage: "Hintayin ang pag-approve ng eco officer. Kapag na-approve, makakakuha ka ng badge!",
    pendingStatus: "⏳ Hinihintay ang approval",
    approvedStatus: "✅ Na-approve na!",
    rejectedStatus: "❌ Hindi na-approve",
    flaggedStatus: "🚩 Na-flag — kailangan ulitin",
    errorNoPhotos: "Kailangan ng before at after photo.",
    errorNoCaption: "Maglagay ng maikling caption.",
    viewMyProofs: "Mga naisubmit ko",
  },

  // ===== BADGES =====
  badges: {
    title: "Mga Badge at Medals Mo",
    subtitle: "Kumpletuhin ang 5R Challenge para makakuha ng rewards!",
    bronze: "🥉 Bronze Badge",
    silver: "🥈 Silver Badge",
    gold: "🥇 Gold Badge — Full 5R!",
    bronzeReq: "Unang na-approve na proof",
    silverReq: "5 approved proofs sa 3+ R categories",
    goldReq: "May proof sa bawat isa ng 5 R's",
    categoryMedal: "Medalya ng",
    earned: "Nakuha na!",
    locked: "Hindi pa nakukuha",
    claimReward: "I-claim ang Reward",
    rewardClaimed: "Na-claim na ang reward!",
    progressTitle: "Progress mo sa 5R Challenge",
    completedR: "Natapos na",
    outOf5: "sa 5 R's",
  },

  // ===== REWARDS =====
  rewards: {
    title: "Mga Reward",
    tier1: "1R = 1 ballpen",
    tier2: "2R = 2 ballpen + 1 notebook",
    tier3: "3R = 3 ballpen + 2 notebook + pencil case",
    tier4: "4R = + art/ruler set",
    tier5: "5R = Kumpletong School Kit Bundle!",
    howToClaim: "Ipakita ang badge mo sa admin/teacher para i-claim ang reward.",
  },

  // ===== IMPACT / COMMUNITY STATS =====
  impact: {
    title: "Community Impact",
    subtitle: "Sama-sama nating tinatapos ang 5R Challenge!",
    totalScans: "Kabuuang Scans",
    totalProofs: "Mga Na-approve na Proofs",
    totalBadges: "Mga Badge na Na-earn",
    today: "Ngayong Araw",
    barangayLeader: "Nangungunang Barangay",
  },

  // ===== ERRORS =====
  errors: {
    generic: "May nangyaring mali. Subukan ulit!",
    network: "Walang internet connection. Subukan ulit mamaya.",
    rateLimit: "Sandali lang — masyadong mabilis. Hintay ng kaunti at subukan ulit.",
    unauthorized: "Kailangan mong mag-login muna.",
    forbidden: "Wala kang permission dito.",
  },

  // ===== ADMIN DASHBOARD (English/Taglish) =====
  admin: {
    dashboard: "Admin Dashboard",
    reviewQueue: "Review Queue",
    rewardInventory: "Reward Inventory",
    userManagement: "User Management",
    leaderboard: "Leaderboard & Stats",
    pendingRedemptions: "Pending Redemptions",
    approve: "Approve",
    reject: "Reject",
    flag: "Flag",
    markClaimed: "Mark as Claimed",
    addStock: "Add Stock",
    totalUsers: "Total Users",
    totalApproved: "Total Approved Proofs",
    seasons: "Seasons",
    createSeason: "Create New Season",
  },
} as const;

export type StringKeys = typeof strings;
