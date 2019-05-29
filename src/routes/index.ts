export = (app: any) => {

    // Require the routes files in the routes directory
    require("./authRoutes")(app);
    require("./userRoutes")(app);

    app.get("/", (req: Request, res: any) => res.status(200).json({ message: "Hello world" }));

    // If no route is matched by now, it must be a 404
    app.use((req: any, res: any, next: any) => {
        res.status(404).json({ "error": "Endpoint not found" });
        next();
    });
};