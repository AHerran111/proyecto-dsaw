
"use strict";

const utils = require('./utils');

class Product {

    constructor(title, description, imageUrl, unit, stock, pricePerUnit, category) {
        this._uuid = utils.generateUUID();
        this._title = title;
        this._description = description;
        this._imageUrl = imageUrl;
        this._unit = unit;
        this._stock = stock;
        this._pricePerUnit = pricePerUnit;
        this._category = category;
    }

    toJSON() {
        return {
            uuid: this._uuid,
            title: this._title,
            description: this._description,
            imageUrl: this._imageUrl,
            unit: this._unit,
            stock: this._stock,
            pricePerUnit: this._pricePerUnit,
            category: this._category
        };
    }

    get uuid() {
        return this._uuid;
    }

    set uuid(value) {
        throw new ProductException("Product UUIDs are autogenerated");
    }

    get title() {
        return this._title;
    }

    set title(value) {
        if (typeof value !== "string" || value === "") {
            throw new ProductException("Product title cannot be empty");
        }
    }

    get description() {
        return this._description;
    }

    set description(value) {
        if (typeof value !== "string" || value === "") {
            throw new ProductException("Product description cannot be empty");
        }
    }

    get imageUrl() {
        return this._imageUrl;
    }

    set imageUrl(value) {
        if (typeof value !== "string" || value === "") {
            throw new ProductException("Product imageUrl cannot be empty");
        }
    }


    get unit() {
        return this._unit;
    }

    set unit(value) {
        if (!Number.isInteger(value) || value === 0) {
            throw new ProductException("Product unit cannot be empty");
        }
    }

    get stock() {
        return this._stock;
    }

    set stock(value) {
        if (!Number.isInteger(value) || value === 0) {
            throw new ProductException("Product stock cannot be empty");
        }
    }

    get pricePerUnit() {
        return this._pricePerUnit;
    }

    set pricePerUnit(value) {
        if (!utils.isFloat(value) || value === 0) {
            throw new ProductException("Product pricePerUnit cannot be empty");
        }
    }

    get category() {
        return this._category;
    }

    set category(value) {
        if (typeof value !== "string" || value === "") {
            throw new ProductException("Product category cannot be empty");
        }
    }



    static createFromJson(jsonValue) {
        let obj = JSON.parse(jsonValue);
        return Product.createFromObject(obj);

    }


    static createFromObject(obj) {
        let newProduct = {};
        Object.assign(newProduct, obj);
        // console.log("BEJORE NEW PRODUCT");
        // console.log(newProduct);

        // Product.cleanObject(newProduct);

        // console.log("NEW PRODUCT");
        // console.log(newProduct);

        let product = new Product(
            newProduct.title,
            newProduct.description,
            newProduct.imageUrl, 
            newProduct.unit, 
            newProduct.stock, 
            newProduct.pricePerUnit, 
            newProduct.category
        )

        if (newProduct.uuid !== undefined) {
            product._uuid = newProduct.uuid;
        }
        
        return product;
    }


    static cleanObject(obj) {
        const productProperties = [
            "uuid", "title", "description", "imageUrl", "unit", "stock", "pricePerUnit", "category"
        ]
        
        for (let prop in obj) {
            if (!productProperties.includes(prop)) {
                // clean the property
                delete obj[prop];
            }
        }
    }
}


class ProductException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}


module.exports = Product;