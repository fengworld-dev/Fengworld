/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ZedMarket Application Logic
 * Handles all UI interactions, navigation, and business logic
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────── INITIALIZATION ─────────── //
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Render initial grid
  renderGrid();

  // Set up event listeners
  setupEventListeners();

  // Initialize admin section
  updateAdminDashboard();
}

// ─────────── EVENT LISTENERS ─────────── //
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('qIn');
  const searchCategory = document.getElementById('qCat');
  const sortSelect = document.getElementById('srt');

  if (searchInput) {
    searchInput.addEventListener('input', renderGrid);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') renderGrid();
    });
  }

  if (searchCategory) {
    searchCategory.addEventListener('change', renderGrid);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', renderGrid);
  }

  // Category filter buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cp')) {
      const category = e.target.getAttribute('data-category') || '';
      setCategory(e.target, category);
    }
  });
}

// ─────────── NAVIGATION ─────────── //
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach((page) => {
    page.classList.remove('active');
  });

  // Show selected page
  const selectedPage = document.getElementById(`page-${pageId}`);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Render page-specific content
  if (pageId === 'home') {
    renderGrid();
  } else if (pageId === 'admin') {
    updateAdminDashboard();
  }
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

// ─────────── GRID & SEARCH ─────────── //
function renderGrid() {
  const searchQuery = getInputValue('qIn');
  const selectedCategory = getInputValue('qCat');
  const sortBy = getInputValue('srt') || 'trending';

  // Search businesses
  const businesses = db.searchBusinesses(searchQuery, selectedCategory, sortBy);

  // Get grid container
  const gridContainer = document.getElementById('bizGrid');
  const noResultsDiv = document.getElementById('noR');
  const countDiv = document.getElementById('bcnt');

  if (!gridContainer) return;

  // Update count
  if (countDiv) {
    countDiv.textContent = `Showing ${businesses.length} business${businesses.length !== 1 ? 'es' : ''}`;
  }

  // Show/hide no results
  if (businesses.length === 0) {
    gridContainer.innerHTML = '';
    if (noResultsDiv) noResultsDiv.style.display = 'block';
    return;
  }

  if (noResultsDiv) noResultsDiv.style.display = 'none';

  // Render cards
  gridContainer.innerHTML = businesses
    .map((business) => createBusinessCard(business))
    .join('');
}

function createBusinessCard(business) {
  return `
    <div class="bc">
      <div class="bc-img">
        <div class="bph">${business.emoji}</div>
        ${business.trending ? '<div class="tb">🔥 Trending</div>' : ''}
        ${business.verified ? '<div class="vb">✓ Verified</div>' : ''}
      </div>
      <div class="bi">
        <div class="bcat">${business.cat}</div>
        <div class="bn" onclick="showBusinessDetail(${business.id})">${business.name}</div>
        <div class="bdesc">${business.desc}</div>
        <div class="bmeta">
          <div class="bloc">📍 ${business.city}</div>
          <div class="brat">★ ${business.rating || 'N/A'}</div>
        </div>
        <div class="sbs">
          ${business.wa ? `<a class="sb wa" href="https://wa.me/${business.wa}" target="_blank">${getWhatsAppIcon()} WhatsApp</a>` : ''}
          ${business.fb ? `<a class="sb fb" href="https://facebook.com/${business.fb}" target="_blank">f Facebook</a>` : ''}
          ${business.ig ? `<a class="sb ig" href="https://instagram.com/${business.ig}" target="_blank">📷 Insta</a>` : ''}
          <button class="sb vw" onclick="showBusinessDetail(${business.id})">View →</button>
        </div>
      </div>
    </div>
  `;
}

function setCategory(element, category) {
  // Remove active class from all category pills
  document.querySelectorAll('.cp').forEach((pill) => {
    pill.classList.remove('on');
  });

  // Add active class to clicked pill
  element.classList.add('on');

  // Update search and render
  const categorySelect = document.getElementById('qCat');
  if (categorySelect) {
    categorySelect.value = category;
  }

  renderGrid();
}

