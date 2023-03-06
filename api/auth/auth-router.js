// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const User = require("../users/users-model");
const router = require("express").Router();
const mw = require("./auth-middleware");

router.post(
  "/register",
  mw.sifreGecerlimi,
  mw.usernameBostami,
  async (req, res, next) => {
    try {
      const data = await User.ekle(req.body);
      if (data) {
        return res.status(201).json(data);
      } else next({ status: 400, message: "Kayıt olusturulamadı" });
    } catch (error) {
      next(error);
    }
  }
);
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post("/login", mw.usernameVarmi, (req, res, next) => {
  const { password } = req.body;
  if (req.user.password === password) {
    req.session.user = req.user;
    return res.status(200).json({ message: `Hoşgeldin ${req.user.username}` });
  } else {
    return res.status(401).json({
      message: "Geçersiz kriter!",
    });
  }
});
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.get("/logout", (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(200).json({
        message: "Oturum bulunamadı!",
      });
    }
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        return res.status(200).json({
          message: "Çıkış yapildi",
        });
      }
    });
  } catch (error) {
    next(error);
  }
});
/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;
