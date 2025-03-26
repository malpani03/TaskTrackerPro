import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { storage } from './storage';
import type { User } from '@shared/schema';

// Configure Passport to use local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Find the user by username
    const user = await storage.getUserByUsername(username);
    
    // If user doesn't exist, return error
    if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    
    // If all is well, return the user
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serialize user to session
passport.serializeUser((user: Express.User, done) => {
  const userObj = user as User;
  done(null, userObj.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;