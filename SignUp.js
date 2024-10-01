import React, {useState} from 'react';
import axios from 'axios';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/register', {username, password})
            .then(response => {
                console.log('User registered:', response.data);
            })
            .catch(error => {
                console.error('Error registering user:', error);
            });

        };
        return (
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
        );
}

export default SignUp;