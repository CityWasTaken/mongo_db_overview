import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;
const { hash, compare } = bcrypt;
const notesSchema = new Schema({
    text: {
        type: String,
        minLength: [3, 'Your notes must have at least 3 characters in length']
    }
});
const userSchema = new Schema({
    email: {
        type: String,
        // The unique rule only works when the first collection is created
        // You CANNOT create a custom error message with the array syntax on the -unique- rule
        unique: true,
        // Ensure the value is a valid email string
        match: [/.+@.+\..+/, "You must enter a valid email!"]
    },
    password: {
        type: String,
        minLength: [6, 'Your password must contain at least 6 characters']
    },
    // The notes property is going to be an array of note documents and the noteSchema describes what that note document looks like
    notes: [notesSchema]
}, {
    toJSON: {
        transform(_, user) {
            delete user.password;
            delete user.__v;
            return user;
        }
    }
});
// Encrypt the use'd password before the use is saved to the users collection
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isNew) {
        user.password = await hash(user.password, 10);
    }
    next();
});
// Setup a validation function that we can use to check that a user's password is valid(formPassword vs encrypted password)
userSchema.methods.validatePassword = async function (formPassword) {
    return await compare(formPassword, this.password);
};
const User = model('User', userSchema);
// const city = await User.create({
//     email: 'city@test.com',
//     password: 'pass123'
// });
// console.log(city);
export default User;
