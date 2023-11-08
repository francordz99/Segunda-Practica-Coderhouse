const passport = require('passport');
const localStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const GithubStrategy = require('passport-github2');
const { config } = require('../config/config');
const { usersModel } = require('../../dao/models/usersModel.js');

const createHash = (password) => {
    return bcrypt.hashSync(password, 10);
};

const isPasswordValid = (contrasena, user) => {
    return bcrypt.compareSync(contrasena, user.contrasena);
}

const initializePassport = () => {
    passport.use("signupLocalStrategy", new localStrategy({
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "contrasena",
    }, async (req, username, password, done) => {
        const { nombre } = req.body;
        try {
            const user = await usersModel.findOne({ email: username });
            if (user) {
                // Usuario preexistente
                return done(null, false);
            }
            const newUser = new usersModel({
                nombre,
                email: username,
                contrasena: createHash(password),
            });
            console.log(newUser);
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
    });

    passport.use("loginLocalStrategy", new localStrategy({
        usernameField: "email",
        passwordField: "contrasena",
    }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username });
            if (!user) {
                return done(null, false);
            }
            if (!isPasswordValid(password, user)) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
    );

    passport.use("signupGithubStrategy", new GithubStrategy(
        {

            clientID: config.github.clientId,

            clientSecret: config.github.clientSecret,

            callbackURL: `http://localhost:8080/api/sessions${config.github.callbackUrl}`

        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("profile", profile);
                const user = await usersModel.findOne({ email: profile.username });
                if (user) {
                    return done(null, user);
                }
                const newUser = new usersModel({
                    nombre: profile._json.name,
                    email: profile.username,
                    contrasena: createHash(profile.id),
                });
                console.log(newUser);
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error);
            };
        }
    ));

};

module.exports = {
    initializePassport
};