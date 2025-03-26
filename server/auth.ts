import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { User } from '@shared/schema';
import { storage } from './storage';

// Configure the local strategy for use by Passport
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Find the user by username
    const user = await storage.getUserByUsername(username);
    
    // If user not found
    if (!user) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Invalid username or password' });
    }
    
    // If credentials are valid, return the user object
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