const uuid = require('uuid').v4;
const fs = require('fs');
const path = require('path');


class Product{
    constructor(name, price, img) {
        this.name = name;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }

    toJSON(){
        return {
            name: this.name,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    static async update(product){
        const products = await Product.getAll();

        const idx = products.findIndex(p=> p.id === product.id);
        products[idx] =product;

        return new Promise((resolve, reject)=> {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'productsDB.json'),
                JSON.stringify(products),
                (err) => {
                    if(err)
                        reject(err);
                    else
                        resolve();
                }
            )
        })
    }

    async save(){
        const products = await Product.getAll();
        products.push(this.toJSON());

        return new Promise((resolve, reject)=> {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'productsDB.json'),
                JSON.stringify(products),
                (err) => {
                    if(err)
                        reject(err);
                    else
                        resolve();
                }
            )
        })
    }

    static getAll(){
        return new Promise((resolve, reject)=>{
            fs.readFile(
                path.join(__dirname, '..', 'data', 'productsDB.json'),
                'utf-8',
                (err, content)=>{
                    if(err)
                        reject(err);
                    else
                        resolve(JSON.parse(content));

                }
            );
        })
    }

    static async getById(id){
        const products= await Product.getAll();
        return products.find(p => p.id === id);
    }
}

module.exports = Product;