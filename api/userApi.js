
module.exports = (app, userService, jwt) => {
    app.get("/user", async (req, res) => {
        try {
            const data = await userService.dao.getAllUsers();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.post('/user/authenticate', (req, res) => {
        try{
            const { login, password } = req.body
            if ((login === undefined) || (password === undefined)) {
                res.status(400).end()
                return
            }

            userService.validatePassword(login, password)
                .then(authenticated => {
                    if (!authenticated) {
                        res.status(401).end()
                        return
                    }
                    res.json({'token': jwt.generateJWT(login), 'user': login})
                })
                .catch(e => {
                    console.log(e)
                    res.status(500).end()
                })
        }catch (e){
            throw(e);
        }
    })

    app.post('/user/createAccount', async (req, res) => {
        try {
            const { displayName, login, password} = req.body;

            if (!displayName || !login || !password) {
                res.status(400).end();
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(password)) {
                res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.' });
                return;
            }

            try {
                const authenticated = await userService.validateCreationCompte(displayName, login);

                if (authenticated) {
                    res.status(400).json({ error: 'Le Pseudo ou le login existe déjà' });
                    return;
                }

                const data = {
                    displayName : displayName,
                    login: login,
                    password : password,
                    admin : false
                };

                await userService.insertService(data);

                res.json({ 'token': jwt.generateJWT(login) });
            } catch (error) {
                console.error(error);
                res.status(500).end();
            }
        } catch (error) {
            console.error(error);
            res.status(500).end();
        }
    });

    app.post('/api/verifyToken', (req, res, next) => {
        jwt.validateJWT(req, res, (err) => {
            if (err) {
                console.error('La validation JWT a échoué :', err);
                res.status(401).end();
            } else {
                console.log('La validation JWT a réussi, passons au gestionnaire de route suivant.');
                next();
            }
        });
    }, (req, res) => {
        res.json({ status: 200, data: 'Token valide' });
    });
}
