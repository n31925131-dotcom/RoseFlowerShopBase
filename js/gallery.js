class GalleryManager {
  constructor() {
    this.currentFilter = 'all';
    this.currentLanguage = localStorage.getItem('language') || 'el';
    this.galleryData = [];

    this.grid = document.getElementById('gallery-grid');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxDesc = document.getElementById('lightbox-desc');
  }

  async init() {
    this.setupEventListeners();
    await this.loadGallery();
  }

  async loadGallery() {
    this.showLoading();

    try {
      const response = await fetch('images/gallery/images.json');
      const data = await response.json();
      
      // Transform the structured categories JSON into a flat array for the existing filter logic
      // Categories: [{name: "Weddings", images: ["img1.jpg", "img2.jpg"]}, ...]
      this.galleryData = [];
      data.categories.forEach(cat => {
        cat.images.forEach(imgName => {
          this.galleryData.push({
            url: `images/gallery/${cat.name}/${imgName}`,
            title: imgName.split('.')[0].replace(/-/g, ' '),
            category: cat.name.toLowerCase()
          });
        });
      });
      
      this.renderGallery();
    } catch (error) {
      console.error('Error loading gallery:', error);
      this.grid.innerHTML = '<p class="text-center py-20">Error loading images. Please ensure the gallery manifest exists.</p>';
    }
  }

  showLoading() {
    if (!this.grid) return;
    this.grid.innerHTML = `
      <div class="col-span-full text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Φόρτωση γκαλερί...</p>
      </div>
    `;
  }

  renderGallery() {
    if (!this.grid) return;

    const filtered = this.currentFilter === 'all' 
      ? this.galleryData 
      : this.galleryData.filter(img => img.category === this.currentFilter);

    if (filtered.length === 0) {
      this.grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-600"><p>Δεν βρέθηκαν φωτογραφίες</p></div>';
      return;
    }

    this.grid.innerHTML = '';
    filtered.forEach((image, index) => {
      const item = this.createGalleryItem(image, index);
      this.grid.appendChild(item);
    });

    this.attachLightboxHandlers();
  }

  createGalleryItem(image, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item group cursor-pointer';
    div.dataset.category = image.category;
    div.dataset.index = index;

    div.innerHTML = `
      <div class="relative h-80 rounded-xl overflow-hidden shadow-md">
        <img src="${image.url}" alt="${image.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <h3 class="text-white font-medium">${image.title}</h3>
        </div>
      </div>
    `;

    return div;
  }

  attachLightboxHandlers() {
    const items = this.grid.querySelectorAll('.gallery-item');
    items.forEach((item, idx) => {
      item.addEventListener('click', () => this.showLightbox(idx));
    });
  }

  showLightbox(index) {
    const filtered = this.currentFilter === 'all' 
      ? this.galleryData 
      : this.galleryData.filter(img => img.category === this.currentFilter);
    const image = filtered[index];
    if (!image) return;

    this.lightboxImg.src = image.url;
    this.lightboxTitle.textContent = image.title;
    this.lightboxDesc.textContent = image.category;

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  setupEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('bg-rose-600', 'text-white');
          b.classList.add('bg-gray-100', 'text-gray-700');
        });
        btn.classList.remove('bg-gray-100', 'text-gray-700');
        btn.classList.add('bg-rose-600', 'text-white');
        this.currentFilter = btn.getAttribute('data-filter');
        this.renderGallery();
      });
    });

    const closeLightbox = document.querySelector('.close-lightbox');
    if (closeLightbox) closeLightbox.addEventListener('click', () => this.closeLightbox());

    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox?.classList.contains('active')) this.closeLightbox();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gallery-grid')) {
    new GalleryManager().init();
  }
});