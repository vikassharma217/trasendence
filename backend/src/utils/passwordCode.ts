import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
export function passwordEncode(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
}


export function passwordCompare(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
}