## The WIRA Dashboard is a web application designed to manage accounts, characters, and scores while enabling secure login using two-factor authentication (2FA). The project consists of a frontend, backend, and database.

## Technologies Used
Frontend: Vue.js

Backend: Node.js (Express.js)

Database: PostgreSQL

Authentication: Speakeasy for 2FA, bcrypt for password hashing

Email Sending funciton: AWS SES 

Website Hoting Platform: AWS (frontend: S3, backend: EC2 , database: RDS)

## . Prerequisites: Ensure you have the following installed:
Node.js

PostgreSQL

bcrypt

vue router

node mailer

speakeasy

npm

redis(for caching)

vue js
## Tutorial on Redis

Install redis

How to Run the redis server with Docker ? Type:

docker run --name redis-server -d -p 6379:6379 redis

To test If redis is working:

docker exec -it redis redis-cli

PING

It should Return PONG

## Database Setup
Start PostgreSQL:

Ensure PostgreSQL is running locally

How? First go to any apps that could access to postGresDB for example I used PgAdmin4, then create your acc and remember your password.

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

In wira-backend, search for db.js and fill in your postgresdb details(you only need to change it to your database name and your DB password).

Go to generatedata.js in wira-backend, make sure the details about your db is filled, then search for the section where there is:

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

NEW:

1. Using GIN will be faster so:

 CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_username 
ON account USING gin (username gin_trgm_ops);

Cache: node cache

npm install node-cache

npm install aws-sdk
npm install @aws-sdk/client-ses

You can test if your email signed up with aws is working by testing with 
node email.js
npm install dotenv

1. Set Up AWS Credentials
Step 1: Access the IAM Console
Go to the AWS Management Console.
Search for and open IAM (Identity and Access Management).
Step 2: Create a New IAM User
In the IAM Dashboard:
Click Users > Add User.
Enter a username (e.g., ses-user).
Select Programmatic Access (to generate an Access Key and Secret Key).
Step 3: Attach Permissions
Attach the policy: AmazonSESFullAccess to the new user.
This gives the user permission to send emails with SES.
Click Next and Create User.
Step 4: Retrieve Access Keys
Once the user is created, you’ll get:
Access Key ID (e.g., AKIAIOSFODNN7EXAMPLE)
Secret Access Key (e.g., wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY)
Save these securely. You won’t be able to see the Secret Key again.
2. Set Up Amazon SES
Step 1: Verify the Sender Email
Go to the Amazon SES Console in your AWS account:
Navigate to Verified Identities > Create Identity.
Select Email Address and enter the email you want to use as the sender (e.g., noreply@yourdomain.com).
Click Create.
Step 2: Verify the Email
Amazon will send a verification email to the specified email address.
Open the email and click the verification link.
3. Select Your AWS Region
Choose a region where SES is available (e.g., us-east-1).

4. Add Credentials to .env File
Create or update your .env file with the following:

AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_REGION=ap-southeast-2
SENDER_EMAIL=your-verified-email@example.com

npm install @fortawesome/fontawesome-free
