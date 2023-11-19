const container = document.getElementById('favorite-container')


if (likedProducts.length !== 0) {
    likedProducts.forEach((ele) => {
        const li = document.createElement('li');
        li.classList.add('favorite-item');
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');
        itemContainer.classList.add('flex-container');
        itemContainer.classList.add('flex-row');
        const name = document.createElement('p');
        name.textContent = (ele.productName);
        name.classList.add('theme-color');
        const heartIcon = document.createElement('i')
        heartIcon.classList.add('fa');
        heartIcon.classList.add('fa-heart');
        heartIcon.classList.add('heart');
        heartIcon.classList.add('liked');
        heartIcon.addEventListener('click', () => {
            handleClick(heartIcon, ele);
        });
        itemContainer.appendChild(name);
        itemContainer.appendChild(heartIcon);
        li.appendChild(itemContainer);
        container.appendChild(li);
    })
} else {
    const h3 = document.createElement('h3');
    h3.textContent = 'No product found';
    h3.classList.add('no-product');
    h3.classList.add('theme-color');
    container.parentElement.appendChild(h3);
}

async function handleClick(heart, product) {
    if (currentUser) {

        if (heart.classList.contains('liked')) {
            heart.classList.replace('fa-heart', 'fa-heart-o');
            heart.classList.remove('liked'); 
            try {
                const response = await fetch(`products/liked-products/${product._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userId: currentUser})
                });
                if (response.ok) {
                    console.log('Product removed successfully');
                    heart.parentElement.parentElement.remove();
                } else {
                    console.error('Failed to remove product');
                }
            } catch (error) {
                console.error('Failed to remove product');
            }
            
    
        } else {
            heart.classList.replace('fa-heart-o', 'fa-heart');
            heart.classList.add('liked');
            try {
                const response = await fetch('products/add-liked-product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: currentUser,
                        productId: product._id
                    })
                });
                if (response.ok) {
                    console.log('Product added successfully');
                } else {
                    console.error('Failed to add product');
                }
            } catch (error) {
                console.error('Failed to add Product');
            }
    
        }
    }

    
}