// ─────────── BUSINESS DETAIL ─────────── //
function showBusinessDetail(businessId) {
  const business = db.getBusinessById(businessId);
  if (!business) return;

  // Update detail page
  updateDetailPage(business);

  // Show detail page
  showPage('detail');
}

function updateDetailPage(business) {
  // Header info
  const dEmoji = document.getElementById('dEmoji');
  const dCat = document.getElementById('dCat');
  const dName = document.getElementById('dName');
  const dDesc = document.getElementById('dDesc');
  const dTags = document.getElementById('dTags');

  if (dEmoji) dEmoji.textContent = business.emoji;
  if (dCat) dCat.textContent = business.cat;
  if (dName) dName.textContent = business.name;
  if (dDesc) dDesc.textContent = business.desc;

  // Tags
  if (dTags) {
    const tags = [business.city, business.province, business.verified ? '✓ Verified' : ''].filter(Boolean);
    dTags.innerHTML = tags.map((tag) => `<span class="btag">${tag}</span>`).join('');
  }

  // About section
  const dAbout = document.getElementById('dAbout');
  if (dAbout) dAbout.textContent = business.fullDesc;

  // Services
  const dSvc = document.getElementById('dSvc');
  if (dSvc) {
    dSvc.innerHTML = business.svc
      .split(',')
      .map((service) => `<div style="padding:7px 0;border-bottom:1px solid #1e1e1e;">• ${service.trim()}</div>`)
      .join('');
  }

  // Contact info
  const dContact = document.getElementById('dContact');
  if (dContact) {
    dContact.innerHTML = `
      <div class="ci"><span>📱</span><div><span class="clbl">Phone</span>${business.phone}</div></div>
      ${business.email ? `<div class="ci"><span>✉</span><div><span class="clbl">Email</span>${business.email}</div></div>` : ''}
      <div class="ci"><span>📍</span><div><span class="clbl">Address</span>${business.address}</div></div>
      <div class="ci"><span>👤</span><div><span class="clbl">Owner</span>${business.owner}</div></div>
      ${business.rating ? `<div class="ci"><span>★</span><div><span class="clbl">Rating</span>${business.rating}/5.0</div></div>` : ''}
    `;
  }

  // Social media
  const dSocial = document.getElementById('dSocial');
  if (dSocial) {
    let socialHTML = '';
    if (business.wa) {
      socialHTML += `<a class="sbl wa" href="https://wa.me/${business.wa}" target="_blank">${getWhatsAppIcon()} Chat on WhatsApp</a>`;
    }
    if (business.fb) {
      socialHTML += `<a class="sbl fb" href="https://facebook.com/${business.fb}" target="_blank">f  Facebook Page</a>`;
    }
    if (business.ig) {
      socialHTML += `<a class="sbl ig" href="https://instagram.com/${business.ig}" target="_blank">📷  Instagram</a>`;
    }
    dSocial.innerHTML = socialHTML || '<div style="font-size:12px;color:#444;">No social media added.</div>';
  }
}

// ─────────── AUTHENTICATION ─────────── //
function switchAuthTab(tab) {
  const signInForm = document.getElementById('fIn');
  const signUpForm = document.getElementById('fUp');
  const tabIn = document.getElementById('tIn');
  const tabUp = document.getElementById('tUp');

  if (tab === 'in') {
    if (signInForm) signInForm.style.display = 'block';
    if (signUpForm) signUpForm.style.display = 'none';
    if (tabIn) tabIn.className = 'at on';
    if (tabUp) tabUp.className = 'at';
  } else {
    if (signInForm) signInForm.style.display = 'none';
    if (signUpForm) signUpForm.style.display = 'block';
    if (tabIn) tabIn.className = 'at';
    if (tabUp) tabUp.className = 'at on';
    resetSignUpForm();
  }
}

function handleSignIn() {
  const email = getInputValue('siE');
  const password = getInputValue('siP');

  if (!email || !password) {
    showToast('Fill in all fields', 'error');
    return;
  }

  const user = db.authenticateUser(email, password);
  if (user) {
    closeModal('moAuth');
    showToast(`Welcome back, ${user.fn}!`, 'success');
    // Store user session
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    showToast('Invalid email or password', 'error');
  }
}

