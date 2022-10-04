import { User, Book } from "../models"
import { AuthenticationError } from "apollo-server-express"
import { signToken } from '../utils/auth.js'

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userInfo = await User.FindOne({ _id: context.user._id }).select("-__v -password");
                return userInfo;
            }
            throw new AuthenticationError('This user is not logged in')
        }, 
    
    },
    Mutation: {
        newUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(userNew);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Cannot find this user's email")
            }
            const pw = await user.isCorrectPassword(password)
            if (!pw) {
                throw new AuthenticationError("Password does not match to this user")
            }
            const token = signToken(user);
            return { token, user};
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const userUpdate = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args.input } },
                    { new: true}
                );
                return userUpdate;
            }
            throw new AuthenticationError("You must be logged in to save books")
        },
        removeBook: async (parent, args, context) => {
            if(context.user) {
            const userUpdate = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId}}},
                { new: true}
            );
            return userUpdate;
            }
            throw new AuthenticationError("You must be logged in to remove books")
        }
    }
};

module.exports = resolvers;

