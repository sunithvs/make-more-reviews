// Initialize the widget namespace
window.ReviewWidgetNS = window.ReviewWidgetNS || {};

(function(ns) {
  console.log('ReviewWidgetNS initialized');

  // Store the original queue
  const queue = ns.q || [];
  
  class ReviewWidget {
    constructor(config) {
      console.log('ReviewWidget constructor called with config:', config);
      
      if (window.ReviewWidgetNS.instance) {
        console.log('Returning existing instance');
        return window.ReviewWidgetNS.instance;
      }
      
      this.config = {
        portalId: config.portalId,
        primaryColor: config.primaryColor || '#007bff',
        delay: config.delay || 5000,
        endpoint: 'https://wiikcmynyrcdaazhlgfo.supabase.co/functions/v1/submit-review'
      };
      
      console.log('Created new instance with config:', this.config);
      window.ReviewWidgetNS.instance = this;
      this.init();
    }

    init() {
      console.log('Initializing widget...');
      this.injectStyles();
      this.createModal();
      console.log(`Setting timeout for ${this.config.delay}ms`);
      // Show modal after delay
      setTimeout(() => {
        console.log('Timeout triggered, showing modal...');
        this.showModal();
      }, this.config.delay);
    }

    injectStyles() {
      console.log('Injecting styles...');
      const styles = `
        .review-widget-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999999;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .review-widget-overlay.visible {
          opacity: 1;
        }

        .review-widget-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          position: relative;
          transform: translateY(-20px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .review-widget-overlay.visible .review-widget-modal {
          transform: translateY(0);
          opacity: 1;
        }

        .review-widget-close {
          position: absolute;
          right: 15px;
          top: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
          color: #666;
        }

        .review-widget-close:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .review-widget-stars {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 25px 0;
          font-size: 32px;
        }

        .review-widget-star {
          cursor: pointer;
          color: #ddd;
          transition: color 0.3s ease, transform 0.2s ease;
          user-select: none;
        }

        .review-widget-star:hover {
          transform: scale(1.2);
          color: ${this.config.primaryColor};
        }
        
        .review-widget-star.active {
          color: ${this.config.primaryColor};
          transform: scale(1.1);
        }

        .review-widget-textarea {
          width: 100%;
          height: 120px;
          margin: 20px 0;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          resize: vertical;
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .review-widget-textarea:focus {
          outline: none;
          border-color: ${this.config.primaryColor};
        }

        .review-widget-submit {
          width: 100%;
          padding: 12px;
          background: ${this.config.primaryColor};
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: opacity 0.2s, transform 0.2s;
        }

        .review-widget-submit:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .review-widget-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .review-widget-message {
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
          min-height: 20px;
        }

        .review-widget-error {
          color: #dc3545;
        }

        .review-widget-success {
          color: #28a745;
          font-weight: 500;
        }

        .review-widget-thank-you {
          text-align: center;
        }

        .review-widget-thank-you h2 {
          color: ${this.config.primaryColor};
          margin-bottom: 15px;
        }

        .review-widget-thank-you p {
          color: #666;
          margin-bottom: 20px;
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      console.log('Styles injected successfully');
    }

    createModal() {
      console.log('Creating modal...');
      // Remove existing modal if any
      const existingModal = document.querySelector('.review-widget-overlay');
      if (existingModal) {
        existingModal.remove();
      }

      const modal = document.createElement('div');
      modal.className = 'review-widget-overlay';
      modal.innerHTML = `
        <div class="review-widget-modal">
          <button class="review-widget-close">&times;</button>
          <div class="review-widget-content">
            <h2 style="text-align: center; margin: 0 0 20px; color: #333;">Leave a Review</h2>
            <div class="review-widget-stars">
              ${Array(5).fill(0).map((_, i) => `
                <span class="review-widget-star" data-rating="${i + 1}">★</span>
              `).join('')}
            </div>
            <textarea class="review-widget-textarea" placeholder="Tell us about your experience... (optional)"></textarea>
            <button class="review-widget-submit" disabled>Submit Review</button>
            <div class="review-widget-message"></div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      console.log('Modal created and added to DOM');
      this.bindEvents(modal);
    }

    showThankYou(modal) {
      const content = modal.querySelector('.review-widget-content');
      content.innerHTML = `
        <div class="review-widget-thank-you">
          <h2>Thank You!</h2>
          <p>We appreciate your feedback. Your review helps us improve!</p>
          <button class="review-widget-close-btn review-widget-submit" style="max-width: 200px; margin: 0 auto;">Close Window</button>
        </div>
      `;

      const closeBtn = content.querySelector('.review-widget-close-btn');
      closeBtn.addEventListener('click', () => this.hideModal());
    }

    showModal() {
      console.log('Showing modal...');
      let modal = document.querySelector('.review-widget-overlay');
      if (!modal) {
        console.log('No modal found, creating new one...');
        this.createModal();
        modal = document.querySelector('.review-widget-overlay');
      }
      modal.style.display = 'flex';
      // Force reflow
      modal.offsetHeight;
      modal.classList.add('visible');
      console.log('Modal displayed and made visible');
    }

    hideModal() {
      console.log('Hiding modal...');
      const modal = document.querySelector('.review-widget-overlay');
      if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    }

    bindEvents(modal) {
      console.log('Binding events...');
      let selectedRating = 0;
      const stars = modal.querySelectorAll('.review-widget-star');
      const submit = modal.querySelector('.review-widget-submit');
      const close = modal.querySelector('.review-widget-close');
      const textarea = modal.querySelector('.review-widget-textarea');

      stars.forEach((star, index) => {
        star.addEventListener('click', () => {
          selectedRating = index + 1;
          this.updateStars(stars, selectedRating);
          submit.disabled = false;
        });

        star.addEventListener('mouseenter', () => {
          this.updateStars(stars, index + 1);
        });

        star.addEventListener('mouseleave', () => {
          this.updateStars(stars, selectedRating);
        });
      });

      submit.addEventListener('click', async () => {
        console.log('Submit button clicked...');
        submit.disabled = true;
        const success = await this.submitReview(selectedRating, textarea.value);
        if (success) {
          this.showThankYou(modal);
        } else {
          submit.disabled = false;
        }
      });

      close.addEventListener('click', () => {
        console.log('Close button clicked...');
        this.hideModal();
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          console.log('Modal background clicked...');
          this.hideModal();
        }
      });
    }

    updateStars(stars, rating) {
      console.log(`Updating stars to rating ${rating}...`);
      stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
      });
    }

    async submitReview(rating, reviewText) {
      console.log('Submitting review...');
      const message = document.querySelector('.review-widget-message');
      
      try {
        const metadata = this._collectMetadata();
        const response = await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating,
            review_text: reviewText,
            portal_id: this.config.portalId,
            metadata
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to submit review');
        }

        return true;

      } catch (error) {
        console.error('Error submitting review:', error);
        message.className = 'review-widget-error';
        message.textContent = error.message === 'Failed to fetch' 
          ? 'Network error. Please check your internet connection and try again.'
          : error.message || 'Failed to submit review. Please try again.';
        return false;
      }
    }

    _collectMetadata() {
      console.log('Collecting metadata...');
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_term: urlParams.get('utm_term'),
        utm_content: urlParams.get('utm_content')
      };

      return {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        browser: this._getBrowserInfo(),
        timestamp: new Date().toISOString(),
        utmParams
      };
    }

    _getBrowserInfo() {
      console.log('Getting browser info...');
      const userAgent = navigator.userAgent;
      const browsers = {
        chrome: /Chrome/,
        safari: /Safari/,
        firefox: /Firefox/,
        ie: /MSIE|Trident/,
        edge: /Edge/,
        opera: /Opera|OPR/
      };

      for (const [browser, regex] of Object.entries(browsers)) {
        if (regex.test(userAgent)) {
          return browser;
        }
      }

      return 'unknown';
    }
  }

  // Create the init function on the namespace
  window.ReviewWidgetNS.init = function(config) {
    console.log('ReviewWidgetNS.init called with config:', config);
    if (!window.ReviewWidgetNS.instance) {
      window.ReviewWidgetNS.instance = new ReviewWidget(config);
    }
    return window.ReviewWidgetNS.instance;
  };

  // Process any commands that were queued before the script loaded
  console.log('Processing queued commands:', queue);
  queue.forEach(args => {
    const command = args[0];
    const config = args[1];
    if (command === 'init') {
      window.ReviewWidgetNS.init(config);
    }
  });

  console.log('ReviewWidgetNS setup complete');
})(window.ReviewWidgetNS);
