import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from "crypto";

interface LocalUser {
  id: string;
  email: string;
  password: string;
  username: string;
  avatarUrl: string | null;
}

interface LocalProfile {
  username: string | null;
  birthDate: string | null;
  age: number | null;
  gender: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class LocalAuthStore {
  private readonly usersByEmail = new Map<string, LocalUser>();
  private readonly usersByToken = new Map<string, LocalUser>();
  private readonly profiles = new Map<string, LocalProfile>();

  register(email: string, password: string, username: string) {
    const normalizedEmail = email.toLowerCase();
    const existing = this.usersByEmail.get(normalizedEmail);

    if (existing) {
      throw new BadRequestException("Пользователь с таким email уже существует");
    }

    const user: LocalUser = {
      id: randomUUID(),
      email: normalizedEmail,
      password,
      username,
      avatarUrl: null
    };

    this.usersByEmail.set(normalizedEmail, user);
    this.profiles.set(user.id, {
      username,
      birthDate: null,
      age: null,
      gender: null,
      avatarUrl: null
    });

    return this.createSession(user);
  }

  login(email: string, password: string) {
    const user = this.usersByEmail.get(email.toLowerCase());

    if (!user || user.password !== password) {
      throw new UnauthorizedException("Неверный email или пароль");
    }

    return this.createSession(user);
  }

  findByToken(token?: string) {
    if (!token) return null;
    return this.usersByToken.get(token) ?? null;
  }

  getProfile(userId: string) {
    return (
      this.profiles.get(userId) ?? {
        username: null,
        birthDate: null,
        age: null,
        gender: null,
        avatarUrl: null
      }
    );
  }

  updateProfile(userId: string, profile: LocalProfile) {
    this.profiles.set(userId, profile);
    const user = [...this.usersByEmail.values()].find((candidate) => candidate.id === userId);
    if (user) {
      user.username = profile.username ?? user.username;
      user.avatarUrl = profile.avatarUrl;
    }
    return profile;
  }

  private createSession(user: LocalUser) {
    const accessToken = randomUUID();
    const refreshToken = randomUUID();
    this.usersByToken.set(accessToken, user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }
}
