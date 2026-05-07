const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminExists = await User.findOne({ phoneNumber: '0000000000' });
        if (adminExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        await User.create({
            fullName: 'Master Admin',
            phoneNumber: '0000000000',
            password: 'admin123',
            role: 'admin'
        });

        console.log('✅ SUPER ADMIN CREATED SUCCESSFULLY!');
        console.log('Phone: 0000000000');
        console.log('Pass: admin123');
        
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
