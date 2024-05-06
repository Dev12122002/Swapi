import { SignJWT, jwtVerify } from 'jose';

export const verifyJWT = async (jwtToken) => {
    if (!jwtToken) return { data: '' };
    // console.log('Verifying JWT:', jwtToken);
    try {
        const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
        const { payload } = await jwtVerify(jwtToken, secret);
        // console.log('Verified payload:', payload);
        return payload;
    } catch (error) {
        console.error('Error verifying JWT:', error.message);
        return { data: '' };
    }
};


export const generateJWT = async (duration, data) => {
    try {
        const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);
        const alg = 'HS256';

        const payload = {
            data,
            'urn:example:claim': true,
        };

        const jwt = await new SignJWT(payload)
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime(duration)
            .sign(secret);

        return jwt;

    } catch (error) {
        console.error('Error generating JWT:', error.message);
    }
};