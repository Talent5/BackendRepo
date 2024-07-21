const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { EnviromentVariables } = require('./config/EnvironmentVariables');
const userModel = require('./model/userModel');
passport.use(new GoogleStrategy({
    clientID: EnviromentVariables.GOOGLE_CLIENT_ID,
    clientSecret: EnviromentVariables.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    userModel.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
            return done(null, existingUser);
        } else {
            const newUser = new userModel({
                googleId: profile.id,
                email: profile.emails[ 0 ].value
            });

            newUser.save();
        }
    })
        .then(user => done(null, user))
        .catch(err => done(err));

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(null, user);
    });
});