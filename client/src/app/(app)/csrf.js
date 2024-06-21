import Tokens from 'csrf';

const tokens = new Tokens();

export default function handler(req, res) {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  res.status(200).json({ csrfToken: token });
}