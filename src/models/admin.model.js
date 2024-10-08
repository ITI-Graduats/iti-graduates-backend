const { Schema, model, SchemaTypes } = require("mongoose");
const { hash } = require("bcrypt");

const adminSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Name is required"],
        },
        branch: {
            // type: SchemaTypes.ObjectId,
            // ref: "Branch",
            type: String,
            required: [
                function () {
                    return this.role == "admin";
                },
                "branch is required",
            ],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please fill with a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password should be at least 8 characters"],
        },
        role: {
            type: String,
            enum: ["super admin", "admin"],
            default: "admin",
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_, ret) {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.__v;
                delete ret.updatedAt;
                delete ret.createdAt;
            },
        },
    }
);

adminSchema.pre("save", async function () {
    if (this.isModified("password"))
        this.password = await hash(this.password, 10);
});

const Admin = model("Admin", adminSchema);

module.exports = Admin;
