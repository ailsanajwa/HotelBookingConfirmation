/**
 * Maison Soleil - Hotel Booking Confirmation
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const printReceiptBtn = document.getElementById('printReceiptBtn');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  const copyPasswordBtn = document.getElementById('copyPasswordBtn');
  const wifiPasswordEl = document.getElementById('wifiPassword');
  const cardsSection = document.getElementById('cardsSection');
  const navLinks = document.querySelectorAll('.nav-link');

  /* -------------------------------------------------------------------------- */
  /* Mobile Menu Drawer                                                         */
  /* -------------------------------------------------------------------------- */
  function openDrawer() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('active');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeDrawer);
  }

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* -------------------------------------------------------------------------- */
  /* Tab Navigation System                                                      */
  /* -------------------------------------------------------------------------- */
  const tabViews = document.querySelectorAll('.tab-view');

  function switchTab(targetViewId) {
    const targetSection = document.getElementById(targetViewId);
    if (!targetSection) return;

    // Update active state on navigation links
    navLinks.forEach((link) => {
      const isTarget = link.getAttribute('data-view') === targetViewId;
      link.classList.toggle('active', isTarget);
      if (isTarget) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Hide all tab views and show the selected one
    tabViews.forEach((view) => {
      view.classList.remove('active');
      view.hidden = true;
      view.setAttribute('hidden', '');
    });

    targetSection.hidden = false;
    targetSection.removeAttribute('hidden');
    // Force reflow for CSS entrance animation
    void targetSection.offsetWidth;
    targetSection.classList.add('active');

    // Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile drawer if currently open
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  }

  // Bind clicks on all sidebar nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      if (targetView) {
        switchTab(targetView);
        if (history.replaceState) {
          history.replaceState(null, '', link.getAttribute('href'));
        }
      }
    });
  });

  // Bind clicks on in-page shortcuts (e.g., "Contact host" button in The House tab)
  document.querySelectorAll('.nav-shortcut').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = btn.getAttribute('data-view');
      if (targetView) {
        switchTab(targetView);
      }
    });
  });

  // Check URL hash on initial page load
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    const matchedLink = document.querySelector(`.nav-link[href="#${hash}"]`);
    if (matchedLink) {
      const targetView = matchedLink.getAttribute('data-view');
      if (targetView) switchTab(targetView);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Print Receipt                                                              */
  /* -------------------------------------------------------------------------- */
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Add to Calendar (.ics Download)                                            */
  /* -------------------------------------------------------------------------- */
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      // Generate iCalendar format string
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Maison Soleil//Hotel Booking Confirmation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:booking-ms2026-0421ah@maisonsoleil.com',
        'DTSTAMP:20260401T120000Z',
        'DTSTART:20260425T150000',
        'DTEND:20260429T110000',
        'SUMMARY:Maison Soleil Stay - Room La Garrigue',
        'DESCRIPTION:Booking Confirmation № MS-2026 0421-AH\\nHost: Margaux\\nRoom: La Garrigue (4 nights)\\nTotal Paid: €730.40\\nWi-Fi: Le Soleil · Guest (Password: soleil-2026)',
        'LOCATION:12 Rue des Oliviers\\, Cassis\\, France',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute('download', 'maison-soleil-booking.ics');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Copy Wi-Fi Password                                                        */
  /* -------------------------------------------------------------------------- */
  if (copyPasswordBtn && wifiPasswordEl) {
    copyPasswordBtn.addEventListener('click', async () => {
      const password = wifiPasswordEl.textContent.trim();

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(password);
        } else {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = password;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Visual feedback
        const originalText = copyPasswordBtn.textContent;
        copyPasswordBtn.textContent = 'COPIED!';
        copyPasswordBtn.classList.add('copied');

        setTimeout(() => {
          copyPasswordBtn.textContent = originalText;
          copyPasswordBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Interactive Card Motions & 3D Tilt                                         */
  /* -------------------------------------------------------------------------- */
  const cardsStage = document.getElementById('cardsStage');
  const receiptCard = document.getElementById('receiptCard');
  const welcomeCard = document.getElementById('welcomeCard');

  // Interactive 3D Parallax tilt on mouse movement (Desktop)
  if (cardsStage) {
    let rafId = null;

    cardsStage.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = cardsStage.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        const tiltX = (mouseY / (rect.height / 2)) * -5;
        const tiltY = (mouseX / (rect.width / 2)) * 6;

        cardsStage.style.transform = `perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      });
    });

    cardsStage.addEventListener('mouseleave', () => {
      if (window.innerWidth < 1024) return;
      cardsStage.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
      cardsStage.style.transition = 'transform 0.4s ease';
      setTimeout(() => {
        cardsStage.style.transition = '';
      }, 400);
    });
  }

  // Click on cards to focus & bring to front
  if (receiptCard && welcomeCard) {
    receiptCard.addEventListener('click', (e) => {
      e.stopPropagation();
      receiptCard.classList.toggle('is-focused');
      welcomeCard.classList.remove('is-focused');
    });

    welcomeCard.addEventListener('click', (e) => {
      e.stopPropagation();
      welcomeCard.classList.toggle('is-focused');
      receiptCard.classList.remove('is-focused');
    });

    // Click outside cards clears focus
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.card')) {
        receiptCard.classList.remove('is-focused');
        welcomeCard.classList.remove('is-focused');
      }
    });
  }

  // Click anywhere on cards section to toggle fan
  if (cardsSection) {
    cardsSection.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('a') && !e.target.closest('.card')) {
        cardsSection.classList.toggle('fanned');
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Messages Interactive Chat                                                  */
  /* -------------------------------------------------------------------------- */
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatThread = document.getElementById('chatThread');

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (chatForm && chatInput && chatThread) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = chatInput.value.trim();
      if (!messageText) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create Lucia's message bubble
      const guestRow = document.createElement('div');
      guestRow.className = 'chat-bubble-row guest-row';
      guestRow.innerHTML = `
        <div class="bubble-avatar">L</div>
        <div class="bubble-content">
          <div class="bubble-sender">Lucia · Guest</div>
          <div class="bubble-text">${escapeHtml(messageText)}</div>
          <span class="bubble-time">${timeStr}</span>
        </div>
      `;

      chatThread.appendChild(guestRow);
      chatInput.value = '';
      chatThread.scrollTop = chatThread.scrollHeight;

      // Automated warm host reply from Margaux
      setTimeout(() => {
        const hostRow = document.createElement('div');
        hostRow.className = 'chat-bubble-row host-row';
        hostRow.innerHTML = `
          <div class="bubble-avatar">M</div>
          <div class="bubble-content">
            <div class="bubble-sender">Margaux · Host</div>
            <div class="bubble-text">
              Merci, Lucia! I have noted that down. We are preparing everything for your arrival at room La Garrigue. Let me know if you need anything else!
            </div>
            <span class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        `;
        chatThread.appendChild(hostRow);
        chatThread.scrollTop = chatThread.scrollHeight;
      }, 1200);
    });
  }
});
