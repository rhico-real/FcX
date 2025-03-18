const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

passport.serializeUser ((user, done) => {
    done(null, user.id);
});

passport.deserializeUser ((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((existingUser ) => {
        if (existingUser ) {
            done(null, existingUser );
        } else {
            new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            }).save().then((newUser ) => {
                done(null, newUser );
            });
        }
    });
}));