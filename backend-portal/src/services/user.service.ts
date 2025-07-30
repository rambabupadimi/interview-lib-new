import bcrypt from 'bcrypt';
import { UserRepository, User } from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../utils/jwt.utils';

export class UserService {
  static async signup(name: string, email: string, password: string, role: string): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Get role ID
    const roleRecord = await UserRepository.getRoleByName(role);
    if (!roleRecord) {
      throw new Error('Invalid role');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      status: 'active' as const,
      role_id: roleRecord.id
    };

    const newUser = await UserRepository.createUser(userData);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async login(email: string, password: string): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Account is deactivated');
    }

    // Get role name
    const roleRecord = await UserRepository.getRoleById(user.role_id);
    if (!roleRecord) {
      throw new Error('Invalid user role');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id!,
      email: user.email,
      role: roleRecord.name
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }
} 