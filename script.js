document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const productGrid = document.getElementById('product-grid');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const cartCount = document.getElementById('cart-count');
   
    // Elemen Modal
    const modal = document.getElementById('productModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalImage = document.getElementById('modal-image');
    const modalCategory = document.getElementById('modal-category');
    const modalProductName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
    const toastContainer = document.getElementById('toast-container');
    


    // --- State ---
    let products = [];
    let cart = [];
    let categories = [];
    let filteredProducts = [];
    const API_URL = 'https://fakestoreapi.com/products';

    // --- Functions ---


    /**
     * Mengambil produk dari Fake Store API
     */
    async function fetchProducts() {
        loader.style.display = 'block';
        productGrid.innerHTML = '';
        errorMessage.classList.add('hidden');
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Gagal mengambil produk:", error);
            errorMessage.classList.remove('hidden');
        } finally {
            loader.style.display = 'none';
        }
    }


    /**
     * Menampilkan produk di dalam grid
     * @param {Array} productsToDisplay - Array objek produk
     */
    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = ''; // Bersihkan produk sebelumnya
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card bg-white rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer';
            productCard.dataset.productId = product.id;


            productCard.innerHTML = `
                <div class="p-4 bg-white h-48 flex items-center justify-center">
                    <img src="${product.image}" alt="${product.title}" class="max-h-full max-w-full object-contain">
                </div>
                <div class="p-4 border-t border-gray-200 flex flex-col flex-grow">
                    <span class="text-xs text-gray-500 capitalize">${product.category}</span>
                    <h3 class="text-md font-semibold text-gray-800 mt-1 flex-grow">${product.title.substring(0, 40)}...</h3>
                    <div class="mt-4 flex justify-between items-center">
                        <p class="text-lg font-bold text-blue-600">Rp ${Math.round(product.price * 15000).toLocaleString('id-ID')}</p>
                        <button class="add-to-cart-btn bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full w-9 h-9 flex items-center justify-center transition-colors" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
   
    /**
     * Menampilkan modal detail produk
     * @param {number} productId - ID produk yang akan ditampilkan
     */
    function showProductDetail(productId) {
        const product = products.find(p => p.id == productId);
        if (!product) return;


        modalImage.src = product.image;
        modalCategory.textContent = product.category;
        modalProductName.textContent = product.title;
        modalPrice.textContent = `Rp ${Math.round(product.price * 15000).toLocaleString('id-ID')}`;
        modalDescription.textContent = product.description;
        modalAddToCartBtn.dataset.productId = product.id; // Atur ID produk pada tombol
       
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Mencegah scroll di latar belakang
    }


    /**
     * Menyembunyikan modal detail produk
     */
    function hideModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }


    /**
     * Menambahkan produk ke keranjang dan memperbarui UI
     * @param {number} productId - ID produk yang akan ditambahkan
     */
    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            cart.push(product);
            updateCartCounter();
            showToast(`${product.title.substring(0, 20)}... ditambahkan ke keranjang!`);
        }
    }


    /**
     * Memperbarui tampilan counter keranjang
     */
    function updateCartCounter() {
        cartCount.textContent = cart.length;
    }
   
    /**
     * Menampilkan notifikasi toast
     * @param {string} message - Pesan yang akan ditampilkan
     */
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg';
        toast.textContent = message;
        toastContainer.appendChild(toast);


        setTimeout(() => {
            toast.remove();
        }, 3000); // Hapus toast setelah 3 detik
    }


    // --- Event Listeners ---


    // Menangani klik pada grid produk (untuk melihat detail atau menambah ke keranjang)
    productGrid.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const productId = addToCartBtn.dataset.productId;
            addToCart(productId);
            return; // Hentikan proses lebih lanjut
        }


        const card = e.target.closest('.product-card');
        if (card) {
            const productId = card.dataset.productId;
            showProductDetail(productId);
        }
    });
   
    // Menambah ke keranjang dari modal
    modalAddToCartBtn.addEventListener('click', () => {
         const productId = modalAddToCartBtn.dataset.productId;
         addToCart(productId);
         hideModal();
    });


    // Event untuk menutup modal
    closeModalBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });


    // --- Pemuatan Awal ---
    fetchProducts();
        // Elemen Modal WhatsApp
    const whatsappModal = document.getElementById('whatsappModal');
    const closeWhatsappModalBtn = document.getElementById('closeWhatsappModalBtn');
    const whatsappCartSummaryBtn = document.getElementById('whatsapp-cart-summary');
    const whatsappSingleProductBtn = document.getElementById('whatsapp-single-product');
    const whatsappNumberInput = document.getElementById('whatsapp-number');

    // State untuk produk yang dipilih
    let selectedProductForWhatsapp = null;

        /**
     * Menampilkan modal WhatsApp
     * @param {object} product - Produk yang akan dibagikan (opsional)
     */
    function showWhatsappModal(product = null) {
        selectedProductForWhatsapp = product;
        
        // Sembunyikan tombol bagikan produk tunggal jika tidak ada produk yang dipilih
        if (product) {
            whatsappSingleProductBtn.style.display = 'flex';
            whatsappSingleProductBtn.querySelector('span').textContent = `Bagikan "${product.title.substring(0, 20)}..."`;
        } else {
            whatsappSingleProductBtn.style.display = 'none';
        }
        
        whatsappModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Menyembunyikan modal WhatsApp
     */
    function hideWhatsappModal() {
        whatsappModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        selectedProductForWhatsapp = null;
    }

    /**
     * Membuat pesan WhatsApp untuk ringkasan keranjang
     */
    function createCartSummaryMessage() {
        if (cart.length === 0) {
            return "Halo! Keranjang belanja saya masih kosong.";
        }

        let message = `Halo! Saya tertarik dengan produk-produk berikut:\n\n`;
        
        cart.forEach((product, index) => {
            const price = Math.round(product.price * 15000).toLocaleString('id-ID');
            message += `${index + 1}. ${product.title.substring(0, 30)}...\n`;
            message += `   💰 Rp ${price}\n`;
            message += `   📦 ${product.category}\n\n`;
        });

        const total = cart.reduce((sum, product) => sum + (product.price * 15000), 0);
        message += `📊 Total: ${cart.length} item\n`;
        message += `💰 Total Harga: Rp ${Math.round(total).toLocaleString('id-ID')}\n\n`;
        message += `Mohon info ketersediaan dan proses selanjutnya. Terima kasih!`;

        return message;
    }

    /**
     * Membuat pesan WhatsApp untuk produk tunggal
     */
    function createSingleProductMessage(product) {
        const price = Math.round(product.price * 15000).toLocaleString('id-ID');
        
        let message = `Halo! Saya tertarik dengan produk berikut:\n\n`;
        message += `🏷️ ${product.title}\n`;
        message += `💰 Harga: Rp ${price}\n`;
        message += `📦 Kategori: ${product.category}\n`;
        message += `📝 Deskripsi: ${product.description.substring(0, 100)}...\n\n`;
        message += `Apakah produk ini masih tersedia? Terima kasih!`;

        return message;
    }

    /**
     * Mengirim pesan via WhatsApp
     * @param {string} message - Pesan yang akan dikirim
     */
    function sendWhatsAppMessage(message) {
        const phoneNumber = whatsappNumberInput.value.trim();
        
        if (!phoneNumber) {
            showToast('Masukkan nomor WhatsApp terlebih dahulu!', 'error');
            return;
        }

        // Encode pesan untuk URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Buka WhatsApp di tab baru
        window.open(whatsappUrl, '_blank');
        hideWhatsappModal();
        showToast('Membuka WhatsApp...');
    }

        // Event untuk tombol keranjang (untuk WhatsApp)
    document.querySelector('.relative').addEventListener('click', (e) => {
        if (cart.length > 0) {
            showWhatsappModal();
        } else {
            showToast('Keranjang masih kosong!', 'error');
        }
    });

    // Event untuk modal WhatsApp
    closeWhatsappModalBtn.addEventListener('click', hideWhatsappModal);
    whatsappModal.addEventListener('click', (e) => {
        if (e.target === whatsappModal) {
            hideWhatsappModal();
        }
    });

    // Event untuk tombol WhatsApp
    whatsappCartSummaryBtn.addEventListener('click', () => {
        const message = createCartSummaryMessage();
        sendWhatsAppMessage(message);
    });

    whatsappSingleProductBtn.addEventListener('click', () => {
        if (selectedProductForWhatsapp) {
            const message = createSingleProductMessage(selectedProductForWhatsapp);
            sendWhatsAppMessage(message);
        }
    });

    // Tambahkan event listener untuk tombol WhatsApp di modal produk
    modalAddToCartBtn.addEventListener('click', () => {
        const productId = modalAddToCartBtn.dataset.productId;
        addToCart(productId);
        
        // Tampilkan opsi WhatsApp setelah menambah ke keranjang
        const product = products.find(p => p.id == productId);
        if (product) {
            setTimeout(() => {
                showWhatsappModal(product);
            }, 500);
        }
        
        hideModal();
    });

        /**
     * Menampilkan notifikasi toast
     * @param {string} message - Pesan yang akan ditampilkan
     * @param {string} type - Tipe notifikasi (success, error, info)
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        
        // Tentukan warna berdasarkan tipe
        let bgColor = 'bg-gray-800'; // default
        if (type === 'error') bgColor = 'bg-red-600';
        if (type === 'success') bgColor = 'bg-green-600';
        if (type === 'info') bgColor = 'bg-blue-600';
        
        toast.className = `toast-notification ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg mb-2`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
        // Elemen Modal Keranjang
    const cartModal = document.getElementById('cartModal');
    const closeCartModalBtn = document.getElementById('closeCartModalBtn');
    const cartContent = document.getElementById('cart-content');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartItemsList = cartItemsContainer.querySelector('.space-y-4');
    const cartTotalItems = document.getElementById('cart-total-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const whatsappCartBtn = document.getElementById('whatsapp-cart-btn');

        /**
     * Menampilkan modal detail keranjang
     */
    function showCartModal() {
        updateCartModal();
        cartModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Menyembunyikan modal detail keranjang
     */
    function hideCartModal() {
        cartModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    /**
     * Memperbarui tampilan modal keranjang
     */
    function updateCartModal() {
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.classList.add('hidden');
            return;
        }

        emptyCartMessage.classList.add('hidden');
        cartItemsContainer.classList.remove('hidden');
        
        // Kosongkan daftar item
        cartItemsList.innerHTML = '';

        let subtotal = 0;
        const itemCount = {};

        // Hitung jumlah setiap item dan subtotal
        cart.forEach(product => {
            const price = product.price * 15000;
            subtotal += price;
            
            if (itemCount[product.id]) {
                itemCount[product.id].quantity++;
                itemCount[product.id].totalPrice += price;
            } else {
                itemCount[product.id] = {
                    product: product,
                    quantity: 1,
                    totalPrice: price
                };
            }
        });

        // Tampilkan item di keranjang
        Object.values(itemCount).forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'flex items-center space-x-4 p-4 bg-gray-50 rounded-lg';
            cartItemElement.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.title}" class="w-16 h-16 object-contain bg-white rounded border">
                <div class="flex-grow">
                    <h4 class="font-semibold text-gray-800">${item.product.title.substring(0, 50)}...</h4>
                    <div class="flex items-center space-x-4 mt-2">
                        <span class="text-sm text-gray-600 capitalize">${item.product.category}</span>
                        <span class="text-sm text-blue-600 font-semibold">Rp ${Math.round(item.product.price * 15000).toLocaleString('id-ID')}</span>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                        <button class="decrease-quantity w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" data-product-id="${item.product.id}">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="quantity-display w-8 text-center font-semibold">${item.quantity}</span>
                        <button class="increase-quantity w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300" data-product-id="${item.product.id}">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                    <span class="font-bold text-gray-800 w-20 text-right">Rp ${Math.round(item.totalPrice).toLocaleString('id-ID')}</span>
                    <button class="remove-item text-red-500 hover:text-red-700 ml-2" data-product-id="${item.product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsList.appendChild(cartItemElement);
        });

        // Update summary
        const totalItems = cart.length;
        const totalPrice = subtotal;

        cartTotalItems.textContent = totalItems;
        cartSubtotal.textContent = `Rp ${Math.round(subtotal).toLocaleString('id-ID')}`;
        cartTotalPrice.textContent = `Rp ${Math.round(totalPrice).toLocaleString('id-ID')}`;
    }

    /**
     * Menambah jumlah item di keranjang
     */
    function increaseQuantity(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            cart.push(product);
            updateCartCounter();
            updateCartModal();
            showToast(`Ditambahkan: ${product.title.substring(0, 20)}...`);
        }
    }

    /**
     * Mengurangi jumlah item di keranjang
     */
    function decreaseQuantity(productId) {
        const index = cart.findIndex(p => p.id == productId);
        if (index !== -1) {
            const product = cart[index];
            cart.splice(index, 1);
            updateCartCounter();
            updateCartModal();
            showToast(`Dikurangi: ${product.title.substring(0, 20)}...`);
        }
    }

    /**
     * Menghapus semua item dengan productId tertentu dari keranjang
     */
    function removeAllQuantity(productId) {
        const product = products.find(p => p.id == productId);
        const initialLength = cart.length;
        cart = cart.filter(p => p.id != productId);
        const removedCount = initialLength - cart.length;
        
        if (removedCount > 0) {
            updateCartCounter();
            updateCartModal();
            showToast(`Dihapus: ${product.title.substring(0, 20)}... (${removedCount} item)`);
        }
    }

    /**
     * Mengosongkan seluruh keranjang
     */
    function clearCart() {
        if (cart.length === 0) return;
        
        const itemCount = cart.length;
        cart = [];
        updateCartCounter();
        updateCartModal();
        showToast(`Keranjang dikosongkan (${itemCount} item dihapus)`, 'info');
    }
        // Event untuk ikon keranjang (tampilkan modal keranjang)
    document.querySelector('.relative').addEventListener('click', (e) => {
        if (e.target.closest('.relative')) {
            showCartModal();
        }
    });

    // Event untuk modal keranjang
    closeCartModalBtn.addEventListener('click', hideCartModal);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            hideCartModal();
        }
    });

    // Event untuk tombol di modal keranjang
    clearCartBtn.addEventListener('click', clearCart);
    
    whatsappCartBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            hideCartModal();
            setTimeout(() => showWhatsappModal(), 300);
        } else {
            showToast('Keranjang masih kosong!', 'error');
        }
    });

    // Event delegation untuk tombol quantity dan hapus di keranjang
    cartItemsList.addEventListener('click', (e) => {
        const productId = e.target.closest('button')?.dataset.productId;
        if (!productId) return;

        if (e.target.closest('.increase-quantity')) {
            increaseQuantity(productId);
        } else if (e.target.closest('.decrease-quantity')) {
            decreaseQuantity(productId);
        } else if (e.target.closest('.remove-item')) {
            removeAllQuantity(productId);
        }
    });

    // Event untuk tombol "Mulai Belanja" di keranjang kosong
    emptyCartMessage.querySelector('button').addEventListener('click', hideCartModal);
        /**
     * Menambahkan produk ke keranjang dan memperbarui UI
     * @param {number} productId - ID produk yang akan ditambahkan
     */
    function addToCart(productId) {
        const product = products.find(p => p.id == productId);
        if (product) {
            cart.push(product);
            updateCartCounter();
            showToast(`${product.title.substring(0, 20)}... ditambahkan ke keranjang!`);
            
            // Jika modal keranjang sedang terbuka, update tampilannya
            if (!cartModal.classList.contains('hidden')) {
                updateCartModal();
            }
        }
    }
        /**
     * Mengambil kategori dari API
     */
    async function fetchCategories() {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            categories = await response.json();
            displayCategories();
        } catch (error) {
            console.error("Gagal mengambil kategori:", error);
        }
    }

    /**
     * Menampilkan kategori di header
     */
    function displayCategories() {
        const categoriesContainer = document.getElementById('categories-container');
        
        // Kosongkan container terlebih dahulu
        categoriesContainer.innerHTML = '';

        // Tambahkan tombol "All Products"
        const allProductsBtn = document.createElement('button');
        allProductsBtn.className = 'category-btn px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium whitespace-nowrap';
        allProductsBtn.textContent = 'All Products';
        allProductsBtn.dataset.category = 'all';
        categoriesContainer.appendChild(allProductsBtn);

        // Tambahkan kategori dari API
        categories.forEach(category => {
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-300 transition-colors';
            categoryBtn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryBtn.dataset.category = category;
            categoriesContainer.appendChild(categoryBtn);
        });
    }

    /**
     * Filter produk berdasarkan kategori
     */
    function filterByCategory(category) {
        if (category === 'all') {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => product.category === category);
        }
        displayProducts(filteredProducts);
        
        // Update style tombol kategori
        updateCategoryButtons(category);
    }

    /**
     * Update style tombol kategori yang aktif
     */
    function updateCategoryButtons(activeCategory) {
        const categoryBtns = document.querySelectorAll('.category-btn');
        
        categoryBtns.forEach(btn => {
            if (btn.dataset.category === activeCategory) {
                btn.className = 'category-btn px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium whitespace-nowrap';
            } else {
                btn.className = 'category-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-300 transition-colors';
            }
        });
    }

    /**
     * Search produk berdasarkan kata kunci
     */
    function searchProducts(keyword) {
        if (!keyword.trim()) {
            // Jika search kosong, tampilkan produk yang sedang difilter
            displayProducts(filteredProducts.length > 0 ? filteredProducts : products);
            return;
        }

        const searchTerm = keyword.toLowerCase();
        const searchResults = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

        displayProducts(searchResults);
        
        // Update pesan jika tidak ada hasil
        if (searchResults.length === 0) {
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">Tidak ada produk yang sesuai dengan pencarian "<strong>${keyword}</strong>"</p>
                </div>
            `;
        }
    }
        // Event untuk search
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', () => {
        searchProducts(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });

    // Event untuk kategori (delegation)
    document.getElementById('categories-container').addEventListener('click', (e) => {
        const categoryBtn = e.target.closest('.category-btn');
        if (categoryBtn) {
            filterByCategory(categoryBtn.dataset.category);
        }
    });

    // Event untuk clear search ketika mengklik kategori
    document.getElementById('categories-container').addEventListener('click', () => {
        searchInput.value = '';
    });
        /**
     * Mengambil produk dari Fake Store API
     */
    async function fetchProducts() {
        loader.style.display = 'block';
        productGrid.innerHTML = '';
        errorMessage.classList.add('hidden');
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            filteredProducts = [...products]; // Inisialisasi filtered products
            displayProducts(products);
            await fetchCategories(); // Load categories setelah products selesai
        } catch (error) {
            console.error("Gagal mengambil produk:", error);
            errorMessage.classList.remove('hidden');
        } finally {
            loader.style.display = 'none';
        }
    }
    
});
