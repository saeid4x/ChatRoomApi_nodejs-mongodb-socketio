const jwt = require('jsonwebtoken');
const TokenService = require('../../application/services/token.service');

// This is the concrete implementation of the TokenService contract using the 'jsonwebtoken' library.
class JwtService extends TokenService {
    constructor(accessSecret, refreshSecret, accessExpiresIn, refreshExpiresIn) {
        super();
        this.accessSecret = accessSecret;
        this.refreshSecret = refreshSecret;
        this.accessExpiresIn = accessExpiresIn;
        this.refreshExpiresIn = refreshExpiresIn;
    }

    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, this.accessSecret, { expiresIn: this.accessExpiresIn });
        const refreshToken = jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshExpiresIn });
        return { accessToken, refreshToken };
    }

    // --- THIS METHOD WAS MISSING ---
    // It verifies the access token.
    async verifyAccessToken(token) {
        // The `jwt.verify` function is synchronous by default but can be used with a callback.
        // We wrap it in a Promise for async/await consistency.
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.accessSecret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }

    // --- THIS METHOD WAS ALSO MISSING ---
    // It verifies the refresh token.
    async verifyRefreshToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.refreshSecret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }
}

module.exports = JwtService;