function goToSignUpStep(step) {
  // Validate current step
  if (step === 2) {
    const fn = getInputValue('s1fn');
    const ln = getInputValue('s1ln');
    const nrc = getInputValue('s1nrc');
    const gen = getInputValue('s1gen');
    const email = getInputValue('s1em');
    const pw = getInputValue('s1pw');

    if (!fn || !ln || !nrc || !gen || !email || !pw) {
      showToast('Fill all required fields', 'error');
      return;
    }

    if (pw.length < 6) {
      showToast('Password must be 6+ characters', 'error');
      return;
    }
  } else if (step === 3) {
    const wa = getInputValue('s2wa');
    const prov = getInputValue('s2prov');
    const city = getInputValue('s2city');
    const addr = getInputValue('s2addr');

    if (!wa || !prov || !city || !addr) {
      showToast('Fill all required contact fields', 'error');
      return;
    }
  }

  // Show step
  [1, 2, 3].forEach((i) => {
    const stepDiv = document.getElementById(`ss${i}`);
    if (stepDiv) stepDiv.style.display = i === step ? 'block' : 'none';
  });

  // Update progress bar
  ['sd1', 'sd2', 'sd3'].forEach((id, i) => {
    const progressBar = document.getElementById(id);
    if (progressBar) {
      progressBar.className = 'sd' + (i + 1 < step ? ' done' : i + 1 === step ? ' active' : '');
    }
  });
}

function resetSignUpForm() {
  [1, 2, 3].forEach((i) => {
    const stepDiv = document.getElementById(`ss${i}`);
    if (stepDiv) stepDiv.style.display = i === 1 ? 'block' : 'none';
  });

  ['sd1', 'sd2', 'sd3'].forEach((id, i) => {
    const progressBar = document.getElementById(id);
    if (progressBar) {
      progressBar.className = 'sd' + (i === 0 ? ' done' : '');
    }
  });

  // Clear form
  document.querySelectorAll('.fi, .fs, .fta').forEach((input) => {
    input.value = '';
  });
}

function handleSignUp() {
  const bn = getInputValue('s3bn');
  const cat = getInputValue('s3cat');
  const sd = getInputValue('s3sd');
  const fd = getInputValue('s3fd');

  if (!bn || !cat || !sd || !fd) {
    showToast('Fill all business fields', 'error');
    return;
  }

  // Create user
  const user = {
    fn: getInputValue('s1fn'),
    ln: getInputValue('s1ln'),
    nrc: getInputValue('s1nrc'),
    gen: getInputValue('s1gen'),
    email: getInputValue('s1em'),
    pw: getInputValue('s1pw'),
    wa: getInputValue('s2wa'),
    ph2: getInputValue('s2ph'),
    fb: getInputValue('s2fb'),
    ig: getInputValue('s2ig'),
    prov: getInputValue('s2prov'),
    city: getInputValue('s2city'),
    addr: getInputValue('s2addr'),
  };

  db.registerUser(user);

  // Create business
  const businessData = {
    name: bn,
    cat: cat,
    city: getInputValue('s2city'),
    province: getInputValue('s2prov'),
    desc: sd,
    fullDesc: fd,
    svc: getInputValue('s3svc'),
    emoji: db.getCategoryEmoji(cat),
    owner: `${user.fn} ${user.ln}`,
    nrc: user.nrc,
    phone: user.wa,
    wa: user.wa.replace(/[^0-9]/g, ''),
    fb: user.fb,
    ig: user.ig.replace('@', ''),
    email: user.email,
    address: getInputValue('s2addr'),
    pacra: getInputValue('s3pacra'),
  };

  db.submitBusiness(businessData);

  // Show success
  closeModal('moAuth');
  showModal('moSuccess');

  const sucT = document.getElementById('sucT');
  const sucM = document.getElementById('sucM');

  if (sucT) sucT.textContent = 'Application Submitted! 🎉';
  if (sucM) {
    sucM.innerHTML = `Thank you, <strong>${user.fn}</strong>! Your business <strong>"${bn}"</strong> has been submitted for review. The Feng World team will contact you within 24–48 hours.`;
  }

  // Reset form
  resetSignUpForm();
}

