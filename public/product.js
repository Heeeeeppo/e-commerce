const imageElement = document.getElementById('detail-product-img');
// console.log(product)
const dataUrl = processImage(product.picture.data.data);

imageElement.src = dataUrl;
imageElement.alt = product.pictureName
// // imageElement.setAttribute('src', dataUrl)

const heart = document.getElementsByClassName('heart')[0];
heart.addEventListener('click', async () => {

    if (currentUser) {
        if (heart.classList.contains('liked')) {
            heart.classList.replace('fa-heart', 'fa-heart-o');
            heart.classList.remove('liked');
            
            try {
                const response = await fetch(`/products/liked-products/${product._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userId: currentUser})
                });
                if (response.ok) {
                    console.log('Product removed successfully');
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
                const response = await fetch('/products/add-liked-product', {
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

    
})
// console.log(heart);

const likedSet = new Set(likedProducts.map((ele) => {
    return ele._id
}))
if (likedSet.has(product._id)) {
    heart.classList.replace('fa-heart-o', 'fa-heart');
    heart.classList.add('liked');
}

function processImage(picture) {
    const uint8Array = Uint8Array.from(picture);
    const base64Data = uint8Array.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
    }, '');
    return `data:${product.picture.contentType};base64,${btoa(base64Data)}`;
}

// console.log(sameBrandProduct)

sameBrandProduct.forEach((product) => {
    const carouselContainer = document.getElementById('carousel');
    const carouselCard = document.createElement('div')
    carouselCard.classList.add('flex-container');
    carouselCard.classList.add('flex-col');
    carouselCard.classList.add('carousel-card');

    
    const cardImg = document.createElement('img');
    const imgUrl = processImage(product.picture.data.data);
    cardImg.src = imgUrl;
    cardImg.alt = product.pictureName;
    cardImg.classList.add('card-img');

    const a = document.createElement('a');
    a.appendChild(cardImg);
    a.setAttribute('href', `/products/details/${product._id}`);

    const cardName = document.createElement('span');
    cardName.textContent = product.productName;

    carouselCard.appendChild(a);
    carouselCard.appendChild(cardName);
    carouselContainer.appendChild(carouselCard);
})
