
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

    app.get("/user/IdByLogin", jwt.validateJWT, async (req, res) => {
        try {
            const { login } = req.headers
            if(login === undefined){
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
            }
            const data = await userService.dao.getIdUser(login);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/user/searchdisplaynames", jwt.validateJWT, async (req, res) => {
        try {
            const { recherche } = req.headers
            const data = await userService.dao.searchdisplaynames(recherche);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/user/IdByDisplayName", async (req, res) => {
        try {
            const { displayname } = req.headers
            console.log(displayname)
            const data = await userService.dao.getIdUserByDisplayName(displayname);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/user/displaynamebyid", jwt.validateJWT, async (req, res) => {
        try {
            const { iduser } = req.headers
            if(iduser === undefined){
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
            }
            console.log(iduser)
            const data = await userService.dao.getdisplaynamebyid(iduser);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/user/refreshtoken", jwt.validateJWT, (req, res) => {
        res.json({'token': jwt.generateJWT(req.user.login)})
    });

    app.get("/user/estAdmin", jwt.validateJWT, async (req, res) => {
        try {
            const { iduser } = req.headers
            if(iduser === undefined){
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
            }
            console.log(iduser)
            const data = await userService.dao.getEstAdmin(iduser);
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

    app.post('/api/verifyToken', jwt.validateJWT, (req, res, next) => {
        res.json({ status: 200, data: 'Token valide' });
    }, (req, res) => {
    });

    app.delete("/user", jwt.validateJWT, async (req, res) => {
        try {
            const { login } = req.headers;

            if (!login) {
                return res.status(400).json({ error: 'Erreur dans les données envoyées à la requête' });
            }

            let result = await userService.dao.deleteUser(login);
            if (!result || result.rowCount === 0) {
                return res.status(404).json({ error: 'User non trouvée.' });
            }

            res.status(200).json({ message: 'User supprimée avec succès.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression du User.' });
        }
    });
}
