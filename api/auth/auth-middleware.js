const User = require("../users/users-model");

/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
async function sinirli(req, res, next) {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        message: "Geçemezsiniz!",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function usernameBostami(req, res, next) {
  try {
    const { username } = req.body;
    console.log(username);
    const data = await User.goreBul({ username }).first();
    if (data) {
      return res.status(422).json({
        message: "Username kullaniliyor",
      });
    } else {
      next();
    }
  } catch (error) {}
}

async function usernameVarmi(req, res, next) {
  try {
    const { username, password } = req.body;
    const data = await User.goreBul({ username }).first();
    if (!data) {
      return res.status(401).json({
        message: "Geçersiz kriter",
      });
    } else {
      req.user = data;
      next();
    }
  } catch (error) {
    next(error);
  }
}

function sifreGecerlimi(req, res, next) {
  try {
    const { password } = req.body;
    if (!password || password.length < 3) {
      return res.status(422).json({
        message: "Şifre 3 karakterden fazla olmalı",
      });
    } else {
      next();
    }
  } catch (error) {}
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = { sinirli, usernameBostami, sifreGecerlimi, usernameVarmi };
