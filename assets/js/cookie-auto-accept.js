(function () {
    'use strict';

    function markCookieNotificationSeen() {
        try {
            localStorage.setItem('cookieNotificationHasBeenSeen', 'true');
        } catch (error) {
            // Ignore storage access errors.
        }
    }

    function submitAcceptAllIfAvailable() {
        var consent = window.CookieConsent || window.Cookiebot;
        if (!consent) return false;

        try {
            if (typeof consent.submitCustomConsent === 'function') {
                consent.submitCustomConsent(true, true, true, true);
                return true;
            }
            if (typeof consent.submitImpliedConsent === 'function') {
                consent.submitImpliedConsent(true);
                return true;
            }
            if (typeof consent.acceptAll === 'function') {
                consent.acceptAll();
                return true;
            }
        } catch (error) {
            // Ignore runtime errors and keep retrying.
        }

        return false;
    }

    function clickAcceptAllButton() {
        var selectors = [
            '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
            '#CybotCookiebotDialogBodyButtonAccept',
            '[data-cookieconsent-accept-all]',
            '.cookiebot-accept-all',
            'button[aria-label*="Accetta"]',
            'button[title*="Accetta"]'
        ];

        for (var i = 0; i < selectors.length; i++) {
            var button = document.querySelector(selectors[i]);
            if (button) {
                button.click();
                return true;
            }
        }

        return false;
    }

    function enforceAcceptAll() {
        markCookieNotificationSeen();
        return submitAcceptAllIfAvailable() || clickAcceptAllButton();
    }

    enforceAcceptAll();

    var attempts = 0;
    var timer = setInterval(function () {
        attempts += 1;
        if (enforceAcceptAll() || attempts >= 20) {
            clearInterval(timer);
        }
    }, 500);

    window.addEventListener('CookiebotOnConsentReady', enforceAcceptAll);
    window.addEventListener('CookieConsentOnConsentReady', enforceAcceptAll);
})();
