const toCurrency = price => {
    return new Intl.NumberFormat('en-EU', {
        currency: 'usd',
        style: 'currency'
    }).format(price);
}

const toDate = date => {
    return new Intl.DateTimeFormat('en-EU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

const buttonForSearchProducts = (admin, user, pId, csrf) =>{
    let linkElem = document.querySelector("#link");
    let linkStr = `<a href="/products/${pId}/edit?allow=true" >Edit </a>`;
    console.log(linkStr)
    console.log(pId)

    let formElem = document.querySelector("#f");
    let formStr = `<form action="/card/add" method="post">
         <input type="hidden" name="_csrf" value="${csrf}">
         <input type="hidden" name="id" value="${pId}">
         <button type="submit" class="btn ">Buy</button>
         </form>`
    console.log(formStr)

    if(admin)
        return linkElem.innerHTML = linkStr;
    if(user)
        return formElem.innerHTML = formStr;
}

const forAsyncLinks = (url, event) =>{
    const csrf = event.target.dataset.csrf;
        fetch(url, {
            method: 'get',
            headers: {
                'X-XSRF-TOKEN': csrf,
                'content-type': 'application/json'
            }
        }).then(res => res.json())
            .then(card => {
                if (card.length) {
                    const html = card.map(o => {
                        return `
<div class="col s6 offset-s3">
            <div class="card">
                <div class="card-action">
                    <span class="card-title">
                        <b>Order</b> <small>${o._id}</small>
                    </span>
                    <p class="date">${toDate(o.date)}</p>
                    <p><em><b>${o.user.name}</b></em> (${o.user.userId.email})</p>
                    <p><em><b>Address:</b></em> ${o.address}</p>

                    <ol id="list">${o.products.map(p =>
                        {return `<li><b>${p.product.name}</b> (x${p.count})</li>`
                        }).join('')}</ol>
                    <hr>
                    <div class="sp">
                        <p><em><b>Total price: </b></em><span class="price">${toCurrency(o.products.reduce((total, p) => {
                            return total += p.count * p.product.price
                        }, 0))}</span> 
                        </p>
                                              
                    </div>
                    </div>
                    </div>
                    </div>
                            `
                    }).join('')
                    document.querySelector('#card').innerHTML = html;
                } else {
                    document.querySelector('#card').innerHTML = '<h4>No delivered orders</h4>'
                }
            })
}


document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});


