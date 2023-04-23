Vamos abrir una terminal en el root
vamos a instalar yarn en modo global 

npm install yard

en bash vamos a poner 
yarn global add yarn

luego vamos a configurar nuestro archivo de .env

PORT = 5000

NODE_ENV = DEVELOPMENT

MONGODB_URI='mongodb://127.0.0.1:27017/myapp'
FRONTEND_URL = "http://localhost:3000"
JWT_SECRET = 123456
JWT_EXPIRE_TIME = 7d
COOKIE_EXPIRE_TIME = 7
SMTP_HOST = s
SMTP_PORT =
SMTP_USER =
SMTP_PASS =
SMTP_FROM_EMAIL =
SMTP_FROM_NAME =
STRIPE_SECRET_KEY ="sk_test_51MzyLiFZbOv3UWebrKz7SxBI9J7A1Iu7buV9gAmouNe9rYM7O1JNZuC4gbGnMNW8EK0Q9puy82EX3f4i0yXzimTY00knLIUnDb"
STRIPE_API_KEY ="pk_test_51MzyLiFZbOv3UWebDHs64ScHbx9aGneuYVCEt3lyS7cwNjXPVXpb2ITOIl8ysQWbjSlKMIDoShPrR0OqHU4ADEoK00BXZJhfwH"
CLOUDINARY_CLOUD_NAME = "dy90we6rp"
CLOUDINARY_API_KEY = "895284991652975"
CLOUDINARY_API_SECRET = "m_B9kAUntarnnUV_TUmlRlnTnGc"
SENDER_EMAIL_ADDRESS =
OAUTH_CLIENT_ID =
OAUTH_CLIENT_SECRET =
OAUTH_REFRESH_TOKEN =

Vamos a instalar las dependencias con yard install

EN LA CARPETA ROOT

"yard install"

Iniciamos nuestro server con 

"yarn run dev"


abrimos otra terminal aparte
hacemos un cd a la carpeta frontend

cd frontend

yarn install

luego iniciamos el cliente 

yarn run start



cuando creamos nuestro usuario
vamos a darle el rol en dentro de la coleccion en la base de datos de mongo

Myapp > Users > elegimos nuestro usuario

EJEMPLO

{
  "_id": {
    "$oid": "6444e42f3dafa74623f8e50f"
  },
  "name": "lucas",
  "email": "lucas@gmail.com",
  "password": "$2a$10$2MyY/lHzvBwq6CN3ibFZG.Bzv4pNY/ycoOollWJ.fWIHz0ZrqB/9.",
  "avatar": {
    "public_id": "shop/users/to50kbcd3wvkwhlxoa4l",
    "url": "https://res.cloudinary.com/dy90we6rp/image/upload/v1682237216/shop/users/to50kbcd3wvkwhlxoa4l.png"
  },
  "role": "admin", <<<<<<< CAMBIAMOS EL ROL DE USER A ADMIN
  "createdAt": {
    "$date": "2023-04-23T07:54:23.279Z"
  },
  "__v": 0
}

guardamos los cambios refrescamos la pagina y listo ya esta en modo admin 

en el dashboard o monitor en la parte de productos podemos agregar productos
editarlos y borrarlos

cuando compramos un producto

cuando llegamos a la parte del pago 
nos solicitara una tarjeta de credito

ustilizaremos este

4545 4545 4545 4545

03/28

123





