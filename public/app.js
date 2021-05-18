const toCurrency = price =>{
    return new Intl.NumberFormat('en-EU', {
        currency: 'usd',
        style: 'currency'
    }).format(price);
}

const toDate = date =>{
    return new Intl.DateTimeFormat('en-EU', {
        day:'2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.price').forEach(node=>{
    node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node=>{
    node.textContent = toDate(node.textContent);
});


const $card = document.querySelector('#card');
if($card){
    $card.addEventListener('click', event =>{
        if(event.target.classList.contains('js-remove')){
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;

            fetch('/card/remove/'+id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
                .then(card=>{
                    if(card.products.length){
                        const html= card.products.map(p=>{
                            return `
                            <tr>
                                <td>${p.name}</td>
                                <td class="price small">`+toCurrency(p.price)+`</td>
                                <td>${p.count}</td>
                                <td>
                                    <button class="btn js-remove redd" data-id="${p.id}" data-csrf="${csrf}">Delete</button>
                                </td>
                            </tr>
                            `
                        }).join('')
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price.total').textContent = toCurrency(card.price);
                    }
                    else{
                        $card.innerHTML='<p>The basket is empty</p>'
                    }
                })
        };
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'));