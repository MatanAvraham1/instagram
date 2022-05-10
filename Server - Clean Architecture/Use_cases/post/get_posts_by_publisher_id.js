function buildGetPostsByPublisherId({ PostsDB, Id, AppError }) {
    return async function getPostsByPublisherId({ publisherId }) {

        if (!Id.isValid(publisherId)) {
            throw new AppError("Can't get posts by invalid publisher id.")
        }

        return await PostsDB.findByPublisher(publisherId)
    }
}

module.exports = { buildGetPostsByPublisherId }