var bcrypt = require('bcrypt')

async function genSalt(rounds=10) {
    var salt = undefined
    try {
        salt = await bcrypt.genSalt(rounds)
    } catch (err) {
        console.error('Error in utils.encrypt.genSalt')
        console.error(err)
    }
    return salt
}

async function hash(data, salt) {
    var hash = undefined
    try {
        hash = await bcrypt.hash(data, salt)
    } catch (err) {
        console.log(data, salt)
        console.error('Error in utils.encrypt.hash')
        console.error(err)
    }
    return hash
}

function compare(data, encrypted) {
    return bcrypt.compare(data, encrypted)
}

module.exports = {
    genSalt,
    hash,
    compare
}
