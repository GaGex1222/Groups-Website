import { CredentialsSignin } from 'next-auth';

export class InvalidCredentialsError extends CredentialsSignin {}
export class UserNotFoundError extends CredentialsSignin {}