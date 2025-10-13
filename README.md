# Expense REST API

Простий REST API (in-memory): users, categories, records.  
Як запустити локально і протестувати — нижче.

## Локальний запуск
```bash
npm i
npm run dev
```

### Базовий URL

Local: http://localhost:3000
Production: https://lab2maliy.onrender.com

### Ендпоінти

GET /user/:user_id

DELETE /user/:user_id

POST /user

GET /users

GET /category

POST /category

DELETE /category?category_id=ID

GET /record/:record_id

DELETE /record/:record_id

POST /record

GET /record?user_id=&category_id= (потрібен хоча б один параметр)

### Postman

Колекція: postman/collection.json

Env vars: baseUrl