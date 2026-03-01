const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { email, password, full_name, role = 'user' } = req.body;

        // Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name, role }
            }
        });

        if (error) return res.status(400).json({ error: error.message });

        // Insert additional user info in public.users table
        const { error: dbError } = await supabase
            .from('users')
            .upsert({
                id: data.user.id,
                email,
                full_name,
                role
            });

        if (dbError) return res.status(500).json({ error: dbError.message });

        res.status(201).json({ message: 'User registered successfully', user: data.user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return res.status(401).json({ error: error.message });

        // Generate custom JWT (optional if using Supabase)
        // But the user requested JWT authentication for the REST API
        const token = jwt.sign(
            { id: data.user.id, email: data.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: data.user,
            session: data.session
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) return res.status(404).json({ error: 'User profile not found' });

        res.status(200).json({ user: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
