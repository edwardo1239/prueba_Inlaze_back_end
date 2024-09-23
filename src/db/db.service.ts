import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as DBLocal from 'db-local';
import { randomUUID } from 'crypto';
import { hashSync } from 'bcrypt';

const dbLocal = DBLocal.default || DBLocal;
const { Schema } = dbLocal({ path: './db' });

const User = Schema('User', {
    _id: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true },
    favoritos: { type: [String] },
    eliminado: { type: Boolean },
    createdAt: { type: String, default: new Date().toISOString() },
    email: { type: String }
});

@Injectable()
export class DbService {
    private userCollection: any;

    constructor() {
        this.userCollection = User;
    }
    async createUser(userData: {
        username: string;
        password: string;
        email: string;
        favoritos?: string[]
    }) {
        const { username, password, email } = userData;

        // Validación simple antes de cualquier otra lógica
        if (typeof username !== 'string') {
            throw new HttpException('Username must be a string', HttpStatus.BAD_REQUEST);
        }
        if (typeof password !== 'string') {
            throw new HttpException('Password must be a string', HttpStatus.BAD_REQUEST);
        }

        try {

            const user = await this.userCollection.findOne({ username })
            if (user) throw new HttpException('Username already exists', HttpStatus.CONFLICT);

            const id = randomUUID();
            const hashPassword = hashSync(password, 10)

            const newUser = await this.userCollection.create({
                _id: id,
                username,
                password: hashPassword,
                email,
                eliminado: false
            })
            await newUser.save();

            return { message: 'User created successfully', userId: id };
        } catch (err) {
            // Manejo de errores inesperados
            if (err instanceof Error) {
                throw new HttpException('Internal server error ' + err.message, HttpStatus.INTERNAL_SERVER_ERROR);

            }
            throw new HttpException('Internal server error ', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
    async findUser(id: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }

        // Buscar el usuario
        const user = await this.userCollection.findOne({ _id: id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Retornar los datos del usuario (sin información sensible)
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findUserByUsername(username: string) {
        // Validación simple antes de cualquier otra lógica
        if (typeof username !== 'string') {
            throw new HttpException('Username must be a string', HttpStatus.BAD_REQUEST);
        }
        // Buscar el usuario
        const user = await this.userCollection.findOne({ username: username });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        // Retornar los datos del usuario (sin información sensible)
        return user;
    }
    async findAllUsers() {
        const users = await this.userCollection.find();

        const usersWithoutSensitiveData = users.map(
            ({ password, ...userWithoutPassword }) => userWithoutPassword);
        return usersWithoutSensitiveData;

    }
    async updateUser(id: string, userData: {
        email?: string;
        favoritos?: string[]
    }) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userCollection.findOne({ _id: id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        // Actualizar el usuario
        try {
            const newUser = await user.update(userData);
            await newUser.save()


            return { message: 'User updated successfully' };
        } catch (err) {
            if (err instanceof Error) {
                throw new HttpException('Internal server error: ' + err.message, HttpStatus.INTERNAL_SERVER_ERROR);

            }
            throw new HttpException('Internal server error: ', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
    async softDelete(id: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userCollection.findOne({ _id: id });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Actualizar el usuario
        try {
            const newUser = await user.update({ eliminado: true });
            await newUser.save()


            return { message: 'User delete successfully' };
        } catch (err) {
            if (err instanceof Error) {
                throw new HttpException('Internal server error: ' + err.message, HttpStatus.INTERNAL_SERVER_ERROR);

            }
            throw new HttpException('Internal server error: ', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
