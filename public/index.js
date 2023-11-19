let typeOptions = new Set();
let brandOptions = new Set();

let currentPage = 1;
let products = [];

async function fetchProducts(page, brands, types) {
    try {
        let url = `/products?page=${page}`;

        if (brands.length > 0) {
            const brandQuery = brands.join(';');
            url += `&brands=${brandQuery}`;
        }

        if (types.length > 0) {
            const typeQuery = types.join(';');
            url += `&types=${typeQuery}`;
        }
        
        // console.log(url);
        const response = await fetch(url);
        const data = await response.json();

        if (brands.length === 0 && types.length === 0) {
            typeOptions = new Set(data.allTypes);
            brandOptions = new Set(data.allBrands);
        }

        renderProducts(data.products);
        renderPagination(data.totalPages, brands, types);
    } catch (error) {
        console.error(error);
    }
}

function renderProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
  
    products.forEach(product => {
		const productElement = document.createElement('div');
		const imageElement = document.createElement('img');
		const nameElement = document.createElement('span');
		const property = document.createElement('span');
		const a = document.createElement('a');

		const uint8Array = new Uint8Array(product.picture.data.data);
		const base64Data = uint8Array.reduce((data, byte) => {
		return data + String.fromCharCode(byte);
		}, '');
		const dataUrl = `data:${product.picture.contentType};base64,${btoa(base64Data)}`;
		imageElement.src = dataUrl;
		imageElement.classList.add('gallary-img');

		const intro = document.createElement('div');
		intro.classList.add('product-intro');
		intro.classList.add('flex-container');
		intro.classList.add('flex-col');

		nameElement.innerHTML = `<b>${product.productName}</b>`;
		nameElement.classList.add('gallary-tag');
		property.innerHTML = `<b>Type:</b> ${product.type}, <b>Brand:</b> ${product.brand}`;
		property.classList.add('gallary-tag');

		intro.appendChild(nameElement);
		intro.appendChild(property);

		productElement.classList.add('product');
		productElement.classList.add('flex-container');
		productElement.classList.add('flex-col');
		a.appendChild(imageElement);
		a.setAttribute('href', `/products/details/${product._id}`);
		productElement.appendChild(a);
		productElement.appendChild(intro);

		productsContainer.appendChild(productElement);
    });
    if (products.length === 0) {
        productsContainer.innerHTML = '<h2 class="theme-color">No products found</h2>'
    }
}

function renderPagination(totalPages, brands, types) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    if (currentPage > 1) {
        const previousLink = createPaginationLink(currentPage - 1, 'Previous', brands, types);
        paginationContainer.appendChild(previousLink);
    }

    for (let page = 1; page <= totalPages; page++) {
        const pageLink = createPaginationLink(page, page.toString(), brands, types);
        if (page === currentPage) {
            pageLink.classList.add('current');
        }
        paginationContainer.appendChild(pageLink);
    }

    if (currentPage < totalPages) {
        const nextLink = createPaginationLink(currentPage + 1, 'Next', brands, types);
        paginationContainer.appendChild(nextLink);
    }
}

function createPaginationLink(page, text, brands, types) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = text;

    link.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage = page;
        fetchProducts(currentPage, brands, types)
    });

    return link;
}

fetchProducts(1, [], []);

const addBtn = document.getElementById('addBtn');
const filterInput = document.getElementById('filter');
addBtn.addEventListener('click', (e) => {
    const filterValue = filterInput.value.trim();

    if (filterValue !== '' && (typeOptions.has(filterValue) || brandOptions.has(filterValue))) {
        addFilterTag(filterValue);
        filterInput.value = '';
        applyFilters();
    } else {
        alert('Please add a correct type or brand');
    }
})

function addFilterTag(filterValue) {
    const filterTagsContainer = document.getElementById('filter-tags-container');
    const tag = document.createElement('div');
    tag.classList.add('filter-card');
    tag.classList.add('flex-container', 'flex-row');

    const tagText = document.createElement('span');
    tagText.classList.add('filter-tag');
    tagText.textContent = filterValue;

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('material-icons');
    deleteIcon.textContent = 'delete';

    tag.appendChild(tagText);
    tag.appendChild(deleteIcon);
    filterTagsContainer.appendChild(tag);

    deleteIcon.addEventListener('click', () => {
        filterTagsContainer.removeChild(tag);
        applyFilters(brandOptions, typeOptions);
    })
}

function applyFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const filters = Array.from(filterTags).map(tag => tag.textContent);
    // console.log(filters);
    const brands = [];
    const types = [];
    // console.log(brandOptions);

    filters.forEach(filter => {
        if (brandOptions.has(filter)) {
            brands.push(filter);
        } else if (typeOptions.has(filter)) {
            types.push(filter);
        }
    });

    currentPage = 1;
    fetchProducts(currentPage, brands, types);
}