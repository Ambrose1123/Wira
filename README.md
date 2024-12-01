## The WIRA Dashboard is a web application designed to manage accounts, characters, and scores while enabling secure login using two-factor authentication (2FA). The project consists of a frontend, backend, and database.

## Technologies Used
Frontend: Vue.js
Backend: Node.js (Express.js)
Database: PostgreSQL
Authentication: Speakeasy for 2FA, bcrypt for password hashing

## . Prerequisites: Ensure you have the following installed:
Node.js
Docker
PostgreSQL
Nginx
bcrypt
vue router
node mailer
speakeasy
npm
redis(for caching)
vue js

Database Setup
Start PostgreSQL:

Ensure PostgreSQL is running locally
How? In wira-backend, search for db.js and fill in your postgresdb details.

later create the database 
for example: CREATE DATABASE wira_dashboard;
Next, create the tables with the queries.
for example:
CREATE TABLE Account (
    acc_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    secretkey_2fa VARCHAR(255) NOT NULL
);

CREATE TABLE Character (
    char_id SERIAL PRIMARY KEY,
    acc_id INT REFERENCES Account(acc_id),
    class_id INT NOT NULL
);

CREATE TABLE Scores (
    score_id SERIAL PRIMARY KEY,
    char_id INT REFERENCES Character(char_id),
    reward_score INT NOT NULL
);

CREATE TABLE Session (
    session_id SERIAL PRIMARY KEY,
    session_metadata JSONB NOT NULL,
    expiry_datetime TIMESTAMP NOT NULL
);

## Data generating

go to generatedata.js in wira-backend, make sure the details about your db is filled, then search for the section where there is:
    const testUsername = 'Test123'; // Specify the username
    const testEmail = 'youremail@gmail.com'; // Specify the email
    const testPassword = 'abc123'; // Specify the plain-text password
fill in your details for you to later test the log in function.

After that, type node generatedata.js to generate the data, you can switch the number you want to generate by changing the value the for loop goes through. For Instance, if you want 200000 account, then switch the 100000 in the for loop to 200000.

after generating go to the wira-backend directory and run the command:
node index.js
## Now the backend server is running!

Next, go to the wira-frontend directory and run the command:
npm run dev

## Now the frontend server is running!

now hold Control and click the link ( http://localhost:5173/), it should redirect you to the wira log in page.

## LOG IN

you can log in to see the wira rankings by using the test account you generated before. 
Log in with the correct email and password, later it will redirect you to a verify2FA section.
Now check the email you registered with, there should be a 6-digit code sent to you.
insert the 2FA input with the 6-digit code.(If it says invalid 2FAcode Eventhough It is correct, please go back and log in again,this is a bug that I didnt get to fix before submitting)

After logging in, you can access to the rankings. Here you can search user by username, and you can sort the class you want to view.
On the bottom of the page should be the pagination section, here you can use the "previous" button to go back one page, "next" button will take you to the next page, and the rest of the page button will lead you to the pages that is on the button.

## LOG OUT

To log out, please go to the Top right corener and look for the log out button. For mobile, The log out button should be on the center and Under "Welcome to WIRA!"

### If you encounter any issues, feel free to view this video demo to have a better understanding of how this work:

## LINK: https://drive.google.com/drive/folders/1SjTMVaABp8qZScqpcAbqLGLnUxY2j1Io?usp=sharing