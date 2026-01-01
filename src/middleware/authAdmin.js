import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id_admin: decoded.id_admin,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

export default authAdmin;
