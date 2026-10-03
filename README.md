# Toys Management API (REST API)

## הרצה מקומית
1. התקנת החבילות: `npm install`
2. הרצת השרת: `node app.js`

## API Endpoints

### USERS
* **POST `/users`** - הרשמת משתמש חדש במערכת (סיסמה מוצפנת ב-BCRYPT).
* **POST `/users/login`** - התחברות וקבלת Token אבטחה ב-Body.

### TOYS
* **GET `/toys`** - שליפת כל הצעצועים (10 בעמוד, תומך ב-`?skip=`).
* **GET `/toys/search`** - חיפוש צעצוע לפי שם או מידע (`?s=...`).
* **GET `/toys/category/:catname`** - שליפת צעצועים לפי שם קטגוריה.
* **GET `/toys/prices`** - שליפת צעצועים לפי טווח מחירים (`?min=10&max=40`).
* **GET `/toys/single/:id`** - שליפת צעצוע בודד לפי ה-ID שלו.
* **GET `/toys/count`** - קבלת מספר הרשומות הכללי בקולקשן.
* **POST `/toys` 🔒** - הוספת צעצוע (מחייב Token ב-Header תחת `x-api-key`).
* **PUT `/toys/:EDITID` 🔒** - עריכת צעצוע (רק למשתמש שהוסיף אותו).
* **DELETE `/toys/:DELID` 🔒** - מחיקת צעצוע (רק למשתמש שהוסיף אותו).
