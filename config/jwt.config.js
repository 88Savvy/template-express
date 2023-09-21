import jwt from "jsonwebtoken";

export default function generateToken(user) {
   try {
      // Check if the user object is valid
      if (!user || !user._id || !user.name || !user.email) {
         throw new Error("Invalid user object");
      }

      // Token signature
      const signature = process.env.TOKEN_SIGN_SECRET;

      // Expiration time: 12 hours
      const expiration = "12h";

      // Generate and return the JWT token
      return jwt.sign(
         {
            // Payload: Information to store in the token
            _id: user._id,
            name: user.name,
            email: user.email,
         },
         signature, // Token signature
         {
            // Token configuration: Expiry time
            expiresIn: expiration,
         }
      );
   } catch (error) {
      console.error("Error generating token:", error);
      throw new Error("Token generation failed");
   }
}
