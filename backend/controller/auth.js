class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    signup = async (req, res) => {
        try {
            const result = await this.authService.signup(req.body);
            res.json({ status: true, data: result });
        } catch (err) {
            res.status(400).json({ status: false, message: err.message });
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json({ status: true, data: result });
        } catch (err) {
            res.status(400).json({ status: false, message: err.message });
        }
    };
}

module.exports = AuthController;