// ─────────── TRENDING ─────────── //
function selectTrendingPlan(element, planName, planPrice) {
  // Remove active class from all plans
  document.querySelectorAll('.pc').forEach((plan) => {
    plan.classList.remove('on');
  });

  // Add active class to selected plan
  element.classList.add('on');

  // Store selected plan
  const planNameInput = document.getElementById('spn');
  const planPriceInput = document.getElementById('spp');

  if (planNameInput) planNameInput.value = planName;
  if (planPriceInput) planPriceInput.value = planPrice;
}

function submitTrendingRequest() {
  const bizName = getInputValue('trBiz');
  const phone = getInputValue('trPh');
  const planName = document.getElementById('spn')?.value || '';
  const planPrice = document.getElementById('spp')?.value || '';

  if (!bizName || !phone || !planName) {
    showToast('Fill all fields and select a plan', 'error');
    return;
  }

  const requestData = {
    biz: bizName,
    phone: phone,
    plan: planName,
    price: planPrice,
    msg: getInputValue('trMsg'),
  };

  db.submitTrendingRequest(requestData);

  // Show success
  closeModal('moTrend');
  showModal('moSuccess');

  const sucT = document.getElementById('sucT');
  const sucM = document.getElementById('sucM');

  if (sucT) sucT.textContent = 'Request Received! 🔥';
  if (sucM) {
    sucM.innerHTML = `Your trending request for <strong>"${bizName}"</strong> (${planName} — ${planPrice}) is sent. Feng World will contact you at <strong>${phone}</strong> shortly.`;
  }

  // Clear form
  document.getElementById('trBiz').value = '';
  document.getElementById('trPh').value = '';
  document.getElementById('trMsg').value = '';
  document.querySelectorAll('.pc').forEach((plan) => {
    plan.classList.remove('on');
  });
}

// ─────────── ADMIN PANEL ─────────── //
function handleAdminLogin() {
  const username = getInputValue('aUser');
  const password = getInputValue('aPass');

  if (username === 'admin' && password === 'fengworld123') {
    showPage('admin');
    showToast('Welcome, Feng World Admin!', 'success');
  } else {
    showToast('Invalid credentials', 'error');
  }
}

function switchAdminSection(sectionId, element) {
  // Hide all sections
  ['dash', 'biz', 'pend', 'trend', 'owners', 'sett'].forEach((id) => {
    const section = document.getElementById(`ad-${id}`);
    if (section) section.style.display = 'none';
  });

  // Show selected section
  const selectedSection = document.getElementById(`ad-${sectionId}`);
  if (selectedSection) selectedSection.style.display = 'block';

  // Update active nav item
  document.querySelectorAll('.ani').forEach((item) => {
    item.classList.remove('on');
  });
  if (element) element.classList.add('on');

  // Update dashboard
  updateAdminDashboard();
}

function updateAdminDashboard() {
  const stats = db.getAdminStats();

  // Update stats
  const stTotal = document.getElementById('stTotal');
  const stPend = document.getElementById('stPend');
  const stTrend = document.getElementById('stTrend');
  const stReq = document.getElementById('stReq');
  const stUsers = document.getElementById('stUsers');

  if (stTotal) stTotal.textContent = stats.totalBusinesses;
  if (stPend) stPend.textContent = stats.pendingCount;
  if (stTrend) stTrend.textContent = stats.trendingCount;
  if (stReq) stReq.textContent = stats.trendingRequestsCount;
  if (stUsers) stUsers.textContent = stats.usersCount;

  // Update recent activity
  updateRecentActivity(stats.recentActivity);

  // Update tables
  updateBusinessesTable();
  updatePendingTable();
  updateTrendingTable();
  updateOwnersTable();
}

