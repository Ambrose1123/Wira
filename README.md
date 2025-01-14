## The WIRA Dashboard is a web application designed to manage accounts, characters, and scores while enabling secure login using two-factor authentication (2FA). The project consists of a frontend, backend, and database.

## Technologies Used
Frontend: Vue.js

Backend: Node.js (Express.js)

Database: PostgreSQL

Authentication: Speakeasy for 2FA, bcrypt for password hashing

Email Sending funciton: AWS SES 

Website Hoting Platform: AWS (frontend: S3, backend: EC2 , database: RDS)

## Before you start:

if you want to know how you can create the database and the backend server, please continue with the following steps. If you just want to see how this page will look like , just go to the website endppoint I created:

http://wira-frontend.s3-website-ap-southeast-2.amazonaws.com/login

## . Prerequisites: Ensure you have installed the required file:

Go to the wira-backend directory,
Install npm and node first, after pulling from this branch.

To check you have downloaded npm and node ,type :

npm -v, node -v, If downloaded it should return the version downloaded.

Later, Install everything that is needed with this command:

npm install

## Database Setup
Start PostgreSQL:

Ensure PostgreSQL is running locally

How? First go to any apps that could access to postGresDB for example I am using PgAdmin4, then use PgAdmin4 to create your acc and remember your password.

later, create the database with the proper command.

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

Later create a .env file in the backend folder, which should include your db details:

DATABASE_USER=postgres

DATABASE_PASSWORD=YOURPASSWORD

DATABASE_HOST=localhost( OR Your database host endpoint)

DATABASE_NAME=wira-dashboard (YOUR DATABASE NAME)

DATABASE_PORT=5432
## Data generating

Go to generatedata.js in wira-backend, make sure the details about your db is filled, This Part:

    const client = new Client({
    
    user: 'postgres',  //username
    
    host: 'localhost',
    
    database: 'wira_dashboard', //the data base name created
    
    password: 'Ap79101123', //password for the database
    
    port: 5432,
    
    });

then search for the section where there is:

    const testUsername = 'Test123'; // Specify the username
   
    const testEmail = 'youremail@gmail.com'; // Specify the email
    
    const testPassword = 'abc123'; // Specify the plain-text password

fill in your details for you to later test the log in function.

After that, type node generatedata.js to generate the data, you can switch the number you want to generate by changing the value the for loop goes through. For Instance, if you want 200000 account, then switch the 100000 in the for loop to 200000.

## Sending 2FA Email

Are you interested in generating an email that sends 2FA code? If yes follow these steps!

Go to AWS SES and log in to your AWS account if you dont have one, please sign one up.

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

Now your .env file should look like this:

AWS_ACCESS_KEY_ID=your-access-key-id

AWS_SECRET_ACCESS_KEY=your-secret-accesskey

AWS_REGION=ap-southeast-2

SENDER_EMAIL=your-email

DATABASE_USER=postgres

DATABASE_PASSWORD=yourpassword

DATABASE_HOST=localhost

DATABASE_NAME=wira-dashboard

DATABASE_PORT=5432

after generating go to the wira-backend directory and run the command:

node index.js

## Now the backend server is running!

First download any file that is required in front-end folder with :

npm install

IF: You are following the steps above and somehow get to this part and your backend server is running at http://localhost:3000, Please got to the wira-frontend folder and go to api.js, now change the base url to http://localhost:3000, this will ensure you that your front-end will connect to the actual backend server you have created.

Next, go to the wira-frontend directory and run the command:

npm run dev

## Now the frontend server is running!

now hold Control and click the link ( http://localhost:5173/), it should redirect you to the wira log in page.

## LOG IN

you can log in to see the wira rankings by using the test account you generated before. 

Log in with the correct email and password, later it will redirect you to a verify2FA section.

Now check the email you registered with, there should be a 6-digit code sent to you.

insert the 2FA input with the 6-digit code.(If it says invalid 2FAcode or the code is not sent please try again later, the free tier AWS SES system is not stable sometimes.)

After logging in, you can access to the rankings. Here you can search user by username, and you can sort the class you want to view.

On the bottom of the page should be the pagination section, here you can use the "previous" button to go back one page, "next" button will take you to the next page, and the rest of the page button will lead you to the pages that is on the button.

## LOG OUT

To log out, please go to the Top right corner and look for the log out button. For mobile, The log out button should be on the center and Under "Welcome to WIRA!"

### If you encounter any issues, feel free to view this video demo to have a better understanding of how this work:

## LINK: https://drive.google.com/drive/folders/1SjTMVaABp8qZScqpcAbqLGLnUxY2j1Io?usp=sharing

(The following website link is now closed, you may see the screenshot to see how the website looks):

Screenshot.md : https://github.com/Ambrose1123/Wira/blob/main/screenshot.md

## WEBSITE LINK : http://wira-frontend.s3-website-ap-southeast-2.amazonaws.com/login
