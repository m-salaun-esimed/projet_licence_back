const jwt = require('jsonwebtoken')
var jwtKey = process.env.GRAIN_DE_SEL

if (jwtKey === undefined) {
    const { env } = process;
    const read_base64_json = function(varName) {
        try {
            return JSON.parse(Buffer.from(env[varName], "base64").toString())
        } catch (err) {
            throw new Error(`no ${varName} environment variable`)
        }
    };
    const variables = read_base64_json('PLATFORM_VARIABLES')
    jwtKey = variables["GRAIN_DE_SEL"]
}

const jwtExpirySeconds = 36000

module.exports = (userAccountService) => {
    return {
        validateJWT(req, res, next) {
            if (req.headers.authorization === undefined) {
                res.status(401).end();
                return;
            }

            const token = req.headers.authorization.split(" ")[1];

            jwt.verify(token, jwtKey, { algorithm: "HS256" }, async (err, user) => {
                if (err) {
                    console.error('Erreur lors de la vérification du token :', err.message);
                    return res.status(401).end();
                }

                console.log('Token vérifié avec succès. Utilisateur associé :', user);

                try {
                    req.user = await userAccountService.dao.getByLogin(user.login);
                    return next();
                } catch (e) {
                    console.error('Erreur lors de la récupération de l\'utilisateur :', e.message);
                    res.status(401).end();
                }
            });
        },
        generateJWT(login) {
            return jwt.sign({login}, jwtKey, {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds
            })
        },

        authenticateToken(req, res, next) {
            const token = req.header('Authorization');
            if (!token) return res.sendStatus(401);

            jwt.verify(token.split(' ')[1], jwtKey, (err, user) => {
                if (err) return res.sendStatus(403);
                req.user = user;
                next();
            });
        }
    }
}