function updateRecentActivity(activity) {
  const recentTable = document.getElementById('aRecent');
  if (!recentTable) return;

  if (activity.length === 0) {
    recentTable.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#333;padding:20px;">No recent activity</td></tr>';
    return;
  }

  recentTable.innerHTML = activity
    .map(
      (item) => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td><span class="bdg ${item.type === 'Trend Request' ? 'o' : 'gl'}">${item.type}</span></td>
      <td><span class="bdg gr">${item.status}</span></td>
      <td style="color:#444;font-size:11px;">${item.date}</td>
    </tr>
  `,
    )
    .join('');
}

function updateBusinessesTable() {
  const bizTable = document.getElementById('aBizTable');
  if (!bizTable) return;

  const businesses = db.getApprovedBusinesses();

  if (businesses.length === 0) {
    bizTable.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#333;padding:20px;">No businesses yet</td></tr>';
    return;
  }

  bizTable.innerHTML = businesses
    .map(
      (b) => `
    <tr>
      <td><strong>${b.emoji} ${b.name}</strong></td>
      <td style="font-size:12px;color:#666;">${b.cat}</td>
      <td style="font-size:12px;">${b.city}</td>
      <td style="font-size:12px;">${b.owner}</td>
      <td><span class="bdg ${b.verified ? 'g' : 'gr'}">${b.verified ? '✓ Verified' : 'Unverified'}</span></td>
      <td><span class="bdg ${b.trending ? 'o' : 'gr'}">${b.trending ? '🔥 Yes' : 'No'}</span></td>
      <td>
        <button class="ab ${b.trending ? 'rj' : 'tr'}" onclick="toggleBusinessTrending(${b.id})">${b.trending ? 'Remove' : 'Trend'}</button>
        <button class="ab ${b.verified ? 'rj' : 'ap'}" onclick="toggleBusinessVerification(${b.id})">${b.verified ? 'Unverify' : 'Verify'}</button>
        <button class="ab rj" onclick="deleteBusinessRecord(${b.id})">Delete</button>
      </td>
    </tr>
  `,
    )
    .join('');
}

function updatePendingTable() {
  const pendTable = document.getElementById('aPendTable');
  const noPend = document.getElementById('noPend');
  if (!pendTable) return;

  const pending = db.getPendingBusinesses();

  if (pending.length === 0) {
    pendTable.innerHTML = '';
    if (noPend) noPend.style.display = 'block';
    return;
  }

  if (noPend) noPend.style.display = 'none';

  pendTable.innerHTML = pending
    .map(
      (b) => `
    <tr>
      <td><strong>${b.name}</strong></td>
      <td>${b.owner}</td>
      <td>${b.nrc}</td>
      <td>${b.phone}</td>
      <td>${b.cat}</td>
      <td style="font-size:11px;color:#444;">${b.reg}</td>
      <td>
        <button class="ab ap" onclick="approvePendingBusiness(${b.id})">Approve</button>
        <button class="ab rj" onclick="rejectPendingBusiness(${b.id})">Reject</button>
      </td>
    </tr>
  `,
    )
    .join('');
}

function updateTrendingTable() {
  const trendTable = document.getElementById('aTrendTable');
  const noTrend = document.getElementById('noTrend');
  if (!trendTable) return;

  const requests = db.getTrendingRequests();

  if (requests.length === 0) {
    trendTable.innerHTML = '';
    if (noTrend) noTrend.style.display = 'block';
    return;
  }

  if (noTrend) noTrend.style.display = 'none';

  trendTable.innerHTML = requests
    .map(
      (r) => `
    <tr>
      <td><strong>${r.biz}</strong></td>
      <td>${r.phone}</td>
      <td><span class="bdg gl">${r.plan}</span></td>
      <td>${r.price}</td>
      <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;color:#444;">${r.msg || '—'}</td>
      <td>
        <a class="ab ap" href="https://wa.me/${r.phone.replace(/[^0-9]/g, '')}" target="_blank">📱 WhatsApp</a>
        <button class="ab rj" onclick="dismissTrendingRequest(${r.id})">Dismiss</button>
      </td>
    </tr>
  `,
    )
    .join('');
}

function updateOwnersTable() {
  const ownerTable = document.getElementById('aOwnerTable');
  if (!ownerTable) return;

  const allBusinesses = [...db.getApprovedBusinesses(), ...db.getPendingBusinesses()];

  if (allBusinesses.length === 0) {
    ownerTable.innerHTML = '';
    return;
  }

  ownerTable.innerHTML = allBusinesses
    .map(
      (b) => `
    <tr>
      <td>
        <strong>${b.owner}</strong>
        <div style="font-size:11px;color:#444;">${b.email || 'No email'}</div>
      </td>
      <td style="font-size:12px;">${b.nrc}</td>
      <td style="font-size:12px;color:#666;">${b.province}</td>
      <td>
        <strong style="font-size:12px;">${b.name}</strong>
        <div style="font-size:10px;color:#444;">${b.cat}</div>
      </td>
      <td>
        <div class="osoc">
          ${b.wa ? `<a class="wa" href="https://wa.me/${(b.wa || b.phone || '').replace(/[^0-9]/g, '')}" target="_blank">WhatsApp</a>` : ''}
          ${b.fb ? `<a class="fb" href="https://facebook.com/${b.fb}" target="_blank">Facebook</a>` : ''}
          ${b.ig ? `<a class="ig" href="https://instagram.com/${b.ig}" target="_blank">Instagram</a>` : ''}
          ${!b.wa && !b.fb && !b.ig ? `<span style="font-size:11px;color:#333;">None added</span>` : ''}
        </div>
      </td>
      <td style="font-size:12px;color:#666;">${b.city}, ${b.province.replace(' Province', '')}</td>
    </tr>
  `,
    )
    .join('');
}

function approvePendingBusiness(businessId) {
  db.approveBusiness(businessId);
  showToast('Business approved and live!', 'success');
  updateAdminDashboard();
}

function rejectPendingBusiness(businessId) {
  const business = db.getPendingBusinesses().find((b) => b.id === businessId);
  if (business) {
    db.rejectBusiness(businessId);
    showToast(`"${business.name}" rejected`, 'error');
    updateAdminDashboard();
  }
}

function toggleBusinessTrending(businessId) {
  const business = db.toggleTrending(businessId);
  if (business) {
    showToast(`"${business.name}" trending ${business.trending ? 'ON' : 'OFF'}`, 'success');
    updateAdminDashboard();
  }
}

function toggleBusinessVerification(businessId) {
  const business = db.toggleVerification(businessId);
  if (business) {
    showToast(`"${business.name}" ${business.verified ? 'verified' : 'unverified'}`, 'success');
    updateAdminDashboard();
  }
}

function deleteBusinessRecord(businessId) {
  if (confirm('Are you sure you want to delete this business?')) {
    const business = db.deleteBusiness(businessId);
    if (business) {
      showToast(`"${business.name}" deleted`, 'error');
      updateAdminDashboard();
    }
  }
}

function dismissTrendingRequest(requestId) {
  db.dismissTrendingRequest(requestId);
  showToast('Request dismissed', 'error');
  updateAdminDashboard();
}

function addDemoBusiness() {
  db.addDemoBusiness();
  showToast('Demo business added!', 'success');
  updateAdminDashboard();
}

// ─────────── UTILITY FUNCTIONS ─────────── //
function getInputValue(elementId) {
  const element = document.getElementById(elementId);
  return element ? (element.value || '').trim() : '';
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const tMsg = document.getElementById('tMsg');
  const tIcon = document.getElementById('tIcon');

  if (!toast || !tMsg || !tIcon) return;

  tMsg.textContent = message;
  tIcon.textContent = type === 'success' ? '✓' : '✗';
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

function getWhatsAppIcon() {
  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
}

// ─────────── INITIALIZATION ─────────── //
// Initialize on page load
window.addEventListener('load', () => {
  initializeApp();
});

// Handle modal close on background click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('mo')) {
    e.target.classList.remove('open');
  }
});

// Close success modal and return to home
function closeSuccessModal() {
  closeModal('moSuccess');
  showPage('home');
}
