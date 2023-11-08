const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { config } = require('../config/config');

router.post("/register", passport.authenticate("signupLocalStrategy", {
    failureRedirect: "/failed-signup"
}), async (req, res) => {
    res.render("login", { message: "Usuario Registrado Correctamente" });
});

router.get("/signup-github", passport.authenticate("signupGithubStrategy"));

router.get(config.github.callbackUrl, passport.authenticate("signupGithubStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), (req, res) => {
    res.redirect("/");
});

router.get("/fail-signup", (req, res) => {
    res.render("register", { error: "No pudiste registrarte correctamente" });
});

router.post("/login", passport.authenticate("loginLocalStrategy", { failureRedirect: "/api/sessions/fail-login" }), async (req, res) => {
    res.redirect("/");
});

router.get("/fail-login", (req, res) => {
    res.render("login", { error: "No pudiste iniciar sesión correctamente" });
})

router.get("/logout", async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) return res.render("profile", { error: "No se pudo cerrar la sesion" });
            res.redirect("/");
        });
    } catch (error) {
        res.render("profile", { error: "No se pudo cerrar la sesion" });
    }
});

module.exports = {
    sessionsRouter: router
};
