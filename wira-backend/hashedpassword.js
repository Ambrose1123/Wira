import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

//THIS IS FOR TESTING THE LOGIN FUNCTION IS WORKING

const generatePasswordHash = async (password) => {
  const saltRounds = 5;
  return await bcrypt.hash(password, saltRounds);
};

const password = "123456789";
generatePasswordHash(password).then((hash) => {
  console.log("Generated Hash:", hash);
});

const secret = "PFDGYNDQOM3HMY3VLYVGWYKANNLWGY3B";
// Generate TOTP code
const token = speakeasy.totp({
  secret: secret,
  encoding: "base32",
});

console.log("Generated TOTP code:", token);
