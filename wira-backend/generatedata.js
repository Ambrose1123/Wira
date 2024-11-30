import { faker } from '@faker-js/faker';  // import for Faker
import pkg from 'pg';  // Import the entire 'pg' module as a default export
import bcrypt from 'bcrypt';
import speakeasy from "speakeasy";

const { Client } = pkg;  // Extract the Client class from the 'pg' module
const client = new Client({
  user: 'postgres',  //username
  host: 'localhost',
  database: 'wira_dashboard', //the data base name created
  password: 'Ap79101123', //password for the database
  port: 5432,
});

// Number of salt rounds for password hashing
const SALT_ROUNDS = 5;

async function deleteAllData() {
  try {
    // Delete all records from character, scores, and account tables 
    await client.query('TRUNCATE TABLE scores, character, account RESTART IDENTITY CASCADE');
    console.log('All data deleted and sequences reset.');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

async function generateData() {
  try {
    await client.connect();

    // Call deleteAllData before generating new data
    await deleteAllData();

    // Insert a predefined test account
    console.log('Inserting test account...');
    const testUsername = 'Test123'; // Specify the username
    const testEmail = 'likai.phong@gmail.com'; // Specify the email
    const testPassword = 'abc123'; // Specify the plain-text password
    const encryptedPassword = await bcrypt.hash(testPassword, SALT_ROUNDS); // Hash the password
    const testSecretKey2FA = speakeasy.generateSecret({ length: 20 }).base32; // Generate secret key for 2FA

    const testAccountQuery = `
      INSERT INTO account (username, email, encrypted_password, secretkey_2fa)
      VALUES ('${testUsername}', '${testEmail}', '${encryptedPassword}', '${testSecretKey2FA}')
    `;
    await client.query(testAccountQuery);
    console.log('Test account created:');
    console.log(`  Username: ${testUsername}`);
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${testPassword}`);
    console.log(`  2FA Secret Key: ${testSecretKey2FA}`);
    // Generate 100,000+ accounts
    console.log('Generating accounts...');
    for (let i = 1; i < 100000; i++) {
      const username = faker.internet.username().substring(0, 10);  // call the username from faker and Truncate to 10 chars
      const email = faker.internet.email();  //call faker to generate email
      const plainTextPassword = faker.internet.password(); // Generate a random password
      const encryptedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS); // Hash the password
      const secretKey2FA = speakeasy.generateSecret({ length: 20 }).base32; // TOTP-compatible Base32 key

      const accountQuery = `
        INSERT INTO account (username, email, encrypted_password, secretkey_2fa)
        VALUES ('${username}', '${email}', '${encryptedPassword}', '${secretKey2FA}')
      `;
      await client.query(accountQuery);  // Insert account data

      if (i % 10000 === 0) console.log(`Generated ${i} accounts...`);  // Log progress
    }

    console.log('Accounts generated and inserted.');

    // Generate 8 characters for each account (with 8 different classes)
    console.log('Generating characters...');
    const accounts = await client.query('SELECT * FROM account');
    
    for (let i = 0; i < accounts.rows.length; i++) {
      const acc_id = accounts.rows[i].acc_id;

      // Create 8 characters, each with a unique class_id from 1 to 8
      const classIds = [1, 2, 3, 4, 5, 6, 7, 8];

      // Shuffle classIds array to randomize the assignment order
      for (let j = classIds.length - 1; j > 0; j--) {
        const randomIndex = Math.floor(Math.random() * (j + 1));
        [classIds[j], classIds[randomIndex]] = [classIds[randomIndex], classIds[j]];
      }

      // Insert characters for this account, ensuring each class_id is used exactly once
      for (let class_id of classIds) {
        const characterQuery = `
          INSERT INTO character (acc_id, class_id)
          VALUES (${acc_id}, ${class_id})
        `;
        await client.query(characterQuery);  // Insert character data
      }

      if (i % 10000 === 0) console.log(`Generated 8 characters for ${i} accounts...`);  // Log progress
    }

    console.log('Characters generated and inserted.');

    // Generate 800,000+ scores for each character
    console.log('Generating scores...');
    const characters = await client.query('SELECT * FROM character');
    for (let i = 0; i < characters.rows.length; i++) {
      const char_id = characters.rows[i].char_id;
      const reward_score = faker.number.int({ min: 0, max: 999999 }); //seting the reward score to be random from 0 to 1000000

      const scoreQuery = `
        INSERT INTO scores (char_id, reward_score)
        VALUES (${char_id}, ${reward_score})
      `;
      await client.query(scoreQuery);  // Insert score data

      if (i % 10000 === 0) console.log(`Generated scores for ${i} characters...`);  // Log progress
    }

    console.log('Scores generated and inserted.');

    await client.end();  // Close the connection
  } catch (error) {
    console.error('Error generating data:', error);
  }
}

generateData();
