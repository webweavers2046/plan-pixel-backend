const workspaces = async (req, res, workspace) => {
    try {
        const workspaces = await workspace.find({}, { _id: 0, title: 1 }).toArray();
        res.send(workspaces);
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = workspaces;
