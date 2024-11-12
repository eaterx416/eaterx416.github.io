let currentImageIndex = 0;
let currentGalleryIndex = 0;
const galleries = Array.from(document.querySelectorAll('.gallery'));
let currentModal = null;

// 開啟圖片彈出視窗
function openModal(src, galleryName) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    modal.innerHTML = `
        <img src="${src}" alt="Image">
        <div class="operation-hint hint-top">${galleryName}</div>
        <div class="operation-hint hint-bottom">鍵盤 ← → 切換圖片，ESC 回目錄，↑ ↓ 切換女優</div>
    `;
    document.body.appendChild(modal);
    currentModal = modal;

    // 設置事件監聽器
    modal.addEventListener('click', closeModal);
    modal.addEventListener('auxclick', (e) => { if (e.button === 2) closeModal(); });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('wheel', handleWheel);
}

// 關閉圖片彈出視窗
function closeModal() {
    currentModal.remove();
    currentModal = null;
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('wheel', handleWheel);
}

// 處理鍵盤事件
function handleKeydown(e) {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowDown') nextGallery();
    if (e.key === 'ArrowUp') prevGallery();
    if (e.key === 'Escape') closeModal();
}

// 處理滾輪事件
function handleWheel(e) {
    if (e.deltaY < 0) prevImage();
    if (e.deltaY > 0) nextImage();
}

// 下一張圖片
function nextImage() {
    const galleryImages = galleries[currentGalleryIndex].querySelectorAll('img');
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalImage(galleryImages[currentImageIndex].src);
}

// 上一張圖片
function prevImage() {
    const galleryImages = galleries[currentGalleryIndex].querySelectorAll('img');
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage(galleryImages[currentImageIndex].src);
}

// 下一子目錄
function nextGallery() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleries.length;
    currentImageIndex = 0;
    updateGalleryName();
    updateModalImage(galleries[currentGalleryIndex].querySelector('img').src);
}

// 上一子目錄
function prevGallery() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleries.length) % galleries.length;
    currentImageIndex = 0;
    updateGalleryName();
    updateModalImage(galleries[currentGalleryIndex].querySelector('img').src);
}

// 更新彈窗中的圖片
function updateModalImage(src) {
    currentModal.querySelector('img').src = src;
}

// 更新彈窗中的目錄名稱
function updateGalleryName() {
    const galleryName = galleries[currentGalleryIndex].previousElementSibling.textContent;
    currentModal.querySelector('.hint-top').textContent = galleryName;
}

// 點擊側邊欄時滾動到對應目錄並顯示第一張圖片
document.querySelectorAll('.gallery-link').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const galleryName = e.target.textContent;
        const gallery = document.getElementById(galleryName);
        gallery.scrollIntoView({ behavior: 'smooth' });
        const firstImage = gallery.querySelector('img');
        if (firstImage) openModal(firstImage.src, galleryName);
    });
});
