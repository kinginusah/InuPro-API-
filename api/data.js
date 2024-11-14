import { Router } from 'express';
let router = Router();

let data = [
    { "id": "1", "Firstname": "Jyri", "Surname": "Kemppainen", "email": "jyri.kemppainen@karelia.fi" },
    { "id": "2", "Firstname": "Petri", "Surname": "Laitinen", "email": "petri.laitinen@karelia.fi" },
];

router.get('/', (req, res) => {
    res.json(data);
});

router.get('/:id', (req, res) => {
    const record = data.find(item => item.id === req.params.id);
    if (record) {
        res.json(record);
    } else {
        res.status(404).json({ "error": "Record not found" });
    }
});

router.post('/', (req, res) => {
    const { id, forename, surname, email } = req.body;
    if (!id || !forename || !surname || !email) {
        return res.status(400).json({ "error": "Missing required fields" });
    }

    if (data.find(item => item.id === id)) {
        return res.status(409).json({ "error": "Record already exists" });
    }

    const newRecord = { id, forename, surname, email };
    data.push(newRecord);
    res.status(201).json(newRecord);
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { forename, surname, email } = req.body;

    if (!forename || !surname || !email) {
        return res.status(400).json({ "error": "Missing required fields" });
    }

    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data[index] = { id, forename, surname, email };
        res.status(200).json(data[index]);
    } else {
        const newRecord = { id, forename, surname, email };
        data.push(newRecord);
        res.status(201).json(newRecord);
    }
});

router.delete('/:id', (req, res) => {
    const index = data.findIndex(item => item.id === req.params.id);
    if (index !== -1) {
        data.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ "error": "Record not found" });
    }
});

export default router;