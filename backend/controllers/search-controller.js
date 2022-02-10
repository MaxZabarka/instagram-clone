const search = async (req, res, next) => {
    const result = await (
        await db
            .collection("users")
            .find({ username: new RegExp(".*" + req.params.query + ".*") })
    ).limit(5).project({ username: 1, avatarUrl:1 }).toArray();
    res.send(result)
};
module.exports = { search };
