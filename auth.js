const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { EnviromentVariables } = require('./config/EnvironmentVariables');
const userModel = require('./model/userModel');
// https://somaai.onrender.com/auth/google/callback
passport.use(new GoogleStrategy({
    clientID: EnviromentVariables.GOOGLE_CLIENT_ID,
    clientSecret: EnviromentVariables.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://somaai.onrender.com/auth/google/callback',
    passReqToCallback: true
}, async (req, res, accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await userModel.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        const
            newUser = new userModel({
                googleId: profile.id,
                email: profile.emails[ 0 ].value
            });

        await newUser.save();  // Use await for asynchronous operations
        done(null, newUser);
    } catch (err) {
        console.error(err);
        done(err);
    }

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});