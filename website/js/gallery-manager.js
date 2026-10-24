/**
 * Party Hard People LLC — Executive Gallery & Media Studio Engine
 * Crafted for seamless live synchronization between the Owner Portal and Public Showcase.
 */

const GALLERY_STORAGE_KEY = 'php_gallery_items';

// Default curated showcase items crafted with senior artistic direction
const DEFAULT_GALLERY_ITEMS = [
  {
    id: 'gal-def-1',
    title: "Maya's 6th Birthday Bash",
    category: 'dj-dance',
    categoryName: 'Kids DJ & Dance',
    city: 'Pasadena, CA',
    venueType: 'Private Residence Lawn',
    equipment: ['Kids DJ & Music Host', 'Dynamic LED Stage Lighting', 'Interactive Dance Games'],
    description: 'High-energy musical statues, bubble blast dance-offs, and custom kid-friendly playlist with host Leo.',
    imageUrl: 'assets/images/hero-celebration.jpg',
    featured: true,
    verifiedRelease: true,
    dateAdded: '2026-10-15',
    isCustom: false
  },
  {
    id: 'gal-def-2',
    title: 'Outdoor Castle Play Festival',
    category: 'inflatables',
    categoryName: 'Bounce Castles & Rentals',
    city: 'Irvine, CA',
    venueType: 'Backyard Celebration',
    equipment: ['Pastel Castle Bounce House', '6ft Folding Tables', 'White Resin Chairs'],
    description: 'Aesthetic all-white and pastel bounce setup with safety matting and sanitized commercial vinyl.',
    imageUrl: 'assets/images/bounce-rentals.jpg',
    featured: true,
    verifiedRelease: true,
    dateAdded: '2026-10-18',
    isCustom: false
  },
  {
    id: 'gal-def-3',
    title: 'Pre-Teen Karaoke Jam & Glow Party',
    category: 'karaoke',
    categoryName: 'Karaoke Jam & Audio',
    city: 'Carlsbad, CA',
    venueType: 'Community Center Hall',
    equipment: ['Karaoke Jam Station', 'Pro PA Sound System & Mic', 'Stage Laser Lighting'],
    description: 'Twin wireless microphones, live lyric display monitor, and full vocal stage lighting experience.',
    imageUrl: 'assets/images/sound-lighting.jpg',
    featured: true,
    verifiedRelease: true,
    dateAdded: '2026-10-20',
    isCustom: false
  }
];

class GalleryManager {
  static getItems() {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (!stored) {
        return [...DEFAULT_GALLERY_ITEMS];
      }
      const customList = JSON.parse(stored);
      // Ensure custom items appear first (newest on top), followed by defaults unless hidden
      return [...customList, ...DEFAULT_GALLERY_ITEMS.filter(def => !customList.some(c => c.id === def.id))];
    } catch (e) {
      console.warn('Error reading gallery items from storage, falling back to defaults:', e);
      return [...DEFAULT_GALLERY_ITEMS];
    }
  }

  static getCustomItems() {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  static addItem(item) {
    const customItems = this.getCustomItems();
    const newItem = {
      id: 'gal-custom-' + Date.now(),
      title: item.title.trim(),
      category: item.category || 'dj-dance',
      categoryName: this.getCategoryLabel(item.category),
      city: item.city.trim() || 'Southern California',
      venueType: item.venueType || 'Private Residence',
      equipment: Array.isArray(item.equipment) ? item.equipment : (item.equipment ? item.equipment.split(',').map(s => s.trim()).filter(Boolean) : ['Custom Package']),
      description: item.description.trim() || 'Coordinated celebration by Party Hard People LLC.',
      imageUrl: item.imageUrl,
      featured: Boolean(item.featured),
      verifiedRelease: Boolean(item.verifiedRelease),
      dateAdded: new Date().toISOString().split('T')[0],
      isCustom: true
    };

    customItems.unshift(newItem);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(customItems));
    window.dispatchEvent(new CustomEvent('php_gallery_updated', { detail: newItem }));
    return newItem;
  }

  static deleteItem(id) {
    let customItems = this.getCustomItems();
    customItems = customItems.filter(item => item.id !== id);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(customItems));
    window.dispatchEvent(new CustomEvent('php_gallery_updated', { detail: { deletedId: id } }));
    return true;
  }

  static toggleFeatured(id) {
    const customItems = this.getCustomItems();
    const target = customItems.find(i => i.id === id);
    if (target) {
      target.featured = !target.featured;
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(customItems));
      window.dispatchEvent(new CustomEvent('php_gallery_updated', { detail: target }));
      return target.featured;
    }
    return false;
  }

  static getCategoryLabel(slug) {
    const map = {
      'dj-dance': 'Kids DJ & Dance',
      'inflatables': 'Bounce Castles & Rentals',
      'karaoke': 'Karaoke Jam & Audio',
      'games': 'Organized Party Games',
      'combo': 'Full Party Experience'
    };
    return map[slug] || 'Celebration Event';
  }

  /**
   * Executive-grade client-side image compression.
   * Resizes camera/phone photos to max 1200px and converts to optimized WebP or JPEG.
   * Keeps localStorage fast, avoids quota overflows, and guarantees lightning load times.
   */
  static compressImage(file, maxWidth = 1200, maxHeight = 900, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Selected file is not an image'));
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to load image element'));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Attempt modern WebP export, falling back to JPEG if unsupported
          let dataUrl = '';
          try {
            dataUrl = canvas.toDataURL('image/webp', quality);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          } catch (err) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
}

// Global exposure
window.GalleryManager = GalleryManager;
