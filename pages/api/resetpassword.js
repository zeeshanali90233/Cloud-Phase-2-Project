import admin from "../../src/Firebase/configSDK"

const handler = async function (req, res) {
    const { email } = req.body;
    try {
      // Generate a password reset link
      const link = await admin.auth().generatePasswordResetLink(email);
      res.status(200).json({link:link });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
};

export default handler;
