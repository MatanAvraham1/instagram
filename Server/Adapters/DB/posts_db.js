const { default: mongoose } = require("mongoose")
const { AppError, AppErrorMessages } = require("../../app_error")
const { CommentsDB } = require("./comments_db")
const { postModel } = require("./schemes/post_scheme")
const { userModel } = require("./schemes/user_scheme")
const fs = require('fs')
const { POSTS_PHOTOS_FOLDER } = require("../../Constants")
const e = require("express")
const path = require("path")

class PostsDB {
    static async insert(post) {
        // Insert post
        const postObject = new postModel({
            _id: post.id,

            publisherId: post.publisherId,
            taggedUsers: post.taggedUsers,
            photos: post.photos,
            publisherComment: post.publisherComment,
            location: post.location,

            likes: [],

            likesCount: 0,
            commentsoCount: 0,

            createdAt: post.createdAt
        })
        await postObject.save()
        await userModel.findByIdAndUpdate(post.publisherId, { $inc: { postsCount: 1 } });
    }

    static async findById(postId) {
        // returns post by id

        const post = await postModel.findById(postId, { likes: 0 })

        if (post == null) {
            throw new AppError(AppErrorMessages.postDoesNotExist)
        }

        return postObjectFromDbObject(post)
    }


    static async _deletePhotos(photos, callback) {

        // param 2: callback which be called after every delete

        // Deletes the photos files
        return await Promise.all(
            photos.map(
                file =>
                    new Promise(async (res, rej) => {
                        const filePath = path.join(POSTS_PHOTOS_FOLDER, file)
                        fs.unlink(filePath, err => {
                            if (err) {
                                rej(`${filePath} post photo can't be deleted!`);
                            }
                            else {
                                callback(file)
                                res();
                            }
                        });
                    })
            )
        )

    }

    static async deleteById(postId) {
        // Deletes post by id

        // Deletes post photos
        const post = await this.findById(postId)

        try {
            await this._deletePhotos(post.photos, async (fileName) => {
                // Will avoid errors when in example the first photo has been deleted
                // but the second photo throw error, so on the on the next func call it will try to delete the first 
                // photo but it will throw an error because the first photo has been already deleted and it will create a loop 
                await postModel.findByIdAndUpdate(postId, { $pull: { photos: fileName } })
            })
        }
        catch (err) {
            throw err
        }

        // Deletes the post
        await postModel.findByIdAndDelete(postId)
        // Deletes the comments of this post
        await CommentsDB.deleteByPostId(postId)

        await userModel.findByIdAndUpdate(post.publisherId, { $inc: { postsCount: -1 } });

    }

    static async doesPostExist(postId) {
        // returns if post exists

        const post = await postModel.findById(postId, { likes: 0 })
        return post != null
    }

    static async deleteByPublisherId(userId) {
        // Deletes all posts of [userId]

        return await Promise.resolve(new Promise((res, rej) => {

            postModel.count({ publisherId: mongoose.Types.ObjectId(userId) }, async function (err, count) {

                if (err) {
                    rej("Cannot count the posts!");
                }

                for (let index = 0; index < count; index++) {
                    const post = postObjectFromDbObject(await postModel.findOne({}, { likes: 0 }))

                    try {
                        await PostsDB.deleteById(post.id)
                    }
                    catch (err) {
                        return rej(err)
                    }
                }

                res()
            })
        }))
    }


    static async findByPublisher(publisherId, startFromIndex, quantity) {
        /*
        Returns posts by publisher 
     
        param 1: publisher id
        param 2: from which post to start
        param 3: how much to return
        */

        const response = [];
        const posts = await postModel.aggregate([{ $match: { publisherId: publisherId } }, { $project: { likes: 0, } }]).skip(startFromIndex).limit(quantity)
        for (const post of posts) {
            response.push(postObjectFromDbObject(post))
        }

        return response
    }

    static async isLiked(postId, whoLikeId) {
        /*  
        Checks if post liked by someone
     
        param 1: the post id
        param 2: the liker id
        */

        const post = await postModel.findOne({ _id: mongoose.Types.ObjectId(postId), likes: { $in: [whoLikeId] } }, { comments: 0, likes: 0 })
        return post != null
    }

    static async likePost(postId, whoLikeId) {
        /*
        Adds like to the post [postId] by [whoLikeId]
     
        param 1: the post id
        param 2: the liker id
        */

        await postModel.findByIdAndUpdate(postId, { $addToSet: { likes: whoLikeId, }, $inc: { likesCount: 1 } })
    }

    static async unlikePost(postId, whoLikeId) {
        /*
        Unlikes the post [postId] by [whoLikeId]
     
        param 1: the post id
        param 2: the liker id
        */

        await postModel.findByIdAndUpdate(postId, { $pull: { likes: whoLikeId }, $inc: { likesCount: -1 } })
    }

}


function postObjectFromDbObject(dbObject) {
    // Returns post object from db post object

    return Object.freeze({
        id: dbObject._id.toString(),

        publisherId: dbObject.publisherId,
        taggedUsers: dbObject.taggedUsers,
        photos: dbObject.photos,
        publisherComment: dbObject.publisherComment,
        location: dbObject.location,

        comments: dbObject.commentsCount,
        likes: dbObject.likesCount,

        createdAt: dbObject.createdAt
    })
}

module.exports = { PostsDB }