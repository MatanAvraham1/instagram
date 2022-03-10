const userModule = require('../models/user_model')
const postModule = require('../models/post_model')
const storyModule = require('../models/story_model')
const commentModule = require('../models/comment_model')
const faker = require('faker');
const Jetty = require("jetty");

require('dotenv').config()
const mongoose = require('mongoose')


// Connects to the database
mongoose.connect(process.env.DATABASE_URL).then((result) => { console.log("Connected to db!") }).catch((err) => {
    console.log(err)
})

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function updateScreen(generatedUsers = 0, usersToGenerate = 0, generatedPosts = 0, generatedStories = 0, likedPosts = 0, likedComments = 0, generatedComments = 0) {
    // jetty.clear()
    // jetty.moveTo([0, 0]);
    // jetty.text(`Generated Users : ${generatedUsers}/${usersToGenerate}\nGenerated Posts : ${generatedPosts}\nGenerated Stories : ${generatedStories}\nFollowed Users : ${followedUsers}\nLiked Posts : ${likedPosts}\nGenerated Comments : ${generatedComments}\nLiked Comments : ${likedComments}\n`)
}

let generatedUsers = 0;
let generatedPosts = 0;
let generatedStories = 0;
let generatedComments = 0;
let likedPosts = 0;
let likedComments = 0;
let followedUsers = 0;



async function generateUsers(howMuch) {
    for (let i = 0; i < howMuch; i++) {

        const userProfileUrl = faker.image.people();
        const fullName = faker.name.findName()
        const username = faker.internet.userName()
        const password = faker.internet.password()
        const bio = faker.lorem.sentence()

        try {
            const id = await userModule.createUser({
                username: username,
                password: password,
            })

            const details = {
                fullname: fullName,
                bio: bio,
                isPrivate: randomIntFromInterval(0, 6) === 2,
                photoUrl: userProfileUrl,
            }

            await userModule.updateUser(id, details)
            generatedUsers++
        }
        catch (err) {
            if (err !== userModule.userErrors.usernameAlreadyUsedError) {
                throw err
            }
        }
    }
}

async function generatePosts(maxPostsPerUser = 300, maxPhotosPerPosts = 10) {
    const users = await userModule.userModel.find({})
    for (const user of users) {
        for (let j = 0; j < randomIntFromInterval(0, maxPostsPerUser); j++) {
            const publisherComment = faker.lorem.sentence()
            const location = faker.address.streetAddress()
            const date = faker.date.between('1-1-2010', (new Date()).toString())
            const postImagesUrl = []

            for (let k = 0; k < randomIntFromInterval(1, maxPhotosPerPosts); k++) {
                postImagesUrl.push(faker.random.image())
            }

            await postModule.addPost({
                owners: [user._id.toString()],
                publisherComment: publisherComment,
                location: location,
                photosUrls: postImagesUrl,
                publishedAt: date,
            })

            generatedPosts++
        }
    }
}

async function generateStories(maxStoriesPerUser = 25) {

    const users = await userModule.userModel.find({})
    for (const user of users) {
        for (let l = 0; l < randomIntFromInterval(0, maxStoriesPerUser); l++) {
            const date = faker.date.between('1-1-2010', (new Date()).toString())
            const photoUrl = faker.random.image()

            storyModule.addStory({
                owner: user._id.toString(),
                photoUrl: photoUrl,
                publishedAt: date,
            })

            generatedStories++
        }
    }
}

async function followUsers() {
    let users = await userModule.userModel.find({})
    for (const user of users) {
        for (const someUser of users) {
            if (randomIntFromInterval(0, 10) !== 5) {
                try {
                    await userModule.followUser(user._id.toString(), someUser._id.toString())
                    followedUsers++
                }
                catch (err) {
                    if (err !== userModule.userErrors.cantFollowHimself && err !== userModule.userErrors.followRequestAlreadySentError && err !== userModule.userErrors.alreadyFollowedError) {
                        throw err
                    }
                }
            }

        }
    }
}

async function likePosts() {

    let users = await userModule.userModel.find({})
    for (const user of users) {
        for (const someUser of await userModule.getFollowings(user._id.toString(), 0, 30)) {
            for (const post of await postModule.getPosts(someUser._id.toString(), 0, 30)) {
                if (randomIntFromInterval(0, 10) !== 5) {
                    try {
                        await postModule.likePost(post._id.toString(), user._id.toString())
                        likedPosts++
                    }
                    catch (err) {
                        if (err !== postModule.postErrors.alreadyLikedError) {
                            throw err
                        }
                    }
                }
            }
        }
    }
}

async function commentPosts() {

    let users = await userModule.userModel.find({})
    for (const user of users) {
        for (const someUserId of await userModule.getFollowings(user._id.toString(), 0, 30)) {
            for (const post of await postModule.getPosts(someUserId._id.toString(), 0, 30)) {
                if (randomIntFromInterval(0, 10) !== 5) {
                    try {
                        await commentModule.addComment({
                            postId: post._id.toString(),
                            comment: faker.lorem.sentence(),
                            publisherId: user._id.toString(),
                            publishedAt: faker.date.between(post.publishedAt, (new Date()))
                        })
                        generatedComments++
                    }
                    catch (err) {
                        if (err !== postModule.postErrors.alreadyLikedError) {
                            throw err
                        }
                    }
                }
            }
        }
    }
}

async function likeComments() {
    let users = await userModule.userModel.find({})
    for (const user of users) {
        for (const someUser of await userModule.getFollowings(user._id.toString(), 0, 30)) {
            for (const post of await postModule.getPosts(someUser._id.toString(), 0, 30)) {


                if (randomIntFromInterval(0, 10) !== 5) {
                    for (const comment of await commentModule.getComments(post._id.toString(), 0, 30)) {
                        if (randomIntFromInterval(0, 10) !== 5) {
                            try {
                                await commentModule.likeComment(comment._id.toString(), user._id.toString())
                                likedComments++
                            }
                            catch (err) {
                                if (err !== postModule.postErrors.alreadyLikedError) {
                                    throw err
                                }
                            }
                        }

                    }
                }
            }
        }
    }
}

setTimeout(async () => {
    const howMuchUsersToGenerate = 10
    await generateUsers(howMuchUsersToGenerate)
    await generatePosts()
    await generateStories()


    await followUsers()
    await likePosts()
    await commentPosts()
    await likeComments()


    console.log(`Generated Users : ${generatedUsers}/${howMuchUsersToGenerate}\nGenerated Posts : ${generatedPosts}\nGenerated Stories : ${generatedStories}\nFollowed Users : ${followedUsers}\nLiked Posts : ${likedPosts}\nGenerated Comments : ${generatedComments}\nLiked Comments : ${likedComments}\n`)
}, 0);


