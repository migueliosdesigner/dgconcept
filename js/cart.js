/* js/cart.js - Lógica de E-commerce, Catálogo e Carrinho */

let products = [];
let filteredProducts = [];
let cart = [];
let activeProductForModal = null;
let selectedColor = "";
let selectedSize = "";
let showAllProducts = false;
let activeCategory = 'Todos';

async function fetchStoreData() {
    try {
        const resProd = await fetch('assets/data/products.json');
        if (!resProd.ok) throw new Error();
        products = await resProd.json();
    } catch (e) {
        products = [
            { id: 1, name: "Vestido Alfaiataria Noite", category: "Vestidos", price: 799.90, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop", tag: "Festa", colors: ["#000000", "#3e2015"], sizes: ["P", "M"] },
            { id: 2, name: "Blazer Alongado Paris", category: "Alfaiataria", price: 489.90, img: "https://images.unsplash.com/photo-1550614000-4b95d466f1fc?q=80&w=400&auto=format&fit=crop", tag: "Exclusivo", colors: ["#F5F5F5", "#000000"], sizes: ["P", "M", "G"] },
            { id: 3, name: "Calça Pantalona Fluída", category: "Alfaiataria", price: 349.90, img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=400&auto=format&fit=crop", tag: "", colors: ["#000000", "#3e2015"], sizes: ["36", "38", "40"] },
            { id: 4, name: "Conjunto Seda Concept", category: "Conjuntos", price: 620.00, img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=400&auto=format&fit=crop", tag: "Novidade", colors: ["#E6CCB2", "#FFFFFF"], sizes: ["P", "M", "G"] },
            { id: 5, name: "Blusa Gola Alta Nude", category: "Básicos", price: 189.90, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=400&auto=format&fit=crop", tag: "", colors: ["#E6CCB2", "#FFFFFF"], sizes: ["P", "M"] }
        ];
    }
    filteredProducts = [...products];
    renderFilters();
    renderProducts(filteredProducts);

    try {
        const resLooks = await fetch('assets/data/looks.json');
        if(resLooks.ok) {
            const looks = await resLooks.json();
            renderLookBook(looks);
        } else { throw new Error(); }
    } catch (e) {
        renderLookBook([
            { id: 1, title: "Elegância Clássica", img: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=400&auto=format&fit=crop" },
            { id: 2, title: "Alfaiataria Moderna", img: "https://images.unsplash.com/photo-1550614000-4b95d466f1fc?q=80&w=400&auto=format&fit=crop" },
            { id: 3, title: "Fluidez Diurna", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop" }
        ]);
    }
}

function renderFilters() {
    const categories = ['Todos', ...new Set(products.map(p => p.category))];
    const filterContainer = document.getElementById('category-filters');
    const mobileContainer = document.getElementById('mobile-categories');
    
    if(filterContainer) filterContainer.innerHTML = '';
    if(mobileContainer) mobileContainer.innerHTML = '';

    categories.forEach(cat => {
        if(filterContainer) {
            const isActive = cat === activeCategory;
            const btnClass = isActive ? "bg-concept-coffee text-white" : "bg-white text-concept-coffee border-concept-coffee/20 hover:border-concept-coffee hover:bg-concept-base focus-visible:ring-4 focus-visible:ring-concept-nude focus-visible:outline-none";
            filterContainer.innerHTML += `<button onclick="window.filterByCategory('${cat}')" class="px-8 py-3 rounded-sm border-2 text-xs font-extrabold tracking-[0.2em] uppercase transition-all shadow-sm btn-pop ${btnClass}">${cat}</button>`;
        }
        if(mobileContainer && cat !== 'Todos') {
            mobileContainer.innerHTML += `<li><a href="#vitrine" onclick="document.getElementById('sidebar-modal').close(); window.filterByCategory('${cat}')" class="text-white/80 hover:text-concept-nude block transition-colors focus-visible:ring-4 focus-visible:ring-concept-nude focus-visible:outline-none">${cat}</a></li>`;
        }
    });
}

window.filterByCategory = function(cat) {
    activeCategory = cat;
    showAllProducts = false;
    filteredProducts = cat === 'Todos' ? [...products] : products.filter(p => p.category === cat);
    renderFilters();
    renderProducts(filteredProducts);
}

window.filterProducts = function(query) {
    const q = query.toLowerCase().trim();
    filteredProducts = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    showAllProducts = true; 
    renderProducts(filteredProducts);
    
    const overlay = document.getElementById('search-overlay');
    if(overlay && !overlay.classList.contains('hidden') && query.length > 2) {
        window.toggleSearch();
        document.getElementById('vitrine').scrollIntoView();
    }
}

window.toggleAllProducts = function() {
    showAllProducts = true;
    renderProducts(filteredProducts);
}

function renderProducts(lista) {
    const grid = document.getElementById('product-grid');
    const noResults = document.getElementById('no-results');
    const btnContainer = document.getElementById('view-all-container');
    
    if(!grid) return;
    grid.innerHTML = '';
    
    if(lista.length === 0) {
        noResults.classList.remove('hidden');
        grid.classList.add('hidden');
        btnContainer.classList.add('hidden');
    } else {
        noResults.classList.add('hidden');
        grid.classList.remove('hidden');
        
        const displayList = showAllProducts ? lista : lista.slice(0, 4);
        if (lista.length > 4 && !showAllProducts) btnContainer.classList.remove('hidden');
        else btnContainer.classList.add('hidden');

        displayList.forEach(p => {
            grid.innerHTML += `
                <article class="group flex flex-col bg-white p-4 rounded-sm shadow-sm hover-pop border border-concept-coffee/5 relative focus-within:ring-4 focus-within:ring-concept-nude">
                    ${p.tag ? `<span class="absolute top-6 left-6 z-20 bg-concept-coffee text-concept-nude text-[9px] font-extrabold px-3 py-1.5 uppercase tracking-[0.2em] rounded-sm shadow-sm">${p.tag}</span>` : ''}
                    
                    <div class="relative bg-concept-base overflow-hidden mb-5 aspect-[3/4] cursor-pointer" onclick="window.openProductModal(${p.id})">
                        <img src="${p.img}" loading="lazy" class="w-full h-full object-cover image-zoom" alt="${p.name}">
                        <div class="absolute inset-0 bg-concept-coffee/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <span class="bg-white text-concept-coffee font-bold text-xs tracking-widest uppercase px-6 py-3 shadow-xl rounded-sm">Ver Detalhes</span>
                        </div>
                    </div>
                    <h3 class="font-serif text-concept-coffee text-xl font-bold mb-1 leading-snug cursor-pointer hover:text-concept-nude" onclick="window.openProductModal(${p.id})">${p.name}</h3>
                    <p class="font-bold text-concept-coffeeLight text-lg">R$ ${p.price.toFixed(2).replace('.', ',')}</p>
                </article>
            `;
        });
    }
}

function renderLookBook(looks) {
    const grid = document.getElementById('lookbook-grid');
    if(!grid) return;
    grid.innerHTML = '';
    looks.forEach(look => {
        grid.innerHTML += `
            <figure class="relative group overflow-hidden rounded-sm cursor-pointer shadow-md hover-pop break-inside-avoid mb-6 focus-within:ring-4 focus-within:ring-concept-nude" tabindex="0">
                <img src="${look.img}" loading="lazy" class="w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Look editorial: ${look.title}">
                <figcaption class="absolute inset-0 bg-gradient-to-t from-concept-coffee/90 via-concept-coffee/10 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 class="font-serif text-3xl text-white mb-2 font-bold">${look.title}</h3>
                </figcaption>
            </figure>
        `;
    });
}

window.openProductModal = function(id) {
    const product = products.find(p => p.id === id);
    activeProductForModal = product;
    selectedColor = product.colors[0]; 
    selectedSize = product.sizes[0];

    document.getElementById('modal-img').src = product.img;
    document.getElementById('modal-img').alt = product.name;
    document.getElementById('modal-tag').innerText = product.tag || '';
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-price').innerText = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    
    document.getElementById('modal-breadcrumb').innerText = `Catálogo > ${product.category} > ${product.name}`;
    
    let colorHtml = '';
    product.colors.forEach(c => {
        const border = c === '#FFFFFF' || c === '#F5F5F5' ? 'border border-gray-300' : 'border border-transparent';
        colorHtml += `<button onclick="window.selectColor('${c}', this)" aria-label="Cor ${c}" class="color-btn w-10 h-10 rounded-full shadow-sm ring-offset-2 hover:scale-110 transition-transform ${border} focus-visible:ring-4 focus-visible:ring-concept-nude focus-visible:outline-none btn-pop" style="background-color: ${c}"></button>`;
    });
    document.getElementById('modal-colors').innerHTML = colorHtml;

    let sizeHtml = '';
    product.sizes.forEach(s => {
        sizeHtml += `<button onclick="window.selectSize('${s}', this)" class="size-btn w-12 h-12 border-2 border-concept-coffee/20 rounded-sm font-bold text-sm text-concept-coffee hover:border-concept-coffee transition-colors focus-visible:ring-4 focus-visible:ring-concept-nude focus-visible:outline-none btn-pop">${s}</button>`;
    });
    document.getElementById('modal-sizes').innerHTML = sizeHtml;

    setTimeout(() => {
        document.querySelector('.color-btn').classList.add('ring-2', 'ring-concept-coffee');
        document.querySelector('.size-btn').classList.add('bg-concept-coffee', 'text-white');
    }, 10);

    document.getElementById('modal-add-btn').onclick = () => addToCartFromModal();
    document.getElementById('product-modal').showModal();
}

window.closeProductModal = function() { document.getElementById('product-modal').close(); }

window.selectColor = function(color, btnEl) {
    selectedColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('ring-2', 'ring-concept-coffee'));
    btnEl.classList.add('ring-2', 'ring-concept-coffee');
}

window.selectSize = function(size, btnEl) {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('bg-concept-coffee', 'text-white');
        btn.classList.add('text-concept-coffee');
    });
    btnEl.classList.remove('text-concept-coffee');
    btnEl.classList.add('bg-concept-coffee', 'text-white');
}

function addToCartFromModal() {
    const product = activeProductForModal;
    const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;
    
    const existingItem = cart.find(i => i.cartItemId === cartItemId);
    if(existingItem) { 
        existingItem.quantity++; 
    } else { 
        cart.push({ ...product, cartItemId, selectedColor, selectedSize, quantity: 1 }); 
    }
    
    updateCart();
    
    // Feedback visual sem abrir sacola
    const badge = document.getElementById('cart-count');
    badge.classList.add('scale-150', 'bg-concept-nude', 'text-concept-coffee');
    setTimeout(() => badge.classList.remove('scale-150', 'bg-concept-nude', 'text-concept-coffee'), 300);
    window.closeProductModal();
}

window.changeQty = function(cartItemId, delta) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if(item) {
        item.quantity += delta;
        if(item.quantity <= 0) cart = cart.filter(i => i.cartItemId !== cartItemId);
        updateCart();
    }
}

function updateCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const badge = document.getElementById('cart-count');
    
    let html = ''; let total = 0; let qty = 0;

    if(cart.length === 0) {
        html = '<div class="text-center text-concept-coffeeLight py-16"><p class="font-serif text-2xl font-bold">Sua sacola está vazia.</p></div>';
        badge.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
        cart.forEach(item => {
            total += item.price * item.quantity;
            qty += item.quantity;
            
            const colorBlock = `<span class="inline-block w-4 h-4 rounded-full border border-gray-300 ml-1 translate-y-[3px]" style="background-color: ${item.selectedColor}"></span>`;
            
            html += `
                <div class="flex items-center gap-4 bg-white p-4 rounded-sm border border-concept-coffee/10 shadow-sm">
                    <img src="${item.img}" alt="${item.name}" class="w-16 h-24 object-cover rounded-sm bg-concept-base">
                    <div class="flex-1">
                        <h4 class="font-serif text-concept-coffee font-bold text-sm leading-tight mb-1">${item.name}</h4>
                        <p class="text-[10px] font-bold text-concept-coffeeLight mb-1 uppercase tracking-widest">Tam: ${item.selectedSize} | Cor: ${colorBlock}</p>
                        <p class="text-concept-coffee font-bold text-sm">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="flex items-center bg-concept-base border border-concept-coffee/10 rounded-sm">
                        <button aria-label="Remover" onclick="window.changeQty('${item.cartItemId}', -1)" class="w-10 h-10 flex items-center justify-center hover:bg-concept-nude/30 text-concept-coffee min-h-[44px] font-bold focus-visible:ring-4 focus-visible:ring-concept-nude focus-visible:outline-none btn-pop">-</button>
                        <span class="w-6 text-center text-sm font-bold text-concept-coffee">${item.quantity}</span>
                        <button aria-label="Adicionar" onclick="window.changeQty('${item.cartItemId}', 1)" class="w-10 h-10 flex items-center justify-center hover:bg-concept-nude/30 text-concept-coffee min-h-[44px] font-bold focus-visible:ring-4 focus-visible:ring-concept-nude focus-visible:outline-none btn-pop">+</button>
                    </div>
                </div>
            `;
        });
    }
    if(container) container.innerHTML = html;
    if(totalEl) totalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    if(badge) badge.innerText = qty;
}

// Checkout LGPD Strict
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('lgpd-cart');
    const btnCheckout = document.getElementById('btn-checkout');

    if(checkbox && btnCheckout) {
        checkbox.addEventListener('change', (e) => {
            if(e.target.checked && cart.length > 0) {
                btnCheckout.removeAttribute('disabled');
                btnCheckout.removeAttribute('aria-disabled');
                btnCheckout.classList.remove('opacity-40', 'cursor-not-allowed', 'bg-concept-coffee');
                btnCheckout.classList.add('bg-[#25D366]', 'hover-pop', 'shadow-xl'); 
            } else {
                btnCheckout.setAttribute('disabled', 'true');
                btnCheckout.setAttribute('aria-disabled', 'true');
                btnCheckout.classList.add('opacity-40', 'cursor-not-allowed', 'bg-concept-coffee');
                btnCheckout.classList.remove('bg-[#25D366]', 'hover-pop', 'shadow-xl');
            }
        });
    }
});

window.checkoutWhatsApp = function() {
    const checkbox = document.getElementById('lgpd-cart');
    if(cart.length === 0 || !checkbox.checked) return;
    
    let text = "Olá, Daniela Gontijo Concept! Fiz uma seleção no catálogo online e gostaria de dar andamento no meu pedido:%0A%0A";
    let total = 0;
    cart.forEach(i => {
        text += `🛍 ${i.quantity}x ${i.name}%0A   Tam: ${i.selectedSize} | Cor: ${i.selectedColor}%0A   Sub: R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}%0A%0A`;
        total += i.price * i.quantity;
    });
    text += `*Total Estimado: R$ ${total.toFixed(2).replace('.', ',')}*%0A%0AAguardo atendimento exclusivo! ✨`;

    // 553497668987 Ofuscado contra bots de spam
    const num = atob('NTUzNDk3NjY4OTg3'); 
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
}

fetchStoreData();