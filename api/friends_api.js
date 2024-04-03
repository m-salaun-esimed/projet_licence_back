module.exports = (app, friends_service, jwt) => {
    app.post("/addFriend", jwt.validateJWT,  async (req, res) => {
        try {
            const { idUser } = req.body;
            if (idUser === undefined || req.user === undefined || idUser === req.user.id) {
                res.status(400).end();
                return;
            }

            const dataNotification = {
                sender_id : req.user.id,
                receiver_id: idUser,
                notification_type: "friend_request",
                notification_message: "Demande d'ajout",
                created_at : new Date(),
                is_read : false
            };

            const responseNotif = await friends_service.dao.insertNotification(dataNotification);
            const newNotificationId = responseNotif;

            const dataFriend = {
                sender_id : req.user.id,
                receiver_id: idUser,
                status : "pending",
                sent_at : new Date(),
                accepted_at : null,
                notification_id : newNotificationId
            };

            const responseFriend = await friends_service.dao.insertFriend(dataFriend);
            res.json(responseFriend);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de l ajout' });
        }
    });


    app.get("/getFriendsRequests", jwt.validateJWT, async (req, res) => {
        try {
            const data = await friends_service.dao.getFriendsRequests(req.user.id);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/notification", jwt.validateJWT, async (req, res) => {
        try {
            const data = await friends_service.dao.getNotification(req.user.id);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });


}
