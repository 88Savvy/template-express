import express from "express";
import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import postModel from "../model/post.model.js";

const userRouter = express.Router();

// variáveis em MAISCULO são consideradas GERAIS
const SALT_ROUNDS = 10; // quão complexo queremos que o salt seja criado || maior o numero MAIOR a demora na criação da hash

userRouter.post("/signup", async (req, res) => {
  try {
    const form = req.body;

    console.log(form);

    if (!form.email || !form.password) {
      throw new Error("Por favor, envie um email e uma senha");
    }

    if (
      form.password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      ) === false
    ) {
      throw new Error(
        "A senha não preenche os requisitos básicos. 8 caracteres. Maiuscula e minuscula. Numeros e caracteres especiais."
      );
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(form.password, salt);

    const user = await UserModel.create({
      ...form,
      passwordHash: hashedPassword,
    });

    user.passwordHash = undefined;

    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email === 1) {
      // This error code (11000) indicates a duplicate key error for the email field
      return res.status(400).json({ message: 'Email address already exists.' });
    } else {
      console.log(error);
      return res.status(500).json(error);
    }
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const form = req.body;

    if (!form.email || !form.password) {
      throw new Error("Por favor, preencha todos os dados!");
    }

    // procuro o user pelo email dentro do banco de dados
    const user = await UserModel.findOne({ email: form.email });

    //compare() também retorna TRUE se for igual as senhas e retorna FALSE se a senha não foi igual!!
    if (await bcrypt.compare(form.password, user.passwordHash)) {
      //senhas iguais, pode fazer login

      //gerar um token
      const token = generateToken(user);

      user.passwordHash = undefined;

      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      //senhas diferentes, não pode fazer login
      throw new Error(
        "Email ou senha não são válidos. Por favor tenta novamente."
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
});

// Get all users
userRouter.get("/all", async (req, res) => {
  try {
    const users = await UserModel.find().select("-passwordHash");
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

userRouter.get("/profile", isAuth, async (req, res) => {
  try {
    const id_user = req.auth._id;

    const user = await UserModel.findById(id_user).select("-passwordHash");

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.put("/edit-profile", isAuth, async (req, res) => {
  try {
    const id_user = req.auth._id;
    const updatedData = req.body;

    // Update the user's profile in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      id_user,
      updatedData,
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    updatedUser.passwordHash = undefined; // Remove password hash from response
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

userRouter.delete("/delete-profile", isAuth, async (req, res) => {
  try {
    const id_user = req.auth._id;

    // Find the user by ID
    const user = await UserModel.findById(id_user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all of the user's posts
    // Assuming you have a "Content" model for posts
    await postModel.deleteMany({ author: id_user });

    // Delete the user's profile from the database
    const deletedUser = await UserModel.findByIdAndRemove(id_user);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User and posts deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
});

export default userRouter;
