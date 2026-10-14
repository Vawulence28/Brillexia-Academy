const authService = require('./auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      const data = await authService.login(email, password, ipAddress, userAgent);

      // Set secure HTTP-only cookie for token transport if desired
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        accessToken: data.accessToken,
        user: data.user
      });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userProfile = await authService.getProfile(req.user.userId);
      res.status(200).json({ success: true, data: userProfile });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();