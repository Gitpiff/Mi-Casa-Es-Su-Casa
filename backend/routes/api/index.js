// backend/routes/api/index.js
const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  }
);

//Get /api/set-token-cookie
const { User } = require('../../db/models');

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-Lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user })
});

//Get /api/restore-user
router.use(restoreUser);

router.get('/restore-user', (req, res) => {
  return res.json(req.user)
});

//Get /api/require-auth
router.get('/require-auth', requireAuth, (req, res) => {
  return res.json(req.user);
});



module.exports = router;