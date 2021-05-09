const toCurrency = price =>{
    return new Intl.NumberFormat('en-EU', {
        currency: 'usd',
        style: 'currency'
    }).format(price);
}

document.querySelectorAll('.price').forEach(node=>{
    node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector('#card');
if($card){
    $card.addEventListener('click', event =>{
        if(event.target.classList.contains('js-remove')){
            const id = event.target.dataset.id;

            fetch('/card/remove/'+id, {
                method: 'delete'
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
                                    <button class="btn js-remove" data-id="${p.id}">Delete</button>
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