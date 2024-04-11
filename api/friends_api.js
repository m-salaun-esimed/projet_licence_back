module.exports = (app, friends_service, userService, jwt) => {
    app.post("/friend/add", jwt.validateJWT,  async (req, res) => {
        try {
            const { idUser } = req.body;
            if (idUser === undefined || req.user === undefined) {
                res.status(404).json({ error: 'Erreur dans les données envoyées à la requête' });
                return;
            }
            if (idUser === req.user.id) {
                res.status(422).json({ error: 'Vous ne pouvez pas vous ajouter vous-même comme ami.' });
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


    app.get("/friend/requestsSend", jwt.validateJWT, async (req, res) => {
        try {
            const data = await friends_service.dao.getFriendsRequestsSend(req.user.id);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/friend/requestsReceived", jwt.validateJWT, async (req, res) => {
        try {
            const data = await friends_service.dao.getFriendsRequestsReceived(req.user.id);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.get("/friend/notification", jwt.validateJWT, async (req, res) => {
        try {
            const { idnotification } = req.headers;
            const data = await friends_service.dao.getNotification(idnotification);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.put("/friend/validerNotification", jwt.validateJWT, async (req, res) => {
        try {
            const { friendrequestid, notificationid } = req.body;
            console.log("friendrequestid : " + friendrequestid)
            await friends_service.dao.validerDemande(friendrequestid);

            console.log("notificationId : " + notificationid)
            await friends_service.dao.validerNotification(notificationid);

            res.json({ message: 'Demande d\'ami validée avec succès.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la validation de la demande d\'ami.' });
        }
    });

    app.put("/friend/rejeterNotification", jwt.validateJWT, async (req, res) => {
        try {
            const { friendrequestid, notificationid } = req.body;
            console.log("friendrequestid : " + friendrequestid)
            await friends_service.dao.rejeterDemande(friendrequestid);

            console.log("notificationId : " + notificationid)
            await friends_service.dao.validerNotification(notificationid);

            res.json({ message: 'Demande d\'ami validée avec succès.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la validation de la demande d\'ami.' });
        }
    });

    app.get("/friend/friends", jwt.validateJWT, async (req, res) => {
        try {
            const friendIds  = await friends_service.dao.getAmi(req.user.id);

            const displayNames = [];

            for (const friendId of friendIds) {
                const displayName = await userService.dao.getdisplaynamebyid(friendId);
                displayNames.push(displayName);
            }
            res.json(displayNames);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });

    app.delete("/friend/deleteFriends", jwt.validateJWT, async (req, res) => {
        try {
            console.log(req.body)
            const idfriend  = req.body.idfriend;
            const data = await friends_service.dao.deleteFriend(idfriend, req.user.id);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
        }
    });
}
