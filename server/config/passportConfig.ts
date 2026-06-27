import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { dbFindUserByEmail, dbSaveUser } from "../utils/storageHelper.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${process.env.APP_URL || process.env.SERVER_URL || "https://mla-portal-server.onrender.com"}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) return done(new Error("No email from Google"), false);

                // Check if user already exists
                let user = await dbFindUserByEmail(email);

                if (user) {
                    // User exists - just login
                    return done(null, user);
                }

                // New user - create account (role will be 'citizen' by default unless it's the admin)
                const userEmail = email.toLowerCase().trim();
                const resolvedRole = userEmail === "shrmlaadmin@gmail.com" ? "admin" : "citizen";
                const newUser = await dbSaveUser({
                    name: profile.displayName,
                    email: userEmail,
                    mobile: "GOOGLE_AUTH",
                    password: "GOOGLE_OAUTH_NO_PASSWORD",
                    city: "Sholinghur",
                    village: "",
                    ward: "",
                    role: resolvedRole,
                    googleId: profile.id,
                });

                return done(null, newUser);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user._id || user.id);
});

passport.deserializeUser(async (id: string, done) => {
    const { dbFindUserById } = await import("../utils/storageHelper.js");
    const user = await dbFindUserById(id);
    done(null, user);
});

export default passport;