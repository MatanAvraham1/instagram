const path = require('path')
const fs = require('fs')
const { POSTS_PHOTOS_FOLDER } = require('../../Constants')

function buildMakePost({ Id, Location, PhotosChecker, TextChecker, AppError, AppErrorMessages, UsersDB, PostsDB }) {

    return async function makePost({ publisherId, photos, publisherComment = null, location = null, taggedUsers = [] }) {
        try {
            if (!Id.isValid(publisherId)) {
                throw new AppError(AppErrorMessages.invalidPublisherId)
            }

            if (!(await UsersDB.doesUserExist({ userId: publisherId }))) {
                throw new AppError(AppErrorMessages.publisherDoesNotExist)
            }

            if (!Location.isValid(location)) {
                throw new AppError(AppErrorMessages.invalidLocation)
            }

            if (!Array.isArray(taggedUsers)) {
                throw new AppError(AppErrorMessages.invalidTaggedUser)
            }
            for (const taggedUser of taggedUsers) {
                if (!Id.isValid(taggedUser)) {
                    throw new AppError(AppErrorMessages.invalidTaggedUser)
                }

                if (!(await UsersDB.doesUserExist({ userId: taggedUser }))) {
                    throw new AppError(AppErrorMessages.unexistTaggedUser)
                }
            }


            for (const photo of photos) {
                if (!PhotosChecker.isValid(photo)) {
                    throw new AppError(AppErrorMessages.InvalidPhoto)
                }
            }


            if (publisherComment != null) {
                if (!TextChecker.isValid(publisherComment)) {
                    throw new AppError(AppErrorMessages.invalidPublisherComment)
                }
            }

        }
        catch (error) {
            // Becuase this function has been failed the post model has not been updated in the
            // db, but the post.photos files has been saved to the postsPhotosFolder becuase the multer package
            // do that automatically. so we have to delete the new post.photos files because it just takes place in disk memory

            // TODO: replace with PostsDB.deletePhotos()
            try {
                await Promise.all(
                    photos.map(
                        file =>
                            new Promise(async (res, rej) => {
                                const filePath = path.join(POSTS_PHOTOS_FOLDER, file)
                                fs.unlink(filePath, err => {
                                    if (err) {
                                        rej(`${filePath} post photo can't be deleted!`);
                                    }
                                    else {
                                        res();
                                    }
                                });

                                // // Will avoid errors when in example the first photo has been deleted
                                // // but the second photo throw error, so on the on the next func call it will try to delete the first 
                                // // photo but it will throw an error because the first photo has been already deleted and it will create a loop 
                                // await postModel.findByIdAndUpdate(postId, { $pull: { photos: file } })
                            }) // TODO: check that
                    )
                )

            }
            catch (error) {
                console.error(error) // when file can't be deleted
            }

            throw error
        }


        return Object.freeze({
            publisherId: publisherId,
            taggedUsers: taggedUsers,
            photos: photos,
            location: location,
            publisherComment: publisherComment,
            id: Id.generate(),
            createdAt: Date.now(),

            comments: 0,
            likes: 0,
        })
    }
}

module.exports = { buildMakePost }