const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;

            fetch('/card/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
                .then(card => {
                    if (card.products.length) {
                        const html = card.products.map(p => {
                            return `
                            <tr>
                                <td>${p.name}</td>
                                <td class="price small">` + toCurrency(p.price) + `</td>
                                <td>${p.count}</td>
                                <td>
                                    <button class="btn js-remove redd" data-id="${p.id}" data-csrf="${csrf}">Delete</button>
                                </td>
                            </tr>
                            `
                        }).join('')
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price.total').textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = '<h4>The basket is empty</h4>'
                    }
                })
        };

        if (event.target.classList.contains('js-done')) {
            const csrf = event.target.dataset.csrf;
            const id = event.target.dataset.id;
            const user = event.target.dataset.user;
            console.log('user:' +user);


            console.log('orderId: ' + id);

            fetch('/adminOrders', {
                method: 'post',
                headers: {
                    'X-XSRF-TOKEN': csrf,
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    id: id
                })
            }).then(res => res.json())
                .then(card => {
                    if (card.length) {
                        const html = card.map(o => {
                            return `
<div class="col s6 offset-s3">
            <div class="card">
                <div class="card-action">
                    <span class="card-title">
                        <b>Order</b> <small>${o._id}</small>
                    </span>
                    <p class="date">${toDate(o.date)}</p>
                    <p><em><b>${o.user.name}</b></em> (${o.user.userId.email})</p>
                    <p><em><b>Address:</b></em> ${o.address}</p>

                    <ol id="list">${o.products.map(p =>
                            {return `<li><b>${p.product.name}</b> (x${p.count})</li>`
                            }).join('')}</ol>
                    <hr>
                    <div class="sp">
                        <p><em><b>Total price: </b></em><span class="price">${toCurrency(o.products.reduce((total, p)=>{
                                return total += p.count * p.product.price
                            }, 0))}</span> </p>
                         <button class="btn js-done" data-id="${o._id}" data-csrf="${csrf}" data-csrf="${csrf}" data-user="${o.user.userId}">In progress</button>
                       
                    </div>
                    </div>
                    </div>
                    </div>
                            `
                        }).join('')
                        $card.innerHTML = html;
                    } else {
                        $card.innerHTML = '<h4>No active orders</h4>'
                    }

                })
        }

        if (event.target.classList.contains('js-search')) {
            const csrf = event.target.dataset.csrf;
            const adminn = event.target.dataset.adminn;
            const user = event.target.dataset.user;
            const pName = document.querySelector('#pName').value;

            fetch('/products/search', {
                method: 'post',
                headers: {
                    'X-XSRF-TOKEN': csrf,
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    pName
                })
            }).then(res => res.json())
                .then(products => {
                    if (products.length) {
                        const html = products.map(p => {
                            return `
                                <div class="col s3 ">
                                    <div class="card shown">
                                        <div class="card-image ">
                                            <img src="${p.img}" alt="${p.name}">
                                        </div>
                                        <div class="card-content">
                                            <span class="card-title">${p.name}</span>
                                            <p>${p.description}</p>
                                            <p class="price">${toCurrency(p.price)}</p>
                                        </div>
                                        <div class="card-action actions" >
                                            ${buttonForSearchProducts(adminn, user, p._id, csrf)}
                                        </div>
                                    </div>
                                </div>    
                            `
                        }).join('');
                        document.querySelector('#products').innerHTML = html;
                    } else {
                        document.querySelector('#products').innerHTML = '<h4>No products were found</h4>'
                    }
                })
        };
    })
}


const $orderLink = document.querySelector('#orderLink');
if ($orderLink) {
    $orderLink.addEventListener('click', event => {
        if (event.target.classList.contains('js-orderActive')) {
            const csrf = event.target.dataset.csrf;

            fetch('/adminOrders/active', {
                method: 'get',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
                .then(card => {
                    if (card.length) {
                        const html = card.map(o => {
                            return `
        <div class="col s6 offset-s3">
            <div class="card">
                <div class="card-action">
                    <span class="card-title">
                        <b>Order</b> <small>${o._id}</small>
                    </span>
                    <p class="date">${toDate(o.date)}</p>
                    <p><em><b>${o.user.name}</b></em> (${o.user.userId.email})</p>
                    <p><em><b>Address:</b></em> ${o.address}</p>

                    
                    <ol id="list">${o.products.map(p =>
                            {return `<li><b>${p.product.name}</b> (x${p.count})</li>`
                            }).join('')}</ol>
                    <hr>
                    <div class="sp">
                        <p><em><b>Total price: </b></em><span class="price">${toCurrency(o.products.reduce((total, p) => {
                                return total += p.count * p.product.price
                            }, 0))}</span> 
                        </p>
                        <button class="btn js-done" data-id="${o._id}" data-csrf="${csrf}" data-csrf="${csrf}" data-user="${o.user.userId}">In progress</button>                  
                    </div>
                </div>
            </div>
        </div>
                            `
                        }).join('')
                        document.querySelector('#card').innerHTML = html;
                    } else {
                        document.querySelector('#card').innerHTML = '<h4>No delivered orders</h4>'
                    }
                })
        }

        if (event.target.classList.contains('js-orderPassive')) {
            forAsyncLinks('/adminOrders/passive', event);

        }

        if (event.target.classList.contains('js-orderPassiveLink')) {
            forAsyncLinks('/orders/passive', event);

        }

        if (event.target.classList.contains('js-orderActiveLink')) {
            forAsyncLinks('/orders/active', event);

        }
    })
};

M.Tabs.init(document.querySelectorAll('.tabs'));