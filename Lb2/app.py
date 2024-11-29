from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
import uuid

app = Flask(__name__)


# Модель товара
class Product:
    def __init__(self, name, price):
        self.id = str(uuid.uuid4())
        self.name = name
        self.price = price


# Модель заказа
class Order:
    def __init__(self, products):
        self.id = str(uuid.uuid4())
        self.products = products


# Хранилища для товаров и заказов (в памяти, ограничено 50 записями)
products_storage = []
orders_storage = []

# Настройка Swagger
SWAGGER_URL = "/swagger"
API_URL = "/static/swagger.json"  # Путь к JSON с документацией
swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={})
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)


# Главная страница
@app.route("/")
def index():
    return render_template("index.html", products=products_storage)


# Страница добавления товара
@app.route("/add_product", methods=["GET", "POST"])
def add_product():
    if request.method == "POST":
        name = request.form["name"]
        price = request.form["price"]
        if len(products_storage) < 50:
            products_storage.append(Product(name, price))
        return redirect(url_for("index"))
    return render_template("add_product.html")


# Страница для удаления товара
@app.route("/delete_product/<product_id>", methods=["POST"])
def delete_product(product_id):
    global products_storage
    products_storage = [
        product for product in products_storage if product.id != product_id
    ]
    return redirect(url_for("index"))


# Страница для создания заказа
@app.route("/create_order", methods=["GET", "POST"])
def create_order():
    if request.method == "POST":
        selected_products = request.form.getlist("products")
        products_in_order = [
            product for product in products_storage if product.id in selected_products
        ]
        if len(orders_storage) < 50:
            orders_storage.append(Order(products_in_order))
        return redirect(url_for("orders"))
    return render_template("create_order.html", products=products_storage)


# Страница для отображения заказов
@app.route("/orders")
def orders():
    return render_template("orders.html", orders=orders_storage)


# Страница для просмотра информации о товаре
@app.route("/view_product/<product_id>")
def view_product(product_id):
    product = next(
        (product for product in products_storage if product.id == product_id), None
    )
    return render_template("view_product.html", product=product)


# Страница с контактами
@app.route("/contacts")
def contacts():
    return render_template("contacts.html")


# API для получения списка товаров (GET)
@app.route("/api/products", methods=["GET"])
def get_products():
    return jsonify(
        [
            {"id": product.id, "name": product.name, "price": product.price}
            for product in products_storage
        ]
    )


# API для добавления товара (POST)
@app.route("/api/products", methods=["POST"])
def add_product_api():
    data = request.get_json()
    name = data.get("name")
    price = data.get("price")
    if len(products_storage) < 50:
        new_product = Product(name, price)
        products_storage.append(new_product)
        return (
            jsonify(
                {
                    "id": new_product.id,
                    "name": new_product.name,
                    "price": new_product.price,
                }
            ),
            201,
        )
    return jsonify({"error": "Product storage limit reached"}), 400


# API для обновления товара (PUT)
@app.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()
    product = next((prod for prod in products_storage if prod.id == product_id), None)
    if product:
        product.name = data.get("name", product.name)
        product.price = data.get("price", product.price)
        return jsonify({"id": product.id, "name": product.name, "price": product.price})
    return jsonify({"error": "Product not found"}), 404


# API для удаления товара (DELETE)
@app.route("/api/products/<product_id>", methods=["DELETE"])
def delete_product_api(product_id):
    global products_storage
    product = next((prod for prod in products_storage if prod.id == product_id), None)
    if product:
        products_storage = [prod for prod in products_storage if prod.id != product_id]
        return jsonify({"message": "Product deleted successfully"})
    return jsonify({"error": "Product not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
