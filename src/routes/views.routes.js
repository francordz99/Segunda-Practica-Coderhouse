const express = require('express');
const router = express.Router();
const { usersModel } = require('../../dao/models/usersModel.js');

router.get("/home", (req, res) => {
    if (req.session.email) {
        const userEmail = req.session.email;
        res.render("home", { userEmail });
    } else {
        res.redirect("/login");
    }
});

router.get("/products", (req, res) => {
    res.render("products");
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get("/contact", (req, res) => {
    res.render("contact");
});

router.get("/register", (req, res) => {
    if (req.session.email) {
        return res.redirect("/profile");
    }
    res.render("register");
});

router.get("/login", (req, res) => {
    if (req.session.email) {
        return res.redirect("/profile");
    }
    res.render("login");
});

router.get("/profile", (req, res) => {
    console.log(req.user);
    if (req.user.email) {
        const userEmail = req.user.email;
        res.render("profile", { userEmail });
    }
    else {
        res.redirect("/login");
    }
});

router.get("/admin", async (req, res) => {
    const userEmail = req.session.email;
    console.log(userEmail);
    const user = await usersModel.findOne({ email: userEmail });
    console.log(user);
    if (user.rol === 'administrador') {
        const rol = user.rol;
        res.render("admin", { rol });
    } else {
        res.status(403).send('Acceso prohibido: No eres administrador');
    }
});

module.exports = {
    viewsRouter: router
};

