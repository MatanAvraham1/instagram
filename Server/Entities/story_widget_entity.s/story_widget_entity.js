function buildMakeStoryWidget({ Id, TextChecker, AppError, AppErrorMessages }) {
    return async function makeStoryWidget({ name, description }) {

        if (!TextChecker.isValid(name)) {
            throw new AppError(AppErrorMessages.invalidWidgetName)
        }

        if (!TextChecker.isValid(description)) {
            throw new AppError(AppErrorMessages.invalidWidgetDescription)
        }

        return Object.freeze({
            id: Id.generate(),

            name: name,
            description: description,

            createdAt: Date.now(),
        })

    }
}

module.exports = { buildMakeStoryWidget }