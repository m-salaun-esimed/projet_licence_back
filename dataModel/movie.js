module.exports = class MovieModel {
    constructor(name, idStreamingPlatform, idCategorys, nameFilmMaker, date, description, moyenneNote, type ) {
        this.name = name
        this.idStreamingPlatform = idStreamingPlatform
        this.idCategorys = idCategorys
        this.nameFilmMaker = nameFilmMaker
        this.date = date
        this.description = description
        this.moyenneNote = moyenneNote
        this.type = type
    }
}